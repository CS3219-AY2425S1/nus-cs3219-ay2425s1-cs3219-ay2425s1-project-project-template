"use client"

import { useState, useEffect } from "react"
import { User, Code } from "lucide-react"

export default function LoadingPage() {
  const [elapsedTime, setElapsedTime] = useState(0)
  const [usersWaiting, setUsersWaiting] = useState(4)

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prevTime) => prevTime + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-[#1a1f2e] text-gray-300 flex flex-col">
      <header className="p-4 flex justify-between items-center border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Code className="h-6 w-6" />
          <span className="text-lg font-semibold">PeerPrep</span>
        </div>
        <User className="h-6 w-6" />
      </header>
      <main className="flex-grow flex flex-col items-center justify-center px-4 space-y-6">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
        <h1 className="text-2xl font-bold text-white">Finding a match</h1>
        <p className="text-sm text-center max-w-md">
          We&apos;re pairing you with another coder. This may take a few moments.
        </p>
        <div className="w-full max-w-md space-y-2">
          <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full"
              style={{ width: `${(elapsedTime % 60) / 60 * 100}%` }}
            ></div>
          </div>
          <div className="text-sm text-center">
            Time elapsed: {elapsedTime} seconds
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <User className="h-4 w-4" />
          <span>{usersWaiting} users waiting</span>
        </div>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors w-full max-w-md">
          Cancel Matching
        </button>
        <p className="text-sm text-gray-500 mt-4">
          Tip: While you wait, why not review some coding concepts?
        </p>
      </main>
    </div>
  )
}