const axios = require("axios");
const Followup = require("../models/Followup");
const EmailTemplate = require("../models/EmailTemplate");
const logActivity = require("../utils/logActivity");

const sendBulkFollowupMail = async (req, res) => {
  try {
    const { followupIds, targetStatus, templateId } = req.body;

    console.log("FOLLOWUP MAIL STEP 1: Request received");
    console.log({ followupIds, targetStatus, templateId });

    if (!Array.isArray(followupIds) || followupIds.length === 0) {
      return res.status(400).json({
        message: "Followup IDs are required",
      });
    }

    if (!targetStatus || !templateId) {
      return res.status(400).json({
        message: "Target status and template are required",
      });
    }

    const template = await EmailTemplate.findById(templateId);

    console.log("FOLLOWUP MAIL STEP 2: Template fetched");
    console.log(template);

    if (!template) {
      return res.status(404).json({
        message: "Email template not found",
      });
    }

    let query = {
      _id: { $in: followupIds },
      status: targetStatus,
    };

    if (req.session.user.role !== "admin") {
      query.createdBy = req.session.user.id;
    }

    console.log("FOLLOWUP MAIL STEP 3: Followup query");
    console.log(query);

    const followups = await Followup.find(query);

    console.log("FOLLOWUP MAIL STEP 4: Followups fetched");
    console.log("Followup count:", followups.length);

    if (followups.length === 0) {
      return res.status(400).json({
        message: `No followups found on this page with status "${targetStatus}"`,
      });
    }

    const payload = {
      template: {
        id: template._id,
        title: template.title,
        subject: template.subject,
        body: template.body,
        category: template.category,
      },
      followups: followups.map((followup) => ({
        id: followup._id,
        title: followup.title,
        relatedTo: followup.relatedTo,
        contactName: followup.contactName,
        company: followup.company,
        email: followup.email,
        phone: followup.phone,
        followupDate: followup.followupDate,
        status: followup.status,
        priority: followup.priority,
        notes: followup.notes || "",
      })),
      meta: {
        targetStatus,
        requestedBy: req.session.user.id,
      },
    };

    const webhookUrl = process.env.N8N_FOLLOWUP_MAIL_WEBHOOK_URL;

    console.log("FOLLOWUP MAIL STEP 5: Webhook URL");
    console.log(webhookUrl);

    if (!webhookUrl) {
      return res.status(500).json({
        message: "n8n followup webhook URL is not configured",
      });
    }

    console.log("FOLLOWUP MAIL STEP 6: Sending payload to n8n");
    const response = await axios.post(webhookUrl, payload);

    console.log("FOLLOWUP MAIL STEP 7: n8n response received");
    console.log("Status:", response.status);
    console.log("Data:", response.data);

    await Followup.updateMany(
      { _id: { $in: followups.map((followup) => followup._id) } },
      { $set: { status: "completed" } }
    );

    console.log("FOLLOWUP MAIL STEP 8: Followup statuses updated");

    return res.status(200).json({
      message: `${followups.length} followup emails sent successfully`,
      updatedCount: followups.length,
    });

    await logActivity({
      user: req.session.user,
      action: "Sent Email",
      module: "Followup Mail",
      details: `${followups.length} followup emails sent`,
    });

  } catch (error) {
    console.log("FOLLOWUP MAIL STEP ERROR:");
    console.log("Message:", error.message);

    if (error.response) {
      console.log("n8n error status:", error.response.status);
      console.log("n8n error data:", error.response.data);
    }

    if (error.request) {
      console.log("No response received from n8n");
    }

    return res.status(500).json({
      message: "Error sending followup emails",
      error: error.message,
    });
  }
};

module.exports = {
  sendBulkFollowupMail,
};