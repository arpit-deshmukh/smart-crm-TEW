import { useEffect, useMemo, useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaPlus,
  FaUserTie,
  FaBuilding,
  FaDollarSign,
  FaExchangeAlt,
  FaPaperPlane,
  FaBell,
} from "react-icons/fa";
import UserSidebar from "../../components/layout/UserSidebar";
import {
  getAllLeads,
  deleteLead,
  createLead,
  updateLead,
} from "../../services/leadService";
import { convertLeadToDeal } from "../../services/dealService";
import { getAllEmailTemplates } from "../../services/emailTemplateService";
import { sendBulkLeadMail } from "../../services/leadMailService";
import { convertLeadToFollowup } from "../../services/followupService";

const UserLeads = () => {
  const [leads, setLeads] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showMailModal, setShowMailModal] = useState(false);
  const [editingLeadId, setEditingLeadId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  const [mailForm, setMailForm] = useState({
    targetStatus: "new",
    templateId: "",
  });

  const [formData, setFormData] = useState({
    title: "",
    name: "",
    company: "",
    designation: "",
    email: "",
    countryCode: "+91",
    contact: "",
    status: "new",
    source: "manual",
    sourceDetails: "",
    value: "",
  });

  const fetchLeads = async () => {
    try {
      const data = await getAllLeads();
      setLeads(data);
    } catch {
      setError("Failed to fetch leads");
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
    fetchLeads();
    fetchTemplates();
  }, []);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const displaySource =
        lead.source === "manual"
          ? "manual"
          : `${lead.source} ${lead.sourceDetails || ""}`.trim();

      const matchesSearch =
        (lead.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.company || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.designation || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (lead.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.contact || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        displaySource.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ? true : lead.status === statusFilter;

      const matchesSource =
        sourceFilter === "all" ? true : lead.source === sourceFilter;

      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [leads, searchTerm, statusFilter, sourceFilter]);

  const stats = useMemo(() => {
    return {
      total: leads.length,
      newCount: leads.filter((lead) => lead.status === "new").length,
      contacted: leads.filter((lead) => lead.status === "contacted").length,
      totalValue: leads.reduce(
        (sum, lead) => sum + (Number(lead.value) || 0),
        0
      ),
    };
  }, [leads]);

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage) || 1;

  const paginatedLeads = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLeads.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLeads, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sourceFilter]);

  const resetForm = () => {
    setFormData({
      title: "",
      name: "",
      company: "",
      designation: "",
      email: "",
      countryCode: "+91",
      contact: "",
      status: "new",
      source: "manual",
      sourceDetails: "",
      value: "",
    });
    setEditingLeadId(null);
    setShowForm(false);
  };

  const splitContact = (contactValue) => {
    if (!contactValue) return { countryCode: "+91", contact: "" };

    const parts = contactValue.split(" ");
    if (parts.length > 1 && parts[0].startsWith("+")) {
      return {
        countryCode: parts[0],
        contact: parts.slice(1).join(" "),
      };
    }

    return {
      countryCode: "+91",
      contact: contactValue,
    };
  };

  const handleEdit = (lead) => {
    const split = splitContact(lead.contact);

    setFormData({
      title: lead.title || "",
      name: lead.name || "",
      company: lead.company || "",
      designation: lead.designation || "",
      email: lead.email || "",
      countryCode: split.countryCode,
      contact: split.contact,
      status: lead.status || "new",
      source: lead.source || "manual",
      sourceDetails: lead.sourceDetails || "",
      value: lead.value ?? "",
    });

    setEditingLeadId(lead._id);
    setShowForm(true);
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleConvertToDeal = async (lead) => {
    const confirmed = window.confirm(`Convert "${lead.title}" into a deal?`);
    if (!confirmed) return;

    try {
      const payload = {
        leadId: lead._id,
        amount: Number(lead.value) || 0,
        revisedAmount: 0,
        stage: "new",
        expectedCloseDate: null,
        notes: `Converted from lead: ${lead.title}`,
      };

      const res = await convertLeadToDeal(payload);
      setMessage(res.message || "Lead converted to deal successfully");
      fetchLeads();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to convert lead to deal"
      );
    }
  };

  const handleConvertToFollowup = async (lead) => {
  const confirmed = window.confirm(
    `Convert "${lead.title}" into a followup?`
  );
  if (!confirmed) return;

  try {
    const payload = {
      leadId: lead._id,
      title: lead.title || lead.name,
      // title: `Followup for ${lead.name || lead.title}`,
      followupDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      priority: "medium",
      notes: `Converted from lead: ${lead.title}`,
    };

    const res = await convertLeadToFollowup(payload);
    setMessage(res.message || "Lead converted to followup successfully");
    fetchLeads();
  } catch (err) {
    setError(
      err.response?.data?.message || "Failed to convert lead to followup"
    );
  }
};

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this lead?");
    if (!confirmed) return;

    try {
      await deleteLead(id);
      setMessage("Lead deleted successfully");
      fetchLeads();
    } catch {
      setError("Delete failed");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (name === "source") {
        return {
          ...prev,
          source: value,
          sourceDetails: value === "manual" ? "" : prev.sourceDetails,
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleMailFormChange = (e) => {
    setMailForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSendMailForCurrentPage = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const currentPageLeadIds = paginatedLeads.map((lead) => lead._id);

      if (currentPageLeadIds.length === 0) {
        setError("No leads available on this page");
        return;
      }

      const res = await sendBulkLeadMail({
        leadIds: currentPageLeadIds,
        targetStatus: mailForm.targetStatus,
        templateId: mailForm.templateId,
      });

      setMessage(res.message || "Emails sent successfully");
      setShowMailModal(false);
      setMailForm({
        targetStatus: "new",
        templateId: "",
      });
      fetchLeads();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to send emails for current page"
      );
    }
  };

  // validations
const validateForm = () => {
  const errors = {};

  // Title
  if (!formData.title.trim()) {
    errors.title = "Title is required";
  } else if (formData.title.length < 3) {
    errors.title = "Title must be at least 3 characters";
  } else if (formData.title.length > 100) {
    errors.title = "Title cannot exceed 100 characters";
  }

  // Name
  if (!formData.name.trim()) {
    errors.name = "Name is required";
  } else if (!/^[A-Za-z\s.'-]{3,50}$/.test(formData.name)) {
    errors.name = "Invalid name (3–50 characters)";
  }

  // Email
  if (!formData.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(formData.email)) {
    errors.email = "Invalid email format";
  }

  // Contact
  if (!formData.contact.trim()) {
    errors.contact = "Contact number is required";
  } else if (!/^\d+$/.test(formData.contact)) {
    errors.contact = "Only numbers allowed";
  } else if (formData.contact.length < 7 || formData.contact.length > 15) {
    errors.contact = "Contact must be 7–15 digits";
  }

  // Value
  if (formData.value) {
    if (isNaN(formData.value)) {
      errors.value = "Value must be a number";
    } else if (Number(formData.value) < 0) {
      errors.value = "Value cannot be negative";
    }
  }

  // Source details
  if (formData.source !== "manual" && !formData.sourceDetails.trim()) {
    errors.sourceDetails = "Source details required";
  }

  // Optional fields
  if (formData.company && formData.company.length > 100) {
    errors.company = "Company name too long";
  }

  if (formData.designation && formData.designation.length > 100) {
    errors.designation = "Designation too long";
  }

  return errors;
};

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setMessage("");

  const errors = validateForm();

  if (Object.keys(errors).length > 0) {
    setFormErrors(errors);
    return;
  }

  try {
    const payload = {
      title: formData.title,
      name: formData.name,
      company: formData.company,
      designation: formData.designation,
      email: formData.email,
      contact: `${formData.countryCode} ${formData.contact}`.trim(),
      status: formData.status,
      source: formData.source,
      sourceDetails:
        formData.source === "manual" ? "" : formData.sourceDetails,
      value: Number(formData.value) || 0,
    };

    if (editingLeadId) {
      const res = await updateLead(editingLeadId, payload);
      setMessage(res.message || "Lead updated successfully");
    } else {
      const res = await createLead(payload);
      setMessage(res.message || "Lead created successfully");
    }

    setFormErrors({});
    resetForm();
    fetchLeads();
  } catch (err) {
    setError(
      err.response?.data?.message ||
        (editingLeadId ? "Failed to update lead" : "Failed to create lead")
    );
  }
};

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const formatCurrency = (value) => {
    return `$${Number(value || 0).toLocaleString()}`;
  };

  const getSourceDisplay = (lead) => {
    if (lead.source === "manual") return "manual";
    return `${lead.source} - ${lead.sourceDetails || ""}`.trim();
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <UserSidebar />

      <div className="flex-1 p-6 lg:p-8 min-w-0">
        <div className="mb-6 rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 p-6 text-white shadow-xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Lead Management</h1>
              <p className="mt-2 text-sm text-indigo-100">
                Create, search, filter, edit, convert leads, and send mail to
                current page leads.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowMailModal(true)}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 px-8 py-4 font-bold text-white shadow-xl transition-all duration-300 hover:from-blue-500 hover:to-indigo-600 hover:shadow-blue-500/25 hover:ring-2 hover:ring-blue-400 hover:ring-offset-2 active:scale-95"
              >
                {/* Moving Icon Animation */}
                <FaPaperPlane className="text-blue-100 transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-white" />
                
                <span className="tracking-wide">Send Mail</span>

                {/* Subtle gradient overlay for depth */}
                <span className="absolute inset-0 block h-full w-full bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
              </button>

              <button
  onClick={() => {
    if (showForm && editingLeadId) {
      resetForm();
    } else {
      setShowForm(!showForm);
    }
  }}
  className={`group relative inline-flex items-center gap-3 overflow-hidden rounded-xl px-8 py-4 font-bold transition-all duration-300 shadow-xl active:scale-95
    ${showForm 
      ? "bg-slate-50 text-slate-600 hover:bg-red-50 hover:text-red-600 shadow-slate-200" 
      : "bg-white text-indigo-700 hover:shadow-indigo-200"
    }`}
>
  {/* Animated Icon Container */}
  <div className={`transition-transform duration-500 ${showForm ? "rotate-45" : "group-hover:rotate-90"}`}>
    <FaPlus className={showForm ? "text-red-500" : "text-indigo-600"} />
  </div>

  <span className="relative tracking-wide">
    {showForm ? "Close Form" : "Add Lead"}
  </span>

  {/* Bottom Highlight Line */}
  <span className={`absolute bottom-0 left-0 h-1 w-0 transition-all duration-300 group-hover:w-full 
    ${showForm ? "bg-red-500" : "bg-indigo-600"}`} 
  />
</button>
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Leads</p>
                <h3 className="mt-2 text-3xl font-bold text-slate-800">
                  {stats.total}
                </h3>
              </div>
              <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-600">
                <FaUserTie />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">New Leads</p>
                <h3 className="mt-2 text-3xl font-bold text-slate-800">
                  {stats.newCount}
                </h3>
              </div>
              <div className="rounded-2xl bg-cyan-100 p-3 text-cyan-600">
                <FaBuilding />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Contacted</p>
                <h3 className="mt-2 text-3xl font-bold text-slate-800">
                  {stats.contacted}
                </h3>
              </div>
              <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-600">
                <FaFilter />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Value</p>
                <h3 className="mt-2 text-3xl font-bold text-slate-800">
                  {formatCurrency(stats.totalValue)}
                </h3>
              </div>
              <div className="rounded-2xl bg-amber-100 p-3 text-amber-600">
                <FaDollarSign />
              </div>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {editingLeadId ? "Edit Lead" : "Add New Lead"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {editingLeadId
                    ? "Update lead information and save changes."
                    : "Fill in lead information carefully before saving."}
                </p>
              </div>

              {editingLeadId && (
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
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {formErrors.title && (
  <p className="text-red-500 text-sm">{formErrors.title}</p>
)}

              <input
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {formErrors.name && (
  <p className="text-red-500 text-sm">{formErrors.name}</p>
)}

              <input
                name="company"
                placeholder="Company"
                value={formData.company}
                onChange={handleChange}
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <input
                name="designation"
                placeholder="Designation"
                value={formData.designation}
                onChange={handleChange}
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <input
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              />
{formErrors.email && (
  <p className="text-red-500 text-sm">{formErrors.email}</p>
)}

              <div className="flex gap-3">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="w-28 rounded-2xl border border-slate-300 px-3 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                  <option value="+61">+61</option>
                  <option value="+91">+91</option>
                  <option value="+971">+971</option>
                </select>

                <input
                  name="contact"
                  placeholder="Contact number"
                  value={formData.contact}
                  onChange={handleChange}
                  className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                />
{formErrors.contact && (
  <p className="text-red-500 text-sm">{formErrors.contact}</p>
)}
              </div>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="proposal">Proposal</option>
                <option value="converted">Converted</option>
                <option value="lost">Lost</option>
              </select>

              <select
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="manual">Manual</option>
                <option value="website">Website</option>
                <option value="referral">Referral</option>
                <option value="social media">Social Media</option>
                <option value="other">Other</option>
              </select>

              {formData.source !== "manual" && (
                <input
                  name="sourceDetails"
                  placeholder={`Enter ${formData.source} details`}
                  value={formData.sourceDetails}
                  onChange={handleChange}
                  className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 md:col-span-2"
                />
              )}

              <div className="relative md:col-span-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  $
                </span>
                <input
                  name="value"
                  type="number"
                  placeholder="Lead value"
                  value={formData.value}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 py-3 pl-9 pr-4 outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {formErrors.value && (
  <p className="text-red-500 text-sm">{formErrors.value}</p>
)}
              </div>

              <button
                type="submit"
                className="md:col-span-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 font-semibold text-white shadow-lg transition hover:opacity-95"
              >
                {editingLeadId ? "Update Lead" : "Save Lead"}
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
                    This sends mail only to leads on the current page.
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
                    Select Lead Status
                  </label>
                  <select
                    name="targetStatus"
                    value={mailForm.targetStatus}
                    onChange={handleMailFormChange}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="proposal">Proposal</option>
                    <option value="converted">Converted</option>
                    <option value="lost">Lost</option>
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
                  Current page leads:{" "}
                  <span className="font-semibold text-slate-900">
                    {paginatedLeads.length}
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
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
            <div className="relative lg:col-span-2">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by title, name, company, designation, email, contact or source"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="proposal">Proposal</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>

            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Sources</option>
              <option value="manual">Manual</option>
              <option value="website">Website</option>
              <option value="referral">Referral</option>
              <option value="social media">Social Media</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="min-w-[1500px] w-full">
              <thead className="sticky top-0 z-10 bg-slate-100 text-left text-sm text-slate-700">
                <tr>
                  <th className="p-4 whitespace-nowrap font-semibold">Title</th>
                  <th className="p-4 whitespace-nowrap font-semibold">Name</th>
                  <th className="p-4 whitespace-nowrap font-semibold">
                    Company
                  </th>
                  <th className="p-4 whitespace-nowrap font-semibold">
                    Designation
                  </th>
                  <th className="p-4 whitespace-nowrap font-semibold">Email</th>
                  <th className="p-4 whitespace-nowrap font-semibold">
                    Contact
                  </th>
                  <th className="p-4 whitespace-nowrap font-semibold">
                    Status
                  </th>
                  <th className="p-4 whitespace-nowrap font-semibold">
                    Source
                  </th>
                  <th className="p-4 whitespace-nowrap font-semibold">Value</th>
                  <th className="p-4 whitespace-nowrap font-semibold">
                    Created
                  </th>
                  <th className="p-4 whitespace-nowrap font-semibold">
                    Updated
                  </th>
                  <th className="p-4 whitespace-nowrap text-center font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedLeads.length > 0 ? (
                  paginatedLeads.map((lead) => (
                    <tr
                      key={lead._id}
                      className="border-t border-slate-200 transition hover:bg-slate-50"
                    >
                      <td className="p-4 whitespace-nowrap">{lead.title}</td>
                      <td className="p-4 whitespace-nowrap font-medium text-slate-800">
                        {lead.name}
                      </td>
                      <td className="p-4 whitespace-nowrap">{lead.company}</td>
                      <td className="p-4 whitespace-nowrap">
                        {lead.designation}
                      </td>
                      <td className="p-4 whitespace-nowrap">{lead.email}</td>
                      <td className="p-4 whitespace-nowrap">{lead.contact}</td>
                      <td className="p-4 whitespace-nowrap">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                            lead.status === "new"
                              ? "bg-blue-100 text-blue-700"
                              : lead.status === "contacted"
                              ? "bg-amber-100 text-amber-700"
                              : lead.status === "qualified"
                              ? "bg-emerald-100 text-emerald-700"
                              : lead.status === "proposal"
                              ? "bg-violet-100 text-violet-700"
                              : lead.status === "converted"
                              ? "bg-cyan-100 text-cyan-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {getSourceDisplay(lead)}
                      </td>
                      <td className="p-4 whitespace-nowrap font-semibold text-slate-800">
                        {formatCurrency(lead.value)}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {formatDate(lead.createdAt)}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {formatDate(lead.updatedAt)}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleEdit(lead)}
                            className="rounded-xl bg-blue-100 p-2 text-blue-600 transition hover:bg-blue-200"
                            title="Edit Lead"
                          >
                            <FaEdit />
                          </button>

                          <button
                            onClick={() => handleConvertToDeal(lead)}
                            className={`rounded-xl p-2 transition ${
                              lead.status === "converted"
                                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                : "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                            }`}
                            title={
                              lead.status === "converted"
                                ? "Already Converted"
                                : "Convert to Deal"
                            }
                            disabled={lead.status === "converted"}
                          >
                            <FaExchangeAlt />
                          </button>
                          <button
  onClick={() => handleConvertToFollowup(lead)}
  className={`rounded-xl p-2 transition ${
    lead.status === "qualified"
      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
      : "bg-violet-100 text-violet-600 hover:bg-violet-200"
  }`}
  title={
    lead.status === "qualified"
      ? "Already Converted to Followup"
      : "Convert to Followup"
  }
  disabled={lead.status === "qualified"}
>
  <FaBell />
</button>

                          <button
                            onClick={() => handleDelete(lead._id)}
                            className="rounded-xl bg-red-100 p-2 text-red-600 transition hover:bg-red-200"
                            title="Delete Lead"
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
                      colSpan="12"
                      className="p-8 text-center text-slate-500"
                    >
                      No leads found
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
                {filteredLeads.length === 0
                  ? 0
                  : (currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="text-slate-900">
                {Math.min(currentPage * itemsPerPage, filteredLeads.length)}
              </span>{" "}
              of{" "}
              <span className="text-slate-900">{filteredLeads.length}</span>{" "}
              entries
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.max(prev - 1, 1))
                }
                disabled={currentPage === 1}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  currentPage === 1
                    ? "cursor-not-allowed bg-slate-100 text-slate-400"
                    : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                }`}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1)
                .slice(
                  Math.max(currentPage - 3, 0),
                  Math.min(Math.max(currentPage - 3, 0) + 5, totalPages)
                )
                .map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                      currentPage === page
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                    }`}
                  >
                    {page}
                  </button>
                ))}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  currentPage === totalPages
                    ? "cursor-not-allowed bg-slate-100 text-slate-400"
                    : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                }`}
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

export default UserLeads;