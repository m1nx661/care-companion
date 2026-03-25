import { useState } from "react";
import { AlertTriangle, Plus, X, Stethoscope } from "lucide-react";

const PRESET_SYMPTOMS = [
  "Chest pain",
  "Fever",
  "Headache / Migraine",
  "Shortness of breath",
  "Joint / Knee pain",
  "Back pain",
  "Skin rash / Itching",
  "Eye pain / Blurred vision",
  "Ear pain / Hearing loss",
  "Sore throat / Hoarseness",
  "Stomach / Abdominal pain",
  "Nausea / Vomiting",
  "Anxiety / Depression",
  "Cough / Cold",
  "Heart palpitations",
];

const DEPARTMENT_MAP: Record<string, { department: string; urgent?: boolean }> = {
  "chest pain": { department: "Cardiology", urgent: true },
  "heart palpitations": { department: "Cardiology", urgent: true },
  "shortness of breath": { department: "Pulmonology", urgent: true },
  fever: { department: "General Medicine" },
  "cough / cold": { department: "General Medicine" },
  "sore throat / hoarseness": { department: "ENT (Ear, Nose & Throat)" },
  "ear pain / hearing loss": { department: "ENT (Ear, Nose & Throat)" },
  "headache / migraine": { department: "Neurology" },
  "joint / knee pain": { department: "Orthopedics" },
  "back pain": { department: "Orthopedics" },
  "skin rash / itching": { department: "Dermatology" },
  "eye pain / blurred vision": { department: "Ophthalmology" },
  "stomach / abdominal pain": { department: "Gastroenterology" },
  "nausea / vomiting": { department: "Gastroenterology" },
  "anxiety / depression": { department: "Psychiatry" },
};

interface Result {
  departments: { name: string; urgent: boolean }[];
}

const SymptomChecker = () => {
  const [allSymptoms, setAllSymptoms] = useState(PRESET_SYMPTOMS);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [customInput, setCustomInput] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const toggleSymptom = (symptom: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(symptom)) next.delete(symptom);
      else next.add(symptom);
      return next;
    });
    setResult(null);
  };

  const addCustom = () => {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    if (!allSymptoms.includes(trimmed)) {
      setAllSymptoms((prev) => [...prev, trimmed]);
    }
    setSelected((prev) => new Set(prev).add(trimmed));
    setCustomInput("");
    setResult(null);
  };

  const removeSelected = (symptom: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(symptom);
      return next;
    });
    setResult(null);
  };

  const checkSymptoms = () => {
    const deptSet = new Map<string, boolean>();
    selected.forEach((s) => {
      const key = s.toLowerCase();
      const match = DEPARTMENT_MAP[key];
      if (match) {
        const existing = deptSet.get(match.department) || false;
        deptSet.set(match.department, existing || !!match.urgent);
      } else {
        deptSet.set("General Medicine", deptSet.get("General Medicine") || false);
      }
    });
    setResult({
      departments: Array.from(deptSet.entries()).map(([name, urgent]) => ({ name, urgent })),
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
          <Stethoscope className="w-7 h-7 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Symptom Checker</h2>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Select your symptoms to get a department recommendation. This is not a medical diagnosis.
        </p>
      </div>

      {/* Symptom Chips */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">Common Symptoms</h3>
        <div className="flex flex-wrap gap-2">
          {allSymptoms.map((s) => {
            const isSelected = selected.has(s);
            return (
              <button
                key={s}
                onClick={() => toggleSymptom(s)}
                className={`px-3 py-1.5 text-xs rounded-full border transition-all font-medium ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card text-foreground border-border hover:border-primary/40 hover:bg-accent/50"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCustom()}
          placeholder="Type a custom symptom..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm outline-none transition-colors focus:border-primary placeholder:text-muted-foreground"
        />
        <button
          onClick={addCustom}
          disabled={!customInput.trim()}
          className="px-4 py-2.5 rounded-xl border border-primary/30 text-primary text-sm font-medium flex items-center gap-1.5 hover:bg-primary/5 transition-colors disabled:opacity-40"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {/* Selected Summary */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-2">Selected Symptoms</h3>
        {selected.size === 0 ? (
          <p className="text-sm text-muted-foreground italic">None selected yet</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {Array.from(selected).map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-full bg-secondary text-secondary-foreground font-medium"
              >
                {s}
                <button onClick={() => removeSelected(s)} className="hover:text-destructive transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Check Button */}
      <button
        onClick={checkSymptoms}
        disabled={selected.size === 0}
        className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
      >
        Check Symptoms
      </button>

      {/* Results */}
      {result && (
        <div className="space-y-3 animate-fade-in">
          <h3 className="text-sm font-medium text-foreground">Recommended Departments</h3>
          {result.departments.map((d) => (
            <div
              key={d.name}
              className={`p-4 rounded-xl border text-sm ${
                d.urgent
                  ? "bg-destructive/10 border-destructive/20"
                  : "bg-secondary/50 border-border"
              }`}
            >
              <p className="font-semibold text-foreground">{d.name}</p>
              {d.urgent && (
                <p className="text-destructive text-xs font-medium mt-1">⚠️ Urgent — seek immediate attention</p>
              )}
            </div>
          ))}
          <div className="flex items-start gap-2 p-4 rounded-xl bg-muted border border-border">
            <AlertTriangle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              This is not a medical diagnosis. Please consult a doctor for proper evaluation and treatment.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;
