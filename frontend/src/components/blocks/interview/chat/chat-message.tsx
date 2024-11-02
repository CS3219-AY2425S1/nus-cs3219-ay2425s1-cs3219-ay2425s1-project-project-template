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
    <pre className='bg-secondary my-4 overflow-x-auto rounded-md p-4 text-sm'>
      <code>{content}</code>
    </pre>
    <button
      onClick={() => navigator.clipboard.writeText(content)}
      className='bg-secondary/80 absolute right-2 top-2 rounded px-2 py-1 text-xs opacity-0 transition-opacity group-hover:opacity-100'
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
          message.isUser ? 'bg-secondary/50' : 'bg-secondary'
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
