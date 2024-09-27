'use client'

import { PasswordReset } from './PasswordReset'
import { useState } from 'react'
import { initialFormValues } from '@/util/input-validation'
import { Button } from '../ui/button'
import { InputField } from '../customs/custom-input'
import usePasswordToggle from '../account/UsePasswordToggle'
import { toast } from 'sonner'

export default function Login() {
    const inputFields = {
        email: 'Email',
        password: 'Password',
    }
    const [formValues, setFormValues] = useState({ ...initialFormValues })
    const [passwordInputType, passwordToggleIcon] = usePasswordToggle()

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { id, value } = e.target
        setFormValues({ ...formValues, [id]: value })
    }

    const onLogin = async () => {
        // try {
        //     const body = JSON.stringify({ email, password })
        //     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body,
        //     })
        //     await res.json()
        //     toast.success('Logged in successfully')
        // } catch {
        //     toast.error('Failed to login')
        // }
        toast.success('Logged in successfully')
    }

    return (
        <>
            <InputField
                id="email"
                type="text"
                placeholder="Email"
                value={formValues.email}
                onChange={handleFormChange}
                className="w-full py-3 px-3 border bg-[#EFEFEF] rounded-[5px]"
            />

            <InputField
                id="password"
                type={passwordInputType}
                placeholder="Password"
                icon={passwordToggleIcon}
                value={formValues.password}
                onChange={handleFormChange}
                className="w-full py-3 px-3 border bg-[#EFEFEF] rounded-[5px]"
                page="auth"
            />

            <Button onClick={onLogin} variant="primary" className="w-full text-md mt-5 h-[42px]">
                Login
            </Button>
            <PasswordReset />
        </>
    )
}
