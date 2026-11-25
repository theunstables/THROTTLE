import { useState, type FormEvent } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { consentText, feedbackPrefill, waitlistError, submitWaitlist, type WaitlistValues } from "./formIntegration";

export function JoinSection() {
  const [values, setValues] = useState<WaitlistValues>({ email: "", city: "", age: "", feedback: "", consent: false });
  const [ideas, setIdeas] = useState({ features: "", problem: "", suggestions: "", email: "" });
  const [waitError, setWaitError] = useState(""); const [ideaError, setIdeaError] = useState("");
  const [waitState, setWaitState] = useState<"idle" | "sending" | "done">("idle"); const [ideaOpened, setIdeaOpened] = useState(false);
  const handoff = (url: string) => { const a = document.createElement("a"); a.href = url; a.target = "_blank"; a.rel = "noopener noreferrer"; a.click(); };
  async function register(e: FormEvent) {
    e.preventDefault(); const error = waitlistError(values); setWaitError(error ?? ""); if (error) return;
    setWaitState("sending");
    try { await submitWaitlist(values); setWaitState("done"); }
    catch { setWaitState("idle"); setWaitError("Couldn't send right now. Check your connection and try again."); }
  }
  function share(e: FormEvent) {
    e.preventDefault(); setIdeaError("");
    try { handoff(feedbackPrefill(ideas.features, ideas.problem, ideas.suggestions, ideas.email)); setIdeaOpened(true); }
    catch (error) { setIdeaError(error instanceof Error ? error.message : "Please check your answers."); }
  }
  return <section className="join"><div className="container join-grid">
    <div id="waitlist" className="join-card join-card--dark">
      <p className="eyebrow eyebrow--lime">Early access</p><h2 className="display-sm">Join the waitlist.</h2>
      <p className="join-copy">Be among the first riders to experience THROTTLE.</p>
      <form className="native-form" onSubmit={register}>
        <label><span>Email <b aria-label="required">*</b></span><input type="email" autoComplete="email" required maxLength={254} value={values.email} onChange={e => setValues({ ...values, email: e.target.value })} /></label>
        <div className="form-columns">
          <label><span>Which city are you riding from? <small>Optional</small></span><input autoComplete="address-level2" maxLength={120} value={values.city} onChange={e => setValues({ ...values, city: e.target.value })} /></label>
          <label><span>What is your age? <b aria-label="required">*</b></span><input type="number" inputMode="numeric" required min={1} max={120} step={1} value={values.age} onChange={e => setValues({ ...values, age: e.target.value })} /></label>
        </div>
        <label><span>Feedback or suggestions <small>Optional</small></span><textarea rows={2} maxLength={2000} value={values.feedback} onChange={e => setValues({ ...values, feedback: e.target.value })} /></label>
        <label className="consent"><input type="checkbox" checked={values.consent} onChange={e => setValues({ ...values, consent: e.target.checked })} /><span><strong>Stay Connected · Optional</strong>{consentText}</span></label>
        {waitError && <p className="form-error" role="alert">{waitError}</p>}
        <button type="submit" className="button" disabled={waitState === "sending"}>{waitState === "sending" ? "Joining…" : "Join the waitlist"}<ArrowRight size={16} aria-hidden="true" /></button>
        {waitState === "done" && <p className="handoff-status" role="status">You're on the list. We'll be in touch as THROTTLE gets closer to launch.</p>}
      </form>
      <p className="privacy-note"><ShieldCheck size={14} aria-hidden="true" />Your details go to the existing THROTTLE Google Form. Updates are optional; unsubscribe anytime.</p>
    </div>
    <div id="feedback" className="join-card">
      <p className="eyebrow">Build it with us</p><h2 className="display-sm">What should we build next?</h2>
      <p className="join-copy">THROTTLE is being built for riders. Tell us what we're missing, what you would love to see and how we can make it better.</p>
      <form className="native-form" onSubmit={share}>
        <label><span>What additional features would you like to see in THROTTLE?</span><textarea rows={2} maxLength={600} value={ideas.features} onChange={e => setIdeas({ ...ideas, features: e.target.value })} /></label>
        <label><span>What is one motorcycle ownership problem you wish could be solved?</span><textarea rows={2} maxLength={600} value={ideas.problem} onChange={e => setIdeas({ ...ideas, problem: e.target.value })} /></label>
        <label><span>Any ideas or suggestions to improve THROTTLE?</span><textarea rows={2} maxLength={600} value={ideas.suggestions} onChange={e => setIdeas({ ...ideas, suggestions: e.target.value })} /></label>
        <label><span>Email for a reply <small>Optional</small></span><input type="email" autoComplete="email" maxLength={254} value={ideas.email} onChange={e => setIdeas({ ...ideas, email: e.target.value })} /></label>
        {ideaError && <p className="form-error" role="alert">{ideaError}</p>}
        <button type="submit" className="button">Share feedback<ArrowRight size={16} aria-hidden="true" /></button>
        <p className="handoff-note">Your ideas open separately in the original Google Form. It still requires email and age before submission; feedback-only delivery with an optional email needs those requirements changed by the form owner. Updates remain optional.</p>
        {ideaOpened && <p className="handoff-status" role="status">Not submitted yet. Your ideas are prefilled in Google’s Feedback or Suggestions field. Complete its required questions and press Submit.</p>}
      </form>
    </div>
  </div></section>;
}
