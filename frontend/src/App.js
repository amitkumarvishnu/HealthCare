import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import DoctorList from "./components/DoctorList";
import Status from "./components/Status";
import Navbar from "./components/Navbar";
import DoctorDashboard from "./components/DoctorDashboard";
import DoctorConsultationRequests from "./components/DoctorConsultationRequests";
import EmailVerification from "./components/EmailVerification";
import DoctorTimeSlots from "./components/DoctorTimeSlot";
import Home from "./components/Home";
import Chat from "./components/Chat"; 
import CancelPage from "./components/PayPal/CancelPage";            
import SuccessPage from "./components/PayPal/SuccessPage";
import Checkout from "./components/PayPal/Checkout";

const App = () => {
  const [token, setToken] = useState(null);
  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedPatientId = localStorage.getItem("patientId");

    let storedDoctorId = '';
    const storedRole = localStorage.getItem("role");
    console.log('storedRole', storedRole);
    if(storedRole === 'doctor') storedDoctorId = localStorage.getItem("patientId");
    console.log('storedDoctorId', storedDoctorId); 
    const storedUsername = localStorage.getItem("username");

    if (storedToken) {
      setToken(storedToken);
    }
    if (storedPatientId) {
      setPatientId(storedPatientId);
    }
    if (storedDoctorId) {
      setDoctorId(storedDoctorId);
    }
    if (storedRole) {
      setRole(storedRole);
    }
    if (storedUsername) {
      setUsername(storedUsername);
    }

  }, []);

  const handleLogout = () => {
    setToken(null);
    setPatientId("");
    setDoctorId("");
    setUsername("");
    setRole("");
    localStorage.removeItem("token");
    localStorage.removeItem("patientId");
    localStorage.removeItem("doctorId");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
  };

  return (
    <Router>
      <div>
        {token && <Navbar token={token} setToken={handleLogout} role={role} />}
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/login"
            element={
              !token ? (
                <Login
                  setToken={setToken}
                  setPatientId={setPatientId}
                  setUsername={setUsername}
                  setRole={setRole}
                  setDoctorId={setDoctorId}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/register"
            element={!token ? <Register /> : <Navigate to="/" />}
          />

          <Route
            path="/dashboard"
            element={
              token ? (
                role === "patient" ? (
                  <Dashboard username={username} />
                ) : (
                  <Navigate to="/doctor-dashboard" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/doctor-dashboard"
            element={
              token && role === "doctor" ? (
                <DoctorDashboard username={username} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/doctor-timeslots"
            element={
              token && role === "doctor" ? (
                <DoctorTimeSlots doctorId={doctorId} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/doctors"
            element={
              token && role === "patient" ? (
                <DoctorList patientId={patientId} userRole={role} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/status"
            element={
              token && role === "patient" ? (
                <Status patientId={patientId} userRole={role} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/doctor-requests"
            element={
              token && role === "doctor" ? (
                <DoctorConsultationRequests doctorId={doctorId} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Add a route for the chat feature */}
          <Route
            path="/chat"
            element={
              token ? (
                role === "patient" ? (
                  <Chat userId={patientId} receiverId={doctorId} token={token} />
                ) : role === "doctor" ? (
                  <Chat userId={doctorId} receiverId={patientId} token={token} />
                ) : (
                  <Navigate to="/" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />


          <Route path="/verify-email" element={<EmailVerification />} />
          
          {/* PayPal.. */}
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/cancel" element={<CancelPage />} />

        </Routes>
      </div>
    </Router>
    
  );
};

export default App;
