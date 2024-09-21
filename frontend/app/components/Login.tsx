import { useState } from 'react'
import { Logo } from './Logo'
import { useToast } from './ui/toast/use-toast'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { toast } = useToast()
    const onLogin = async () => {
        try {
            const body = JSON.stringify({ email, password })
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
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
                placeholder="Email"
                className="w-full p-2 border bg-[#EFEFEF] rounded-[5px]"
                value={email}
                onChange={(x) => setEmail(x.target.value)}
            />
            <input
                type="text"
                placeholder="Password"
                className="w-full p-2 border bg-[#EFEFEF] rounded-[5px]"
                value={password}
                onChange={(x) => setPassword(x.target.value)}
            />
            <button
                onClick={onLogin}
                className="w-full bg-[#7F57C2] text-white p-2 rounded mt-4 hover:bg-blue-700 transition-colors"
            >
                Login
            </button>
        </div>
    )
}
