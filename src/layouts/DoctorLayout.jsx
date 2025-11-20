import React, { useState } from "react";
import { Home, Calendar, List, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DoctorLayout({ children, activeTab, setActiveTab }) {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, path: "/doctor/dashboard" },
    { id: "today", label: "Today's Appointments", icon: Calendar, path: "/doctor/today" },
    { id: "appointments", label: "All Appointments", icon: List, path: "/doctor/appointments" },
    { id: "profile", label: "Profile", icon: User, path: "/doctor/profile" },
  ];

  const handleNav = (item) => {
    setActiveTab(item.id);
    navigate(item.path);
  };

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-white shadow-lg transition-all duration-300`}
      >
        <div className="p-6 border-b">
          <h1
            className={`font-bold text-xl text-blue-600 ${
              !isSidebarOpen && "hidden"
            }`}
          >
            Doctor Panel
          </h1>

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="mt-2 text-gray-600 hover:text-blue-600"
          >
            ☰
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  activeTab === item.id
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon size={20} />
                {isSidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
