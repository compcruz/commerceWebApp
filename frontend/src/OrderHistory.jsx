import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import AdminOrderStatus from "./AdminOrderStatus";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

function OrderHistory() {
  const { token, isAdmin } = useAuth(); // Assume isAdmin for demo
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:8080/api/orders/mine", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch orders");
        return res.json();
      })
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  if (!token) return null;
  if (loading) return <Box sx={{ textAlign: 'center', py: 6 }}>Loading order history...</Box>;
  if (error) return <Box sx={{ color: 'red', textAlign: 'center', py: 6 }}>Error: {error}</Box>;

  return (
    <Box sx={{ width: '100%', py: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: '#f1641e', textAlign: 'center' }}>
        Your Orders
      </Typography>
      {orders.length === 0 ? (
        <Box sx={{ textAlign: 'center', color: '#888', fontSize: 18 }}>No orders found.</Box>
      ) : (
        <Grid container spacing={4} justifyContent="center">
          {orders.map(order => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={order.id}>
              <Card sx={{ borderRadius: 3, boxShadow: 3, bgcolor: '#fff7f0', height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle2" sx={{ color: '#888', mb: 1 }}>
                    {new Date(order.orderDate).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>
                    Status: <b>{order.status}</b>
                  </Typography>
                  {isAdmin && (
                    <AdminOrderStatus
                      orderId={order.id}
                      currentStatus={order.status}
                      onStatusChange={() => window.location.reload()}
                    />
                  )}
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>
                    Products
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
  {order.products.map((p, idx) => (
    <li key={p.id || idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
      {p.imageUrl && (
        <img
          src={p.imageUrl}
          alt={p.name}
          style={{
            width: 48,
            height: 48,
            objectFit: 'cover',
            borderRadius: 8,
            marginRight: 12,
            border: '2px solid #f1641e22',
            boxShadow: '0 1px 6px 0 rgba(241,100,30,0.08)'
          }}
        />
      )}
      <span style={{ color: '#444', fontSize: 16, fontWeight: 500 }}>{p.name}</span>
    </li>
  ))}
</ul>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default OrderHistory;
