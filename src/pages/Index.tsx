import { useState, useRef, useEffect } from "react";
import { Plus, X, Stethoscope, MapPin, ClipboardList } from "lucide-react";
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

const FAQ_BUTTONS = [
  "What are visiting hours?",
  "How to prepare for a blood test?",
  "Where is emergency department?",
  "How to book an appointment?",
];

type View = "chat" | "symptoms" | "hospitals" | "tests";

const MENU_ITEMS: { id: View; label: string; icon: React.ReactNode }[] = [
  { id: "symptoms", label: "Symptom Checker", icon: <Stethoscope className="w-4 h-4" /> },
  { id: "hospitals", label: "Nearby Hospitals", icon: <MapPin className="w-4 h-4" /> },
  { id: "tests", label: "Test Guide", icon: <ClipboardList className="w-4 h-4" /> },
];

const Index = () => {
  const [activeView, setActiveView] = useState<View>("chat");
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

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

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30 p-4">
      <div className="w-full max-w-[420px] h-[92vh] flex flex-col bg-background rounded-3xl shadow-2xl border border-border overflow-hidden">

        {/* Header */}
        <div className="bg-primary px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-foreground/20 flex items-center justify-center text-base backdrop-blur-sm">
              🏥
            </div>
            <h1 className="text-primary-foreground font-bold text-lg">
              {activeView === "chat" && "Hospital Assistant"}
              {activeView === "symptoms" && "Symptom Checker"}
              {activeView === "hospitals" && "Nearby Hospitals"}
              {activeView === "tests" && "Test Guide"}
            </h1>
          </div>
          <div className="relative" ref={menuRef}>
            {activeView !== "chat" ? (
              <button
                onClick={() => setActiveView("chat")}
                className="w-9 h-9 rounded-xl bg-primary-foreground/20 flex items-center justify-center backdrop-blur-sm transition-transform hover:scale-105"
              >
                <X className="w-5 h-5 text-primary-foreground" />
              </button>
            ) : (
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="w-9 h-9 rounded-xl bg-primary-foreground/20 flex items-center justify-center backdrop-blur-sm transition-transform hover:scale-105"
              >
                <Plus className={`w-5 h-5 text-primary-foreground transition-transform duration-200 ${menuOpen ? "rotate-45" : ""}`} />
              </button>
            )}

            {menuOpen && (
              <div className="absolute right-0 top-12 w-52 bg-popover border border-border rounded-2xl shadow-xl overflow-hidden z-50 animate-fade-in">
                {MENU_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveView(item.id); setMenuOpen(false); }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-popover-foreground hover:bg-accent transition-colors"
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">

          {activeView === "chat" && (
            <>
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, i) => (
                  <ChatBubble key={i} role={msg.role} content={msg.content} />
                ))}
                {isTyping && <TypingIndicator />}

                {messages.length === 1 && !isTyping && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {FAQ_BUTTONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSend(q)}
                        className="px-3 py-2 text-xs font-medium rounded-2xl border border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 transition-colors"
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

          {activeView === "symptoms" && <SymptomChecker />}
          {activeView === "hospitals" && <NearbyHospitals />}
          {activeView === "tests" && <TestGuide />}
        </div>
      </div>
    </div>
  );
};

export default Index;
