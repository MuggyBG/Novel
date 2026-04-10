import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { TextField, Button, Container, Typography, Box, Alert } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';

const validationSchema = yup.object({
  identifier: yup.string().required('Username or Email is required'),
  password: yup.string().required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const res = await fetch(`http://localhost:5174/users`);
        const users = await res.json();

        const userMatch = users.find(u =>
          (u.email === values.identifier || u.username === values.identifier) &&
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
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'white', p: 4, borderRadius: 2 }}>
        <Typography component="h1" variant="h5" color="primary">
          Sign In
        </Typography>

        {errorMsg && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{errorMsg}</Alert>}

        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
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
            Sign In
          </Button>
          <Typography variant="body2" align="center">
            Don't have an account? <Link to="/register">Register here</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;