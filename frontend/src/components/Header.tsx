import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';  // Assuming you have a useAuth hook

const Header = () => {
  const auth = useAuth();  // Get the auth context
  const navigate = useNavigate();  // Get navigate function

  const handleLogOut = () => {
    auth.logOut(navigate);  // Call the logOut method and navigate away after logout
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Website Name */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          PeerPrep
        </Typography>

        {/* Navigation Links */}
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        <Button color="inherit" component={Link} to="/questions">
          Questions
        </Button>
        <Button color="inherit" component={Link} to="/matching">
          Matching
        </Button>
        <Button color="inherit" component={Link} to="/profile">
          Profile
        </Button>

        {/* Sign Out Button */}
        <Button color="inherit" onClick={handleLogOut}>
          Sign Out
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;