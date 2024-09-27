"use client"

import React, { useState } from 'react'
import { Check, ChevronDownIcon, ChevronUpIcon, PlusIcon, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

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
    description: " Write a function that reverses a string. The input string is given as an array of characters.You must do this by modifying the input array in-place with O(1) extra memory. Constraints1 <= s.length <= 105 s[i] is a printable ascii  character. ",
    category: "Strings, Algorithms",
    complexity: "Easy"
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

  const handleAddQuestion = () => {
    const newId = Math.max(...questions.map(q => q.id)) + 1
    setQuestions([...questions, { ...newQuestion, id: newId }])
    setIsAddQuestionOpen(false)
    setNewQuestion({
      title: '',
      description: '',
      category: '',
      complexity: 'Easy'
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Interview Questions</h1>
      </div>

      <div className="flex justify-between items-end mb-6">
        <div className="bg-gray-100 p-6 rounded-lg shadow-md min-w-72">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">3</p>
              <p className="text-sm">Problems Solved</p>
            </div>
            <Check className="w-12 h-12 text-black" />
          </div>
        </div>

        <div className="flex space-x-4">
          <Dialog open={isAddQuestionOpen} onOpenChange={setIsAddQuestionOpen}>
            <DialogTrigger asChild>
              <Button variant="default">
                <PlusIcon className="w-5 h-5 mr-2" />
                Add Question
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Question</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={newQuestion.title}
                    onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Input
                    id="category"
                    value={newQuestion.category}
                    onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="complexity" className="text-right">
                    Complexity
                  </Label>
                  <Select
                    value={newQuestion.complexity}
                    onValueChange={(value: 'Easy' | 'Medium' | 'Hard') => setNewQuestion({ ...newQuestion, complexity: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select complexity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={newQuestion.description}
                    onChange={(e) => setNewQuestion({ ...newQuestion, description: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <Button onClick={handleAddQuestion}>Add Question</Button>
            </DialogContent>
          </Dialog>
          <Button asChild>
            <label htmlFor="file-upload" className="flex items-ceter cursor-pointer">
                <PlusIcon className="w-5 h-5 mr-2"/>
                Upload JSON
                <input id="file-upload" type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
          </Button>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question Id</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question Title</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question Category</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question Complexity</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ComplexityBadge complexity={question.complexity} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
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