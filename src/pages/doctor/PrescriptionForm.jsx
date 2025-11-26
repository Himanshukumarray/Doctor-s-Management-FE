import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { useToast } from "../../components/ToastProvider";

export default function PrescriptionForm() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

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
    fetchAppointmentDetails();
  }, []);

  const fetchAppointmentDetails = async () => {
    try {
      const response = await axiosInstance.get(`/appointments/${appointmentId}`);
      setAppointment(response.data);
    } catch (error) {
      showToast("Failed to load appointment details", "error");
    }
  };

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = [...formData.medicines];
    updatedMedicines[index][field] = value;
    setFormData({ ...formData, medicines: updatedMedicines });
  };

  const addMedicineRow = () => {
    setFormData({
      ...formData,
      medicines: [
        ...formData.medicines,
        { medicine: "", schedule: "", instruction: "", route: "", days: "" }
      ]
    });
  };

  const submitPrescription = async () => {
    try {
      await axiosInstance.post(
        `/api/prescriptions/create/${appointmentId}`,
        formData
      );
      showToast("Prescription submitted successfully!", "success");
      navigate("/doctor/appointments");
    } catch (error) {
      showToast("Failed to submit prescription", "error");
    }
  };

  if (!appointment) {
    return (
      <div className="text-center py-10 text-gray-600">Loading...</div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add Prescription</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Appointment Details</h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <p><strong>Doctor:</strong> {appointment.doctorName}</p>
          <p><strong>Patient:</strong> {appointment.patientName}</p>
          <p><strong>Age:</strong> {appointment.patientAge || "N/A"}</p>
          <p><strong>Gender:</strong> {appointment.patientGender || "N/A"}</p>
          <p><strong>Date:</strong> {appointment.appointmentDate}</p>
          <p><strong>Time:</strong> {appointment.appointmentTime}</p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Prescription</h2>

        <div className="space-y-3">
          <input
            className="w-full p-2 border rounded"
            placeholder="Diagnosis"
            value={formData.diagnosis}
            onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
          />

          <input
            className="w-full p-2 border rounded"
            placeholder="Symptoms"
            value={formData.symptoms}
            onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
          />

          <input
            className="w-full p-2 border rounded"
            placeholder="Advice"
            value={formData.advice}
            onChange={(e) => setFormData({ ...formData, advice: e.target.value })}
          />

          <input
            type="date"
            className="w-full p-2 border rounded"
            value={formData.followUpDate}
            onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
          />

          <h3 className="text-lg font-semibold">Medicines</h3>

          {formData.medicines.map((med, index) => (
            <div key={index} className="grid grid-cols-5 gap-2">
              {Object.keys(med).map((field) => (
                <input
                  key={field}
                  className="p-2 border rounded"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={med[field]}
                  onChange={(e) =>
                    handleMedicineChange(index, field, e.target.value)
                  }
                />
              ))}
            </div>
          ))}

          <button
            onClick={addMedicineRow}
            className="text-blue-600 font-medium mt-2"
          >
            + Add Medicine
          </button>
        </div>

        <button
          onClick={submitPrescription}
          className="mt-6 w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700"
        >
          Submit Prescription
        </button>
      </div>
    </div>
  );
}
