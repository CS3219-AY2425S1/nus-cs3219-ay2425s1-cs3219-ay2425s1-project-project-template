'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { FC } from 'react';

interface CollaborationPageProps {
    params: {
      matchId: string;
    };
  }

const CollaborationPage: FC<CollaborationPageProps> = ({ params }) => {
  
  const {matchId} = params;
  console.log(matchId)
  
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-background border-b flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="text-lg font-medium">Session Name</div>``
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              Arrays
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Medium
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Try Another
          </Button>
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
              <DropdownMenuItem>
                <Avatar className="mr-2">
                  <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
                  <AvatarFallback>SD</AvatarFallback>
                </Avatar>
                <span>Sofia</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm">
            <LinkIcon className="h-4 w-4" />
            <span className="sr-only">Copy Invite Link</span>
          </Button>
          <Button variant="destructive" size="sm">
            End Session
          </Button>
        </div>
      </header>
      <div className="flex-1 grid grid-cols-2 gap-4 p-6 pt-4">
        <Tabs defaultValue="question">
          <TabsList>
            <TabsTrigger value="question">Question</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>
          <TabsContent value="question" className="flex-1 overflow-auto h-full min-h-full">
            <Card className="flex flex-col mt-1 h-full min-h-full">
              <div className="space-y-4 p-2">
                <CardHeader>
                  <CardTitle>Two Sum</CardTitle>
                  <CardDescription>
                    Given an array of integers nums and an integer target, return indices of the two numbers such that
                    they add up to target.
                  </CardDescription>
                </CardHeader>
              </div>
            </Card>
          </TabsContent>
          <TabsContent value="feedback" className="flex-1 overflow-auto h-full min-h-full">
            <Card className="flex flex-col p-2 mt-1 h-full min-h-full">
              <div className="space-y-4 p-4">
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
                      The problem statement is clear, but I'm struggling with the time complexity. Any tips?
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
                      The brute force solution is O(n^2), but you can optimize it to O(n) using a hash map.
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
        <div className="flex flex-col gap-2">
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
            <Button variant="outline" size="sm">
              Run Code
            </Button>
          </div>
          <Card className="flex-1 mb-2">
            <CardContent className="flex-1">
              <div className="h-full flex flex-col justify-start" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Test Cases</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Input</TableHead>
                    <TableHead>Output</TableHead>
                    <TableHead className="text-center">Expected Output</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <pre>[2, 7, 11, 15], 9</pre>
                    </TableCell>
                    <TableCell>
                      <pre>[0, 1]</pre>
                    </TableCell>
                    <TableCell className="text-center">
                      <pre>[0, 1]</pre>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-green-500 text-white">
                        Passed
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <pre>[3, 2, 4], 6</pre>
                    </TableCell>
                    <TableCell>
                      <pre>[1, 2]</pre>
                    </TableCell>
                    <TableCell className="text-center">
                      <pre>[1, 2]</pre>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-green-500 text-white">
                        Passed
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <pre>[3, 3], 6</pre>
                    </TableCell>
                    <TableCell>
                      <pre>[0, 1]</pre>
                    </TableCell>
                    <TableCell className="text-center">
                      <pre>[0, 1]</pre>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-green-500 text-white">
                        Passed
                      </Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
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

export default CollaborationPage