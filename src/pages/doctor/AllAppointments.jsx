import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, User, Stethoscope, X, Plus, Trash2 } from "lucide-react";

export default function AllAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [formData, setFormData] = useState({
    diagnosis: "",
    symptoms: "",
    advice: "",
    followUpDate: "",
    medicines: [
      { medicine: "", schedule: "", instruction: "", route: "", days: "" },
    ],
  });

  const doctorId = localStorage.getItem("id");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axiosInstance.get(`/appointments/doctor/${doctorId}`);
      setAppointments(response.data);
    } catch (error) {
      alert("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (apt) => {
    setSelectedAppointment(apt);
    setShowModal(true);
    setFormData({
      diagnosis: "",
      symptoms: "",
      advice: "",
      followUpDate: "",
      medicines: [
        { medicine: "", schedule: "", instruction: "", route: "", days: "" },
      ],
    });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMedicineChange = (index, field, value) => {
    const newMedicines = [...formData.medicines];
    newMedicines[index][field] = value;
    setFormData({ ...formData, medicines: newMedicines });
  };

  const addMedicineField = () => {
    setFormData({
      ...formData,
      medicines: [
        ...formData.medicines,
        { medicine: "", schedule: "", instruction: "", route: "", days: "" },
      ],
    });
  };

  const removeMedicineField = (index) => {
    const newMedicines = formData.medicines.filter((_, i) => i !== index);
    setFormData({ ...formData, medicines: newMedicines });
  };

  const submitPrescription = async () => {
    try {
      await axiosInstance.post(
        `/prescriptions/create/${selectedAppointment.id}`,
        formData
      );
      alert("Prescription created successfully!");
      setShowModal(false);
      fetchAppointments();
    } catch (error) {
      alert("Failed to submit prescription");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "COMPLETED":
        return "bg-green-100 text-green-700 border-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Appointments</h1>
          <p className="text-gray-600">Manage your patient appointments and prescriptions</p>
        </div>

        {appointments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Appointments</h3>
            <p className="text-gray-600">You don't have any appointments scheduled yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <th className="px-6 py-4 text-left text-sm font-semibold">Patient</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Time</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                            {apt.patientName?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-900">{apt.patientName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span>{apt.appointmentDate}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Clock className="w-4 h-4 text-purple-600" />
                          <span>{apt.appointmentTime}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(apt.status)}`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {apt.status === "PENDING" ? (
                          <button
                            onClick={() => handleOpenModal(apt)}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-2.5 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-sm hover:shadow-md font-medium"
                          >
                            <Stethoscope className="w-4 h-4" />
                            Start Checkup
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Create Prescription</h3>
                  <p className="text-gray-600 mt-1">Patient: {selectedAppointment?.patientName}</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="overflow-y-auto flex-1 p-6">
                <div className="space-y-5">
                  {/* Diagnosis */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Diagnosis *
                    </label>
                    <input
                      name="diagnosis"
                      placeholder="Enter diagnosis"
                      value={formData.diagnosis}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  {/* Symptoms */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Symptoms *
                    </label>
                    <textarea
                      name="symptoms"
                      placeholder="Describe symptoms"
                      value={formData.symptoms}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                    />
                  </div>

                  {/* Advice */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Medical Advice *
                    </label>
                    <textarea
                      name="advice"
                      placeholder="Provide medical advice and recommendations"
                      value={formData.advice}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Follow-up Date
                    </label>
                    <input
                      name="followUpDate"
                      type="date"
                      value={formData.followUpDate}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold text-gray-900">Medicines</h4>
                      <button
                        onClick={addMedicineField}
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        <Plus className="w-4 h-4" />
                        Add Medicine
                      </button>
                    </div>

                    <div className="space-y-4">
                      {formData.medicines.map((med, i) => (
                        <div key={i} className="border border-gray-200 rounded-xl p-4 bg-gray-50 relative">
                          {formData.medicines.length > 1 && (
                            <button
                              onClick={() => removeMedicineField(i)}
                              className="absolute top-3 right-3 p-1.5 hover:bg-red-100 rounded-lg transition-colors group"
                            >
                              <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
                            </button>
                          )}
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="md:col-span-2">
                              <input
                                placeholder="Medicine name *"
                                value={med.medicine}
                                onChange={(e) => handleMedicineChange(i, "medicine", e.target.value)}
                                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                              />
                            </div>
                            <input
                              placeholder="Schedule (e.g., 1-0-1)"
                              value={med.schedule}
                              onChange={(e) => handleMedicineChange(i, "schedule", e.target.value)}
                              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                            />
                            <input
                              placeholder="Route (e.g., Oral)"
                              value={med.route}
                              onChange={(e) => handleMedicineChange(i, "route", e.target.value)}
                              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                            />
                            <input
                              placeholder="Instructions (e.g., After meals)"
                              value={med.instruction}
                              onChange={(e) => handleMedicineChange(i, "instruction", e.target.value)}
                              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                            />
                            <input
                              type="number"
                              placeholder="Duration (days)"
                              value={med.days}
                              onChange={(e) => handleMedicineChange(i, "days", e.target.value)}
                              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={submitPrescription}
                  className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-sm hover:shadow-md font-medium"
                >
                  Submit Prescription
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}