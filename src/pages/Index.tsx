import { useState, useRef, useEffect } from "react";
import { MessageSquare, Plus, X, Stethoscope, MapPin, ClipboardList, Search, Home, Settings, Menu } from "lucide-react";
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

type View = "home" | "chat" | "symptoms" | "hospitals" | "tests";

const CATEGORIES = [
  { id: "symptoms" as View, label: "Symptoms", icon: "🩺", color: "bg-primary/15" },
  { id: "hospitals" as View, label: "Hospitals", icon: "🏥", color: "bg-primary/15" },
  { id: "tests" as View, label: "Test Guide", icon: "📋", color: "bg-primary/15" },
  { id: "chat" as View, label: "Chat", icon: "💬", color: "bg-primary/15" },
];

const SPECIALISTS = [
  { name: "Dr. Sarah Khan", specialty: "Cardiologist", hospital: "City Hospital", phone: "0422 831 21", avatar: "👩‍⚕️" },
  { name: "Dr. Raj Patel", specialty: "Orthopedic", hospital: "Metro Hospital", phone: "0422 831 22", avatar: "👨‍⚕️" },
  { name: "Dr. Emily Chen", specialty: "Neurologist", hospital: "Central Hospital", phone: "0422 831 23", avatar: "👩‍⚕️" },
  { name: "Dr. James Wilson", specialty: "Dermatologist", hospital: "Skin Care Clinic", phone: "0422 831 24", avatar: "👨‍⚕️" },
];

const BOTTOM_TABS: { id: View; label: string; icon: React.ReactNode }[] = [
  { id: "home", label: "Home", icon: <Home className="w-5 h-5" /> },
  { id: "chat", label: "Chat", icon: <MessageSquare className="w-5 h-5" /> },
  { id: "symptoms", label: "Symptoms", icon: <Stethoscope className="w-5 h-5" /> },
  { id: "hospitals", label: "Hospitals", icon: <MapPin className="w-5 h-5" /> },
  { id: "tests", label: "Tests", icon: <ClipboardList className="w-5 h-5" /> },
];

const Index = () => {
  const [activeView, setActiveView] = useState<View>("home");
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

  const navigateTo = (view: View) => {
    setActiveView(view);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-[420px] h-[92vh] flex flex-col bg-background rounded-3xl shadow-2xl border border-border overflow-hidden relative">

        {/* Header */}
        <div className="bg-primary px-5 pt-5 pb-8 rounded-b-[2rem] relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary-foreground/20 flex items-center justify-center text-lg backdrop-blur-sm">
                🏥
              </div>
              <Settings className="w-5 h-5 text-primary-foreground/70" />
            </div>
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 rounded-2xl bg-primary-foreground/20 flex items-center justify-center backdrop-blur-sm">
                <Menu className="w-5 h-5 text-primary-foreground" />
              </button>
            </div>
          </div>

          {activeView === "home" && (
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search doctors, departments..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-card text-foreground text-sm outline-none border-none placeholder:text-muted-foreground shadow-sm"
                readOnly
                onClick={() => navigateTo("chat")}
              />
            </div>
          )}

          {activeView !== "home" && (
            <h2 className="text-primary-foreground font-bold text-lg">
              {activeView === "chat" && "Hospital Assistant"}
              {activeView === "symptoms" && "Symptom Checker"}
              {activeView === "hospitals" && "Nearby Hospitals"}
              {activeView === "tests" && "Test Guide"}
            </h2>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col -mt-4 relative z-20">

          {/* Home View */}
          {activeView === "home" && (
            <div className="flex-1 overflow-y-auto px-5 pt-6 pb-4 space-y-6">

              {/* Categories */}
              <div>
                <h3 className="text-base font-bold text-foreground mb-4">Categories</h3>
                <div className="grid grid-cols-4 gap-3">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => navigateTo(cat.id)}
                      className="flex flex-col items-center gap-2 group"
                    >
                      <div className={`w-14 h-14 rounded-2xl ${cat.color} flex items-center justify-center text-xl group-hover:scale-105 transition-transform shadow-sm`}>
                        {cat.icon}
                      </div>
                      <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                        {cat.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Specialists */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-foreground">Specialist</h3>
                  <button className="text-xs font-semibold text-primary">See all</button>
                </div>
                <div className="space-y-3">
                  {SPECIALISTS.map((doc, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3.5 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-xl shrink-0">
                        {doc.avatar}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm text-foreground">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.specialty} · {doc.hospital}
                        </p>
                        <p className="text-xs text-primary font-medium mt-0.5">{doc.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Chat View */}
          {activeView === "chat" && (
            <>
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, i) => (
                  <ChatBubble key={i} role={msg.role} content={msg.content} />
                ))}
                {isTyping && <TypingIndicator />}
              </div>
              <ChatInput onSend={handleSend} disabled={isTyping} />
            </>
          )}

          {/* Feature Views */}
          {activeView === "symptoms" && <SymptomChecker />}
          {activeView === "hospitals" && <NearbyHospitals />}
          {activeView === "tests" && <TestGuide />}
        </div>

        {/* Bottom Navigation */}
        <div className="bg-card border-t border-border px-2 py-2 flex items-center justify-around shrink-0">
          {BOTTOM_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => navigateTo(tab.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors min-w-0 ${
                activeView === tab.id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.icon}
              <span className="text-[10px] font-semibold">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
