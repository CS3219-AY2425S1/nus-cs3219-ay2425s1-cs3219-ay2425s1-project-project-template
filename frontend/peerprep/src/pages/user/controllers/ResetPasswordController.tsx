import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from '../authService';
import ResetPasswordView from '../views/ResetPasswordView';

const ResetPasswordController: React.FC = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = async (newPassword: string) => {
    try {
      await resetPassword(newPassword);
      setMessage('Password reset successfully');
      navigate("/login")
    } catch (error: any) {
        setMessage(error || "Password is invalid");
    }
  };

  return (
    <ResetPasswordView 
      onSubmit={handleSubmit} 
      errorMessage={message}
    />
  );
};

export default ResetPasswordController;