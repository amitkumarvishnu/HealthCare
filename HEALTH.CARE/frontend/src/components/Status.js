import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Status = ({ patientId, userRole }) => {
    const [consultations, setConsultations] = useState([]);

    useEffect(() => {
        const fetchConsultations = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/consultations/status/${patientId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                console.log("API Response:", response.data); // Log response to inspect structure
                setConsultations(response.data);
            } catch (error) {
                console.error('Error fetching consultation status:', error);
            }
        };

        if (userRole === 'patient') {
            fetchConsultations();
        }
    }, [patientId, userRole]);

    return (
        <div className="p-6 bg-gradient-to-r from-purple-100 to-blue-100 min-h-screen">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Consultation Status</h2>
            {consultations.length === 0 ? (
                <p className="text-center text-gray-500">No consultations found.</p>
            ) : (
                <ul className="space-y-4">
                    {consultations.map(consultation => (
                        <li 
                            key={consultation.id} 
                            className="p-4 border border-gray-300 rounded-lg shadow-lg bg-white transition-shadow duration-300 hover:shadow-xl"
                        >
                            {/* If dateTime is available, display the formatted date */}
                            <h3 className="text-xl font-semibold text-gray-800">
                                {consultation.dateTime
                                    ? new Date(consultation.dateTime).toLocaleDateString()
                                    : 'Date Not Available'}
                            </h3>
                            <p className="text-gray-700">
                                Status: <span className={`font-bold ${consultation.status === 'Completed' ? 'text-green-600' : 'text-red-600'}`}>{consultation.status}</span>
                            </p>
                            <p className="text-gray-700">Doctor: <span className="font-semibold">{consultation.doctorName}</span></p>
                            <p className="text-gray-700">Specialty: <span className="font-semibold">{consultation.specialty}</span></p>

                            {/* Check for 'startTime' and 'endTime' or use 'dateTime' */}
                            <p className="text-gray-700">
                                {consultation.startTime && consultation.endTime
                                    ? `Time: ${consultation.startTime} to ${consultation.endTime}`
                                    : consultation.dateTime
                                    ? `Time: ${new Date(consultation.dateTime).toLocaleTimeString()}`
                                    : 'Time not available'}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Status;
