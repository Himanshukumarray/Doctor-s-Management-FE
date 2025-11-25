const menuConfig = {
  PATIENT: [
    { label: "Dashboard", path: "/patient" },
    { label: "Available Doctors", path: "/patient/doctors" },
    { label: "Book Appointment", path: "/patient/book" },
    { label: "My Appointments", path: "/patient/appointments" },
    { label: "Billing", path: "/patient/billing" },
    { label: "Profile", path: "/patient/profile" },
  ],
  

  DOCTOR: [
    { label: "Dashboard", path: "/doctor" },
    { label: "Today's Appointments", path: "/doctor/today" },
    { label: "All Appointments", path: "/doctor/all" },
    { label: "Profile", path: "/doctor/profile" },
  ],


  ADMIN: [
    { label: "Dashboard", path: "/admin" },
    { label: "Pending Doctors", path: "/admin/pending" },
    { label: "All Doctors", path: "/admin/doctors" },
    { label: "All Patients", path: "/admin/patients" },
  ],
};

export default menuConfig;

