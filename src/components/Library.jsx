import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

const Library = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', bgcolor: '#2a2a40', color: 'white' }}>
          <Typography variant="h5" gutterBottom>
            You must be signed in to view your library.
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: '#a9a9bc' }}>
            Log in to save your favorite novels and track your reading progress.
          </Typography>
          <Button variant="contained" component={Link} to="/login" sx={{ bgcolor: '#747bff', '&:hover': { bgcolor: '#535bf2' } }}>
            Go to Sign In
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ borderBottom: '1px solid #3f3f5a', pb: 2, mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 'bold' }}>
          Welcome back, {user.username}!
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#a9a9bc' }}>
          Here is your personal reading library.
        </Typography>
      </Box>

      <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#2a2a40', color: '#a9a9bc' }}>
        <Typography variant="body1">
          Your library is currently empty. Go to the Browse page to find some novels!
        </Typography>
        <Button variant="outlined" component={Link} to="/browse" sx={{ mt: 2, color: '#747bff', borderColor: '#747bff' }}>
          Browse Novels
        </Button>
      </Paper>
    </Container>
  );
};

export default Library;