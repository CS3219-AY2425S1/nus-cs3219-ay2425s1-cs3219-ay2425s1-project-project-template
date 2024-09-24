import React from 'react';
import { Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, Box, Button, Icon, useColorModeValue } from '@chakra-ui/react';
import { FiLogOut } from 'react-icons/fi';
import logo from '/peerprep_logo.png';
import { menuItems } from '../data';

type MenuDrawerProps = {
    isOpen: boolean;
    onClose: () => void;
};

const MenuDrawer: React.FC<MenuDrawerProps> = ({ isOpen, onClose }) => {
    const drawerBgColor = '#141A67';
    const buttonTextColor = 'white';

    return (
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent bg={drawerBgColor} color={buttonTextColor}>
                <DrawerCloseButton
                    marginTop={2}
                    _hover={{ borderColor: "white"}}/>
                <DrawerHeader marginTop={2}>
                    <div className="flex items-center">
                        <img src={logo} alt="Peerprep Logo" className="w-10 h-10 mr-1" />
                        <span className="text-3xl text-white">PeerPrep</span>
                    </div>
                </DrawerHeader>

                <DrawerBody>
                    <Box mb={4}>
                        {menuItems.map((item, index) => (
                            <Button 
                                key={index}
                                variant="link"
                                width="100%"
                                p={5}
                                mb={2}
                                justifyContent="start"
                                leftIcon={<item.icon />} 
                                _hover={{ borderColor: "white"}}
                                color={buttonTextColor}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </Box>
                </DrawerBody>

                <Box position="absolute" bottom="0" width="100%" p={4}>
                    <Button 
                        onClick={onClose}
                        p={5}
                        bg="#141A67" 
                        color={buttonTextColor}
                        leftIcon={<FiLogOut />}
                        _hover={{ borderColor: "white"}}
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