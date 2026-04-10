import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, TextField } from '@mui/material';

const Navbar = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
      setSearchQuery(''); 
    }
  };

  return (
    <AppBar position="sticky" color="inherit" elevation={2}>
      <Toolbar>
        <Typography variant="h5" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit', fontWeight: '900', letterSpacing: 1 }}>
          MugNovel
        </Typography>

        <Box sx={{ display: 'flex', gap: { xs: 1, md: 3 }, alignItems: 'center' }}>
          
          <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Search novels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant="outlined"
              sx={{ bgcolor: darkMode ? '#2a2a40' : '#fff', borderRadius: 1 }}
            />
            <Button type="submit" sx={{ ml: 1, minWidth: '40px' }} variant="contained">
              🔍
            </Button>
          </form>

          <Button component={Link} to="/browse" color="inherit">Browse</Button>
          <Button component={Link} to="/library" color="inherit">Library</Button>
          
          <Button onClick={() => setDarkMode(!darkMode)} color="inherit" sx={{ minWidth: '90px' }}>
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </Button>

          {user ? (
            <Button onClick={handleLogout} variant="outlined" color="primary">
              Sign Out ({user.username})
            </Button>
          ) : (
            <Button component={Link} to="/login" variant="contained" color="primary">
              Sign In
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;