'use client'

import React from 'react';
import SessionHistoryList from '@/components/session-history/SessionHistoryList';

export default function SessionHistoryPage({ params }) {
  const { sessionId } = params;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SessionHistoryList sessionId={sessionId} />
    </main>
  );
}
// "use client"
// import React, { Suspense } from 'react';
// import { Loader2 } from 'lucide-react';
// import SessionHistoryList from '@/components/session-history/SessionHistoryList';

// async function getSessionHistory(sessionId) {
//   // const res = await fetch(`${process.env.NEXT_PUBLIC_QUESTION_API_URL}/questionhistories/${sessionId}`, { cache: 'no-store' });
//   //const res = await fetch(`${process.env.MONGODB_URI}/sessions/${sessionId}`, { cache: 'no-store' });
//   // need to connect to localhost:27017 somehow
//   if (!res.ok || res.status !== 200) {
//     throw new Error('Failed to fetch session history');
//   }
//   return res.json();
// }

// export default async function SessionHistoryPage({ params }) {
//   const { sessionId } = params;
//   const sessionHistoryPromise = getSessionHistory(sessionId);

//   return (
//     <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       <Suspense fallback={
//         <div className="w-screen h-screen flex items-center justify-center">
//           <Loader2 className="animate-spin h-6 w-6" />
//         </div>
//       }>
//         <SessionHistoryList sessionHistoryPromise={sessionHistoryPromise} />
//       </Suspense>
//     </main>
//   );
// }