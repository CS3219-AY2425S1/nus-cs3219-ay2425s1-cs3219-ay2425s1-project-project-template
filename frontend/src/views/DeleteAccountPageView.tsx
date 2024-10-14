import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { getAuth, signInWithEmailAndPassword, deleteUser } from "firebase/auth";
import "@/css/styles.css";

const DeleteAccountPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const navigate = useNavigate();
  const auth = getAuth(); // Initialize Firebase Auth

  const handleDeleteAccount = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setShowPopup(true);
  };

  const confirmDeletion = async () => {
    try {
      // Reauthenticate the user before deletion
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // If sign-in succeeds, delete the user
      if (userCredential.user) {
        await deleteUser(userCredential.user); // Delete the authenticated user
        sessionStorage.removeItem("authToken"); // Clear the token
        sessionStorage.removeItem("uid") // Clear the uid
        navigate("/"); // Redirect to home page after deletion
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <main className="delete-account-page flex justify-center items-center h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Delete Account</CardTitle>
        </CardHeader>
        <form onSubmit={handleDeleteAccount}>
          <CardContent>
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
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">Delete Account</Button>
          </CardFooter>
        </form>
        {error && <p className="error-message">{error}</p>}
        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-content">
              <p>
                Are you sure you want to delete your account? This action is
                irreversible.
              </p>
              <div className="popup-buttons">
                <Button onClick={confirmDeletion} variant="destructive">
                  Confirm Deletion
                </Button>
                <Button onClick={() => setShowPopup(false)}>Cancel</Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </main>
  );
};

export default DeleteAccountPage;
