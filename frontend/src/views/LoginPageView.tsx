import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebaseConfig"; // Adjust the path if necessary
import { signInWithEmailAndPassword } from "firebase/auth";
import "@/css/styles.css"; // Adjust the path if necessary
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import profileIcon from "@/assets/profile.png";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false); // State to control dropdown visibility
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Login attempted"); 

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const idToken = await userCredential.user.getIdToken();
      const uid = userCredential.user.uid;

      sessionStorage.setItem("authToken", idToken);
      sessionStorage.setItem("uid", uid);
 
      navigate("/questions");
    } catch {
      setError("Login failed. Please check your credentials.");
    }
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setShowDropdown(false);
  };

  return (
    <main className="login-page">
      <div className="profile-icon-container">
        <img
          src={profileIcon}
          alt="Profile"
          className="profile-icon"
          onClick={toggleDropdown}
        />
        {showDropdown && (
          <div className="dropdown-menu">
            <Button
              variant="ghost"
              className="w-full text-left"
              onClick={() => handleNavigation("/create-account")}
            >
              Create Account
            </Button>
            <Button
              variant="ghost"
              className="w-full text-left"
              onClick={() => handleNavigation("/login")}
            >
              Login
            </Button>
            <Button
              variant="ghost"
              className="w-full text-left text-red-500"
              onClick={() => handleNavigation("/delete-account")}
            >
              Delete Account
            </Button>
          </div>
        )}
      </div>

      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription className="flex justify-between items-center">
            Don’t have an account?
            <Button
              className="sign-up-button"
              variant="link"
              onClick={() => navigate("/create-account")}
            >
              Sign up here!
            </Button>
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="drop-shadow-none">
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="e.g. user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  placeholder="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <div className="error-message">{error}</div>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="submit">Login</Button>
            <Button
              variant="outline"
              onClick={() => navigate("/forgot-password")}
            >
              Forget Password
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
};

export default LoginPage;
