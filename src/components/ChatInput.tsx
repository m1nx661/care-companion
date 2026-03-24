import { useState } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [value, setValue] = useState("");

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  return (
    <div className="flex items-center gap-2 p-3 border-t border-border bg-card">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="Type your message..."
        disabled={disabled}
        className="flex-1 px-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm outline-none transition-colors focus:border-primary placeholder:text-muted-foreground"
      />
      <button
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        className="p-2.5 rounded-xl bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Send className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ChatInput;
