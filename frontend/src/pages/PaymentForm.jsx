import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const PaymentForm = () => {
    const { state } = useLocation();
    const { customerDetails, cartItems, totalAmount } = state || {};

    useEffect(() => {
        const sendConfirmationEmail = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/sendconfirmationemail", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        to: customerDetails.email,
                        name: customerDetails.name,
                        items: cartItems,
                        total: totalAmount,
                        address: customerDetails.address,
                        zip: customerDetails.zip,
                        email: customerDetails.email,
                        phone: customerDetails.phone
                    }),

                });

                const result = await response.json();
                if (response.ok) {
                    console.log("Email sent successfully!");
                } else {
                    console.error("Failed to send email:", result.message);
                }
            } catch (error) {
                console.error("Error sending email:", error);
            }
        };

        if (customerDetails && cartItems) {
            sendConfirmationEmail();
        }
    }, [customerDetails, cartItems, totalAmount]);

    const navigate = useNavigate();

    useEffect(() => {
        if (!totalAmount) {
            navigate("/order"); // If totalAmount is missing, redirect to the order page
        } else {
            initiatePayment(); // Initiate Razorpay payment as soon as the page loads
        }
    }, [totalAmount, navigate]);

    const initiatePayment = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ price: totalAmount }),
            });

            const data = await response.json();

            if (response.ok) {
                const options = {
                    key: "rzp_test_sIWGak0qwRvULV",
                    amount: data.amount,
                    currency: "INR",
                    name: "Your Store Name",
                    order_id: data.id,
                    description: "Test Payment",
                    handler: function (response) {
                        alert("Payment Successful!");
                        navigate("/orderplaced");
                    },
                    prefill: {
                        name: "Customer Name",
                    },
                    notes: {
                        address: "Razorpay Test Store",
                    },
                    theme: {
                        color: "#F37254",
                    },
                };
                const rzp1 = new Razorpay(options);
                rzp1.open();
            } else {
                alert("Failed to create order");
            }
        } catch (err) {
            console.error("Error:", err);
            alert("Payment failed!");
        }
    };

    return (
        <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', display: 'flex',
            justifyContent: 'center', alignContent: 'center', alignItems: 'center', flexDirection: 'column'
        }}>
            <div class="spinner-border" role="status">
            </div>

            <div>
                <p>Please Wait</p>
            </div>
            <div>
                <h3>Redirecting to Razorpay Gateway</h3>
            </div>
        </div>
    );
};

export default PaymentForm;
