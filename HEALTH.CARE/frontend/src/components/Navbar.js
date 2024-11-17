import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ token, setToken, role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("patientId");
    localStorage.removeItem("role");
    setToken(null);
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-lg mb-6 rounded-lg">
      <div className="flex items-center space-x-8">
        <Link
          to="/"
          className="text-2xl font-bold tracking-wide text-white hover:text-yellow-300 transition duration-300 ease-in-out"
        >
          Healthcare
        </Link>
        {token ? (
          <>
            {role === "patient" && (
              <>
                <Link
                  to="/doctors"
                  className="text-lg text-white hover:text-yellow-300 transition duration-300 ease-in-out"
                >
                  Find Doctors
                </Link>
                <Link
                  to="/status"
                  className="text-lg text-white hover:text-yellow-300 transition duration-300 ease-in-out"
                >
                  Consultation Status
                </Link>
              </>
            )}
            {role === "doctor" && (
              <>
                <Link
                  to="/doctor-requests"
                  className="text-lg text-white hover:text-yellow-300 transition duration-300 ease-in-out"
                >
                  Consultation Requests
                </Link>
                <Link
                  to="/doctor-timeslots"
                  className="text-lg text-white hover:text-yellow-300 transition duration-300 ease-in-out"
                >
                  Manage Time Slots
                </Link>
              </>
            )}
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-lg text-white hover:text-yellow-300 transition duration-300 ease-in-out"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-lg text-white hover:text-yellow-300 transition duration-300 ease-in-out"
            >
              Register
            </Link>
          </>
        )}
      </div>
      {token && (
        <button
          onClick={handleLogout}
          className="px-5 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 hover:shadow-lg transition duration-300 ease-in-out"
        >
          Logout
        </button>
      )}
    </nav>
  );
};

export default Navbar;
