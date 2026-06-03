const Deal = require("../models/Deal");

const getRevenueSummary = async (req, res) => {
  try {
    const wonDeals = await Deal.find({ stage: "won" }).sort({ createdAt: -1 });

    const getRevenueAmount = (deal) => {
      return Number(deal.revisedAmount) > 0
        ? Number(deal.revisedAmount)
        : Number(deal.amount) || 0;
    };

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentWeekStart = new Date(now);
    currentWeekStart.setDate(now.getDate() - now.getDay());
    currentWeekStart.setHours(0, 0, 0, 0);

    const weeklyMap = {};
    const monthlyMap = {};
    const yearlyMap = {};

    wonDeals.forEach((deal) => {
      const createdAt = new Date(deal.createdAt);
      const revenue = getRevenueAmount(deal);

      // Weekly summary (current week by day)
      if (createdAt >= currentWeekStart) {
        const dayName = createdAt.toLocaleDateString("en-US", {
          weekday: "short",
        });

        if (!weeklyMap[dayName]) {
          weeklyMap[dayName] = {
            period: dayName,
            deals: 0,
            revenue: 0,
          };
        }

        weeklyMap[dayName].deals += 1;
        weeklyMap[dayName].revenue += revenue;
      }

      // Monthly summary (current year by month)
      if (createdAt.getFullYear() === currentYear) {
        const monthName = createdAt.toLocaleDateString("en-US", {
          month: "short",
        });

        if (!monthlyMap[monthName]) {
          monthlyMap[monthName] = {
            period: monthName,
            deals: 0,
            revenue: 0,
          };
        }

        monthlyMap[monthName].deals += 1;
        monthlyMap[monthName].revenue += revenue;
      }

      // Yearly summary (all years)
      const year = createdAt.getFullYear();

      if (!yearlyMap[year]) {
        yearlyMap[year] = {
          period: String(year),
          deals: 0,
          revenue: 0,
        };
      }

      yearlyMap[year].deals += 1;
      yearlyMap[year].revenue += revenue;
    });

    const weekOrder = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthOrder = [
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

    const weekly = weekOrder
      .filter((day) => weeklyMap[day])
      .map((day) => weeklyMap[day]);

    const monthly = monthOrder
      .filter((month) => monthlyMap[month])
      .map((month) => monthlyMap[month]);

    const yearly = Object.values(yearlyMap).sort(
      (a, b) => Number(b.period) - Number(a.period)
    );

    return res.status(200).json({
      weekly,
      monthly,
      yearly,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching revenue summary",
      error: error.message,
    });
  }
};

module.exports = {
  getRevenueSummary,
};