import { useEffect, useState } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import { getRevenueSummary } from "../../services/revenueSummaryService";
import { TrendingUp, DollarSign, Briefcase, Calendar, Download, X } from "lucide-react";
import { PieChart as RePie, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

// --- Colors for the Pie Chart ---
const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4"];

const DetailModal = ({ report, onClose }) => {
  if (!report) return null;

  // Prepare data for the Pie Chart: show top 5 periods by revenue
  const chartData = report.data
    .slice(0, 6)
    .map(item => ({ name: item.period, value: Number(item.revenue) }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{report.title} Detailed Report</h2>
            <p className="text-sm text-slate-500">Visualizing revenue distribution</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Table Section */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-slate-400 uppercase text-xs font-semibold">
                  <tr className="border-b border-slate-100">
                    <th className="py-3">Period</th>
                    <th className="py-3 text-center">Deals</th>
                    <th className="py-3 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {report.data.map((item, index) => (
                    <tr key={index}>
                      <td className="py-3 font-bold text-slate-700 text-sm">{item.period}</td>
                      <td className="py-3 text-center text-sm">{item.deals}</td>
                      <td className="py-3 text-right font-bold text-emerald-600 text-sm">
                        ${Number(item.revenue).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pie Chart Section */}
            <div className="h-[300px] bg-slate-50 rounded-3xl p-4 flex flex-col items-center">
              <h4 className="text-sm font-bold text-slate-600 mb-2">Revenue Share (Top 6)</h4>
              <ResponsiveContainer width="100%" height="100%">
                <RePie>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </RePie>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 flex justify-end">
          <button onClick={onClose} className="bg-slate-800 text-white px-8 py-2.5 rounded-xl font-semibold hover:bg-slate-700 transition-all">
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5 transition-transform hover:scale-[1.02]">
    <div className={`p-4 rounded-2xl ${color} bg-opacity-10 text-xl`}>
      <Icon className={color.replace('bg-', 'text-')} size={24} />
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
    </div>
  </div>
);

const SummaryTable = ({ title, data, icon: Icon, onViewDetails }) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-md overflow-hidden transition-all hover:shadow-lg">
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
             <Icon size={18} className="text-emerald-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">{title}</h2>
        </div>
        <button onClick={onViewDetails} className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full transition-colors">
          View Details
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px]">
          <thead className="bg-white text-left text-xs uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-6 py-4 font-semibold">Period</th>
              <th className="px-6 py-4 font-semibold text-center">Total Deals</th>
              <th className="px-6 py-4 font-semibold text-right">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length > 0 ? (
              data.slice(0, 5).map((item, index) => (
                <tr key={index} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-slate-700">{item.period}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 text-center">
                    <span className="bg-slate-100 px-3 py-1 rounded-full group-hover:bg-white transition-colors">{item.deals}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-black text-emerald-600">${Number(item.revenue).toLocaleString()}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="3" className="p-12 text-center text-slate-400 italic">No reporting data found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminRevenueSummary = () => {
  const [summary, setSummary] = useState({ weekly: [], monthly: [], yearly: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeReport, setActiveReport] = useState(null);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const data = await getRevenueSummary();
      setSummary(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch revenue summary");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const totalRevenue = summary.yearly.reduce((acc, curr) => acc + Number(curr.revenue), 0);
  const totalDeals = summary.yearly.reduce((acc, curr) => acc + Number(curr.deals), 0);

  // --- Dynamic Date Highlighting ---
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <AdminSidebar />

      <div className="flex-1 min-w-0 p-6 lg:p-10">
        {/* Header Section with Highlighted Date */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Financial Reports</h1>
            <p className="text-slate-500 mt-1 italic">Real-time revenue analytics for Smart CRM.</p>
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mt-3">
              <Calendar size={14} /> {today}
            </div>
          </div>
          <button onClick={() => window.print()} className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-2.5 rounded-2xl font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all active:scale-95">
            <Download size={18} /> Export PDF
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard title="Total Annual Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={DollarSign} color="bg-emerald-500" />
          <StatCard title="Closed Deals" value={totalDeals} icon={Briefcase} color="bg-blue-500" />
          <StatCard title="Avg Monthly Growth" value="+12.5%" icon={TrendingUp} color="bg-purple-500" />
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64 animate-pulse text-slate-400">Loading Analytics...</div>
        ) : error ? (
          <div className="rounded-2xl bg-red-50 border border-red-100 p-4 text-red-700">{error}</div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="xl:col-span-2">
              <SummaryTable title="Monthly Performance" data={summary.monthly} icon={Calendar} onViewDetails={() => setActiveReport({ title: 'Monthly', data: summary.monthly })} />
            </div>
            <SummaryTable title="Weekly Breakdown" data={summary.weekly} icon={TrendingUp} onViewDetails={() => setActiveReport({ title: 'Weekly', data: summary.weekly })} />
            <SummaryTable title="Yearly Overview" data={summary.yearly} icon={DollarSign} onViewDetails={() => setActiveReport({ title: 'Yearly', data: summary.yearly })} />
          </div>
        )}
      </div>

      <DetailModal report={activeReport} onClose={() => setActiveReport(null)} />
    </div>
  );
};

export default AdminRevenueSummary;