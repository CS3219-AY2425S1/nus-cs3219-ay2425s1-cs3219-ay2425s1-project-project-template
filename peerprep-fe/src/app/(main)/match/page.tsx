'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Code } from 'lucide-react';
import { consumeMessageFromQueue } from '@/lib/rabbitmq';

export default function LoadingPage() {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [usersWaiting, setUsersWaiting] = useState(4);
  const router = useRouter();

  const startConsumingMessages = async () => {
    try {
      await consumeMessageFromQueue().then((message) => {
        // This function is called when a message is consumed
        if (message.status == 'matched') {
          console.log('Match found, your partner is');
          router.push('/');
        } else {
          console.log('Match failed');
          router.push('/');
        }
      });
    } catch (error) {
      console.error('Error consuming message:', error);
    }
  };

  useEffect(() => {
    startConsumingMessages();
    const timer = setInterval(() => {
      setElapsedTime((prevTime) => prevTime + 1);
    }, 1000);
    setUsersWaiting(5);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (elapsedTime >= 60) {
      // Execute your action here
      console.log('Elapsed time reached 60 seconds. Going back to main page');
      router.push('/');
    }
  }, [elapsedTime]);

  return (
    <div className="flex min-h-screen flex-col bg-[#1a1f2e] text-gray-300">
      <header className="flex items-center justify-between border-b border-gray-700 p-4">
        <div className="flex items-center space-x-2">
          <Code className="h-6 w-6" />
          <span className="text-lg font-semibold">PeerPrep</span>
        </div>
        <User className="h-6 w-6" />
      </header>
      <main className="flex flex-grow flex-col items-center justify-center space-y-6 px-4">
        <div className="h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-purple-500"></div>
        <h1 className="text-2xl font-bold text-white">Finding a match</h1>
        <p className="max-w-md text-center text-sm">
          We&apos;re pairing you with another coder. This may take a few
          moments.
        </p>
        <div className="w-full max-w-md space-y-2">
          <div className="h-1 overflow-hidden rounded-full bg-gray-700">
            <div
              className="h-full rounded-full bg-purple-500"
              style={{ width: `${((elapsedTime % 60) / 60) * 100}%` }}
            ></div>
          </div>
          <div className="text-center text-sm">
            Time elapsed: {elapsedTime} seconds
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <User className="h-4 w-4" />
          <span>{usersWaiting} users waiting</span>
        </div>
        <button className="w-full max-w-md rounded-md bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700">
          Cancel Matching
        </button>
        <p className="mt-4 text-sm text-gray-500">
          Tip: While you wait, why not review some coding concepts?
        </p>
      </main>
    </div>
  );
}
