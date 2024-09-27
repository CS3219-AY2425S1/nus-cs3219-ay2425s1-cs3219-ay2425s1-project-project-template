import { useRef, useState } from 'react'
import { InputField, OptionsField } from '../ui/custom-input'
import { toast } from 'sonner'
import CustomDialogWithButton from '../customs/custom-dialog'

interface IProfileFormInput {
    username: string
    proficiency: string
}

function Profile() {
    const initialValues: IProfileFormInput = {
        username: '',
        proficiency: '',
    }

    const [formValues, setFormValues] = useState(initialValues)
    const [formErrors, setFormErrors] = useState(initialValues)
    const [isDialogOpen, toggleDialogOpen] = useState(false)
    const [isFormSubmit, setIsFormSubmit] = useState(false)
    const formRef = useRef<HTMLFormElement>(null)

    const handleUsernameChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>): void => {
        const { id, value } = e.target
        setFormValues({ ...formValues, [id]: value })
    }

    const handleProficiencyChange = (e: string): void => {
        setFormValues({ ...formValues, proficiency: e })
    }

    const validateInput = (values: IProfileFormInput): boolean => {
        let isValid = true
        const errors = { ...initialValues }

        if (!values.username) {
            errors.username = 'Please Enter a username!'
            isValid = false
        }

        if (!values.proficiency) {
            errors.proficiency = 'Please choose a proficiency level!'
            isValid = false
        }

        setFormErrors(errors)
        return isValid
    }

    const handleFormSubmit = (): void => {
        setIsFormSubmit(true)
        toggleDialogOpen(false)
        toast.success('Profile has been updated successfully.')
        setFormValues(initialValues)
    }

    const handleUpdateClick = (): void => {
        if (validateInput(formValues)) {
            toggleDialogOpen(true)
        }
    }

    const manageDialog = (): void => {
        if (isDialogOpen && !isFormSubmit) {
            toggleDialogOpen(false)
        }
    }

    return (
        <>
            <div className="flex flex-row">
                <form ref={formRef} className="flex flex-[4] flex-col h-full w-full space-y-6 pt-4">
                    <InputField
                        type="text"
                        id="username"
                        label="Username"
                        placeholder="eg. John Doe"
                        value={formValues.username}
                        onChange={handleUsernameChange}
                        error={formErrors.username}
                    />

                    <OptionsField
                        id="proficiency"
                        label="Proficiency"
                        error={formErrors.proficiency}
                        onChange={handleProficiencyChange}
                    />

                    <CustomDialogWithButton
                        dialogOpen={isDialogOpen}
                        onDialogOpenChange={manageDialog} // Allow toggling the dialog
                        text="Update Profile"
                        className="w-fit bg-btn text-white text-md py-2 px-4 rounded-md hover:bg-purple-700"
                        type="button"
                        variant="primary"
                        description="Are you sure you want to update your profile?"
                        onClickTrigger={handleUpdateClick} // Trigger validation and open dialog
                        onClickConfirm={handleFormSubmit} // Confirm action
                    />
                </form>
                <div className="flex flex-[2]"></div>
            </div>
        </>
    )
}

export default Profile
