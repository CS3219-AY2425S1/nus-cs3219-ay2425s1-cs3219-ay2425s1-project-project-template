import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
// import { Link } from "react-router-dom";
import { User } from '../../types/User.tsx';
import useUpdateUser from '../../hooks/useUpdateUser.tsx';
import ErrorModal from '../Dashboard/ErrorModals/ErrorModal.tsx';

interface EditPasswordModalProps {
    onClose: () => void;
    setUser: Dispatch<SetStateAction<User | undefined>>
    user: User | undefined;
}

const EditPasswordModal: React.FC<EditPasswordModalProps> = ({
    onClose, setUser, user
}) => {

    const [newPassword, setNewPassword] = useState<string | undefined>(undefined);
    const [cfmPassword, setCfmPassword] = useState<string | undefined>(undefined);
    const [err, setErr] = useState<string | undefined>(undefined);
    const [success, setSuccess] = useState<boolean| undefined>(false);

    const [isErrorModalOpen, setErrorModalOpen] = useState(false);
    const openErrorModal = () => setErrorModalOpen(true);
    const closeErrorModal = () => {setErrorModalOpen(false)
        onClose();
    };

    useEffect(() => {
        if (err) {
            openErrorModal();
        }
    }, [err]);

    useEffect(() => {
        if (success) {
            onClose();
        }
    }, [success]);

    const handleInputChangeFirst = (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewPassword(event.target.value); // Update the local state with the input value
    };
    const handleInputChangeSecond = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCfmPassword(event.target.value); // Update the local state with the input value
      };
    const { updateUser, loading } = useUpdateUser(user?.id || "", "password");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent default form submission
        if (newPassword && newPassword == cfmPassword) {
            console.log("updating username to:",newPassword);
            await updateUser(newPassword, setUser, setErr, setSuccess); // Call the custom hook function
        }
    };
    return (
        <div 
        id = "editUsernameModal"
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 text-black"
        >
                <div className="bg-off-white rounded-lg p-4 w-1/5 h-1/2 fade-in modal-context z-50">
                    <div className='mb-10'>
                        <h1><b>Change password</b></h1>
                        Type in your new password and click "Confirm" to change.
                    </div>
                    <form className="relative mb-8">
                        New Password
                        <input
                                type="password"
                                className="p-8 block w-full px-4 py-2 bg-white rounded-md text-center"
                                placeholder="Type your new password" // Placeholder shows current user's username if empty
                                value={newPassword} // If user undefined, it should fallback to the above placeholder value
                                onChange={handleInputChangeFirst}
                            />
                    </form>

                    <form onSubmit={handleSubmit} className="relative mb-8">
                        Retype new password
                        <input
                                type="password"
                                className="p-8 block w-full px-4 py-2 bg-white rounded-md text-center"
                                placeholder="Retype your new password" // Placeholder shows current user's username if empty
                                value={cfmPassword} // If user undefined, it should fallback to the above placeholder value
                                onChange={handleInputChangeSecond} // Capture the input for editing
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
                    {isErrorModalOpen && (
                            <ErrorModal onClose={closeErrorModal} error={err}/>
                    )}
                    </form>
                </div>
        </div>

    );
  }


export default EditPasswordModal;
