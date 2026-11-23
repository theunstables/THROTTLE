import { useState } from "react";
import { Check, Fuel, Gauge, Heart, MapPin, MessageCircle, RotateCcw, Send, Wrench } from "lucide-react";
import bikePhoto from "./assets/classic-350.webp";
import ridePhoto from "./assets/hero-motorcycle.webp";
import { calculateFill, centres, initialFuel, maintenance, records, rupees, type FuelEntry } from "./demo";
import { Button } from "./ui";

function PreviewLabel({ onReset }: { onReset?: () => void }) {
  return <div className="preview-label"><span>THROTTLE PRODUCT PREVIEW</span>{onReset && <Button className="reset" onClick={onReset} aria-label="Reset demo"><RotateCcw size={14} />Reset demo</Button>}</div>;
}
export function HeroPhone() {
  return <div className="hero-phone" aria-label="THROTTLE concept phone"><div className="phone-notch" /><span className="phone-logo">THROTTLE</span><img src={bikePhoto} alt="Illustrative Royal Enfield Classic 350" /><div className="hero-phone-copy"><small>YOUR CLASSIC 350</small><strong>Ready for<br />the everyday.</strong><span><Gauge size={15} />8,450 km</span><small>CONCEPT · FICTIONAL DATA</small></div></div>;
}
export function Dashboard() {
  return <div className="dashboard tool"><PreviewLabel /><div className="dashboard-heading"><div><small>YOUR DIGITAL GARAGE</small><h3>Morning, Aarav.</h3></div><span className="avatar">AS</span></div><div className="dashboard-bike"><img src={bikePhoto} alt="Illustrative green Royal Enfield Classic 350 at an Indian roadside café" loading="lazy" /><div><small>2024 · 349 CC</small><h4>Classic 350</h4><span>Royal Enfield · “Evergreen”</span></div></div><div className="dashboard-metrics"><div><Gauge size={18} /><strong>8,450 <small>km</small></strong><span>Current odometer</span></div><div><Fuel size={18} /><strong>35.0 <small>km/l</small></strong><span>Last full tank</span></div></div><div className="service-status"><Wrench size={19} /><div><b>Next service · 9,000 km</b><span>550 km remaining</span></div></div><div className="expense-line"><span>November fuel expenditure</span><strong>₹2,090</strong></div><p className="sample-note">Fictional rider & motorcycle records · In development</p></div>;
}
export function FuelDemo() {
  const [entries, setEntries] = useState<FuelEntry[]>(initialFuel);
  const [odometer, setOdometer] = useState("8800");
  const [litres, setLitres] = useState("10");
  const [price, setPrice] = useState("105");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const previous = entries[0]?.odometer ?? null;
  const result = calculateFill(previous, Number(odometer), Number(litres), Number(price));
  const reset = () => { setEntries(initialFuel); setOdometer("8800"); setLitres("10"); setPrice("105"); setSaved(false); setError(""); };
  return <div className="fuel-tool tool"><PreviewLabel onReset={reset} /><div className="tool-heading"><Fuel size={21} /><h3>Record a full tank</h3></div><form onSubmit={event => { event.preventDefault(); if (!result || !odometer || !litres || !price) { setError("Enter a higher odometer and positive litres and price."); return; } setEntries(old => [{ odometer: Number(odometer), litres: Number(litres), price: Number(price), date: "Just now", mileage: result.mileage }, ...old]); setSaved(true); setError(""); setOdometer(String(Number(odometer) + 350)); }}>
    <p className="form-note">Last full tank: {previous === null ? "No previous entry" : `${previous.toLocaleString("en-IN")} km`}</p>
    <label>Odometer (km)<input type="number" inputMode="numeric" min={previous === null ? 0 : previous + 1} step="1" required value={odometer} onChange={e => { setOdometer(e.target.value); setSaved(false); }} /></label>
    <div className="form-pair"><label>Litres filled<input type="number" inputMode="decimal" min="0.01" step="0.01" required value={litres} onChange={e => { setLitres(e.target.value); setSaved(false); }} /></label><label>Price (₹/litre)<input type="number" inputMode="decimal" min="0.01" step="0.01" required value={price} onChange={e => { setPrice(e.target.value); setSaved(false); }} /></label></div>
    <div className="calculation" aria-live="polite"><div><span>Fuel expenditure</span><strong>{result ? rupees(result.expense) : "—"}</strong></div><div><span>Full-to-full mileage</span><strong>{result?.mileage != null ? `${result.mileage.toFixed(1)} km/l` : "—"}</strong></div></div>
    <p className="formula">{result?.mileage != null && previous !== null ? `(${odometer} − ${previous}) km ÷ ${litres} litres = ${result.mileage.toFixed(1)} km/l` : "Mileage needs two full-tank odometer readings. Your first entry records the cost only."}</p>
    {error && <p role="alert" className="error">{error}</p>}<Button className="demo-primary" type="submit"><Check size={17} />Save sample entry</Button>
    <div className="feedback" role="status">{saved ? `Entry saved · ${rupees((entries[0]?.litres ?? 0) * (entries[0]?.price ?? 0))} · ${entries[0]?.mileage?.toFixed(1)} km/l` : "Local sample entries · Full tanks only"}</div>
  </form><h4 className="history-title">Fuel history</h4><div className="fuel-history">{entries.slice(0, 3).map(entry => <div className="history-row" key={entry.odometer}><div><b>{entry.odometer.toLocaleString("en-IN")} km · {entry.litres} litres</b><span>{entry.date} · ₹{entry.price}/litre</span></div><div><strong>{rupees(entry.litres * entry.price)}</strong><span>{entry.mileage === null ? "First full tank" : `${entry.mileage.toFixed(1)} km/l`}</span></div></div>)}</div></div>;
}
export function MaintenanceDemo() {
  const [done, setDone] = useState<string[]>([]);
  return <div className="maintenance-tool tool"><PreviewLabel onReset={() => setDone([])} /><div className="tool-heading"><Wrench size={21} /><h3>Classic 350 · Bike care</h3></div><div className="care-progress" role="status"><strong>{done.length === maintenance.length ? "All checks complete" : `${maintenance.length - done.length} checks remaining`}</strong><span>{done.length} / {maintenance.length}</span></div><div className="progress-track" aria-hidden="true">{maintenance.map(item => <span key={item.id} className={done.includes(item.id) ? "complete" : ""} />)}</div><div className="maintenance-list">{maintenance.map(item => <label key={item.id} className={`task ${done.includes(item.id) ? "is-done" : ""}`}><input type="checkbox" checked={done.includes(item.id)} onChange={() => setDone(old => old.includes(item.id) ? old.filter(id => id !== item.id) : [...old, item.id])} /><span><b>{item.name}</b><small>{done.includes(item.id) ? "Completed in this preview" : item.due}</small></span><Check size={17} /></label>)}</div><div className="care-history"><h4>Last service</h4><p>12 Sep · 7,500 km · Routine service</p><strong>₹2,400 recorded</strong></div><p className="sample-note">Illustrative intervals, not manufacturer recommendations.</p></div>;
}
export function GarageDemo() {
  const [filter, setFilter] = useState("All");
  const visible = records.filter(record => filter === "All" || record.category === filter);
  return <div className="garage-tool"><PreviewLabel /><div className="garage-heading"><div><small>EVERGREEN / 2024</small><h3>Royal Enfield Classic 350</h3></div><span>349 cc</span></div><dl className="ownership-details"><div><dt>Ownership</dt><dd>First owner · Jan 2024</dd></div><div><dt>Registration</dt><dd>Fictional · Not displayed</dd></div><div><dt>Recorded upkeep</dt><dd>{rupees(records.reduce((sum, item) => sum + item.cost, 0))}</dd></div></dl><div className="record-filter" aria-label="Filter motorcycle history">{["All", "Service", "Repair", "Ownership"].map(item => <Button key={item} aria-pressed={filter === item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</Button>)}</div><ol className="garage-timeline">{visible.map(record => <li key={record.title}><small>{record.date}</small><h4>{record.title}</h4><p>{record.detail}</p>{record.cost > 0 && <strong>{rupees(record.cost)}</strong>}</li>)}</ol><p className="sample-note">Fictional ownership, service & repair records</p></div>;
}
export function CentresDemo() {
  const [selected, setSelected] = useState(0);
  const centre = centres[selected];
  if (!centre) return null;
  return <div className="map-tool tool"><PreviewLabel onReset={() => setSelected(0)} /><div className="demo-map" aria-label="Illustrative service centre map"><span className="map-park">PARK</span><span className="map-road road-one" /><span className="map-road road-two" /><span className="map-road road-three" /><span className="map-caption">ILLUSTRATIVE NEIGHBOURHOOD</span>{centres.map((item, i) => <Button className={`map-pin ${item.pin} ${selected === i ? "selected" : ""}`} key={item.name} aria-label={`Show ${item.name}`} aria-pressed={selected === i} onClick={() => setSelected(i)}><Wrench size={19} /><span>{String.fromCharCode(65 + i)}</span></Button>)}</div><div className="selected-centre" aria-live="polite"><div><h3>{centre.name}</h3><span><MapPin size={16} />{centre.distance}</span></div><p>{centre.services}</p><small>Illustrative demo location · Sample distance · Not a real business</small></div></div>;
}
export function CommunityDemo() {
  const [liked, setLiked] = useState(false);
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<string[]>([]);
  const [text, setText] = useState("");
  return <div className="community-tool tool"><PreviewLabel onReset={() => { setLiked(false); setOpen(false); setComments([]); setText(""); }} /><article className="rider-post"><div className="post-author"><span className="avatar">MK</span><div><b>Meera Kapoor</b><small>Fictional rider · Weekend journal</small></div></div><p>Early start. Quiet roads. A chai stop that became the best part of the ride.</p><img src={ridePhoto} alt="Motorcycle outside a café, illustrating a fictional weekend ride" loading="lazy" /><div className="post-actions"><Button aria-label="Like sample post" aria-pressed={liked} className={liked ? "liked" : ""} onClick={() => setLiked(!liked)}><Heart size={20} fill={liked ? "currentColor" : "none"} />{liked ? "Liked" : "Like"} · {24 + Number(liked)}</Button><Button aria-expanded={open} onClick={() => setOpen(!open)}><MessageCircle size={20} />Comments · {1 + comments.length}</Button></div><div className="comment-space">{open ? <div className="comments"><p><b>Kabir (fictional)</b>Always time for chai!</p>{comments.map((comment, i) => <p key={i}><b>You (preview)</b>{comment}</p>)}</div> : <p className="sample-note">Fictional post & reactions · Local concept demo</p>}</div><form className="comment-form" onSubmit={event => { event.preventDefault(); if (!text.trim()) return; setComments(old => [...old, text.trim()]); setText(""); setOpen(true); }}><input aria-label="Write a sample comment" placeholder="Add a sample comment…" value={text} maxLength={200} onChange={event => setText(event.target.value)} /><Button type="submit" aria-label="Post sample comment" disabled={!text.trim()}><Send size={18} /></Button></form></article></div>;
}
