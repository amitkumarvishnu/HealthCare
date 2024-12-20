import React from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const SuccessPage = () => {
    const location = useLocation();
    const details = location.state?.details;

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
                <h2 className="text-3xl font-semibold text-green-600 mb-4">
                    Payment Successful!
                </h2>
                <p className="text-lg text-gray-700 mb-4">
                    Thank you for your payment, <span className="font-bold text-indigo-600">{details?.payer.name.given_name}</span>
                </p>
                <p className="text-lg text-gray-600">
                    Transaction ID: <span className="font-medium text-gray-800">{details?.id}</span>
                </p>
                <div className="mt-6">
                    <Link to="/doctors" className="w-full bg-green-500 text-white py-4 rounded-md hover:bg-green-600 transition">
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;
