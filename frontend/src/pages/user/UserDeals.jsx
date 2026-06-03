import { useEffect, useMemo, useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaDollarSign,
  FaExchangeAlt,
  FaHandshake,
  FaChartLine,
} from "react-icons/fa";
import UserSidebar from "../../components/layout/UserSidebar";
import {
  getAllDeals,
  createDeal,
  updateDeal,
  deleteDeal,
} from "../../services/dealService";

const UserDeals = () => {
  const [deals, setDeals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDealId, setEditingDealId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const [formData, setFormData] = useState({
    leadId: "",
    title: "",
    company: "",
    contactPerson: "",
    email: "",
    amount: "",
    revisedAmount: "",
    stage: "new",
    expectedCloseDate: "",
    notes: "",
  });

  const fetchDeals = async () => {
    try {
      const data = await getAllDeals();
      setDeals(data);
    } catch {
      setError("Failed to fetch deals");
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      const matchesSearch =
        (deal.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (deal.company || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (deal.contactPerson || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (deal.email || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStage =
        stageFilter === "all" ? true : deal.stage === stageFilter;

      return matchesSearch && matchesStage;
    });
  }, [deals, searchTerm, stageFilter]);

  const stats = useMemo(() => {
    const totalDeals = deals.length;
    const wonDeals = deals.filter((deal) => deal.stage === "won").length;
    const negotiationDeals = deals.filter(
      (deal) => deal.stage === "negotiation"
    ).length;

    const totalAmount = deals.reduce(
      (sum, deal) => sum + (Number(deal.amount) || 0),
      0
    );

    const totalRevisedAmount = deals.reduce(
      (sum, deal) => sum + (Number(deal.revisedAmount) || 0),
      0
    );

    return {
      totalDeals,
      wonDeals,
      negotiationDeals,
      totalAmount,
      totalRevisedAmount,
    };
  }, [deals]);

  const resetForm = () => {
    setFormData({
      leadId: "",
      title: "",
      company: "",
      contactPerson: "",
      email: "",
      amount: "",
      revisedAmount: "",
      stage: "new",
      expectedCloseDate: "",
      notes: "",
    });
    setEditingDealId(null);
    setShowForm(false);
  };

  const handleEdit = (deal) => {
    setFormData({
      leadId: deal.leadId?._id || "",
      title: deal.title || "",
      company: deal.company || "",
      contactPerson: deal.contactPerson || "",
      email: deal.email || "",
      amount: deal.amount ?? "",
      revisedAmount: deal.revisedAmount ?? "",
      stage: deal.stage || "new",
      expectedCloseDate: deal.expectedCloseDate
        ? new Date(deal.expectedCloseDate).toISOString().split("T")[0]
        : "",
      notes: deal.notes || "",
    });
    setEditingDealId(deal._id);
    setShowForm(true);
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this deal?");
    if (!confirmed) return;

    try {
      await deleteDeal(id);
      setMessage("Deal deleted successfully");
      fetchDeals();
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
      const payload = {
        ...formData,
        amount: Number(formData.amount) || 0,
        revisedAmount: Number(formData.revisedAmount) || 0,
        expectedCloseDate: formData.expectedCloseDate || null,
      };

      if (editingDealId) {
        const res = await updateDeal(editingDealId, payload);
        setMessage(res.message || "Deal updated successfully");
      } else {
        const res = await createDeal(payload);
        setMessage(res.message || "Deal created successfully");
      }

      resetForm();
      fetchDeals();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (editingDealId ? "Failed to update deal" : "Failed to create deal")
      );
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
  };

  const formatCurrency = (value) => {
    return `$${Number(value || 0).toLocaleString()}`;
  };

  const totalPages = Math.ceil(filteredDeals.length / itemsPerPage) || 1;

  const paginatedDeals = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredDeals.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredDeals, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, stageFilter]);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <UserSidebar />

      <div className="flex-1 p-6 lg:p-8 min-w-0">
        <div className="mb-6 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500 p-6 text-white shadow-xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Deals Management</h1>
              <p className="mt-2 text-sm text-emerald-100">
                Create, edit, search, and manage your deals.
              </p>
            </div>

            <button
              onClick={() => {
                if (showForm && editingDealId) {
                  resetForm();
                } else {
                  setShowForm(!showForm);
                }
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-emerald-700 shadow-lg transition hover:scale-[1.02]"
            >
              <FaPlus />
              {showForm ? "Close Form" : "Add Deal"}
            </button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Deals</p>
                <h3 className="mt-2 text-3xl font-bold text-slate-800">
                  {stats.totalDeals}
                </h3>
              </div>
              <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-600">
                <FaHandshake />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Won Deals</p>
                <h3 className="mt-2 text-3xl font-bold text-slate-800">
                  {stats.wonDeals}
                </h3>
              </div>
              <div className="rounded-2xl bg-cyan-100 p-3 text-cyan-600">
                <FaChartLine />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Negotiation</p>
                <h3 className="mt-2 text-3xl font-bold text-slate-800">
                  {stats.negotiationDeals}
                </h3>
              </div>
              <div className="rounded-2xl bg-violet-100 p-3 text-violet-600">
                <FaExchangeAlt />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Amount</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-800">
                  {formatCurrency(stats.totalAmount)}
                </h3>
              </div>
              <div className="rounded-2xl bg-amber-100 p-3 text-amber-600">
                <FaDollarSign />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Revised Revenue</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-800">
                  {formatCurrency(stats.totalRevisedAmount)}
                </h3>
              </div>
              <div className="rounded-2xl bg-blue-100 p-3 text-blue-600">
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
                  {editingDealId ? "Edit Deal" : "Add New Deal"}
                </h2>
              </div>

              {editingDealId && (
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
                placeholder="Deal Title"
                value={formData.title}
                onChange={handleChange}
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
              />

              <input
                name="company"
                placeholder="Company"
                value={formData.company}
                onChange={handleChange}
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
              />

              <input
                name="contactPerson"
                placeholder="Contact Person"
                value={formData.contactPerson}
                onChange={handleChange}
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
              />

              <input
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
              />

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  $
                </span>
                <input
                  name="amount"
                  type="number"
                  placeholder="Amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 py-3 pl-9 pr-4 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  $
                </span>
                <input
                  name="revisedAmount"
                  type="number"
                  placeholder="Revised Amount"
                  value={formData.revisedAmount}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 py-3 pl-9 pr-4 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <select
                name="stage"
                value={formData.stage}
                onChange={handleChange}
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="new">New</option>
                <option value="qualified">Qualified</option>
                <option value="proposal">Proposal</option>
                <option value="negotiation">Negotiation</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>

              <input
                name="expectedCloseDate"
                type="date"
                value={formData.expectedCloseDate}
                onChange={handleChange}
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 md:col-span-2"
              />

              <textarea
                name="notes"
                placeholder="Notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 md:col-span-2"
              />

              <button
                type="submit"
                className="md:col-span-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 font-semibold text-white shadow-lg transition hover:opacity-95"
              >
                {editingDealId ? "Update Deal" : "Save Deal"}
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
                placeholder="Search by title, company, contact person or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Stages</option>
              <option value="new">New</option>
              <option value="qualified">Qualified</option>
              <option value="proposal">Proposal</option>
              <option value="negotiation">Negotiation</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="min-w-[1400px] w-full">
              <thead className="sticky top-0 z-10 bg-slate-100 text-left text-sm text-slate-700">
                <tr>
                  <th className="p-4 whitespace-nowrap font-semibold">Title</th>
                  <th className="p-4 whitespace-nowrap font-semibold">Company</th>
                  <th className="p-4 whitespace-nowrap font-semibold">
                    Contact Person
                  </th>
                  <th className="p-4 whitespace-nowrap font-semibold">Email</th>
                  <th className="p-4 whitespace-nowrap font-semibold">Amount</th>
                  <th className="p-4 whitespace-nowrap font-semibold">
                    Revised Amount
                  </th>
                  <th className="p-4 whitespace-nowrap font-semibold">Stage</th>
                  <th className="p-4 whitespace-nowrap font-semibold">
                    Expected Close
                  </th>
                  <th className="p-4 whitespace-nowrap font-semibold">
                    Linked Lead
                  </th>
                  <th className="p-4 whitespace-nowrap font-semibold">Updated</th>
                  <th className="p-4 whitespace-nowrap text-center font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedDeals.length > 0 ? (
                  paginatedDeals.map((deal) => (
                    <tr
                      key={deal._id}
                      className="border-t border-slate-200 transition hover:bg-slate-50"
                    >
                      <td className="p-4 whitespace-nowrap">{deal.title}</td>
                      <td className="p-4 whitespace-nowrap">{deal.company}</td>
                      <td className="p-4 whitespace-nowrap">
                        {deal.contactPerson}
                      </td>
                      <td className="p-4 whitespace-nowrap">{deal.email}</td>
                      <td className="p-4 whitespace-nowrap font-semibold text-slate-800">
                        {formatCurrency(deal.amount)}
                      </td>
                      <td className="p-4 whitespace-nowrap font-semibold text-slate-800">
                        {formatCurrency(deal.revisedAmount)}
                      </td>
                      <td className="p-4 whitespace-nowrap capitalize">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            deal.stage === "won"
                              ? "bg-emerald-100 text-emerald-700"
                              : deal.stage === "negotiation"
                              ? "bg-amber-100 text-amber-700"
                              : deal.stage === "proposal"
                              ? "bg-violet-100 text-violet-700"
                              : deal.stage === "qualified"
                              ? "bg-cyan-100 text-cyan-700"
                              : deal.stage === "lost"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {deal.stage}
                        </span>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {formatDate(deal.expectedCloseDate)}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {deal.leadId ? (
                          <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                            <FaExchangeAlt />
                            {deal.leadId.title}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {formatDate(deal.updatedAt)}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleEdit(deal)}
                            className="rounded-xl bg-blue-100 p-2 text-blue-600 transition hover:bg-blue-200"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(deal._id)}
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
                      No deals found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 bg-white p-6 md:flex-row rounded-b-3xl">
          <div className="text-sm font-medium text-slate-500">
            Showing{" "}
            <span className="text-slate-900">
              {filteredDeals.length === 0
                ? 0
                : (currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="text-slate-900">
              {Math.min(currentPage * itemsPerPage, filteredDeals.length)}
            </span>{" "}
            of <span className="text-slate-900">{filteredDeals.length}</span> entries
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      <span key={pageNum} className="text-slate-400 px-1">
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
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
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
              disabled={currentPage === totalPages || filteredDeals.length === 0}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDeals;