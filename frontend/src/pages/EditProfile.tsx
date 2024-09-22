import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import Header from "../components/Header";
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile } from '../api/userApi';

const EditProfile: React.FC = () => {
  const { user, token, setUser } = useAuth();
  const navigate = useNavigate();

  const [username, setusername] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [error, setError] = useState('');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) {
        setError('User is not logged in.');
        return;
      }

    try {
      const response = await updateUserProfile(token, user.id, { username, email });
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      const res = await response.json();
        console.log(res.data)
      // Update user in context
      setUser({
        ...res.data,
        name: res.data.username // Rename `username` to `name`
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="sm">
        <Box mt={4}>
          <Typography variant="h4" gutterBottom>
            Edit Profile
          </Typography>
          <form onSubmit={handleUpdateProfile}>
            <TextField
              label="username"
              variant="outlined"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setusername(e.target.value)}
            />
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error && (
              <Typography color="error" variant="body2" gutterBottom>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Save Changes
            </Button>
          </form>
        </Box>
      </Container>
    </>
  );
};

export default EditProfile;
