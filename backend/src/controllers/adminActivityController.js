const Activity = require("../models/Activity");

const getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find().sort({ createdAt: -1 }).limit(100);

    res.status(200).json({ success: true, data: activities });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching activities",
    });
  }
};

module.exports = {
  getAllActivities,
};