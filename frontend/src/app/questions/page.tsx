"use client"

import React, { useState } from 'react'
import { Check, CheckIcon, PlusIcon, X, Pencil, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Card } from '@/components/ui/card'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface Question {
  id: number
  title: string
  description: string
  category: string
  complexity: 'Easy' | 'Medium' | 'Hard'
  completed: boolean
}

const initialQuestions: Question[] = [
  {
    id: 1,
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    category: "Array",
    complexity: "Easy",
    completed: true
  },
  {
    id: 2,
    title: "Add Two Numbers",
    description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
    category: "Linked List",
    complexity: "Medium",
    completed: false
  },
  {
    id: 3,
    title: "Median of Two Sorted Arrays",
    description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
    category: "Array",
    complexity: "Hard",
    completed: false
  },
  {
    id: 4,
    title: "Reverse a String",
    description: "Write a function that reverses a string. The input string is given as an array of characters.You must do this by modifying the input array in-place with O(1) extra memory. Constraints1 <= s.length <= 105 s[i] is a printable ascii  character. ",
    category: "Strings, Algorithms",
    complexity: "Easy",
    completed: true
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
    complexity: "Medium",
    completed: false
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
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question)
    setIsEditDialogOpen(true)
  }

  const handleAddQuestion = () => {
    setEditingQuestion({
      id: Math.max(...questions.map(q => q.id)) + 1,
      title: '',
      description: '',
      category: '',
      complexity: 'Easy',
      completed: false
    })
    setIsEditDialogOpen(true)
  }

  const handleSaveQuestion = () => {
    if (editingQuestion) {
      const updatedQuestions = editingQuestion.id
        ? questions.map(q => q.id === editingQuestion.id ? editingQuestion : q)
        : [...questions, editingQuestion]
      setQuestions(updatedQuestions)
    }
    setIsEditDialogOpen(false)
    setEditingQuestion(null)
  }

  const handleDeleteQuestion = () => {
    if (editingQuestion) {
      setQuestions(questions.filter(q => q.id !== editingQuestion.id))
    }
    setIsDeleteConfirmOpen(false)
    setIsEditDialogOpen(false)
    setEditingQuestion(null)
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
        <Button onClick={handleAddQuestion}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Question
        </Button>
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
              <tr key={question.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{question.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Dialog>
                    <DialogTrigger asChild>
                      <span className="cursor-pointer block transform hover:scale-[1.01] transition duration-200 ease-in-out">
                        {question.title}
                      </span>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold">{question.title}</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <p className="text-sm text-gray-500"><span className="font-semibold">Category:</span> {question.category}</p>
                        <p className="text-sm text-gray-500"><span className="font-semibold">Complexity:</span> <ComplexityBadge complexity={question.complexity} /></p>
                        <p className="text-sm text-gray-500"><span className="font-semibold">Completed:</span> {question.completed ? 'Yes' : 'No'}</p>
                        <p className="text-sm text-gray-500"><span className="font-semibold">Description:</span> {question.description}</p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{question.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <ComplexityBadge complexity={question.complexity} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex justify-center">
                  {question.completed ? <Check className="text-green-500" /> : <X className="text-red-500" />}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => handleEditQuestion(question)}
                    className="text-indigo-600 hover:text-indigo-900"
                    aria-label="Edit question"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingQuestion?.id ? 'Edit Question' : 'Add Question'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={editingQuestion?.title || ''}
                onChange={(e) => setEditingQuestion(q => q ? {...q, title: e.target.value} : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Input
                id="category"
                value={editingQuestion?.category || ''}
                onChange={(e) => setEditingQuestion(q => q ? {...q, category: e.target.value} : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="complexity" className="text-right">
                Complexity
              </Label>
              <Select
                value={editingQuestion?.complexity}
                onValueChange={(value: 'Easy' | 'Medium' | 'Hard') => setEditingQuestion(q => q ? {...q, complexity: value} : null)}
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
              <Label htmlFor="completed" className="text-right">
                Completed
              </Label>
              <Switch
                id="completed"
                checked={editingQuestion?.completed || false}
                onCheckedChange={(checked) => setEditingQuestion(q => q ? {...q, completed: checked} : null)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={editingQuestion?.description || ''}
                onChange={(e) => setEditingQuestion(q => q ? {...q, description: e.target.value} : null)}
                className="col-span-3 min-h-[10em]"
              />
            </div>
          </div>
          <DialogFooter>
            {editingQuestion?.id && (
              <Button variant="destructive" onClick={() => setIsDeleteConfirmOpen(true)}>
                Delete
              </Button>
            )}
            <Button onClick={handleSaveQuestion}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this question?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteQuestion}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}