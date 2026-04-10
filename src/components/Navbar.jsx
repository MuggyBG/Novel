import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, TextField, IconButton, Menu, MenuItem, Avatar } from '@mui/material';

const Navbar = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const [anchorEl, setAnchorEl] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
      setSearchQuery('');
    }
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem('user');
    handleMenuClose();
    window.location.href = '/login';
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
              size="small" placeholder="Search novels..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} variant="outlined"
              sx={{ bgcolor: darkMode ? '#2a2a40' : '#fff', borderRadius: 1 }}
            />
            <Button type="submit" sx={{ ml: 1, minWidth: '40px' }} variant="contained">🔍</Button>
          </form>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button component={Link} to="/browse/1" color="inherit">Browse</Button>

          <Button onClick={() => setDarkMode(!darkMode)} color="inherit" sx={{ minWidth: '90px' }}>
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </Button>
          {user ? (
            <>
              <IconButton onClick={handleMenuOpen} sx={{ p: 0, ml: 1 }}>
                <Avatar sx={{ bgcolor: 'primary.main', color: 'white' }}>
                  {user.username.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>

              <Menu
                sx={{ mt: '45px' }}
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem disabled>
                  <Typography variant="body2" color="text.secondary">Logged in as {user.username}</Typography>
                </MenuItem>
                {user.role === 'admin' && (
                  <MenuItem component={Link} to="/admin" onClick={handleMenuClose} sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                    Admin Dashboard
                  </MenuItem>
                )}

                <MenuItem component={Link} to="/library" onClick={handleMenuClose}>
                  Saved
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                  Sign Out
                </MenuItem>
              </Menu>
            </>
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