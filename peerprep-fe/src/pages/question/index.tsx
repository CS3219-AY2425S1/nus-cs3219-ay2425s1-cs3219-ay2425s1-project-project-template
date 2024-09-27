import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, useForm } from 'react-hook-form';

const FormSchema = z.object({
  codeInput: z.string().min(1, 'Input your answer.'),
});

export default function QuestionAnswerPage() {
  const [codeInput, setCodeInput] = useState('');
  const [activeTab, setActiveTab] = useState('testCases'); // State to handle tab switching


  const question = {
    title: 'Question Title',
    description: 'Question Details Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sit amet lorem at nisi vehicula sagittis. Nullam a venenatis mi. Aliquam faucibus ipsum orci, ut varius ante laoreet ac...', 
  };

  const testCases = [
    {
      id: 1,
      description: "Test case 1",
      inputs: { x: 5, y: 1, nums: [1, 2, 3, 4, 5] },
      expectedOutput: [6],
    },
    {
      id: 2,
      description: "Test case 2",
      inputs: { x: 10, y: 2, nums: [2, 3, 5, 7, 11] },
      expectedOutput: [12],
    },
  ];
  

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      codeInput: '',
    },
  });

  const onSubmit = () => {
    console.log(form.getValues('codeInput'));
  }

  return (
    <div className="flex h-screen p-4 bg-gray-100">
      {/* Left Panel - Problem Statement */}
      <div className="w-1/3 bg-white p-4 rounded-md shadow-md">
        <div className="text-2xl font-bold mb-2">
          {question.title}
        </div>
        <div className="text-gray-600 mb-4">
          {question.description}
        </div>
        
        {/* Graph / Visual Representation */}
        <div className="border border-gray-300 rounded p-4 h-40 flex justify-center items-center mb-4">
          {/* Placeholder for Graph */}
          <div>Graph Visualization Placeholder</div>
        </div>
      </div>

      {/* Right Panel - Code Editor and Results */}
      <div className="flex-1 bg-white p-4 rounded-md shadow-md ml-4 flex flex-col">
        {/* Code Editor Section */}
        <div className="h-1/2 mb-4">
          <div
            className="w-full h-full border border-gray-300 rounded p-2 font-mono text-sm"
            contentEditable="true"
            style={{ whiteSpace: 'pre-wrap' }}
            onInput={(e) => setCodeInput(e.currentTarget.textContent || '')}
          >
            # Write your code here
          </div>
        </div>
        {/* Submit Button */}
        <div className="mb-4 flex justify-end">
          <div
            onClick={onSubmit}
            className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Run Code
          </div>
        </div>

        {/* Test Cases and Test Results Section */}
        <div className="h-1/2 bg-gray-50 rounded p-4">
          {/* Tabs */}
          <div className="flex mb-2">
            <div
              onClick={() => setActiveTab('testCases')}
              className={`mr-2 px-4 py-2 rounded cursor-pointer ${
                activeTab === 'testCases' ? 'bg-gray-300' : ''
              }`}
            >
              Test Cases
            </div>
            <div
              onClick={() => setActiveTab('testResult')}
              className={`px-4 py-2 rounded cursor-pointer ${
                activeTab === 'testResult' ? 'bg-gray-300' : ''
              }`}
            >
              Test Result
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'testCases' ? (
            <div>
              {/* Test Cases Content */}
              {testCases.map((testCase) => (
                <div key={testCase.id} className="border p-4 mb-2 rounded">
                  <div className="font-semibold">{testCase.description}</div>
                  <div>
                    <div className="font-medium">Inputs:</div> x = {testCase.inputs.x}, y = {testCase.inputs.y}, nums = [
                    {testCase.inputs.nums.join(', ')}]
                  </div>
                  <div>
                    <div className="font-medium">Expected Output:</div> {testCase.expectedOutput.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              {/* Test Result Content */}
              <div className="border p-4 rounded">
                <div className="font-semibold">Test Output</div>
                <div>Output for the current test cases will be shown here...</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

}


