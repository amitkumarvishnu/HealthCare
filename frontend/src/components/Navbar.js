import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaComments } from 'react-icons/fa';

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
    <nav className="flex items-center justify-between bg-gradient-to-r from-blue-400 to-blue-600 dark:from-blue-800 dark:to-blue-900 text-white p-4 shadow-lg mb-6">
      <div className="flex items-center space-x-8">
        <Link
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
                  style={{
                    position: "absolute",
                    right: "500px",
                  }}
                >
                  Find Doctors
                </Link>
                <Link
                  to="/status"
                  className="text-lg text-white hover:text-yellow-300 transition duration-300 ease-in-out"
                  style={{
                    position: "absolute",
                    right: "320px",
                  }}
                >
                  Consultation Status
                </Link>
                {/* Chat for Patients */}
                <Link
                  to="/chat"
                  className="text-lg text-white hover:text-yellow-300 transition duration-300 ease-in-out"
                  style={{
                    position: "absolute",
                    right: "250px",
                  }}
                >
                  <FaComments size={30} />
                </Link>
                <Link to="/dashboard">
                  <img
                    src="profile.png"
                    alt="profile"
                    style={{
                      height: "40px",
                      width: "40px",
                      position: "absolute",
                      right: "170px",
                      top: "40px",
                    }}
                  />
                </Link>
              </>
            )}
            {role === "doctor" && (
              <>
                <Link
                  to="/doctor-requests"
                  className="text-lg text-white hover:text-yellow-300 transition duration-300 ease-in-out"
                  style={{
                    position: "absolute",
                    right: "500px",
                  }}
                >
                  Consultation Requests
                </Link>

                <Link
                  to="/doctor-timeslots"
                  className="text-lg text-white hover:text-yellow-300 transition duration-300 ease-in-out"
                  style={{
                    position: "absolute",
                    right: "320px",
                  }}
                >
                  Manage Time Slots
                </Link>


                <Link
                  to="/chat"
                  className="text-lg text-white hover:text-yellow-300 transition duration-300 ease-in-out"
                  style={{
                    position: "absolute",
                    right: "250px",
                  }}
                >
                  <FaComments size={30} />
                </Link>
                <Link to="/doctor-dashboard">
                  <img
                    src="profile.png"
                    alt="profile"
                    style={{
                      height: "40px",
                      width: "40px",
                      position: "absolute",
                      right: "170px",
                      top: "40px",
                    }}
                  />
                </Link>
              </>
            )}
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-lg text-white hover:text-yellow-300 transition duration-300 ease-in-out"
              style={{
                height: "40px",
                width: "40px",
                fontWeight: "bold",
                position: "absolute",
                right: "190px",
                top: "45px",
              }}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-lg text-white hover:text-yellow-300 transition duration-300 ease-in-out"
              style={{
                height: "40px",
                width: "40px",
                fontWeight: "bold",
                position: "absolute",
                right: "110px",
                top: "45px",
              }}
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
