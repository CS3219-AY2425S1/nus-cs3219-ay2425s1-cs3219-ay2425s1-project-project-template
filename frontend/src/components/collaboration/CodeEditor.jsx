import { useState } from "react"
import { Editor } from "@monaco-editor/react"

const CodeEditor = ({ language, onMount }) => {
    const [value, setValue] = useState("");

    return (
        <div style={{ flex: 1, overflow: 'hidden' }}>
            <Editor
                theme="vs-dark"
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