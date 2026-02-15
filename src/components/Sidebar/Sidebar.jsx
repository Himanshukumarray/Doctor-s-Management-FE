import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Activity,
  Menu,
  X
} from "lucide-react";
import menuConfig from "./menuConfig";

export default function Sidebar() {
  const role = localStorage.getItem("role");
  const userName = localStorage.getItem("userName") || "Admin User";
  const userEmail = localStorage.getItem("userEmail") || "admin@hospital.com";
  const menu = menuConfig[role] || [];
  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const getRoleBadgeColor = () => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'doctor':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'patient':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-gray-100 bg-[#BFC9D1]">
        <div className="flex items-center justify-between mb-4">
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Activity className="text-white" size={20} strokeWidth={2.5} />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  MediCare
                </h2>
                <p className="text-xs text-gray-500">Management System</p>
              </div>
            )}
          </div>

          {/* Desktop Collapse Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* User Profile */}
        {!isCollapsed && (
          <div className="mt-4 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                <User className="text-white" size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">{userName}</p>
                <p className="text-xs text-gray-600 truncate">{userEmail}</p>
              </div>
            </div>
            <div className="mt-2">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${getRoleBadgeColor()}`}>
                {role?.charAt(0).toUpperCase() + role?.slice(1)}
              </span>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="mt-4 flex justify-center">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
              <User className="text-white" size={20} />
            </div>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto bg-[#BFC9D1]">
        <div className="space-y-1">
          {menu.map((item, index) => {
            const Icon = item.icon || Activity;
            return (
              <NavLink
                key={index}
                to={item.path}
                end
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                    : "text-gray-700 hover:bg-gray-100 hover:shadow-md"
                  } ${isCollapsed ? 'justify-center' : ''}`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={20}
                      className={`${isActive ? 'text-white' : 'text-gray-600 group-hover:text-blue-600'} transition-colors flex-shrink-0`}
                      strokeWidth={2}
                    />
                    {!isCollapsed && (
                      <span className="flex-1">{item.label}</span>
                    )}
                    {!isCollapsed && isActive && (
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    )}

                    {isCollapsed && (
                      <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl">
                        {item.label}
                        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                      </div>
                    )}
                  </>
                )}
              </NavLink>

            );
          })}
        </div>
      </nav>

      {/* Footer Section */}
      <div className="p-4 border-t border-gray-100 bg-[#BFC9D1]">
        {!isCollapsed ? (
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-all duration-200 hover:shadow-md group"
          >
            <LogOut size={20} className="group-hover:rotate-12 transition-transform" strokeWidth={2} />
            <span>Logout</span>
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full flex justify-center items-center p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:shadow-md group relative"
          >
            <LogOut size={20} className="group-hover:rotate-12 transition-transform" strokeWidth={2} />
            <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl">
              Logout
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
            </div>
          </button>
        )}

        {!isCollapsed && (
          <div className="mt-3 p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>System Status</span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Online
              </span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full w-4/5"></div>
            </div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:flex flex-col h-screen bg-white shadow-xl border-r border-gray-200 transition-all duration-300 ${isCollapsed ? "w-20" : "w-72"
          }`}
      >
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-2xl transform transition-transform duration-300 ${isMobileOpen ? "translate-x-0" : "-translate-x-full"
          } flex flex-col`}
      >
        <SidebarContent />
      </div>
    </>
  );
}