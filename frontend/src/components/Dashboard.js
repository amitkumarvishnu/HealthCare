import React from "react";
import { Link } from "react-router-dom";

const Dashboard = ({ username }) => {
  return (
    <div className="p-6 bg-gradient-to-r from-blue-100 to-green-100 min-h-screen flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Patient Dashboard</h1>
      <p className="text-xl font-semibold text-gray-700 mb-2">WELCOME, {username}!</p>
      <p className="text-lg text-gray-600 text-center mb-6">
        Here you can request consultations, check status, and more.
      </p>

      <div className="mt-6 bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Features...</h2>
        <ul className="space-y-2">
          <li className="p-2 bg-gray-100 rounded-md shadow hover:bg-gray-200 transition duration-200">
            <Link to="/doctors">Choose a Doctor</Link>
          </li>
          <li className="p-2 bg-gray-100 rounded-md shadow hover:bg-gray-200 transition duration-200">
            <Link to="/status">Consultation Status</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
