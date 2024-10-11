import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
// import { Link } from "react-router-dom";
import { User } from '../../types/User.tsx';
import useUpdateUsername from '../../hooks/useUpdateUsername.tsx';

interface EditUsernameModalProps {
    onClose: () => void;
    setUser: Dispatch<SetStateAction<User | undefined>>
    user: User | undefined;
}

const EditUsernameModal: React.FC<EditUsernameModalProps> = ({
    onClose, setUser, user
}) => {

    const [username, setUsername] = useState<string | undefined>(undefined);
    const [newUsername, setNewUsername] = useState<string | undefined>(undefined);


    useEffect(() => {
        setUsername(user?.username);
      }, [user]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewUsername(event.target.value); // Update the local state with the input value
    };
    const { updateUsername, loading } = useUpdateUsername(user?.id || "");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent default form submission
        if (newUsername) {
            console.log("updating username to:",newUsername);
            await updateUsername(newUsername, setUser); // Call the custom hook function
            onClose();
        }
    };
    return (
        <div 
        id = "editUsernameModal"
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 text-black"
        >
                <div className="bg-off-white rounded-lg p-4 w-1/5 h-1/2 fade-in modal-context z-50">
                    <div className='mb-10'>
                        <h1><b>Change username</b></h1>
                        Type in your new username and click "Confirm" to change.
                    </div>
                    <form className="relative mb-8">
                        Old Username
                        <input
                                type="text"
                                className="p-8 block w-full px-4 py-2 bg-gray-300 rounded-md text-center"
                                placeholder="Username" // Placeholder shows current user's username if empty
                                value={username} // If user undefined, it should fallback to the above placeholder value
                                disabled={true}
                            />
                    </form>

                    <form onSubmit={handleSubmit} className="relative mb-8">
                        New Username
                        <input
                                type="text"
                                className="p-8 block w-full px-4 py-2 bg-white rounded-md text-center"
                                placeholder="Username" // Placeholder shows current user's username if empty
                                value={newUsername} // If user undefined, it should fallback to the above placeholder value
                                onChange={handleInputChange} // Capture the input for editing
                            />

                    <div className='flex gap-10 justify-center mt-20'>
                        <button 
                            type="submit"
                            className="rounded-lg px-4 py-1.5 bg-green text-white  hover:bg-emerald-500" 
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Confirm'}
                        </button>
                        <button
                            onClick={onClose}
                            id="submit"
                            className="rounded-lg px-4 py-1.5 bg-red-500  text-white text-lg hover:bg-red-400"
                        >
                            Cancel
                        </button>
                    </div>
                    </form>
                </div>
        </div>

    );
  }


export default EditUsernameModal;
