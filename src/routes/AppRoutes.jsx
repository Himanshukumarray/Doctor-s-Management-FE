import React from "react";
import { Routes, Route } from "react-router-dom";

import CommonLayout from "../layout/CommonLayout";
import ProtectedRoute from "../components/ProtectedRoute";

// AUTH PAGES
import Login from "../auth/Login";
import Register from "../auth/Signup";

// PATIENT PAGES
import Dashboard from "../pages/patient/PatientDashboard";
import AvailableDoctors from "../pages/patient/AvailableDoctors";
import BookAppointment from "../pages/patient/BookAppointment";
import MyAppointments from "../pages/patient/MyAppointments";
import Billing from "../pages/patient/Billing";
import PatientProfile from "../pages/patient/PatientProfile";

// DOCTOR PAGES
import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import TodayAppointments from "../pages/doctor/TodayAppointments";
import AllAppointments from "../pages/doctor/AllAppointments";
import DoctorProfile from "../pages/doctor/DoctorProfile";

// ADMIN PAGES
import AdminDashboard from "../pages/doctor/DoctorDashboard";
import PendingDoctors from "../pages/admin/PendingDoctors";
import AllDoctors from "../pages/admin/AllDoctors";
import AllPatients from "../pages/admin/AllPatients";

export default function AppRoutes() {
  return (
    <Routes>

      {/* ⭐ PUBLIC ROUTES (NO SIDEBAR) */}
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Register />} />

      {/* ⭐ PRIVATE ROUTES (PROTECTED + SIDEBAR) */}
      <Route
        element={
          <ProtectedRoute>
            <CommonLayout />
          </ProtectedRoute>
        }
      >
        {/* PATIENT */}
        <Route path="/patient" element={<Dashboard />} />
        <Route path="/patient/doctors" element={<AvailableDoctors />} />
        <Route path="/patient/book" element={<BookAppointment />} />
        <Route path="/patient/appointments" element={<MyAppointments />} />
        <Route path="/patient/billing" element={<Billing />} />
        <Route path="/patient/profile" element={<PatientProfile />} />

        {/* DOCTOR */}
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/doctor/today" element={<TodayAppointments />} />
        <Route path="/doctor/all" element={<AllAppointments />} />
        <Route path="/doctor/profile" element={<DoctorProfile />} />

        {/* ADMIN */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/pending" element={<PendingDoctors />} />
          <Route path="/admin/doctors" element={<AllDoctors />} />
          <Route path="/admin/patients" element={<AllPatients />} />
      </Route>
    </Routes>
  );
}
