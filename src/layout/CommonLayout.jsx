import React from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

export default function CommonLayout() {
  return (
    <div className="flex">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Page Content */}
      <div className="flex-1 p-6 bg-gray-50 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}
