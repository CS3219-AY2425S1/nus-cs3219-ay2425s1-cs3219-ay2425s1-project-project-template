function Setting() {
    return (
        <>
            <form className="space-y-8">
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
                    <input
                        type="text"
                        id="email"
                        placeholder=""
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Confirm Password
                    </label>
                    <input
                        type="text"
                        id="email"
                        placeholder=""
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600"
                >
                    Update Settings
                </button>
            </form>
        </>
    )
}

export default Setting
