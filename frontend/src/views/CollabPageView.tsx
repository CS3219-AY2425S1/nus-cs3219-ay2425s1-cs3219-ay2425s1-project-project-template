import { Difficulty, Question, Topic } from "@/models/Question";
import { useRef, useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
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
const collabServiceBackendURL =
	import.meta.env.COLLAB_SERVICE_BACKEND_URL || "http://localhost:5004";
import { Loader2 } from "lucide-react";

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
	const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

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

	const [codeOutput, setCodeOutput] = useState(null);
	const [isLoading, setIsLoading] = useState(false); // while executing code, show loading spinner animation
	const [isError, setIsError] = useState(false); // highlight output in red if code has an error
	const CODE_EXECUTED_SUCCESSFULLY = 0;

	const runCode = async () => {
		const sourceCode = editorRef.current?.getValue() || "";

		if (!sourceCode) return; // do nothing

		try {
			setIsLoading(true);

			const executeFunctionName = "execute-code";
			const executeCodeURL = `${collabServiceBackendURL}/${executeFunctionName}`;

			const response = await fetch(executeCodeURL, {
				method: "POST",
				headers: {
					"Content-Type": "application/json", // Send content type to JSON
				},
				body: JSON.stringify({
					language: selectedLang,
					code: sourceCode,
					langVer: LANGUAGE_VERSIONS,
				}),
			});

			const jsonData = await response.json();
			setCodeOutput(jsonData.run.output);
			jsonData.run.code !== CODE_EXECUTED_SUCCESSFULLY ? setIsError(true) : setIsError(false);
		} catch (error) {
			alert(error);
		} finally {
			setIsLoading(false);
		}
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

			{/* main page content */}
			<div
				style={{
					display: "flex", // Create a horizontal layout
					height: "100vh", // Full height of the viewport
					overflow: "auto", // Add scrollbars when content overflows
				}}
			>
				{/* left side question box */}
				<div
					style={{
						flexBasis: "50%", // Takes up 50% of the width
						flexDirection: "column", // Stacks the title and description vertically
						alignItems: "flex-start", // Aligns the title and description to the left
						padding: "20px",
						border: "2px solid lightgrey", // Adds a border
						borderRadius: "10px", // Rounds the corners
						margin: "15px 7.5px 15px 15px", // top right bottom left (clockwise)
						width: "50%",
						overflow: "auto", // Add scrollbars when content overflows
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

				{/* right side */}
				<div
					style={{
						flexBasis: "50%", // Takes up 50% of the width
						display: "flex", // Create a vertical layout inside the right half
						flexDirection: "column", // Stack the top and bottom halves vertically
						marginLeft: "7.5px",
						width: "50%",
					}}
				>
					{/* top-right side code editor */}
					<div
						style={{
							flex: 6, // Takes up 60% vertically of the right side
							display: "flex",
							flexDirection: "column", // Stacks the label and textarea vertically
							justifyContent: "center", // Centers the textarea horizontally within its section
							alignItems: "center", // Centers the textarea vertically within its section
							border: "2px solid lightgrey", // Adds a border
							padding: "20px",
							borderRadius: "10px", // Rounds the corners
							margin: "15px 15px 15px 0px", // top right bottom left (clockwise)
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

					{/* bottom-right side output terminal */}
					<div
						style={{
							flex: 4, // takes up 40% vertically of the right side
							border: "2px solid lightgrey", // Add a border around the right bottom half
							padding: "15px",
							borderRadius: "10px", // Rounds the corners
							margin: "0px 15px 15px 0px", // top right bottom left (clockwise)
							position: "relative",
						}}
					>
						<h2 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
							Output Terminal
						</h2>
						<Textarea
							style={{
								marginTop: "10px",
								height: "60%",
								border: isError ? "1px solid red" : "",
								color: isError ? "red" : "",
							}}
							value={
								codeOutput
									? codeOutput
									: 'Click "Run Code" to see the output here'
							}
							readOnly
						/>

						<Button
							style={{
								position: "absolute", // Position the Button absolutely inside the parent
								bottom: "5%", // 5% from the bottom
								right: "2%", // 2% from the right
							}}
							onClick={runCode}
							disabled={isLoading}
						>
							{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Run Code
						</Button>
					</div>
				</div>
			</div>
		</main>
	);
}

export default CollabPageView;
