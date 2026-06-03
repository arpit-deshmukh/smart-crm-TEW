import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaClipboardCheck,
  FaHistory,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaBolt,
  FaTable
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const AdminSidebar = () => {
  // Set to true to collapse by default
  const [isCollapsed, setIsCollapsed] = useState(true); 
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FaTachometerAlt /> },
    { name: "Users", path: "/admin/users", icon: <FaUsers /> },
    { name: "Revenue Report", path: "/admin/revenue-summary", icon: <FaTable />},
    { name: "Requests", path: "/admin/requests", icon: <FaClipboardCheck /> },
    { name: "Activity", path: "/admin/activity", icon: <FaHistory /> },
    
  ];

  return (
    <div
      className={`min-h-screen bg-slate-900 text-white flex flex-col justify-between transition-all duration-300 ease-in-out relative ${
        isCollapsed ? "w-20" : "w-72"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 bg-indigo-600 rounded-full p-1.5 border-2 border-slate-900 hover:bg-indigo-500 transition-colors z-10"
      >
        {isCollapsed ? <FaChevronRight size={10} /> : <FaChevronLeft size={10} />}
      </button>

      <div>
        {/* Header Section */}
         {/* Logo Section */}
        <div className="px-4 pt-7 pb-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-400 via-violet-500 to-cyan-400 flex items-center justify-center text-xl font-bold shadow-lg">
              <FaBolt />
            </div>
            {!isCollapsed && (
              <div className="whitespace-nowrap transition-opacity duration-300">
                <h1 className="text-xl font-bold tracking-wide">Smart CRM</h1>
                <p className="text-xs text-slate-300">Admin Workspace</p>
              </div>
            )}
          </div>
        </div>

        {/* Profile Card */}
        <div className="px-3 mt-6">
          <Link to="/admin/profile">
            <div className={`rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg transition-all duration-300 hover:bg-white/15 ${
        isCollapsed ? "p-2" : "p-5"
      }`}>
              <div className="flex flex-col items-center text-center">
                <img
                  src={user?.profileImage || "https://i.pravatar.cc/150?img=12"}
                  alt="profile"
                  className={`${isCollapsed ? "w-10 h-10" : "w-16 h-16"} rounded-full object-cover border-2 border-indigo-500/50 transition-all duration-300`}
                />
                {!isCollapsed && (
                  <div className="mt-3 overflow-hidden">
                    <h3 className="text-md font-semibold truncate w-40">{user?.name || "Admin"}</h3>
                    <p className="text-xs text-slate-400 capitalize">{user?.role || "admin"}</p>
                  </div>
                )}
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="px-3 mt-4 space-y-2">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                title={isCollapsed ? item.name : ""}
                className={`flex items-center gap-4 rounded-xl px-4 py-3.5 transition-all duration-200 group ${
                  active 
                    ? "bg-indigo-600 text-white" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                } ${isCollapsed ? "justify-center px-0" : ""}`}
              >
                <span className={`text-xl ${isCollapsed ? "" : "min-w-[20px]"}`}>
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <span className="font-medium whitespace-nowrap overflow-hidden">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Section */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={logout}
          className={`w-full flex items-center gap-3 rounded-xl bg-red-500/10 text-red-500 px-4 py-3 font-semibold hover:bg-red-500 hover:text-white transition-all duration-200 ${
            isCollapsed ? "justify-center px-0" : "justify-start"
          }`}
        >
          <FaSignOutAlt className="text-lg" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;