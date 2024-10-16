import { Difficulty, Question, Topic } from "@/models/Question";
import { useRef, useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Editor from "@monaco-editor/react";

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

function CollabPageView() {
	const [code, setCode] = useState("");
	const [socket, setSocket] = useState<Socket | null>(null);
	const editorRef = useRef();

	useEffect(() => {
		// Initialize the WebSocket connection when the component mounts
		const newSocket = io("http://localhost:5004"); // Backend WebSocket server URL
		setSocket(newSocket);

		newSocket.on("connect", () => {
			console.log("WebSocket connected");
			newSocket.emit("joinSession", "session123");
		});

		// Listen for code updates from the server
		newSocket.on("codeUpdated", (data) => {
			console.log("Code update received from server:", data);
			setCode(data.code);
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
				sessionId: "session123", // Example session ID
				code: newCode,
			});
		}
	};

	// Callback function to mount editor to auto-focus when page loads
	const onMount = (editor) => {
		editorRef.current = editor;
		editor.focus();
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
				<Button variant="link">Quit Session</Button>
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
						{customQuestion.title}
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
						<Badge>{customQuestion.difficulty}</Badge>
						{customQuestion.topics.map((topic, index) => (
							<Badge key={index} variant="outline">
								{topic}
							</Badge>
						))}
					</div>

					{/* description */}
					<p>{customQuestion.description}</p>

					{/* examples */}
					<div style={{ marginTop: "35px" }}>
						{customQuestion.examples.map((example, index) => (
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
								{customQuestion.constraints.map((constraint, index) => (
									<li key={index}>{constraint}</li>
								))}
							</ul>
						</div>
					</div>
				</div>

				{/* right side textarea */}
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
					<h2
						style={{
							fontSize: "1.25rem",
							fontWeight: "bold",
							alignSelf: "flex-start",
							marginBottom: "10px",
						}}
					>
						Code
					</h2>
					<Editor
						height="100%"
						defaultLanguage="javascript"
						defaultValue="// some comment"
						value={code}
						onChange={(value) => handleCodeChange(value)}
						onMount={onMount} // Focus the editor when it mounts
					/>
				</div>
			</div>
		</main>
	);
}

export default CollabPageView;
