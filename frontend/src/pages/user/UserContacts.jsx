import { useEffect, useMemo, useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaAddressBook,
  FaUserTie,
  FaGlobe,
} from "react-icons/fa";
import PhoneInputImport from "react-phone-input-2";
const PhoneInput = PhoneInputImport.default || PhoneInputImport;
import "react-phone-input-2/lib/style.css";
import UserSidebar from "../../components/layout/UserSidebar";
import {
  createContact,
  getAllContacts,
  updateContact,
  deleteContact,
} from "../../services/contactService";

const UserContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingContactId, setEditingContactId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    designation: "",
    email: "",
    phone: "",
    country: "",
    source: "manual",
    notes: "",
  });

  const fetchContacts = async () => {
    try {
      const data = await getAllContacts();
      setContacts(data);
    } catch (err) {
      setError("Failed to fetch contacts");
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const uniqueCountries = useMemo(() => {
    const countries = contacts
      .map((contact) => contact.country)
      .filter((country) => country && country.trim() !== "")
      .sort((a, b) => a.localeCompare(b));

    return [...new Set(countries)];
  }, [contacts]);

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const matchesSearch =
        (contact.fullName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (contact.company || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (contact.designation || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (contact.email || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (contact.phone || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (contact.country || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesSource =
        sourceFilter === "all" ? true : contact.source === sourceFilter;

      const matchesCountry =
        countryFilter === "all" ? true : contact.country === countryFilter;

      return matchesSearch && matchesSource && matchesCountry;
    });
  }, [contacts, searchTerm, sourceFilter, countryFilter]);

  const resetForm = () => {
    setFormData({
      fullName: "",
      company: "",
      designation: "",
      email: "",
      phone: "",
      country: "",
      source: "manual",
      notes: "",
    });
    setEditingContactId(null);
    setShowForm(false);
  };

  const handleEdit = (contact) => {
    setFormData({
      fullName: contact.fullName || "",
      company: contact.company || "",
      designation: contact.designation || "",
      email: contact.email || "",
      phone: contact.phone ? contact.phone.replace("+", "") : "",
      country: contact.country || "",
      source: contact.source || "manual",
      notes: contact.notes || "",
    });

    setEditingContactId(contact._id);
    setShowForm(true);
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this contact?");
    if (!confirmed) return;

    try {
      await deleteContact(id);
      setMessage("Contact deleted successfully");
      fetchContacts();
    } catch (err) {
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
      if (editingContactId) {
        const res = await updateContact(editingContactId, payload);
        setMessage(res.message || "Contact updated successfully");
      } else {
        const res = await createContact(payload);
        setMessage(res.message || "Contact created successfully");
      }

      resetForm();
      fetchContacts();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (editingContactId
            ? "Failed to update contact"
            : "Failed to create contact")
      );
    }
  };

   // 1. Calculate total pages
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage) || 1;

  // 2. Slice the contacts for the current view
  const paginatedContacts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredContacts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredContacts, currentPage]);

  // 3. Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sourceFilter, countryFilter]);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <UserSidebar />

      <div className="flex-1 min-w-0 p-6 lg:p-8">
        <div className="mb-6 rounded-3xl bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-500 p-6 text-white shadow-xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Contacts Management</h1>
              <p className="mt-2 text-sm text-pink-100">
                Add, search, edit, and manage all your contacts.
              </p>
            </div>

            <button
              onClick={() => {
                if (showForm && editingContactId) {
                  resetForm();
                } else {
                  setShowForm(!showForm);
                }
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-pink-700 shadow-lg transition hover:scale-[1.02]"
            >
              <FaPlus />
              {showForm ? "Close Form" : "Add Contact"}
            </button>
          </div>
        </div>

        {showForm && (
          <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {editingContactId ? "Edit Contact" : "Add New Contact"}
                </h2>
              </div>

              {editingContactId && (
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
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500"
              />

              <input
                name="company"
                placeholder="Company"
                value={formData.company}
                onChange={handleChange}
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500"
              />

              <input
                name="designation"
                placeholder="Designation"
                value={formData.designation}
                onChange={handleChange}
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500"
              />

              <input
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500"
              />

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Phone Number
                </label>

                <PhoneInput
                  country="in"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  enableSearch
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

              <select
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="manual">Manual</option>
                <option value="website">Website</option>
                <option value="referral">Referral</option>
                <option value="social media">Social Media</option>
                <option value="other">Other</option>
              </select>

              <textarea
                name="notes"
                placeholder="Notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500 md:col-span-2"
              />

              <button
                type="submit"
                className="md:col-span-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-rose-500 py-3 font-semibold text-white shadow-lg transition hover:opacity-95"
              >
                {editingContactId ? "Update Contact" : "Save Contact"}
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
                placeholder="Search by name, company, designation, email, phone or country"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="all">All Sources</option>
              <option value="manual">Manual</option>
              <option value="website">Website</option>
              <option value="referral">Referral</option>
              <option value="social media">Social Media</option>
              <option value="other">Other</option>
            </select>

            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500"
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
                <p className="text-sm text-slate-500">Total Contacts</p>
                <h3 className="mt-2 text-3xl font-bold text-slate-800">
                  {contacts.length}
                </h3>
              </div>
              <div className="rounded-2xl bg-pink-100 p-3 text-pink-600">
                <FaAddressBook />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Filtered Contacts</p>
                <h3 className="mt-2 text-3xl font-bold text-slate-800">
                  {filteredContacts.length}
                </h3>
              </div>
              <div className="rounded-2xl bg-fuchsia-100 p-3 text-fuchsia-600">
                <FaUserTie />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Countries</p>
                <h3 className="mt-2 text-3xl font-bold text-slate-800">
                  {uniqueCountries.length}
                </h3>
              </div>
              <div className="rounded-2xl bg-rose-100 p-3 text-rose-600">
                <FaGlobe />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="min-w-[1400px] w-full">
              <thead className="sticky top-0 z-10 bg-slate-100 text-left text-sm text-slate-700">
                <tr>
                  <th className="p-4 whitespace-nowrap font-semibold">
                    Full Name
                  </th>
                  <th className="p-4 whitespace-nowrap font-semibold">
                    Company
                  </th>
                  <th className="p-4 whitespace-nowrap font-semibold">
                    Designation
                  </th>
                  <th className="p-4 whitespace-nowrap font-semibold">Email</th>
                  <th className="p-4 whitespace-nowrap font-semibold">Phone</th>
                  <th className="p-4 whitespace-nowrap font-semibold">
                    Country
                  </th>
                  <th className="p-4 whitespace-nowrap font-semibold">Source</th>
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
                {paginatedContacts.length > 0 ? (
                  paginatedContacts.map((contact) => (
                    <tr
                      key={contact._id}
                      className="border-t border-slate-200 transition hover:bg-slate-50"
                    >
                      <td className="p-4 whitespace-nowrap font-medium text-slate-800">
                        {contact.fullName}
                      </td>
                      <td className="p-4 whitespace-nowrap">{contact.company}</td>
                      <td className="p-4 whitespace-nowrap">
                        {contact.designation}
                      </td>
                      <td className="p-4 whitespace-nowrap">{contact.email}</td>
                      <td className="p-4 whitespace-nowrap">{contact.phone}</td>
                      <td className="p-4 whitespace-nowrap">{contact.country}</td>
                      <td className="p-4 whitespace-nowrap capitalize">
                        {contact.source}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {new Date(contact.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleEdit(contact)}
                            className="rounded-xl bg-blue-100 p-2 text-blue-600 transition hover:bg-blue-200"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(contact._id)}
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
                      colSpan="10"
                      className="p-8 text-center text-slate-500"
                    >
                      No contacts found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination UI */}
          <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 bg-white p-6 md:flex-row rounded-b-3xl">
            <div className="text-sm font-medium text-slate-500">
              Showing <span className="text-slate-900">{filteredContacts.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to{" "}
              <span className="text-slate-900">
                {Math.min(currentPage * itemsPerPage, filteredContacts.length)}
              </span>{" "}
              of <span className="text-slate-900">{filteredContacts.length}</span> entries
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
                  
                  // Logic to show limited page numbers
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
                          ? "bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-200"
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
                disabled={currentPage === totalPages || filteredContacts.length === 0}
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

export default UserContacts;