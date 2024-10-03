'use client';

import { useState } from "react";
import { 
  Avatar, 
  Button, 
  Card, 
  HStack, 
  Popover, 
  PopoverBody,
  PopoverContent,
  PopoverCloseButton, 
  PopoverTrigger, 
  Stack, Tag, TagLabel, TagLeftIcon, VStack } from "@chakra-ui/react";
import { AtSignIcon, LinkIcon } from "@chakra-ui/icons";
import { deleteUser } from "@/services/userService";
import useAuth from "@/hooks/useAuth";


export default function ProfilePage() {
  const { userId, username, email } = useAuth();
  // TODO:
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const handleDeleteProfile = () => {
    deleteUser(userId);
  }

  return (
    <div className="p-8">
      <Stack spacing={20} direction={'row'}>
      <Card width='350px' height='320px' marginLeft='10px'>
        <HStack>
          <Avatar size='2xl' name='Dan Abrahmov' src='https://cdn-icons-png.flaticon.com/128/17446/17446833.png' margin='30px'/>
          <VStack align='left'>
            <Tag size='sm' key='sm' variant='subtle' colorScheme='cyan'>
              <TagLeftIcon boxSize='12px' as={AtSignIcon} />
              <TagLabel>{username}</TagLabel>
            </Tag>
            <Tag size='sm' key='sm' variant='subtle' colorScheme='cyan'>
              <TagLeftIcon boxSize='12px' as={LinkIcon} />
              <TagLabel>{email}</TagLabel>
            </Tag>
          </VStack>
        </HStack>
        <Button backgroundColor='#38A169' color='#FFFFFF' margin='10px' onClick={()=> setIsEdit(true)}>Edit Profile</Button>
        <Popover>
          <PopoverTrigger>
            <Button backgroundColor='#E53E3E' color='#FFFFFF' margin='10px'>Delete Profile</Button>
          </PopoverTrigger>
          <PopoverContent alignContent={'space'}>
            <PopoverCloseButton />
            <PopoverBody>Are you sure you want to delete your account?</PopoverBody>
            <Button colorScheme='blue' width='50%' alignSelf='center' margin='5px'onClick={handleDeleteProfile}>Confirm</Button>
          </PopoverContent>
        </Popover>
      </Card>
      <Card width='800px' height='395px'>
        Display Content... Mb for Recent Activities (questions attempted)
      </Card>
      </Stack>
    </div>
  );
}
