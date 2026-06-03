const Contact = require("../models/Contact");
const logActivity = require("../utils/logActivity");

const createContact = async (req, res) => {
  try {
    const {
      fullName,
      company,
      designation,
      email,
      phone,
      country,
      source,
      notes,
    } = req.body;

    if (!fullName || !company || !email) {
      return res.status(400).json({
        message: "Full name, company and email are required",
      });
    }

    const contact = await Contact.create({
      fullName,
      company,
      designation,
      email,
      phone,
      country,
      source,
      notes,
      createdBy: req.session.user.id,
      assignedTo: req.session.user.id,
    });

    res.status(201).json({
      message: "Contact created successfully",
      contact,
    });

    await logActivity({
      user: req.session.user,
      action: "Created",
      module: "Contact",
      details: `Contact created: ${contact.fullName}`,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating contact",
      error: error.message,
    });
  }
};

const getAllContacts = async (req, res) => {
  try {
    let contacts;

    if (req.session.user.role === "admin") {
      contacts = await Contact.find()
        .populate("createdBy", "name email role")
        .populate("assignedTo", "name email role")
        .sort({ createdAt: -1 });
    } else {
      contacts = await Contact.find({ createdBy: req.session.user.id })
        .populate("createdBy", "name email role")
        .populate("assignedTo", "name email role")
        .sort({ createdAt: -1 });
    }

    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching contacts",
      error: error.message,
    });
  }
};

const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        message: "Contact not found",
      });
    }

    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching contact",
      error: error.message,
    });
  }
};

const updateContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        message: "Contact not found",
      });
    }

    if (
      req.session.user.role !== "admin" &&
      contact.createdBy.toString() !== req.session.user.id
    ) {
      return res.status(403).json({
        message: "You are not allowed to edit this contact",
      });
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      message: "Contact updated successfully",
      contact: updatedContact,
    });

    await logActivity({
      user: req.session.user,
      action: "Updated",
      module: "Contact",
      details: `Contact updated: ${updatedContact.fullName}`,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating contact",
      error: error.message,
    });
  }
};

const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        message: "Contact not found",
      });
    }

    if (
      req.session.user.role !== "admin" &&
      contact.createdBy.toString() !== req.session.user.id
    ) {
      return res.status(403).json({
        message: "You are not allowed to delete this contact",
      });
    }

    await Contact.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Contact deleted successfully",
    });

    await logActivity({
      user: req.session.user,
      action: "Deleted",
      module: "Contact",
      details: `Contact deleted: ${contact.fullName}`,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting contact",
      error: error.message,
    });
  }
};

module.exports = {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
};