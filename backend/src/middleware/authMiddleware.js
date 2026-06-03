const protect = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({
      message: "Unauthorized. Please login first.",
    });
  }
  next();
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.session.user) {
      return res.status(401).json({
        message: "Unauthorized. Please login first.",
      });
    }

    if (!roles.includes(req.session.user.role)) {
      return res.status(403).json({
        message: "Access denied for this role",
      });
    }

    next();
  };
};

module.exports = {
  protect,
  authorizeRoles,
};