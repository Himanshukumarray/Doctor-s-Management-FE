import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useToast } from "../../components/ToastProvider";

export default function BookAppointment() {
  const { showToast } = useToast();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [form, setForm] = useState({
    appointmentDate: "",
    appointmentTime: "",
    description: "",
  });

  const specialties = [
    "all",
    "Cardiologist",
    "Dermatologist",
    "Pediatrics",
    "Ophthalmologist",
    "Neurologist",
  ];

  const patientId = localStorage.getItem("id");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axiosInstance.get("/users/doctors");
        setDoctors(response.data);
      } catch (error) {
        showToast("Failed to load doctors", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!patientId) {
      showToast("Login required!", "error");
      return;
    }

    if (!selectedDoctor) {
      showToast("Please select a doctor", "error");
      return;
    }

    if (!form.appointmentDate || !form.appointmentTime) {
      showToast("Please fill all required fields", "error");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        doctorId: Number(selectedDoctor.id),
        patientId: Number(patientId),
        appointmentDate: form.appointmentDate,
        appointmentTime: form.appointmentTime,
        description: form.description,
      };

      await axiosInstance.post("/appointments/book", payload);

      showToast("Appointment booked successfully!", "success");

      setForm({
        appointmentDate: "",
        appointmentTime: "",
        description: "",
      });
      setSelectedDoctor(null);
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to book appointment",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Filter doctors
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSpecialty =
      selectedSpecialty === "all" ||
      doctor.specialization === selectedSpecialty ||
      doctor.specialty === selectedSpecialty;
    const matchesSearch =
      searchQuery === "" ||
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doctor.specialization || doctor.specialty || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Book Your Appointment
          </h1>
          <p className="text-gray-600">
            Choose a doctor and schedule your visit
          </p>
        </div>

        {/* Appointment Form - Shows when doctor is selected */}
        {selectedDoctor && (
          <div className="bg-white shadow-xl rounded-2xl p-6 mb-8 border border-gray-100">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="text-5xl">{selectedDoctor.image || "👨‍⚕️"}</div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedDoctor.name}
                  </h2>
                  <p className="text-blue-600 font-medium">
                    {selectedDoctor.specialization || selectedDoctor.specialty}
                  </p>
                  {selectedDoctor.experience && (
                    <p className="text-gray-600 text-sm">
                      {selectedDoctor.experience}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedDoctor(null)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    Appointment Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="appointmentDate"
                    value={form.appointmentDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    Appointment Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="appointmentTime"
                    value={form.appointmentTime}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                  placeholder="Describe your symptoms or reason for visit..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full p-4 rounded-lg text-white font-semibold text-lg transition-all duration-200 ${
                  submitting
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl"
                }`}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Booking...
                  </span>
                ) : (
                  "Confirm Appointment"
                )}
              </button>
            </form>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="bg-white shadow-lg rounded-2xl p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Doctors
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or specialty..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <svg
                  className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Specialty
              </label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                {specialties.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec === "all" ? "All Specialties" : spec}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Available Doctors ({filteredDoctors.length})
          </h2>

          {filteredDoctors.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-500 text-lg">
                No doctors found matching your criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 ${
                    selectedDoctor?.id === doctor.id
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                >
                  <div className="p-6">
                    <div className="text-center mb-4">
                      <div className="text-6xl mb-3">
                        {doctor.image || "👨‍⚕️"}
                      </div>
                      <h3 className="font-bold text-xl text-gray-800 mb-1">
                        {doctor.name}
                      </h3>
                      <p className="text-blue-600 font-medium">
                        {doctor.specialization || doctor.specialty}
                      </p>
                    </div>

                    {doctor.experience && (
                      <div className="flex items-center justify-center gap-2 mb-3 text-gray-600">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-sm">{doctor.experience}</span>
                      </div>
                    )}

                    {doctor.rating && (
                      <div className="flex items-center justify-center mb-4">
                        <span className="text-yellow-400 text-lg mr-1">★</span>
                        <span className="font-semibold text-gray-700">
                          {doctor.rating}
                        </span>
                        <span className="text-gray-500 text-sm ml-1">
                          / 5.0
                        </span>
                      </div>
                    )}

                    <button
                      onClick={() => handleDoctorSelect(doctor)}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      {selectedDoctor?.id === doctor.id
                        ? "Selected ✓"
                        : "Select Doctor"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}