import { useEffect, useState } from "react";
import {
  FaUsers,
  FaUserShield,
  FaHandshake,
  FaBuilding,
  FaEnvelopeOpenText,
  FaBell,
  FaArrowUp,
  FaSpinner,
  FaChartLine,
} from "react-icons/fa";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import AdminSidebar from "../../components/layout/AdminSidebar";
import { getAdminDashboardSummary } from "../../services/adminDashboardService";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAdminDashboardSummary();
      setDashboardData(data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load admin dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-100">
        <AdminSidebar />
        <div className="flex flex-1 items-center justify-center">
          <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 shadow">
            <FaSpinner className="animate-spin text-indigo-600" />
            <span className="font-medium text-slate-700">
              Loading admin dashboard...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-slate-100">
        <AdminSidebar />
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow">
            <h2 className="text-2xl font-bold text-slate-800">Dashboard Error</h2>
            <p className="mt-3 text-slate-600">{error}</p>
            <button
              onClick={fetchDashboard}
              className="mt-6 rounded-2xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { stats, monthlyRevenue, recentUsers, recentLeads, upcomingFollowups } =
    dashboardData;

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      sub: `${stats.totalAdmins} admins`,
      icon: <FaUsers />,
      bg: "bg-blue-100",
      text: "text-blue-600",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Total Leads",
      value: stats.totalLeads,
      sub: `${stats.newLeads} new`,
      icon: <FaUserShield />,
      bg: "bg-violet-100",
      text: "text-violet-600",
      gradient: "from-violet-500 to-purple-500",
    },
    {
      title: "Total Deals",
      value: stats.totalDeals,
      sub: `${stats.wonDeals} won`,
      icon: <FaHandshake />,
      bg: "bg-emerald-100",
      text: "text-emerald-600",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      title: "Companies",
      value: stats.totalCompanies,
      sub: "All records",
      icon: <FaBuilding />,
      bg: "bg-cyan-100",
      text: "text-cyan-600",
      gradient: "from-cyan-500 to-sky-500",
    },
    {
      title: "Templates",
      value: stats.totalTemplates,
      sub: "Reusable mails",
      icon: <FaEnvelopeOpenText />,
      bg: "bg-amber-100",
      text: "text-amber-600",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      title: "Followups",
      value: stats.totalFollowups,
      sub: `${stats.pendingFollowups} pending`,
      icon: <FaBell />,
      bg: "bg-rose-100",
      text: "text-rose-600",
      gradient: "from-rose-500 to-pink-500",
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />

      <div className="flex-1 p-6 lg:p-8 min-w-0">
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-800 to-violet-700 p-8 text-white shadow-xl">
          <h1 className="text-3xl lg:text-4xl font-bold">Admin Dashboard</h1>
          <p className="mt-3 text-sm lg:text-base text-slate-200">
            Monitor users, CRM operations, revenue, and business growth from one place.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((item, index) => (
            <div
              key={index}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{item.title}</p>
                  <h3 className="mt-2 text-3xl font-bold text-slate-800">
                    {item.value}
                  </h3>
                  <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <FaArrowUp className="text-[10px]" />
                    {item.sub}
                  </div>
                </div>

                <div className={`rounded-2xl p-3 text-xl ${item.bg} ${item.text}`}>
                  {item.icon}
                </div>
              </div>

              <div
                className={`mt-5 h-2 rounded-full bg-gradient-to-r ${item.gradient}`}
              ></div>
            </div>
          ))}
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaChartLine className="text-emerald-600" />
                <h2 className="text-xl font-bold text-slate-800">
                  Monthly Revenue Tracking
                </h2>
              </div>

              <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                Total Revenue: ${Number(stats.totalRevenue || 0).toLocaleString()}
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [
                      `$${Number(value).toLocaleString()}`,
                      "Revenue",
                    ]}
                  />
                  <Bar dataKey="revenue" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <FaBell className="text-violet-600" />
              <h2 className="text-xl font-bold text-slate-800">
                Upcoming Followups
              </h2>
            </div>

            <div className="space-y-4">
              {upcomingFollowups.length > 0 ? (
                upcomingFollowups.map((item) => (
                  <div
                    key={item._id}
                    className="rounded-2xl border border-slate-200 p-4 hover:bg-slate-50"
                  >
                    <h3 className="font-semibold text-slate-800">
                      {item.contactName || item.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {item.company || "No company"}
                    </p>
                    <p className="mt-2 text-sm font-medium text-slate-700">
                      {new Date(item.followupDate).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No upcoming followups.</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold text-slate-800">Recent Users</h2>

            <div className="space-y-4">
              {recentUsers.length > 0 ? (
                recentUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={user.profileImage || "https://i.pravatar.cc/120?img=12"}
                        alt="user"
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-slate-800">{user.name}</h3>
                        <p className="text-sm text-slate-600">{user.email}</p>
                      </div>
                    </div>

                    <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 capitalize">
                      {user.role}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No recent users found.</p>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold text-slate-800">Recent Leads</h2>

            <div className="space-y-4">
              {recentLeads.length > 0 ? (
                recentLeads.map((lead) => (
                  <div
                    key={lead._id}
                    className="flex items-start justify-between rounded-2xl bg-slate-50 p-4"
                  >
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {lead.name || lead.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">
                        {lead.company || "No company"}
                      </p>
                      <p className="mt-2 text-xs text-slate-500">
                        {new Date(lead.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700 capitalize">
                      {lead.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No recent leads found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;