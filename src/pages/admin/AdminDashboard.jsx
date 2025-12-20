import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { Users, UserCheck, UserX, Activity } from "lucide-react";

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
      color: "bg-blue-500",
    },
    {
      id: "pendingDoctors",
      count: stats.pendingDoctors,
      label: "Pending Approvals",
      icon: UserX,
      color: "bg-yellow-500",
    },
    {
      id: "totalPatients",
      count: stats.totalPatients,
      label: "Total Patients",
      icon: Users,
      color: "bg-green-500",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Admin Dashboard
      </h1>

      {loading ? (
        <p className="text-gray-600">Loading stats...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="p-6 bg-white rounded-xl shadow-md flex items-center space-x-6"
              >
                <div
                  className={`p-4 rounded-full ${card.color} text-white shadow-lg`}
                >
                  <Icon size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{card.count}</h2>
                  <p className="text-gray-600">{card.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Activity size={24} /> Recent System Activity
        </h2>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <ul className="text-gray-700 space-y-2">
            <li>• Doctor approvals and rejections appear here.</li>
            <li>• Admin can see system actions in upcoming versions.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
