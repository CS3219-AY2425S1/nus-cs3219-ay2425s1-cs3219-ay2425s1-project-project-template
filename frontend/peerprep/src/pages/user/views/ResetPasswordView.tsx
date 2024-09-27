import React, { useState } from 'react';
import InputBox from '../../../components/InputBox';
import LargeButton from '../../../components/SubmitButton';
import logo from '/peerprep_logo.png';

interface ResetPasswordViewProps {
  onSubmit: (newPassword: string) => void;
  errorMessage?: string;
}

const ResetPasswordView: React.FC<ResetPasswordViewProps> = ({ onSubmit, errorMessage }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if passwords match
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match!");
      return;
    }

    setPasswordError(null); // Clear error if passwords match
    onSubmit(password);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-[#1D004E] to-[#141A67]">
      <div className="flex justify-center items-center p-2 mb-5">
        <img src={logo} alt="Peerprep Logo" className="w-20 h-20" />
        <span className="text-6xl text-white">PeerPrep</span>
      </div>
      <div className="bg-white bg-opacity-10 p-10 rounded-lg backdrop-blur-md text-center w-[350px] max-w-full mx-auto">
        <h2 className="text-white text-2xl font-semibold mb-4">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <InputBox
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isPassword={true}
          />
          <InputBox
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            isPassword={true}
          />
          <LargeButton text="Reset Password" onClick={handleSubmit} />
        </form>
        
        {/* Display password mismatch error */}
        {passwordError && <div className="text-red-500 mt-4">{passwordError}</div>}

        {/* Display general error message */}
        {errorMessage && <div className="text-red-500 mt-4">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default ResetPasswordView;
