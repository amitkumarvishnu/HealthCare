import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

const DoctorDashboard = ({ username }) => {
    const [doctor, setDoctor] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 

    useEffect(() => {
        const fetchDoctorData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/consultations/doctors/');
                // console.log(response.data);

                const doctorData = response.data.find((doctor) => doctor.name.toLowerCase() === username.toLowerCase());

                if (doctorData) {
                    setDoctor(doctorData); 
                } else {
                    console.log('Available doctors:', response.data.map(doctor => doctor.name)); 
                    setError('Doctor not found');
                }
            } catch (err) {
                setError('Failed to fetch doctor data');
            } finally {
                setLoading(false);
            }
        };

        fetchDoctorData();
    }, [username]); 

    if (loading) {
        return <div className="text-center text-2xl text-gray-500">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-2xl text-red-600">{error}</div>;
    }

    return (
        <div className="bg-gradient-to-r from-cyan-50 to-teal-100 min-h-screen py-16">
            <div className="max-w-7xl mx-auto px-6">
                <h1 className="text-5xl font-extrabold text-gray-800 mb-8 text-center">Doctor Dashboard</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Doctor Details Section */}
                    <div className="bg-white p-8 rounded-lg shadow-lg transform transition-all hover:scale-105 duration-300">
                        <div className="flex justify-center mb-6">
                            <img
                                src={doctor.image}
                                alt={doctor.name}
                                className="w-40 h-40 rounded-full object-cover border-4 border-teal-500 shadow-lg"
                            />
                        </div>
                        <p className="text-3xl font-semibold text-gray-800 text-center">Dr. {doctor.name}</p>

                        <div className="mt-4 text-center text-gray-600">
                            <p className="text-lg font-medium">Gender: <span className="font-normal text-gray-500">{doctor.gender}</span></p>
                            <p className="text-lg font-medium mt-2">Specialization: <span className="font-normal text-gray-500">{doctor.specialization}</span></p>
                            <p className="text-lg font-medium mt-2">Experience: <span className="font-normal text-gray-500">{doctor.experience} years</span></p>
                        </div>
                    </div>

                    {/* Dashboard Features Section */}
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Features</h2>
                        <ul className="space-y-6">
                            <li className="p-5 bg-teal-100 rounded-md shadow hover:bg-teal-200 transition duration-300 flex items-center space-x-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 6H6L18 6L20 6C21.1046 6 22 6.89543 22 8V16C22 17.1046 21.1046 18 20 18H4C2.89543 18 2 17.1046 2 16V8C2 6.89543 2.89543 6 4 6Z" />
                                    <path d="M12 11V15" />
                                    <path d="M9 13L12 11L15 13" />
                                </svg>
                                <Link to="/doctor-requests" className="text-lg font-semibold text-teal-700 hover:text-teal-600">Consultation Requests</Link>
                            </li>
                            <li className="p-5 bg-teal-100 rounded-md shadow hover:bg-teal-200 transition duration-300 flex items-center space-x-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 10L19 12L17 14" />
                                    <path d="M5 10L3 12L5 14" />
                                    <path d="M12 2V22" />
                                </svg>
                                <Link to="/doctor-timeslots" className="text-lg font-semibold text-teal-700 hover:text-teal-600">Manage Timeslots</Link>
                            </li>
                            <li className="p-5 bg-teal-100 rounded-md shadow hover:bg-teal-200 transition duration-300 flex items-center space-x-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 5L5 3L21 19L19 21L5 5L3 7" />
                                </svg>
                                <Link className="text-lg font-semibold text-teal-700 hover:text-teal-600">Feedback</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
