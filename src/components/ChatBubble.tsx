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
        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center mr-2 mt-1">
          <span className="text-sm">🏥</span>
        </div>
      )}
      <div
        className={cn(
          "max-w-[80%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-sm",
          isUser
            ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md"
            : "bg-chat-bot text-foreground rounded-2xl rounded-bl-md border border-border"
        )}
      >
        {content}
      </div>
    </div>
  );
};

export default ChatBubble;
