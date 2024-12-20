import React from "react";
import { Link } from "react-router-dom";
const CancelPage = () => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 ">
            <div className="bg-white p-20 rounded-lg shadow-lg max-w-lg w-full">
                <h2 className="text-3xl font-semibold text-red-600 mb-4">
                    Payment Failed !
                </h2>
                <p className="text-lg text-gray-700 mb-4">
                    Your payment was not completed. Please try again.
                </p>
                <div className="mt-6">
                    <Link to="/doctors" className="w-full bg-red-500 text-white py-3 rounded-md hover:bg-red-600 transition">
                        Return to Payment Page
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CancelPage;
