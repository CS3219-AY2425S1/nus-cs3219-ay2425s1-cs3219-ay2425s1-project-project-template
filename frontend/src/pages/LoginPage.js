import React, { useState } from 'react';
import { userLogin } from '../services/userService';
import '.././index.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic for login (e.g., API call)
    console.log('Logging in with:', { email, password });
    userLogin(email, password)
      .then((token) => {
        console.log('Logged in successfully:', token);
      })
      .catch((error) => {
        console.error('Login failed:', error);
      });
  };

  return (
    <div className="h-[calc(100vh-65px)] w-full bg-neutral flex flex-col justify-center items-center">

      <form onSubmit={handleSubmit} className="flex-grow flex flex-col w-full bg-[#1a1a1a] gap-4 items-center pt-5">
        <h2 className="w-full text-center text-white text-4xl font-bold">
            Log In
        </h2>
        {/* Email Input */}
        <div className="form-control flex flex-col w-full max-w-lg bg-transparent no-border items-center">
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered w-full max-w-lg bg-[#1a1a1a] text-white border-[#5b5b5b] placeholder:text-[#a6a6a6]"
            placeholder="Email or username"
            required
          />
        </div>

        {/* Password Input */}
        <div className="form-control flex flex-col w-full max-w-lg bg-transparent no-border items-center">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered w-full max-w-lg bg-[#1a1a1a] text-white border-[#5b5b5b] placeholder:text-[#a6a6a6]"
            placeholder="Password"
            required
          />
        </div>

        {/* Forgot Password */}
        <div className="text-right">
          <span className="text-[#90a9fd] cursor-pointer hover:text-[#b0c4de] transition-colors">
            Forgot password?
          </span>
        </div>

        {/* Sign Up */}
        <div className="flex justify-center items-center gap-2">
          <span className="text-white">New to the app?</span>
          <span className="text-[#90a9fd] cursor-pointer hover:text-[#b0c4de] transition-colors">
            Sign up
          </span>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center w-full">
          <button type="submit" className="btn btn-primary w-full max-w-lg bg-[#282828] hover:bg-[#404040]">
            Log In
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
