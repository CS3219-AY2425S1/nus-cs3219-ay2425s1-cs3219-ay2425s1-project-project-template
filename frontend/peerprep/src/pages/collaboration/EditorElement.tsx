import React, { useEffect, useState } from "react";
import CodeMirror from '@uiw/react-codemirror';
import { langs } from '@uiw/codemirror-extensions-langs';
import { basicSetup } from '@uiw/codemirror-extensions-basic-setup';
import { indentUnit } from '@codemirror/language';

import { type Socket } from "socket.io-client";
import { getDocument, peerExtension } from "./collabController";

type Mode = 'light' | 'dark';

type Props = {
	socket: Socket;
	className?: string;
}

const EditorElement: React.FC<Props> = ({ socket, className }) => {
	const [connected, setConnected] = useState(false);
	const [version, setVersion] = useState<number | null>(null);
	const [doc, setDoc] = useState<string | null>(null);
	const [mode, setMode] = useState<Mode>(
		window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
	);

	useEffect(() => {
		// Fetch the document version and content on mount
		const fetchDocument = async () => {
			try {
				const { version, doc } = await getDocument(socket);
				setVersion(version);
				setDoc(doc.toString());
			} catch (error) {
				console.error("Error fetching document:", error);
			}
		};
		fetchDocument();

		// Set up socket event listeners
		const handleConnect = () => setConnected(true);
		const handleDisconnect = () => setConnected(false);

		socket.on('connect', handleConnect);
		socket.on('disconnect', handleDisconnect);

		// Listen for theme changes
		const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const handleModeChange = (event: MediaQueryListEvent) => {
			setMode(event.matches ? 'dark' : 'light');
		};
		darkModeMediaQuery.addEventListener('change', handleModeChange);

		// Clean up event listeners on unmount
		return () => {
			socket.off('connect', handleConnect);
			socket.off('disconnect', handleDisconnect);
			darkModeMediaQuery.removeEventListener('change', handleModeChange);
		};
	}, [socket]);

	return version !== null && doc !== null ? (
		<CodeMirror
			className={`flex-1 overflow-scroll text-left ${className}`}
			height="100%"
			basicSetup={false}
			id="codeEditor"
			theme={mode}
			extensions={[
				indentUnit.of("\t"),
				basicSetup(),
				langs.c(),
				peerExtension(socket, version)
			]}
			value={doc}
		/>
	) : (
		<span>Loading...</span>
	);
};

export default EditorElement;