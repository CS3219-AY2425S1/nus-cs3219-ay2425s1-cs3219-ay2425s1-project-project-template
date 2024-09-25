"use client"
// import React, { useState } from 'react'
// import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'

// interface Question {
//   id: number
//   title: string
//   complexity: 'Easy' | 'Medium' | 'Hard'
//   category: string
//   description: string
// }

// const initialQuestions: Question[] = [
//   {
//     id: 1,
//     title: "Two Sum",
//     complexity: "Easy",
//     category: "Array",
//     description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target."
//   },
//   {
//     id: 2,
//     title: "Add Two Numbers",
//     complexity: "Medium",
//     category: "Linked List",
//     description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list."
//   },
//   {
//     id: 3,
//     title: "Median of Two Sorted Arrays",
//     complexity: "Hard",
//     category: "Array",
//     description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays."
//   }
// ]

// const ComplexityBadge: React.FC<{ complexity: Question['complexity'] }> = ({ complexity }) => {
//   const colorClass = {
//     Easy: 'bg-green-100 text-green-800',
//     Medium: 'bg-yellow-100 text-yellow-800',
//     Hard: 'bg-red-100 text-red-800'
//   }[complexity]

//   return (
//     <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
//       {complexity}
//     </span>
//   )
// }

// export default function LeetCodeQuestions() {
//   const [questions, setQuestions] = useState<Question[]>(initialQuestions)
//   const [expandedQuestionId, setExpandedQuestionId] = useState<number | null>(null)

//   const toggleQuestion = (id: number) => {
//     setExpandedQuestionId(expandedQuestionId === id ? null : id)
//   }

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0]
//     if (file) {
//       const reader = new FileReader()
//       reader.onload = (e) => {
//         try {
//           const json = JSON.parse(e.target?.result as string)
//           if (Array.isArray(json)) {
//             setQuestions(json)
//           } else {
//             alert('Invalid JSON format. Please upload an array of questions.')
//           }
//         } catch (error) {
//           alert('Error parsing JSON file. Please check the file format.')
//         }
//       }
//       reader.readAsText(file)
//     }
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6">LeetCode Interview Questions</h1>
      
//       <div className="mb-6">
//         <label htmlFor="file-upload" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded cursor-pointer">
//           Upload Questions JSON
//         </label>
//         <input id="file-upload" type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
//       </div>

//       <div className="bg-white shadow-md rounded-lg overflow-hidden">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Complexity</th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {questions.map((question) => (
//               <React.Fragment key={question.id}>
//                 <tr className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm font-medium text-gray-900">{question.title}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <ComplexityBadge complexity={question.complexity} />
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-500">{question.category}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                     <button
//                       onClick={() => toggleQuestion(question.id)}
//                       className="text-indigo-600 hover:text-indigo-900"
//                     >
//                       {expandedQuestionId === question.id ? (
//                         <ChevronUpIcon className="h-5 w-5" />
//                       ) : (
//                         <ChevronDownIcon className="h-5 w-5" />
//                       )}
//                     </button>
//                   </td>
//                 </tr>
//                 {expandedQuestionId === question.id && (
//                   <tr>
//                     <td colSpan={4} className="px-6 py-4 whitespace-normal">
//                       <div className="text-sm text-gray-900">{question.description}</div>
//                     </td>
//                   </tr>
//                 )}
//               </React.Fragment>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }
import React, { useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import './questions.css'

interface Question {
  id: number
  title: string
  complexity: 'Easy' | 'Medium' | 'Hard'
  category: string
  description: string
}

const initialQuestions: Question[] = [
  {
    id: 1,
    title: "Two Sum",
    complexity: "Easy",
    category: "Array",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target."
  },
  {
    id: 2,
    title: "Add Two Numbers",
    complexity: "Medium",
    category: "Linked List",
    description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list."
  },
  {
    id: 3,
    title: "Median of Two Sorted Arrays",
    complexity: "Hard",
    category: "Array",
    description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays."
  }
]

const ComplexityBadge: React.FC<{ complexity: Question['complexity'] }> = ({ complexity }) => {
  return (
    <span className={`complexity-badge ${complexity.toLowerCase()}`}>
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
    <div className="questions">
      <h1>Interview Questions</h1>
      
      <div className="file-upload">
        <label htmlFor="file-upload" className="upload-button">
          Upload Questions JSON
        </label>
        <input id="file-upload" type="file" accept=".json" onChange={handleFileUpload} />
      </div>

      <div className="questions-table-container">
        <table className="questions-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Complexity</th>
              <th>Category</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question) => (
              <React.Fragment key={question.id}>
                <tr className="question-row">
                  <td className="question-title">{question.title}</td>
                  <td><ComplexityBadge complexity={question.complexity} /></td>
                  <td className="question-category">{question.category}</td>
                  <td className="question-expand">
                    <button onClick={() => toggleQuestion(question.id)}>
                      {expandedQuestionId === question.id ? (
                        <ChevronUpIcon className="expand-icon" />
                      ) : (
                        <ChevronDownIcon className="expand-icon" />
                      )}
                    </button>
                  </td>
                </tr>
                {expandedQuestionId === question.id && (
                  <tr className="question-description">
                    <td colSpan={4}>{question.description}</td>
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