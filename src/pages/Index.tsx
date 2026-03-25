import { useState, useRef, useEffect } from "react";
import { MessageSquare, Plus, X, Stethoscope, MapPin, ClipboardList, Menu } from "lucide-react";
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
  { label: "Check symptoms", icon: "🩺" },
  { label: "Book appointment", icon: "📅" },
  { label: "Find hospital", icon: "📍" },
];

type View = "chat" | "symptoms" | "hospitals" | "tests";

const MENU_ITEMS: { id: View; label: string; icon: React.ReactNode }[] = [
  { id: "symptoms", label: "Symptom Checker", icon: <Stethoscope className="w-5 h-5" /> },
  { id: "hospitals", label: "Nearby Hospitals", icon: <MapPin className="w-5 h-5" /> },
  { id: "tests", label: "Test Guide", icon: <ClipboardList className="w-5 h-5" /> },
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
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
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

  const navigateTo = (view: View) => {
    setActiveView(view);
    setMenuOpen(false);
  };

  const showQuickActions = messages.length === 1;

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-[420px] h-[92vh] flex flex-col bg-card rounded-3xl shadow-2xl border border-border overflow-hidden relative">
        {/* Header */}
        <div className="bg-primary px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-foreground/20 flex items-center justify-center text-lg backdrop-blur-sm">
              🏥
            </div>
            <div>
              <h1 className="text-primary-foreground font-bold text-base tracking-tight">Hospital Assistant</h1>
              <p className="text-primary-foreground/60 text-xs font-medium">Always here to help</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {activeView !== "chat" && (
              <button
                onClick={() => navigateTo("chat")}
                className="p-2.5 rounded-xl text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
            )}
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2.5 rounded-xl text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </button>

              {/* Dropdown Menu */}
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-card rounded-2xl shadow-xl border border-border overflow-hidden z-50 animate-fade-in">
                  {MENU_ITEMS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => navigateTo(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-colors ${
                        activeView === item.id
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-accent/50"
                      }`}
                    >
                      <span className={activeView === item.id ? "text-primary" : "text-muted-foreground"}>
                        {item.icon}
                      </span>
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat View */}
        {activeView === "chat" && (
          <>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <ChatBubble key={i} role={msg.role} content={msg.content} />
              ))}
              {isTyping && <TypingIndicator />}
              {showQuickActions && !isTyping && (
                <div className="flex flex-wrap gap-2 pt-3 animate-fade-in">
                  {QUICK_ACTIONS.map((q) => (
                    <button
                      key={q.label}
                      onClick={() => handleSend(q.label)}
                      className="px-4 py-2.5 text-xs rounded-2xl border border-primary/20 text-primary bg-primary/5 hover:bg-primary/10 transition-all font-medium flex items-center gap-2 shadow-sm"
                    >
                      <span>{q.icon}</span>
                      {q.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <ChatInput onSend={handleSend} disabled={isTyping} />
          </>
        )}

        {/* Feature Views */}
        {activeView === "symptoms" && <SymptomChecker />}
        {activeView === "hospitals" && <NearbyHospitals />}
        {activeView === "tests" && <TestGuide />}
      </div>
    </div>
  );
};

export default Index;
