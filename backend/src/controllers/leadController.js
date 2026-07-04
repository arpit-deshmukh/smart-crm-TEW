const Lead = require("../models/Lead");
const logActivity = require("../utils/logActivity");

const createLead = async (req, res) => {
  try {
    const {
      title,
      name,
      company,
      designation,
      email,
      contact,
      status,
      source,
      sourceDetails,
      value,
    } = req.body;

    if (!title || !name || !company || !email) {
      return res.status(400).json({
        success: false,
        message: "Title, name, company and email are required",
      });
    }

    const lead = await Lead.create({
      title,
      name,
      company,
      designation,
      email,
      contact,
      status,
      source,
      sourceDetails: source === "manual" ? "" : sourceDetails || "",
      value,
      createdBy: req.session.user.id,
      assignedTo: req.session.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: lead,
    });

    await logActivity({
      user: req.session.user,
      action: "Created",
      module: "Lead",
      details: `Lead created: ${lead.title}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating lead",
    });
  }
};

const getAllLeads = async (req, res) => {
  try {
    let leads;

    if (req.session.user.role === "admin") {
      leads = await Lead.find()
        .populate("createdBy", "name email role")
        .populate("assignedTo", "name email role")
        .sort({ createdAt: -1 });
    } else {
      leads = await Lead.find({ createdBy: req.session.user.id })
        .populate("createdBy", "name email role")
        .populate("assignedTo", "name email role")
        .sort({ createdAt: -1 });
    }

    res.status(200).json({ success: true, data: leads });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching leads",
    });
  }
};

const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching lead",
    });
  }
};

const updateLead = async (req, res) => {
  try {
    const {
      title,
      name,
      company,
      designation,
      email,
      contact,
      status,
      source,
      sourceDetails,
      value,
    } = req.body;

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    if (
      req.session.user.role !== "admin" &&
      lead.createdBy.toString() !== req.session.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to edit this lead",
      });
    }

    lead.title = title ?? lead.title;
    lead.name = name ?? lead.name;
    lead.company = company ?? lead.company;
    lead.designation = designation ?? lead.designation;
    lead.email = email ?? lead.email;
    lead.contact = contact ?? lead.contact;
    lead.status = status ?? lead.status;
    lead.source = source ?? lead.source;
    lead.sourceDetails =
      source === "manual" ? "" : sourceDetails ?? lead.sourceDetails;
    lead.value = value ?? lead.value;

    const updatedLead = await lead.save();

    res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      data: updatedLead,
    });

    await logActivity({
      user: req.session.user,
      action: "Updated",
      module: "Lead",
      details: `Lead updated: ${updatedLead.title}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating lead",
    });
  }
};

const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    if (
      req.session.user.role !== "admin" &&
      lead.createdBy.toString() !== req.session.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this lead",
      });
    }

    await Lead.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });

    await logActivity({
      user: req.session.user,
      action: "Deleted",
      module: "Lead",
      details: `Lead deleted: ${lead.title}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting lead",
    });
  }
};

module.exports = {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
};