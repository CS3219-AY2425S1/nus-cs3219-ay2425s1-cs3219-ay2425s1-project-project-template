'use client'

import { useState } from 'react'
import { Button } from '../ui/button'
import { InputField } from '../ui/custom-input'
import validateInput, { initialFormValues } from '@/util/input-validation'

export default function Signup() {
    const inputFields = {
        username: 'Username',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
    }

    const [formValues, setFormValues] = useState({ ...initialFormValues })
    const [formErrors, setFormErrors] = useState({ ...initialFormValues })

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { id, value } = e.target
        setFormValues({ ...formValues, [id]: value })
    }

    const onSignup = () => {
        const isTest = {
            username: true,
            email: true,
            password: true,
            confirmPassword: true,
            proficiency: false,
        }
        const [errors, isValid] = validateInput(isTest, formValues)
        setFormErrors(errors)
        if (isValid) {
            // Add API calls here
            // try {
            //     const body = JSON.stringify({ email, name, password: password })
            //     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
            //         method: 'POST',
            //         headers: {
            //             'Content-Type': 'application/json',
            //         },
            //         body,
            //     })
            //     await res.json()
            //     toast.success('Logged in successfully')
            // } catch {
            //     toast.success('Failed to login')
            // }
        }
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
                        error={formErrors[fieldKey]}
                        onChange={handleFormChange}
                        className="w-full py-3 px-3 border bg-[#EFEFEF] rounded-[5px]"
                    />
                )
            })}

            <Button onClick={onSignup} variant="primary" className="w-full text-md mt-5 h-[42px]">
                Sign Up
            </Button>
            <p className="text-sm text-center text-gray-500 mt-2 px-6">
                By clicking Sign up, you agree to our Terms of Service and Privacy Policy
            </p>
        </>
    )
}
