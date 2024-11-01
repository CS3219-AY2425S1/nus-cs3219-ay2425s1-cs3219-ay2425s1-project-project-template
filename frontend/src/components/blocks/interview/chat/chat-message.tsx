export interface ChatMessageType {
  text: string;
  isUser: boolean;
  timestamp: Date;
  isCode?: boolean;
}

interface ChatMessageProps {
  message: ChatMessageType;
}

const CodeBlock: React.FC<{ content: string }> = ({ content }) => (
  <div className='group relative'>
    <pre className='my-4 overflow-x-auto rounded-md bg-gray-900 p-4 text-sm text-gray-100'>
      <code>{content}</code>
    </pre>
    <button
      onClick={() => navigator.clipboard.writeText(content)}
      className='absolute right-2 top-2 rounded bg-gray-700 px-2 py-1 text-xs text-gray-300 opacity-0 transition-opacity group-hover:opacity-100'
    >
      Copy
    </button>
  </div>
);

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  // Detect if the message contains code (basic detection - can be enhanced)
  const hasCode = message.text.includes('```');
  const parts = hasCode ? message.text.split('```') : [message.text];

  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[85%] rounded-lg px-4 py-2 text-xs ${
          message.isUser ? 'bg-blue-500 text-white' : 'border border-gray-100 bg-gray-50'
        }`}
      >
        {parts.map((part, index) => {
          if (index % 2 === 1) {
            // Code block
            return <CodeBlock key={index} content={part.trim()} />;
          }

          return (
            <div key={index}>
              {part.split('\n').map((line, i) => (
                <p key={i} className='whitespace-pre-wrap'>
                  {line}
                </p>
              ))}
            </div>
          );
        })}
        <div className='mt-1 text-xs opacity-60'>
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
};
