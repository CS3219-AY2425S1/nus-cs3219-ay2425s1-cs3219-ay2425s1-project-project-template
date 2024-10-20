// not in use

import React, { useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';
import database from '../config/firebaseConfig';
import { ref, onValue, off } from 'firebase/database'; 

interface MonacoEditorProps {
  roomId: string;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({ roomId }) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [code, setCode] = useState('');

  React.useEffect(() => {
    // Fetch initial code from Firebase and set it in the editor
    const roomRef = ref(database, `rooms/${roomId}/code`); 
    onValue(roomRef, (snapshot) => {
      const newCode = snapshot.val();
      if (newCode && newCode !== code) {
        setCode(newCode);
        editorRef.current?.setValue(newCode); // Update the Monaco editor's value
      }
    });

    // Clean up the listener when the component unmounts
    return () => {
      off(roomRef); // Remove the Firebase listener
    };
  }, [roomId, code]);

  return <div id="editor" style={{ height: '100vh', width: '100%' }}> </div>;
};

export default MonacoEditor;
