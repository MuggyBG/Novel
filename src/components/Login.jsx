import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { TextField, Button, Container, Typography, Box, Alert, Paper } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../utils/apiHelpers';

const validationSchema = yup.object({
  email: yup.string().required('Email/Username is required'),
  password: yup.string().required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const res = await fetch(API_ENDPOINTS.users);
        const users = await res.json();

        const userMatch = users.find(u =>
          (u.email === values.email || u.username === values.email) &&
          u.password === values.password
        );

        if (userMatch) {
          localStorage.setItem('user', JSON.stringify(userMatch));
          navigate('/');
          window.location.reload(); 
        } else {
          setErrorMsg('Invalid credentials.');
        }
      } catch (err) {
        setErrorMsg('Database offline.');
      }
    },
  });

  return (
    <Container maxWidth="xs">
      <Paper sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4, borderRadius: 2, boxShadow: 3 }}>
        <Typography component="h1" variant="h5" color="primary" fontWeight="bold">Sign In</Typography>
        {errorMsg && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{errorMsg}</Alert>}
        
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            fullWidth margin="normal" id="email" name="email" label="Email or Username"
            value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            fullWidth margin="normal" id="password" name="password" label="Password" type="password"
            value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <Button color="primary" variant="contained" fullWidth type="submit" size="large" sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
          <Typography variant="body2" align="center" color="text.secondary">
            Don't have an account? <Link to="/register" style={{ color: '#747bff' }}>Register here</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;