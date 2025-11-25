import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useToast } from "../../components/ToastProvider";

export default function PendingDoctors() {
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();

  const role = localStorage.getItem("role");

  // Only admin can access (double safety check)
  if (role !== "ADMIN") {
    return (
      <div className="text-center text-red-600 mt-10 text-xl">
        Access Denied
      </div>
    );
  }

  // Fetch pending doctors
  const fetchPendingDoctors = async () => {
    try {
      const res = await axiosInstance.get("/admin/pending-doctors");
      setPendingDoctors(res.data);
    } catch (error) {
      showToast("Failed to load pending doctors", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingDoctors();
  }, []);

  // Approve doctor
  const handleApprove = async (id) => {
    try {
      await axiosInstance.put(`/admin/approve/${id}`);
      showToast("Doctor approved successfully", "success");

      // update UI
      setPendingDoctors((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      showToast("Failed to approve doctor", "error");
    }
  };

  // Reject doctor
  const handleReject = async (id) => {
    try {
      await axiosInstance.put(`/admin/reject/${id}`);
      showToast("Doctor rejected successfully", "success");

      // update UI
      setPendingDoctors((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      showToast("Failed to reject doctor", "error");
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Pending Doctors</h2>

      {pendingDoctors.length === 0 ? (
        <div className="text-gray-600 text-center mt-10">
          No pending doctor requests.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="p-4 border rounded-lg shadow-sm bg-white"
            >
              <h3 className="text-lg font-semibold">{doctor.name}</h3>
              <p className="text-gray-700">Email: {doctor.email}</p>
              <p className="text-gray-700">Specialization: {doctor.specialization}</p>
              <p className="text-gray-700">Status: {doctor.status}</p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleApprove(doctor.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Approve
                </button>

                <button
                  onClick={() => handleReject(doctor.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
