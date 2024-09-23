"use client";

import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Button, Spacer } from '@chakra-ui/react';
import Link from 'next/link';

export const questionData = [
  { title: 'Two Sum', difficulty: 'Easy', topics: ['Array', 'Hash Table'], description: 'Given an array of integers, return indices of the two numbers such that they add up to a specific target. You may assume that each input would have exactly one solution, and you may not use the same element twice.' },
  { title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', topics: ['Hash Table', 'String', 'Sliding Window'], description: 'Given a string, find the length of the longest substring without repeating characters. For example, the longest substring without repeating letters for "abcabcbb" is "abc", which the length is 3.' },
  { title: 'Median of Two Sorted Arrays', difficulty: 'Hard', topics: ['Array', 'Binary Search', 'Divide and Conquer'], description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).' },
  { title: 'Reverse Integer', difficulty: 'Easy', topics: ['Math'], description: 'Given a 32-bit signed integer, reverse digits of an integer. Assume we are dealing with an environment that could only store integers within the 32-bit signed integer range: [−231,  231 − 1].' },
  { title: 'Zigzag Conversion', difficulty: 'Medium', topics: ['String'], description: 'The string "PAYPALISHIRING" is written in a zigzag pattern on a given number of rows like this: (you may want to display this pattern in a fixed font for better legibility) P   A   H   N A P L S I I G Y   I   R And then read line by line: "PAHNAPLSIIGYIR"' },
  { title: 'Palindrome Number', difficulty: 'Easy', topics: ['Math'], description: 'Determine whether an integer is a palindrome. An integer is a palindrome when it reads the same backward as forward. For example, 121 is a palindrome while 123 is not.' },
  { title: 'Container With Most Water', difficulty: 'Medium', topics: ['Array', 'Two Pointers'], description: 'Given n non-negative integers a1, a2, ..., an , where each represents a point at coordinate (i, ai). n vertical lines are drawn such that the two endpoints of line i is at (i, ai) and (i, 0). Find two lines, which together with the x-axis forms a container, such that the container contains the most water.' },
  { title: 'Roman to Integer', difficulty: 'Easy', topics: ['Hash Table', 'Math', 'String'], description: 'Given a roman numeral, convert it to an integer. Input is guaranteed to be within the range from 1 to 3999.' },
  { title: 'Longest Common Prefix', difficulty: 'Easy', topics: ['String'], description: 'Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string "".' },
  { title: '3Sum', difficulty: 'Medium', topics: ['Array', 'Two Pointers'], description: 'Given an array nums of n integers, are there elements a, b, c in nums such that a + b + c = 0? Find all unique triplets in the array which gives the sum of zero.' },
  { title: 'Valid Parentheses', difficulty: 'Easy', topics: ['String', 'Stack'], description: 'Given a string containing just the characters \'(\', \')\', \'{\', \'}\', \'[\', and \']\', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order.' },
  { title: 'Merge Two Sorted Lists', difficulty: 'Easy', topics: ['Linked List'], description: 'Merge two sorted linked lists and return it as a new sorted list. The new list should be made by splicing together the nodes of the first two lists.' },
  // { title: 'Search in Rotated Sorted Array', difficulty: 'Medium', topics: ['Array', 'Binary Search'], description: 'Suppose an array sorted in ascending order is rotated at some pivot unknown to you beforehand. (i.e., [0,1,2,4,5,6,7] might become [4,5,6,7,0,1,2]). You are given a target value to search. If found in the array return its index, otherwise return -1.' },
  // { title: 'Find First and Last Position of Element in Sorted Array', difficulty: 'Medium', topics: ['Array', 'Binary Search'], description: 'Given an array of integers nums sorted in ascending order, find the starting and ending position of a given target value. If the target is not found in the array, return [-1, -1].' },
  // { title: 'Combination Sum', difficulty: 'Medium', topics: ['Array', 'Backtracking'], description: 'Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target. You may return the combinations in any order.' },
  // { title: 'First Missing Positive', difficulty: 'Hard', topics: ['Array', 'Hash Table'], description: 'Given an unsorted integer array nums, find the smallest missing positive integer. You must implement an algorithm that runs in O(n) time and uses constant extra space.' },
  // { title: 'Trapping Rain Water', difficulty: 'Hard', topics: ['Array', 'Two Pointers', 'Dynamic Programming', 'Stack'], description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.' },
  // { title: 'Multiply Strings', difficulty: 'Medium', topics: ['Math', 'String'], description: 'Given two non-negative integers num1 and num2 represented as strings, return the product of num1 and num2, also represented as a string. You must not use any built-in BigInteger library or convert the inputs to integer directly.' },
  // { title: 'Jump Game', difficulty: 'Medium', topics: ['Array', 'Dynamic Programming', 'Greedy'], description: 'Given an array of non-negative integers nums, you are initially positioned at the first index of the array. Each element in the array represents your maximum jump length at that position. Determine if you are able to reach the last index.' },
  // { title: 'Permutations', difficulty: 'Medium', topics: ['Array', 'Backtracking'], description: 'Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order.' },
];

export default function QuestionsPage() {
  return (
    <div className='px-8 mt-4' style={{ overflowY: 'scroll' }}>
      <TableContainer>
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th width="60%">Title</Th>
              <Th width="10%">Difficulty</Th>
              <Th width="30%">Topics</Th>
            </Tr>
          </Thead>
          <Tbody>
            {questionData.map((question, index) => (
              <Tr key={index}>
                <Td><Link href={`/questions/${index}`}>{question.title}</Link></Td>
                <Td>{question.difficulty}</Td>
                <Td>
                  {question.topics.map((topic, idx) => (
                    <span key={idx}>{topic}{idx < question.topics.length - 1 ? ', ' : ''}</span>
                  ))}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Button colorScheme="teal" onClick={() => alert('Add new question')} className='mt-4 mb-4'>
        Add New Question
      </Button>
    </div>
  );
}
