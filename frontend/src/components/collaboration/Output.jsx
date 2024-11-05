import { useState } from 'react';
import { Button } from '@mui/material';

import codeExecutionService from '../../services/code-execution-service';
import '../../styles/output.css';

const Output = ({editorRef, language}) => {
    const [output, setOutput] = useState(null);

    const runCode = async () => {
        const sourceCode = editorRef.current.getValue();
        if (!sourceCode) return;
        try {
            const {run:result} = await codeExecutionService.executeCode(language, sourceCode);
            setOutput(result.output);
        } catch (error) {
            console.error("Error running code:", error)
        }
    };

    return (
        <div className="output-container" >
            <div className="output-header" >
                <h2>Output</h2>
                <button className='run-button' onClick={runCode} >Run</button>            
            </div>

            <div className="output-content" >
                {output ? output : 'Click "Run" to execute code'}
            </div>
        </div>
    );
}

export default Output;
