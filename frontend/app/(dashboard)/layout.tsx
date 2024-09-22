'use client';

import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import { Stack, Text, Spacer, Box, Flex } from "@chakra-ui/react";
import { HamburgerIcon } from "@/public/icons/HamburgerIcon";
import { ChevronIcon } from "@/public/icons/ChevronIcon";
import NavbarCards, { NavbarCardProps } from "@/components/NavbarCard";
import questionImage from '@/public/images/questions.png';
import practiceImage from '@/public/images/practice.png';
import profileImage from '@/public/images/profile.png';

const items: NavbarCardProps[] = [
  {
    imageSrc: questionImage,
    title: "My Questions",
    description: "Review your attempted questions here.",
    route: "/questions",
  },
  {
    imageSrc: practiceImage,
    title: "Practice",
    description: "Find a match and start practicing now!",
    route: "/practice",
  },
  {
    imageSrc: profileImage,
    title: "My Profile",
    description: "View your profile and change settings here.",
    route: "/profile",
  },
];

export default function Layout({
  children
}: {
  children: React.ReactNode;
}) {
  const [isToggled, setIsToggled] = useState(false);
  const [isUserTriggered, setIsUserTriggered] = useState(false);
  const pathname = usePathname();

  const handleToggle = () => {
    setIsToggled(!isToggled);
    setIsUserTriggered(true);
  };

  useEffect(() => {
    setIsToggled(false);
    setIsUserTriggered(false);
  }, [pathname]);

  return (
    <Flex direction="column" height="100vh">
      <Stack direction="row" align="center" justify="space-between" className="bg-[#2C5282] p-2 px-8 ">
        <Text fontSize="30px" color="white" as="b">
          {'{PeerPrep}'}
        </Text>
        <Spacer />
        <>
          <Text fontSize="20px" color="white">
            username
          </Text>
          <Box ml={10} onClick={handleToggle} cursor="pointer">
            {isToggled ? <ChevronIcon /> : <HamburgerIcon />}
          </Box>
        </>
      </Stack>
      <Box
        className={`${isUserTriggered ? 'transition-all duration-500 ease-in-out' : ''}`}
        style={{ maxHeight: isToggled ? '500px' : '0', overflow: 'hidden' }}
      >
        <Stack direction="row" align="center" justify="space-between" className="px-8">
          {items.map((item, index) => (
            <NavbarCards key={index} {...item} />
          ))}
        </Stack>
      </Box>
      {children}
    </Flex>
  );
}
