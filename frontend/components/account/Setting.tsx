import usePasswordToggle from './UsePasswordToggle'

function Setting() {
    // Password Toggle hook
    const [passwordInputType, passwordToggleIcon] = usePasswordToggle()
    const [confirmPasswordInputType, confirmPasswordToggleIcon] = usePasswordToggle()

    return (
        <>
            <form className="space-y-8 h-full">
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

                <button type="submit" className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600">
                    Update Settings
                </button>
            </form>
        </>
    )
}

export default Setting
