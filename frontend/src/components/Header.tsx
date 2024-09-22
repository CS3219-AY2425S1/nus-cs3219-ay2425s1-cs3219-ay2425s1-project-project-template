import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Header = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogOut = () => {
    auth.logOut(navigate);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Website Name */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          PeerPrep
        </Typography>

        <Button
          color="inherit" component={Link} to="/dashboard">
          Home
        </Button>
        <Button color="inherit" component={Link} to="/questions">
          Questions
        </Button>
        <Button color="inherit" component={Link} to="/matching">
          Matching
        </Button>
        <Button color="inherit" component={Link} to="/dashboard/edit-profile">
          Profile
        </Button>

        <Button color="inherit" onClick={handleLogOut}>
          Sign Out
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;