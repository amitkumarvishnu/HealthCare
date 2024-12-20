import React from "react";
import PayPalPayment from "./PayPalPayment";

const Checkout = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
            <div className="bg-white p-10 rounded-lg shadow-lg w-full sm:max-w-lg mb-20">
                <h2 className="text-3xl font-semibold text-gray-800 mb-4">CHECKOUT</h2>
                <p className="text-lg text-gray-600 mb-6">Choose any one for make payment... </p>
                <div className="border-t border-gray-300 pt-6 mt-6">
                    <PayPalPayment amount="50.00" />
                </div>
                <div className="text-center mt-6 text-gray-500">
                    <p className="text-sm">By proceeding, you agree to our terms and conditions.</p>
                </div>
            </div>
        </div>
    );
};

export default Checkout;

