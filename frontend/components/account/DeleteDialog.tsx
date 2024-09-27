import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { ErrorIconDialog } from '@/assets/icons/error-icon'

function DeleteDialog() {
    const [isModalOpen, toggleModalOpen] = useState(false)

    const handleDelete = (): void => {
        // Delete user from database
        toggleModalOpen(false)
    }

    return (
        <>
            <Dialog open={isModalOpen} onOpenChange={toggleModalOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="w-fit text-red-delete text-md">
                        Delete account
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            <div className="flex flex-row gap-5">
                                <ErrorIconDialog />
                                Warning
                            </div>
                            <span className="h-0.5 w-full bg-slate-200 mt-3"></span>
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete your account? You will not be able to recover your data.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="submit"
                            variant="primary"
                            className="text-base bg-btn"
                            onClick={() => {
                                handleDelete()
                            }}
                        >
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default DeleteDialog
