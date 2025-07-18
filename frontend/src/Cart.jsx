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

function Cart({ onCheckout }) {
  const { cart, removeFromCart, clearCart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const { token } = useAuth();

  // Payment fields state
  const [cardNumber, setCardNumber] = React.useState("");
  const [expiry, setExpiry] = React.useState("");
  const [cvc, setCvc] = React.useState("");
  const [touched, setTouched] = React.useState({});

  // Simple validation
  const cardValid = /^\d{16}$/.test(cardNumber.replace(/\s+/g, ""));
  const expiryValid = /^(0[1-9]|1[0-2])\/(\d{2})$/.test(expiry);
  const cvcValid = /^\d{3,4}$/.test(cvc);
  const paymentValid = cardValid && expiryValid && cvcValid;

  const handleBlur = field => setTouched(t => ({ ...t, [field]: true }));

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
              <Box sx={{ mt: 4, mb: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#f1641e', fontWeight: 600 }}>
                  Payment Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Card Number"
                      variant="outlined"
                      fullWidth
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value.replace(/[^\d]/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                      onBlur={() => handleBlur('cardNumber')}
                      error={touched.cardNumber && !cardValid}
                      helperText={touched.cardNumber && !cardValid ? "Enter a valid 16-digit card number" : ""}
                      inputProps={{ maxLength: 19, inputMode: 'numeric', pattern: '\\d*' }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Expiry (MM/YY)"
                      variant="outlined"
                      fullWidth
                      value={expiry}
                      onChange={e => setExpiry(e.target.value.replace(/[^\d/]/g, '').slice(0, 5))}
                      onBlur={() => handleBlur('expiry')}
                      error={touched.expiry && !expiryValid}
                      helperText={touched.expiry && !expiryValid ? "MM/YY" : ""}
                      inputProps={{ maxLength: 5, placeholder: 'MM/YY' }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="CVC"
                      variant="outlined"
                      fullWidth
                      value={cvc}
                      onChange={e => setCvc(e.target.value.replace(/[^\d]/g, '').slice(0, 4))}
                      onBlur={() => handleBlur('cvc')}
                      error={touched.cvc && !cvcValid}
                      helperText={touched.cvc && !cvcValid ? "3 or 4 digits" : ""}
                      inputProps={{ maxLength: 4, inputMode: 'numeric', pattern: '\\d*' }}
                    />
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="outlined" color="secondary" onClick={clearCart} disabled={cart.length === 0} sx={{ fontWeight: 600 }}>
                  Clear Cart
                </Button>
                <Button variant="contained" color="primary" onClick={onCheckout} disabled={cart.length === 0 || !token || !paymentValid} sx={{ fontWeight: 600, background: '#f1641e', '&:hover': { background: '#d35400' } }}>
                  Checkout
                </Button>
              </Box>
              {!token && <Typography sx={{ color: 'red', mt: 2, textAlign: 'center' }}>Login to place order</Typography>}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default Cart;
