import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useToast } from "../components/ToastProvider";

export default function AllDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();

  const role = localStorage.getItem("role");

  // Double safety (routing already protected, but UI should block too)
  if (role !== "ADMIN") {
    return (
      <div className="text-center text-red-600 mt-10 text-xl">
        Access Denied
      </div>
    );
  }

  // Fetch all doctors
  const fetchDoctors = async () => {
    try {
      const res = await axiosInstance.get("/admin/all-doctors");
      setDoctors(res.data);
    } catch (err) {
      showToast("Failed to load doctors", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">All Doctors</h2>

      {doctors.length === 0 ? (
        <div className="text-center text-gray-600 mt-10">
          No doctors found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="p-4 border rounded-lg shadow-sm bg-white"
            >
              <h3 className="text-lg font-bold">{doctor.name}</h3>
              <p className="text-gray-700">Email: {doctor.email}</p>
              <p className="text-gray-700">Phone: {doctor.phone}</p>
              <p className="text-gray-700">
                Specialization: {doctor.specialization}
              </p>
              <p className="text-gray-700 font-medium mt-2">
                Status:{" "}
                <span
                  className={`${
                    doctor.status === "APPROVED"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {doctor.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
