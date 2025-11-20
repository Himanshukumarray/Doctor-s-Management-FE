import React from 'react';
import { FileText, DollarSign } from 'lucide-react';

export default function Billing({ bills }) {
  const getStatusColor = (status) => {
    return status === 'Paid'
      ? 'bg-green-100 text-green-800'
      : 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">View Bills</h2>

      {bills.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <FileText className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Bills</h3>
          <p className="text-gray-500">You don't have any bills at the moment</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bills.map(bill => (
            <div key={bill.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-2">
                    <FileText className="text-blue-600" size={20} />
                    <span className="font-bold text-lg">{bill.service}</span>
                  </div>
                  <p className="text-gray-600 text-sm">Doctor: {bill.doctor}</p>
                  <p className="text-gray-500 text-sm">Date: {bill.date}</p>
                </div>
                <div className="text-right space-y-2">
                  <div className="flex items-center space-x-1">
                    <DollarSign size={20} className="text-green-600" />
                    <span className="text-2xl font-bold">{bill.amount}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(bill.status)}`}>
                    {bill.status}
                  </span>
                  {bill.status === 'Pending' && (
                    <button className="block w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition text-sm mt-2">
                      Pay Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}