export const FORM_RESPONSE_URL = "https://docs.google.com/forms/d/e/1FAIpQLScD9SsuMJ3NJ2FbYF3yUyVoVeVofAM_Xq2BfzHPckXIhr3M2w/formResponse";

// Inspected against the existing public Google Form. Consent must exactly
// match its checkbox answer or Google will not record the opt-in.
export const formFields = {
  feedback: "entry.1393558069",
  consent: "entry.1549883233",
} as const;
export const consentText = "I agree to receive occasional THROTTLE updates about product development, early access and launch announcements. I understand I can unsubscribe at any time.";

export type JoinValues = {
  email: string;
  feedback: string;
  consent: boolean;
};

export function joinError(values: JoinValues): string | null {
  const email = values.email.trim();
  if (!email) return "Enter your email address.";
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address.";
  if (values.feedback.length > 2000) return "Keep your feedback under 2,000 characters.";
  return null;
}

/** Documents and tests the native form's exact Google POST fields. */
export function joinBody(values: JoinValues): URLSearchParams {
  const error = joinError(values);
  if (error) throw new Error(error);
  const body = new URLSearchParams();
  body.set("emailAddress", values.email.trim());
  body.set(formFields.feedback, values.feedback.trim());
  if (values.consent) body.set(formFields.consent, consentText);
  return body;
}
