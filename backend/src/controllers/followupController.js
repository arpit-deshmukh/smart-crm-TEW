const Followup = require("../models/Followup");
const Lead = require("../models/Lead");
const logActivity = require("../utils/logActivity");

const createFollowup = async (req, res) => {
  try {
    const {
      title,
      relatedTo,
      leadId,
      dealId,
      contactName,
      company,
      email,
      phone,
      followupDate,
      status,
      priority,
      notes,
    } = req.body;

    if (!title || !followupDate) {
      return res.status(400).json({
        success: false,
        message: "Title and followup date are required",
      });
    }

    const followup = await Followup.create({
      title,
      relatedTo,
      leadId: leadId || null,
      dealId: dealId || null,
      contactName,
      company,
      email,
      phone,
      followupDate,
      status,
      priority,
      notes,
      createdBy: req.session.user.id,
      assignedTo: req.session.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Followup created successfully",
      data: followup,
    });

    await logActivity({
      user: req.session.user,
      action: "Created",
      module: "Followup",
      details: `Followup created: ${followup.title}`,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating followup",
    });
  }
};

const getAllFollowups = async (req, res) => {
  try {
    let followups;

    if (req.session.user.role === "admin") {
      followups = await Followup.find()
        .populate("createdBy", "name email role")
        .populate("assignedTo", "name email role")
        .populate("leadId", "title name company")
        .populate("dealId", "title company contactPerson")
        .sort({ followupDate: 1 });
    } else {
      followups = await Followup.find({ createdBy: req.session.user.id })
        .populate("createdBy", "name email role")
        .populate("assignedTo", "name email role")
        .populate("leadId", "title name company")
        .populate("dealId", "title company contactPerson")
        .sort({ followupDate: 1 });
    }

    res.status(200).json({ success: true, data: followups });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching followups",
    });
  }
};

const getFollowupById = async (req, res) => {
  try {
    const followup = await Followup.findById(req.params.id)
      .populate("leadId", "title name company")
      .populate("dealId", "title company contactPerson");

    if (!followup) {
      return res.status(404).json({
        success: false,
        message: "Followup not found",
      });
    }

    res.status(200).json({ success: true, data: followup });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching followup",
    });
  }
};

const updateFollowup = async (req, res) => {
  try {
    const followup = await Followup.findById(req.params.id);

    if (!followup) {
      return res.status(404).json({
        success: false,
        message: "Followup not found",
      });
    }

    if (
      req.session.user.role !== "admin" &&
      followup.createdBy.toString() !== req.session.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to edit this followup",
      });
    }

    const updatedFollowup = await Followup.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("leadId", "title name company")
      .populate("dealId", "title company contactPerson");

    res.status(200).json({
      success: true,
      message: "Followup updated successfully",
      data: updatedFollowup,
    });

    await logActivity({
      user: req.session.user,
      action: "Updated",
      module: "Followup",
      details: `Followup updated: ${updatedFollowup.title}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating followup",
    });
  }
};

const deleteFollowup = async (req, res) => {
  try {
    const followup = await Followup.findById(req.params.id);

    if (!followup) {
      return res.status(404).json({
        success: false,
        message: "Followup not found",
      });
    }

    if (
      req.session.user.role !== "admin" &&
      followup.createdBy.toString() !== req.session.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this followup",
      });
    }

    await Followup.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Followup deleted successfully",
    });
    
    await logActivity({
      user: req.session.user,
      action: "Deleted",
      module: "Followup",
      details: `Followup deleted: ${followup.title}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting followup",
    });
  }
};

// ...keep your existing functions above

const convertLeadToFollowup = async (req, res) => {
  try {
    const {
      leadId,
      title,
      followupDate,
      priority,
      notes,
    } = req.body;

    if (!leadId) {
      return res.status(400).json({
        success: false,
        message: "Lead ID is required",
      });
    }

    const lead = await Lead.findById(leadId);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    const followup = await Followup.create({
      // FIX: Prioritize lead.title directly so it matches the Lead table exactly
      title: title || lead.title || lead.name || "Untitled Followup",
      relatedTo: "lead",
      leadId: lead._id,
      contactName: lead.name || "",
      company: lead.company || "",
      email: lead.email || "",
      phone: lead.contact || "",
      followupDate: followupDate || new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: "pending",
      priority: priority || "medium",
      notes: notes || `Converted from lead: ${lead.title || ""}`,
      createdBy: req.session.user.id,
      assignedTo: req.session.user.id,
    });

    await Lead.findByIdAndUpdate(leadId, {
      status: "qualified",
    });

    res.status(201).json({
      success: true,
      message: "Lead converted to followup successfully",
      data: followup,
    });

    await logActivity({
      user: req.session.user,
      action: "Converted",
      module: "Followup",
      details: `Lead converted to followup: ${lead.title}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error converting lead to followup",
    });
  }
};

module.exports = {
  createFollowup,
  getAllFollowups,
  getFollowupById,
  updateFollowup,
  deleteFollowup,
  convertLeadToFollowup,
};