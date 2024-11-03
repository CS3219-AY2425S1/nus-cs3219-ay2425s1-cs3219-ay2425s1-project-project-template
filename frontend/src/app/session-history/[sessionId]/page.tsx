// "use client";

// import React, { useEffect, useState } from 'react';
// import { useParams } from 'next/navigation';
// import axios from 'axios';
// import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Button } from '@/components/ui/button';

// const Page = () => {
//   const [selectedQuestion, setSelectedQuestion] = useState(null);
//   const [questions, setQuestions] = useState([]);
//   const { sessionId } = useParams();

//   useEffect(() => {
//     if (sessionId) {
//       fetchSessionHistory(sessionId);
//     }
//   }, [sessionId]);

//   const fetchSessionHistory = async (sessionId: string) => {
//     try {
//       const response = await axios.get(`/api/session-history/${sessionId}`);
//       setQuestions(response.data);
//     } catch (error) {
//       console.error('Error fetching session history:', error);
//     }
//   };

//   return (
//     <div className="h-screen p-6">
//       <div className="grid grid-cols-2 gap-6 h-[calc(100vh-6rem)]">
//         <div className="space-y-4 h-full">
//           {!selectedQuestion ? (
//             <div>
//               {questions.map((question, index) => (
//                 <Card key={index} onClick={() => setSelectedQuestion(question)}>
//                   <CardHeader>
//                     <CardTitle>Question ID: {question.questionId}</CardTitle>
//                     <CardDescription>Attempt Date: {new Date(question.attemptDate).toLocaleString()}</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <pre className="bg-muted p-4 rounded-md overflow-x-auto">
//                       <code>{question.attemptCode}</code>
//                     </pre>
//                     <div className="flex gap-4 text-sm text-muted-foreground">
//                       <div className="flex items-center gap-2">
//                         <CardDescription>Test Cases Passed:</CardDescription>
//                         {question.testCasesPassed.map((passed, i) => (
//                           <span key={i} className={passed ? 'text-green-500' : 'text-red-500'}>
//                             {passed ? 'Pass' : 'Fail'}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           ) : (
//             <div>
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Question ID: {selectedQuestion.questionId}</CardTitle>
//                   <CardDescription>Attempt Date: {new Date(selectedQuestion.attemptDate).toLocaleString()}</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <pre className="bg-muted p-4 rounded-md overflow-x-auto">
//                     <code>{selectedQuestion.attemptCode}</code>
//                   </pre>
//                   <div className="flex gap-4 text-sm text-muted-foreground">
//                     <div className="flex items-center gap-2">
//                       <CardDescription>Test Cases Passed:</CardDescription>
//                       {selectedQuestion.testCasesPassed.map((passed, i) => (
//                         <span key={i} className={passed ? 'text-green-500' : 'text-red-500'}>
//                           {passed ? 'Pass' : 'Fail'}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//               <Button variant="outline" onClick={() => setSelectedQuestion(null)}>
//                 Back to Questions
//               </Button>
//             </div>
//           )}
//         </div>
//         <ScrollArea>
//           <Card>
//             <CardContent>
//               <div className="space-y-4">
//                 {questions.map((question, index) => (
//                   <div key={index} className="space-y-2">
//                     <div className="flex justify-between items-center">
//                       <div className={`text-sm ${
//                         question.testCasesPassed.filter(Boolean).length === question.testCasesPassed.length 
//                           ? 'text-green-500' 
//                           : 'text-yellow-500'
//                       }`}>
//                         {question.testCasesPassed.filter(Boolean).length}/{question.testCasesPassed.length} tests passed
//                       </div>
//                     </div>
//                     <Card>
//                       <CardContent className="p-4 space-y-4">
//                         <pre className="bg-muted p-4 rounded-md overflow-x-auto">
//                           <code>{question.attemptCode}</code>
//                         </pre>
//                         <div className="flex gap-4 text-sm text-muted-foreground">
//                           <div className="flex items-center gap-2">
//                             <CardDescription>Runtime:</CardDescription>
//                             {question.runtime}
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <CardDescription>Memory:</CardDescription>
//                             {question.memory}
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </ScrollArea>
//       </div>
//     </div>
//   );
// };

// export default Page;
"use client"
import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import SessionHistoryList from '@/components/session-history/SessionHistoryList';

async function getSessionHistory(sessionId) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_QUESTION_API_URL}/questionhistories/${sessionId}`, { cache: 'no-store' });
  if (!res.ok || res.status !== 200) {
    throw new Error('Failed to fetch session history');
  }
  return res.json();
}

export default async function SessionHistoryPage({ params }) {
  const { sessionId } = params;
  const sessionHistoryPromise = getSessionHistory(sessionId);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Suspense fallback={
        <div className="w-screen h-screen flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6" />
        </div>
      }>
        <SessionHistoryList sessionHistoryPromise={sessionHistoryPromise} />
      </Suspense>
    </main>
  );
}