import { useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { consentText, joinError, submitJoin, type JoinValues } from "./formIntegration";

const empty: JoinValues = { name: "", email: "", city: "", age: "", bike: "", features: "", problem: "", suggestions: "", consent: false };
const Opt = () => <small>Optional</small>;
const Req = () => <b aria-label="required">*</b>;

function Field({ label, children }: { label: ReactNode; children: ReactNode }) {
  return <label><span>{label}</span>{children}</label>;
}

export function JoinSection() {
  const [v, setV] = useState<JoinValues>(empty);
  const [error, setError] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const set = <K extends keyof JoinValues>(k: K, x: JoinValues[K]) => setV(p => ({ ...p, [k]: x }));
  async function submit(e: FormEvent) {
    e.preventDefault(); const issue = joinError(v); setError(issue ?? ""); if (issue) return;
    setState("sending");
    try { await submitJoin(v); setState("sent"); setV(empty); }
    catch { setState("idle"); setError("Couldn't send right now. Check your connection and try again."); }
  }
  return (
    <section className="join">
      <div className="container">
        <div id="waitlist" className="join-card join-card--dark join-card--unified">
          <span id="feedback" className="anchor" aria-hidden="true" />
          <p className="eyebrow eyebrow--lime">Early access</p>
          <h2 className="display-sm">Let's build THROTTLE together.</h2>
          <p className="join-copy">Tell us a little about yourself, your motorcycle and what would make ownership better. Join the early-access list and help shape what THROTTLE becomes.</p>
          <form className="native-form" onSubmit={submit} noValidate>
            <fieldset><legend><i>A</i>About you</legend>
              <div className="form-columns form-columns--even">
                <Field label={<>Name <Opt /></>}><input autoComplete="name" maxLength={120} value={v.name} onChange={e => set("name", e.target.value)} placeholder="What should we call you?" /></Field>
                <Field label={<>Email address <Req /></>}><input type="email" autoComplete="email" required maxLength={254} value={v.email} onChange={e => set("email", e.target.value)} placeholder="you@example.com" /></Field>
                <Field label={<>Which city are you riding from? <Opt /></>}><input autoComplete="address-level2" maxLength={120} value={v.city} onChange={e => set("city", e.target.value)} placeholder="Your city" /></Field>
                <Field label={<>What is your age? <Req /></>}><input type="number" inputMode="numeric" required min={1} max={120} step={1} value={v.age} onChange={e => set("age", e.target.value)} placeholder="Age" /></Field>
              </div>
            </fieldset>
            <fieldset><legend><i>B</i>Your motorcycle</legend>
              <Field label={<>Motorcycle make and model <Opt /></>}><input maxLength={120} value={v.bike} onChange={e => set("bike", e.target.value)} placeholder="For example: Yamaha MT-07" /></Field>
            </fieldset>
            <fieldset><legend><i>C</i>Your ideas <small>All optional</small></legend>
              <Field label="What additional features would you like to see in THROTTLE?"><textarea rows={2} maxLength={600} value={v.features} onChange={e => set("features", e.target.value)} placeholder="For example: service reminders, expense analytics, ride planning, document alerts or something completely different..." /></Field>
              <Field label="What is one motorcycle ownership problem you wish could be solved?"><textarea rows={2} maxLength={600} value={v.problem} onChange={e => set("problem", e.target.value)} placeholder="Tell us about something that frustrates you as a motorcycle owner. What takes too much time, is difficult to track or could be made easier?" /></Field>
              <Field label="Any other ideas or suggestions?"><textarea rows={2} maxLength={600} value={v.suggestions} onChange={e => set("suggestions", e.target.value)} placeholder="Share any thoughts, improvements or features that would make THROTTLE more useful for riders..." /></Field>
            </fieldset>
            <label className="consent"><input type="checkbox" checked={v.consent} onChange={e => set("consent", e.target.checked)} /><span><strong>Stay Connected · Optional</strong>{consentText}</span></label>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button type="submit" className="button" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Join the THROTTLE early-access list"}<ArrowRight size={16} aria-hidden="true" /></button>
            {state === "sent" && <p className="handoff-status" role="status">Thanks — your answers have been sent to the THROTTLE team. We'll be in touch as early access opens.</p>}
          </form>
          <p className="privacy-note"><ShieldCheck size={14} aria-hidden="true" />Your answers go straight to the THROTTLE team's form. We only use them to plan early access and improve THROTTLE. Updates are sent only if you tick Stay Connected, and you can unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  );
}
