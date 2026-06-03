import { useEffect, useState } from "react";
import {
  FaUsers,
  FaHandshake,
  FaBuilding,
  FaEnvelopeOpenText,
  FaBell,
  FaChartLine,
  FaArrowUp,
  FaSpinner,
  FaRegCalendarAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";
import UserSidebar from "../../components/layout/UserSidebar";
import { getUserDashboardSummary } from "../../services/dashboardService";
import { useAuth } from "../../context/AuthContext";

const UserDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getUserDashboardSummary();
      setDashboardData(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <UserSidebar />
        <div className="flex flex-1 items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-4 rounded-3xl bg-white px-10 py-6 shadow-xl border border-slate-100"
          >
            <FaSpinner className="animate-spin text-3xl text-violet-600" />
            <span className="text-xl font-medium text-slate-700">
              Loading your dashboard...
            </span>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <UserSidebar />
        <div className="flex flex-1 items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-xl border border-slate-100"
          >
            <h2 className="text-3xl font-bold text-slate-800">Dashboard Error</h2>
            <p className="mt-4 text-slate-600">{error}</p>
            <button
              onClick={fetchDashboard}
              className="mt-8 w-full rounded-2xl bg-violet-600 py-4 font-semibold text-white hover:bg-violet-700 transition-all active:scale-95"
            >
              Retry
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  const { stats, monthlyRevenue, upcomingFollowups, recentLeads } = dashboardData;

  const statCards = [
    {
      title: "Total Leads",
      value: stats.totalLeads,
      sub: `${stats.newLeads} new this month`,
      icon: <FaUsers />,
      color: "from-blue-500 to-cyan-500",
      iconBg: "bg-blue-100 text-blue-600",
    },
    {
      title: "Total Deals",
      value: stats.totalDeals,
      sub: `${stats.wonDeals} won`,
      icon: <FaHandshake />,
      color: "from-emerald-500 to-teal-500",
      iconBg: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Companies",
      value: stats.totalCompanies,
      sub: "Active records",
      icon: <FaBuilding />,
      color: "from-violet-500 to-purple-500",
      iconBg: "bg-violet-100 text-violet-600",
    },
    {
      title: "Email Templates",
      value: stats.totalTemplates,
      sub: "Reusable emails",
      icon: <FaEnvelopeOpenText />,
      color: "from-amber-500 to-orange-500",
      iconBg: "bg-amber-100 text-amber-600",
    },
  ];

  const quickActions = [
    {
      title: "Add Lead",
      desc: "Create a new lead entry",
      link: "/user/leads",
      color: "bg-blue-600 hover:bg-blue-700",
      icon: "👤",
    },
    {
      title: "Create Deal",
      desc: "Add a new deal entry",
      link: "/user/deals",
      color: "bg-emerald-600 hover:bg-emerald-700",
      icon: "🤝",
    },
    {
      title: "Add Company",
      desc: "Create a company record",
      link: "/user/companies",
      color: "bg-violet-600 hover:bg-violet-700",
      icon: "🏢",
    },
    {
      title: "Schedule Followup",
      desc: "Plan your next action",
      link: "/user/followups",
      color: "bg-amber-600 hover:bg-amber-700",
      icon: "⏰",
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <UserSidebar />

      <div className="flex-1 p-6 lg:p-10">
        {/* Elegant Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-3 mb-3">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="uppercase text-xs font-semibold tracking-[2px] text-emerald-600">
                  Live Overview
                </span>
              </div>
              <h1 className="text-5xl font-bold text-slate-800 tracking-tighter">
                Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 17 ? "Afternoon" : "Evening"}, {user?.name || "User"}
              </h1>
              <p className="mt-2 text-xl text-slate-600">
                Your CRM performance at a glance
              </p>
            </div>

            {/* Beautiful Decorative Element */}
            <div className="hidden lg:flex items-center gap-8 text-right">
              <div className="text-sm">
                <p className="text-slate-500">Today</p>
                <p className="font-semibold text-slate-700 flex items-center gap-2 justify-end">
                  <FaRegCalendarAlt className="text-violet-500" />
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              
              <motion.div 
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="text-6xl opacity-80"
              >
                ✨
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07 }}
              whileHover={{ y: -10, scale: 1.03 }}
              className="group rounded-3xl bg-white p-8 shadow-sm border border-slate-100 hover:border-slate-200 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-sm font-medium text-slate-500">{item.title}</p>
                  <h3 className="mt-3 text-4xl font-bold text-slate-900 tracking-tighter">
                    {item.value.toLocaleString()}
                  </h3>
                </div>

                <div className={`rounded-2xl p-5 text-4xl transition-all group-hover:scale-110 shadow-inner ${item.iconBg}`}>
                  {item.icon}
                </div>
              </div>

              <div className="flex items-center gap-2 text-emerald-600 font-medium">
                <FaArrowUp className="text-sm" />
                <span className="text-sm">{item.sub}</span>
              </div>

              <div className={`mt-8 h-1.5 rounded-full bg-gradient-to-r ${item.color}`} />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3 mb-12">
          {/* Monthly Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="xl:col-span-2 rounded-3xl bg-white p-8 shadow-sm border border-slate-100"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-emerald-100 text-emerald-600">
                  <FaChartLine className="text-3xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Monthly Revenue</h2>
                  <p className="text-slate-500">Last 6 months performance</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs uppercase tracking-widest text-slate-500">TOTAL REVENUE</p>
                <p className="text-3xl font-bold text-emerald-600">
                  ${Number(stats.totalRevenue || 0).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, "Revenue"]}
                  />
                  <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Upcoming Followups */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 rounded-2xl bg-violet-100 text-violet-600">
                <FaBell className="text-3xl" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Upcoming Followups</h2>
            </div>

            <div className="space-y-5 max-h-[380px] overflow-auto pr-2 custom-scrollbar">
              {upcomingFollowups.length > 0 ? (
                upcomingFollowups.map((item, idx) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="rounded-2xl border border-slate-100 p-6 hover:bg-slate-50 hover:border-violet-200 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-slate-800">
                          {item.contactName || item.title}
                        </h3>
                        <p className="text-sm text-slate-600 mt-1">
                          {item.company || "No company"}
                        </p>
                        <p className="text-xs text-slate-500 mt-4">
                          {new Date(item.followupDate).toLocaleString([], {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>

                      <span
                        className={`px-5 py-1.5 text-xs font-semibold rounded-full capitalize ${
                          item.priority === "high"
                            ? "bg-red-100 text-red-700"
                            : item.priority === "medium"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {item.priority}
                      </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-slate-500 text-center py-12">No upcoming followups scheduled.</p>
              )}
            </div>

            <Link
              to="/user/followups"
              className="mt-6 text-violet-600 hover:text-violet-700 font-medium inline-flex items-center gap-2"
            >
              View all followups →
            </Link>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-slate-800 mb-6">Quick Actions</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="group rounded-3xl bg-white p-8 border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full"
              >
                <div className="text-5xl mb-6 transition-transform group-hover:scale-110">
                  {action.icon}
                </div>
                <div className="mb-4">
                  <div className={`inline-block px-6 py-2 rounded-2xl text-white text-sm font-semibold ${action.color}`}>
                    {action.title}
                  </div>
                </div>
                <p className="text-slate-600 flex-1">{action.desc}</p>

                <div className="mt-8 text-sm font-medium text-slate-400 group-hover:text-violet-600 transition-colors">
                  Go to section →
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Leads */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-cyan-100 text-cyan-600">
              <FaUsers className="text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Recent Leads</h2>
          </div>

          <div className="space-y-5">
            {recentLeads.length > 0 ? (
              recentLeads.map((lead, idx) => (
                <motion.div
                  key={lead._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  className="flex items-center justify-between rounded-2xl bg-slate-50 p-6 hover:bg-white border border-transparent hover:border-slate-200 transition-all"
                >
                  <div>
                    <h3 className="font-semibold text-slate-800 text-lg">
                      {lead.name || lead.title}
                    </h3>
                    <p className="text-slate-600 mt-1">{lead.company || "Individual"}</p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block px-6 py-2 text-xs font-semibold rounded-full capitalize ${
                        lead.status === "new"
                          ? "bg-blue-100 text-blue-700"
                          : lead.status === "contacted"
                          ? "bg-amber-100 text-amber-700"
                          : lead.status === "qualified"
                          ? "bg-emerald-100 text-emerald-700"
                          : lead.status === "proposal"
                          ? "bg-violet-100 text-violet-700"
                          : "bg-cyan-100 text-cyan-700"
                      }`}
                    >
                      {lead.status}
                    </span>
                    <p className="text-xs text-slate-500 mt-3">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-center py-16 text-slate-500">No recent leads found yet.</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserDashboard;