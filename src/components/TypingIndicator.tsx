const TypingIndicator = () => (
  <div className="flex items-center gap-1 px-4 py-3 rounded-2xl rounded-bl-sm bg-chat-bot w-fit animate-fade-in">
    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse-dot" style={{ animationDelay: "0s" }} />
    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse-dot" style={{ animationDelay: "0.2s" }} />
    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse-dot" style={{ animationDelay: "0.4s" }} />
  </div>
);

export default TypingIndicator;
