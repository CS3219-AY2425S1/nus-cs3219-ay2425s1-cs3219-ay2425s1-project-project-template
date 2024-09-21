import { useState } from 'react'
import { Logo } from './Logo'
import { useToast } from '@/app/components/ui/toast/use-toast'

export default function Signup() {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [pw, setPw] = useState('')
    const [confirmPw, setConfirmPw] = useState('')
    const { toast } = useToast()
    const onSignup = async () => {
        if (!email || !name || !pw || !confirmPw) {
            toast({ variant: 'destructive', description: 'Please fill out all fields' })
            return
        }

        if (pw !== confirmPw) {
            toast({ variant: 'destructive', description: 'Passwords do not match' })
            return
        }

        try {
            const body = JSON.stringify({ email, name, password: pw })
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body,
            })
            await res.json()
            toast({ description: 'Logged in successfully' })
        } catch {
            toast({ variant: 'destructive', description: 'Failed to login' })
        }
    }
    return (
        <div className="flex flex-col gap-4 items-center sm:items-start w-full mx-auto max-w-sm">
            <div className="flex flex-col items-center justify-center my-5 w-full gap-8">
                <Logo />
                <h2 className="text-2xl font-bold mb-4">Start your journey with us!</h2>
            </div>

            <input
                type="text"
                placeholder="Name"
                className="w-full p-2 border bg-[#EFEFEF] rounded-[5px]"
                value={name}
                onChange={(x) => setName(x.target.value)}
            />
            <input
                type="text"
                placeholder="Email"
                className="w-full p-2 border bg-[#EFEFEF] rounded-[5px]"
                value={email}
                onChange={(x) => setEmail(x.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                className="w-full p-2 border bg-[#EFEFEF] rounded-[5px]"
                value={pw}
                onChange={(x) => setPw(x.target.value)}
            />
            <input
                type="password"
                placeholder="Confirm password"
                className="w-full p-2 border bg-[#EFEFEF] rounded-[5px]"
                value={confirmPw}
                onChange={(x) => setConfirmPw(x.target.value)}
            />
            <button
                onClick={onSignup}
                className="w-full bg-[#7F57C2] text-white p-2 rounded mt-4 hover:bg-blue-700 transition-colors"
            >
                Sign Up
            </button>
            <p className="text-sm text-gray-500 mt-2">By signing up, you agree to our Terms and Privacy Policy.</p>
        </div>
    )
}
