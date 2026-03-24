export const KNOWLEDGE_BASE = [
  "The hospital is open 24/7 for emergencies. The outpatient department (OPD) operates from 8:00 AM to 5:00 PM, Monday to Saturday.",
  "The pharmacy is open from 8:00 AM to 9:00 PM every day, including Sundays and public holidays.",
  "Visiting hours for admitted patients are from 10:00 AM to 12:00 PM and 4:00 PM to 6:00 PM daily.",
  "Available departments include: General Medicine, Pediatrics, Orthopedics, Cardiology, Dermatology, ENT, Ophthalmology, Gynecology, and Psychiatry.",
  "The emergency department is on the ground floor near the main entrance. Follow the red signs.",
  "The radiology and lab departments are on the first floor, wing B. X-rays, MRIs, and blood tests are done there.",
  "To book an OPD appointment, call the front desk at 1800-123-4567 or visit the hospital website.",
  "Walk-in consultations are available but may involve longer waiting times. Appointments are recommended.",
  "For a fasting blood sugar test, do not eat or drink anything except water for at least 8–12 hours before the test.",
  "For a lipid profile test, fast for 9–12 hours. Water is allowed. Avoid alcohol for 24 hours before the test.",
  "For an ultrasound of the abdomen, drink 4–5 glasses of water one hour before the test and do not urinate until the scan is complete.",
  "Urine samples should be mid-stream, collected in a sterile container provided by the lab.",
  "Before an MRI, remove all metal objects including jewelry, watches, and belts. Inform the technician if you have any implants.",
  "If you have a mild fever, rest, stay hydrated, and monitor your temperature. Consult a doctor if fever exceeds 102°F or lasts more than 2 days.",
  "For minor cuts or wounds, wash with clean water, apply an antiseptic, and cover with a sterile bandage. See a doctor if bleeding doesn't stop.",
  "If you experience chest pain, shortness of breath, or sudden weakness on one side, seek emergency care immediately.",
  "For mild headaches, rest in a quiet room and stay hydrated. If headaches are severe, recurring, or accompanied by vision changes, consult a doctor.",
  "If you have mild stomach pain or acidity, avoid spicy food and eat small meals. See a doctor if pain is severe or persistent.",
  "The hospital accepts most major insurance plans. Bring your insurance card and a valid ID when you visit.",
  "For billing inquiries, visit the billing counter on the ground floor or call 1800-123-4568.",
];

export const VALID_DEPARTMENTS = [
  "General Medicine", "Pediatrics", "Orthopedics", "Cardiology",
  "Dermatology", "ENT", "Ophthalmology", "Gynecology", "Psychiatry",
];

export function searchKnowledgeBase(query: string, topK = 5): string[] {
  const queryWords = new Set(query.toLowerCase().split(/\s+/));
  const scored: [number, string][] = [];

  for (const entry of KNOWLEDGE_BASE) {
    const entryWords = new Set(entry.toLowerCase().split(/\s+/));
    let overlap = 0;
    queryWords.forEach((w) => { if (entryWords.has(w)) overlap++; });
    if (overlap > 0) scored.push([overlap, entry]);
  }

  scored.sort((a, b) => b[0] - a[0]);
  return scored.slice(0, topK).map(([, t]) => t);
}

const BOOKING_KEYWORDS = new Set(["book", "appointment", "schedule", "reserve"]);

export function isBookingRequest(text: string): boolean {
  const words = text.toLowerCase().split(/\s+/);
  return words.some((w) => BOOKING_KEYWORDS.has(w));
}
