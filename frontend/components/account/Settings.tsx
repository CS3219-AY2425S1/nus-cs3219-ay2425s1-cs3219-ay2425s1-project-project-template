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
            toast.success('Profile has been updated successfully.')
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
                            className="w-fit bg-btn text-white py-2 px-4 rounded-md hover:bg-theme-700"
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
