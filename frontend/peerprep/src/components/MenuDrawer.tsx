import React from 'react';
import { Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, Box, Button, Icon, useColorModeValue } from '@chakra-ui/react';
import { FiLogOut } from 'react-icons/fi';
import { FaHome, FaHistory } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';

type MenuDrawerProps = {
    isOpen: boolean;
    onClose: () => void;
};

const MenuDrawer: React.FC<MenuDrawerProps> = ({ isOpen, onClose }) => {
    // Use a color scheme for dark blue background and white text
    const drawerBgColor = 'blue.900';
    const buttonTextColor = 'white';

    return (
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent bg={drawerBgColor} color={buttonTextColor}>
                <DrawerCloseButton />
                <DrawerHeader>Menu</DrawerHeader>

                <DrawerBody>
                    {/* Add menu items with icons and text aligned to the left */}
                    <Box mb={4}>
                        <Button 
                            variant="link" 
                            width="100%" 
                            mb={2} 
                            justifyContent="start" // Align text to the left
                            leftIcon={<FaHome />}
                            color={buttonTextColor}
                        >
                            Home
                        </Button>
                        <Button 
                            variant="link" 
                            width="100%" 
                            mb={2} 
                            justifyContent="start" // Align text to the left
                            leftIcon={<IoMdSettings />}
                            color={buttonTextColor}
                        >
                            Account Settings
                        </Button>
                        <Button 
                            variant="link" 
                            width="100%" 
                            mb={2} 
                            justifyContent="start" // Align text to the left
                            leftIcon={<FaHistory />}
                            color={buttonTextColor}
                        >
                            History
                        </Button>
                    </Box>
                </DrawerBody>

                <Box position="absolute" bottom="0" width="100%" p={4}>
                    <Button 
                        onClick={onClose} 
                        colorScheme="blue" 
                        color={buttonTextColor}
                        leftIcon={<FiLogOut />}
                        width="100%"
                    >
                        Log Out
                    </Button>
                </Box>
            </DrawerContent>
        </Drawer>
    );
};

export default MenuDrawer;