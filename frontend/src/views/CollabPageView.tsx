import { Difficulty, Question, Topic } from "@/models/Question";
import { useRef, useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { LANGUAGE_VERSIONS, CODE_SNIPPETS } from "../lib/CodeEditorUtil";
import * as monaco from "monaco-editor"; // for mount type (monaco.editor.IStandaloneCodeEditor)


const customQuestion: Question = {
	id: "q123",
	title: "Find the Longest Palindromic Substring",
	description:
		"Given a string `s`, return the longest palindromic substring in `s`. A palindromic substring is a substring that reads the same backward as forward.",
	topics: [
		Topic.Strings,
		Topic.DynamicProgramming,
		Topic.Algorithms,
		Topic.Strings,
		Topic.DynamicProgramming,
		Topic.Algorithms,
		Topic.Strings,
		Topic.DynamicProgramming,
		Topic.Algorithms,
	],
	difficulty: Difficulty.Medium,
	dateCreated: "2024-09-16T08:00:00Z",
	examples: [
		{
			input: "babad",
			output: "bab", // "aba" is also a valid answer
		},
		{
			input: "cbbd",
			output: "bb",
		},
	],
	constraints: [
		"1 <= s.length <= 1000",
		"s consist of only digits and English letters.",
	],
};

const CollabPageView: React.FC = () => {
	const [code, setCode] = useState("");
   	const [socket, setSocket] = useState<Socket | null>(null);
   	const [message, setMessage] = useState(""); // For new message input
   	const [messages, setMessages] = useState<{ username: string; message: string }[]>([]);
   	const [userId, setUserId] = useState<string>("");
   	const navigate = useNavigate();
   	const [questionData, setQuestionData] = useState<Question>(customQuestion);
   	const { sessionId: sessionIdObj } = useParams<{ sessionId: string }>();
	const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

	useEffect(() => {
		// Initialize the WebSocket connection when the component mounts
		const newSocket = io("http://localhost:5004"); // Backend WebSocket server URL
		setSocket(newSocket);
 
		newSocket.on("connect", () => {
			console.log("WebSocket connected");
			console.log("Emitting sessionJoined with sessionId:", sessionIdObj);
			newSocket.emit("sessionJoined", sessionIdObj );
		});
 
		newSocket.on('sessionData', ({ sessionIdObj, socketId, questionData }) => {
			sessionIdObj = sessionIdObj;
			// Set state with the received data
			setUserId(socketId);
			setQuestionData(questionData);
		});

		console.log("Current user ID:", userId);
 
 
		// Listen for code updates from the server
		newSocket.on("codeUpdated", (data) => {
			console.log("Code update received from server:", data);
			setCode(data.code);
		}); 

		newSocket.on('sessionTerminated', ({ userId }) => {
			console.log(`Session terminated by user with ID: ${userId}`);
			alert(`Session has been terminated by user ${userId}`);
			navigate("/questions"); // Redirect to questions page
		});
	

		newSocket.on("messageReceived", (data) => {
			setMessages((prevMessages) => [...prevMessages, { username: data.username, message: data.message },]);
		});

		return () => {
			newSocket.disconnect(); // Cleanup WebSocket connection on component unmount
		};
	}, []);

	const handleCodeChange = (newCode: string | undefined) => {
		if (newCode === undefined) return; // if not code, do nothing

		setCode(newCode); // Update the local state
 
 
		// Emit the code update to the WebSocket server
		if (socket) {
			console.log("Emitting code update:", newCode);
			socket.emit("codeUpdate", {
				sessionIdObj, // Example session ID
				code: newCode,
			});
		}
	};

	const handleMessageSend = () => {
		if (message.trim() && socket) {
			socket.emit("sendMessage", {
				sessionId: sessionIdObj,
				message: message.trim(),
				username: userId,
			});
			setMessage(""); // Clear the input field
		}
	};

	// Handle Quit Session button click
	const handleQuitSession = () => {
		if (socket) {
			socket.emit("terminateSession", sessionIdObj);
		  }
		navigate("/questions");
	}

	// Callback function to mount editor to auto-focus when page loads
	const onMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
		editorRef.current = editor;
		editor.focus();
	};

	const languages = Object.entries(LANGUAGE_VERSIONS); // get languages_version JSON
	const [selectedLang, setSelectedLang] = useState(languages[0][0]); // default to 'typescript'

	// function for separating language from version for neater display
	const getLangOnly = (langVer: string) => {
		const [language] = langVer.split(/(\d+)/);
		return language.trim();
	};

	const onSelect = (language: string) => {
		setSelectedLang(language);
		setCode(CODE_SNIPPETS[language]);
	};

	return (
		<main
			style={{
				height: "100vh",
				width: "100vw",
				display: "flex",
				flexDirection: "column",
			}}
		>
			{/* navigation menu */}
			<div
				style={{
					display: "inline-flex", // Allows the container to shrink to fit its content
					alignItems: "center", // Center vertically
					margin: "15px 0px 0px 7px", // Add some margin
				}}
			>
				<Button variant="link">
					<Home style={{ marginRight: "10px" }} />
					Homepage
				</Button>
				<div
					style={{
						height: "24px",
						width: "1px",
						backgroundColor: "lightgrey",
						margin: "0 10px",
					}}
				/>
				<Button variant="link" onClick={handleQuitSession}>
					Quit Session
				</Button>
			</div>

			{/* left side question box */}
			<div style={{ display: "flex", flex: 1 }}>
				<div
					style={{
						flex: 1, // Takes up equal space as the textarea
						display: "flex",
						flexDirection: "column", // Stacks the title and description vertically
						alignItems: "flex-start", // Aligns the title and description to the left
						padding: "20px",
						border: "2px solid lightgrey", // Adds a border
						borderRadius: "10px", // Rounds the corners
						margin: "15px 7.5px 15px 15px", // top right bottom left (clockwise)
					}}
				>
					{/* id & title */}
					<h2 style={{ fontSize: "2rem", fontWeight: "bold" }}>
						{questionData.title}
					</h2>

					{/* tags (difficulty & topics) */}
					<div
						style={{
							marginTop: "15px",
							marginBottom: "15px",
							display: "flex",
							flexWrap: "wrap",
							gap: "10px",
						}}
					>
						<Badge>{questionData.difficulty}</Badge>
						{questionData.topics.map((topic, index) => (
							<Badge key={index} variant="outline">
								{topic}
							</Badge>
						))}
					</div>

					{/* description */}
					<p>{questionData.description}</p>

					{/* examples */}
					<div style={{ marginTop: "35px" }}>
						{questionData.examples.map((example, index) => (
							<div key={index} style={{ marginBottom: "20px" }}>
								<p style={{ marginBottom: "10px" }}>
									<strong>Example {index + 1}:</strong>
								</p>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										gap: "10px",
									}}
								>
									<blockquote
										style={{
											paddingLeft: "10px",
											borderLeft: "5px solid #d0d7de",
										}}
									>
										<pre>
											<strong>Input:</strong> {example.input}
										</pre>
										<pre>
											<strong>Output:</strong> {example.output}
										</pre>
									</blockquote>
								</div>
							</div>
						))}

						{/* constraints */}
						<div style={{ marginTop: "35px" }}>
							<strong>Constraints:</strong>
							<ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
								{questionData.constraints.map((constraint, index) => (
									<li key={index}>{constraint}</li>
								))}
							</ul>
						</div>
					</div>
					{/* Chatbox */}
					<div
						style={{
							marginTop: "25px",
							width: "100%",
							border: "2px solid lightgrey",
							borderRadius: "10px",
							padding: "10px",
						}}
					>
						<h3 style={{ marginBottom: "10px", fontWeight: "bold" }}>Chat</h3>
						<div
							style={{
								height: "200px",
								overflowY: "scroll",
								border: "1px solid #d0d7de",
								borderRadius: "5px",
								padding: "10px",
								marginBottom: "10px",
								backgroundColor: "#f9f9f9",
							}}
						>
							{messages.map((msg, index) => (
								<p key={index} style={{ margin: "5px 0" }}>
									<strong>User {msg.username}:</strong> {msg.message}
								</p>
							))}
						</div>
						<div style={{ display: "flex", gap: "10px" }}>
							<Textarea
								style={{ flex: 1 }}
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								placeholder="Type your message here..."
							/>
							<Button onClick={handleMessageSend}>Send</Button>
						</div>
					</div>
				</div>

				{/* right side code editor */}
				<div
					style={{
						flex: 1, // Takes up equal space as the question section
						display: "flex",
						flexDirection: "column", // Stacks the label and textarea vertically
						justifyContent: "center", // Centers the textarea horizontally within its section
						alignItems: "center", // Centers the textarea vertically within its section
						border: "2px solid lightgrey", // Adds a border
						padding: "20px",
						borderRadius: "10px", // Rounds the corners
						margin: "15px 15px 15px 7.5px", // top right bottom left (clockwise)
					}}
				>
					{/* div to horizontally align <h2 Code/> and <Select coding language /> */}
					<div
						style={{
							display: "flex",
							flexDirection: "row", // align items horizontally
							justifyContent: "flex-start",
							alignItems: "center", // vertically center them
							width: "100%",
							marginBottom: "20px",
						}}
					>
						<h2
							style={{
								fontSize: "1.25rem",
								fontWeight: "bold",
								alignSelf: "flex-start",
								margin: "0 25px 0 5px",
							}}
						>
							Code
						</h2>

						{/* coding language selector */}
						<Select value={selectedLang} onValueChange={onSelect}>
							<SelectTrigger className="w-[160px]">
								<SelectValue>
									<span>{getLangOnly(selectedLang)}</span>
								</SelectValue>
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									{languages.map(([language, version]) => (
										<SelectItem key={language} value={language}>
											{language}
											<span style={{ color: "gray" }}>
												&nbsp;{String(version)}
											</span>
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>

					{/* monaco code editor */}
					<Editor
						height="100%"
						defaultValue={CODE_SNIPPETS[selectedLang]}
						value={code}
						language={selectedLang}
						onChange={(value) => handleCodeChange(value)}
						onMount={onMount} // Focus the editor when it mounts
					/>
				</div>
			</div>
		</main>
	);
}

export default CollabPageView;