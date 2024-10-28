import React from 'react';
import { Box, Heading, Text, VStack, Container } from '@chakra-ui/react';

const AboutUs: React.FC = () => {
  return (
    <Container maxW="container.md" py={10} px={6}>
      {/* Main Title Section */}
      <Box textAlign="center" mb={12}>
        <Heading as="h1" size="2xl" color="#65afff">
          About PeerPrep
        </Heading>
        <Text fontSize="lg" mt={4} color="gray.600">
          Practice Coding Together, Anytime, Anywhere!
        </Text>
      </Box>

      {/* Introduction Section */}
      <Box bg="gray.50" p={6} borderRadius="md" boxShadow="md">
        <VStack spacing={4} align="start">
          <Text fontSize="md" color="gray.700">
            <strong style={{ color: '#65afff' }}>PeerPrep</strong> is an interactive coding platform designed for programmers of all levels to improve their problem-solving skills and collaborate with peers in real-time. Inspired by platforms like <strong style={{ color: '#65afff' }}>LeetCode</strong>, PeerPrep offers a unique live-matching feature that connects you with other users for a collaborative coding experience.
          </Text>
        </VStack>
      </Box>

      {/* Why PeerPrep Section */}
      <Box bg="gray.50" mt={10} p={8} borderRadius="md" boxShadow="md">
        <Heading as="h2" size="lg" color="#65afff">
          Why PeerPrep?
        </Heading>
        <Text fontSize="md" mt={4} color="gray.700">
          At PeerPrep, we believe that learning is better together. Whether you're preparing for technical interviews or honing your programming skills, PeerPrep provides a supportive environment where you can:
        </Text>

        <VStack align="start" pl={4} spacing={3} mt={4}>
          <Text>• Practice coding questions in a variety of topics and difficulty levels.</Text>
          <Text>• Get matched with peers based on your topic and skill preferences.</Text>
          <Text>• Collaborate in real-time with a shared coding editor.</Text>
          <Text>• Receive instant feedback and work through problems together.</Text>
        </VStack>
      </Box>

      {/* Key Features Section */}
      <Box bg="gray.50" mt={10} bg="gray.50" p={8} borderRadius="md" boxShadow="md">
        <Heading as="h2" size="lg" color="#65afff">
          Key Features
        </Heading>
        <Text fontSize="md" color="gray.700">
          PeerPrep is packed with features to enhance your coding practice and collaborative experience:
        </Text>

        <VStack align="start" pl={4} spacing={3} mt={4}>
          <Text>• <strong style={{ color: '#65afff' }}>Real-Time Matching</strong>: Connect with other users looking to solve the same type of problems.</Text>
          <Text>• <strong style={{ color: '#65afff' }}>Live Code Collaboration</strong>: Solve coding challenges together in a shared workspace, similar to Google Docs but for code.</Text>
          <Text>• <strong style={{ color: '#65afff' }}>Wide Range of Questions</strong>: Practice a variety of questions, from easy to difficult, across different topics like arrays, algorithms, data structures, and more.</Text>
          <Text>• <strong style={{ color: '#65afff' }}>Instant Feedback</strong>: Submit code for evaluation and receive immediate results.</Text>
        </VStack>
      </Box>

      {/* Mission Section */}
      <Box bg="gray.50" mt={10} p={8} borderRadius="md" boxShadow="md">
        <Heading as="h2" size="lg" color="#65afff">
          Our Mission
        </Heading>
        <Text fontSize="md" color="gray.700">
          Our mission is to create a collaborative learning environment that empowers programmers to achieve their best. Whether you're a beginner or a seasoned coder, PeerPrep is here to help you connect, learn, and grow with others.
        </Text>
      </Box>

      {/* Join Us Section */}
      <Box bg="gray.50" mt={10} p={8} borderRadius="md" boxShadow="md" textAlign="center">
        <Heading as="h2" size="lg" color="#65afff">
          Join Us
        </Heading>
        <Text fontSize="md" color="gray.700">
          Ready to start your coding journey with others? Join PeerPrep today and take your problem-solving skills to the next level!
        </Text>
      </Box>
    </Container>
  );
};

export default AboutUs;
