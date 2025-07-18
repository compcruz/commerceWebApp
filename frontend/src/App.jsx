import React from "react";
import { AuthProvider, useAuth } from "./AuthContext";
import { CartProvider, useCart } from "./CartContext";
import ProductList from "./ProductList";
import Cart from "./Cart";
import OrderHistory from "./OrderHistory";
import ErrorBoundary from "./ErrorBoundary";
import Login from "./Login";
import Register from "./Register";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

function MainApp() {
  const { token, username, logout, login } = useAuth();
  const { cart, clearCart } = useCart();
  const [showRegister, setShowRegister] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('products');
  const [orderMsg, setOrderMsg] = React.useState("");

  // Hide order message on navigation
  React.useEffect(() => {
    setOrderMsg("");
  }, [activeTab]);

  // Auto-dismiss order message after 4s
  React.useEffect(() => {
    if (orderMsg) {
      const timer = setTimeout(() => setOrderMsg(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [orderMsg]);

  const handleCloseOrderMsg = () => setOrderMsg("");

  const handleCheckout = async () => {
    setOrderMsg("");
    try {
      const items = cart.map(({ product, quantity }) => ({ productId: product.id, quantity }));
      const res = await fetch("http://localhost:8080/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ items })
      });
      if (!res.ok) throw new Error(await res.text());
      setOrderMsg("Order placed successfully!");
      clearCart();
    } catch (err) {
      setOrderMsg("Order failed: " + err.message);
    }
  };

  if (!token) {
    return showRegister ? (
      <Register onToggle={() => setShowRegister(false)} />
    ) : (
      <Login onLogin={login} onToggle={() => setShowRegister(true)} />
    );
  }

  return (
    <Box sx={{ background: '#fff7f0', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ background: '#f1641e', boxShadow: 'none', mb: 3 }}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 2, color: '#fff7f0' }}>
            compcruz
          </Typography>
          <Typography variant="body1" sx={{ color: '#fff7f0', mr: 2 }}>
            {username}
          </Typography>
          <Button color="inherit" onClick={logout} sx={{ color: '#fff7f0', fontWeight: 600 }}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          textColor="primary"
          indicatorColor="primary"
          sx={{ bgcolor: '#fff', borderRadius: 2, boxShadow: 1 }}
        >
          <Tab value="products" label={<><Inventory2Icon sx={{mr:1}}/>Products</>} />
          <Tab value="orders" label={<><ReceiptLongIcon sx={{mr:1}}/>Orders</>} />
          <Tab value="cart" label={<><ShoppingCartIcon sx={{mr:1}}/>Cart ({cart.length})</>} />
        </Tabs>
      </Box>
      {orderMsg && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Alert
            severity={orderMsg.startsWith('Order placed') ? 'success' : 'error'}
            sx={{ width: '100%', maxWidth: 600, fontWeight: 500, fontSize: 18, alignItems: 'center' }}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={handleCloseOrderMsg}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {orderMsg}
          </Alert>
        </Box>
      )}
      <Box sx={{ width: '95vw', maxWidth: '1800px', mx: 'auto', p: { xs: 0, md: 2 }, bgcolor: '#fff', borderRadius: 3, boxShadow: 2, minHeight: '70vh' }}>
        {activeTab === 'products' && <ProductList columns={5} />}
        {activeTab === 'orders' && <OrderHistory />}
        {activeTab === 'cart' && <Cart onCheckout={handleCheckout} />}
      </Box>
    </Box>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <MainApp />
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
