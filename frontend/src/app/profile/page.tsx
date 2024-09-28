// app/profile/page.tsx
'use client'

import React from 'react'

const ProfilePage: React.FC = () => {
    const user = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: '/assets/wumpus.jpg',
    }

    return (
        <div className="flex flex-grow items-center justify-center bg-gray-100 p-4 w-screen" >
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <div className="flex items-center mb-6">
                    <img
                        src={user.avatar}
                        alt="User Avatar"
                        className="w-16 h-16 rounded-full mr-4 object-cover"
                    />
                    <div>
                        <h2 className="text-xl font-bold">{user.name}</h2>
                        <p className="text-gray-600">{user.email}</p>
                    </div>
                </div>
                {/* Add more profile-related sections here */}
                <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
                    Logout
                </button>
            </div>
        </div>
    )
}

export default ProfilePage
