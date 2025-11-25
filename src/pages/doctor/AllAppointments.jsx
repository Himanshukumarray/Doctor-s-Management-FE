import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance"
import { useToast } from "../../components/ToastProvider";

export default function AllAppointments() {
  const { showToast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const doctorId = localStorage.getItem("id"); // doctorId stored after login

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axiosInstance.get(
        `/appointments/doctor/${doctorId}`
      );
      setAppointments(response.data);
    } catch (error) {
      showToast("Failed to load appointments", "error");
    } finally {
      setLoading(false);
    }
  };

  // ⭐ NEW: Mark as Completed Function
  const markAsCompleted = async (appointmentId) => {
    try {
      await axiosInstance.put(
        `/appointments/${appointmentId}/status?status=Completed`
      );
      showToast("Appointment marked as completed!", "success");
      fetchAppointments(); // reload list
    } catch (error) {
      console.error(error);
      showToast("Failed to update appointment status", "error");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">All Appointments</h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : appointments.length === 0 ? (
        <p className="text-gray-500">No appointments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow rounded">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border">ID</th>
                <th className="p-3 border">Patient</th>
                <th className="p-3 border">Date</th>
                <th className="p-3 border">Time</th>
                <th className="p-3 border">Description</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-gray-50">
                  <td className="p-3 border">{apt.id}</td>
                  <td className="p-3 border">{apt.patientName}</td>
                  <td className="p-3 border">{apt.appointmentDate}</td>
                  <td className="p-3 border">{apt.appointmentTime}</td>
                  <td className="p-3 border">{apt.description}</td>

                  {/* Status */}
                  <td className="p-3 border">
                    <span
                      className={`px-3 py-1 rounded text-white text-sm ${
                        apt.status === "COMPLETED"
                          ? "bg-green-600"
                          : apt.status === "CANCELLED"
                          ? "bg-red-600"
                          : "bg-yellow-600"
                      }`}
                    >
                      {apt.status}
                    </span>
                  </td>

                  {/* Action Button */}
                  <td className="p-3 border">
                    {apt.status === "PENDING" ? (
                      <button
                        onClick={() => markAsCompleted(apt.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                      >
                        Mark Completed
                      </button>
                    ) : (
                      <span className="text-gray-400 text-sm">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
