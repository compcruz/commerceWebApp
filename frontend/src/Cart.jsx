import React from "react";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import StripeProvider from "./StripeProvider.jsx";
import StripeCheckoutForm from "./StripeCheckoutForm";

function Cart({ onCheckout }) {
  const { cart, removeFromCart, clearCart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const { token } = useAuth();

  // Address fields state
  const [address, setAddress] = React.useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  });
  const [addressTouched, setAddressTouched] = React.useState({});

  // Remove old payment fields and validation

  const addressValid = Object.values(address).every(v => v.trim() !== '');

  const handleAddressChange = (field, value) => {
    setAddress(a => ({ ...a, [field]: value }));
  };
  const handleAddressBlur = field => setAddressTouched(t => ({ ...t, [field]: true }));

  // Handle order placement after payment
  const [orderLoading, setOrderLoading] = React.useState(false);
  const [orderError, setOrderError] = React.useState(null);
  const [orderSuccess, setOrderSuccess] = React.useState(false);

  const handlePaymentSuccess = async (paymentIntent) => {
    setOrderLoading(true);
    setOrderError(null);
    try {
      // Prepare order payload
      const items = cart.map(({ product, quantity }) => ({ productId: product.id, quantity }));
      const orderPayload = {
        items,
        ...address
      };
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(orderPayload)
      });
      if (!res.ok) throw new Error("Order failed");
      setOrderSuccess(true);
      clearCart();
    } catch (err) {
      setOrderError(err.message);
    } finally {
      setOrderLoading(false);
    }
  };

  const handlePaymentError = (err) => {
    setOrderError(err.message || "Payment failed");
  };


  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '60vh', py: 4 }}>
      <Card sx={{ width: '100%', maxWidth: 600, borderRadius: 4, boxShadow: 6, bgcolor: '#fff7f0', p: { xs: 1, md: 3 } }}>
        <CardContent>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: '#f1641e', textAlign: 'center' }}>
            Shopping Cart
          </Typography>
          {cart.length === 0 ? (
            <Typography sx={{ textAlign: 'center', color: '#888', fontSize: 18 }}>Your cart is empty.</Typography>
          ) : (
            <Box>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                {cart.map(({ product, quantity }) => (
                  <Grid item xs={12} key={product.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#fff', borderRadius: 2, boxShadow: 1, p: 2 }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{product.name}</Typography>
                        <Typography variant="body2" color="text.secondary">${product.price} x {quantity}</Typography>
                      </Box>
                      <Button variant="outlined" color="error" size="small" sx={{ ml: 2 }} onClick={() => removeFromCart(product.id)}>
                        Remove
                      </Button>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Total:</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>${total.toFixed(2)}</Typography>
              </Box>
              {/* Address Section */}
              <Box sx={{ mt: 4, mb: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#f1641e', fontWeight: 600 }}>
                  Delivery Address
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Full Name"
                      variant="outlined"
                      fullWidth
                      value={address.name}
                      onChange={e => handleAddressChange('name', e.target.value)}
                      onBlur={() => handleAddressBlur('name')}
                      error={addressTouched.name && !address.name.trim()}
                      helperText={addressTouched.name && !address.name.trim() ? "Required" : ""}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Street Address"
                      variant="outlined"
                      fullWidth
                      value={address.street}
                      onChange={e => handleAddressChange('street', e.target.value)}
                      onBlur={() => handleAddressBlur('street')}
                      error={addressTouched.street && !address.street.trim()}
                      helperText={addressTouched.street && !address.street.trim() ? "Required" : ""}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="City"
                      variant="outlined"
                      fullWidth
                      value={address.city}
                      onChange={e => handleAddressChange('city', e.target.value)}
                      onBlur={() => handleAddressBlur('city')}
                      error={addressTouched.city && !address.city.trim()}
                      helperText={addressTouched.city && !address.city.trim() ? "Required" : ""}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="State"
                      variant="outlined"
                      fullWidth
                      value={address.state}
                      onChange={e => handleAddressChange('state', e.target.value)}
                      onBlur={() => handleAddressBlur('state')}
                      error={addressTouched.state && !address.state.trim()}
                      helperText={addressTouched.state && !address.state.trim() ? "Required" : ""}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Zip Code"
                      variant="outlined"
                      fullWidth
                      value={address.zip}
                      onChange={e => handleAddressChange('zip', e.target.value)}
                      onBlur={() => handleAddressBlur('zip')}
                      error={addressTouched.zip && !address.zip.trim()}
                      helperText={addressTouched.zip && !address.zip.trim() ? "Required" : ""}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Country"
                      variant="outlined"
                      fullWidth
                      value={address.country}
                      onChange={e => handleAddressChange('country', e.target.value)}
                      onBlur={() => handleAddressBlur('country')}
                      error={addressTouched.country && !address.country.trim()}
                      helperText={addressTouched.country && !address.country.trim() ? "Required" : ""}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Payment Section with Stripe */}
              <StripeProvider>
                <Box sx={{ mt: 4, mb: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: '#f1641e', fontWeight: 600 }}>
                    Payment Details
                  </Typography>
                  <StripeCheckoutForm
                    amount={Math.round(total * 100)}
                    address={address}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                    disabled={!addressValid || cart.length === 0 || !token || orderLoading}
                  />
                  {orderError && <Typography color="error" sx={{ mt: 2 }}>{orderError}</Typography>}
                  {orderSuccess && <Typography color="primary" sx={{ mt: 2 }}>Order placed successfully!</Typography>}
                </Box>
              </StripeProvider>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default Cart;
