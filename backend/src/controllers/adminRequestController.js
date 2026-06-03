const User = require("../models/User");
const logActivity = require("../utils/logActivity");
const Mailjet = require("node-mailjet");

const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_SECRET_KEY
);

// Common background handler
const handleSideEffects = async (user, action, req, subject, htmlContent) => {
  try {
    if (user.email) {
      console.log("📧 Sending email to:", user.email);

      const response = await mailjet
        .post("send", { version: "v3.1" })
        .request({
          Messages: [
            {
              From: {
                Email: process.env.MAILJET_SENDER_EMAIL, // ✅ MUST BE VERIFIED
                Name: "TEW",
              },
              To: [
                {
                  Email: user.email,
                  Name: user.name,
                },
              ],
              Subject: subject,
              HTMLPart: htmlContent,
            },
          ],
        });

      console.log("✅ Email sent:", response.body);
    }
  } catch (err) {
    console.error("❌ Email failed:", err.message);
  }

  try {
    await logActivity({
      user: req.session?.user || "System",
      action,
      module: "Request",
      details: `${action} account request for ${user.email}`,
    });
  } catch (err) {
    console.error("❌ Log failed:", err);
  }
};

// HTML Templates
const approvedTemplate = (name) => `
  <div style="font-family: Arial; padding: 20px;">
    <h2 style="color: green;">✅ Account Approved</h2>
    <p>Hello <b>${name}</b>,</p>
    <p>Your account request has been approved.</p>
    <p>You can now login and start using the system.</p>
  </div>
`;

const deniedTemplate = (name) => `
  <div style="font-family: Arial; padding: 20px;">
    <h2 style="color: red;">❌ Request Denied</h2>
    <p>Hello <b>${name}</b>,</p>
    <p>Your account request has been denied by admin.</p>
    <p>If you think this is a mistake, please contact support.</p>
  </div>
`;

// Get Pending Requests
const getPendingRequests = async (req, res) => {
  try {
    const users = await User.find({
      approvalStatus: "pending",
      role: "user",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching requests",
      error: error.message,
    });
  }
};

// Approve Request
const approveRequest = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.approvalStatus !== "pending") {
      return res.status(400).json({
        message: "Request already processed",
      });
    }

    user.approvalStatus = "accepted";
    user.approvalMessage = "Your account request has been approved";
    await user.save();

    await handleSideEffects(
      user,
      "Approved",
      req,
      "Account Approved",
      approvedTemplate(user.name)
    );

    res.status(200).json({ message: "Request approved successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error approving request",
      error: error.message,
    });
  }
};

// Deny Request
const denyRequest = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.approvalStatus !== "pending") {
      return res.status(400).json({
        message: "Request already processed",
      });
    }

    // ✅ Delete user instead of updating status
    await User.findByIdAndDelete(req.params.id);

      await handleSideEffects(
        user,
        "Denied",
        req,
        "Account Request Denied",
        deniedTemplate(user.name)
      );

      res.status(200).json({ message: "Request denied and user deleted" });

  } catch (error) {
    res.status(500).json({
      message: "Error denying request",
      error: error.message,
    });
  }
};

module.exports = {
  getPendingRequests,
  approveRequest,
  denyRequest,
};