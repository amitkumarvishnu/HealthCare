import axios from "axios";

export const verifyPayment = async (orderID) => {
    try {
        const response = await axios.post("http://localhost:5000/api/paypal/verify-payment", { orderID });
        return response.data;
    } catch (error) {
        console.error("Error verifying payment:", error);
        throw error;
    }
};
