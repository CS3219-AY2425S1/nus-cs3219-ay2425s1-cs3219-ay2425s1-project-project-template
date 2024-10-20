'use client'

import validateInput, { initialFormValues } from '@/util/input-validation'

import { Button } from '../ui/button'
import { InputField } from '../customs/custom-input'
import { PasswordReset } from './PasswordReset'
import React from 'react'
import { signIn } from 'next-auth/react'
import { toast } from 'sonner'
import usePasswordToggle from '../../hooks/UsePasswordToggle'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function Login() {
    const [formValues, setFormValues] = useState({ ...initialFormValues })
    const [formErrors, setFormErrors] = useState({ ...initialFormValues, proficiency: '' })
    const [passwordInputType, passwordToggleIcon] = usePasswordToggle()
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { id, value } = e.target
        setFormValues({ ...formValues, [id]: value })
    }

    const router = useRouter()

    const onLogin = async () => {
        const isTest = {
            email: true,
            loginPassword: true,
            password: false,
            username: false,
            confirmPassword: false,
            proficiency: false,
            otp: false,
        }

        const [errors, isValid] = validateInput(isTest, formValues)
        setFormErrors(errors)

        if (isValid) {
            const result = await signIn('credentials', {
                redirect: false,
                username: formValues.email,
                password: formValues.loginPassword,
            })
            if (result?.error) {
                toast.error('Login failed. Please try again')
                return
            } else {
                toast.success('Logged in successfully')
                router.push('/')
            }
        }
    }

    return (
        <>
            <InputField
                id="email"
                type="text"
                placeholder="Email"
                value={formValues.email}
                onChange={handleFormChange}
                error={formErrors.email}
                className="w-full py-3 px-3 border bg-[#EFEFEF] rounded-[5px]"
            />

            <InputField
                id="loginPassword"
                type={passwordInputType}
                placeholder="Password"
                icon={passwordToggleIcon}
                value={formValues.loginPassword}
                onChange={handleFormChange}
                error={formErrors.loginPassword}
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
