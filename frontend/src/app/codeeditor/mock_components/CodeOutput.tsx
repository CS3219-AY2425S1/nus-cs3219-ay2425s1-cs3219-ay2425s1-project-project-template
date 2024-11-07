
import { Button } from "@/components/ui/button";

interface CodeOutputProps {
    outputText: string;
    handleRunCode: () => void;
    handleSubmitCode: () => void;
}
const CodeOutput:React.FC<CodeOutputProps> = ( { outputText, handleRunCode, handleSubmitCode} ) => {

    return (
        <div className="flex flex-col h-[200px] justify-between border border-2 border-purple-300 rounded-lg">
            <p className="border border-red-200">{outputText}blank until we run some code</p>
            <div className="flex justify-end gap-1">
                <Button variant="secondary" onClick={handleRunCode}>Run Code</Button>
                <Button onClick={handleSubmitCode}>Submit</Button>
            </div>
        </div>
    );
}


export default CodeOutput;