const Activity = require("../models/Activity");

const logActivity = async ({ user, action, module, details = "" }) => {
  try {
    if (!user) return;

    await Activity.create({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action,
      module,
      details,
    });
  } catch (error) {
    console.log("Activity log error:", error.message);
    
  }
  console.log("LOG ACTIVITY CALLED:", action, module);
};

module.exports = logActivity;