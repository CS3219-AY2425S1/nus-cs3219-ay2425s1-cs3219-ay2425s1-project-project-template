import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css";
import signupGraphic from "../../assets/images/signup_graphic.png";

const Signup: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.data.accessToken);
        navigate("/login");
        alert("Signup successful");
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      setErrorMessage("Error during signup.");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-form">
          <h1>Join Us</h1>
          <p>
            Create an account to get unlimited access to practice questions.
          </p>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <form onSubmit={handleSignup}>
            <label htmlFor="username">Username*</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />

            <label htmlFor="email">Email address*</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
            />

            <label htmlFor="password">Password*</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />

            <label htmlFor="confirmPassword">Confirm Password*</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />

            <button type="submit" className="signup-button">
              Sign Up
            </button>
          </form>

          <p className="accountLogin">
            Have an account?{" "}
            <a href="/login" className="loginText">
              Log In
            </a>
          </p>
        </div>

        <div className="signup-graphic">
          <img src={signupGraphic}></img>
          <p className="signup-graphic-text">
            You can practice anytime, anywhere, and any situations!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function setErrorMessage(arg0: string) {
  throw new Error("Function not implemented.");
}
