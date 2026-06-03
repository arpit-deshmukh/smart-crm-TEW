const Lead = require("../models/Lead");
const Deal = require("../models/Deal");
const Company = require("../models/Company");
const EmailTemplate = require("../models/EmailTemplate");
const Followup = require("../models/Followup");
const User = require("../models/User");

const getAdminDashboardSummary = async (req, res) => {
  try {
    const [
      totalUsers,
      totalAdmins,
      totalNormalUsers,
      totalLeads,
      newLeads,
      contactedLeads,
      totalDeals,
      wonDeals,
      totalCompanies,
      totalTemplates,
      totalFollowups,
      pendingFollowups,
      recentUsers,
      recentLeads,
      upcomingFollowups,
      monthlyRevenueRaw,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ role: "user" }),

      Lead.countDocuments(),
      Lead.countDocuments({ status: "new" }),
      Lead.countDocuments({ status: "contacted" }),

      Deal.countDocuments(),
      Deal.countDocuments({ stage: "won" }),

      Company.countDocuments(),
      EmailTemplate.countDocuments(),

      Followup.countDocuments(),
      Followup.countDocuments({ status: "pending" }),

      User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name email role createdAt profileImage"),

      Lead.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title name company status createdAt"),

      Followup.find({
        followupDate: { $gte: new Date() },
      })
        .sort({ followupDate: 1 })
        .limit(5)
        .select("title contactName company followupDate priority status"),

      Deal.aggregate([
        {
          $match: { stage: "won" },
        },
        {
          $addFields: {
            revenueAmount: {
              $cond: [
                { $gt: ["$revisedAmount", 0] },
                "$revisedAmount",
                "$amount",
              ],
            },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            revenue: { $sum: "$revenueAmount" },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ]),
    ]);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthlyRevenue = monthNames.map((month, index) => {
      const found = monthlyRevenueRaw.find(
        (item) => item._id.month === index + 1
      );

      return {
        month,
        revenue: found ? found.revenue : 0,
      };
    });

    const totalRevenue = monthlyRevenue.reduce(
      (sum, item) => sum + item.revenue,
      0
    );

    res.status(200).json({
      stats: {
        totalUsers,
        totalAdmins,
        totalNormalUsers,
        totalLeads,
        newLeads,
        contactedLeads,
        totalDeals,
        wonDeals,
        totalCompanies,
        totalTemplates,
        totalFollowups,
        pendingFollowups,
        totalRevenue,
      },
      monthlyRevenue,
      recentUsers,
      recentLeads,
      upcomingFollowups,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching admin dashboard summary",
      error: error.message,
    });
  }
};

module.exports = {
  getAdminDashboardSummary,
};