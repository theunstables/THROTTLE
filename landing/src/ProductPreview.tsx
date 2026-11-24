import { useState, type ReactNode } from "react";
import { Check, ChevronLeft, FileText, Fuel, Gauge, Heart, MapPin, MessageCircle, RotateCcw, Users, Wrench, Calendar, Route } from "lucide-react";
import {
  calculateFill, communities, completedMaintenance, documents, formatDate, fuelStations, initialFuel, initialOdometer,
  maintenance, people, posts, rupees, serviceHistory, upcomingRides, validateOdometer, type FuelEntry,
} from "./demo";

/* ---------- phone shell ---------- */
export function Phone({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="phone" aria-label={`Interactive ${title} preview`}>
      <div className="phone-notch" aria-hidden="true" />
      <div className="phone-status" aria-hidden="true"><span>9:41</span><span>THROTTLE</span></div>
      <div className="phone-title"><span>{title}</span><span className="demo-tag">Demo data</span></div>
      <div className="phone-body">{children}</div>
    </div>
  );
}

function Tabs<T extends string>({ items, value, onChange, label }: { items: { id: T; label: string }[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div className="app-tabs" role="tablist" aria-label={label}>
      {items.map(i => (
        <button key={i.id} type="button" role="tab" aria-selected={value === i.id} className={value === i.id ? "is-active" : ""} onClick={() => onChange(i.id)}>
          {i.label}
        </button>
      ))}
    </div>
  );
}

function Note({ text, why }: { text: string; why: string }) {
  return <div className="sub-note"><p>{text}</p><p className="sub-why"><strong>Why it matters · </strong>{why}</p></div>;
}

/* ---------- MY GARAGE ---------- */
type GarageTab = "maintenance" | "servicing" | "documents" | "odometer";
const garageTabs: { id: GarageTab; label: string }[] = [
  { id: "maintenance", label: "Maintenance" }, { id: "servicing", label: "Servicing" }, { id: "documents", label: "Documents" }, { id: "odometer", label: "Odometer" },
];
const garageCopy: Record<GarageTab, [string, string]> = {
  maintenance: ["Never lose track of what your motorcycle needs. Keep upcoming maintenance, reminders and completed tasks organised.", "Stay ahead of routine maintenance instead of remembering everything at the last minute."],
  servicing: ["Keep every service record in one place, from routine servicing to repairs and parts replacements.", "Understand your motorcycle's service history and avoid losing important records."],
  documents: ["Keep your essential motorcycle documents organised and know when they need attention.", "Important documents should be easy to find when you need them."],
  odometer: ["Keep an accurate record of how far your motorcycle has travelled.", "Your odometer helps you understand usage and plan kilometre-based maintenance."],
};

export function GaragePreview() {
  const [tab, setTab] = useState<GarageTab>("maintenance");
  return (
    <Phone title="My Garage">
        <div className="bike-strip"><Wrench size={16} aria-hidden="true" /><div><strong>Classic 350</strong><span>Sample motorcycle · 8,450 km</span></div></div>
        <Tabs label="My Garage sections" items={garageTabs} value={tab} onChange={setTab} />
        <div className="app-panel" role="tabpanel">
          <Note text={garageCopy[tab][0]} why={garageCopy[tab][1]} />
          {tab === "maintenance" && <Maintenance />}
          {tab === "servicing" && <Servicing />}
          {tab === "documents" && <Documents />}
          {tab === "odometer" && <Odometer />}
        </div>
      </Phone>
  );
}

function Maintenance() {
  const [done, setDone] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>("chain-clean");
  const toggle = (id: string) => setDone(d => (d.includes(id) ? d.filter(x => x !== id) : [...d, id]));
  return (
    <>
      <div className="row-head"><h4>Upcoming · {maintenance.length - done.length}</h4><button type="button" className="text-btn" onClick={() => { setDone([]); setSelected("chain-clean"); }}><RotateCcw size={13} aria-hidden="true" />Reset</button></div>
      <ul className="list">
        {maintenance.map(m => {
          const isDone = done.includes(m.id);
          return (
            <li key={m.id} className={`item ${selected === m.id ? "is-selected" : ""} ${isDone ? "is-done" : ""}`}>
              <button type="button" className="item-main" onClick={() => setSelected(m.id)} aria-expanded={selected === m.id}>
                <span><strong>{m.name}</strong><small>{isDone ? `Completed ${formatDate(new Date())}` : m.due}</small></span>
                {!isDone && m.soon && <em className="pill pill--warn">Due soon</em>}
                {isDone && <em className="pill pill--ok">Done</em>}
              </button>
              {selected === m.id && (
                <div className="item-detail">
                  <small>Schedule: {m.schedule}</small>
                  <button type="button" className="mini-btn" onClick={() => toggle(m.id)}><Check size={14} aria-hidden="true" />{isDone ? "Mark as not done" : "Mark as completed"}</button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <h4 className="list-label">Completed earlier</h4>
      <ul className="list list--quiet">{completedMaintenance.map(c => <li key={c.name + c.date}><Check size={13} aria-hidden="true" />{c.name}<small>{c.date}</small></li>)}</ul>
    </>
  );
}

function Servicing() {
  const [open, setOpen] = useState<string | null>(null);
  const entry = serviceHistory.find(s => s.id === open);
  if (entry) return (
    <div className="detail-view">
      <button type="button" className="text-btn" onClick={() => setOpen(null)}><ChevronLeft size={14} aria-hidden="true" />All services</button>
      <h4>{entry.title}</h4>
      <dl className="facts">
        <div><dt>Date</dt><dd>{entry.date}</dd></div>
        <div><dt>Workshop</dt><dd>{entry.workshop}</dd></div>
        <div><dt>Work done</dt><dd>{entry.work}</dd></div>
        <div><dt>Parts</dt><dd>{entry.parts.join(", ")}</dd></div>
        <div><dt>Cost</dt><dd>{rupees(entry.cost)}</dd></div>
        {entry.next && <div><dt>Next</dt><dd>{entry.next}</dd></div>}
      </dl>
    </div>
  );
  const total = serviceHistory.reduce((s, e) => s + e.cost, 0);
  return (
    <>
      <div className="stat-row"><div><small>Spent in 2026</small><strong>{rupees(total)}</strong></div><div><small>Next service</small><strong>12,500 km</strong></div></div>
      <ul className="list">
        {serviceHistory.map(s => (
          <li key={s.id} className="item"><button type="button" className="item-main" onClick={() => setOpen(s.id)}><span><strong>{s.title}</strong><small>{s.date} · {s.workshop}</small></span><b>{rupees(s.cost)}</b></button></li>
        ))}
      </ul>
    </>
  );
}

function Documents() {
  const [open, setOpen] = useState<string | null>(null);
  const doc = documents.find(d => d.id === open);
  if (doc) return (
    <div className="detail-view">
      <button type="button" className="text-btn" onClick={() => setOpen(null)}><ChevronLeft size={14} aria-hidden="true" />All documents</button>
      <div className="doc-card"><FileText size={22} aria-hidden="true" /><strong>{doc.name}</strong><span>{doc.detail}</span><span className="doc-sample">SAMPLE · NOT A REAL DOCUMENT</span></div>
      <dl className="facts"><div><dt>Expiry</dt><dd>{doc.expiry}</dd></div><div><dt>Status</dt><dd>{doc.status}</dd></div></dl>
      <p className="fine">Demo only. Nothing is uploaded or stored in this preview.</p>
    </div>
  );
  return (
    <ul className="list">
      {documents.map(d => (
        <li key={d.id} className="item"><button type="button" className="item-main" onClick={() => setOpen(d.id)}>
          <span><strong>{d.name}</strong><small>Expires {d.expiry}</small></span>
          <em className={`pill ${d.status === "Valid" ? "pill--ok" : "pill--warn"}`}>{d.status}</em>
        </button></li>
      ))}
    </ul>
  );
}

function Odometer() {
  const [history, setHistory] = useState(initialOdometer);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const last = history[0]?.reading ?? 0;
  const prev = history[1]?.reading ?? last;
  const submit = () => {
    const n = Number(value);
    const err = validateOdometer(last, n);
    setError(err);
    if (!err) { setHistory(h => [{ reading: n, date: formatDate(new Date()) }, ...h]); setValue(""); }
  };
  const max = Math.max(...history.map(h => h.reading)), min = Math.min(...history.map(h => h.reading));
  return (
    <>
      <div className="odo"><small>Current reading</small><strong>{last.toLocaleString("en-IN")}<span> km</span></strong><small>Updated {history[0]?.date} · +{(last - prev).toLocaleString("en-IN")} km since last</small></div>
      <form className="inline-form" onSubmit={e => { e.preventDefault(); submit(); }}>
        <label htmlFor="odo-in" className="sr-only">New odometer reading in km</label>
        <input id="odo-in" inputMode="numeric" placeholder="New reading (km)" value={value} onChange={e => setValue(e.target.value.replace(/[^\d]/g, ""))} />
        <button type="submit" className="mini-btn">Update</button>
      </form>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="bars" aria-label="Kilometre history">
        {[...history].slice(0, 6).reverse().map(h => (
          <div key={h.reading} className="bar"><span style={{ height: `${max === min ? 100 : 30 + ((h.reading - min) / (max - min)) * 70}%` }} /><small>{h.date.slice(0, 5)}</small></div>
        ))}
      </div>
      {history.length > initialOdometer.length && <button type="button" className="text-btn" onClick={() => { setHistory(initialOdometer); setError(null); }}><RotateCcw size={13} aria-hidden="true" />Reset</button>}
    </>
  );
}

/* ---------- FUEL & MAPS ---------- */
type FuelTab = "log" | "insights" | "map";
export function FuelPreview() {
  const [tab, setTab] = useState<FuelTab>("log");
  const [entries, setEntries] = useState<FuelEntry[]>(initialFuel);
  const [form, setForm] = useState({ odometer: "", litres: "", amount: "" });
  const [msg, setMsg] = useState<string | null>(null);
  const [station, setStation] = useState<string | null>(null);
  const last = entries[0]?.odometer ?? null;
  const result = calculateFill(last, Number(form.odometer), Number(form.litres), Number(form.amount));
  const add = () => {
    if (!result) { setMsg(last !== null && Number(form.odometer) <= last ? `Odometer must be above ${last.toLocaleString("en-IN")} km.` : "Fill in odometer, litres and amount."); return; }
    setEntries(e => [{ id: `u${e.length}`, date: formatDate(new Date()), odometer: Number(form.odometer), litres: Number(form.litres), amount: Number(form.amount), mileage: result.mileage }, ...e]);
    setForm({ odometer: "", litres: "", amount: "" }); setMsg(null);
  };
  const withMileage = entries.filter(e => e.mileage !== null);
  const avg = withMileage.length ? withMileage.reduce((s, e) => s + (e.mileage ?? 0), 0) / withMileage.length : null;
  const spend = entries.reduce((s, e) => s + e.amount, 0);
  const litres = entries.reduce((s, e) => s + e.litres, 0);
  const st = fuelStations.find(s => s.id === station);
  return (
    <Phone title="Fuel & Maps">
      <Tabs label="Fuel sections" value={tab} onChange={setTab} items={[{ id: "log", label: "Fuel log" }, { id: "insights", label: "Mileage" }, { id: "map", label: "Map" }]} />
      <div className="app-panel" role="tabpanel">
        {tab === "log" && <>
          <form className="fuel-form" onSubmit={e => { e.preventDefault(); add(); }}>
            {(["odometer", "litres", "amount"] as const).map(k => (
              <label key={k}><span>{k === "odometer" ? "Odometer (km)" : k === "litres" ? "Litres" : "Total (₹)"}</span>
                <input inputMode="decimal" value={form[k]} placeholder={k === "odometer" ? "8,800" : k === "litres" ? "10" : "1,050"} onChange={e => setForm(f => ({ ...f, [k]: e.target.value.replace(/[^\d.]/g, "") }))} /></label>
            ))}
            <div className="fuel-calc">
              <span>Price/L <b>{result ? `₹${result.pricePerLitre.toFixed(2)}` : "—"}</b></span>
              <span>Mileage <b>{result?.mileage != null ? `${result.mileage} km/L` : "—"}</b></span>
            </div>
            <button type="submit" className="mini-btn mini-btn--wide"><Fuel size={14} aria-hidden="true" />Add fill-up</button>
          </form>
          {msg && <p className="form-error" role="alert">{msg}</p>}
          <div className="row-head"><h4>History</h4><button type="button" className="text-btn" onClick={() => { setEntries(initialFuel); setMsg(null); }}><RotateCcw size={13} aria-hidden="true" />Reset</button></div>
          <ul className="list list--quiet">
            {entries.map(e => <li key={e.id}><span>{e.date} · {e.odometer.toLocaleString("en-IN")} km · {e.litres} L</span><small>{rupees(e.amount)} · ₹{(e.amount / e.litres).toFixed(1)}/L{e.mileage != null ? ` · ${e.mileage} km/L` : ""}</small></li>)}
          </ul>
        </>}
        {tab === "insights" && <>
          <div className="stat-row">
            <div><small>Avg mileage</small><strong>{avg ? `${avg.toFixed(1)} km/L` : "—"}</strong></div>
            <div><small>Fuel spend</small><strong>{rupees(spend)}</strong></div>
            <div><small>Litres</small><strong>{litres.toFixed(1)} L</strong></div>
          </div>
          <h4 className="list-label">Mileage trend (km/L)</h4>
          <div className="bars bars--lime">
            {[...withMileage].reverse().map(e => <div key={e.id} className="bar"><span style={{ height: `${Math.min(100, ((e.mileage ?? 0) / 45) * 100)}%` }} /><small>{e.mileage}</small></div>)}
          </div>
          <p className="fine">Mileage appears only when a previous full-tank reading exists. All figures are illustrative.</p>
        </>}
        {tab === "map" && <>
          <div className="map" role="group" aria-label="Illustrative map with sample fuel stops">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 40 Q30 30 50 50 T100 45" /><path d="M40 0 Q45 40 55 60 T60 100" /><path d="M0 80 Q40 70 100 85" /></svg>
            {fuelStations.map(s => (
              <button key={s.id} type="button" className={`pin ${station === s.id ? "is-active" : ""}`} style={{ left: `${s.x}%`, top: `${s.y}%` }} onClick={() => setStation(s.id)} aria-label={s.name}><MapPin size={20} aria-hidden="true" /></button>
            ))}
            <span className="map-tag">Illustrative map</span>
          </div>
          {st ? <div className="station"><strong>{st.name}</strong><small>{st.area} · Sample price ₹{st.price}/L</small><small className="fine">Not a verified business. Not live pricing.</small></div>
              : <p className="fine">Tap a marker to explore a sample fuel stop.</p>}
        </>}
      </div>
    </Phone>
  );
}

/* ---------- COMMUNITY ---------- */
type CommTab = "posts" | "rides" | "groups" | "people";
export function CommunityPreview() {
  const [tab, setTab] = useState<CommTab>("posts");
  const [liked, setLiked] = useState<string[]>([]);
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [extra, setExtra] = useState<Record<string, string[]>>({});
  const [draft, setDraft] = useState("");
  const [ride, setRide] = useState<string | null>(null);
  const [joined, setJoined] = useState<string[]>([]);
  const r = upcomingRides.find(x => x.id === ride);
  return (
    <Phone title="Community">
      <Tabs label="Community sections" value={tab} onChange={setTab} items={[{ id: "posts", label: "Posts" }, { id: "rides", label: "Rides" }, { id: "groups", label: "Groups" }, { id: "people", label: "People" }]} />
      <div className="app-panel" role="tabpanel">
        {tab === "posts" && posts.map(p => {
          const isLiked = liked.includes(p.id);
          const comments = [...p.comments, ...(extra[p.id] ?? [])];
          return (
            <article key={p.id} className="post">
              <header><strong>{p.author}</strong><small>{p.bike} · {p.place}</small></header>
              <div className={`post-photo post-photo--${p.id}`} role="img" aria-label={`Sample ride photo from ${p.place}`} />
              <p>{p.text}</p>
              <div className="post-actions">
                <button type="button" className={isLiked ? "is-liked" : ""} aria-pressed={isLiked} onClick={() => setLiked(l => isLiked ? l.filter(x => x !== p.id) : [...l, p.id])}><Heart size={15} aria-hidden="true" />{p.likes + (isLiked ? 1 : 0)}</button>
                <button type="button" aria-expanded={openComments === p.id} onClick={() => setOpenComments(o => o === p.id ? null : p.id)}><MessageCircle size={15} aria-hidden="true" />{comments.length}</button>
              </div>
              {openComments === p.id && (
                <div className="comments">
                  {comments.map((c, i) => <p key={i}>{c}</p>)}
                  <form className="inline-form" onSubmit={e => { e.preventDefault(); if (!draft.trim()) return; setExtra(x => ({ ...x, [p.id]: [...(x[p.id] ?? []), `You: ${draft.trim()}`] })); setDraft(""); }}>
                    <label htmlFor={`c-${p.id}`} className="sr-only">Write a comment</label>
                    <input id={`c-${p.id}`} placeholder="Write a comment (stays on this page)" value={draft} onChange={e => setDraft(e.target.value)} />
                    <button type="submit" className="mini-btn">Post</button>
                  </form>
                </div>
              )}
            </article>
          );
        })}
        {tab === "rides" && (r ? (
          <div className="detail-view">
            <button type="button" className="text-btn" onClick={() => setRide(null)}><ChevronLeft size={14} aria-hidden="true" />All rides</button>
            <h4>{r.title}</h4>
            <dl className="facts"><div><dt>Date</dt><dd>{r.date}</dd></div><div><dt>Meet</dt><dd>{r.meet}</dd></div><div><dt>Distance</dt><dd>{r.distance}</dd></div></dl>
            <p className="body-sm">{r.text}</p>
            <button type="button" className="mini-btn mini-btn--wide" onClick={() => setJoined(j => j.includes(r.id) ? j.filter(x => x !== r.id) : [...j, r.id])}>{joined.includes(r.id) ? "Interested ✓ (demo only)" : "I'm interested"}</button>
          </div>
        ) : (
          <ul className="list">{upcomingRides.map(x => <li key={x.id} className="item"><button type="button" className="item-main" onClick={() => setRide(x.id)}><span><strong>{x.title}</strong><small><Calendar size={11} aria-hidden="true" /> {x.date} · <Route size={11} aria-hidden="true" /> {x.distance}</small></span></button></li>)}</ul>
        ))}
        {tab === "groups" && <ul className="list">{communities.map(c => <li key={c.id} className="item"><div className="item-main"><span><strong>{c.name}</strong><small>{c.about}</small></span><em className="pill">{c.category}</em></div></li>)}</ul>}
        {tab === "people" && <ul className="list">{people.map(p => <li key={p.id} className="item"><div className="item-main"><Users size={18} aria-hidden="true" /><span><strong>{p.name}</strong><small>{p.bike} · {p.interests.join(" · ")}</small></span></div></li>)}</ul>}
        <p className="fine">Sample riders, posts and groups. Not real users.</p>
      </div>
    </Phone>
  );
}

export const featureIcons = { garage: Wrench, fuel: Fuel, community: Users, gauge: Gauge };
