import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useToast } from "../components/ToastProvider";

export default function BookAppointment() {

  const { showToast } = useToast(); // ✅ FIXED
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
    description: ""
  });

  const patientId = localStorage.getItem("id");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axiosInstance.get("/users/doctors");
        setDoctors(response.data);
      } catch (error) {
        showToast("Failed to load doctors", "error");
        alert("Failed to load doctors");
      }
    };
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!patientId) {
      showToast("Login required!", "error");
      alert("Login required!");
      return;
    }

    if (!form.doctorId || !form.appointmentDate || !form.appointmentTime) {
      showToast("Please fill all fields", "error");
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        doctorId: Number(form.doctorId),
        patientId: Number(patientId),
        appointmentDate: form.appointmentDate,
        appointmentTime: form.appointmentTime,
        description: form.description,
      };

      await axiosInstance.post("/appointments/book", payload);

      showToast("Appointment booked successfully!", "success");
      alert("Appointment booked successfully!");

      setForm({
        doctorId: "",
        appointmentDate: "",
        appointmentTime: "",
        description: "",
      });

    } catch (error) {
      showToast("Failed to book appointment", "error");
      alert("Failed to book appointment");
    }

    setLoading(false); // ✅ BUTTON RETURNS TO NORMAL
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md p-6 rounded-xl mt-6">
      <h2 className="text-2xl font-semibold mb-4">Book Appointment</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block font-medium mb-1">Select Doctor</label>
          <select
            name="doctorId"
            value={form.doctorId}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">-- Choose Doctor --</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name} ({doc.specialization})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Appointment Date</label>
          <input
            type="date"
            name="appointmentDate"
            value={form.appointmentDate}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Appointment Time</label>
          <input
            type="time"
            name="appointmentTime"
            value={form.appointmentTime}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Describe your symptoms..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-2 rounded text-white font-medium 
    ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {loading ? (
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
            "Book Appointment"
          )}
        </button>
      </form>
    </div>
  );
}
