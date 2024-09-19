import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react';

const questionData = [
  { title: 'Two Sum', difficulty: 'Easy', acceptance: '45%' },
  { title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', acceptance: '30%' },
  { title: 'Median of Two Sorted Arrays', difficulty: 'Hard', acceptance: '25%' },
  { title: 'Reverse Integer', difficulty: 'Easy', acceptance: '50%' },
  { title: 'Zigzag Conversion', difficulty: 'Medium', acceptance: '33%' },
  { title: 'Palindrome Number', difficulty: 'Easy', acceptance: '47%' },
  { title: 'Container With Most Water', difficulty: 'Medium', acceptance: '55%' },
  { title: 'Roman to Integer', difficulty: 'Easy', acceptance: '58%' },
  { title: 'Longest Common Prefix', difficulty: 'Easy', acceptance: '42%' },
  { title: '3Sum', difficulty: 'Medium', acceptance: '27%' },
  { title: 'Valid Parentheses', difficulty: 'Easy', acceptance: '40%' },
  { title: 'Merge Two Sorted Lists', difficulty: 'Easy', acceptance: '52%' },
  { title: 'Search in Rotated Sorted Array', difficulty: 'Medium', acceptance: '33%' },
  { title: 'Find First and Last Position of Element in Sorted Array', difficulty: 'Medium', acceptance: '38%' },
  { title: 'Combination Sum', difficulty: 'Medium', acceptance: '44%' },
  { title: 'First Missing Positive', difficulty: 'Hard', acceptance: '29%' },
  { title: 'Trapping Rain Water', difficulty: 'Hard', acceptance: '42%' },
  { title: 'Multiply Strings', difficulty: 'Medium', acceptance: '31%' },
  { title: 'Jump Game', difficulty: 'Medium', acceptance: '34%' },
  { title: 'Permutations', difficulty: 'Medium', acceptance: '55%' },
];

export default function QuestionsPage() {
  return (
    <TableContainer className='px-8 mt-4'>
      <Table variant="striped">
        <Thead>
          <Tr>
            <Th>Title</Th>
            <Th>Difficulty</Th>
            <Th>Acceptance</Th>
          </Tr>
        </Thead>
        <Tbody>
          {questionData.map((question, index) => (
            <Tr key={index}>
              <Td>{question.title}</Td>
              <Td>{question.difficulty}</Td>
              <Td>{question.acceptance}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}