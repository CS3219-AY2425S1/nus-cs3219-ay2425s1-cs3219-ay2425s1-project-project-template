import { CloseIcon } from '@/assets/icons'
import { Button } from '../ui/button'

interface CustomModalProps {
    title?: string
    closeHandler?: () => void
    className?: string
    children?: React.ReactNode
}

export default function CustomModal({ title, closeHandler, className, children }: CustomModalProps) {
    return (
        <div className="fixed top-0 left-0 w-full h-screen max-h-screen bg-gray-400/50 flex items-center justify-center z-[999]">
            <div className={`h-2/3 w-2/3 bg-white p-10 overflow-y-auto ${className}`}>
                <div className="flex justify-between items-center border-b-[1px] border-gray-200 pb-4 mb-6">
                    {title && <h2 className="text-xl font-bold">{title}</h2>}
                    <Button variant="iconNoBorder" size="icon" onClick={closeHandler}>
                        <CloseIcon />
                    </Button>
                </div>
                {children}
            </div>
        </div>
    )
}
