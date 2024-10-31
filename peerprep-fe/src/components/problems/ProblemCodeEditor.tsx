import React from "react";
import Editor from "@monaco-editor/react";

interface ProblemCodeEditorProps {
    value: string;
    onMount: (editor: any, monaco: any) => void;
}

const ProblemCodeEditor: React.FC<ProblemCodeEditorProps> = ({
    value,
    onMount,
}) => {

    return (
        <div
            style={{
                borderRadius: "12px", 
                overflow: "hidden", 
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)", 
            }}
            className="flex-grow overflow-y-auto bg-gray-900 font-mono text-gray-100"
        >
            <Editor
                height="100%"
                width="100%" 
                language="python"
                theme="vs-dark"
                value={value} 
                onMount={onMount}
                options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    lineNumbers: "on",
                    wordWrap: "on",
                }}
            />
        </div>
    );
};

export default ProblemCodeEditor;
