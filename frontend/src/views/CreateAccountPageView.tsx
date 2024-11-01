import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "@/css/styles.css";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// firebase imports
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { addToUserCollection, doesUserExist } from "@/services/UserFunctions";
import { isValidUsername } from "@/lib/regex";

const CreateAccountPage: React.FC = () => {
	const [email, setEmail] = useState<string>("");
	const [newUsername, setNewUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [visible, setVisible] = useState<boolean>(false);
	const [alertIcon, setAlertIcon] = useState<boolean>(false);
	const [alertTitle, setAlertTitle] = useState<string>("");
	const [alertDescription, setAlertDescription] = useState<string>("");
	const navigate = useNavigate();

	const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault(); // prevent refresh
		if (!isValidUsername(newUsername)) {
			// Handle invalid username error
			setAlertIcon(false);
			setAlertTitle("Invalid Username");
			setAlertDescription("Username must be alphanumeric only.");
			setVisible(true);
			setTimeout(() => setVisible(false), 3000);
			return;
		}
		// create account on firebase
		try {
			const usernameExists = await doesUserExist(newUsername);

			if (usernameExists) {
				// If the username is taken, trigger an error to be caught in the catch block
				throw new Error("Username is already taken. Please choose a different one.");
			}

			const user = await createUserWithEmailAndPassword(auth, email, password);
			await addToUserCollection(user, newUsername);
			// show alert & redirect after 3s
			setAlertIcon(true);
			setAlertTitle("Account created successfully");
			setAlertDescription("Redirecting to login page...");
			setVisible(true);
			setTimeout(() => {
				navigate("/login");
			}, 3000);
		} catch (error) {
			if (error instanceof Error) {
				// display error message
				setAlertIcon(false);
				setAlertTitle("Error");
				setAlertDescription(error.message);
				setVisible(true);
				// hide alert after 3s
				setTimeout(() => {
					setVisible(false);
				}, 3000);
			}
		}
	};

	return (
		<main className="create-account-page">
			<div className="page-background">
				{visible && (
					<div
						style={{
							position: "fixed",
							left: "50%",
							transform: "translateX(-50%)",
							paddingTop: "10px",
						}}
					>
						<Alert>
							{alertIcon ? (
								<Check className="h-4 w-4" />
							) : (
								<X className="h-4 w-4" />
							)}
							<AlertTitle>{alertTitle}</AlertTitle>
							<AlertDescription>{alertDescription}</AlertDescription>
						</Alert>
					</div>
				)}
				<div className="center-container">
					<Card className="w-[350px]">
						<CardHeader>
							<CardTitle>Create an account</CardTitle>
						</CardHeader>
						<form onSubmit={handleLogin}>
							<CardContent>
								<div className="grid w-full items-center gap-4">
									<div className="flex flex-col space-y-1.5">
										<Label htmlFor="username">Username</Label>
										<Input
											id="username"
											type="text"
											placeholder="Username"
											onChange={(e) => setNewUsername(e.target.value)}
											required
										/>
									</div>
									<div className="flex flex-col space-y-1.5">
										<Label htmlFor="email">Email</Label>
										<Input
											id="email"
											type="email" // validates email format
											placeholder="name@example.com"
											onChange={(e) => setEmail(e.target.value)}
											required
										/>
									</div>
									<div className="flex flex-col space-y-1.5">
										<Label htmlFor="password">Password</Label>
										<Input
											id="password"
											type="password" // hides text and shows dots
											placeholder="Password"
											onChange={(e) => setPassword(e.target.value)}
											required
										/>
									</div>
								</div>
							</CardContent>
							<CardFooter className="flex justify-end">
								<Button>Create Account</Button>
							</CardFooter>
						</form>
					</Card>
				</div>
			</div>
		</main>
	);
};

export default CreateAccountPage;
