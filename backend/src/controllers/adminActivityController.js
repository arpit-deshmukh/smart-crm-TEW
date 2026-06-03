const Activity = require("../models/Activity");

const getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find().sort({ createdAt: -1 }).limit(100);

    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching activities",
      error: error.message,
    });
  }
};

module.exports = {
  getAllActivities,
};