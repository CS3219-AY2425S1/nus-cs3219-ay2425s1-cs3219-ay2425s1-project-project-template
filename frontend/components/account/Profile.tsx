function Profile() {
    return (
        <>
            <div className="flex flex-row">
                <form className="flex flex-[4] flex-col h-full w-full space-y-8 pt-3">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            placeholder="eg. John Doe"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="proficiency" className="block text-sm font-medium text-gray-700">
                            Proficiency
                        </label>
                        <select
                            id="proficiency"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            defaultValue="placeholder-option"
                        >
                            <option value="placeholder-option" disabled>
                                Select one...
                            </option>
                            <option>Beginner</option>
                            <option>Intermediate</option>
                            <option>Advanced</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-fit bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600"
                    >
                        Update Profile
                    </button>
                </form>
                <div className="flex flex-[2]"></div>
            </div>
        </>
    )
}

export default Profile
