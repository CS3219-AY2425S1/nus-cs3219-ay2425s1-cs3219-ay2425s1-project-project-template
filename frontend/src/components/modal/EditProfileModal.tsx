import { useState } from 'react';
import { Modal, TextInput, Button, Text } from '@mantine/core';
import { useAuth } from '../../hooks/AuthProvider'; // Adjust the path as needed

interface EditProfileModalProps {
  isEditProfileModalOpen: boolean;
  closeEditProfileModal: () => void;
  initialUsername: string;
}

function EditProfileModal({
  isEditProfileModalOpen,
  closeEditProfileModal,
  initialUsername,
}: EditProfileModalProps) {
  const [username, setUsername] = useState(initialUsername);
  const [password, setPassword] = useState('');
  const [editProfileError, setEditProfileError] = useState<string | null>(null);

  const auth = useAuth();

  const handleSaveChanges = async () => {
    try {
      const updatedProfileData = { username, password }; 
      await auth.updateProfileAction(updatedProfileData, setEditProfileError);
      setEditProfileError(null);
      closeEditProfileModal(); 
    } catch (error) {
      console.error('Error saving profile changes:', error);
    }
  };

  return (
    <Modal opened={isEditProfileModalOpen} onClose={closeEditProfileModal} title="Edit Profile">
      <TextInput
        label="Username"
        value={username}
        onChange={(event) => setUsername(event.currentTarget.value)}
      />
      <TextInput
        label="New Password"
        type="password"
        placeholder="Leave empty to keep the same"
        onChange={(event) => setPassword(event.currentTarget.value)}
      />
      <Button onClick={handleSaveChanges}>Save Changes</Button>
      {editProfileError && <Text>{editProfileError}</Text>}
    </Modal>
  );
};

export default EditProfileModal;