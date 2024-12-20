import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RequestConsultation from './RequestConsultation';
import { Link } from "react-router-dom";


const DoctorList = ({ patientId, userRole }) => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [showTimeSlotForm, setShowTimeSlotForm] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/consultations/doctors', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setDoctors(response.data);
      } catch (error) {
        alert('Failed to load doctors. Please try again later.');
      }
    };

    fetchDoctors();
  }, []);

  const handleConsult = (doctorId, timeSlots) => {
    setSelectedDoctor(doctorId);
    setAvailableTimeSlots(timeSlots); 
    setShowTimeSlotForm(true);
  };

  const handleSelectTimeSlot = (slot) => {
    if (slot.isAvailable) {
      setSelectedTimeSlot(slot); 
      // alert('This time slot is unavailable. Please choose a different one.');
    }
  };

  const handleClose = () => {
    setShowTimeSlotForm(false);
    setSelectedDoctor(null);
    setSelectedTimeSlot(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="relative p-6 bg-gradient-to-r from-indigo-100 to-blue-100 min-h-screen">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Meet Our Doctor's</h2>

      {doctors.length === 0 ? (
        <p className="text-center text-gray-600">No doctors available at this time.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="flex flex-col items-center bg-white p-4 rounded-lg shadow-lg"
            >
              <img
                src={doctor.image}
                alt={`Dr. ${doctor.name}`}
                className="w-24 h-24 rounded-full object-cover mb-4"
              />
              <h3 className="text-xl font-semibold">Dr. {doctor.name}</h3>
              <p className="text-gray-600">Specialization: {doctor.specialization}</p>
              <p className="text-gray-600">Experience: {doctor.experience} years</p>
              <p className="text-gray-600">Gender: {doctor.gender}</p>

              {userRole === 'patient' && (
                <button
                  className="mt-4 p-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-200"
                  onClick={() => handleConsult(doctor.id, doctor.timeSlots)} 
                >
                  Book Consultation
                </button>
                
              )}
              {/* Paypal */}
               <Link to="/checkout">
                    <button className="mt-2 p-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition duration-200">
                      Pay Now
                    </button>
                  </Link>
            </div>
          ))}
        </div>
      )}

      {/* Time Slot Selection Modal */}
      {showTimeSlotForm && selectedDoctor && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Select a Time Slot</h3>
            {availableTimeSlots.length === 0 ? (
              <p className="text-center text-gray-500">No available time slots for this doctor.</p>
            ) : (
              <div className="max-h-60 overflow-y-auto">
                <div className="grid grid-cols-1 gap-4">
                  {availableTimeSlots.map((slot, index) => {
                    const formattedDate = formatDate(slot.date);
                    return (
                      <div
                        key={index}
                        className={`flex justify-between items-center p-2 border border-gray-300 rounded-lg bg-gray-100 hover:bg-gray-200 transition duration-200 ${
                          slot.isAvailable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                        }`}
                        onClick={() => slot.isAvailable && handleSelectTimeSlot(slot)}
                      >
                        <div className="flex-grow">
                          <span className="font-medium">{formattedDate}</span> - {slot.startTime} to {slot.endTime}
                          <span
                            className={`ml-2 ${slot.isAvailable ? 'text-green-500' : 'text-red-500'}`}
                          >
                            {slot.isAvailable ? ' (Available)' : ' (Unavailable)'}
                          </span>
                        </div>
                        {slot.isAvailable && (
                          <button className="ml-4 px-2 py-1 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-200">
                            Select
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedTimeSlot && (
              <div className="mt-4">
                <RequestConsultation
                  patientId={patientId}
                  doctorId={selectedDoctor}
                  timeSlot={selectedTimeSlot} 
                  onClose={handleClose}
                />
              </div>
            )}

            <button
              onClick={handleClose}
              className="mt-4 w-full p-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorList;
