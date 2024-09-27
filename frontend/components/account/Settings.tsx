import { useState } from 'react'
import { toast } from 'sonner'
import { InputField } from '../ui/custom-input'
import usePasswordToggle from './UsePasswordToggle'
import CustomDialogWithButton from '../customs/custom-dialog'

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
    const [isDeleteDialogOpen, toggleDeleteDialogOpen] = useState(false)
    const [isUpdateDialogOpen, toggleUpdateDialogOpen] = useState(false)
    const [isFormSubmit, setIsFormSubmit] = useState(false)

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { id, value } = e.target
        setFormValues({ ...formValues, [id]: value })
    }

    const validateInput = (values: ISettingFormInput): boolean => {
        let isValid = true
        const errors: ISettingFormInput = { ...initialValues }

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

        setFormErrors(errors)
        return isValid
    }

    // Submit handler
    const handleFormSubmit = () => {
        setIsFormSubmit(true)
        toggleUpdateDialogOpen(false)
        toast.success('Profile has been updated successfully.')
        setFormValues(initialValues) // Replace with placeholder values if needed
    }

    const handleUpdateClick = (): void => {
        if (validateInput(formValues)) {
            toggleUpdateDialogOpen(true)
        }
    }

    const manageUpdateDialog = (): void => {
        if (isUpdateDialogOpen && !isFormSubmit) {
            toggleUpdateDialogOpen(false)
        }
    }

    const handleDeleteConfirm = (): void => {
        // Delete user from database
        toggleDeleteDialogOpen(false)
    }

    return (
        <>
            <div className="flex flex-col h-full">
                <div className="flex flex-[4] flex-row">
                    <form className="flex flex-[4] flex-col w-full space-y-6 pt-4 justify-start">
                        <InputField
                            id="email"
                            label="Email"
                            type="text"
                            placeholder="name@example.com"
                            value={formValues.email}
                            onChange={handleFormChange}
                            error={formErrors.email}
                        />

                        <InputField
                            id="password"
                            label="Password"
                            type={passwordInputType}
                            placeholder="Enter Password"
                            icon={passwordToggleIcon}
                            value={formValues.password}
                            onChange={handleFormChange}
                            error={formErrors.password}
                        />

                        <InputField
                            id="confirmPassword"
                            label="Confirm Password"
                            type={confirmPasswordInputType}
                            placeholder="Enter Password"
                            icon={confirmPasswordToggleIcon}
                            value={formValues.confirmPassword}
                            onChange={handleFormChange}
                            error={formErrors.confirmPassword}
                        />

                        <CustomDialogWithButton
                            dialogOpen={isUpdateDialogOpen}
                            onDialogOpenChange={manageUpdateDialog}
                            text="Update Settings"
                            className="w-fit bg-btn text-white text-md py-2 px-4 rounded-md hover:bg-theme-700"
                            type="button"
                            variant="primary"
                            description="Are you sure you want to update your settings?"
                            onClickTrigger={handleUpdateClick}
                            onClickConfirm={handleFormSubmit}
                        />
                    </form>
                    <div className="flex flex-[2]"></div>
                </div>
                <div className="flex flex-[1] mr-6 relative flex-col justify-evenly">
                    <span className="absolute block transform -translate-x-1/2 left-1/2 top-0 h-0.5 w-screen bg-slate-200"></span>
                    <p className="pt-4">Would you like to delete your account and all associated data?</p>
                    <CustomDialogWithButton
                        dialogOpen={isDeleteDialogOpen}
                        onDialogOpenChange={toggleDeleteDialogOpen}
                        text="Delete Account"
                        className="w-fit text-red-delete text-md"
                        type="submit"
                        variant="outline"
                        description="Are you sure you want to delete your account? You will not be able to recover your data."
                        onClickConfirm={handleDeleteConfirm}
                    />
                </div>
            </div>
        </>
    )
}

export default Setting
