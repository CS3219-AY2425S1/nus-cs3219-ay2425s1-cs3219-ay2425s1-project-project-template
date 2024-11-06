import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { sql } from '@codemirror/lang-sql';
import '../styles/SharedSpace.css';

const SharedSpace = forwardRef((props, ref) => {
  const [text1, setText1] = useState(''); // Local state for text field
  const [code, setCode] = useState(''); // Local state for code editor
  const docRef = useRef(null); // Use ref to store the Yjs document
  const [language, setLanguage] = useState('Python');

  const getLanguageExtension = () => {
    switch (language) {
        case 'JavaScript':
            return javascript();
        case 'Python':
            return python();
        case 'C++':
            return cpp();
        case 'Java':
            return java();
        case 'SQL':
            return sql();
        default:
            return javascript();
    }
  }

  useImperativeHandle(ref, () => ({
    getSharedSpaceState: () => ({
      code,
      text1,
      language
    })
  }));

  useEffect(() => {

    const doc = new Y.Doc();
    docRef.current = doc;

    const provider = new WebsocketProvider(
      'ws://localhost:5002', // WebSocket server URL
      'shared-text-field',   // Room name for collaboration
      doc                    // Yjs document
    );

    const yText = doc.getText('shared-text');
    const yCode = doc.getText('shared-code');

    yText.observe(() => {
      setText1(yText.toString());
    });

    yCode.observe(() => {
      setCode(yCode.toString());
    });

    // Clean up WebSocket connection and Yjs document on unmount
    return () => {
      provider.destroy();
      doc.destroy();
    };
  }, []);

  const handleTextChange = (event) => {
    const newText = event.target.value;
    const yText = docRef.current.getText('shared-text');

    yText.delete(0, yText.length);
    yText.insert(0, newText);
  };

  const handleCodeChange = (editor, data, value) => {
    const newText = editor;
    const yCode = docRef.current.getText('shared-code');

    yCode.delete(0, yCode.length);
    yCode.insert(0, newText);
  };

  const textAreaStyle = {
    display: 'block',
    width: '98%',
    height: '100px',
    marginBottom: '10px',
    padding: '8px',
  };

  return (
    <div>
      <h2 className="subheading">Whiteboard</h2>
      <textarea
        style={textAreaStyle}
        value={text1}
        onChange={handleTextChange}
        placeholder="Type in the first text field..."
      />
      <h2 className="subheading">Code Editor</h2>
      <div className="code-area">
        <select className="language" value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="JavaScript">JavaScript</option>
            <option value="Python">Python</option>
            <option value="C++">C++</option>
            <option value="Java">Java</option>
            <option value="SQL">SQL</option>
        </select>
        <CodeMirror
            value={code}
            extensions={[getLanguageExtension()]}
            onChange={handleCodeChange}
            options={{
                lineNumbers: true,
            }}
            placeholder="Write your code here..."
        />
      </div>
    </div>
  );
});

export default SharedSpace;