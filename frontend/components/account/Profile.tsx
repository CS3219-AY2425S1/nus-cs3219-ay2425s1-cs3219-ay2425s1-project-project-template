function Profile() {
    return (
        <>
            <form className="space-y-8">
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
                    >
                        <option>Select one...</option>
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                    </select>
                </div>

                <button type="submit" className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600">
                    Update Profile
                </button>
            </form>
        </>
    )
}

export default Profile
