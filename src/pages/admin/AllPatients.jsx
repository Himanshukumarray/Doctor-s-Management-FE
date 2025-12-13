import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance"
import { useToast } from "../../components/ToastProvider";

export default function AllPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();

  const role = localStorage.getItem("role");

  if (role !== "ADMIN") {
    return (
      <div className="text-center text-red-600 mt-10 text-xl">
        Access Denied
      </div>
    );
  }

  const fetchPatients = async () => {
    try {
      const res = await axiosInstance.get("/admin/all-patients");
      setPatients(res.data);
    } catch (err) {
      showToast("Failed to load patients", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">All Patients</h2>

      {patients.length === 0 ? (
        <div className="text-center text-gray-600 mt-10">
          No patients found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {patients.map((patient) => (
            <div
              key={patient.id}
              className="p-4 border rounded-lg shadow-sm bg-white"
            >
              <h3 className="text-lg font-bold">{patient.name}</h3>
              <p className="text-gray-700">Email: {patient.email}</p>
              <p className="text-gray-700">Phone: {patient.phone}</p>

              <p className="text-gray-700 font-medium mt-2">
                Status:{" "}
                <span
                  className={`${
                    patient.status === "ACTIVE"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {patient.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
