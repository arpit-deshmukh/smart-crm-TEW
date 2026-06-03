import { useEffect, useState } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import { getAllActivities } from "../../services/adminActivityService";

const AdminActivity = () => {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState("");

  const fetchActivities = async () => {
    try {
      const data = await getAllActivities();
      setActivities(data);
    } catch {
      setError("Failed to fetch activities");
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />
      <div className="flex-1 p-6 lg:p-8">
        <div className="mb-6 rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-800 p-6 text-white shadow-xl">
          <h1 className="text-3xl font-bold">User Activity</h1>
          <p className="mt-2 text-slate-200">
            Track user operations across the system.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl bg-red-100 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        <div className="rounded-3xl bg-white shadow-sm border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-slate-100 text-left text-sm text-slate-700">
                <tr>
                  <th className="p-4 font-semibold">User</th>
                  <th className="p-4 font-semibold">Email</th>
                  <th className="p-4 font-semibold">Action</th>
                  <th className="p-4 font-semibold">Module</th>
                  <th className="p-4 font-semibold">Details</th>
                  <th className="p-4 font-semibold">Time</th>
                </tr>
              </thead>
              <tbody>
                {activities.length > 0 ? (
                  activities.map((item) => (
                    <tr key={item._id} className="border-t border-slate-200">
                      <td className="p-4">{item.userName}</td>
                      <td className="p-4">{item.userEmail}</td>
                      <td className="p-4">{item.action}</td>
                      <td className="p-4">{item.module}</td>
                      <td className="p-4">{item.details}</td>
                      <td className="p-4">
                        {new Date(item.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-500">
                      No activity found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminActivity;