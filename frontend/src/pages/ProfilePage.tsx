import React, { useState, useEffect } from 'react';
import Navbar from "../components/NavBar.tsx";
import { User } from '../types/User.tsx';
import useRetrieveUser from '../hooks/useRetrieveUser.tsx';
import EditUsernameModal from '../components/ProfileModals/EditUsernameModal.tsx';
import EditEmailModal from '../components/ProfileModals/EditEmailModal.tsx';
import EditPasswordModal from '../components/ProfileModals/EditPasswordModal.tsx';

const ProfilePage: React.FC = () => {
    const [user, setUser] = useState<User | undefined>(undefined);
    const [username, setUsername] = useState<string | undefined>(undefined);

    const [isUsernameModalOpen, setUsernameModalOpen] = useState(false);
    const openUnModal = () => setUsernameModalOpen(true);
    const closeUnModal = () => setUsernameModalOpen(false);

    const [isEmailModalOpen, setEmailModalOpen] = useState(false);
    const openEmailModal = () => setEmailModalOpen(true);
    const closeEmailModal = () => setEmailModalOpen(false);

    const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
    const openPwModal = () => setPasswordModalOpen(true);
    const closePwModal = () => setPasswordModalOpen(false);

    useRetrieveUser(setUser);

    useEffect(() => {
        console.log("triggered")
        setUsername(user?.username);
      }, [user]);

    return (
        <div className="bg-white w-screen h-screen">
            <Navbar />

            <div className='justify-center p-8 grid'>

                <div className='py-16'>
                <h1 className="text-5xl font-bold">User information</h1>
                </div>
                <div className='py-8'>
                    Username
                    <div className="relative mb-4 grid grid-cols-8 gap-5">

                        <input
                                type="text"
                                className="p-8 block w-full px-4 py-2 bg-gray-300 rounded-md text-center col-span-7"
                                placeholder="Username" // Placeholder shows current user's username if empty
                                value={username} // If user undefined, it should fallback to the above placeholder value\
                                disabled={true}
                            />
                        <button
                            onClick={() => openUnModal()}
                            className="bg-gray-500 rounded-lg p-4 text-2xl hover:bg-gray-300 col-span-1"
                            >
                            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-4.036a2.5 2.5 0 113.536 3.536L7.5 21H3v-4.5L16.732 3.732z" />
                            </svg>
                        </button>
                    </div>

                        Email 
                    <div className="relative mb-4 grid grid-cols-8 gap-5">
                        <input
                            type="text"
                            className="block w-full px-4 py-2 bg-gray-300 rounded-md text-center col-span-7"
                            placeholder="Email" // Placeholder shows current user's username if empty
                            value={user?.email || ""} // You can bind this to a state variable in React
                            disabled={true}
                        />
                        <button
                            onClick={() => openEmailModal()}
                            className="bg-gray-500 rounded-lg p-4 text-2xl hover:bg-gray-300 col-span-1"
                            >
                            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-4.036a2.5 2.5 0 113.536 3.536L7.5 21H3v-4.5L16.732 3.732z" />
                            </svg>
                        </button>
                    </div>
                    {isUsernameModalOpen && (
                            <EditUsernameModal onClose={closeUnModal} user={user} setUser={setUser}/>
                    )}
                    {isEmailModalOpen && (
                            <EditEmailModal onClose={closeEmailModal} user={user} setUser={setUser}/>
                    )}
                    {isPasswordModalOpen && (
                            <EditPasswordModal onClose={closePwModal} user={user} setUser={setUser}/>
                    )}
                </div>


            </div>

            <div className="grid grid-flow-row-dense grid-cols-11 justify-center mt-40 gap-4">

                <div className="col-span-4"></div>
                <button onClick={() => openPwModal()} className="bg-yellow text-black font-bold py-2 px-4 rounded-md">
                    Change Password
                </button>
                <div className="col-span-1"></div>
                <button className="bg-black text-white font-bold py-2 px-4 rounded-md">
                    Logout
                </button>
                <div className="col-span-4"></div>

            </div>

        </div>

    );
};

export default ProfilePage;