import { Box, Input, Button } from '@chakra-ui/react';

// import CodeEditor from '../../../../components/collaboration/CodeEditor';

import dynamic from 'next/dynamic';
// Dynamically import CodeEditor to ensure it works with Next.js
const CodeEditor = dynamic(() => import('../../../../components/collaboration/CodeEditor'), { ssr: false });

const App: React.FC = () => {
//   const [jwtToken, setJwtToken] = useState<string>('');

//   const handleSaveToken = () => {
//     if (jwtToken) {
//       localStorage.setItem('jwtToken', jwtToken);
//       alert('Token saved to localStorage');
//     } else {
//       alert('Please enter a token');
//     }
//   };

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setJwtToken(e.target.value);
//   };
 
  return (
    <Box minH="100vh" bg="#0f0a19" color="gray.500" px={6} py={8}>
      <CodeEditor />
    </Box>
  );
};

export default App;