import { useRef, useState } from "react"
import { Box, VStack, HStack } from "@chakra-ui/react"
import { Editor } from "@monaco-editor/react"
import { CODE_SNIPPETS } from "../constants.js"
import LanguageSelector from "./LanguageSelector.jsx"
import  Output  from "./Output.jsx"

const CodeEditor = () => {
    const editorRef = useRef();
    const [value, setValue] = useState("");
    const [language, setLanguage] = useState("javascript");

    const onMount = (editor) => {
        editorRef.current = editor;
        editor.focus();
    };

    const onSelect = (language) => {
        setLanguage(language);
        setValue(
            CODE_SNIPPETS[language] 
        );
    };

    return (
        <Box>
            <HStack spacing={4}>
                <Box w="50%">
                    <LanguageSelector language={language} onSelect={onSelect}/>
                    <Editor 
                        height="75vh" 
                        width={"100%"}
                        theme="vs-dark"
                        language={language} 
                        defaultValue={CODE_SNIPPETS[language]}
                        onMount={onMount}
                        value={value}
                        onChange={(value) => setValue(value)}
                    />
                </Box>
                <Output editorRef={editorRef} language={language}/>
            </HStack>
        </Box>
    )
}

export default CodeEditor;