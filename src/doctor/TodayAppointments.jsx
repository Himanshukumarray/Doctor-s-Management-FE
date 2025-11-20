import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useToast } from "../components/ToastProvider";

export default function TodayAppointments() {
  const { showToast } = useToast();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const doctorId = localStorage.getItem("userId");
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetchTodayAppointments();
  }, []);

  const fetchTodayAppointments = async () => {
    try {
      const response = await axiosInstance.get(
        `/appointments/doctor/${doctorId}`
      );

      // Filter only today's appointments
      const todayAppointments = response.data.filter(
        (a) => a.appointmentDate === today
      );

      setAppointments(todayAppointments);
    } catch (error) {
      showToast("Failed to load today's appointments", "error");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appointmentId, newStatus) => {
    try {
      const response = await axiosInstance.put(
        `/appointments/${appointmentId}/status?status=${newStatus}`
      );

      showToast("Status updated successfully!", "success");

      // Update UI instantly
      setAppointments((prev) =>
        prev.map((item) =>
          item.id === appointmentId ? { ...item, status: newStatus } : item
        )
      );
    } catch (error) {
      showToast("Failed to update status", "error");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-semibold mb-5">Today's Appointments</h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : appointments.length === 0 ? (
        <p className="text-gray-500">No appointments for today.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt) => (
            <div
              key={appt.id}
              className="p-4 bg-white shadow rounded border flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div>
                <h3 className="text-lg font-semibold">{appt.patientName}</h3>
                <p className="text-gray-600">
                  <strong>Time:</strong> {appt.appointmentTime}
                </p>
                <p className="text-gray-600">
                  <strong>Description:</strong> {appt.description}
                </p>
                <p
                  className={`mt-1 inline-block px-2 py-1 text-xs rounded ${
                    appt.status === "PENDING"
                      ? "bg-yellow-200 text-yellow-800"
                      : appt.status === "COMPLETED"
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {appt.status}
                </p>
              </div>

              {/* Buttons */}
              <div className="mt-3 md:mt-0 flex gap-2">
                {appt.status === "PENDING" && (
                  <>
                    <button
                      onClick={() => updateStatus(appt.id, "COMPLETED")}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Complete
                    </button>

                    <button
                      onClick={() => updateStatus(appt.id, "CANCELLED")}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
