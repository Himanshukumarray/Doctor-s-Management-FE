import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance"
import { useToast } from "../../components/ToastProvider";

export default function DoctorProfile() {
  const { showToast } = useToast();
  const doctorId = localStorage.getItem("id");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    specialization: "",
    experience: "",
    phone: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/doctors/${doctorId}`);
      const data = response.data;

      setForm({
        name: data.name || "",
        email: data.email || "",
        specialization: data.specialization || "",
        experience: data.experience || "",
        phone: data.phone || "",
      });
    } catch (error) {
      showToast("Failed to load profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axiosInstance.put(`/doctors/${doctorId}`, form);

      showToast("Profile updated successfully!", "success");
    } catch (error) {
      showToast("Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 shadow rounded">
      <h2 className="text-3xl font-semibold mb-6">Doctor Profile</h2>

      {loading ? (
        <p className="text-gray-500">Loading profile...</p>
      ) : (
        <div className="space-y-4">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter your name"
            />
          </div>

          {/* Email (read only) */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              readOnly
              className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500">Email cannot be changed</p>
          </div>

          {/* Specialization */}
          <div>
            <label className="block text-sm font-medium mb-1">Specialization</label>
            <input
              type="text"
              name="specialization"
              value={form.specialization}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Cardiologist, Dentist, etc"
            />
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-medium mb-1">Experience (Years)</label>
            <input
              type="number"
              name="experience"
              value={form.experience}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="5"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="+91 9876543210"
            />
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
