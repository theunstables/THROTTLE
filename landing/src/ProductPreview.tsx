import { useState, type ReactNode } from "react";
import { Check, ChevronLeft, FileText, Fuel, Gauge, List, LocateFixed, Map as MapIcon, RotateCcw, Search, Users, Wrench, X } from "lucide-react";
import {
  calculateFill, completedMaintenance, demoBike, documents, findStations, formatDate, initialFuel, initialOdometer, garageSectionOrder,
  maintenance, rupees, serviceHistory, type FuelEntry, type FuelType,
} from "./demo";
import bikeImg from "./assets/bike-mt07.webp";
import { OdometerPreview } from "./OdometerPreview";

/* ---------- phone shell: application UI only ---------- */
export function Phone({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="phone" role="group" aria-label={`Interactive ${title} preview`}>
      <div className="phone-screen">
        <div className="phone-island" aria-hidden="true" />
        <div className="phone-status" aria-hidden="true"><span>9:41</span><span className="phone-signal"><i /><i /><i /><b /></span></div>
        <div className="phone-title"><span>{title}</span><span className="demo-tag">Demo</span></div>
        <div className="phone-body">{children}</div>
        <div className="phone-home" aria-hidden="true" />
      </div>
    </div>
  );
}

/** Selected feature copy, shown beside the phone (never inside it). */
export function StageCopy({ intro, title, text, why }: { intro: ReactNode; title: string; text: string; why: string }) {
  return (
    <div className="stage-copy">
      {intro}
      <div className="sub-copy" key={title} aria-live="polite">
        <h4>{title}</h4>
        <p>{text}</p>
        <p className="sub-why"><strong>Why it matters</strong>{why}</p>
      </div>
    </div>
  );
}

export function Tabs<T extends string>({ items, value, onChange, label, className = "" }: { items: { id: T; label: string }[]; value: T; onChange: (v: T) => void; label: string; className?: string }) {
  return (
    <div className={`app-tabs ${className}`} role="tablist" aria-label={label}>
      {items.map(i => (
        <button key={i.id} type="button" role="tab" aria-selected={value === i.id} className={value === i.id ? "is-active" : ""} onClick={() => onChange(i.id)}>
          {i.label}
        </button>
      ))}
    </div>
  );
}

/* ---------- MY GARAGE ---------- */
type GarageTab = "maintenance" | "servicing" | "documents" | "odometer";
const garageTabs = garageSectionOrder.map(id => ({ id, label: id.charAt(0).toUpperCase() + id.slice(1) }));
const garageCopy: Record<GarageTab, [string, string]> = {
  odometer: ["Keep an accurate record of how far your motorcycle has travelled.", "Understand your motorcycle's usage and plan kilometre-based maintenance."],
  maintenance: ["Never lose track of what your motorcycle needs. Keep upcoming maintenance, reminders and completed tasks organised.", "Stay ahead of routine maintenance instead of remembering everything at the last minute."],
  servicing: ["Keep every service record in one place, from routine servicing to repairs and parts replacements.", "Understand your motorcycle's service history and avoid losing important records."],
  documents: ["Keep your essential motorcycle documents organised and know when they need attention.", "Important documents should be easy to find when you need them."],
};

