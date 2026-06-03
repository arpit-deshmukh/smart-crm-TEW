const mongoose = require("mongoose");

const Lead = require("../models/Lead");
const Deal = require("../models/Deal");
const Company = require("../models/Company");
const EmailTemplate = require("../models/EmailTemplate");
const Followup = require("../models/Followup");


const getUserDashboardSummary = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const isAdmin = req.session.user.role === "admin";
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const filterByUser = (extra = {}) =>
  isAdmin ? extra : { ...extra, createdBy: userObjectId };

    const [
      totalLeads,
      newLeads,
      contactedLeads,
      totalDeals,
      wonDeals,
      totalCompanies,
      totalTemplates,
      upcomingFollowups,
      recentLeads,
      monthlyRevenueRaw,
    ] = await Promise.all([
      Lead.countDocuments(filterByUser()),
      Lead.countDocuments(filterByUser({ status: "new" })),
      Lead.countDocuments(filterByUser({ status: "contacted" })),
      Deal.countDocuments(filterByUser()),
      Deal.countDocuments(filterByUser({ stage: "won" })),
      Company.countDocuments(filterByUser()),
      EmailTemplate.countDocuments(filterByUser()),
      
      Followup.find(filterByUser({ followupDate: { $gte: new Date() } }))
        .sort({ followupDate: 1 })
        .limit(5)
        .select("title contactName company followupDate priority status"),

      Lead.find(filterByUser())
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title name company status createdAt"),

      // --- REVENUE AGGREGATION FIX ---
      Deal.aggregate([
        {
          $match: filterByUser({ stage: "won" }),
        },
        {
          $addFields: {
            revenueAmount: {
              $cond: [
                { $gt: [{ $ifNull: ["$revisedAmount", 0] }, 0] },
                "$revisedAmount",
                { $ifNull: ["$amount", 0] },
              ],
            },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$updatedAt" }, // Tracks when it was CHANGED to 'won'
              month: { $month: "$updatedAt" },
            },
            revenue: { $sum: "$revenueAmount" },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const monthlyRevenue = monthNames.map((month, index) => {
      // Index + 1 matches MongoDB $month (1-12)
      const found = monthlyRevenueRaw.find((item) => item._id.month === index + 1);
      return {
        month,
        revenue: found ? found.revenue : 0,
      };
    });

    const totalRevenue = monthlyRevenue.reduce((sum, item) => sum + item.revenue, 0);

    // --- DEBUGGING LOGS (Must be inside the function) ---
    console.log("--- Dashboard Debug ---");
    console.log("Monthly Revenue Raw:", JSON.stringify(monthlyRevenueRaw, null, 2));
    console.log("Processed Monthly Revenue:", monthlyRevenue);
    console.log("Total Revenue Calculated:", totalRevenue);

    res.status(200).json({
      stats: {
        totalLeads,
        newLeads,
        contactedLeads,
        totalDeals,
        wonDeals,
        totalCompanies,
        totalTemplates,
        totalRevenue,
      },
      monthlyRevenue,
      upcomingFollowups,
      recentLeads,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({
      message: "Error fetching dashboard summary",
      error: error.message,
    });
  }
};

module.exports = { getUserDashboardSummary };