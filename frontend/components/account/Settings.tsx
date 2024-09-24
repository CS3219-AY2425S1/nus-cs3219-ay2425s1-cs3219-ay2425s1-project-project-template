import usePasswordToggle from './UsePasswordToggle'
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

function Setting() {
    // Password Toggle hook
    const [passwordInputType, passwordToggleIcon] = usePasswordToggle()
    const [confirmPasswordInputType, confirmPasswordToggleIcon] = usePasswordToggle()

    return (
        <>
            <div className="flex flex-col h-full">
                <div className="flex flex-[4] flex-row">
                    <form className="flex flex-[4] flex-col w-full space-y-8">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="text"
                                id="email"
                                placeholder="name@example.com"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={passwordInputType}
                                    id="password"
                                    placeholder="Enter Password"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                />
                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    {passwordToggleIcon}
                                </span>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password_repeat" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={confirmPasswordInputType}
                                    id="password_repeat"
                                    placeholder="Enter Password"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                />
                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    {confirmPasswordToggleIcon}
                                </span>
                            </div>
                        </div>

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
                    {/* Add in logic for deletion + change colour */}
                    <p className="pt-4">Would you like to delete your account and all associated data?</p>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-fit text-red-delete">
                                Delete account
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    <div className="flex flex-row gap-5">
                                        <svg
                                            width="28"
                                            height="25"
                                            viewBox="0 0 28 25"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fill-rule="evenodd"
                                                clip-rule="evenodd"
                                                d="M11.4644 1.60061C12.5928 -0.311204 15.4073 -0.311205 16.5357 1.60061L27.6032 20.3529C28.7674 22.3256 27.2578 24.6667 25.0676 24.6667H2.93256C0.742397 24.6667 -0.767312 22.3256 0.396917 20.3529L11.4644 1.60061ZM11.735 7.23146C11.6979 6.56273 12.2302 6.00008 12.9 6.00008H15.1C15.7698 6.00008 16.3021 6.56273 16.265 7.23146L15.8112 15.3982C15.7768 16.0164 15.2655 16.5001 14.6463 16.5001H13.3537C12.7345 16.5001 12.2232 16.0164 12.1888 15.3982L11.735 7.23146ZM16.3333 20.0001C16.3333 21.2888 15.2887 22.3334 14 22.3334C12.7113 22.3334 11.6667 21.2888 11.6667 20.0001C11.6667 18.7114 12.7113 17.6667 14 17.6667C15.2887 17.6667 16.3333 18.7114 16.3333 20.0001Z"
                                                fill="#7F57C2"
                                            />
                                        </svg>
                                        Warning
                                    </div>
                                    <span className="absolute bottom-2 h-0.5 w-full bg-slate-200"></span>
                                </DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to delete your account? You will not be able to recover your
                                    data.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button type="submit" className="text-base bg-purple-500">
                                    Confirm
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    {/* <Button variant="outline" className="w-fit text-red-delete" onClick={}>
                        Delete Account
                    </Button> */}
                </div>
            </div>
        </>
    )
}

export default Setting
