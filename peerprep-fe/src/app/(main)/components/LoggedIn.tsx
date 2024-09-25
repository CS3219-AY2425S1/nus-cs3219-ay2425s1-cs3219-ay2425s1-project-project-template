'use client';
import { useEffect, useState } from 'react';
import axiosQuestionClient from '@/network/axiosClient';
import FilterBar from './filter/FilterBar';
import ProblemTable from './problems/ProblemTable';
import { Problem } from '@/types/types';

export default function LoggedIn() {
  const [problems, setProblems] = useState<Problem[]>([]);

  useEffect(() => {
    // Fetch data from backend API
    const fetchProblems = async () => {
      try {
        const response = await axiosQuestionClient.get('/questions');
        setProblems(response.data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };

    fetchProblems();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-6 pt-24 text-gray-100">
      <div className="mx-auto max-w-7xl">
        <FilterBar />
        <ProblemTable problems={problems} />
      </div>
    </div>
  );
}

// TODO: replace with backend-fetched data
// const problems: Problem[] = [
//   {
//     question_id: 1,
//     title: "Two Sum",
//     difficulty: 1,
//     description:
//       "Given an array of integers nums\u00a0and an integer target, return indices of the two numbers such that they add up to target.\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\nYou can return the answer in any order.",
//     examples: [
//       "Example 1:\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].",
//       "Example 2:\nInput: nums = [3,2,4], target = 6\nOutput: [1,2]",
//       "Example 3:\nInput: nums = [3,3], target = 6\nOutput: [0,1]",
//     ],
//     constraints:
//       "Constraints:\n\n2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nOnly one valid answer exists.\n\n\u00a0\nFollow-up:\u00a0Can you come up with an algorithm that is less than O(n^2)\u00a0time complexity?",
//     tags: ["Array", "Hash Table"],
//     title_slug: "two-sum",
//   },
//   {
//     question_id: 9,
//     title: "Palindrome Number",
//     difficulty: 2,
//     description:
//       "Given an integer x, return true if x is a palindrome, and false otherwise.",
//     examples: [
//       "Example 1:\nInput: x = 121\nOutput: true\nExplanation: 121 reads as 121 from left to right and from right to left.",
//       "Example 2:\nInput: x = -121\nOutput: false\nExplanation: From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.",
//       "Example 3:\nInput: x = 10\nOutput: false\nExplanation: Reads 01 from right to left. Therefore it is not a palindrome.",
//     ],
//     constraints:
//       "Constraints:\n\n-2^31\u00a0<= x <= 2^31\u00a0- 1\n\n\u00a0\nFollow up: Could you solve it without converting the integer to a string?",
//     tags: ["Math"],
//     title_slug: "palindrome-number",
//   },
//   {
//     question_id: 13,
//     title: "Roman to Integer",
//     difficulty: 1,
//     description:
//       "Roman numerals are represented by seven different symbols:\u00a0I, V, X, L, C, D and M.\n\nSymbol       Value\nI             1\nV             5\nX             10\nL             50\nC             100\nD             500\nM             1000\nFor example,\u00a02 is written as II\u00a0in Roman numeral, just two ones added together. 12 is written as\u00a0XII, which is simply X + II. The number 27 is written as XXVII, which is XX + V + II.\nRoman numerals are usually written largest to smallest from left to right. However, the numeral for four is not IIII. Instead, the number four is written as IV. Because the one is before the five we subtract it making four. The same principle applies to the number nine, which is written as IX. There are six instances where subtraction is used:\n\nI can be placed before V (5) and X (10) to make 4 and 9.\u00a0\nX can be placed before L (50) and C (100) to make 40 and 90.\u00a0\nC can be placed before D (500) and M (1000) to make 400 and 900.\n\nGiven a roman numeral, convert it to an integer.",
//     examples: [
//       'Example 1:\nInput: s = "III"\nOutput: 3\nExplanation: III = 3.',
//       'Example 2:\nInput: s = "LVIII"\nOutput: 58\nExplanation: L = 50, V= 5, III = 3.',
//       'Example 3:\nInput: s = "MCMXCIV"\nOutput: 1994\nExplanation: M = 1000, CM = 900, XC = 90 and IV = 4.',
//     ],
//     constraints:
//       "Constraints:\n\n1 <= s.length <= 15\ns contains only\u00a0the characters ('I', 'V', 'X', 'L', 'C', 'D', 'M').\nIt is guaranteed\u00a0that s is a valid roman numeral in the range [1, 3999].",
//     tags: ["Hash Table", "Math", "String"],
//     title_slug: "roman-to-integer",
//   },
//   {
//     question_id: 14,
//     title: "Longest Common Prefix",
//     difficulty: 3,
//     description:
//       'Write a function to find the longest common prefix string amongst an array of strings.\nIf there is no common prefix, return an empty string "".',
//     examples: [
//       'Example 1:\nInput: strs = ["flower","flow","flight"]\nOutput: "fl"',
//       'Example 2:\nInput: strs = ["dog","racecar","car"]\nOutput: ""\nExplanation: There is no common prefix among the input strings.',
//     ],
//     constraints:
//       "Constraints:\n\n1 <= strs.length <= 200\n0 <= strs[i].length <= 200\nstrs[i] consists of only lowercase English letters.",
//     tags: ["String", "Trie"],
//     title_slug: "longest-common-prefix",
//   },
// ];

// // TODO: replace with backend-fetched data
// const problems = [
//   {
//     status: "attempted",
//     title: "2220. Minimum Bit Flips to Convert Number",
//     topics: ["Bit Manipulation"],
//     difficulty: "Easy",
//     difficultyColor: "text-green-500",
//   },
//   {
//     status: "solved",
//     title: "1. Two Sum",
//     topics: ["Array", "Hash Table"],
//     difficulty: "Easy",
//     difficultyColor: "text-green-500",
//   },
//   {
//     status: "unsolved",
//     title: "2. Add Two Numbers",
//     topics: ["Linked List", "Math"],
//     difficulty: "Medium",
//     difficultyColor: "text-yellow-500",
//   },
//   {
//     status: "solved",
//     title: "3. Longest Substring Without Repeating Characters",
//     topics: ["Hash Table", "String", "Sliding Window"],
//     difficulty: "Medium",
//     difficultyColor: "text-yellow-500",
//   },
//   {
//     status: "unsolved",
//     title: "4. Median of Two Sorted Arrays",
//     topics: ["Array", "Binary Search", "Divide and Conquer"],
//     difficulty: "Hard",
//     difficultyColor: "text-red-500",
//   },
//   {
//     status: "unsolved",
//     title: "5. Longest Palindromic Substring",
//     topics: ["String", "Dynamic Programming"],
//     difficulty: "Medium",
//     difficultyColor: "text-yellow-500",
//   },
//   {
//     status: "unsolved",
//     title: "6. Zigzag Conversion",
//     topics: ["String"],
//     difficulty: "Medium",
//     difficultyColor: "text-yellow-500",
//   },
//   {
//     status: "unsolved",
//     title: "7. Reverse Integer",
//     topics: ["Math"],
//     difficulty: "Medium",
//     difficultyColor: "text-yellow-500",
//   },
//   {
//     status: "unsolved",
//     title: "8. String to Integer (atoi)",
//     topics: ["String", "Math"],
//     difficulty: "Medium",
//     difficultyColor: "text-yellow-500",
//   },
//   {
//     status: "solved",
//     title: "9. Palindrome Number",
//     topics: ["Math"],
//     difficulty: "Easy",
//     difficultyColor: "text-green-500",
//   },
// ];
