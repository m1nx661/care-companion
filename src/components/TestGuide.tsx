import { useState } from "react";
import { ChevronDown, FileText } from "lucide-react";

const TEST_GUIDES: Record<string, { icon: string; instructions: string[] }> = {
  "Blood Test": {
    icon: "🩸",
    instructions: [
      "Fast for 8–12 hours before the test (water is allowed).",
      "Avoid alcohol for at least 24 hours before the test.",
      "Inform the technician about any medications you are currently taking.",
      "Wear a short-sleeved shirt for easy access to your arm.",
      "Stay hydrated — drink water before your appointment.",
      "Results are usually available within 24–48 hours.",
    ],
  },
  MRI: {
    icon: "🧲",
    instructions: [
      "Remove all metal objects: jewelry, watches, belts, hairpins.",
      "Inform the technician if you have any implants (pacemaker, metal plates, etc.).",
      "You may be asked to change into a hospital gown.",
      "The scan takes 30–60 minutes — remain still during the procedure.",
      "You may hear loud knocking sounds; earplugs will be provided.",
      "If you are claustrophobic, inform your doctor in advance for possible sedation.",
    ],
  },
  "X-Ray": {
    icon: "☢️",
    instructions: [
      "Remove any metal objects or jewelry from the area being X-rayed.",
      "You may need to wear a hospital gown depending on the body part.",
      "Inform the technician if you are pregnant or may be pregnant.",
      "The procedure is quick, usually taking only a few minutes.",
      "Follow the technician's instructions to hold specific positions.",
      "Results are typically reviewed by a radiologist within a few hours.",
    ],
  },
  Ultrasound: {
    icon: "📡",
    instructions: [
      "For abdominal ultrasound: drink 4–5 glasses of water 1 hour before the test.",
      "Do not urinate until the scan is complete (full bladder required).",
      "Wear loose, comfortable clothing for easy access.",
      "The procedure is painless and takes 20–30 minutes.",
      "A gel will be applied to the skin — it washes off easily.",
      "No fasting is required unless specifically instructed by your doctor.",
    ],
  },
  "Urine Test": {
    icon: "🧪",
    instructions: [
      "Collect a mid-stream sample in the sterile container provided by the lab.",
      "Wash your hands before collecting the sample.",
      "Deliver the sample to the lab within 1 hour of collection.",
      "First morning sample is preferred for most urine tests.",
      "Avoid excessive water intake right before collection.",
      "Inform the lab about any medications you are taking.",
    ],
  },
};

const TestGuide = () => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-5">
      <div className="text-center space-y-2 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto text-2xl">📋</div>
        <h2 className="text-xl font-semibold text-foreground">Test Preparation Guide</h2>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Select a test to view preparation instructions.
        </p>
      </div>

      <div className="space-y-2">
        {Object.entries(TEST_GUIDES).map(([name, guide]) => (
          <div key={name} className="rounded-xl border border-border overflow-hidden">
            <button
              onClick={() => setSelected(selected === name ? null : name)}
              className="w-full px-4 py-3 flex items-center justify-between bg-card hover:bg-secondary/30 transition-colors"
            >
              <span className="flex items-center gap-3 text-sm font-medium text-foreground">
                <span className="text-lg">{guide.icon}</span>
                {name}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                  selected === name ? "rotate-180" : ""
                }`}
              />
            </button>
            {selected === name && (
              <div className="px-4 pb-4 pt-2 bg-secondary/20 space-y-2 animate-fade-in">
                {guide.instructions.map((inst, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <FileText className="w-3.5 h-3.5 text-primary shrink-0 mt-1" />
                    <p className="text-sm text-foreground leading-relaxed">{inst}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestGuide;
