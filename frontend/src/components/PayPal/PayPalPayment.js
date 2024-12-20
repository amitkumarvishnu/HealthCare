import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from "react-router-dom";

const PayPalPayment = ({ amount }) => {
    const navigate = useNavigate();

    return (
        <PayPalScriptProvider options={{ "client-id": "AUO3Yotr4L4QGJfminoaRJ5WbbvIYDg25KqAAH2mhzrfYb14vZZ607E0mBjhykby97wsxvvHYDS4BMEz" }}>
            <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={(data, actions) => {
                    return actions.order.create({
                        purchase_units: [
                            {
                                amount: {
                                    value: amount,
                                    currency_code: "USD",
                                },
                            },
                        ],
                    });
                }}
                onApprove={(data, actions) => {
                    return actions.order.capture().then((details) => {
                        console.log(details);
                        navigate("/success", { state: { details } });
                    });
                }}
                onCancel={() => {
                    navigate("/cancel");
                }}
                onError={(err) => {
                    console.error("Error from PayPal:", err);
                }}
            />

        </PayPalScriptProvider>
    );
};

export default PayPalPayment;


