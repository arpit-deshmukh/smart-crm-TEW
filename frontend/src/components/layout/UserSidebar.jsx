import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUserFriends,
  FaHandshake,
  FaAddressBook,
  FaEnvelopeOpenText,
  FaBell,
  FaSignOutAlt,
  FaBuilding,
  FaChevronLeft,
  FaChevronRight,
  FaBolt,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const UserSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State to manage collapse
  const [isCollapsed, setIsCollapsed] = useState(true);

  const menuItems = [
    { name: "Dashboard", path: "/user/dashboard", icon: <FaTachometerAlt /> },
    { name: "Leads", path: "/user/leads", icon: <FaUserFriends /> },
    { name: "Deals", path: "/user/deals", icon: <FaHandshake /> },
    { name: "Contacts", path: "/user/contacts", icon: <FaAddressBook /> },
    { name: "Companies", path: "/user/companies", icon: <FaBuilding /> },
    { name: "Email Templates", path: "/user/templates", icon: <FaEnvelopeOpenText /> },
    { name: "Followups", path: "/user/followups", icon: <FaBell /> },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside 
      className={`relative min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 text-white flex flex-col justify-between shadow-2xl border-r border-white/10 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-72"
      }`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full p-1.5 border-2 border-slate-900 z-50 shadow-lg transition-transform"
      >
        {isCollapsed ? <FaChevronRight size={12} /> : <FaChevronLeft size={12} />}
      </button>

      <div className="overflow-hidden">
        {/* Logo Section */}
        <div className="px-4 pt-7 pb-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-400 via-violet-500 to-cyan-400 flex items-center justify-center text-xl font-bold shadow-lg">
              <FaBolt/>
            </div>
            {!isCollapsed && (
              <div className="whitespace-nowrap transition-opacity duration-300">
                <h1 className="text-xl font-bold tracking-wide">Smart CRM</h1>
                <p className="text-xs text-slate-300">User Workspace</p>
              </div>
            )}
          </div>
        </div>

        {/* Profile Card */}
        <div className="px-3 mt-6">
  <Link to="/user/profile">
    <div
      className={`rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg transition-all duration-300 hover:bg-white/15 ${
        isCollapsed ? "p-2" : "p-5"
      }`}
    >
      <div className="flex flex-col items-center text-center">
        <div className="relative flex-shrink-0">
          <img
            src={user?.profileImage || "https://i.pravatar.cc/120?img=12"}
            alt="profile"
            className={`${
              isCollapsed ? "w-10 h-10" : "w-20 h-20"
            } rounded-full object-cover border-2 border-white/20 shadow-md transition-all duration-300`}
          />
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-400 border-2 border-slate-900"></span>
        </div>

        {!isCollapsed && (
          <div className="mt-4 whitespace-nowrap transition-opacity duration-300">
            <h3 className="text-lg font-semibold">{user?.name || "User Name"}</h3>
            <p className="text-sm text-indigo-200 capitalize">
              {user?.role || "user"}
            </p>
            <p className="mt-1 text-xs text-slate-300">View Profile</p>
          </div>
        )}
      </div>
    </div>
  </Link>
</div>

        {/* Navigation */}
        <nav className="px-3 mt-7">
          {!isCollapsed && (
            <p className="px-3 mb-3 text-xs uppercase tracking-[0.2em] text-slate-400 whitespace-nowrap">
              Main Menu
            </p>
          )}

          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  title={isCollapsed ? item.name : ""}
                  className={`group flex items-center gap-4 rounded-2xl px-4 py-3 transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg"
                      : "text-slate-200 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span
                    className={`text-xl flex-shrink-0 ${
                      isActive(item.path) ? "text-white" : "text-indigo-300 group-hover:text-white"
                    }`}
                  >
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <span className="font-medium whitespace-nowrap transition-opacity duration-300">
                      {item.name}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Bottom Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className={`flex items-center justify-center gap-2 rounded-2xl bg-red-500/90 hover:bg-red-600 text-white font-semibold py-3 transition-all duration-200 shadow-md w-full`}
        >
          <FaSignOutAlt className="flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default UserSidebar;