import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance"; 
import { Calendar, Users, Clock, CheckCircle, TrendingUp, Activity, ArrowRight, Stethoscope, FileText, User } from "lucide-react";

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const doctorId = localStorage.getItem("id");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axiosInstance.get(`/appointments/doctor/${doctorId}`);
      setAppointments(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load dashboard data");
      setLoading(false);
    }
  };

  const todayDate = new Date().toISOString().split("T")[0];
  const total = appointments.length;
  const today = appointments.filter((a) => a.appointmentDate === todayDate).length;
  const completed = appointments.filter((a) => a.status === "COMPLETED").length;
  const pending = appointments.filter((a) => a.status === "PENDING").length;

  const stats = [
    { 
      title: "Total Appointments", 
      value: total, 
      icon: Calendar, 
      color: "from-blue-500 to-blue-600",
      // bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    { 
      title: "Today's Appointments", 
      value: today, 
      icon: Clock, 
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    { 
      title: "Pending", 
      value: pending, 
      icon: Activity, 
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600"
    },
    { 
      title: "Completed", 
      value: completed, 
      icon: CheckCircle, 
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
  ];

  const quickLinks = [
    {
      title: "Today's Appointments",
      description: "View and manage today's schedule",
      icon: Calendar,
      link: "/doctor/today",
      color: "blue"
    },
    {
      title: "All Appointments",
      description: "Complete appointment history",
      icon: FileText,
      link: "/doctor/appointments",
      color: "green"
    },
    {
      title: "My Profile",
      description: "Update your information",
      icon: User,
      link: "/doctor/profile",
      color: "purple"
    },
    {
      title: "Patient Records",
      description: "Access patient information",
      icon: Users,
      link: "/doctor/patients",
      color: "orange"
    },
  ];

  const recentAppointments = appointments.slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Doctor Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back! Here's your overview</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              style={{ animation: `fadeIn 0.5s ease-out ${index * 0.1}s both` }}
            >
              <div className={`h-2 bg-gradient-to-r ${stat.color}`}></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 ${stat.bgColor} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                <p className="text-4xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Links */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Activity className="w-6 h-6 text-blue-600" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.link}
                    className="group p-5 border-2 border-gray-100 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 bg-${link.color}-100 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                        <link.icon className={`w-6 h-6 text-${link.color}-600`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                          {link.title}
                        </h4>
                        <p className="text-sm text-gray-600">{link.description}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Appointments */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-purple-600" />
                Recent
              </h3>
              <div className="space-y-3">
                {recentAppointments.length > 0 ? (
                  recentAppointments.map((appointment, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-100 rounded-xl hover:border-purple-300 hover:shadow-md transition-all duration-300 bg-gradient-to-r from-white to-purple-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <User className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 text-sm">{appointment.patientName}</p>
                          <p className="text-xs text-gray-600">{appointment.appointmentDate}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          appointment.status === "COMPLETED" 
                            ? "bg-green-100 text-green-700" 
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No recent appointments</p>
                  </div>
                )}
              </div>
              {recentAppointments.length > 0 && (
                <a
                  href="/doctor/appointments"
                  className="mt-4 block text-center text-blue-600 hover:text-blue-700 font-semibold text-sm"
                >
                  View All →
                </a>
              )}
            </div>
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