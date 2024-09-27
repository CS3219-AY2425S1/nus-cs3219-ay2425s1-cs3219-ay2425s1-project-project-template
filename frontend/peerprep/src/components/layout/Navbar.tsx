import React from "react";
import { Box, Button, Icon, useDisclosure } from "@chakra-ui/react";
import { FiAlignJustify } from "react-icons/fi";
import logo from "/peerprep_logo.png";

import MenuDrawer from "../MenuDrawer";

const Navbar: React.FunctionComponent = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div>
      <Box className="flex justify-start items-center p-2 mb-5">
        <Button
          onClick={onOpen}
          border="2px solid"
          borderColor="white"
          bg="transparent"
          _hover={{ bg: "purple" }}
          className="mr-4"
        >
          <Icon as={FiAlignJustify} color="white" className="bg-opacity-0" />
        </Button>
        <img src={logo} alt="Peerprep Logo" className="w-10 h-10" />
        <span className="text-4xl text-white">PeerPrep</span>
      </Box>
      <MenuDrawer isOpen={isOpen} onClose={onClose} />
    </div>
  );
};

export default Navbar;
