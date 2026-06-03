const Deal = require("../models/Deal");
const Lead = require("../models/Lead");
const logActivity = require("../utils/logActivity");

const createDeal = async (req, res) => {
  try {
    let {
      leadId,
      title,
      company,
      contactPerson,
      email,
      amount,
      revisedAmount,
      stage,
      expectedCloseDate,
      notes,
    } = req.body;

    title = title?.trim();
    company = company?.trim();
    contactPerson = contactPerson?.trim();
    email = email?.trim().toLowerCase();
    notes = notes?.trim() || "";

    if (!title || !company || !contactPerson || !email) {
      return res.status(400).json({
        message: "Title, company, contact person and email are required",
      });
    }

    if (leadId === "") {
      leadId = null;
    }

    if (leadId) {
      const existingDeal = await Deal.findOne({ leadId });
      if (existingDeal) {
        return res.status(400).json({
          message: "This lead is already converted into a deal",
        });
      }
    }

    const deal = await Deal.create({
      leadId: leadId || null,
      title,
      company,
      contactPerson,
      email,
      amount: Number(amount) || 0,
      revisedAmount: Number(revisedAmount) || 0,
      stage: stage || "new",
      expectedCloseDate: expectedCloseDate || null,
      notes,
      createdBy: req.session.user.id,
      assignedTo: req.session.user.id,
    });

    if (leadId) {
      await Lead.findByIdAndUpdate(leadId, { status: "converted" });
    }

    return res.status(201).json({
      message: "Deal created successfully",
      deal,
    });

    
    await logActivity({
      user: req.session.user,
      action: "Created",
      module: "Deal",
      details: `Deal created: ${deal.title}`,
    });

  } catch (error) {
    console.log("CREATE DEAL ERROR:", error);

    return res.status(500).json({
      message: "Error creating deal",
      error: error.message,
    });
  }
  
};


const getAllDeals = async (req, res) => {
  try {
    let deals;

    if (req.session.user.role === "admin") {
      deals = await Deal.find()
        .populate("createdBy", "name email role")
        .populate("assignedTo", "name email role")
        .populate("leadId", "title name company email status")
        .sort({ createdAt: -1 });
    } else {
      deals = await Deal.find({ createdBy: req.session.user.id })
        .populate("createdBy", "name email role")
        .populate("assignedTo", "name email role")
        .populate("leadId", "title name company email status")
        .sort({ createdAt: -1 });
    }

    res.status(200).json(deals);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching deals",
      error: error.message,
    });
  }
};

const getDealById = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id).populate(
      "leadId",
      "title name company email status"
    );

    if (!deal) {
      return res.status(404).json({
        message: "Deal not found",
      });
    }

    res.status(200).json(deal);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching deal",
      error: error.message,
    });
  }
};

const updateDeal = async (req, res) => {
  try {
    // ← Add this check at the top of ALL protected controllers
    if (!req.session || !req.session.user) {
      return res.status(401).json({ 
        message: "Unauthorized: Please login again" 
      });
    }

    const deal = await Deal.findById(req.params.id);

    if (!deal) {
      return res.status(404).json({ message: "Deal not found" });
    }

    // Permission check - now safe
    const isAdmin = req.session.user.role === "admin";
    const isOwner = deal.createdBy.toString() === req.session.user.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        message: "You are not allowed to edit this deal",
      });
    }

    // Whitelist allowed fields (prevents overwriting createdBy, leadId, etc.)
    const allowedFields = [
      "title", "company", "contactPerson", "email", 
      "amount", "revisedAmount", "stage", "expectedCloseDate", "notes"
    ];

    const updatePayload = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updatePayload[field] = req.body[field];
      }
    });

    // Safe type conversion
    if (req.body.amount !== undefined) updatePayload.amount = Number(req.body.amount) || 0;
    if (req.body.revisedAmount !== undefined) updatePayload.revisedAmount = Number(req.body.revisedAmount) || 0;
    if (req.body.expectedCloseDate !== undefined) {
      updatePayload.expectedCloseDate = req.body.expectedCloseDate || null;
    }

    const updatedDeal = await Deal.findByIdAndUpdate(
      req.params.id,
      updatePayload,
      { 
        new: true,           // return the updated document
        runValidators: true 
      }
    ).populate("leadId", "title name company email status");

    res.status(200).json({
      message: "Deal updated successfully",
      deal: updatedDeal,
    });

    
    await logActivity({
      user: req.session.user,
      action: "Updated",
      module: "Deal",
      details: `Deal updated: ${updatedDeal.title}`,
    });

  } catch (error) {
    console.error("UPDATE DEAL ERROR:", error);
    res.status(500).json({
      message: "Error updating deal",
      error: error.message,
    });
  }
};

const deleteDeal = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);

    if (!deal) {
      return res.status(404).json({
        message: "Deal not found",
      });
    }

    if (
      req.session.user.role !== "admin" &&
      deal.createdBy.toString() !== req.session.user.id
    ) {
      return res.status(403).json({
        message: "You are not allowed to delete this deal",
      });
    }

    if (deal.leadId) {
      await Lead.findByIdAndUpdate(deal.leadId, { status: "qualified" });
    }

    await Deal.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Deal deleted successfully",
    });

    
    await logActivity({
      user: req.session.user,
      action: "Deleted",
      module: "Deal",
      details: `Deal deleted: ${deal.title}`,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting deal",
      error: error.message,
    });
  }
};

const convertLeadToDeal = async (req, res) => {
  try {
    const { leadId, amount, revisedAmount, stage, expectedCloseDate, notes } =
      req.body;

    if (!leadId) {
      return res.status(400).json({
        message: "Lead ID is required",
      });
    }

    const lead = await Lead.findById(leadId);

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    const existingDeal = await Deal.findOne({ leadId });

    if (existingDeal) {
      return res.status(400).json({
        message: "This lead is already converted into a deal",
      });
    }

    const deal = await Deal.create({
      leadId: lead._id,
      title: lead.title,
      company: lead.company,
      contactPerson: lead.name,
      email: lead.email,
      amount: Number(amount) || Number(lead.value) || 0,
      revisedAmount: Number(revisedAmount) || 0,
      stage: stage || "new",
      expectedCloseDate: expectedCloseDate || null,
      notes: notes || "",
      createdBy: req.session.user.id,
      assignedTo: req.session.user.id,
    });

    await Lead.findByIdAndUpdate(leadId, { status: "converted" });

    res.status(201).json({
      message: "Lead converted to deal successfully",
      deal,
    });

    
    await logActivity({
      user: req.session.user,
      action: "Converted",
      module: "Deal",
      details: `Lead converted to deal: ${lead.title}`,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error converting lead to deal",
      error: error.message,
    });
  }
};

module.exports = {
  createDeal,
  getAllDeals,
  getDealById,
  updateDeal,
  deleteDeal,
  convertLeadToDeal,
};