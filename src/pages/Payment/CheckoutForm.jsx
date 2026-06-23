// src/pages/Payment/CheckoutForm.jsx
import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [processing, setProcessing] = useState(false);
  const [cardError, setCardError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setCardError("");

    try {
      // 1. Get client secret — public route
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/create-payment-intent`,
        { price: 5 }
      );

      // 2. Confirm card payment
      const { paymentIntent, error } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: user?.displayName,
              email: user?.email,
            },
          },
        }
      );

      if (error) {
        setCardError(error.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        // 3. Save payment — protected route
        await axiosSecure.post(`/payments`, {
          email: user.email,
          name: user.displayName,
          amount: 5,
          transactionId: paymentIntent.id,
          date: new Date().toISOString(),
        });

        toast.success("Payment successful! You're now a Premium member 🎉");
        navigate("/dashboard/profile");
      }
    } catch (err) {
      console.error(err);
      toast.error("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="border border-base-300 bg-base-200 px-4 py-3">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "14px",
                color: "#374151",
                "::placeholder": { color: "#9ca3af" },
              },
              invalid: { color: "#ef4444" },
            },
          }}
        />
      </div>

      {cardError && (
        <p className="text-xs text-accent">{cardError}</p>
      )}

      <ul className="space-y-1.5 text-sm text-base-content/60">
        {[
          "Access to all private & premium prompts",
          "Unlimited prompt saves",
          "Priority support",
          "One-time payment — no subscription",
        ].map((item) => (
          <li key={item} className="flex items-center gap-2">
            <span className="text-secondary">✓</span> {item}
          </li>
        ))}
      </ul>

      <button
        type="submit"
        disabled={!stripe || processing}
        className="btn btn-primary w-full"
      >
        {processing ? "Processing..." : "Pay $5 — Upgrade to Premium"}
      </button>
    </form>
  );
};

export default CheckoutForm;