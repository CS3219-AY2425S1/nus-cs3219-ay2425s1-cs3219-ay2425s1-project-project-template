'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '../ui/input-otp'

import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function PasswordReset() {
    const [showOtp, setShowOtp] = useState(false)

    const enterResetEmail = (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Forgot your password</DialogTitle>
                <DialogDescription>
                    Enter your email address below and we will send you an otp to reset your password.
                </DialogDescription>
            </DialogHeader>
            <input id="username" value="test@gmail.com" className="w-full p-2 border bg-[#EFEFEF] rounded-[5px]" />
            <DialogFooter>
                <Button type="submit" className="bg-purple-600 hover:bg-[#A78BFA]" onClick={() => setShowOtp(true)}>
                    Send Email
                </Button>
            </DialogFooter>
        </DialogContent>
    )

    const enterOTP = (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Enter your OTP</DialogTitle>
                <DialogDescription>Enter the OTP sent to your email address to reset your password.</DialogDescription>
            </DialogHeader>
            <InputOTP maxLength={6}>
                <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                </InputOTPGroup>
            </InputOTP>
            <DialogFooter>
                <Button type="submit" className="bg-purple-600 hover:bg-[#A78BFA]" onClick={() => setShowOtp(true)}>
                    Verify
                </Button>
            </DialogFooter>
        </DialogContent>
    )

    return (
        <Dialog>
            <DialogTrigger asChild>
                <p className="underline cursor-pointer">Forgot your password?</p>
            </DialogTrigger>
            {showOtp ? enterOTP : enterResetEmail}
        </Dialog>
    )
}
