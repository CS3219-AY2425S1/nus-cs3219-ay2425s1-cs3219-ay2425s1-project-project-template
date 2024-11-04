import React, { useContext, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Editor from '@monaco-editor/react';
import LanguageSelector from './languageSelector';
import { CODE_SNIPPETS } from './languageSelector';
import Stack from '@mui/material/Stack';
import Output from './console';
import { useSocket } from '../../contexts/SocketContext';
import { useNavigate, useParams } from 'react-router-dom';

const CodeEditor = ({ qid }: { qid: Number }) => {
    const { roomId } = useParams();
    const { collabSocket } = useSocket();
    const editorRef = useRef();
    const [value, setValue] = useState("");
    const [language, setLanguage] = useState("python");
    const navigate = useNavigate();

    const onMount = (editor: any) => {
        editorRef.current = editor;
        editor.focus();
    }
    const onSelect = (language: string) => {
        setLanguage(language);
        setValue(CODE_SNIPPETS[language]);
        collabSocket?.emit("language-change", roomId, language);
    };

    useEffect(() => {
        if (!collabSocket) {
            return;
        }

        // if (!collabSocket.connected) {
        //     collabSocket.connect();
        // }

        collabSocket.on("sync-code", (edittedCode: string) => {
            console.log("to sync");
            setValue(edittedCode);
        });

        collabSocket.on("sync-language", (language: string) => {
            setLanguage(language);
            setValue(CODE_SNIPPETS[language]);
        });

        return () => {
            if (collabSocket && collabSocket!.connected) {
                collabSocket.removeAllListeners();
                collabSocket.disconnect();
            }
        }

    }, [collabSocket])

    return (
        <Box height="80vh" width="100%">
            <Stack direction="column" spacing={1} height="100%" width="100%">
                <LanguageSelector language={language} onSelect={onSelect} />
                <Editor
                    options={{
                        minimap: {
                            enabled: false,
                        },
                    }}
                    height="100vh"
                    width="100%"
                    theme="vs-dark"
                    defaultLanguage={language}
                    defaultValue={CODE_SNIPPETS[language]}
                    language={language.toLowerCase()}
                    onMount={onMount}
                    value={value}
                    onChange={(value) => {
                        if (value !== undefined) {
                            setValue(value);
                            collabSocket!.emit("edit-code", roomId, value);
                        }
                    }}
                />
                <Output editorRef={editorRef} language={language} qid={qid} />
            </Stack>
        </Box>
    );
}

export default CodeEditor;
