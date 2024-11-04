import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Check, XCircle, Loader } from 'lucide-react';

const SessionHistoryView = () => {
  const [sessionHistory, setSessionHistory] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedAttempts, setSelectedAttempts] = useState([]);

  useEffect(() => {
    async function fetchSessionHistory() {
      try {
        const response = await fetch('/api/sessions');
        const data = await response.json();
        setSessionHistory(data);
      } catch (error) {
        console.error('Failed to fetch session history:', error);
      }
    }
    fetchSessionHistory();
  }, []);

  const handleQuestionSelect = (questionId) => {
    const allAttempts = sessionHistory.flatMap(session => 
      session.questionAttempts.filter(attempt => attempt.questionId === questionId)
    );
    setSelectedAttempts(allAttempts);
    setSelectedQuestion(questionId);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Loader className="w-4 h-4 text-yellow-500" />;
      default:
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="flex h-screen max-h-[800px] gap-4 p-4">
      {/* Left Panel */}
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>
            {selectedQuestion ? (
              <Button 
                variant="ghost" 
                className="p-0 mb-2"
                onClick={() => setSelectedQuestion(null)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Questions
              </Button>
            ) : 
              "Question List"
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[700px] pr-4">
            {!selectedQuestion ? (
              // Question List View
              <div className="space-y-4">
                {sessionHistory.flatMap(session =>
                  session.questionAttempts.map((attempt, index) => (
                    <Card 
                      key={`${attempt.questionId}-${index}`}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleQuestionSelect(attempt.questionId)}
                    >
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm">Question ID: {attempt.questionId}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {formatDate(attempt.startedAt)}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))
                )}
              </div>
            ) : (
              // Question Detail View
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Question ID: {selectedQuestion}</h3>
                {/* Add question details here when available */}
                <p className="text-gray-600">Question description would go here...</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Right Panel */}
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>Submission History</CardTitle>
          {selectedQuestion && (
            <CardDescription>
              Showing all attempts for Question {selectedQuestion}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[700px] pr-4">
            <div className="space-y-4">
              {selectedAttempts.map((attempt, index) => (
                <Card key={index} className="bg-gray-50">
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">
                        Submission {index + 1}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(attempt.submissions[0]?.status)}
                        <span className="text-sm capitalize">
                          {attempt.submissions[0]?.status || 'No status'}
                        </span>
                      </div>
                    </div>
                    <CardDescription>
                      Language: {attempt.currentLanguage}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                      <code>{attempt.currentCode}</code>
                    </pre>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionHistoryView;
// "use client";

// import React, { useEffect, useState } from 'react';
// import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Button } from '@/components/ui/button';

// export default function SessionHistoryList() {
//   const [sessionHistory, setSessionHistory] = useState([]);
//   const [selectedQuestion, setSelectedQuestion] = useState(null);

//   useEffect(() => {
//     async function fetchSessionHistory() {
//       try {
//         const response = await fetch('/api/sessions');
//         const data = await response.json();
//         setSessionHistory(data);
//       } catch (error) {
//         console.error('Failed to fetch session history:', error);
//       }
//     }

//     fetchSessionHistory();
//   }, []);

//   return (
//     <div className="h-screen p-6">
//       <div className="grid grid-cols-2 gap-6 h-[calc(100vh-6rem)]">
//         <div className="space-y-4 h-full">
//           {!selectedQuestion ? (
//             <div>
//               {sessionHistory.map((session, index) => (
//                 <Card key={index} onClick={() => setSelectedQuestion(session)}>
//                   <CardHeader>
//                     <CardTitle>Session ID: {session.sessionId}</CardTitle>
//                     <CardDescription>Session Users: {session.allUsers.join(', ')}</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     {session.questionAttempts.map((attempt, i) => (
//                       <div key={i}>
//                         <pre className="bg-muted p-4 rounded-md overflow-x-auto">
//                           <code>{attempt.currentCode}</code>
//                         </pre>
//                         <div className="flex gap-4 text-sm text-muted-foreground">
//                           <div className="flex items-center gap-2">
//                             <CardDescription>Language: {attempt.currentLanguage}</CardDescription>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           ) : (
//             <div>
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Session ID: {selectedQuestion.sessionId}</CardTitle>
//                   <CardDescription>Active Users: {selectedQuestion.activeUsers.join(', ')}</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   {selectedQuestion.questionAttempts.map((attempt, i) => (
//                     <div key={i}>
//                       <pre className="bg-muted p-4 rounded-md overflow-x-auto">
//                         <code>{attempt.currentCode}</code>
//                       </pre>
//                       <div className="flex gap-4 text-sm text-muted-foreground">
//                         <div className="flex items-center gap-2">
//                           <CardDescription>Language: {attempt.currentLanguage}</CardDescription>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </CardContent>
//               </Card>
//               <Button variant="outline" onClick={() => setSelectedQuestion(null)}>
//                 Back to Sessions
//               </Button>
//             </div>
//           )}
//         </div>
//         <ScrollArea>
//           <Card>
//             <CardContent>
//               <div className="space-y-4">
//                 {sessionHistory.map((session, index) => (
//                   <div key={index} className="space-y-2">
//                     <div className="flex justify-between items-center">
//                       <div className="text-sm text-muted-foreground">
//                         Active Users: {session.activeUsers.join(', ')}
//                       </div>
//                     </div>
//                     <Card>
//                       <CardContent className="p-4 space-y-4">
//                         {session.questionAttempts.map((attempt, i) => (
//                           <div key={i}>
//                             <pre className="bg-muted p-4 rounded-md overflow-x-auto">
//                               <code>{attempt.currentCode}</code>
//                             </pre>
//                             <div className="flex gap-4 text-sm text-muted-foreground">
//                               <div className="flex items-center gap-2">
//                                 <CardDescription>Language: {attempt.currentLanguage}</CardDescription>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
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
// }