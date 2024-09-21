'use client'
import { useState } from 'react'
import Login from './components/Login'
import Signup from './components/Signup'
import Image from 'next/image'

export default function Home() {
    const [isLoginPage, setIsLoginPage] = useState(false)
    return (
        <div className="grid grid-cols-2 h-screen">
            <div className="mx-16 flex flex-col justify-center">
                <h2 className="font-bold text-6xl">PeerPrep</h2>
                <p className="text-gray-600 font-semibold mt-4">
                    Connect, Collaborate, Code: Unlock Your Potential Together
                </p>
                <div className="flex justify-center mt-8">
                    <Image src="/img.png" width={400} height={400} alt="heillo i am a pro" />
                </div>
            </div>
            <div className="m-16">
                <div className="flex justify-end mb-12">
                    <button
                        onClick={() => {
                            setIsLoginPage((x) => !x)
                        }}
                    >
                        {isLoginPage ? 'Sign up' : 'Log in'}
                    </button>
                </div>
                {isLoginPage ? <Login /> : <Signup />}
            </div>
        </div>
    )
}
