import React from 'react';
import { Link } from "react-router-dom";

const DoctorDashboard = ({ username }) => {
    return (
        <div className="p-6 bg-gradient-to-r from-green-100 to-blue-100 min-h-screen flex flex-col items-center">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Doctor Dashboard</h1>
            <p className="text-xl font-semibold text-gray-700 mb-2">WELCOME, Dr. {username}!</p>
            <p className="text-lg text-gray-600 text-center">Here you can manage consultation requests and provide the best care for your patients.</p>
            <div className="mt-6 bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Dashboard Features</h2>
                <ul className="space-y-2">
                    <li className="p-2 bg-gray-100 rounded-md shadow hover:bg-gray-200 transition duration-200"> <Link
                to="/doctor-requests"
              >
                Consultation Requests
              </Link></li>
                    {/* <li className="p-2 bg-gray-100 rounded-md shadow hover:bg-gray-200 transition duration-200">Manage Patient Records</li> */}
                    {/* <li className="p-2 bg-gray-100 rounded-md shadow hover:bg-gray-200 transition duration-200">Schedule Appointments</li> */}
                    <li className="p-2 bg-gray-100 rounded-md shadow hover:bg-gray-200 transition duration-200">Provide Feedback</li>
                </ul>
            </div>
        </div>
    );
};

export default DoctorDashboard;
