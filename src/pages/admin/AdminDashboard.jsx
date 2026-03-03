import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance"
import { Users, UserCheck, UserX, Activity, TrendingUp, Calendar, Clock } from "lucide-react";

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
      bgLight: "bg-blue-50",
      textColor: "text-blue-600",
      trend: "+12%",
      trendUp: true,
    },
    {
      id: "pendingDoctors",
      count: stats.pendingDoctors,
      label: "Pending Approvals",
      icon: Clock,
      gradient: "from-amber-500 to-orange-600",
      bgLight: "bg-amber-50",
      textColor: "text-amber-600",
      trend: "Requires Action",
      trendUp: false,
    },
    {
      id: "totalPatients",
      count: stats.totalPatients,
      label: "Total Patients",
      icon: Users,
      gradient: "from-emerald-500 to-green-600",
      bgLight: "bg-emerald-50",
      textColor: "text-emerald-600",
      trend: "+8%",
      trendUp: true,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: "New doctor registration",
      user: "Dr. Sarah Johnson",
      time: "2 hours ago",
      type: "pending",
    },
    {
      id: 2,
      action: "Doctor approved",
      user: "Dr. Michael Chen",
      time: "5 hours ago",
      type: "success",
    },
    {
      id: 3,
      action: "New patient registered",
      user: "John Doe",
      time: "1 day ago",
      type: "info",
    },
    {
      id: 4,
      action: "Doctor profile updated",
      user: "Dr. Emily White",
      time: "2 days ago",
      type: "info",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <Calendar size={16} />
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-lg border border-gray-100">
            <Activity className="text-green-500 animate-pulse" size={20} />
            <div>
              <p className="text-xs text-gray-500">System Status</p>
              <p className="text-sm font-semibold text-gray-800">All Systems Operational</p>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-600 mt-4 text-center">Loading stats...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {cards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Gradient Background Accent */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.gradient} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}></div>
                  
                  <div className="relative p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl ${card.bgLight} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={card.textColor} size={28} strokeWidth={2} />
                      </div>
                      {card.trendUp !== undefined && (
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          card.trendUp 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {card.trendUp && <TrendingUp size={12} className="inline mr-1" />}
                          {card.trend}
                        </span>
                      )}
                    </div>
                    
                    <div>
                      <h2 className="text-4xl font-bold text-gray-800 mb-1">
                        {card.count}
                      </h2>
                      <p className="text-gray-500 font-medium">{card.label}</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${card.gradient} rounded-full transition-all duration-1000`}
                        style={{ width: `${Math.min((card.count / 100) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Activity Feed */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Activity className="text-blue-600" size={24} />
                    Recent System Activity
                  </h2>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                    View All
                  </button>
                </div>

                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200 border border-gray-100"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'success' ? 'bg-green-500' :
                        activity.type === 'pending' ? 'bg-amber-500' :
                        'bg-blue-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">{activity.action}</p>
                        <p className="text-gray-600 text-sm">{activity.user}</p>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
                <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-3 text-left transition-all duration-200 hover:scale-105">
                    <p className="font-semibold">Approve Doctors</p>
                    <p className="text-sm opacity-90">{stats.pendingDoctors} pending</p>
                  </button>
                  <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-3 text-left transition-all duration-200 hover:scale-105">
                    <p className="font-semibold">Manage Users</p>
                    <p className="text-sm opacity-90">View all users</p>
                  </button>
                  <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-3 text-left transition-all duration-200 hover:scale-105">
                    <p className="font-semibold">System Reports</p>
                    <p className="text-sm opacity-90">Generate reports</p>
                  </button>
                </div>
              </div>

              {/* System Health */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">System Health</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Server Load</span>
                      <span className="text-green-600 font-semibold">42%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '42%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Database</span>
                      <span className="text-blue-600 font-semibold">68%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">API Requests</span>
                      <span className="text-purple-600 font-semibold">85%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}