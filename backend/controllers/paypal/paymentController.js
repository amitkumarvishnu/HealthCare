const client = require("./paypalClient");

exports.verifyPayment = async (req, res) => {
    const { orderID } = req.body;

    try {
        const request = new paypal.orders.OrdersGetRequest(orderID);
        const response = await client.execute(request);
        res.status(200).json({ success: true, payment: response.result });
    } catch (error) {
        console.error("Payment verification failed:", error);
        res.status(500).json({ success: false, error: "Payment verification failed" });
    }
};
