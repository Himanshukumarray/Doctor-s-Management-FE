import React from "react";
import { NavLink } from "react-router-dom";
import menuConfig from "./menuConfig";

export default function Sidebar() {
  const role = localStorage.getItem("role");
  const menu = menuConfig[role] || [];

  return (
    <div className="w-64 h-screen bg-white shadow-md p-4 border-r">
      <h2 className="text-xl font-bold mb-6 text-blue-600">Hospital App</h2>

      <nav className="space-y-3">
        {menu.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `block p-2 rounded-md font-medium ${
                isActive
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
