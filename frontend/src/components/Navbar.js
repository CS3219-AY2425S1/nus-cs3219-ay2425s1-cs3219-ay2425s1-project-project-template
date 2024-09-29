import { useState, useEffect } from 'react';
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem } from '@mui/material';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from "axios";
import Logo from '../assets/Logo.png';
import "@fontsource/poppins";

export default function Navbar() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // axios.get('/api/user')
        //     .then(res => {
        //         setUser(res.data);
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     });
    }, []);

    const handleOpenMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        axios.get('/api/logout')
            .then(() => {
                navigate('/');
            })
            .catch(err => {
                console.log(err);
            });
    };

    const navLinkStyle = {
        color: '#000',             // Black color for text
        fontFamily: 'Poppins',     // Font family: Poppins
        fontSize: '18px',          // Font size: 20px
        fontStyle: 'normal',       // Normal font style
        fontWeight: 600,           // Font weight: 600 (semi-bold)
        textAlign: 'center',       // Center the text
        lineHeight: 'normal',      // Normal line height
        textTransform: 'none',     // Disable Material-UI's default uppercase transform
    };
  
    const linkStyle = {
        color: '#000',
        textDecoration: 'none',
    };

    const getLinkStyle = (path) => ({
        color: location.pathname === path ? '#fff' : '#000',  // White for active page, black for others
        textDecoration: 'none'
      });
  
    return (
    <AppBar position="sticky" sx={{ top: 0, backgroundColor: '#61c0f8', zIndex: 999, maxHeight: 75 }}>
        <Toolbar sx={{ justifyContent: 'center' }}>
        
        <Box sx={{
            left: '10px',
            width: '288px',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center'
        }}>
            <img src={Logo} alt="Logo" style={{ height: 70, cursor: 'pointer' }} onClick={() => navigate('/')} />
        </Box>

        <Box sx={{ flexGrow: 1, display: 'flex', gap: 5, maxWidth: '100%' }}>
            <Button color="inherit" sx={{ ...navLinkStyle }}>
                <Link to="/" style={getLinkStyle('/')}>Home</Link>
            </Button>
            <Button color="inherit" sx={{ ...navLinkStyle }}>
                <Link to="/profile" style={getLinkStyle('/profile')}>Profile</Link>
            </Button>
            <Button color="inherit" sx={{ ...navLinkStyle }}>
                <Link to="/history" style={getLinkStyle('/history')}>History</Link>
            </Button>
            <Button color="inherit" sx={{ ...navLinkStyle }}>
                <Link to="/questions" style={getLinkStyle('/questions')}>Questions</Link>
            </Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
                variant="contained"
                sx={{
                    width: '126px',
                    height: '45px',
                    flexShrink: 0,
                    backgroundColor: '#8576FF', 
                    fontFamily: 'Poppins', 
                    fontSize: '18px', 
                    fontWeight: 600,
                    textAlign: 'center',
                    lineHeight: 'normal',
                    textTransform: 'none',
                    '&:hover': {
                        backgroundColor: '#915edc',
                    },
                    marginLeft: '15px',
                }}
            >
                Logout
            </Button>
        </Box>
        </Toolbar>
    </AppBar>
    );
}