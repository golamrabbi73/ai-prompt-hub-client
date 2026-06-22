import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { FiLock } from "react-icons/fi";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Payment = () => {
  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-16">
      {/* Header */}
      <div className="mb-8 text-center">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-secondary">
          One-time payment
        </span>
        <h1 className="mt-2 font-display text-3xl font-semibold text-base-content">
          Upgrade to Premium
        </h1>
        <p className="mt-2 text-base-content/60">
          Unlock all private prompts and premium features for a one-time fee.
        </p>
        <div className="mt-4 inline-block border border-secondary px-6 py-2">
          <span className="font-display text-4xl font-bold text-secondary">
            $5
          </span>
          <span className="ml-1 text-sm text-base-content/50">one-time</span>
        </div>
      </div>

      {/* Stripe form */}
      <div className="border border-base-300 bg-base-200 p-6">
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>

      {/* Security note */}
      <p className="mt-4 flex items-center justify-center gap-1.5 text-center font-mono text-[10px] text-base-content/30">
        <FiLock size={11} /> Secured by Stripe. We never store your card info.
      </p>
    </div>
  );
};

export default Payment;