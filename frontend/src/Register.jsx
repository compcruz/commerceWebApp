import React, { useState } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

function Register({ onRegister, onToggle }) {
  const [form, setForm] = useState({ username: "", password: "", email: "", role: "user" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null); setSuccess(null);
    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error(await res.text());
      setSuccess("Registration successful! You can now log in.");
      setForm({ username: "", password: "", email: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Grid container sx={{ minHeight: '100vh', bgcolor: '#fff7f0' }}>
      <Grid item xs={12} md={6} sx={{ width: { xs: '100%', md: '40%' }, flexBasis: { xs: '100%', md: '40%' }, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 6 }}>
        <Typography variant="h2" sx={{ color: '#f1641e', fontWeight: 800, mb: 3, textAlign: 'center', letterSpacing: 2 }}>
          Join Compcruz
        </Typography>
        <Typography variant="h5" sx={{ color: '#333', textAlign: 'center', maxWidth: 400, mb: 4 }}>
          Create an account to buy, sell, and explore unique finds!
        </Typography>
        {/* Optional: Add an Etsy-style illustration or icon here */}
      </Grid>
      <Grid item xs={12} md={6} sx={{ width: { xs: '100%', md: '60%' }, flexBasis: { xs: '100%', md: '60%' }, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 6 }}>
        <Box sx={{ width: '100%', maxWidth: 420, bgcolor: '#fff', borderRadius: 4, boxShadow: 6, mx: 'auto', px: { xs: 2, md: 4 }, py: { xs: 3, md: 6 }, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: '#f1641e', textAlign: 'center' }}>
            Register
          </Typography>
          {error && <Typography sx={{ color: 'red', mb: 2, textAlign: 'center' }}>{error}</Typography>}
          {success && <Typography sx={{ color: 'green', mb: 2, textAlign: 'center' }}>{success}</Typography>}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              select
              label="Role"
              name="role"
              value={form.role}
              onChange={handleChange}
              SelectProps={{ native: true }}
              fullWidth
              sx={{ mb: 2 }}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </TextField>
            <TextField
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              fullWidth
              sx={{ mb: 3 }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ fontWeight: 600, background: '#f1641e', '&:hover': { background: '#d35400' } }}>
              Register
            </Button>
            <Button type="button" onClick={onToggle} fullWidth sx={{ mt: 2, color: '#f1641e', fontWeight: 600 }}>
              Already have an account?
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default Register;
