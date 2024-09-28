import React, { useContext, useState } from "react";

import { Avatar, Button, Container } from "@chakra-ui/react";
import { UserContext } from "../../context/UserContext";
import InputBox from "../../components/InputBox";

const ProfileView = () => {
  const userContext = useContext(UserContext);
  const user = userContext?.user;

  const [input, setInput] = useState<string>("");

  return (
    <div>
      <Container maxW="60%">
        <div className="flex flex-col items-center space-y-4 pb-10">
          <div className="text-[30px] font-medium">Account Settings</div>
          <Avatar size="2xl" />
        </div>
        <div className="flex flex-row justify-between mx-20 items-center">
          <div>
            <div>Name</div>
            <InputBox
              placeholder="Default"
              value={user?.username || ""}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <Button
            variant={"outline"}
            color="white"
            borderColor={"purple.500"}
            borderWidth={2}
            _hover={{ bg: "purple.300" }}
            borderRadius={18}
          >
            Edit
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default ProfileView;
