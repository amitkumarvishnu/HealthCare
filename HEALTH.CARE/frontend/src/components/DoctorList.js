import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RequestConsultation from './RequestConsultation'; // Import your consultation component

const DoctorList = ({ patientId, userRole }) => {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null); // To store the selected time slot
    const [showTimeSlotForm, setShowTimeSlotForm] = useState(false); // To control the modal visibility
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]); // Available time slots for the selected doctor

    // Fetch doctors on component mount
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/consultations/doctors', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setDoctors(response.data); // Store fetched doctors in the state
            } catch (error) {
                alert('Failed to load doctors. Please try again later.');
            }
        };

        fetchDoctors();
    }, []);

    // Handle the patient selecting a doctor for consultation
    const handleConsult = (doctorId, timeSlots) => {
        setSelectedDoctor(doctorId); // Store the selected doctor's ID
        setAvailableTimeSlots(timeSlots); // Set the available time slots for that doctor
        setShowTimeSlotForm(true); // Show the time slot selection form (modal)
    };

    // Handle selecting a time slot
    const handleSelectTimeSlot = (slot) => {
        if (slot.isAvailable) {
            setSelectedTimeSlot(slot); // Store the selected time slot
        } else {
            alert('This time slot is unavailable. Please choose a different one.');
        }
    };

    // Close the time slot form modal
    const handleClose = () => {
        setShowTimeSlotForm(false);
        setSelectedDoctor(null);
        setSelectedTimeSlot(null);
    };

    return (
        <div className="relative p-6 bg-gradient-to-r from-indigo-100 to-blue-100 min-h-screen">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Available Doctors</h2>
            
            {doctors.length === 0 ? (
                <p className="text-center text-gray-500">No doctors available at this time.</p>
            ) : (
                <ul className="space-y-4">
                    {doctors.map(doctor => (
                        <li 
                            key={doctor.id} 
                            className="flex justify-between items-center p-4 border border-gray-300 rounded-lg shadow-lg bg-white transition-shadow duration-300 hover:shadow-2xl hover:scale-101"
                        >
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">Dr. {doctor.name}</h3>
                                <p className="text-gray-600">Specialization: {doctor.specialization}</p>
                            </div>

                            {userRole === 'patient' && (
                                <button 
                                    className="ml-4 p-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition duration-200" 
                                    onClick={() => handleConsult(doctor.id, doctor.timeSlots)}
                                >
                                    Consult
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            {/* Modal or form for time slot selection */}
            {showTimeSlotForm && selectedDoctor && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Select a Time Slot</h3>
                        {availableTimeSlots.length === 0 ? (
                            <p>No available time slots for this doctor.</p>
                        ) : (
                            <ul className="space-y-4">
                                {availableTimeSlots.map((slot, index) => (
                                    <li key={index} className="flex justify-between items-center">
                                        <div>
                                            {slot.day} - {slot.startTime} to {slot.endTime} 
                                            {slot.isAvailable ? " (Available)" : " (Unavailable)"}
                                        </div>
                                        {slot.isAvailable && (
                                            <button
                                                onClick={() => handleSelectTimeSlot(slot)}
                                                className="ml-4 p-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-200"
                                            >
                                                Select this slot
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                        
                        {/* If a time slot is selected, show the RequestConsultation form */}
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

                        {/* Close Button */}
                        <button 
                            onClick={handleClose} 
                            className="mt-4 p-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
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
