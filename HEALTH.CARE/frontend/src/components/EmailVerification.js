import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom'; 

const EmailVerification = () => {
    const [message, setMessage] = useState('');
    const [redirectMessage, setRedirectMessage] = useState('');
    const location = useLocation();
    const navigate = useNavigate(); 

    const verifyEmail = useCallback(async (token) => {
        try {
            const response = await axios.get('http://localhost:5000/api/auth/verify-email', {
                params: { token }
            });
            console.log('Response from server:', response.data); 
            setMessage('Email verified successfully! You can now log in.');

            
            setRedirectMessage('redirecting to login...');

          
            setTimeout(() => {
                navigate('/login');
            }, 2000); 
        } catch (error) {
            console.error('Error response from server:', error.response);
            if (error.response && error.response.data.error === 'Email already verified') {
                setMessage('Your email is verified. You can now log in.');
            } else if (error.response && error.response.status === 400) {
                setMessage('Email verification failed. The token may have expired or been used already.');
            } else {
                setMessage('An error occurred during email verification. Please try again.');
            }
        }
    }, [navigate]);

    
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const token = queryParams.get('token');

        if (token) {
            verifyEmail(token);
        } else {
            setMessage('No verification token provided.');
        }
    }, [location, verifyEmail]);

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-200 to-blue-400">
            <div className="bg-white p-10 rounded-lg shadow-xl w-full max-w-sm">
                <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Email Verification</h2>
                <p className="text-center text-lg text-gray-700 mb-4">{message}</p>

              
                {redirectMessage && (
                    <p className="text-center text-lg text-gray-700 mt-4">{redirectMessage}</p>
                )}

                <div className="flex justify-center">
                    <a href="/login" className="mt-4 text-white bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2 transition duration-200 shadow-md">
                        Go to Login
                    </a>
                </div>
            </div>
        </div>
    );
};

export default EmailVerification;
