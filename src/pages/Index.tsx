import { useState, useRef, useEffect } from "react";
import ChatBubble from "@/components/ChatBubble";
import ChatInput from "@/components/ChatInput";
import TypingIndicator from "@/components/TypingIndicator";
import { getResponse, type ChatMessage } from "@/lib/chatSimulator";

const WELCOME_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "Hello! 👋 I'm your hospital assistant. I can help with:\n\n• Hospital timings & departments\n• Test preparation instructions\n• General health guidance\n• Appointment booking\n\nHow can I help you today?",
};

const QUICK_ACTIONS = [
  "What are the visiting hours?",
  "Book an appointment",
  "How to prepare for a blood test?",
  "Where is the emergency department?",
];

const Index = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    const userMsg: ChatMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const reply = await getResponse(text, [...messages, userMsg]);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ Something went wrong. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const showQuickActions = messages.length === 1;

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md h-[90vh] flex flex-col bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
        {/* Header */}
        <div className="bg-primary px-5 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center text-lg">
            🏥
          </div>
          <div>
            <h1 className="text-primary-foreground font-semibold text-base">Hospital Assistant</h1>
            <p className="text-primary-foreground/70 text-xs">Always here to help</p>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <ChatBubble key={i} role={msg.role} content={msg.content} />
          ))}
          {isTyping && <TypingIndicator />}

          {/* Quick actions */}
          {showQuickActions && !isTyping && (
            <div className="flex flex-wrap gap-2 pt-2 animate-fade-in">
              {QUICK_ACTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="px-3 py-1.5 text-xs rounded-full border border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <ChatInput onSend={handleSend} disabled={isTyping} />
      </div>
    </div>
  );
};

export default Index;
