import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// TODO: Replace with your Stripe publishable key
const stripePromise = loadStripe("pk_test_51Hvom2E6s6q0BjezHzp1o3dnPq4cisoMSUvSAchKfj71iV0HrWYEOPnPrb2aDlWVZrWTVZkDFRegRKYy85zKPOKF00zkFVhSK9");

export default function StripeProvider({ children }) {
  return <Elements stripe={stripePromise}>{children}</Elements>;
}
