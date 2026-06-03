const express = require("express");
const cors = require("cors");
const sessionMiddleware = require("./config/session");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const leadRoutes = require("./routes/leadRoutes");
const dealRoutes = require("./routes/dealRoutes");
const contactRoutes = require("./routes/contactRoutes");
const companyRoutes = require("./routes/companyRoutes");
const emailTemplateRoutes = require("./routes/emailTemplateRoutes");
const followupRoutes = require("./routes/followupRoutes");
const leadMailRoutes = require("./routes/leadMailRoutes");
const followupMailRoutes = require("./routes/followupMailRoutes");
const profileRoutes = require("./routes/profileRoutes");
const adminDashboardRoutes = require("./routes/adminDashboardRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");
const adminRequestRoutes = require("./routes/adminRequestRoutes");
const adminActivityRoutes = require("./routes/adminActivityRoutes");
const testRoutes = require("./routes/testRoutes");
const revenueSummaryRoutes = require("./routes/revenueSummaryRoutes");

const app = express();
app.set("trust proxy", 1);

// const allowedOrigins = [
//   process.env.FRONTEND_URL,
//   "https://smart-crm-alpha.vercel.app",
// ];

// app.use(
//   cors({
//     origin: allowedOrigins,
//     credentials: true,
//   })
// );


app.use(
  cors({
    origin: "https://smart-crm-alpha.vercel.app", // ⚠️ replace this
    credentials: true, // ✅ REQUIRED
  })
);


app.use(express.json());
app.use(sessionMiddleware);

app.get("/api", (req, res) => {
  res.send("Smart CRM System Backend Running");
});

app.get("/session-test", (req, res) => {
  if (!req.session.views) {
    req.session.views = 1;
  } else {
    req.session.views += 1;
  }

  res.json({
    message: "Session working",
    views: req.session.views,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/deals", dealRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/email-templates", emailTemplateRoutes);
app.use("/api/followups", followupRoutes);
app.use("/api/lead-mails", leadMailRoutes);
app.use("/api/followup-mails", followupMailRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin-dashboard", adminDashboardRoutes);
app.use("/api/admin-users", adminUserRoutes);
app.use("/api/admin-requests", adminRequestRoutes);
app.use("/api/admin-activity", adminActivityRoutes);
app.use("/api/revenue-summary", revenueSummaryRoutes);
app.use("/api/test", testRoutes);

module.exports = app;