import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { TextField, Button, Container, Typography, Box, Alert } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';

const validationSchema = yup.object({
  username: yup.string().required('Username is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().min(6, 'Password should be of minimum 6 characters length').required('Password is required'),
});

const Register = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const checkRes = await fetch(`http://localhost:5173/users?email=${values.email}`);
        const existingUsers = await checkRes.json();
        
        if (existingUsers.length > 0) {
          setErrorMsg('An account with this email already exists.');
          return;
        }
        const res = await fetch('http://localhost:5173/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });

        if (res.ok) {
          navigate('/login'); 
        }
      } catch (err) {
        setErrorMsg('Server error. Is JSON Server running?');
      }
    },
  });

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'white', p: 4, borderRadius: 2 }}>
        <Typography component="h1" variant="h5" color="primary">
          Register for NovelHaven
        </Typography>
        
        {errorMsg && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{errorMsg}</Alert>}

        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
          <TextField
            fullWidth margin="normal" id="username" name="username" label="Username"
            value={formik.values.username} onChange={formik.handleChange} onBlur={formik.handleBlur}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />
          <TextField
            fullWidth margin="normal" id="email" name="email" label="Email Address"
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
          <Button color="primary" variant="contained" fullWidth type="submit" sx={{ mt: 3, mb: 2 }}>
            Register
          </Button>
          <Typography variant="body2" align="center">
            Already have an account? <Link to="/login">Sign In here</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;