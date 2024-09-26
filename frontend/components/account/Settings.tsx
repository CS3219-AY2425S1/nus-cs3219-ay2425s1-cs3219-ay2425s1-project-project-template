import { useState } from 'react'
import { toast } from 'sonner'
import { InputField } from '../ui/custom-input'
import DeleteDialog from './DeleteDialog'
import usePasswordToggle from './UsePasswordToggle'

interface ISettingFormInput {
    email: string
    password: string
    confirmPassword: string
}

function Setting() {
    const [passwordInputType, passwordToggleIcon] = usePasswordToggle()
    const [confirmPasswordInputType, confirmPasswordToggleIcon] = usePasswordToggle()

    const initialValues: ISettingFormInput = {
        email: '',
        password: '',
        confirmPassword: '',
    }

    const [formValues, setFormValues] = useState(initialValues)
    const [formErrors, setFormErrors] = useState(initialValues)
    // const [isSubmit, setIsSubmit] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { id, value } = e.target
        setFormValues({ ...formValues, [id]: value })
    }

    const validateInput = (values: ISettingFormInput): [ISettingFormInput, boolean] => {
        const errors: ISettingFormInput = { ...initialValues }
        let isValid: boolean = true

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i
        const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/

        const validateEmail = (email: string): boolean => emailRegex.test(email)
        const validatePassword = (password: string): boolean => passwordRegex.test(password)

        if (!values.email) {
            errors.email = 'Email is required!'
            isValid = false
        } else if (!validateEmail(values.email)) {
            errors.email = 'Invalid Email!'
            isValid = false
        }

        if (!values.password) {
            errors.password = 'Password is required!'
            isValid = false
        } else if (!validatePassword(values.password)) {
            errors.password =
                'Weak password, please ensure you have at least 8 characters, one upper and lower case letter, one digit and one special character.'
            isValid = false
        }

        if (!values.confirmPassword) {
            errors.confirmPassword = 'Please re-enter your password!'
            isValid = false
        } else if (values.password !== values.confirmPassword) {
            errors.confirmPassword = "Passwords don't match!"
            isValid = false
        }

        return [errors, isValid]
    }

    // Submit handler
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault() // Prevents default form submission behavior
        const [errors, isValid] = validateInput(formValues)
        if (!isValid) {
            setFormErrors(errors)
        } else {
            // setIsSubmit(true)
            // Handle submit here, make sure receive 200, if not then return error
            toast('Profile has been updated successfully.', {
                description: '',
                duration: 2000, // Automatically hide after 4 seconds
                className: 'border border-gray-200 rounded-lg p-4 shadow-md',
                position: 'top-center',
                icon: (
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M14 0C6.286 0 0 6.286 0 14C0 21.714 6.286 28 14 28C21.714 28 28 21.714 28 14C28 6.286 21.714 0 14 0ZM20.692 10.78L12.754 18.718C12.558 18.914 12.292 19.026 12.012 19.026C11.732 19.026 11.466 18.914 11.27 18.718L7.308 14.756C6.902 14.35 6.902 13.678 7.308 13.272C7.714 12.866 8.386 12.866 8.792 13.272L12.012 16.492L19.208 9.296C19.614 8.89 20.286 8.89 20.692 9.296C21.098 9.702 21.098 10.36 20.692 10.78Z"
                            fill="#34D399"
                        />
                    </svg>
                ),
            })
        }
    }

    return (
        <>
            <div className="flex flex-col h-full">
                <div className="flex flex-[4] flex-row">
                    <form
                        className="flex flex-[4] flex-col w-full space-y-6 pt-4 justify-start"
                        onSubmit={handleSubmit}
                    >
                        <InputField
                            id="email"
                            label="Email"
                            type="text"
                            placeholder="name@example.com"
                            value={formValues.email}
                            onChange={handleChange}
                            error={formErrors.email}
                        />

                        <InputField
                            id="password"
                            label="Password"
                            type={passwordInputType}
                            placeholder="Enter Password"
                            icon={passwordToggleIcon}
                            value={formValues.password}
                            onChange={handleChange}
                            error={formErrors.password}
                        />

                        <InputField
                            id="confirmPassword"
                            label="Confirm Password"
                            type={confirmPasswordInputType}
                            placeholder="Enter Password"
                            icon={confirmPasswordToggleIcon}
                            value={formValues.confirmPassword}
                            onChange={handleChange}
                            error={formErrors.confirmPassword}
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
