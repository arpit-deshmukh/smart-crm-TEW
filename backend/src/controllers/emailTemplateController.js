const EmailTemplate = require("../models/EmailTemplate");
const logActivity = require("../utils/logActivity");

const createEmailTemplate = async (req, res) => {
  try {
    const { title, subject, category, body } = req.body;

    if (!title || !subject || !body) {
      return res.status(400).json({
        message: "Title, subject and body are required",
      });
    }

    const template = await EmailTemplate.create({
      title,
      subject,
      category,
      body,
      createdBy: req.session.user.id,
      assignedTo: req.session.user.id,
    });

    res.status(201).json({
      message: "Email template created successfully",
      template,
    });

    await logActivity({
      user: req.session.user,
      action: "Created",
      module: "Email Template",
      details: `Template created: ${template.title}`,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating email template",
      error: error.message,
    });
  }
};

const getAllEmailTemplates = async (req, res) => {
  try {
    let templates;

    if (req.session.user.role === "admin") {
      templates = await EmailTemplate.find()
        .populate("createdBy", "name email role")
        .populate("assignedTo", "name email role")
        .sort({ createdAt: -1 });
    } else {
      templates = await EmailTemplate.find({ createdBy: req.session.user.id })
        .populate("createdBy", "name email role")
        .populate("assignedTo", "name email role")
        .sort({ createdAt: -1 });
    }

    res.status(200).json(templates);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching email templates",
      error: error.message,
    });
  }
};

const getEmailTemplateById = async (req, res) => {
  try {
    const template = await EmailTemplate.findById(req.params.id);

    if (!template) {
      return res.status(404).json({
        message: "Email template not found",
      });
    }

    res.status(200).json(template);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching email template",
      error: error.message,
    });
  }
};

const updateEmailTemplate = async (req, res) => {
  try {
    const template = await EmailTemplate.findById(req.params.id);

    if (!template) {
      return res.status(404).json({
        message: "Email template not found",
      });
    }

    if (
      req.session.user.role !== "admin" &&
      template.createdBy.toString() !== req.session.user.id
    ) {
      return res.status(403).json({
        message: "You are not allowed to edit this email template",
      });
    }

    const updatedTemplate = await EmailTemplate.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      message: "Email template updated successfully",
      template: updatedTemplate,
    });

    await logActivity({
      user: req.session.user,
      action: "Updated",
      module: "Email Template",
      details: `Template updated: ${updatedTemplate.title}`,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating email template",
      error: error.message,
    });
  }
};

const deleteEmailTemplate = async (req, res) => {
  try {
    const template = await EmailTemplate.findById(req.params.id);

    if (!template) {
      return res.status(404).json({
        message: "Email template not found",
      });
    }

    if (
      req.session.user.role !== "admin" &&
      template.createdBy.toString() !== req.session.user.id
    ) {
      return res.status(403).json({
        message: "You are not allowed to delete this email template",
      });
    }

    await EmailTemplate.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Email template deleted successfully",
    });

    await logActivity({
      user: req.session.user,
      action: "Deleted",
      module: "Email Template",
      details: `Template deleted: ${template.title}`,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting email template",
      error: error.message,
    });
  }
};

module.exports = {
  createEmailTemplate,
  getAllEmailTemplates,
  getEmailTemplateById,
  updateEmailTemplate,
  deleteEmailTemplate,
};