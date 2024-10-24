import { useRef, useState, useEffect } from "react";
import { Box, VStack, HStack } from "@chakra-ui/react";
import { Editor, OnMount } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import Output from "./Output";
import * as Y from 'yjs';
import { MonacoBinding } from 'y-monaco';
import { socket } from '../../app/api/services/sessionSocketService';
import { SupportedLanguages } from "../../utils/utils";

interface CodeEditorProps {}

const CodeEditor: React.FC<CodeEditorProps> = () => {
    const doc = new Y.Doc();
    const yText = doc.getText('code');
    const editorRef = useRef<any>(null);
    const [value, setValue] = useState<string>("");
    
    
    
    const [language, setLanguage] = useState<SupportedLanguages>("javascript" as SupportedLanguages);
    const userChangeRef = useRef<boolean>(false); // Flag to prevent infinite loop by tracking user-initiated changes

    const onMount: OnMount = (editor) => {
        editorRef.current = editor;
        const model = editor.getModel();
        if (model) {
            const binding = new MonacoBinding(yText, model, new Set([editor]));
        }
        // due to the binding above, on update of editor, yText updates, and the doc is also updated
        // so we can listen to changes in doc and emit them to the server
        doc.on('update', (update: Uint8Array) => {
            // Edits are handled here
            console.log("update", update);
            socket.emit('update', update);
        });
    };

    const onSelect = (language: SupportedLanguages) => {
        setLanguage(language);

        console.log("language selected");

        // Emit the selected language and code snippet to the server
        socket.emit('selectLanguage', language);
    };

    useEffect(() => {
        socket.on('initialData', (data: any) => {
            const { sessionData } = data;
            const {
                questionDescription,
                questionTemplateCode,
                questionTestcases,
                yDocUpdate,
                partnerJoined
            } = sessionData;

            // After Uint8Array is sent through a socket, it reverts to a buffer
            Y.applyUpdate(doc, new Uint8Array(yDocUpdate));
        });

        socket.on('updateContent', (update: any) => {
            console.log("updateContent", update);
            update = new Uint8Array(update);
            Y.applyUpdate(doc, update);
        });

        socket.on('updateLanguage', (updatedLanguage: string) => {
            setLanguage(updatedLanguage as SupportedLanguages);
        });

        return () => {
            socket.off('updateContent');
            socket.off('updateLanguage');
        };
    }, []); // Add an empty dependency array to ensure this effect runs only once

    return (
        <Box>
            <HStack spacing={4}>
                <Box w="50%">
                    <LanguageSelector language={language} onSelect={onSelect} />
                    <Editor
                        height="75vh"
                        width={"100%"}
                        theme="vs-dark"
                        language={language}
                        onMount={onMount}
                        value={value}
                    />
                </Box>
                <Output editorRef={editorRef} language={language} />
            </HStack>
        </Box>
    );
};

export default CodeEditor;
