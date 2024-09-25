"use client"
import React, { useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon, PlusIcon } from 'lucide-react'

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

export default function Questions() {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions)
  const [expandedQuestionId, setExpandedQuestionId] = useState<number | null>(null)

  const toggleQuestion = (id: number) => {
    setExpandedQuestionId(expandedQuestionId === id ? null : id)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string)
          if (Array.isArray(json)) {
            setQuestions(json)
          } else {
            alert('Invalid JSON format. Please upload an array of questions.')
          }
        } catch (error) {
          alert('Error parsing JSON file. Please check the file format.')
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Interview Questions</h1>
        <div>
          <label htmlFor="file-upload" className="bg-black text-white py-2 px-4 rounded-md flex items-center hover:bg-gray-800 transition-colors cursor-pointer">
            <PlusIcon className="w-5 h-5 mr-2" />
            Upload Questions JSON
          </label>
          <input id="file-upload" type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Complexity</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {questions.map((question) => (
              <React.Fragment key={question.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{question.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{question.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{question.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ComplexityBadge complexity={question.complexity} />
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
                    <td colSpan={5} className="px-6 py-4 whitespace-normal text-sm text-gray-500 bg-gray-50">
                      <strong className="font-medium">Description:</strong> {question.description}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}