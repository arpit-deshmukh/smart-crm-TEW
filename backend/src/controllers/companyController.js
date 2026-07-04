const Company = require("../models/Company");
const logActivity = require("../utils/logActivity");

const createCompany = async (req, res) => {
  try {
    const {
      companyName,
      industry,
      website,
      email,
      phone,
      country,
      city,
      status,
      notes,
    } = req.body;

    if (!companyName) {
      return res.status(400).json({
        success: false,
        message: "Company name is required",
      });
    }

    const company = await Company.create({
      companyName,
      industry,
      website,
      email,
      phone,
      country,
      city,
      status,
      notes,
      createdBy: req.session.user.id,
      assignedTo: req.session.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Company created successfully",
      data: company,
    });

    await logActivity({
      user: req.session.user,
      action: "Created",
      module: "Company",
      details: `Company created: ${company.companyName}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating company",
    });
  }
};

const getAllCompanies = async (req, res) => {
  try {
    let companies;

    if (req.session.user.role === "admin") {
      companies = await Company.find()
        .populate("createdBy", "name email role")
        .populate("assignedTo", "name email role")
        .sort({ createdAt: -1 });
    } else {
      companies = await Company.find({ createdBy: req.session.user.id })
        .populate("createdBy", "name email role")
        .populate("assignedTo", "name email role")
        .sort({ createdAt: -1 });
    }

    res.status(200).json({ success: true, data: companies });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching companies",
    });
  }
};

const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    res.status(200).json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching company",
    });
  }
};

const updateCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    if (
      req.session.user.role !== "admin" &&
      company.createdBy.toString() !== req.session.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to edit this company",
      });
    }

    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Company updated successfully",
      data: updatedCompany,
    });

      await logActivity({
      user: req.session.user,
      action: "Updated",
      module: "Company",
      details: `Company updated: ${updatedCompany.companyName}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating company",
    });
  }
};

const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    if (
      req.session.user.role !== "admin" &&
      company.createdBy.toString() !== req.session.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this company",
      });
    }

    await Company.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Company deleted successfully",
    });

      await logActivity({
      user: req.session.user,
      action: "Deleted",
      module: "Company",
      details: `Company deleted: ${company.companyName}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting company",
    });
  }
};

module.exports = {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
};