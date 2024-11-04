'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { CalendarIcon, ClockIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import CreateSessionDialog from '@/components/CreateSessionDialog'
import { useRouter } from 'next/navigation'
import { verifyToken } from '@/lib/api-user'

export interface Session {
  _id: string
  sessionId: string
  activeUsers: string[]
  allUsers: string[]
  questionAttempts: {
    questionId: string
    submissions: {
      code: string
      language: string
      submittedAt: string
      status: string
    }[]
    startedAt: string
    currentCode: string
    currentLanguage: string
  }[]
  isCompleted: boolean
  sessionName: string
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
  });
  const [loading, setLoading] = useState(true)
  const [userNames, setUserNames] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error("no token")
        router.push('/login')
        return
      }
      try {
        const res = await fetch('/api/sessions', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await res.json();
        setSessions(data);
        
        // const userRes = await fetch('/api/user', {
        //   headers: {
        //     'Authorization': `Bearer ${token}`
        //   }
        // })
        // const userData = await userRes.json();
        // setUserData({ username: userData.username, email: userData.email })
        // setLoading(false)
      } catch (error) {
        console.error('Error fetching sessions or user data:', error)
        router.push('/login')
      }
    }
    fetchUserData()
  }, [router])
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }
      try {
        const res = await verifyToken(token)
        setUserData({ username: res.data.username, email: res.data.email })
        setLoading(false)
      } catch (error) {
        console.error('Token verification failed:', error)
        router.push('/login') 
      }
    }

    fetchUserData()
  }, [router])
  useEffect(() => {
    const fetchUserNames = async () => {
      const userIds = sessions.flatMap(session => session.activeUsers);
      try {
        const userNamesMap: { [key: string]: string } = {};
        await Promise.all(userIds.map(async (userId) => {
          try {
            const res = await fetch(`/api/users/${userId}`);
            if (!res.ok) {
              throw new Error('User not found');
            }
            const user = await res.json();
            userNamesMap[userId] = user.username;
          } catch (error) {
            console.error(`Error fetching user ${userId}:`, error);
            userNamesMap[userId] = userId; // Return userId if user is not found
          }
        }));
        setUserNames(userNamesMap);
      } catch (error) {
        console.error('Error fetching user names:', error);
      }
    };

    if (sessions.length > 0) {
      fetchUserNames();
    }
  }, [sessions]);
  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Welcome back, {userData.username}!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card className="bg-primary text-primary-foreground p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">{sessions.length}</h3>
              <p className="text-sm">Coding Sessions Created</p>
            </div>
            <CalendarIcon className="w-10 h-10" />
          </div>
        </Card>
        <Card className="bg-secondary text-secondary-foreground p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">-</h3>
              <p className="text-sm">Hours Practiced</p>
            </div>
            <ClockIcon className="w-10 h-10" />
          </div>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Past Coding Sessions</h2>
        <CreateSessionDialog sessions={sessions} />
      </div>
      <div className="space-y-6">
        {renderYearSessions(2024, sessions, userNames)}
      </div>

      <div className="mt-8">
        <Link href="/session-history">
          View Session History
        </Link>
      </div>
    </main>
  )
}
function renderYearSessions(year: number, sessions: Session[], userNames: { [key: string]: string }) {
  return (
    <div key={year}>
      <h3 className="text-xl font-bold mb-4">{year}</h3>
      <div className="space-y-4">
        {sessions.length === 0 ? (
          <div>
            <p className="text-center mb-4">No sessions yet</p>
          </div>
        ) : (
          sessions.map(session => {
            const uniqueQuestions = new Set(session.questionAttempts.map(attempt => attempt.questionId));
            const solvedQuestions = new Set(
              session.questionAttempts
                .filter(attempt => attempt.submissions.some(submission => submission.status === 'accepted'))
                .map(attempt => attempt.questionId)
            );

            return (
              <Card key={session._id} className="p-4 rounded-lg shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-4 px-4">
                  <div className="flex items-center space-x-4 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{new Date(session.questionAttempts[0].startedAt).getDate()}</div>
                      <div className="text-sm text-muted-foreground">{new Date(session.questionAttempts[0].startedAt).toLocaleString('default', { month: 'short' })}</div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">{session.sessionName}</h4>
                      <div className="text-sm text-muted-foreground">
                        {session.activeUsers.map(userId => userNames[userId] || userId).join(', ')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Link href={`/session-history/${session.sessionId}`}>
                      <span>{uniqueQuestions.size} Questions Attempted</span>
                    </Link>
                    <Link href={`/session-history/${session.sessionId}`}>
                      <span>{solvedQuestions.size} Solved</span>
                    </Link>
                  </div>
                  {/* <div className="flex items-center space-x-4">
                    <span>{uniqueQuestions.size} Questions Attempted</span>
                    <span>{solvedQuestions.size} Solved</span>
                  </div> */}
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
// function renderYearSessions(year: number, sessions: Session[], userNames: { [key: string]: string }) {
//   return (
//     <div key={year}>
//       <h3 className="text-xl font-bold mb-4">{year}</h3>
//       <div className="space-y-4">
//         {sessions.length === 0 ? (
//           <div>
//             <p className="text-center mb-4">No sessions yet</p>
//           </div>
//         ) : (
//           sessions.map(session => (
//             <Card key={session._id} className="p-4 rounded-lg shadow-md">
//               <div className="flex flex-wrap items-center justify-between gap-4 px-4">
//                 <div className="flex items-center space-x-4 gap-6">
//                   <div className="text-center">
//                     <div className="text-2xl font-bold">{new Date(session.questionAttempts[0].startedAt).getDate()}</div>
//                     <div className="text-sm text-muted-foreground">{new Date(session.questionAttempts[0].startedAt).toLocaleString('default', { month: 'short' })}</div>
//                   </div>
//                   <div>
//                     <h4 className="text-lg font-semibold">{session.sessionName}</h4>
//                     <div className="text-sm text-muted-foreground">
//                       {session.activeUsers.map(userId => userNames[userId] || userId).join(', ')}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-4">
//                   <span>{session.questionAttempts.reduce((total, attempt) => total + attempt.submissions.length, 0)} Questions Attempted</span>
//                   <span>{session.questionAttempts.filter(attempt => attempt.submissions.some(submission => submission.status === 'accepted')).length} Solved</span>
//                 </div>
//               </div>
//             </Card>
//           ))
//         )}
//       </div>
//     </div>
//   )
// }

// 'use client'

// import Link from 'next/link'
// import React, { useEffect, useState } from 'react'
// import { CalendarIcon, ClockIcon } from 'lucide-react'
// import { Card } from '@/components/ui/card'
// import CreateSessionDialog from '@/components/CreateSessionDialog'
// import { useRouter } from 'next/navigation'
// import { verifyToken } from '@/lib/api-user'

// export interface Session {
//   id: number
//   date: string
//   title: string
//   participants: string[]
//   duration: string
//   questions: number | string
//   solved: number | string
// }

// const sessions: Session[] = []

// export default function SessionsPage() {

//   const [userData, setUserData] = useState({
//     username: "",
//     email: "",
//   });
//   const [loading, setLoading] = useState(true)
//   const router = useRouter();

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const token = localStorage.getItem('token')
//       if (!token) {
//         router.push('/login')
//         return
//       }
//       try {
//         const res = await verifyToken(token)
//         setUserData({ username: res.data.username, email: res.data.email })
//         setLoading(false)
//       } catch (error) {
//         console.error('Token verification failed:', error)
//         router.push('/login') 
//       }
//     }

//     fetchUserData()
//   }, [router])

//   return (
//     <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       <h1 className="text-3xl font-bold mb-8">Welcome back, {userData.username}!</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
//         <Card className="bg-primary text-primary-foreground p-6 rounded-lg shadow-md">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-2xl font-bold">{sessions.length}</h3>
//               <p className="text-sm">Coding Sessions Created</p>
//             </div>
//             <CalendarIcon className="w-10 h-10" />
//           </div>
//         </Card>
//         <Card className="bg-secondary text-secondary-foreground p-6 rounded-lg shadow-md">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-2xl font-bold">-</h3>
//               <p className="text-sm">Hours Practiced</p>
//             </div>
//             <ClockIcon className="w-10 h-10" />
//           </div>
//         </Card>
//       </div>

//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold">Past Coding Sessions</h2>
//         <CreateSessionDialog sessions={sessions} />
//       </div>
//       <div className="space-y-6">
//         {renderYearSessions(2024, sessions)}
//       </div>

//       <div className="mt-8">
//         <Link href="/session-history">
//           View Session History
//         </Link>
//       </div>
//     </main>
//   )
// }

// function renderYearSessions(year: number, sessions: Session[]) {
//   return (
//     <div key={year}>
//       <h3 className="text-xl font-bold mb-4">{year}</h3>
//       <div className="space-y-4">
//         {sessions.length === 0 ? (
//           <div>
//             <p className="text-center mb-4">No sessions yet</p>
//           </div>
//         ) : (
//           sessions.map(session => (
//             <Card key={session.id} className="p-4 rounded-lg shadow-md">
//               <div className="flex flex-wrap items-center justify-between gap-4 px-4">
//                 <div className="flex items-center space-x-4 gap-6">
//                   <div className="text-center">
//                     <div className="text-2xl font-bold">{session.date.split(' ')[0]}</div>
//                     <div className="text-sm text-muted-foreground">{session.date.split(' ')[1]}</div>
//                   </div>
//                   <div>
//                     <h4 className="text-lg font-semibold">{session.title}</h4>
//                     <div className="text-sm text-muted-foreground">{session.participants.join(', ')}</div>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-4">
//                   <span>{session.duration} Hours Practiced</span>
//                   <span>{session.questions} Questions Attempted</span>
//                   <span>{session.solved} Solved</span>
//                 </div>
//               </div>
//             </Card>
//           ))
//         )}
//       </div>
//     </div>
//   )
// }