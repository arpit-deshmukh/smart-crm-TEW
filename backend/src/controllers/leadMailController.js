const axios = require("axios");
const Lead = require("../models/Lead");
const EmailTemplate = require("../models/EmailTemplate");
const logActivity = require("../utils/logActivity");

const sendBulkLeadMail = async (req, res) => {
  try {
    const { leadIds, targetStatus, templateId } = req.body;

    console.log("STEP 1: Request received");
    console.log({ leadIds, targetStatus, templateId });

    if (!Array.isArray(leadIds) || leadIds.length === 0) {
      return res.status(400).json({
        message: "Lead IDs are required",
      });
    }

    if (!targetStatus || !templateId) {
      return res.status(400).json({
        message: "Target status and template are required",
      });
    }

    const template = await EmailTemplate.findById(templateId);

    console.log("STEP 2: Template fetched");
    console.log(template);

    if (!template) {
      return res.status(404).json({
        message: "Email template not found",
      });
    }

    let query = { _id: { $in: leadIds }, status: targetStatus };

    if (req.session.user.role !== "admin") {
      query.createdBy = req.session.user.id;
    }

    console.log("STEP 3: Lead query");
    console.log(query);

    const leads = await Lead.find(query);

    console.log("STEP 4: Leads fetched");
    console.log("Lead count:", leads.length);

    if (leads.length === 0) {
      return res.status(400).json({
        message: `No leads found on this page with status "${targetStatus}"`,
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
      leads: leads.map((lead) => ({
        id: lead._id,
        title: lead.title,
        name: lead.name,
        company: lead.company,
        designation: lead.designation,
        email: lead.email,
        contact: lead.contact,
        status: lead.status,
        source: lead.source,
        sourceDetails: lead.sourceDetails || "",
        value: lead.value || 0,
      })),
      meta: {
        targetStatus,
        requestedBy: req.session.user.id,
      },
    };

    const webhookUrl = process.env.N8N_LEAD_MAIL_WEBHOOK_URL;

    console.log("STEP 5: Webhook URL");
    console.log(webhookUrl);

    if (!webhookUrl) {
      return res.status(500).json({
        message: "n8n webhook URL is not configured",
      });
    }

    console.log("STEP 6: Sending payload to n8n");
    const response = await axios.post(webhookUrl, payload);

    console.log("STEP 7: n8n response received");
    console.log("Status:", response.status);
    console.log("Data:", response.data);

    await Lead.updateMany(
      { _id: { $in: leads.map((lead) => lead._id) } },
      { $set: { status: "contacted" } }
    );

    console.log("STEP 8: Lead statuses updated");

    return res.status(200).json({
      message: `${leads.length} lead emails sent successfully`,
      updatedCount: leads.length,
    });

    await logActivity({
      user: req.session.user,
      action: "Sent Email",
      module: "Lead Mail",
      details: `${leads.length} lead emails sent`,
    });
    
  } catch (error) {
    console.log("STEP ERROR:");
    console.log("Message:", error.message);

    if (error.response) {
      console.log("n8n error status:", error.response.status);
      console.log("n8n error data:", error.response.data);
    }

    if (error.request) {
      console.log("No response received from n8n");
    }

    return res.status(500).json({
      message: "Error sending lead emails",
      error: error.message,
    });
  }
};

module.exports = {
  sendBulkLeadMail,
};