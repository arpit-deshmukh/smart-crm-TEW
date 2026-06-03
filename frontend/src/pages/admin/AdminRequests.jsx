import { useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import AdminSidebar from "../../components/layout/AdminSidebar";
import {
  getPendingRequests,
  approveRequest,
  denyRequest,
} from "../../services/adminRequestService";

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchRequests = async () => {
    try {
      const data = await getPendingRequests();
      setRequests(data);
    } catch {
      setError("Failed to fetch requests");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await approveRequest(id);
      setMessage(res.message);
      fetchRequests();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to approve request");
    }
  };

  const handleDeny = async (id) => {
    try {
      const res = await denyRequest(id);
      setMessage(res.message);
      fetchRequests();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to deny request");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />
      <div className="flex-1 p-6 lg:p-8">
        <div className="mb-6 rounded-3xl bg-gradient-to-r from-indigo-700 to-violet-700 p-6 text-white shadow-xl">
          <h1 className="text-3xl font-bold">Admin Requests</h1>
          <p className="mt-2 text-indigo-100">
            Accept or deny new account requests.
          </p>
        </div>

        {message && (
          <div className="mb-4 rounded-2xl bg-emerald-100 px-4 py-3 text-emerald-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-2xl bg-red-100 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        <div className="rounded-3xl bg-white shadow-sm border border-slate-200 overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-slate-100 text-left text-sm text-slate-700">
              <tr>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Created</th>
                <th className="p-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.length > 0 ? (
                requests.map((user) => (
                  <tr key={user._id} className="border-t border-slate-200">
                    <td className="p-4">{user.name}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleApprove(user._id)}
                          className="rounded-xl bg-emerald-100 p-2 text-emerald-700 hover:bg-emerald-200"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => handleDeny(user._id)}
                          className="rounded-xl bg-red-100 p-2 text-red-700 hover:bg-red-200"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-500">
                    No pending requests
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminRequests;