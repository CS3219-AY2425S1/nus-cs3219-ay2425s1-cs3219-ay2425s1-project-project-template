import DeleteDialog from './DeleteDialog'
import usePasswordToggle from './UsePasswordToggle'

function Setting() {
    // Password Toggle hook
    const [passwordInputType, passwordToggleIcon] = usePasswordToggle()
    const [confirmPasswordInputType, confirmPasswordToggleIcon] = usePasswordToggle()

    return (
        <>
            <div className="flex flex-col h-full">
                <div className="flex flex-[4] flex-row">
                    <form className="flex flex-[4] flex-col w-full space-y-8 pt-3">
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
                    <p className="pt-4">Would you like to delete your account and all associated data?</p>
                    <DeleteDialog />
                </div>
            </div>
        </>
    )
}

export default Setting
