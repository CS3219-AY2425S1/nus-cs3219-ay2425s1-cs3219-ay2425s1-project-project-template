'use client';

import { useState, useRef } from "react";
import { 
  Avatar, 
  Button, 
  Card, 
  HStack, 
  AlertDialog, 
  AlertDialogBody, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogContent, 
  AlertDialogOverlay,
  Stack, 
  Tag, 
  TagLabel, 
  TagLeftIcon, 
  VStack, 
  useToast } from "@chakra-ui/react";
import { AtSignIcon, LinkIcon } from "@chakra-ui/icons";
import { deleteUser } from "@/services/userService";
import useAuth from "@/hooks/useAuth";

export default function ProfilePage() {
  const toast = useToast();
  const { userId, username, email } = useAuth();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const handleDeleteProfile = () => {
    try {
      deleteUser(userId);
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to delete profile', 
        status: 'error', 
        duration: 3000, 
        isClosable: true,
        position: 'top'
      });
    }
  };

  return (
    <div className="p-8">
      <Stack spacing={20} direction={'row'}>
        <Card width='350px' height='320px' marginLeft='10px'>
          <HStack>
            <Avatar size='2xl' name={username} src='https://cdn-icons-png.flaticon.com/128/17446/17446833.png' margin='30px' />
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
          <Button backgroundColor='#38A169' color='#FFFFFF' margin='10px' onClick={() => setIsEdit(true)}>Edit Profile</Button>
          <Button colorScheme="red" margin='10px' onClick={() => setIsAlertOpen(true)}>Delete Profile</Button>

          <AlertDialog
            isOpen={isAlertOpen}
            leastDestructiveRef={cancelRef}
            onClose={() => setIsAlertOpen(false)}
            isCentered
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Delete Profile
                </AlertDialogHeader>

                <AlertDialogBody>
                  Are you sure? You can't undo this action afterwards.
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)}>
                    Cancel
                  </Button>
                  <Button colorScheme="red" onClick={handleDeleteProfile} ml={3}>
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </Card>

        <Card width='800px' height='395px'>
          Display Content... Mb for Recent Activities (questions attempted)
        </Card>
      </Stack>
    </div>
  );
}
