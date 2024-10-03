'use client';

import { Avatar, Button, Card, HStack, Stack, Tag, TagLabel, TagLeftIcon, VStack } from "@chakra-ui/react";
import { AtSignIcon, LinkIcon } from "@chakra-ui/icons";
import useAuth from "@/hooks/useAuth";

export default function ProfilePage() {
  const { username, email } = useAuth();
  return (
    <div className="p-8">
      <Stack spacing={20} direction={'row'}>
      <Card width='350px' height='250px' marginLeft='10px'>
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
        <Button backgroundColor='#38A169' color='#FFFFFF' margin='10px' onClick={()=>{}}>Edit Profile</Button>
      </Card>
      <Card width='800px' height='395px'>
        Display Content? For delete and edit content
      </Card>
      </Stack>
    </div>
  );
}