export function GaragePreview({ intro }: { intro: ReactNode }) {
  const [tab, setTab] = useState<GarageTab>("odometer");
  const [odoHistory, setOdoHistory] = useState(initialOdometer);
  const label = garageTabs.find(t => t.id === tab)?.label ?? "";
  return (
    <div className="feature-stage">
      <StageCopy intro={intro} title={label} text={garageCopy[tab][0]} why={garageCopy[tab][1]} />
      <Phone title="My Garage">
        <div className="bike-hero">
          <img src={bikeImg} alt={`${demoBike.year} ${demoBike.make} ${demoBike.model} in ${demoBike.colour}`} width={900} height={563} />
          <div className="bike-hero-text">
            <small>{demoBike.year} · {demoBike.make}</small>
            <strong>{demoBike.make} {demoBike.model}</strong>
            <span>"{demoBike.nickname}" · {(odoHistory[0]?.reading ?? 8450).toLocaleString("en-IN")} km</span>
          </div>
        </div>
        <Tabs label="My Garage sections" items={garageTabs} value={tab} onChange={setTab} />
        <div className="app-panel" role="tabpanel" aria-label={label}>
          <div hidden={tab !== "odometer"}><OdometerPreview history={odoHistory} setHistory={setOdoHistory} /></div>
          <div hidden={tab !== "maintenance"}><Maintenance /></div>
          <div hidden={tab !== "servicing"}><Servicing /></div>
          <div hidden={tab !== "documents"}><Documents /></div>
        </div>
      </Phone>
    </div>
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

/* ---------- FUEL & MAPS ---------- */
type FuelTab = "map" | "log" | "insights";
const fuelCopy: Record<FuelTab, [string, string, string]> = {
  map: ["Find fuel", "Find nearby fuel stops on the map and compare prices for the fuel your motorcycle uses.", "Plan your next fill-up instead of guessing where to stop. Sample stations and prices only — nothing here is live."],
  log: ["Track expenses", "Log every fill-up with odometer, litres and amount. THROTTLE works out price per litre for you.", "Know exactly what your motorcycle costs to run, ride by ride."],
  insights: ["Understand mileage", "See your real-world mileage and fuel spend calculated from full-tank fill-ups.", "Spot changes in efficiency early — they're often the first sign your motorcycle needs attention."],
};
export function FuelPreview({ intro }: { intro: ReactNode }) {
  const [tab, setTab] = useState<FuelTab>("map");
  const [entries, setEntries] = useState<FuelEntry[]>(initialFuel);
  const [form, setForm] = useState({ odometer: "", litres: "", amount: "" });
  const [msg, setMsg] = useState<string | null>(null);
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
  const copy = fuelCopy[tab];
  return (
    <div className="feature-stage">
      <StageCopy intro={intro} title={copy[0]} text={copy[1]} why={copy[2]} />
      <Phone title="Fuel & Maps">
        <Tabs label="Fuel sections" value={tab} onChange={setTab} items={[{ id: "map", label: "Map" }, { id: "log", label: "Fuel log" }, { id: "insights", label: "Mileage" }]} />
        <div className={`app-panel ${tab === "map" ? "app-panel--flush" : ""}`} role="tabpanel">
          {tab === "map" && <FuelMap />}
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
        </div>
      </Phone>
    </div>
  );
}

function FuelMap() {
  const [view, setView] = useState<"map" | "list">("map");
  const [type, setType] = useState<FuelType>("petrol");
  const [query, setQuery] = useState("");
  const [station, setStation] = useState<string | null>("s1");
  const stations = findStations(query, type);
  const st = stations.find(s => s.id === station) ?? null;
  return (
    <div className="fuelmap">
      <div className="map-search">
        <Search size={15} aria-hidden="true" />
        <label className="sr-only" htmlFor="map-search">Search sample fuel stations</label>
        <input id="map-search" type="search" placeholder="Search fuel stations" value={query} onChange={e => setQuery(e.target.value)} />
        <div className="map-view-toggle" role="group" aria-label="Map or list">
          <button type="button" aria-pressed={view === "map"} aria-label="Map view" onClick={() => setView("map")}><MapIcon size={14} aria-hidden="true" /></button>
          <button type="button" aria-pressed={view === "list"} aria-label="List view" onClick={() => setView("list")}><List size={14} aria-hidden="true" /></button>
        </div>
      </div>
      <div className="fuel-chips" role="radiogroup" aria-label="Fuel type">
        {(["petrol", "premium"] as const).map(t => <button key={t} type="button" role="radio" aria-checked={type === t} onClick={() => setType(t)}>{t === "petrol" ? "Petrol" : "Premium petrol"}</button>)}
      </div>
      {view === "map" ? (
        <div className="map" role="group" aria-label="Illustrative road map with sample fuel stations">
          <svg viewBox="0 0 300 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <rect width="300" height="300" className="m-land" />
            <path className="m-water" d="M-10 205 C 60 185, 90 230, 150 222 S 250 190, 310 210 L310 250 C 250 232, 200 262, 150 258 S 50 228, -10 245Z" />
            <rect className="m-park" x="180" y="18" width="88" height="62" rx="6" />
            <rect className="m-park" x="20" y="262" width="70" height="40" rx="6" />
            {[["M0 92 C 80 80, 150 110, 300 96", 1], ["M118 0 C 112 90, 140 170, 128 300", 1], ["M0 168 L 300 150", 1], ["M215 0 L 235 300", 0], ["M40 0 L 62 300", 0], ["M0 40 L 300 52", 0], ["M0 285 L 300 275", 0], ["M150 96 L 225 150", 0]].map(([d, major], i) => (
              <g key={i}><path className={major ? "m-road-case" : "m-street-case"} d={d as string} /><path className={major ? "m-road" : "m-street"} d={d as string} /></g>
            ))}
            <text className="m-label" x="8" y="84">OUTER RING RD</text>
            <text className="m-label" x="134" y="30" transform="rotate(84 134 30)">HOSUR RD</text>
            <text className="m-label" x="8" y="160">OLD AIRPORT RD</text>
            <text className="m-label m-label--water" x="196" y="230">LAKE</text>
            <text className="m-label m-label--park" x="196" y="54">PARK</text>
          </svg>
          <span className="you-dot" style={{ left: "50%", top: "47%" }} aria-label="Your location (demo position)"><i /></span>
          {stations.map(s => (
            <button key={s.id} type="button" className={`fuel-pin ${station === s.id ? "is-active" : ""}`} style={{ left: `${s.x}%`, top: `${s.y}%` }} onClick={() => setStation(s.id)} aria-pressed={station === s.id} aria-label={`${s.name}, sample price ₹${s.prices[type]} per litre`}>
              <Fuel size={12} aria-hidden="true" />₹{s.prices[type].toFixed(1)}
            </button>
          ))}
          <button type="button" className="map-locate" aria-label="Centre on your demo location" onClick={() => setStation(null)}><LocateFixed size={15} aria-hidden="true" /></button>
          <span className="map-tag">Illustrative map · demo data</span>
        </div>
      ) : (
        <ul className="station-list" aria-label="Sample fuel stations, cheapest first">
          {stations.map(s => <li key={s.id}><button type="button" className={station === s.id ? "is-active" : ""} onClick={() => { setStation(s.id); setView("map"); }}><span><strong>{s.name}</strong><small>{s.area} · {s.distance}</small></span><b>₹{s.prices[type].toFixed(1)}/L</b></button></li>)}
          {stations.length === 0 && <li className="fine">No sample stations match "{query}".</li>}
        </ul>
      )}
      {st ? (
        <div className="station" aria-live="polite">
          <div className="station-head"><span><strong>{st.name}</strong><small>{st.area} · {st.distance} · {st.open}</small></span><button type="button" className="station-close" aria-label="Close station details" onClick={() => setStation(null)}><X size={14} aria-hidden="true" /></button></div>
          <div className="station-prices">{(["petrol", "premium"] as const).map(t => <span key={t} className={t === type ? "is-active" : ""}><small>{t === "petrol" ? "Petrol" : "Premium"}</small><b>₹{st.prices[t].toFixed(2)}</b></span>)}</div>
          <p className="fine">Illustrative demo data — not a real station, live price or GPS position.</p>
        </div>
      ) : <p className="fine map-hint">Tap a fuel marker to see sample station details.</p>}
    </div>
  );
}

export const featureIcons = { garage: Wrench, fuel: Fuel, community: Users, gauge: Gauge };
