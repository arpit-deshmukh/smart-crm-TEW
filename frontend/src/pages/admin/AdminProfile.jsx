import { useEffect, useRef, useState } from "react";
import {
  FaUserEdit,
  FaLock,
  FaTrash,
  FaEnvelope,
  FaPhone,
  FaUser,
  FaCamera,
  FaImage,
  FaTimes,
  FaShieldAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/layout/AdminSidebar";
import {
  getProfile,
  updateProfile,
  updatePassword,
  deleteAccount,
} from "../../services/profileService";
import { useAuth } from "../../context/AuthContext";

const DEFAULT_PROFILE_IMAGE = "https://i.pravatar.cc/150?img=12";

const AdminProfile = () => {
  const navigate = useNavigate();
  const { logout, refreshUser } = useAuth();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [imagePreviewError, setImagePreviewError] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    role: "",
    phone: "",
    profileImage: "",
    bio: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [validationErrors, setValidationErrors] = useState({});

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile();

      setProfileData({
        name: data.user.name || "",
        email: data.user.email || "",
        role: data.user.role || "",
        phone: data.user.phone || "",
        profileImage: data.user.profileImage || DEFAULT_PROFILE_IMAGE,
        bio: data.user.bio || "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const validateProfileForm = () => {
    const errors = {};

    if (!profileData.name.trim()) {
      errors.name = "Name is required";
    } else if (profileData.name.trim().length < 3) {
      errors.name = "Name must be at least 3 characters";
    }

    if (profileData.phone && !/^[0-9+\-\s()]{7,20}$/.test(profileData.phone)) {
      errors.phone = "Enter a valid phone number";
    }

    if (
      profileData.profileImage &&
      !profileData.profileImage.startsWith("data:image") &&
      !/^https?:\/\/.+/i.test(profileData.profileImage)
    ) {
      errors.profileImage = "Enter a valid image URL";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
    } else if (!/[A-Z]/.test(passwordData.newPassword)) {
      errors.newPassword = "Include at least 1 uppercase letter";
    } else if (!/[0-9]/.test(passwordData.newPassword)) {
      errors.newPassword = "Include at least 1 number";
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Confirm your new password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileChange = (e) => {
    setProfileData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setValidationErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));

    if (e.target.name === "profileImage") {
      setImagePreviewError(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setValidationErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const handleChooseFromDevice = () => {
    fileInputRef.current?.click();
    setShowImageOptions(false);
  };

  const handleRemoveImage = () => {
    setProfileData((prev) => ({
      ...prev,
      profileImage: DEFAULT_PROFILE_IMAGE,
    }));
    setImagePreviewError(false);
    setShowImageOptions(false);
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Image size should be less than 2MB");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfileData((prev) => ({
        ...prev,
        profileImage: reader.result,
      }));
      setImagePreviewError(false);
      setMessage("Image selected successfully. Click Update Profile to save it.");
    };

    reader.readAsDataURL(file);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!validateProfileForm()) return;

    try {
      const res = await updateProfile({
        name: profileData.name,
        phone: profileData.phone,
        profileImage: profileData.profileImage,
        bio: profileData.bio,
      });

      setMessage(res.message || "Profile updated successfully");
      await refreshUser();
      fetchProfile();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!validatePasswordForm()) return;

    try {
      const res = await updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setMessage(res.message || "Password updated successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setValidationErrors({});
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this admin account? This cannot be undone."
    );
    if (!confirmed) return;

    try {
      await deleteAccount();
      await logout();
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete account");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-100">
        <AdminSidebar />
        <div className="flex flex-1 items-center justify-center text-slate-700">
          Loading admin profile...
        </div>
      </div>
    );
  }

  const displayImage =
    imagePreviewError || !profileData.profileImage
      ? DEFAULT_PROFILE_IMAGE
      : profileData.profileImage;

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />

      <div className="flex-1 min-w-0 p-6 lg:p-8">
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-800 to-violet-700 p-8 text-white shadow-xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="relative">
              <img
                src={displayImage}
                alt="profile"
                onError={() => setImagePreviewError(true)}
                className="h-28 w-28 rounded-full border-4 border-white/20 object-cover shadow-xl"
              />

              <button
                type="button"
                onClick={() => setShowImageOptions((prev) => !prev)}
                className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full bg-white text-indigo-700 shadow-lg hover:bg-slate-100"
              >
                <FaCamera />
              </button>

              {showImageOptions && (
                <div className="absolute left-0 top-[120px] z-20 w-52 rounded-2xl bg-white p-2 text-sm shadow-2xl border border-slate-200">
                  <button
                    type="button"
                    onClick={handleChooseFromDevice}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-slate-700 hover:bg-slate-100"
                  >
                    <FaImage className="text-indigo-600" />
                    Choose from device
                  </button>

                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-600 hover:bg-red-50"
                  >
                    <FaTimes />
                    Remove image
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="hidden"
              />
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">{profileData.name}</h1>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
                  ADMIN
                </span>
              </div>
              <p className="mt-2 text-slate-200">{profileData.email}</p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
                <FaShieldAlt />
                Full Administrative Access
              </div>
            </div>
          </div>
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

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2 rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
            <div className="mb-5 flex items-center gap-3">
              <FaUserEdit className="text-indigo-600" />
              <h2 className="text-2xl font-bold text-slate-800">
                Edit Admin Profile
              </h2>
            </div>

            <form
              onSubmit={handleProfileSubmit}
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {validationErrors.name && (
                  <p className="mt-1 text-xs text-red-500">{validationErrors.name}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  readOnly
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {validationErrors.phone && (
                  <p className="mt-1 text-xs text-red-500">{validationErrors.phone}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Profile Image URL
                </label>
                <input
                  type="text"
                  name="profileImage"
                  value={profileData.profileImage}
                  onChange={handleProfileChange}
                  placeholder="Paste image URL here"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {validationErrors.profileImage && (
                  <p className="mt-1 text-xs text-red-500">{validationErrors.profileImage}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="mb-3 text-sm font-medium text-slate-700">
                    Live Image Preview
                  </p>
                  <img
                    src={displayImage}
                    alt="Preview"
                    onError={() => setImagePreviewError(true)}
                    className="h-24 w-24 rounded-full object-cover border border-slate-300"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Bio
                </label>
                <textarea
                  name="bio"
                  rows="4"
                  value={profileData.bio}
                  onChange={handleProfileChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="md:col-span-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 font-semibold text-white shadow-lg transition hover:opacity-95"
              >
                Update Profile
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
              <div className="mb-5 flex items-center gap-3">
                <FaUser className="text-cyan-600" />
                <h2 className="text-xl font-bold text-slate-800">
                  Admin Info
                </h2>
              </div>

              <div className="space-y-4 text-slate-700">
                <div className="flex items-center gap-3">
                  <FaUser className="text-slate-400" />
                  <span>{profileData.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-slate-400" />
                  <span>{profileData.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaPhone className="text-slate-400" />
                  <span>{profileData.phone || "No phone added"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaShieldAlt className="text-slate-400" />
                  <span className="capitalize">{profileData.role}</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
              <div className="mb-5 flex items-center gap-3">
                <FaLock className="text-amber-600" />
                <h2 className="text-xl font-bold text-slate-800">
                  Update Password
                </h2>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <input
                    type="password"
                    name="currentPassword"
                    placeholder="Current Password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  {validationErrors.currentPassword && (
                    <p className="mt-1 text-xs text-red-500">
                      {validationErrors.currentPassword}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="New Password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  {validationErrors.newPassword && (
                    <p className="mt-1 text-xs text-red-500">
                      {validationErrors.newPassword}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm New Password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  {validationErrors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-500">
                      {validationErrors.confirmPassword}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 py-3 font-semibold text-white shadow-lg transition hover:opacity-95"
                >
                  Update Password
                </button>
              </form>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm border border-red-200">
              <div className="mb-4 flex items-center gap-3">
                <FaTrash className="text-red-600" />
                <h2 className="text-xl font-bold text-red-700">
                  Danger Zone
                </h2>
              </div>

              <p className="mb-4 text-sm text-slate-600">
                Deleting this admin account is permanent and cannot be undone.
              </p>

              <button
                onClick={handleDeleteAccount}
                className="w-full rounded-2xl bg-red-600 py-3 font-semibold text-white shadow-lg transition hover:bg-red-700"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;