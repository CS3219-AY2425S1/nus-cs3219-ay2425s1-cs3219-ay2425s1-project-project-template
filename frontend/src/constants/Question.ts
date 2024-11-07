import { useState } from 'react';
import { useEffect } from 'react';

export const difficulties = ['Easy', 'Medium', 'Hard'];

const API_BASE_URL = 'http://localhost/api/questions';

export const useTopics = () => {
  const [topics, setTopics] = useState<string[]>([]);

  const fetchTopics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/topics`);
      if (!response.ok) {
        console.error(`An error occurred: ${response.statusText}`);
        return;
      }
      const records = await response.json();
      console.log(records);
      setTopics(records);
    } catch (error) {
      console.error('An error occurred:', error);
      setTopics([]);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  return topics;
};

export const topics = [
  'Array',
  'Two Pointers',
  'Sliding Window',
  'Hash Table',
  'Linked List',
  'Doubly-Linked List',
  'String',
  'Math',
  'Bit Manipulation',
  'Recursion',
  'Backtracking',
  'Dynamic Programming',
  'Greedy',
  'Stack',
  'Queue',
  'Priority Queue',
  'Graph',
  'Matrix',
  'Depth-First Search',
  'Breadth-First Search',
  'Topological Sort',
  'Tree',
  'Database',
  'Brainteaser',
];
