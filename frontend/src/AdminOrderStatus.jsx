import React, { useState } from "react";
import PropTypes from "prop-types";
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';

const STATUS_OPTIONS = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function AdminOrderStatus({ orderId, currentStatus, onStatusChange }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Failed to update status');
      setStatus(newStatus);
      if (onStatusChange) onStatusChange(newStatus);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Select
        value={status}
        onChange={handleChange}
        disabled={loading}
        size="small"
        sx={{ minWidth: 140 }}
      >
        {STATUS_OPTIONS.map(opt => (
          <MenuItem key={opt} value={opt}>{opt}</MenuItem>
        ))}
      </Select>
      {loading && <span style={{ color: '#f1641e' }}>Updating...</span>}
    </Box>
  );
}

AdminOrderStatus.propTypes = {
  orderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  currentStatus: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func,
};
