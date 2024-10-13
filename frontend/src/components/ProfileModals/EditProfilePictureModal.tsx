import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
import useUploadProfilePicture from '../../hooks/useUploadProfilePicture.tsx';
import ErrorModal from '../Dashboard/ErrorModals/ErrorModal.tsx';

interface EditProfilePictureModalProps {
    onClose: () => void;
    uid : string;
    setImageData : Dispatch<SetStateAction<string>>;
}

const EditProfilePictureModal: React.FC<EditProfilePictureModalProps> = ({
    onClose, uid, setImageData
}) => {

    const [file, setFile] = useState<File | null>(null); // State to store the uploaded file

    const [err, setErr] = useState<string | undefined>(undefined);
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

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
        setFile(event.target.files[0]); // Store the selected file
        }
    };

    const uploadImage = async (userId: string, newImage: File | null, setImageData: Dispatch<SetStateAction<string>>) => {
        if (newImage != null)
            useUploadProfilePicture(userId, newImage, setImageData, setErr);
    };




    return (
        <div 
        id = "editProfilePictureModal"
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 text-black"
        >
            <div className="bg-off-white rounded-lg p-12 w-1/4 h-1/3 fade-in modal-context z-50">
                {/* Browser and Upload image button */}
                <div className='p-1'>
                    <input type="file" className='w-full' onChange={handleFileChange} />
                </div>
                <div className='grid justify-center mt-5'>
                <button 
                className = {`rounded-full ${file ? 'bg-green' : 'bg-gray-400' } p-2`}
                
                disabled={!file}
                onClick={() => uploadImage(uid, file, setImageData)}>
                    Upload Image
                </button>
                </div>

                <div className='flex gap-10 justify-center mt-20'>
                    <button
                        onClick={onClose}
                        id="submit"
                        className="rounded-lg px-4 py-1.5 bg-red-500  text-white text-lg hover:bg-red-400"
                    >
                        Close window
                    </button>
                </div>
                {isErrorModalOpen && (
                        <ErrorModal onClose={closeErrorModal} error={err}/>
                )}
            </div>
        </div>
        
    );
  }


export default EditProfilePictureModal;
