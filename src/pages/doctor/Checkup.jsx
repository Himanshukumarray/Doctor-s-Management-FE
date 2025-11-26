import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

export default function Checkup() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [formData, setFormData] = useState({
    diagnosis: "",
    symptoms: "",
    advice: "",
    followUpDate: "",
    medicines: [
      { medicine: "", schedule: "", instruction: "", route: "", days: "" }
    ]
  });

  useEffect(() => {
    fetchAppointment();
  }, []);

  const fetchAppointment = async () => {
    try {
      const res = await axiosInstance.get(`/appointments/patient/${patientId}`);
      setAppointment(res.data);
    } catch (error) {
      alert("Failed to load appointment");
    }
  };

  const addMedicine = () => {
    setFormData({
      ...formData,
      medicines: [
        ...formData.medicines,
        { medicine: "", schedule: "", instruction: "", route: "", days: "" }
      ]
    });
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...formData.medicines];
    updated[index][field] = value;
    setFormData({ ...formData, medicines: updated });
  };

  const removeMedicine = (index) => {
    const updated = formData.medicines.filter((_, i) => i !== index);
    setFormData({ ...formData, medicines: updated });
  };

  const handleSubmit = async () => {
    try {
      await axiosInstance.post(`/api/prescriptions/create/${appointmentId}`, formData);
      alert("Prescription Saved Successfully!");
      navigate("/doctor/appointments");
    } catch (err) {
      console.error(err);
      alert("Failed to submit prescription");
    }
  };

  if (!appointment) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-3">Checkup & Prescription</h2>

      {/* Auto-filled Details */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg mb-4">
        <p><b>Patient:</b> {appointment.patientName}</p>
        <p><b>Doctor:</b> {appointment.doctorName}</p>
        <p><b>Gender:</b> {appointment.gender}</p>
        <p><b>Age:</b> {appointment.age}</p>
        <p><b>Date:</b> {appointment.appointmentDate}</p>
        <p><b>Time:</b> {appointment.appointmentTime}</p>
      </div>

      {/* Diagnosis */}
      <textarea
        placeholder="Diagnosis"
        className="w-full p-3 border rounded mb-3"
        onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
      />

      {/* Symptoms */}
      <textarea
        placeholder="Symptoms"
        className="w-full p-3 border rounded mb-3"
        onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
      />

      {/* Advice */}
      <textarea
        placeholder="Advice"
        className="w-full p-3 border rounded mb-3"
        onChange={(e) => setFormData({ ...formData, advice: e.target.value })}
      />

      {/* Medicines Table */}
      <h3 className="text-lg font-semibold mb-2">Medicines</h3>
      {formData.medicines.map((med, index) => (
        <div key={index} className="grid grid-cols-5 gap-2 mb-2">
          <input placeholder="Medicine"
            className="p-2 border rounded"
            onChange={(e) => handleMedicineChange(index, "medicine", e.target.value)}
          />
          <input placeholder="Schedule"
            className="p-2 border rounded"
            onChange={(e) => handleMedicineChange(index, "schedule", e.target.value)}
          />
          <input placeholder="Instruction"
            className="p-2 border rounded"
            onChange={(e) => handleMedicineChange(index, "instruction", e.target.value)}
          />
          <input placeholder="Route"
            className="p-2 border rounded"
            onChange={(e) => handleMedicineChange(index, "route", e.target.value)}
          />
          <input placeholder="Days"
            className="p-2 border rounded"
            onChange={(e) => handleMedicineChange(index, "days", e.target.value)}
          />
          <button
            onClick={() => removeMedicine(index)}
            className="text-red-600"
          >✕</button>
        </div>
      ))}

      <button
        onClick={addMedicine}
        className="bg-gray-700 text-white px-3 py-2 rounded mb-4"
      >
        + Add Medicine
      </button>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold"
      >
        Save Prescription
      </button>
    </div>
  );
}
