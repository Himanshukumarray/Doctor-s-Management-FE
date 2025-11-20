import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { Users, UserCheck, UserX, Activity, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    pendingDoctors: 0,
    totalPatients: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [allDoctors, pendingDoctors, allPatients] = await Promise.all([
        api.get("/admin/all-doctors"),
        api.get("/admin/pending-doctors"),
        api.get("/admin/all-patients"),
      ]);

      setStats({
        totalDoctors: allDoctors.data.length,
        pendingDoctors: pendingDoctors.data.length,
        totalPatients: allPatients.data.length,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      id: "totalDoctors",
      count: stats.totalDoctors,
      label: "Total Doctors",
      icon: UserCheck,
      gradient: "from-blue-500 to-blue-600",
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
      change: "+12%"
    },
    {
      id: "pendingDoctors",
      count: stats.pendingDoctors,
      label: "Pending Approvals",
      icon: UserX,
      gradient: "from-yellow-500 to-orange-600",
      bg: "bg-yellow-50",
      iconColor: "text-yellow-600",
      change: "+3"
    },
    {
      id: "totalPatients",
      count: stats.totalPatients,
      label: "Total Patients",
      icon: Users,
      gradient: "from-green-500 to-green-600",
      bg: "bg-green-50",
      iconColor: "text-green-600",
      change: "+25%"
    },
  ];

  const recentActivities = [
    { id: 1, action: "New doctor registration", user: "Dr. Sarah Johnson", time: "2 minutes ago", type: "doctor" },
    { id: 2, action: "Doctor approved", user: "Dr. Michael Chen", time: "1 hour ago", type: "approved" },
    { id: 3, action: "New patient registered", user: "John Doe", time: "3 hours ago", type: "patient" },
    { id: 4, action: "Doctor rejected", user: "Dr. Emily White", time: "5 hours ago", type: "rejected" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Monitor and manage your healthcare platform</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              style={{ animation: `fadeIn 0.5s ease-out ${index * 0.1}s both` }}
            >
              <div className={`h-2 bg-gradient-to-r ${card.gradient}`}></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-4 ${card.bg} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={28} className={card.iconColor} />
                  </div>
                  <div className="flex items-center gap-1 text-green-600 font-semibold text-sm">
                    <TrendingUp size={16} />
                    {card.change}
                  </div>
                </div>
                <h2 className="text-4xl font-bold text-gray-800 mb-2">{card.count}</h2>
                <p className="text-gray-600 font-medium">{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <Activity className="text-blue-600" size={28} />
              Recent System Activity
            </h2>
            <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
              View All →
            </button>
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-300 bg-gradient-to-r from-white to-gray-50"
              >
                <div className={`p-3 rounded-xl ${
                  activity.type === 'doctor' ? 'bg-blue-100' :
                  activity.type === 'approved' ? 'bg-green-100' :
                  activity.type === 'rejected' ? 'bg-red-100' : 'bg-purple-100'
                }`}>
                  {activity.type === 'doctor' && <UserX className="text-blue-600" size={20} />}
                  {activity.type === 'approved' && <UserCheck className="text-green-600" size={20} />}
                  {activity.type === 'rejected' && <UserX className="text-red-600" size={20} />}
                  {activity.type === 'patient' && <Users className="text-purple-600" size={20} />}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.user}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold">
              Approve Doctors
            </button>
            <button className="w-full p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold">
              View Reports
            </button>
            <button className="w-full p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold">
              Manage Users
            </button>
            <button className="w-full p-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold">
              System Settings
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}