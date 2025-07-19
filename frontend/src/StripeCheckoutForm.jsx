import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function StripeCheckoutForm({ amount, address, onPaymentSuccess, onPaymentError, disabled }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Call backend to create PaymentIntent
      const res = await fetch("/api/payments/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, currency: "usd" })
      });
      const { clientSecret } = await res.json();
      if (!clientSecret) throw new Error("No client secret returned");

      // Confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name: address.name }
        }
      });
      if (result.error) {
        setError(result.error.message);
        onPaymentError && onPaymentError(result.error);
      } else if (result.paymentIntent.status === "succeeded") {
        onPaymentSuccess && onPaymentSuccess(result.paymentIntent);
      }
    } catch (err) {
      setError(err.message);
      onPaymentError && onPaymentError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 2, bgcolor: '#fff' }}>
        <CardElement options={{ style: { base: { fontSize: '18px' } } }} />
      </Box>
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      <Button
        variant="contained"
        color="primary"
        type="submit"
        disabled={!stripe || !elements || loading || disabled}
        sx={{ fontWeight: 600, background: '#f1641e', '&:hover': { background: '#d35400' } }}
      >
        {loading ? "Processing..." : `Pay $${(amount / 100).toFixed(2)}`}
      </Button>
    </form>
  );
}

export default StripeCheckoutForm;
