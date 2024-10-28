"use client";

import {
  Box,
  Flex,
  Button,
  useColorModeValue,
  Container,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";

export default function HomeNavBar({ isAuthenticated, onLogout }) {
  const navigate = useNavigate()

  return (
    <Box as="nav" position="fixed" top="0" left="0" right="0" zIndex="1000">
      <Box
        bg={useColorModeValue("gray.100", "gray.900")}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
      >
        <Container maxW="container.xl">
          <Flex
            color={useColorModeValue("gray.600", "white")}
            minH={"80px"}
            py={{ base: 2 }}
            px={{ base: 4 }}
            align={"center"}
            justify={"flex-end"}
          >
            <Flex align={"center"}>
              <Link to="/questions">
                <Button variant="ghost" fontWeight="bold" mr={86}>
                  Questions
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="ghost" fontWeight="bold" mr={86}>
                  Dashboard
                </Button>
              </Link>
              <Link to="/match-me">
                <Button variant="ghost" fontWeight="bold" mr={86}>
                  Match Me
                </Button>
              </Link>
              <Link to="/aboutus">
                <Button variant="ghost" fontWeight="bold" mr={86}>
                  About Us
                </Button>
              </Link>
              {!isAuthenticated ? (
                <Link to="/login">
                  <Button variant="ghost" fontWeight="bold" mr={86}>
                    Login
                  </Button>
                </Link>
              ) : (
                <Menu>
                  <MenuButton
                    as={Button}
                    fontSize={"sm"}
                    fontWeight={600}
                    color={"white"}
                    bg={"blue.300"}
                    _hover={{ bg: "blue.400" }}
                    ml={4}>
                    My Account
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={() => navigate("/profile")}>My Profile</MenuItem>
                    <MenuItem onClick={onLogout}>Logout</MenuItem>
                  </MenuList>
                </Menu>
              )}
            </Flex>
          </Flex>
        </Container>
      </Box>
    </Box>
  )
}
