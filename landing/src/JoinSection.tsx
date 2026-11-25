import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import {
  consentText,
  FORM_RESPONSE_URL,
  formFields,
  joinError,
  type JoinValues,
} from "./formIntegration";

const empty: JoinValues = { email: "", feedback: "", consent: false };
const Optional = () => <small>Optional</small>;

function Field({ label, children }: { label: ReactNode; children: ReactNode }) {
  return <label><span>{label}</span>{children}</label>;
}

export function JoinSection() {
  const [values, setValues] = useState<JoinValues>(empty);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const sending = useRef(false);

  const set = <K extends keyof JoinValues>(key: K, value: JoinValues[K]) => {
    setValues(previous => ({ ...previous, [key]: value }));
    if (error) setError("");
  };

  function submit(event: FormEvent<HTMLFormElement>) {
    if (sending.current) {
      event.preventDefault();
      return;
    }

    const issue = joinError(values);
    if (issue) {
      event.preventDefault();
      setError(issue);
      return;
    }

    if (!navigator.onLine) {
      event.preventDefault();
      setError("You appear to be offline. Reconnect and try again.");
      return;
    }

    // A native POST is deliberate: Google does not expose cross-origin fetch
    // responses, so only Google's own confirmation page can prove acceptance.
    setError("");
    sending.current = true;
    setSubmitting(true);
  }

  return (
    <section className="join">
      <div className="container">
        <div id="waitlist" className="join-card join-card--dark join-card--unified">
          <span id="feedback" className="anchor" aria-hidden="true" />
          <p className="eyebrow eyebrow--lime">Early access</p>
          <h2 className="display-sm">Let's build THROTTLE together.</h2>
          <p className="join-copy">Join the THROTTLE early-access list and help us build a better motorcycle ownership experience. Share your email and, if you like, tell us what we could do better.</p>
          <form
            className="native-form"
            action={FORM_RESPONSE_URL}
            method="POST"
            acceptCharset="UTF-8"
            onSubmit={submit}
            noValidate
            aria-busy={submitting}
          >
            <Field label={<>YOUR EMAIL ADDRESS <b aria-label="required">*</b></>}>
              <input
                name="emailAddress"
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                required
                maxLength={254}
                value={values.email}
                onChange={event => set("email", event.target.value)}
                placeholder="Enter your email address"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "waitlist-error" : undefined}
              />
            </Field>
            <Field label={<>HELP US BUILD THROTTLE BETTER <Optional /></>}>
              <textarea
                name={formFields.feedback}
                rows={5}
                maxLength={2000}
                value={values.feedback}
                onChange={event => set("feedback", event.target.value)}
                placeholder="Have an idea for an additional feature? Is there a motorcycle ownership problem you'd like us to solve? Or do you have any suggestions to make THROTTLE better? We'd love to hear your thoughts..."
              />
            </Field>
            <label className="consent">
              <input
                name={formFields.consent}
                type="checkbox"
                value={consentText}
                checked={values.consent}
                onChange={event => set("consent", event.target.checked)}
              />
              <span><strong>Stay connected</strong>I'd like to receive occasional updates about THROTTLE, product development and early access.</span>
            </label>
            {error && <p id="waitlist-error" className="form-error" role="alert">{error}</p>}
            <button type="submit" className="button" disabled={submitting}>
              {submitting ? "Submitting your response…" : "Join the THROTTLE community"}
              {!submitting && <ArrowRight size={16} aria-hidden="true" />}
            </button>
          </form>
          <p className="privacy-note"><ShieldCheck size={14} aria-hidden="true" />Google will show its own confirmation page when your response is received. Updates are sent only if you tick Stay connected; feedback is always optional.</p>
        </div>
      </div>
    </section>
  );
}
