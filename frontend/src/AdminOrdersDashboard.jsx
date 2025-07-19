import React, { useEffect, useState } from "react";
import AdminOrderStatus from "./AdminOrderStatus";
import { useAuth } from "./AuthContext";
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';

export default function AdminOrdersDashboard() {
  const { role } = useAuth();
  const isAdmin = role && role.toLowerCase() === 'admin';
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/orders")
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
  }, []);

  const filteredOrders = orders.filter(order =>
    order.id.toString().includes(search) ||
    order.name?.toLowerCase().includes(search.toLowerCase()) ||
    order.status?.toLowerCase().includes(search.toLowerCase())
  );

  if (!isAdmin) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error" sx={{ mt: 8, mb: 2 }}>
          Access Denied
        </Typography>
        <Typography variant="body1">You do not have permission to view this page.</Typography>
      </Box>
    );
  }

  // Status color mapping
  const statusColor = {
    PENDING: 'default',
    PAID: 'info',
    SHIPPED: 'primary',
    DELIVERED: 'success',
    CANCELLED: 'error'
  };

  // Get product counts for each order
  const getProductCounts = (products) => {
    const counts = {};
    products.forEach(p => {
      counts[p.name] = (counts[p.name] || 0) + 1;
    });
    return counts;
  };

  return (
    <Box sx={{ p: { xs: 1, md: 4 } }}>
      <Typography variant="h4" sx={{ mb: 3, color: '#f1641e', fontWeight: 700, textAlign: 'center' }}>Admin Orders Dashboard</Typography>
      <TextField
        label="Search by Order ID, Name, or Status"
        value={search}
        onChange={e => setSearch(e.target.value)}
        fullWidth
        sx={{ mb: 3, maxWidth: 500, mx: 'auto', display: 'block' }}
        size="small"
      />
      {loading ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography sx={{ color: '#f1641e', fontWeight: 600 }}>Loading orders...</Typography>
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
          <Table size="small" sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow sx={{ background: '#f7f3ef' }}>
                <TableCell sx={{ fontWeight: 700, position: 'sticky', top: 0, background: '#f7f3ef', zIndex: 1 }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Address</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Products</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', color: '#888', fontSize: 18, py: 6 }}>
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map(order => {
                  const productCounts = getProductCounts(order.products);
                  return (
                    <TableRow key={order.id} hover sx={{ transition: 'background 0.2s' }}>
                      <TableCell sx={{ fontWeight: 500 }}>{order.id}</TableCell>
                      <TableCell>{new Date(order.orderDate).toLocaleString()}</TableCell>
                      <TableCell>{order.name}</TableCell>
                      <TableCell>
                        {[order.street, order.city, order.state, order.zip, order.country].filter(Boolean).join(', ')}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AdminOrderStatus
                            orderId={order.id}
                            currentStatus={order.status}
                            onStatusChange={() => window.location.reload()}
                          />
                          <Chip
                            label={order.status}
                            color={statusColor[order.status] || 'default'}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <ul style={{ margin: 0, paddingLeft: 16 }}>
                          {Object.entries(productCounts).map(([name, qty], idx) => (
                            <li key={idx}>{name} <span style={{ color: '#888', fontWeight: 500 }}>x{qty}</span></li>
                          ))}
                        </ul>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
