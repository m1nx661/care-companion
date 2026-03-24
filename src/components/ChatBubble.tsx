import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
}

const ChatBubble = ({ role, content }: ChatBubbleProps) => {
  const isUser = role === "user";

  return (
    <div className={cn("flex animate-fade-in", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-2 mt-1">
          <span className="text-primary-foreground text-sm">🏥</span>
        </div>
      )}
      <div
        className={cn(
          "max-w-[80%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
          isUser
            ? "bg-chat-user text-primary-foreground rounded-2xl rounded-br-sm"
            : "bg-chat-bot text-foreground rounded-2xl rounded-bl-sm"
        )}
      >
        {content}
      </div>
    </div>
  );
};

export default ChatBubble;
