import { useState } from "react"
import { Editor } from "@monaco-editor/react"
import "../../styles/code-editor.css"

const CodeEditor = ({ language, onMount }) => {
    const [value, setValue] = useState("");

    return (
        <div className="editor-container">
            <Editor
                theme="vs-light"
                defaultLanguage="python"
                language={language}
                onMount={onMount}
                defaultValue="// some comment pr"
                value={value}
                onChange={(value) => setValue(value)}
                options={{
                    fontSize: 16,
                    scrollBeyondLastLine: false,
                    minimap: { enabled: false }
                }}
            />
        </div>
    )
}

export default CodeEditor