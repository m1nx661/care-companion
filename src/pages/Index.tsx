import { useState, useRef, useEffect } from "react";
import { MessageSquare, Stethoscope, MapPin, ClipboardList } from "lucide-react";
import ChatBubble from "@/components/ChatBubble";
import ChatInput from "@/components/ChatInput";
import TypingIndicator from "@/components/TypingIndicator";
import SymptomChecker from "@/components/SymptomChecker";
import NearbyHospitals from "@/components/NearbyHospitals";
import TestGuide from "@/components/TestGuide";
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

type Tab = "chat" | "symptoms" | "hospitals" | "tests";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "chat", label: "Chat", icon: <MessageSquare className="w-4 h-4" /> },
  { id: "symptoms", label: "Symptoms", icon: <Stethoscope className="w-4 h-4" /> },
  { id: "hospitals", label: "Hospitals", icon: <MapPin className="w-4 h-4" /> },
  { id: "tests", label: "Test Guide", icon: <ClipboardList className="w-4 h-4" /> },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>("chat");
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

        {/* Navigation Tabs */}
        <div className="flex border-b border-border bg-card">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors relative ${
                activeTab === tab.id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.icon}
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Chat Section */}
        {activeTab === "chat" && (
          <>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <ChatBubble key={i} role={msg.role} content={msg.content} />
              ))}
              {isTyping && <TypingIndicator />}
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
            <ChatInput onSend={handleSend} disabled={isTyping} />
          </>
        )}

        {/* Other Sections */}
        {activeTab === "symptoms" && <SymptomChecker />}
        {activeTab === "hospitals" && <NearbyHospitals />}
        {activeTab === "tests" && <TestGuide />}
      </div>
    </div>
  );
};

export default Index;
