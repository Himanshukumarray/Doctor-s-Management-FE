import React from 'react';
import { Search, Calendar, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PatientDashboard({ patientName, appointmentsCount, billsCount }) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome, {patientName || 'Patient'}!</h1>
        <p className="text-blue-100">Manage your appointments and healthcare journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div
          onClick={() => navigate("/patient/doctors")}
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Search className="text-blue-600" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Find Doctors</h3>
              <p className="text-gray-600 text-sm">Search by specialty</p>
            </div>
          </div>
        </div>
        <div
          onClick={() => navigate("/patient/appointments")}
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Calendar className="text-green-600" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-lg">My Appointments</h3>
              <p className="text-gray-600 text-sm">{appointmentsCount} appointments</p>
            </div>
          </div>
        </div>

        <div
          onClick={() => navigate("/patient/billing")}
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <FileText className="text-purple-600" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-lg">View Bills</h3>
              <p className="text-gray-600 text-sm">{billsCount} bills</p>
            </div>
          </div>
        </div>

      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <p className="text-gray-500">No recent activity to display</p>
      </div>
    </div>
  );
}
