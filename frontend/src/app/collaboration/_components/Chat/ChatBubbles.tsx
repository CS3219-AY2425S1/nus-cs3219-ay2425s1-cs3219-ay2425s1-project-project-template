import { CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChatMessage } from "@/types/ChatMessage";

interface ChatBubblesProps {
  isCollapsed: boolean;
  messages: ChatMessage[];
}

export default function ChatBubbles({
  isCollapsed,
  messages,
}: ChatBubblesProps) {
  return (
    <CardContent
      className={cn(
        "transition-all duration-300",
        "flex flex-col-reverse overflow-scroll whitespace-no-wrap",
        isCollapsed && "opacity-0"
      )}
    >
      {messages.map((message, idx) => (
        <ChatBubble
          key={`${idx}`}
          message={message}
          isSender={idx % 2 === 0 ? true : false}
        />
      ))}
    </CardContent>
  );
}

interface ChatBubbleProps {
  key: string;
  message: ChatMessage;
  isSender: boolean;
}

function ChatBubble({ key, message, isSender }: ChatBubbleProps) {
  return (
    <div
      key={key}
      className={`flex flex-col mb-4 whitespace-pre-wrap ${
        isSender ? "items-end" : "items-start"
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm font-medium">{message.userId}</span>
      </div>
      <div
        className={`px-3 py-2 rounded-lg ${
          isSender ? "bg-primary text-primary-foreground" : "bg-violet-400/10"
        }`}
      >
        {message.message}
      </div>
    </div>
  );
}
