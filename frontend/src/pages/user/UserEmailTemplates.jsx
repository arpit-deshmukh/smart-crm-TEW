import { useEffect, useMemo, useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaEnvelopeOpenText,
  FaLayerGroup,
} from "react-icons/fa";
import UserSidebar from "../../components/layout/UserSidebar";
import {
  createEmailTemplate,
  getAllEmailTemplates,
  updateEmailTemplate,
  deleteEmailTemplate,
} from "../../services/emailTemplateService";

const UserEmailTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    category: "proposal",
    body: "",
  });

  const fetchTemplates = async () => {
    try {
      const data = await getAllEmailTemplates();
      setTemplates(data);
    } catch {
      setError("Failed to fetch email templates");
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesSearch =
        (template.title || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (template.subject || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (template.body || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" ? true : template.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [templates, searchTerm, categoryFilter]);

  const resetForm = () => {
    setFormData({
      title: "",
      subject: "",
      category: "proposal",
      body: "",
    });
    setEditingTemplateId(null);
    setShowForm(false);
  };

  const handleEdit = (template) => {
    setFormData({
      title: template.title || "",
      subject: template.subject || "",
      category: template.category || "proposal",
      body: template.body || "",
    });
    setEditingTemplateId(template._id);
    setShowForm(true);
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this email template?");
    if (!confirmed) return;

    try {
      await deleteEmailTemplate(id);
      setMessage("Email template deleted successfully");
      fetchTemplates();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      if (editingTemplateId) {
        const res = await updateEmailTemplate(editingTemplateId, formData);
        setMessage(res.message || "Email template updated successfully");
      } else {
        const res = await createEmailTemplate(formData);
        setMessage(res.message || "Email template created successfully");
      }

      resetForm();
      fetchTemplates();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (editingTemplateId
            ? "Failed to update email template"
            : "Failed to create email template")
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <UserSidebar />

      <div className="flex-1 min-w-0 p-6 lg:p-8">
        <div className="mb-6 rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 p-6 text-white shadow-xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Email Templates</h1>
              <p className="mt-2 text-sm text-amber-50">
                Create, search, edit, and manage reusable email templates.
              </p>
            </div>

            <button
              onClick={() => {
                if (showForm && editingTemplateId) {
                  resetForm();
                } else {
                  setShowForm(!showForm);
                }
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-amber-700 shadow-lg transition hover:scale-[1.02]"
            >
              <FaPlus />
              {showForm ? "Close Form" : "Add Template"}
            </button>
          </div>
        </div>

        {showForm && (
          <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {editingTemplateId ? "Edit Template" : "Add New Template"}
                </h2>
              </div>

              {editingTemplateId && (
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
              className="grid grid-cols-1 gap-4"
            >
              <input
                name="title"
                placeholder="Template Title"
                value={formData.title}
                onChange={handleChange}
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500"
              />

              <input
                name="subject"
                placeholder="Email Subject"
                value={formData.subject}
                onChange={handleChange}
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500"
              />

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="proposal">Proposal</option>
                <option value="remainder">Remainder</option>
                <option value="followup">Followup</option>
                <option value="final">Final Call</option>
              </select>

              <textarea
                name="body"
                placeholder="Write email body here..."
                value={formData.body}
                onChange={handleChange}
                rows="10"
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500"
              />

              <button
                type="submit"
                className="rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 font-semibold text-white shadow-lg transition hover:opacity-95"
              >
                {editingTemplateId ? "Update Template" : "Save Template"}
              </button>
            </form>
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
                placeholder="Search by title, subject, or body"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">All Categories</option>
              <option value="proposal">Proposal</option>
              <option value="final">Final Call</option>
              <option value="followup">Followup</option>
              <option value="remainder">Remainder</option>
            </select>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Templates</p>
                <h3 className="mt-2 text-3xl font-bold text-slate-800">
                  {templates.length}
                </h3>
              </div>
              <div className="rounded-2xl bg-amber-100 p-3 text-amber-600">
                <FaEnvelopeOpenText />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Filtered Templates</p>
                <h3 className="mt-2 text-3xl font-bold text-slate-800">
                  {filteredTemplates.length}
                </h3>
              </div>
              <div className="rounded-2xl bg-orange-100 p-3 text-orange-600">
                <FaLayerGroup />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Lead Templates</p>
                <h3 className="mt-2 text-3xl font-bold text-slate-800">
                  {templates.filter((t) => t.category === "lead").length}
                </h3>
              </div>
              <div className="rounded-2xl bg-yellow-100 p-3 text-yellow-600">
                <FaEnvelopeOpenText />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="min-w-[1300px] w-full">
              <thead className="sticky top-0 z-10 bg-slate-100 text-left text-sm text-slate-700">
                <tr>
                  <th className="p-4 whitespace-nowrap font-semibold">Title</th>
                  <th className="p-4 whitespace-nowrap font-semibold">Subject</th>
                  <th className="p-4 whitespace-nowrap font-semibold">Category</th>
                  <th className="p-4 whitespace-nowrap font-semibold">Body Preview</th>
                  <th className="p-4 whitespace-nowrap font-semibold">Created</th>
                  <th className="p-4 whitespace-nowrap font-semibold">Updated</th>
                  <th className="p-4 whitespace-nowrap text-center font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredTemplates.length > 0 ? (
                  filteredTemplates.map((template) => (
                    <tr
                      key={template._id}
                      className="border-t border-slate-200 transition hover:bg-slate-50"
                    >
                      <td className="p-4 whitespace-nowrap font-medium text-slate-800">
                        {template.title}
                      </td>
                      <td className="p-4 whitespace-nowrap">{template.subject}</td>
                      <td className="p-4 whitespace-nowrap capitalize">
                        {template.category}
                      </td>
                      <td className="p-4 max-w-[400px] truncate">
                        {template.body}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {new Date(template.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {new Date(template.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleEdit(template)}
                            className="rounded-xl bg-blue-100 p-2 text-blue-600 transition hover:bg-blue-200"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(template._id)}
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
                      colSpan="7"
                      className="p-8 text-center text-slate-500"
                    >
                      No email templates found
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

export default UserEmailTemplates;