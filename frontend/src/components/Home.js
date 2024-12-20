import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { FaHeartbeat, FaUserMd, FaStethoscope } from 'react-icons/fa';
import axios from 'axios';
import Navbar from './Navbar';

const Home = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(Boolean(token));

    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/consultations/doctors');
        setDoctors(data);
      } catch (error) {
        setError('Failed to load doctors.');
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleConsultClick = () => {
    if (!isLoggedIn) {
      const confirmLogin = window.confirm('Please log in first to consult with a doctor.');
      if (confirmLogin) {
        navigate('/login');
      }
    } else {
      setMessage('');
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 text-white">
      <Navbar />
      <header className="pt-20 pb-20 text-center">
        <div className="inset-0 bg-black opacity-40"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Welcome to Healthcare Portal
          </h1>
          <p className="mt-4 text-lg sm:text-xl md:text-2xl">
            Find the best doctors, consultations, and manage your health.
          </p>
          <div className="mt-6">
            <Link
              to="/register"
              className="inline-block py-3 px-6 text-lg font-semibold text-teal-900 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition duration-300"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <section className="py-16 bg-white">
        <div className="max-w-screen-xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-teal-800">Our Feature's</h2>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaHeartbeat className="text-4xl text-teal-600 mb-4" />,
                title: "Personalized Health Plans",
                description: "Receive tailored health plans and stay on top of your well-being with expert guidance."
              },
              {
                icon: <FaUserMd className="text-4xl text-teal-600 mb-4" />,
                title: "Consult Experienced Doctors",
                description: "Book appointments with top doctors in your area and consult them remotely or in person."
              },
              {
                icon: <FaStethoscope className="text-4xl text-teal-600 mb-4" />,
                title: "Health Monitoring",
                description: "Monitor your health status with real-time data and get insights into your progress."
              }
            ].map((feature, index) => (
              <div key={index} className="flex flex-col items-center bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
                {feature.icon}
                <h3 className="text-xl font-semibold text-black">{feature.title}</h3>
                <p className="mt-2 text-center text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-screen-xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-teal-800">Meet Our Doctor's</h2>
          {loading ? (
            <div className="text-center mt-8 text-lg text-gray-600">Loading doctors...</div>
          ) : error ? (
            <div className="text-center mt-8 text-lg text-red-600">{error}</div>
          ) : (
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="flex flex-col items-center bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-32 h-32 rounded-full mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-black">Dr. {doctor.name}</h3>
                  <p className="mt-0 text-center text-gray-600">Specialization: {doctor.specialization}</p>
                  <p className="mt-0 text-center text-gray-600">Experience: {doctor.experience} years</p>
                  <p className="mt-0 text-gray-600">Gender: {doctor.gender}</p>
                  <button
                    onClick={handleConsultClick}
                    className="mt-4 py-2 px-4 text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition duration-300"
                  >
                    Consult
                  </button>
                </div>
              ))}
            </div>
          )}
          {message && (
            <div className="mt-4 text-center text-lg text-red-600">
              {message}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-teal-600">
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold text-white">
            Join our Healthcare Community Today!
          </h2>
          <p className="mt-4 text-lg text-white">
            Sign up now and take control of your health journey with the right tools and resources.
          </p>
          <div className="mt-6">
            <Link
              to="/register"
              className="inline-block py-3 px-6 text-lg font-semibold text-teal-900 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition duration-300"
            >
              Signup now
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-6 bg-black text-white text-center">
        <p>&copy; 2024 Healthcare Portal. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;

