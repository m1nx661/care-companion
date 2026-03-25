import { useState } from "react";
import { Search, AlertTriangle } from "lucide-react";

const SYMPTOM_RULES: Record<string, string> = {
  headache: "Rest in a quiet, dark room. Stay hydrated. Over-the-counter pain relievers may help. If severe or recurring, see a doctor.",
  fever: "Rest, drink plenty of fluids, and monitor your temperature. Take paracetamol if needed. Seek medical help if fever exceeds 102°F or lasts more than 2 days.",
  cough: "Stay hydrated, use honey and warm water to soothe throat. Avoid irritants. See a doctor if cough persists beyond 2 weeks or produces blood.",
  "chest pain": "⚠️ URGENT: Seek emergency medical attention immediately. Do not ignore chest pain, especially if accompanied by shortness of breath or arm pain.",
  "stomach pain": "Avoid spicy and oily food. Eat small, frequent meals. Try antacids for acidity. Consult a doctor if pain is severe or persists.",
  cold: "Rest, stay warm, drink warm fluids. Use saline nasal drops for congestion. Usually resolves in 7–10 days.",
  nausea: "Avoid strong odors and heavy meals. Sip ginger tea or clear fluids. Consult a doctor if vomiting is persistent or accompanied by severe pain.",
  fatigue: "Ensure adequate sleep (7–8 hours). Stay hydrated and eat balanced meals. If fatigue persists, get a blood test to rule out anemia or thyroid issues.",
  "sore throat": "Gargle with warm salt water. Stay hydrated. Use throat lozenges. See a doctor if it lasts more than a week or is accompanied by high fever.",
  dizziness: "Sit or lie down immediately. Stay hydrated. Avoid sudden movements. Consult a doctor if episodes are frequent or accompanied by fainting.",
};

const SymptomChecker = () => {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);

  const handleCheck = () => {
    if (!input.trim()) return;
    const query = input.toLowerCase();
    const matches: string[] = [];
    for (const [symptom, advice] of Object.entries(SYMPTOM_RULES)) {
      if (query.includes(symptom)) {
        matches.push(`**${symptom.charAt(0).toUpperCase() + symptom.slice(1)}:** ${advice}`);
      }
    }
    if (matches.length === 0) {
      matches.push("No specific guidance found for your symptoms. Please describe them differently or consult a healthcare professional.");
    }
    setResults(matches);
    setChecked(true);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-5">
      <div className="text-center space-y-2 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto text-2xl">🩺</div>
        <h2 className="text-xl font-semibold text-foreground">Symptom Checker</h2>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Enter your symptoms below to get basic health guidance.
        </p>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCheck()}
          placeholder="e.g. headache, fever, nausea..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm outline-none transition-colors focus:border-primary placeholder:text-muted-foreground"
        />
        <button
          onClick={handleCheck}
          disabled={!input.trim()}
          className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          <Search className="w-4 h-4" />
          Check
        </button>
      </div>

      {checked && (
        <div className="space-y-3 animate-fade-in">
          {results.map((r, i) => (
            <div key={i} className="p-4 rounded-xl bg-secondary/50 border border-border text-sm text-foreground leading-relaxed">
              {r.split("**").map((part, j) =>
                j % 2 === 1 ? <strong key={j}>{part}</strong> : <span key={j}>{part}</span>
              )}
            </div>
          ))}
          <div className="flex items-start gap-2 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
            <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-destructive font-medium">
              This is for informational purposes only. Please consult a qualified doctor for a proper diagnosis and treatment.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;
