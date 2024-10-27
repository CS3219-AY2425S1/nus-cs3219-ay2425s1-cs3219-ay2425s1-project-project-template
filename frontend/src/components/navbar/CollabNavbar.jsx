import React from 'react';
import TimerIcon from '@mui/icons-material/Timer';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { NavbarContainer } from './NavbarContainer';
import { NavbarLogo } from './NavbarLogo';
import { NavbarLink } from './NavbarLink';
import { NavbarButton } from './NavbarButton';

const username = "JaneDoe123"; // partner's username
const remainingTime = "29:31";

export default function CollabNavbar() {
    const navigate = useNavigate();
    const [cookies, removeCookie] = useCookies(["token"]);

    const handleLogout = () => {
        removeCookie("token");
        navigate("/login");
    };

    const handleSubmit = () => {
        // Handle submit logic here
        console.log("Submit clicked");
    };

    const handleQuit = () => {
        // Handle quit logic here
        navigate("/home");
    };

    return (
        <NavbarContainer>
            {/* Left Side: Logo */}
            <NavbarLogo />

            {/* Middle: username and timer */}
            <Box sx={{ display: 'flex', gap: 5, flexGrow: 1, alignItems: 'center', marginLeft: '30px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <p style={{ color: '#000', fontSize: '1.2rem', fontWeight: 'bold' }}>{username}</p>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TimerIcon style={{ color: '#000' }} />
                    <p style={{ color: '#000', fontSize: '1.2rem', fontWeight: 'bold' }}>{remainingTime}</p>
                </Box>
            </Box>

            {/* Right Side: Submit and Quit Buttons */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <NavbarButton
                    onClick={handleSubmit}
                    color="#A3FFD6" // Green color for submit
                    textColor="#000"
                    hoverColor="#388E3C"
                >
                    Submit
                </NavbarButton>
                <NavbarButton
                    onClick={handleQuit}
                    color="#FF8888" // Red color for quit
                    textColor="#000"
                    hoverColor="#D32F2F"
                >
                    Quit
                </NavbarButton>
            </Box>
        </NavbarContainer>
    );
}
