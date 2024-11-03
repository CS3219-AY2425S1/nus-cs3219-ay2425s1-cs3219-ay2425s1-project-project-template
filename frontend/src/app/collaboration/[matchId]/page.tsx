'use client';

import { FC, useEffect, useState } from 'react';
import { Question } from "@/types/question.types";
import { io, Socket } from "socket.io-client";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import AttemptsTab from "@/components/attempts/attempts"

interface CollaborationPageProps {
    params: {
        matchId: string;
    };
}

interface QuestionData {
    question: Question,
    topic: string,
    difficulty: string,
}

const CollaborationPage: FC<CollaborationPageProps> = ({ params }) => {
    const { matchId } = params;
    const [error, setError] = useState<string | null>(null);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [formError, setFormError] = useState<string | null>(null)
    const [topic, setTopic] = useState<string>("");
    const [difficulty, setDifficulty] = useState<string>("");
    const [question, setQuestion] = useState<Question | null>(null);

    const { control, handleSubmit, reset } = useForm();

    useEffect(() => {
        const newSocket = io(process.env.NEXT_PUBLIC_COLLAB_API_URL);
        setSocket(newSocket);

        newSocket.emit('joinCollabSession', { matchId });

        newSocket.on("question", (data: QuestionData) => {
            console.log(data)
            if (data.question) {
                setQuestion(data.question);
                setDifficulty(data.difficulty);
                setTopic(data.topic);
                setFormError(null);
            } 
        });

        newSocket.on("newQuestionError", (data: { message: string; timestamp: string }) => {
            setFormError(data.message);
        });

        newSocket.on("collabError", (data: { message: string; timestamp: string }) => {
            setError(data.message);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [matchId]);

    const requestNewQuestion = (data: { topic: string; difficulty: string }) => {
        if (socket) {
            socket.emit('generateNewQuestion', {
                matchId: matchId,
                topic: data.topic,
                difficulty: data.difficulty
            });
        }
    };

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
                    {topic}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
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
                            <form onSubmit={handleSubmit(requestNewQuestion)}>
                                <div className="grid gap-2 text-xs">
                                    <Label htmlFor="topic" className="text-xs">Topic</Label>
                                    <Controller
                                        name="topic"
                                        control={control}
                                        defaultValue=""
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger className="w-full text-xs">
                                                    <SelectValue placeholder="Select Topic" />
                                                </SelectTrigger>
                                                <SelectContent className="text-xs">
                                                    <SelectGroup>
                                                        <SelectItem value="Strings">Strings</SelectItem>
                                                        <SelectItem value="Algorithms">Algorithms</SelectItem>
                                                        <SelectItem value="Data Structures">Data Structures</SelectItem>
                                                        <SelectItem value="Bit Manipulation">Bit Manipulation</SelectItem>
                                                        <SelectItem value="Recursion">Recursion</SelectItem>
                                                        <SelectItem value="Databases">Databases</SelectItem>
                                                        <SelectItem value="Arrays">Arrays</SelectItem>
                                                        <SelectItem value="Brainteaser">Brainteaser</SelectItem>
                                                        <SelectItem value="Other">Other</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                                <div className="grid gap-2 text-xs">
                                    <Label htmlFor="difficulty" className="text-xs">Difficulty</Label>
                                    <Controller
                                        name="difficulty"
                                        control={control}
                                        defaultValue=""
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} value={field.value}>
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
                                        )}
                                    />
                                    {formError && <p className="text-red-500 text-xs mt-2">{formError}</p>} 
                                </div>
                                <div className="w-full flex justify-end mt-2">
                                    <Button type="submit" className="w-fit px-4 text-sm">Search</Button>
                                </div>
                            </form>
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
            <TabsTrigger value="attempts">Attempts</TabsTrigger>
          </TabsList>
          <TabsContent value="question" className="flex-1 h-full overflow-hidden h-full pb-1">
            <Card className="flex flex-col mt-1 mb-4 h-full overflow-hidden">
              <div className="space-y-4 p-2 overflow-auto">
                <CardHeader className="p-4">
                  <CardTitle className="text-2xl font-bold mb-2">{question?.title}</CardTitle>
                  <div className="text-base space-y-4">
                    {question?.description}
                  </div>
                </CardHeader>
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
          <TabsContent value="attempts">
            <AttemptsTab></AttemptsTab>
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
            <Button variant="outline" size="sm" className="bg-black text-white">
              <PlayIcon className="h-4 w-4 mr-2" />
              Run Code
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
          <Card className="max-h-[40vh] overflow-auto pb-4 mb-1">
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
          </Card>
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

export default CollaborationPage;
