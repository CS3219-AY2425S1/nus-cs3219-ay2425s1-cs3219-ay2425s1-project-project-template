import React, { useMemo, useState } from "react";
import styles from "./CodeEditor.module.css";
import Editor, { Monaco } from "@monaco-editor/react";
import { Button, Select } from "antd";
import { useCollaboration } from "domain/context/CollaborationContext";
import { PlayCircleOutlined, CloudUploadOutlined } from "@ant-design/icons";
import * as monaco from "monaco-editor";
import { SunOutlined, MoonFilled } from "@ant-design/icons";
import { Language } from "domain/entities/Language";
import { LanguageSelector } from "./LanguageSelector";

interface CodeEditorProps {
    roomId: string;
}

interface LanguageOption {
    label: string;
    value: string;
    langData: Language;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ roomId }) => {
    const { initialiseEditor, handleExecuteCode } = useCollaboration();
    const [theme, setTheme] = useState("vs-light");
    const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => {
        initialiseEditor(roomId, editor, monaco);
    };

    const handleToggleTheme = () => {
        if (theme === "vs-light") {
            setTheme("vs-dark");
        } else {
            setTheme("vs-light");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.toolbar}>
                <LanguageSelector />
                <div className={styles.buttonGroup}>
                    <Button
                        onClick={handleToggleTheme}
                        type="text"
                        icon={theme === "vs-light" ? <SunOutlined /> : <MoonFilled />}
                    />

                    <Button onClick={handleExecuteCode} className={styles.runButton} icon={<PlayCircleOutlined />}>
                        Run
                    </Button>
                    <Button className={styles.submitButton} icon={<CloudUploadOutlined />}>
                        Submit
                    </Button>
                </div>
            </div>
            <div className={styles.editor}>
                <Editor
                    theme={theme}
                    onMount={handleEditorDidMount}
                    options={{
                        minimap: { enabled: false },
                        scrollbar: { verticalScrollbarSize: 4 },
                        formatOnPaste: true
                    }}
                />
            </div>
        </div>
    );
};

export default CodeEditor;
