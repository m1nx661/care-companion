const TypingIndicator = () => (
  <div className="flex items-center gap-1 px-4 py-3 rounded-2xl rounded-bl-md bg-chat-bot border border-border w-fit animate-fade-in shadow-sm">
    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse-dot" style={{ animationDelay: "0s" }} />
    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse-dot" style={{ animationDelay: "0.2s" }} />
    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse-dot" style={{ animationDelay: "0.4s" }} />
  </div>
);

export default TypingIndicator;
