import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance"

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const patientId = localStorage.getItem("id");

    if (!patientId) {
      setError("Patient ID not found. Please log in again.");
      setLoading(false);
      return;
    }

    const fetchAppointments = async () => {
      try {
        const res = await axiosInstance.get(
          `/appointments/patient/${patientId}`
        );

        setAppointments(res.data);
      } catch (err) {
        setError("Failed to fetch appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-10 text-lg font-semibold">
        Loading appointments...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">My Appointments</h1>

      {appointments.length === 0 ? (
        <p className="text-center text-gray-600">No appointments found.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt) => (
            <div
              key={appt.id}
              className="border p-4 rounded-lg shadow-sm bg-white"
            >
              <h2 className="text-xl font-semibold text-blue-700">
                {appt.doctorName}
              </h2>

              <div className="mt-2 text-gray-700">
                <p>
                  <strong>Date:</strong> {appt.appointmentDate}
                </p>
                <p>
                  <strong>Time:</strong> {appt.appointmentTime}
                </p>
                <p>
                  <strong>Description:</strong> {appt.description}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`font-semibold ${appt.status === "PENDING"
                      ? "text-yellow-600"
                      : "text-green-600"
                      }`}
                  >
                    {appt.status}
                  </span>
                </p>
                <p>
                  <strong>Booked At:</strong>{" "}
                  {appt.createdAt.replace("T", " ").slice(0, 19)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
