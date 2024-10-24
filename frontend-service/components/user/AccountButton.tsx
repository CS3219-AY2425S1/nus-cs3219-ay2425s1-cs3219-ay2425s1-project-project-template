import { Link } from "react-router-dom"
import { Button, Icon } from "@chakra-ui/react";
import { FaUser } from "react-icons/fa";

interface AccountButtonProps {
  id?: string
  username?: string
  email?: string
  isAdmin?: boolean
}

export default function AccountButton({ username }: AccountButtonProps) {

  return (
    <Button
      as={Link}
      to="/my-account"
      display={{ base: "none", md: "inline-flex" }}
      fontSize={"sm"}
      fontWeight={600}
      color={"white"}
      bg={"blue.300"}
      _hover={{
        bg: "blue.300",
      }}
      ml={4}
      leftIcon={<Icon as={FaUser}/>}
    >
      {username}
    </Button>
  )
}