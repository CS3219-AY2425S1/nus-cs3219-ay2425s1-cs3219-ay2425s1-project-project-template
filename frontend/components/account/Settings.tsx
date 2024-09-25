import { useState } from 'react'
import InputField from '../ui/custom-input'
import DeleteDialog from './DeleteDialog'
import usePasswordToggle from './UsePasswordToggle'

function Setting() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordInputType, passwordToggleIcon] = usePasswordToggle()
    const [confirmPasswordInputType, confirmPasswordToggleIcon] = usePasswordToggle()

    const validateForm = (): boolean => {
        if (!email) {
            alert('Email is required')
            return false
        }
        if (!password || !confirmPassword) {
            alert('Both password fields are required')
            return false
        }
        if (password !== confirmPassword) {
            alert('Passwords do not match')
            return false
        }
        // Additional validation logic can go here, such as email format validation
        return true
    }

    // Submit handler
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault() // Prevents default form submission behavior
        if (validateForm()) {
            // Form is valid, handle form submission (e.g., send data to server)
            console.log('Form submitted:', { email, password })
        }
    }

    return (
        <>
            <div className="flex flex-col h-full">
                <div className="flex flex-[4] flex-row">
                    <form className="flex flex-[4] flex-col w-full space-y-8 pt-3" onSubmit={handleSubmit}>
                        <InputField
                            id="email"
                            label="Email"
                            type="text"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <InputField
                            id="password"
                            label="Password"
                            type={passwordInputType}
                            placeholder="Enter Password"
                            icon={passwordToggleIcon}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <InputField
                            id="password_repeat"
                            label="Confirm Password"
                            type={confirmPasswordInputType}
                            placeholder="Enter Password"
                            icon={confirmPasswordToggleIcon}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        <button
                            type="submit"
                            className="w-fit bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600"
                        >
                            Update Settings
                        </button>
                    </form>
                    <div className="flex flex-[2]"></div>
                </div>
                <div className="flex flex-[1] mr-6 relative flex-col justify-evenly">
                    <span className="absolute block transform -translate-x-1/2 left-1/2 top-0 h-0.5 w-screen bg-slate-200"></span>
                    <p className="pt-4">Would you like to delete your account and all associated data?</p>
                    <DeleteDialog />
                </div>
            </div>
        </>
    )
}

export default Setting
