import React, { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Editor from '@monaco-editor/react';
import LanguageSelector from './languageSelector';
import { CODE_SNIPPETS } from './languageSelector';
import Stack from '@mui/material/Stack';
import Output from './console';

const CodeEditor = () => {
    const editorRef = useRef();
    const [value, setValue] = useState("");
    const [language, setLanguage] = useState("javascript");

    const onMount = (editor: any) => {
        editorRef.current = editor;
        editor.focus();
    }
    const onSelect = (language:string) => {
        setLanguage(language);
        setValue(CODE_SNIPPETS[language]);
      };

    return (
        <Box height="100%" width="100%">
            <Stack direction="column" spacing={1} height="100%" width="100%">
            <LanguageSelector language={language} onSelect={onSelect} />
            <Editor
                    options={{
                        minimap: {
                            enabled: false,
                        },
                        }}
                    height="70%"
                    width="100%"
                    theme="vs-dark"
                    defaultLanguage="javascript"
                    defaultValue={CODE_SNIPPETS[language]}
                    onMount={onMount}
                    value={value}
                    onChange={(value) => {
                        if (value !== undefined) {
                            setValue(value);
                        }
                    }}
                />
            <Output editorRef={editorRef} language={language} />
            </Stack>
        </Box>
    );
}

export default CodeEditor;