import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./routes/ProtectedRoute";

import PatientLayout from "./layouts/PatientLayout";
import PatientDashboard from "./patient/PatientDashboard";
import AvailableDoctors from "./patient/AvailableDoctors";
import BookAppointment from "./patient/BookAppointment";
import MyAppointments from "./patient/MyAppointments";
import Billing from "./patient/Billing";
import PatientProfile from "./patient/PatientProfile";

import DoctorLayout from "./layouts/DoctorLayout";
import DoctorDashboard from "./doctor/DoctorDashboard";
import TodayAppointments from "./doctor/TodayAppointments";
import AllAppointments from "./doctor/AllAppointments";
import DoctorProfile from "./doctor/DoctorProfile";

import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import PendingDoctors from "./admin/PendingDoctors";
import AllDoctors from "./admin/AllDoctors";
import AllPatients from "./admin/AllPatients";

import Login from "./auth/Login";
import Signup from "./auth/Signup";

import "./index.css";
import ToastProvider from "./components/ToastProvider";

export default function App() {
  return (
    <ToastProvider>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ⭐ PATIENT ROUTES */}
        <Route
          path="/patient"
          element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
              <PatientLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<PatientDashboard />} />
          <Route path="available-doctors" element={<AvailableDoctors />} />
          <Route path="book" element={<BookAppointment />} />
          <Route path="appointments" element={<MyAppointments />} />
          <Route path="billing" element={<Billing />} />
          <Route path="profile" element={<PatientProfile />} />
        </Route>

        {/* ⭐ DOCTOR ROUTES */}
        <Route
          path="/doctor"
          element={
            <ProtectedRoute allowedRoles={["DOCTOR"]}>
              <DoctorLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="today" element={<TodayAppointments />} />
          <Route path="appointments" element={<AllAppointments />} />
          <Route path="profile" element={<DoctorProfile />} />
        </Route>

        {/* ⭐ ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="pending-doctors" element={<PendingDoctors />} />
          <Route path="all-doctors" element={<AllDoctors />} />
          <Route path="all-patients" element={<AllPatients />} />
        </Route>

      </Routes>
    </ToastProvider>
  );
}
