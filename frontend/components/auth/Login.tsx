'use client'

import { PasswordReset } from './PasswordReset'
import { useState } from 'react'
import { initialFormValues } from '@/util/input-validation'
import { Button } from '../ui/button'
import { InputField } from '../ui/custom-input'

export default function Login() {
    const inputFields = {
        email: 'Email',
        password: 'Password',
    }
    const [formValues, setFormValues] = useState({ ...initialFormValues })

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
    }

    return (
        <>
            {Object.keys(inputFields).map((key) => {
                const fieldKey = key as keyof typeof inputFields
                return (
                    <InputField
                        key={fieldKey}
                        id={fieldKey}
                        type={fieldKey.includes('Password') ? 'password' : 'text'}
                        placeholder={inputFields[fieldKey]}
                        value={formValues[fieldKey]}
                        onChange={handleFormChange}
                        className="w-full py-3 px-3 border bg-[#EFEFEF] rounded-[5px]"
                    />
                )
            })}

            <Button onClick={onLogin} variant="primary" className="w-full text-md mt-5 h-[42px]">
                Login
            </Button>
            <PasswordReset />
        </>
    )
}
