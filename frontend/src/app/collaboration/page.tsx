'use client'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { use, useEffect, useState } from "react"
import { set } from "zod"
import { CodeExecutionResponse } from "../api/code-execution/route"
import { executeCode } from "@/lib/api-user"
import DynamicTestCases from "@/components/TestCaseCard"

export default function WorkSpace() {

  useEffect(() => {
    setCode("x = int(input())\nprint(x)")
  })

  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('python');
  const [executing, setExecuting] = useState<boolean>(false);
  const [result, setResult] = useState<CodeExecutionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  interface TestResult {
    testCaseNumber: number;
    input: string;
    expectedOutput: string;
    actualOutput: string;
    passed: boolean;
    error?: string;
    compilationError?: string | null;
  }

  
  const handleExecuteCode = async (questionId: string) => {
    setExecuting(true);
    try {
      const result: CodeExecutionResponse = await executeCode({
        questionId,
        language: "python",
        code: code
      });
      setResult(result);
      setTestResults(result.testResults);
      if (result.testResults.some(test => test.error)) {
        setError(result.testResults.find(test => test.error)?.error || 'Execution failed');
      }
    } catch (error) {
      setError((error as any).message);
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="bg-background border-b flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">Coding Session 6</div>
            <PencilIcon className="h-4 w-4 ml-1" />
            <span className="sr-only">Edit session name</span>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Badge variant="secondary" className="text-xs">
              Arrays
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Medium
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                New Question
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-4 space-y-3 text-xs">
              <div className="grid gap-2 text-xs">
                <Label htmlFor="topic" className="text-xs">
                  Topic
                </Label>
                <Select id="topic">
                  <SelectTrigger className="w-full text-xs">
                    <SelectValue placeholder="Select Topic" />
                  </SelectTrigger>
                  <SelectContent className="text-xs">
                    <SelectGroup>
                      <SelectItem value="arrays">Arrays</SelectItem>
                      <SelectItem value="graphs">Graphs</SelectItem>
                      <SelectItem value="strings">Strings</SelectItem>
                      <SelectItem value="trees">Trees</SelectItem>
                      <SelectItem value="dynamic-programming">Dynamic Programming</SelectItem>
                      <SelectItem value="greedy">Greedy</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2 text-xs">
                <Label htmlFor="difficulty" className="text-xs">
                  Difficulty
                </Label>
                <Select id="difficulty">
                  <SelectTrigger className="w-full text-xs">
                    <SelectValue placeholder="Select Difficulty" />
                  </SelectTrigger>
                  <SelectContent className="text-xs">
                    <SelectGroup>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full flex justify-end">
                <Button className="w-fit px-4 text-sm">Okay</Button>
              </div>
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <UsersIcon className="h-4 w-4" />
                <span className="sr-only">View Members</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Session Members</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Avatar className="mr-2">
                  <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
                  <AvatarFallback>AC</AvatarFallback>
                </Avatar>
                <span>Olivia</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Avatar className="mr-2">
                  <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
                  <AvatarFallback>IN</AvatarFallback>
                </Avatar>
                <span>Isabella</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="destructive" size="sm">
            Exit Session
          </Button>
        </div>
      </header>
      <div className="flex-1 grid grid-cols-2 gap-4 p-6 pt-4 overflow-hidden h-full">
        <Tabs defaultValue="question" className="flex flex-col pb-1 overflow-hidden">
          <TabsList className="w-fit">
            <TabsTrigger value="question">Question</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>
          <TabsContent value="question" className="flex-1 h-full overflow-hidden h-full pb-1">
            <Card className="flex flex-col mt-1 mb-4 h-full overflow-hidden">
              <div className="space-y-4 p-2 overflow-auto">
                <CardHeader className="p-4">
                  <CardTitle className="text-2xl font-bold mb-2">Two Sum</CardTitle>
                  <div className="text-base space-y-4">
                    <p>
                      Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of
                      the two numbers such that they add up to <code>target</code>.
                    </p>
                    <p>
                      You may assume that each input would have exactly one solution, and you may not use the same
                      element twice.
                    </p>
                    <p>You can return the answer in any order.</p>
                  </div>
                </CardHeader>
                <div className="space-y-4 p-4 py-0">
                  <h3 className="text-lg font-semibold">Examples:</h3>
                  <div className="space-y-2">
                    <p className="font-medium">Example 1:</p>
                    <pre className="bg-muted p-2 rounded-md overflow-x-auto">
                      <code>{`Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`}</code>
                    </pre>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">Example 2:</p>
                    <pre className="bg-muted p-2 rounded-md overflow-x-auto">
                      <code>{`Input: nums = [3,2,4], target = 6
Output: [1,2]`}</code>
                    </pre>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">Example 3:</p>
                    <pre className="bg-muted p-2 rounded-md overflow-x-auto">
                      <code>{`Input: nums = [3,3], target = 6
Output: [0,1]`}</code>
                    </pre>
                  </div>
                </div>
                <div className="space-y-2 p-4 py-0">
                  <h3 className="text-lg font-semibold">Constraints:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      2 ≤ nums.length ≤ 10<sup>4</sup>
                    </li>
                    <li>
                      -10<sup>9</sup> ≤ nums[i] ≤ 10<sup>9</sup>
                    </li>
                    <li>
                      -10<sup>9</sup> ≤ target ≤ 10<sup>9</sup>
                    </li>
                    <li>Only one valid answer exists.</li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>
          <TabsContent value="feedback" className="flex-1 pb-1">
            <Card className="flex flex-col p-2 mt-1 h-full min-h-full">
              <div className="space-y-4 p-4 flex-1">
                <div className="flex items-start gap-4">
                  <Avatar className="w-10 h-10 border">
                    <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
                    <AvatarFallback>AC</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">Olivia</div>
                      <div className="text-xs text-muted-foreground">2 minutes ago</div>
                    </div>
                    <div className="text-sm">
                      Can improve communication skills by asking more questions. Sharing thoughts while coding is important.
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Avatar className="w-10 h-10 border">
                    <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
                    <AvatarFallback>IN</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">Isabella</div>
                      <div className="text-xs text-muted-foreground">5 minutes ago</div>
                    </div>
                    <div className="text-sm">
                      You have great knowledge of algorithms. You came to the solution with ease.
                    </div>
                  </div>
                </div>
                <div className="h-4"></div>
                <div className="flex flex-col items-start gap-2 border-neutral-200 border rounded-md p-2">
                  <Textarea
                    placeholder="Add your feedback here..."
                    className="flex-1 rounded-md border border-muted px-4 py-2 text-sm"
                  />
                  <div className="flex justify-end gap-2 w-full">
                  <Select>
                    <SelectTrigger className="w-[160px] text-xs h-fit py-2">
                      <SelectValue placeholder="Select Person" />
                    </SelectTrigger>
                    <SelectContent className="text-xs">
                      <SelectGroup>
                        <SelectItem value="isabella" className="text-xs">Isabella</SelectItem>
                        <SelectItem value="olivia" className="text-xs">Olivia</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                    <Button variant="outline" size="sm" className="bg-black text-white">
                      Submit
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
        <div className="flex flex-col gap-2 h-full">
          <div className="flex items-center justify-between">
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="bg-black text-white" onClick={() => handleExecuteCode("6727deaa8af46c7a5736b499")} disabled={executing}>
              <PlayIcon className="h-4 w-4 mr-2" />
              {executing ? 'Running...' : 'Run Code'}
            </Button>
          </div>
          <Card className="h-1/2 max-h-[60vh] mb-2 overflow-hidden">
            <pre className="bg-muted h-full p-4 py-2 rounded-md overflow-auto text-sm">
              <code className="h-full">{`1
2 
3 
4 
5
6
7
8
9
10
11
12
13
14
`}</code>
            </pre>
          </Card>
          {/* <Card className="max-h-[40vh] overflow-auto pb-4 mb-1">
            <CardHeader className="pb-1 pt-4 font-bold text-xl">Test Cases</CardHeader>
            <CardContent className="flex-1 overflow-auto py-0">
              <Tabs defaultValue="test-case-1">
                <TabsList className="flex gap-2 justify-start w-fit">
                  <TabsTrigger value="test-case-1">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      Case 1
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="test-case-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      Case 2
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="test-case-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      Case 3
                    </div>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="test-case-1">
                  <Card>
                    <CardContent className="flex flex-col gap-4 p-4">
                      <div>
                        <CardDescription className="font-medium text-sm mb-1">Input</CardDescription>
                        <pre className="bg-muted p-2 rounded-md overflow-auto">[2, 7, 11, 15], 9</pre>
                      </div>
                      <div>
                        <CardDescription className="font-medium text-sm mb-1">Output</CardDescription>
                        <pre className="bg-muted p-2 rounded-md overflow-auto">[0, 1]</pre>
                      </div>
                      <div>
                        <CardDescription className="font-medium text-sm mb-1">Expected Output</CardDescription>
                        <pre className="bg-muted p-2 rounded-md overflow-auto">[0, 1]</pre>
                      </div>
                      <div className="col-span-2">
                        <CardDescription className="font-medium text-sm mb-1">Stdout</CardDescription>
                        <pre className="bg-muted p-2 rounded-md overflow-auto">{`Initializing array: [2, 7, 11, 15]
Target: 9
Iterating through array...
Found indices: [0, 1]
`}</pre>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="test-case-2">
                  <Card>
                    <CardContent className="flex flex-col gap-4 p-4">
                      <div>
                        <CardDescription className="font-medium text-sm mb-1">Input</CardDescription>
                        <pre className="bg-muted p-2 rounded-md overflow-auto">[3, 2, 4], 6</pre>
                      </div>
                      <div>
                        <CardDescription className="font-medium text-sm mb-1">Output</CardDescription>
                        <pre className="bg-muted p-2 rounded-md overflow-auto">[1, 2]</pre>
                      </div>
                      <div>
                        <CardDescription className="font-medium text-sm mb-1">Expected Output</CardDescription>
                        <pre className="bg-muted p-2 rounded-md overflow-auto">[1, 2]</pre>
                      </div>
                      <div className="col-span-2">
                        <CardDescription className="font-medium text-sm mb-1">Stdout</CardDescription>
                        <pre className="bg-muted p-2 rounded-md overflow-auto">{`Initializing array: [3, 2, 4]
Target: 6
Iterating through array...
Found indices: [1, 2]
`}</pre>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="test-case-3">
                  <Card>
                    <CardContent className="flex flex-col gap-4 p-4">
                      <div>
                        <CardDescription className="font-medium text-sm mb-1">Input</CardDescription>
                        <pre className="bg-muted p-2 rounded-md overflow-auto">[3, 3], 6</pre>
                      </div>
                      <div>
                        <CardDescription className="font-medium text-sm mb-1">Output</CardDescription>
                        <pre className="bg-muted p-2 rounded-md overflow-auto">[0, 1]</pre>
                      </div>
                      <div>
                        <CardDescription className="font-medium text-sm mb-1">Expected Output</CardDescription>
                        <pre className="bg-muted p-2 rounded-md overflow-auto">[0, 1]</pre>
                      </div>
                      <div className="col-span-2">
                        <CardDescription className="font-medium text-sm mb-1">Stdout</CardDescription>
                        <pre className="bg-muted p-2 rounded-md overflow-auto">{`Initializing array: [3, 3]
Target: 6
Iterating through array...
Found indices: [0, 1]
`}</pre>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card> */}
          <DynamicTestCases
            questionId="6727deaa8af46c7a5736b499" 
            testResults={testResults}
          />
        </div>
      </div>
      <div className="absolute bottom-4 left-4 flex space-x-2">
        <div className="w-32 h-24 bg-gray-200 rounded-lg overflow-hidden shadow-xl">
          <div className="w-32 h-24 bg-gray-200 rounded-lg overflow-hidden shadow-xl">
            <div className="flex items-center justify-center w-full h-full text-4xl font-bold">AC</div>
          </div>
        </div>
        <div className="w-32 h-24 bg-gray-200 rounded-lg overflow-hidden shadow-xl">
          <div className="w-32 h-24 bg-gray-200 rounded-lg overflow-hidden shadow-xl">
            <div className="flex items-center justify-center w-full h-full text-4xl font-bold">IN</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LinkIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}


function PencilIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  )
}


function PlayIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  )
}


function UsersIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
