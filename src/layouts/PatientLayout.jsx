import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Calendar, User, FileText, Search, Home, Clock } from 'lucide-react';

export default function PatientLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/patient/dashboard' },
    { id: 'doctors', label: 'Available Doctors', icon: Search, path: '/patient/available-doctors' },
    { id: 'book', label: 'Book Appointment', icon: Clock, path: '/patient/book' },
    { id: 'appointments', label: 'My Appointments', icon: Calendar, path: '/patient/appointments' },
    { id: 'bills', label: 'View Bills', icon: FileText, path: '/patient/billing' },
    { id: 'profile', label: 'Profile', icon: User, path: '/patient/profile' }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300`}>
        <div className="p-6 border-b">
          <h1 className={`font-bold text-xl text-blue-600 ${!isSidebarOpen && 'hidden'}`}>
            Patient Portal
          </h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="mt-2 text-gray-600 hover:text-blue-600"
          >
            ☰
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <Icon size={20} />
                {isSidebarOpen && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
