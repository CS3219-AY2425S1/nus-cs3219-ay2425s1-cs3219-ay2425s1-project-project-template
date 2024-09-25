import React from 'react'
import { CalendarIcon, ClockIcon, CheckIcon, PlusIcon } from 'lucide-react'

interface Session {
  id: number
  date: string
  title: string
  participants: string[]
  duration: string
  questions: number
  solved: number
}

const sessions: Session[] = [
  {
    id: 1,
    date: '1 May',
    title: 'Coding Session 5',
    participants: ['John Doe', 'Sarah Miller', 'Kimberly Lee', 'Natalie Patel'],
    duration: '2h 15m',
    questions: 18,
    solved: 9
  },
  {
    id: 2,
    date: '5 Apr',
    title: 'Coding Session 4',
    participants: ['John Doe', 'Sarah Miller'],
    duration: '1h 15m',
    questions: 10,
    solved: 6
  },
  {
    id: 3,
    date: '1 Apr',
    title: 'Coding Session 3',
    participants: ['John Doe', 'Sarah Miller', 'Kimberly Lee'],
    duration: '1h 30m',
    questions: 12,
    solved: 9
  }
]

export default function SessionsPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <main className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Welcome back, John!</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-gray-900 text-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">125</p>
                <p className="text-sm">Coding Sessions Created</p>
              </div>
              <CalendarIcon className="w-12 h-12 text-gray-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">342</p>
                <p className="text-sm">Hours Practiced</p>
              </div>
              <ClockIcon className="w-12 h-12 text-gray-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">56</p>
                <p className="text-sm">Problems Solved</p>
              </div>
              <CheckIcon className="w-12 h-12 text-gray-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Past Coding Sessions</h2>
            <button className="bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center hover:bg-gray-800 transition-colors">
              <PlusIcon className="w-5 h-5 mr-2" />
              Create Session
            </button>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">2023</h3>
            {sessions.map((session) => (
              <div key={session.id} className="mb-6 last:mb-0">
                <div className="flex items-start">
                  <div className="bg-gray-200 rounded-lg p-2 mr-4">
                    <p className="text-lg font-bold">{session.date.split(' ')[0]}</p>
                    <p className="text-sm">{session.date.split(' ')[1]}</p>
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-lg font-semibold">{session.title}</h4>
                    <p className="text-sm text-gray-600">{session.participants.join(', ')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{session.duration}</p>
                    <p className="text-sm text-gray-600">{session.questions} Questions</p>
                    <p className="text-sm text-gray-600">{session.solved} Solved</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
// import React from 'react'
// import { CalendarIcon, ClockIcon, CheckIcon, PlusIcon, UserIcon, SettingsIcon, LogOutIcon } from 'lucide-react'

// interface CodingSession {
//   id: number
//   date: string
//   title: string
//   participants: string[]
//   duration: string
//   questions: number
//   solved: number
// }

// const sessions: CodingSession[] = [
//   {
//     id: 1,
//     date: '1 May',
//     title: 'Coding Session 5',
//     participants: ['John Doe', 'Sarah Miller', 'Kimberly Lee', 'Natalie Patel'],
//     duration: '2h 15m',
//     questions: 18,
//     solved: 9
//   },
//   {
//     id: 2,
//     date: '5 Apr',
//     title: 'Coding Session 4',
//     participants: ['John Doe', 'Sarah Miller'],
//     duration: '1h 15m',
//     questions: 10,
//     solved: 6
//   },
//   {
//     id: 3,
//     date: '1 Apr',
//     title: 'Coding Session 3',
//     participants: ['John Doe', 'Sarah Miller', 'Kimberly Lee'],
//     duration: '1h 30m',
//     questions: 12,
//     solved: 9
//   }
// ]

// export default function Dashboard() {
//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* <header className="bg-gray-900 text-white p-4">
//         <div className="container mx-auto flex justify-between items-center">
//           <h1 className="text-xl font-bold">PeerPrep</h1>
//           <nav className="space-x-4">
//             <button className="text-gray-300 hover:text-white">Sessions</button>
//             <button className="text-gray-300 hover:text-white">Questions</button>
//           </nav>
//           <div className="relative">
//             <button className="text-gray-300 hover:text-white">
//               <UserIcon className="w-6 h-6" />
//             </button>
//             <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden">
//               <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                 <UserIcon className="w-4 h-4 inline-block mr-2" /> Profile
//               </a>
//               <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                 <SettingsIcon className="w-4 h-4 inline-block mr-2" /> Settings
//               </a>
//               <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                 <LogOutIcon className="w-4 h-4 inline-block mr-2" /> Logout
//               </a>
//             </div>
//           </div>
//         </div>
//       </header> */}
//       <main className="container mx-auto p-4">
//         <h2 className="text-2xl font-bold mb-6">Welcome back, John!</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//           <div className="bg-gray-900 text-white p-4 rounded-lg shadow">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-3xl font-bold">125</p>
//                 <p className="text-sm">Coding Sessions Created</p>
//               </div>
//               <CalendarIcon className="w-10 h-10 text-gray-500" />
//             </div>
//           </div>
//           <div className="bg-gray-100 p-4 rounded-lg shadow">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-3xl font-bold">342</p>
//                 <p className="text-sm">Hours Practiced</p>
//               </div>
//               <ClockIcon className="w-10 h-10 text-gray-500" />
//             </div>
//           </div>
//           <div className="bg-gray-100 p-4 rounded-lg shadow">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-3xl font-bold">56</p>
//                 <p className="text-sm">Problems Solved</p>
//               </div>
//               <CheckIcon className="w-10 h-10 text-gray-500" />
//             </div>
//           </div>
//         </div>
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-xl font-bold">Past Coding Sessions</h3>
//           <button className="bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center">
//             <PlusIcon className="w-4 h-4 mr-2" /> Create Session
//           </button>
//         </div>
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           <div className="p-4 border-b border-gray-200">
//             <h4 className="text-lg font-semibold">2023</h4>
//           </div>
//           {sessions.map((session) => (
//             <div key={session.id} className="p-4 border-b border-gray-200 hover:bg-gray-50">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <p className="text-lg font-semibold">{session.title}</p>
//                   <p className="text-sm text-gray-500">{session.participants.join(', ')}</p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-sm">{session.duration}</p>
//                   <p className="text-sm">{session.questions} Questions</p>
//                   <p className="text-sm">{session.solved} Solved</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </main>
//     </div>
//   )
// }