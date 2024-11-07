
import { Button } from "@/components/ui/button";

interface CodeOutputProps {
    outputText: string;
    allPassed: boolean;
    handleRunCode: () => void;
    handleSubmitCode: () => void;
}
const CodeOutput:React.FC<CodeOutputProps> = ( { outputText, allPassed, handleRunCode, handleSubmitCode} ) => {

    return (
        <div className="flex flex-col h-[200px] justify-between border border-2 border-purple-300 rounded-lg">
            {allPassed ? <p className="text-green-700">{outputText}</p> : <p className="text-rose-700">{outputText}</p>}
            <div className="flex justify-end gap-1">
                <Button variant="secondary" onClick={handleRunCode}>Run Code</Button>
                <Button onClick={handleSubmitCode}>Submit</Button>
            </div>
        </div>
    );
}


export default CodeOutput;