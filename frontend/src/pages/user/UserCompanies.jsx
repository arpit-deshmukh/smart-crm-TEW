import { useEffect, useMemo, useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaBuilding,
  FaGlobe,
} from "react-icons/fa";
import PhoneInputImport from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import UserSidebar from "../../components/layout/UserSidebar";
import {
  createCompany,
  getAllCompanies,
  updateCompany,
  deleteCompany,
} from "../../services/companyService";

const PhoneInput = PhoneInputImport.default || PhoneInputImport;

const UserCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCompanyId, setEditingCompanyId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // --- Pagination Logic ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    website: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    status: "prospect",
    notes: "",
  });

  const fetchCompanies = async () => {
    try {
      const data = await getAllCompanies();
      setCompanies(data);
    } catch {
      setError("Failed to fetch companies");
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const uniqueCountries = useMemo(() => {
    const countries = companies
      .map((company) => company.country)
      .filter((country) => country && country.trim() !== "")
      .sort((a, b) => a.localeCompare(b));

    return [...new Set(countries)];
  }, [companies]);

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const matchesSearch =
        (company.companyName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (company.industry || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (company.website || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (company.email || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (company.phone || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (company.country || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (company.city || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ? true : company.status === statusFilter;

      const matchesCountry =
        countryFilter === "all" ? true : company.country === countryFilter;

      return matchesSearch && matchesStatus && matchesCountry;
    });
  }, [companies, searchTerm, statusFilter, countryFilter]);

  const resetForm = () => {
    setFormData({
      companyName: "",
      industry: "",
      website: "",
      email: "",
      phone: "",
      country: "",
      city: "",
      status: "prospect",
      notes: "",
    });
    setEditingCompanyId(null);
    setShowForm(false);
  };

  const handleEdit = (company) => {
    setFormData({
      companyName: company.companyName || "",
      industry: company.industry || "",
      website: company.website || "",
      email: company.email || "",
      phone: company.phone ? company.phone.replace("+", "") : "",
      country: company.country || "",
      city: company.city || "",
      status: company.status || "prospect",
      notes: company.notes || "",
    });
    setEditingCompanyId(company._id);
    setShowForm(true);
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this company?");
    if (!confirmed) return;

    try {
      await deleteCompany(id);
      setMessage("Company deleted successfully");
      fetchCompanies();
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

  const handlePhoneChange = (value, countryData) => {
    setFormData((prev) => ({
      ...prev,
      phone: value || "",
      country: countryData?.name || "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const payload = {
      ...formData,
      phone: formData.phone ? `+${formData.phone}` : "",
    };

    try {
      if (editingCompanyId) {
        const res = await updateCompany(editingCompanyId, payload);
        setMessage(res.message || "Company updated successfully");
      } else {
        const res = await createCompany(payload);
        setMessage(res.message || "Company created successfully");
      }

      resetForm();
      fetchCompanies();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (editingCompanyId
            ? "Failed to update company"
            : "Failed to create company")
      );
    }
  };

  // 1. Calculate total pages (based on the filtered result)
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage) || 1;

  // 2. Slice the data for the current page
  const paginatedCompanies = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCompanies.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCompanies, currentPage]);

  // 3. Reset to page 1 whenever search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, countryFilter]);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <UserSidebar />

      <div className="flex-1 min-w-0 p-6 lg:p-8">
        <div className="mb-6 rounded-3xl bg-gradient-to-r from-sky-600 via-cyan-600 to-teal-500 p-6 text-white shadow-xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Companies Management</h1>
              <p className="mt-2 text-sm text-cyan-100">
                Add, search, edit, and manage all your companies.
              </p>
            </div>

            <button
              onClick={() => {
                if (showForm && editingCompanyId) {
                  resetForm();
                } else {
                  setShowForm(!showForm);
                }
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-cyan-700 shadow-lg transition hover:scale-[1.02]"
            >
              <FaPlus />
              {showForm ? "Close Form" : "Add Company"}
            </button>
          </div>
        </div>

        {showForm && (
          <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {editingCompanyId ? "Edit Company" : "Add New Company"}
                </h2>
              </div>

              {editingCompanyId && (
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
                name="companyName"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={handleChange}
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
              />

              <input
                name="industry"
                placeholder="Industry"
                value={formData.industry}
                onChange={handleChange}
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
              />

              <input
                name="website"
                placeholder="Website"
                value={formData.website}
                onChange={handleChange}
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
              />

              <input
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
              />

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Phone Number
                </label>

                <PhoneInput
                  country="in"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  enableSearch={true}
                  countryCodeEditable={false}
                  inputStyle={{
                    width: "100%",
                    height: "48px",
                    borderRadius: "16px",
                    border: "1px solid #cbd5e1",
                    paddingLeft: "52px",
                    fontSize: "16px",
                  }}
                  buttonStyle={{
                    borderTopLeftRadius: "16px",
                    borderBottomLeftRadius: "16px",
                    border: "1px solid #cbd5e1",
                    background: "#fff",
                  }}
                  containerStyle={{ width: "100%" }}
                  dropdownStyle={{ color: "#0f172a" }}
                  searchStyle={{
                    width: "90%",
                    margin: "8px auto",
                    padding: "8px",
                  }}
                />
              </div>

              <input
                name="country"
                placeholder="Country"
                value={formData.country}
                readOnly
                className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none"
              />

              <input
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
              />

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="prospect">Prospect</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <textarea
                name="notes"
                placeholder="Notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500 md:col-span-2"
              />

              <button
                type="submit"
                className="md:col-span-2 rounded-2xl bg-gradient-to-r from-sky-600 to-teal-500 py-3 font-semibold text-white shadow-lg transition hover:opacity-95"
              >
                {editingCompanyId ? "Update Company" : "Save Company"}
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
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
            <div className="relative lg:col-span-2">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by company, industry, website, email, phone, country or city"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="all">All Status</option>
              <option value="prospect">Prospect</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="all">All Countries</option>
              {uniqueCountries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Companies</p>
                <h3 className="mt-2 text-3xl font-bold text-slate-800">
                  {companies.length}
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
                <p className="text-sm text-slate-500">Filtered Companies</p>
                <h3 className="mt-2 text-3xl font-bold text-slate-800">
                  {filteredCompanies.length}
                </h3>
              </div>
              <div className="rounded-2xl bg-sky-100 p-3 text-sky-600">
                <FaGlobe />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Active Companies</p>
                <h3 className="mt-2 text-3xl font-bold text-slate-800">
                  {companies.filter((company) => company.status === "active").length}
                </h3>
              </div>
              <div className="rounded-2xl bg-teal-100 p-3 text-teal-600">
                <FaBuilding />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="min-w-[1500px] w-full">
              <thead className="sticky top-0 z-10 bg-slate-100 text-left text-sm text-slate-700">
                <tr>
                  <th className="p-4 whitespace-nowrap font-semibold">Company Name</th>
                  <th className="p-4 whitespace-nowrap font-semibold">Industry</th>
                  <th className="p-4 whitespace-nowrap font-semibold">Website</th>
                  <th className="p-4 whitespace-nowrap font-semibold">Email</th>
                  <th className="p-4 whitespace-nowrap font-semibold">Phone</th>
                  <th className="p-4 whitespace-nowrap font-semibold">Country</th>
                  <th className="p-4 whitespace-nowrap font-semibold">City</th>
                  <th className="p-4 whitespace-nowrap font-semibold">Status</th>
                  <th className="p-4 whitespace-nowrap font-semibold">Created</th>
                  <th className="p-4 whitespace-nowrap font-semibold">Updated</th>
                  <th className="p-4 whitespace-nowrap text-center font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedCompanies.length > 0 ? (
                  paginatedCompanies.map((company) => (
                    <tr
                      key={company._id}
                      className="border-t border-slate-200 transition hover:bg-slate-50"
                    >
                      <td className="p-4 whitespace-nowrap font-medium text-slate-800">
                        {company.companyName}
                      </td>
                      <td className="p-4 whitespace-nowrap">{company.industry}</td>
                      <td className="p-4 whitespace-nowrap">{company.website}</td>
                      <td className="p-4 whitespace-nowrap">{company.email}</td>
                      <td className="p-4 whitespace-nowrap">{company.phone}</td>
                      <td className="p-4 whitespace-nowrap">{company.country}</td>
                      <td className="p-4 whitespace-nowrap">{company.city}</td>
                      <td className="p-4 whitespace-nowrap capitalize">
                        {company.status}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {new Date(company.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {new Date(company.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleEdit(company)}
                            className="rounded-xl bg-blue-100 p-2 text-blue-600 transition hover:bg-blue-200"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(company._id)}
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
                      No companies found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
                {/* Pagination UI */}
          <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 bg-white p-6 md:flex-row rounded-b-3xl">
            <div className="text-sm font-medium text-slate-500">
              Showing <span className="text-slate-900">{filteredCompanies.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to{" "}
              <span className="text-slate-900">
                {Math.min(currentPage * itemsPerPage, filteredCompanies.length)}
              </span>{" "}
              of <span className="text-slate-900">{filteredCompanies.length}</span> entries
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
                  
                  // Logic to show limited page numbers if totalPages is large
                  if (
                    totalPages > 5 &&
                    pageNum !== 1 &&
                    pageNum !== totalPages &&
                    Math.abs(pageNum - currentPage) > 1
                  ) {
                    if (Math.abs(pageNum - currentPage) === 2) 
                      return <span key={pageNum} className="text-slate-400 px-1">...</span>;
                    return null;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`h-10 w-10 rounded-xl text-sm font-bold transition-all ${
                        currentPage === pageNum
                          ? "bg-cyan-600 text-white shadow-lg shadow-cyan-200"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || filteredCompanies.length === 0}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default UserCompanies;