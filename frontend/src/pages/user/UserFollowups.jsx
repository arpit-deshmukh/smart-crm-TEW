import { useEffect, useMemo, useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaBell,
  FaClock,
  FaPaperPlane,
} from "react-icons/fa";
import UserSidebar from "../../components/layout/UserSidebar";
import {
  createFollowup,
  getAllFollowups,
  updateFollowup,
  deleteFollowup,
} from "../../services/followupService";
import { getAllEmailTemplates } from "../../services/emailTemplateService";
import { sendBulkFollowupMail } from "../../services/followupMailService";

const UserFollowups = () => {
  const [followups, setFollowups] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showMailModal, setShowMailModal] = useState(false);
  const [editingFollowupId, setEditingFollowupId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const [mailForm, setMailForm] = useState({
    targetStatus: "pending",
    templateId: "",
  });

  const [formData, setFormData] = useState({
    title: "",
    relatedTo: "general",
    leadId: "",
    dealId: "",
    contactName: "",
    company: "",
    email: "",
    phone: "",
    followupDate: "",
    status: "pending",
    priority: "medium",
    notes: "",
  });

  const fetchFollowups = async () => {
    try {
      const data = await getAllFollowups();
      setFollowups(data);
    } catch {
      setError("Failed to fetch followups");
    }
  };

  const fetchTemplates = async () => {
    try {
      const data = await getAllEmailTemplates();
      setTemplates(data);
    } catch {
      setError("Failed to fetch email templates");
    }
  };

  useEffect(() => {
    fetchFollowups();
    fetchTemplates();
  }, []);

  const filteredFollowups = useMemo(() => {
    return followups.filter((followup) => {
      const matchesSearch =
        (followup.title || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (followup.contactName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (followup.company || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (followup.email || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (followup.phone || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ? true : followup.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [followups, searchTerm, statusFilter]);

  const resetForm = () => {
    setFormData({
      title: "",
      relatedTo: "general",
      leadId: "",
      dealId: "",
      contactName: "",
      company: "",
      email: "",
      phone: "",
      followupDate: "",
      status: "pending",
      priority: "medium",
      notes: "",
    });
    setEditingFollowupId(null);
    setShowForm(false);
  };

  const handleEdit = (followup) => {
    setFormData({
      title: followup.title || "",
      relatedTo: followup.relatedTo || "general",
      leadId: followup.leadId?._id || "",
      dealId: followup.dealId?._id || "",
      contactName: followup.contactName || "",
      company: followup.company || "",
      email: followup.email || "",
      phone: followup.phone || "",
      followupDate: followup.followupDate
        ? new Date(followup.followupDate).toISOString().slice(0, 16)
        : "",
      status: followup.status || "pending",
      priority: followup.priority || "medium",
      notes: followup.notes || "",
    });
    setEditingFollowupId(followup._id);
    setShowForm(true);
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this followup?");
    if (!confirmed) return;

    try {
      await deleteFollowup(id);
      setMessage("Followup deleted successfully");
      fetchFollowups();
    } catch {
      setError("Delete failed");
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleMailFormChange = (e) => {
    setMailForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSendMailForCurrentPage = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const currentPageFollowupIds = paginatedFollowups.map((f) => f._id);

      if (currentPageFollowupIds.length === 0) {
        setError("No followups available on this page");
        return;
      }

      const res = await sendBulkFollowupMail({
        followupIds: currentPageFollowupIds,
        targetStatus: mailForm.targetStatus,
        templateId: mailForm.templateId,
      });

      setMessage(res.message || "Emails sent successfully");
      setShowMailModal(false);
      setMailForm({
        targetStatus: "pending",
        templateId: "",
      });
      fetchFollowups();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to send emails for current page"
      );
    }
  };

  const validateForm = () => {
  const errors = {};

  if (!formData.title.trim()) {
    errors.title = "Title is required";
  }

  if (!formData.contactName.trim()) {
    errors.contactName = "Contact name is required";
  } else if (!/^[A-Za-z\s.'-]+$/.test(formData.contactName)) {
    errors.contactName = "Invalid characters in name";
  } else if (formData.contactName.length < 3) {
    errors.contactName = "Must be at least 3 characters";
  }

  if (!formData.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
    errors.email = "Invalid email format";
  }

  if (!formData.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (!/^[0-9]{7,15}$/.test(formData.phone)) {
    errors.phone = "Invalid phone number";
  }

  if (!formData.followupDate) {
    errors.followupDate = "Followup date is required";
  } else if (new Date(formData.followupDate) < new Date()) {
    errors.followupDate = "Followup date cannot be in the past";
  }

  if (formData.relatedTo === "lead" && !formData.leadId) {
    errors.leadId = "Lead ID is required";
  }

  if (formData.relatedTo === "deal" && !formData.dealId) {
    errors.dealId = "Deal ID is required";
  }

  return errors;
};

  const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("");
  setError("");

  const errors = validateForm();

  if (Object.keys(errors).length > 0) {
    setFormErrors(errors);
    return;
  }

  try {
    if (editingFollowupId) {
      const res = await updateFollowup(editingFollowupId, formData);
      setMessage(res.message || "Followup updated successfully");
    } else {
      const res = await createFollowup(formData);
      setMessage(res.message || "Followup created successfully");
    }

    setFormErrors({});
    resetForm();
    fetchFollowups();
  } catch (err) {
    setError(
      err.response?.data?.message ||
        (editingFollowupId
          ? "Failed to update followup"
          : "Failed to create followup")
    );
  }
};

  const formatDateTime = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString();
  };

  const totalPages = Math.ceil(filteredFollowups.length / itemsPerPage) || 1;

  const paginatedFollowups = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredFollowups.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredFollowups, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <UserSidebar />

      <div className="flex-1 min-w-0 p-6 lg:p-8">
        <div className="mb-6 rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-500 p-6 text-white shadow-xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Followups Management</h1>
              <p className="mt-2 text-sm text-violet-100">
                Schedule, track, edit, manage, and email your followups.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
  onClick={() => setShowMailModal(true)}
  className="inline-flex items-center gap-2 rounded-2xl bg-[#FFD700] px-6 py-3 font-bold text-violet-900 shadow-lg transition hover:brightness-110"
>
  <FaPaperPlane />
  Send Mail
</button>

<button
  onClick={() => {
    if (showForm && editingFollowupId) resetForm();
    else setShowForm(!showForm);
  }}
  className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-bold text-violet-800 transition hover:bg-violet-50"
>
  <FaPlus />
  {showForm ? "Close Form" : "Add Followup"}
</button>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {editingFollowupId ? "Edit Followup" : "Add New Followup"}
                </h2>
              </div>

              {editingFollowupId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-2xl border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              <input
                name="title"
                placeholder="Followup Title"
                value={formData.title}
                onChange={handleChange}
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
              />
              {formErrors.title && (
  <p className="text-red-500 text-sm">{formErrors.title}</p>
)}

              <select
                name="relatedTo"
                value={formData.relatedTo}
                onChange={handleChange}
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="general">General</option>
                <option value="lead">Lead</option>
                <option value="deal">Deal</option>
              </select>

              <input
                name="contactName"
                placeholder="Contact Name"
                value={formData.contactName}
                onChange={handleChange}
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
              />
              {formErrors.contactName && (
  <p className="text-red-500 text-sm">{formErrors.contactName}</p>
)}

              <input
                name="company"
                placeholder="Company"
                value={formData.company}
                onChange={handleChange}
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
              />

              <input
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
              />
              {formErrors.email && (
  <p className="text-red-500 text-sm">{formErrors.email}</p>
)}

              <input
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
              />
              {formErrors.phone && (
  <p className="text-red-500 text-sm">{formErrors.phone}</p>
)}

              <input
                name="followupDate"
                type="datetime-local"
                value={formData.followupDate}
                onChange={handleChange}
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
              />
              {formErrors.followupDate && (
  <p className="text-red-500 text-sm">{formErrors.followupDate}</p>
)}

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="missed">Missed</option>
              </select>

              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <textarea
                name="notes"
                placeholder="Notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 md:col-span-2"
              />

              <button
                type="submit"
                className="md:col-span-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-500 py-3 font-semibold text-white shadow-lg transition hover:opacity-95"
              >
                {editingFollowupId ? "Update Followup" : "Save Followup"}
              </button>
            </form>
          </div>
        )}

        {showMailModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    Send Mail
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    This sends mail only to followups on the current page.
                  </p>
                </div>

                <button
                  onClick={() => setShowMailModal(false)}
                  className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>

              <form
                onSubmit={handleSendMailForCurrentPage}
                className="space-y-4"
              >
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Select Followup Status
                  </label>
                  <select
                    name="targetStatus"
                    value={mailForm.targetStatus}
                    onChange={handleMailFormChange}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="missed">Missed</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Select Email Template
                  </label>
                  <select
                    name="templateId"
                    value={mailForm.templateId}
                    onChange={handleMailFormChange}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  >
                    <option value="">Select template</option>
                    {templates.map((template) => (
                      <option key={template._id} value={template._id}>
                        {template.title} ({template.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                  Current page followups:{" "}
                  <span className="font-semibold text-slate-900">
                    {paginatedFollowups.length}
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-emerald-600 py-3 font-semibold text-white shadow-lg transition hover:bg-emerald-700"
                >
                  Send Emails
                </button>
              </form>
            </div>
          </div>
        )}

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

        <div className="mb-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="relative lg:col-span-2">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by title, contact, company, email or phone"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="missed">Missed</option>
            </select>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Followups</p>
                <h3 className="mt-2 text-3xl font-bold text-slate-800">
                  {followups.length}
                </h3>
              </div>
              <div className="rounded-2xl bg-violet-100 p-3 text-violet-600">
                <FaBell />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Pending</p>
                <h3 className="mt-2 text-3xl font-bold text-slate-800">
                  {followups.filter((f) => f.status === "pending").length}
                </h3>
              </div>
              <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-600">
                <FaClock />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Filtered</p>
                <h3 className="mt-2 text-3xl font-bold text-slate-800">
                  {filteredFollowups.length}
                </h3>
              </div>
              <div className="rounded-2xl bg-purple-100 p-3 text-purple-600">
                <FaBell />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="min-w-[1500px] w-full">
              <thead className="sticky top-0 z-10 bg-slate-100 text-left text-sm text-slate-700">
                <tr>
                  <th className="p-4 whitespace-nowrap font-semibold">Title</th>
                  <th className="p-4 whitespace-nowrap font-semibold">Related To</th>
                  <th className="p-4 whitespace-nowrap font-semibold">Contact Name</th>
                  <th className="p-4 whitespace-nowrap font-semibold">Company</th>
                  <th className="p-4 whitespace-nowrap font-semibold">Email</th>
                  <th className="p-4 whitespace-nowrap font-semibold">Phone</th>
                  <th className="p-4 whitespace-nowrap font-semibold">Followup Date</th>
                  <th className="p-4 whitespace-nowrap font-semibold">Status</th>
                  <th className="p-4 whitespace-nowrap font-semibold">Priority</th>
                  <th className="p-4 whitespace-nowrap font-semibold">Updated</th>
                  <th className="p-4 whitespace-nowrap text-center font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedFollowups.length > 0 ? (
                  paginatedFollowups.map((followup) => (
                    <tr
                      key={followup._id}
                      className="border-t border-slate-200 transition hover:bg-slate-50"
                    >
                      <td className="p-4 whitespace-nowrap font-medium text-slate-800">
                        {followup.title}
                      </td>
                      <td className="p-4 whitespace-nowrap capitalize">
                        {followup.relatedTo}
                      </td>
                      <td className="p-4 whitespace-nowrap">{followup.contactName}</td>
                      <td className="p-4 whitespace-nowrap">{followup.company}</td>
                      <td className="p-4 whitespace-nowrap">{followup.email}</td>
                      <td className="p-4 whitespace-nowrap">{followup.phone}</td>
                      <td className="p-4 whitespace-nowrap">
                        {formatDateTime(followup.followupDate)}
                      </td>
                      <td className="p-4 whitespace-nowrap capitalize">
                        {followup.status}
                      </td>
                      <td className="p-4 whitespace-nowrap capitalize">
                        {followup.priority}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {formatDateTime(followup.updatedAt)}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleEdit(followup)}
                            className="rounded-xl bg-blue-100 p-2 text-blue-600 transition hover:bg-blue-200"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(followup._id)}
                            className="rounded-xl bg-red-100 p-2 text-red-600 transition hover:bg-red-200"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="11"
                      className="p-8 text-center text-slate-500"
                    >
                      No followups found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 bg-white p-6 md:flex-row rounded-b-3xl">
            <div className="text-sm font-medium text-slate-500">
              Showing{" "}
              <span className="text-slate-900">
                {filteredFollowups.length === 0
                  ? 0
                  : (currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="text-slate-900">
                {Math.min(currentPage * itemsPerPage, filteredFollowups.length)}
              </span>{" "}
              of <span className="text-slate-900">{filteredFollowups.length}</span>{" "}
              entries
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;

                  if (
                    totalPages > 5 &&
                    pageNum !== 1 &&
                    pageNum !== totalPages &&
                    Math.abs(pageNum - currentPage) > 1
                  ) {
                    if (Math.abs(pageNum - currentPage) === 2) {
                      return (
                        <span key={pageNum} className="px-1 text-slate-400">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`h-10 w-10 rounded-xl text-sm font-bold transition-all ${
                        currentPage === pageNum
                          ? "bg-violet-600 text-white shadow-lg shadow-violet-200"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages || filteredFollowups.length === 0}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserFollowups;