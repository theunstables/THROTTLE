import { WAITLIST_EMBED_URL } from "./config";

export const formFields = { city: "entry.2127194441", age: "entry.170455927", feedback: "entry.1393558069", consent: "entry.1549883233" } as const;
export const consentText = "I agree to receive occasional THROTTLE updates about product development, early access and launch announcements. I understand I can unsubscribe at any time.";
export type WaitlistValues = { email: string; city: string; age: string; feedback: string; consent: boolean };
export function waitlistError(v: WaitlistValues): string | null {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim()) || v.email.length > 254) return "Enter a valid email address.";
  if (!/^\d{1,3}$/.test(v.age) || Number(v.age) < 1 || Number(v.age) > 120) return "Enter your age between 1 and 120.";
  if (v.city.length > 120 || v.feedback.length > 2000) return "Please shorten your city or feedback.";
  return null;
}
export function waitlistPrefill(v: WaitlistValues): string {
  const error = waitlistError(v); if (error) throw new Error(error);
  const url = new URL(WAITLIST_EMBED_URL); url.search = ""; url.searchParams.set("usp", "pp_url");
  url.searchParams.set("emailAddress", v.email.trim());
  url.searchParams.set(formFields.city, v.city.trim()); url.searchParams.set(formFields.age, v.age);
  url.searchParams.set(formFields.feedback, v.feedback.trim());
  if (v.consent) url.searchParams.set(formFields.consent, consentText);
  return url.toString();
}
export function feedbackPrefill(features: string, problem: string, ideas: string, email: string): string {
  const answers = [features, problem, ideas].map(x => x.trim());
  if (!answers.some(Boolean)) throw new Error("Please share at least one idea.");
  if (answers.some(x => x.length > 600)) throw new Error("Keep each answer under 600 characters.");
  if (email && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || email.length > 254)) throw new Error("Enter a valid reply email or leave it blank.");
  const text = answers.map((a, i) => a ? `${["Additional features", "Ownership problem", "Suggestions"][i]}: ${a}` : "").filter(Boolean).join("\n\n") + (email.trim() ? `\n\nReply email: ${email.trim()}` : "");
  const url = new URL(WAITLIST_EMBED_URL); url.search = ""; url.searchParams.set("usp", "pp_url"); url.searchParams.set(formFields.feedback, text);
  return url.toString();
}
