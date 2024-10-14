import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeSnippetHighlight = () => {
    const code = `def twoSum(nums, target):
        idxDict = {}
        for i, num in enumerate(nums):
            if target - num in idxDict:
                return [idxDict[target - num], i]
            idxDict[num] = i
        return []`;

    return (
        <SyntaxHighlighter language="python" style={darcula}>
            {code}
        </SyntaxHighlighter>
    );
};

export default CodeSnippetHighlight;