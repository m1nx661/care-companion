import { searchKnowledgeBase, isBookingRequest, VALID_DEPARTMENTS } from "./knowledgeBase";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface BookingState {
  active: boolean;
  department?: string;
  date?: string;
  time?: string;
}

let bookingState: BookingState = { active: false };
const appointments: { department: string; date: string; time: string }[] = [];

export function getAppointments() {
  return [...appointments];
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function getResponse(userMessage: string, history: ChatMessage[]): Promise<string> {
  await delay(600 + Math.random() * 800); // simulate latency

  const msg = userMessage.trim().toLowerCase();

  // Booking flow
  if (isBookingRequest(userMessage) && !bookingState.active) {
    bookingState = { active: true };
    return "I'd be happy to help you book an appointment! Which department would you like?\n\nAvailable departments:\n" +
      VALID_DEPARTMENTS.map((d) => `• ${d}`).join("\n");
  }

  if (bookingState.active) {
    if (!bookingState.department) {
      const match = VALID_DEPARTMENTS.find((d) => msg.includes(d.toLowerCase()));
      if (match) {
        bookingState.department = match;
        return `Great, ${match} it is! What date would you prefer? (e.g., 2026-04-01)`;
      }
      return "I didn't catch the department. Please choose from:\n" + VALID_DEPARTMENTS.map((d) => `• ${d}`).join("\n");
    }
    if (!bookingState.date) {
      const dateMatch = userMessage.match(/\d{4}-\d{2}-\d{2}/);
      if (dateMatch) {
        bookingState.date = dateMatch[0];
        return `Got it, ${bookingState.date}. What time works for you? (e.g., 10:00)`;
      }
      return "Please provide a date in YYYY-MM-DD format (e.g., 2026-04-01).";
    }
    if (!bookingState.time) {
      const timeMatch = userMessage.match(/\d{1,2}:\d{2}/);
      if (timeMatch) {
        bookingState.time = timeMatch[0];
        const appt = { department: bookingState.department, date: bookingState.date, time: bookingState.time };
        appointments.push(appt);
        bookingState = { active: false };
        return `✅ Appointment booked!\n\n📋 Department: ${appt.department}\n📅 Date: ${appt.date}\n🕐 Time: ${appt.time}\n\nPlease arrive 15 minutes early with your ID and insurance card.`;
      }
      return "Please provide a time in HH:MM format (e.g., 10:00 or 14:30).";
    }
  }

  // Knowledge base lookup
  const results = searchKnowledgeBase(userMessage);
  if (results.length > 0) {
    const topResult = results[0];
    // Add a helpful wrapper
    if (msg.includes("emergency") || msg.includes("chest pain") || msg.includes("breath")) {
      return `⚠️ ${topResult}\n\nPlease call emergency services or visit the emergency department immediately if this is urgent.`;
    }
    return topResult + "\n\nIs there anything else I can help you with?";
  }

  return "I don't have specific information about that. I'd suggest contacting the hospital front desk at 1800-123-4567 for assistance. Is there anything else I can help with?";
}
