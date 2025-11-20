import React, { useState, useEffect } from "react";
import api from "../api/axiosInstance"

export default function AvailableDoctors({ onBookDoctor }) {
  const [doctors, setDoctors] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const specialties = [
    "all",
    "Cardiology",
    "Dermatology",
    "Pediatrics",
    "Orthopedics",
    "Neurology",
  ];

  // Fetch doctors automatically
  useEffect(() => {
    const fetchDoctors = async () => {
      try {

        const token = localStorage.getItem("token");

        const { data } = await api.get("/users/doctors"); 
        setDoctors(data);
      } catch (err) {
        setError("Failed to load doctors");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors =
    selectedSpecialty === "all"
      ? doctors
      : doctors.filter((doc) => doc.specialty === selectedSpecialty);

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-600 text-lg">
        Loading doctors...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Available Doctors</h2>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Specialty
        </label>
        <select
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {specialties.map((spec) => (
            <option key={spec} value={spec}>
              {spec === "all" ? "All Specialties" : spec}
            </option>
          ))}
        </select>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No doctors available.
          </div>
        ) : (
          filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
            >
              <div className="text-4xl mb-4">{doctor.image || "👨‍⚕️"}</div>
              <h3 className="font-bold text-lg mb-1">{doctor.name}</h3>
              <p className="text-blue-600 mb-2">{doctor.specialty}</p>
              <p className="text-gray-600 text-sm mb-3">{doctor.experience}</p>

              {doctor.rating && (
                <div className="flex items-center mb-4">
                  <span className="text-yellow-500 mr-1">★</span>
                  <span className="font-semibold">{doctor.rating}</span>
                </div>
              )}

              <button
                onClick={() => onBookDoctor(doctor)}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Book Appointment
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
