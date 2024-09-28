"use client"

import React, { useState } from 'react'
import { Check, CheckIcon, ChevronDownIcon, ChevronUpIcon, PlusIcon, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card } from '@/components/ui/card'

interface Question {
  id: number
  title: string
  description: string
  category: string
  complexity: 'Easy' | 'Medium' | 'Hard'
}

const initialQuestions: Question[] = [
  {
    id: 1,
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    category: "Array",
    complexity: "Easy"
  },
  {
    id: 2,
    title: "Add Two Numbers",
    description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
    category: "Linked List",
    complexity: "Medium"
  },
  {
    id: 3,
    title: "Median of Two Sorted Arrays",
    description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
    category: "Array",
    complexity: "Hard"
  },
  {
    id: 4,
    title: "Reverse a String",
    description: "Write a function that reverses a string. The input string is given as an array of characters.You must do this by modifying the input array in-place with O(1) extra memory. Constraints1 <= s.length <= 105 s[i] is a printable ascii  character. ",
    category: "Strings, Algorithms",
    complexity: "Easy"
  },
  {
    id: 5,
    title: "Longest Common Subsequence",
    description: `Given two strings text1 and text2, return the length of their longest common 
    subsequence. If there is no common subsequence, return 0. A subsequence of a string is a new
    string generated from the original string with some characters (can be none) deleted without
    changing the relative order of the remaining characters. For example, 'ace' is a subsequence 
    of 'abcde'. A common subsequence of two strings is a subsequence that is common to both strings.
    Example 1:
    Input: text1 = "abcde", text2 = "ace" 
    Output: 3  
    Explanation: The longest common subsequence is "ace" and its length is 3.

    Example 2:

    Input: text1 = "abc", text2 = "abc"
    Output: 3
    Explanation: The longest common subsequence is "abc" and its length is 3.

    Example 3:

    Input: text1 = "abc", text2 = "def"
    Output: 0
    Explanation: There is no such common subsequence, so the result is 0.

    
    Constraints: 1 <= text1.length, text2.length <= 1000, text1 and text2 consist of only lowercase 
    English character`, 
    category: "Strings, Algorithms",
    complexity: "Medium"
  }
]

const ComplexityBadge: React.FC<{ complexity: Question['complexity'] }> = ({ complexity }) => {
  const colorClass = {
    Easy: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Hard: 'bg-red-100 text-red-800'
  }[complexity]

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {complexity}
    </span>
  )
}
const truncateDescription = (description: string, lines: number = 4) => {
  const words = description.split(' ')
  const truncatedString = words.slice(0, lines * 20).join(' ')
  return truncatedString.length < description.length ? `${truncatedString}...` : truncatedString
}
export default function Questions() {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions)
  const [expandedQuestionId, setExpandedQuestionId] = useState<number | null>(null)
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false)
  const [newQuestion, setNewQuestion] = useState<Omit<Question, 'id'>>({
    title: '',
    description: '',
    category: '',
    complexity: 'Easy'
  })

  const toggleQuestion = (id: number) => {
    setExpandedQuestionId(expandedQuestionId === id ? null : id)
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card className="bg-accent text-accent-foreground p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">56</h3>
              <p className="text-sm">Problems Solved</p>
            </div>
            <CheckIcon className="w-10 h-10" />
          </div>
        </Card>
      </div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Interview Questions</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>
      
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question Number</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question Title</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question Category</th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Question Complexity</th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {questions.map((question) => (
            <React.Fragment key={question.id}>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{question.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500
                    transform hover:scale-[1.03] transition duration-200 ease-in-out cursor-pointer"
                  onClick={() => toggleQuestion(question.id)}>
                  {question.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{question.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <ComplexityBadge complexity={question.complexity} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex justify-center">
                  <Check />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => toggleQuestion(question.id)}
                    className="text-indigo-600 hover:text-indigo-900"
                    aria-label={expandedQuestionId === question.id ? "Hide description" : "Show description"}
                  >
                    {expandedQuestionId === question.id ? (
                      <ChevronUpIcon className="h-5 w-5" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5" />
                    )}
                  </button>
                </td>
              </tr>
              {expandedQuestionId === question.id && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 whitespace-normal text-sm text-gray-500 bg-gray-50">
                    <strong className="font-medium">Description:</strong> {' '}

                    <Dialog>
                      <DialogTrigger asChild>
                        <span className="cursor-pointer block transform hover:scale-[1.01] transition duration-200 ease-in-out">
                          {truncateDescription(question.description)}
                        </span>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{question.title}</DialogTitle>
                        </DialogHeader>
                        <p className="mt-2 text-sm text-gray-500">{question.description}</p>
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
    </main >
  )
}