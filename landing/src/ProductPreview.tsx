import { useState } from "react";
import { ArrowDownLeft, ArrowRight, Bell, Check, ChevronRight, Fuel, Gauge, Heart, MapPin, MessageCircle, Plus, Send, Signal, Star, Wifi, Wrench, BatteryFull, Bike, UsersRound } from "lucide-react";
import bikePhoto from "./assets/garage-bike.webp";
import ridePhoto from "./assets/hero-motorcycle.webp";
import roadPhoto from "./assets/india-road.webp";
import { calculateFill, centres, initialFuel, maintenance, rupees, screens, type FuelEntry, type Screen } from "./demo";
import { Button } from "./ui";

const icons = { bike: Bike, fuel: Fuel, maintenance: Wrench, centres: MapPin, community: UsersRound };

export function Phone({ children, className = "", screen, onScreen }: { children: React.ReactNode; className?: string; screen?: Screen; onScreen?: (screen: Screen) => void }) {
  return <div className={`phone ${className}`}>
    <div className="phone__status" aria-hidden="true"><span>9:41</span><span className="phone__island" /><span><Signal size={12} /><Wifi size={12} /><BatteryFull size={16} /></span></div>
    <div className="phone__brand"><Gauge size={17} /><b>THROTTLE</b><span className="preview-tag">Concept demo</span></div>
    <div className="phone__viewport">{children}</div>
    {screen && onScreen && <nav className="phone__nav" aria-label="Preview screen navigation">{screens.map(item => { const Icon = icons[item.id]; return <Button key={item.id} className={screen === item.id ? "is-active" : ""} aria-label={`Preview ${item.label}`} aria-current={screen === item.id ? "page" : undefined} onClick={() => onScreen(item.id)}><Icon size={17} /><span>{item.id === "centres" ? "Nearby" : item.id === "maintenance" ? "Care" : item.id === "community" ? "Riders" : item.id === "fuel" ? "Fuel" : "Garage"}</span></Button>; })}</nav>}
    <div className="phone__home" aria-hidden="true" />
  </div>;
}

export function Dashboard() {
  return <div className="demo-screen dashboard">
    <div className="demo-greeting"><div><small>LET'S MAKE IT A GOOD RIDE</small><h3>Morning, Aarav <span className="greeting-dot">↗</span></h3></div><Bell size={18} /></div>
    <div className="bike-cover"><img src={bikePhoto} alt="Sample Yamaha motorcycle in a garage" /><span className="bike-cover__badge">MY MOTORCYCLE</span><div><small>2022 · 689 CC</small><h4>Yamaha MT-07</h4><span>“Midnight”</span></div></div>
    <div className="demo-metrics"><div><Gauge size={16} /><strong>12,450 <small>km</small></strong><span>Odometer</span></div><div><Fuel size={16} /><strong>27.0 <small>km/L</small></strong><span>Last tank mileage</span></div></div>
    <div className="demo-section-label"><h4>Next up</h4><span>550 km to go</span></div>
    <div className="service-reminder"><Wrench size={19} /><div><b>Engine oil & filter</b><span>Next service · 13,000 km</span></div><ArrowRight size={17} /></div>
    <div className="expense-line"><span>Fuel this month</span><strong>₹2,090</strong></div>
    <div className="mini-bars" aria-label="Sample fuel expenses over four weeks"><span className="bar-w1" /><span className="bar-w2" /><span className="bar-w3" /><span className="bar-w4" /></div>
    <p className="demo-disclaimer">Fictional rider · Sample data</p>
  </div>;
}

function GarageScreen() {
  return <div className="demo-screen"><div className="screen-heading"><div><small>YOUR DIGITAL GARAGE</small><h3>My Bike</h3></div><span className="avatar">AS</span></div>
    <div className="bike-cover bike-cover--garage"><img src={bikePhoto} alt="Fictional rider's sample Yamaha MT-07 motorcycle" /><div><small>2022 · 689 CC</small><h4>Yamaha MT-07</h4><span>“Midnight” · Owned since 2022</span></div></div>
    <div className="demo-metrics"><div><strong>12,450 <small>km</small></strong><span>Current odometer</span></div><div><strong>8,250 <small>km</small></strong><span>Ridden since purchase</span></div></div>
    <div className="status-line"><Check size={13} /> Maintenance on track</div>
    <div className="service-reminder"><Wrench size={19} /><div><b>Next service at 13,000 km</b><span>550 km remaining</span></div></div>
    <div className="demo-section-label"><h4>Service history</h4><span>2 records</span></div>
    <div className="history-row"><span className="history-icon"><Wrench size={14} /></span><div><b>Routine service</b><span>12 Sep · 11,000 km</span></div><strong>₹2,400</strong></div>
    <div className="history-row"><span className="history-icon"><Wrench size={14} /></span><div><b>Oil & filter change</b><span>08 Jun · 8,000 km</span></div><strong>₹1,800</strong></div>
  </div>;
}

function FuelScreen({ entries, onAdd }: { entries: FuelEntry[]; onAdd: (entry: FuelEntry) => void }) {
  const [adding, setAdding] = useState(false);
  const [odometer, setOdometer] = useState("12710");
  const [litres, setLitres] = useState("10");
  const [price, setPrice] = useState("105");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const latest = entries[0];
  if (!latest) return null;
  const calc = calculateFill(latest.odometer, Number(odometer), Number(litres), Number(price));
  const spend = entries.filter(entry => entry.month === "Nov").reduce((total, entry) => total + entry.litres * entry.price, 0);
  return <div className="demo-screen"><div className="screen-heading"><div><small>EVERY DROP ACCOUNTED FOR</small><h3>Fuel & Mileage</h3></div><Fuel size={21} /></div>
    {adding ? <form className="fuel-form" onSubmit={event => { event.preventDefault(); if (!calc) { setError("Enter an odometer above the last fill, with positive litres and price."); return; } onAdd({ odometer: Number(odometer), litres: Number(litres), price: Number(price), date: "21 Nov", month: "Nov", mileage: calc.mileage }); setAdding(false); setSaved(true); setError(""); }}>
      <div className="demo-section-label"><h4>Add fuel entry</h4><span>Full tank</span></div>
      <p className="form-note">Last fill: {latest.odometer.toLocaleString("en-IN")} km</p>
      <label>Odometer (km)<input type="number" required min={latest.odometer + 1} step="1" value={odometer} onChange={e => setOdometer(e.target.value)} /></label>
      <div className="form-pair"><label>Litres filled<input type="number" required min="0.01" step="0.01" value={litres} onChange={e => setLitres(e.target.value)} /></label><label>Price (₹/L)<input type="number" required min="0.01" step="0.01" value={price} onChange={e => setPrice(e.target.value)} /></label></div>
      <div className="calculation" aria-live="polite"><span>Full-to-full estimate</span><strong>{calc ? `${calc.mileage.toFixed(1)} km/L` : "—"}</strong><span>{calc ? `${rupees(calc.expense)} · ${Number(odometer) - latest.odometer} km ridden` : "Enter valid fill details"}</span></div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <Button type="submit" className="demo-primary"><Check size={15} />Save demo entry</Button><Button className="demo-text" onClick={() => { setAdding(false); setError(""); }}>Cancel</Button>
    </form> : <>
      <div className="fuel-summary"><small>LAST TANK MILEAGE</small><strong>{latest.mileage.toFixed(1)} <span>km/L</span></strong><span>Full-to-full calculation</span></div>
      <div className="expense-line"><span>November fuel spend</span><strong>{rupees(spend)}</strong></div>
      <div className="expense-chart" aria-label="Demo monthly fuel spending"><div><span className="month-bar month-bar--aug" /><small>Aug</small></div><div><span className="month-bar month-bar--sep" /><small>Sep</small></div><div><span className="month-bar month-bar--oct" /><small>Oct</small></div><div><span className={`month-bar month-bar--nov ${entries.length > 3 ? "has-entry" : ""}`} /><small>Nov</small></div></div>
      <Button className="demo-primary" onClick={() => { setOdometer(String(latest.odometer + 260)); setAdding(true); setSaved(false); }}><Plus size={16} />Add fuel entry</Button>
      {saved && <p className="demo-success" role="status">Demo entry added · {latest.mileage.toFixed(1)} km/L</p>}
      <div className="demo-section-label"><h4>Fuel history</h4><span>Full tanks</span></div>
      {entries.slice(0, 3).map((entry, i) => <div className="history-row" key={`${entry.odometer}-${i}`}><span className="history-icon"><Fuel size={14} /></span><div><b>{entry.litres} L · {entry.odometer.toLocaleString("en-IN")} km</b><span>{entry.date} · ₹{entry.price}/L</span></div><strong>{rupees(entry.price * entry.litres)}</strong></div>)}
    </>}
  </div>;
}

function MaintenanceScreen({ done, onToggle }: { done: string[]; onToggle: (id: string) => void }) {
  const completedCost = maintenance.filter(item => done.includes(item.id)).reduce((sum, item) => sum + item.expense, 0);
  return <div className="demo-screen"><div className="screen-heading"><div><small>A LITTLE CARE, A LONG WAY</small><h3>Smart Maintenance</h3></div><Wrench size={21} /></div>
    <div className="service-reminder"><Bell size={19} /><div><b>Next service · 13,000 km</b><span>550 km remaining · Demo reminder</span></div></div>
    <div className="demo-section-label"><h4>Bike care checklist</h4><span>{done.length}/4 complete</span></div>
    <div className="maintenance-list">{maintenance.map(item => <label key={item.id} className={done.includes(item.id) ? "task is-done" : "task"}><input type="checkbox" checked={done.includes(item.id)} onChange={() => onToggle(item.id)} /><div><b>{item.name}</b><span>{done.includes(item.id) ? "Completed in demo" : item.due}</span></div><small>{item.expense ? rupees(item.expense) : "Check"}</small></label>)}</div>
    <div className="expense-line"><span>Care expenses · sample total</span><strong>{rupees(4200 + completedCost)}</strong></div>
    <div className="demo-section-label"><h4>Service timeline</h4><span>Sample records</span></div>
    <div className="service-timeline">{maintenance.filter(item => done.includes(item.id)).map(item => <div key={item.id}><span className="timeline-dot" /><b>{item.name}</b><small>21 Nov · {rupees(item.expense)}</small></div>)}<div><span className="timeline-dot" /><b>Routine service</b><small>12 Sep · ₹2,400 · 11,000 km</small></div><div><span className="timeline-dot" /><b>Oil & filter change</b><small>08 Jun · ₹1,800 · 8,000 km</small></div></div>
  </div>;
}

function CentresScreen({ selected, onSelect }: { selected: number; onSelect: (index: number) => void }) {
  const centre = centres[selected];
  if (!centre) return null;
  return <div className="demo-screen"><div className="screen-heading"><div><small>AN EXPLORATION CONCEPT</small><h3>Service Centres</h3></div><MapPin size={21} /></div>
    <p className="map-disclaimer">Illustrative map · All places & ratings fictional</p>
    <div className="demo-map" aria-label="Illustrative service centre map"><span className="map-park">GREEN PARK</span><span className="map-road map-road--one" /><span className="map-road map-road--two" /><span className="map-road map-road--three" /><span className="map-area">DEMO NEIGHBOURHOOD</span><span className="you-pin" aria-label="Example rider location" />{centres.map((item, i) => <Button key={item.name} aria-label={`Show ${item.name}`} aria-pressed={selected === i} className={`map-pin ${item.pin} ${selected === i ? "is-selected" : ""}`} onClick={() => onSelect(i)}><Wrench size={16} /></Button>)}</div>
    <div className="selected-centre"><div><span className="avatar">{centre.initials}</span><div><h4>{centre.name}</h4><span><Star size={12} /> {centre.rating} · Fictional rating</span></div></div><p>{centre.services}</p><span className="centre-distance"><MapPin size={13} /> {centre.distance} away · Sample distance</span></div>
    <div className="demo-section-label"><h4>Sample service options</h4><span>3 places</span></div>
    {centres.map((item, i) => <Button key={item.name} className={`centre-row ${selected === i ? "is-selected" : ""}`} onClick={() => onSelect(i)}><span className="history-icon"><Wrench size={14} /></span><span><b>{item.name}</b><small>{item.distance} · Fictional listing</small></span><ChevronRight size={16} /></Button>)}
  </div>;
}

function CommunityScreen({ liked, onLike, comments, onComment }: { liked: boolean; onLike: () => void; comments: string[]; onComment: (text: string) => void }) {
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  return <div className="demo-screen"><div className="screen-heading"><div><small>STORIES FROM THE SADDLE</small><h3>Rider Community</h3></div><UsersRound size={21} /></div>
    <p className="map-disclaimer">Fictional profiles & posts · Sample activity</p>
    <article className="rider-post"><div className="post-author"><span className="avatar avatar--warm">MK</span><div><b>Meera Kapoor</b><small>Pune · Fictional rider</small></div><span>2h</span></div><p>Early start. Quiet roads. A chai stop that turned into the best part of the ride.</p><img src={ridePhoto} alt="Motorcycle parked outside a café, illustrating a fictional rider's post" loading="lazy" /><div className="post-actions"><Button aria-label="Like demo post" aria-pressed={liked} className={liked ? "is-liked" : ""} onClick={onLike}><Heart size={17} fill={liked ? "currentColor" : "none"} /><span>{24 + Number(liked)}</span></Button><Button aria-label="Show demo comments" aria-expanded={showComments} onClick={() => setShowComments(!showComments)}><MessageCircle size={17} /><span>{2 + comments.length}</span></Button><span>Weekend ride</span></div>
      {showComments && <div className="comments"><p><b>Kabir (fictional)</b> That looks like a great morning.</p><p><b>Aarav (fictional)</b> Always time for chai!</p>{comments.map((text, i) => <p key={i}><b>You (demo)</b> {text}</p>)}</div>}
      <form className="comment-form" onSubmit={event => { event.preventDefault(); if (!comment.trim()) return; onComment(comment.trim()); setComment(""); setShowComments(true); }}><input aria-label="Write a demo comment" placeholder="Add a demo comment…" value={comment} maxLength={200} onChange={event => setComment(event.target.value)} /><Button type="submit" aria-label="Post demo comment" disabled={!comment.trim()}><Send size={16} /></Button></form>
    </article>
    <article className="rider-post rider-post--second"><div className="post-author"><span className="avatar">RK</span><div><b>Rohan Khanna</b><small>Fictional rider · Road-trip journal</small></div></div><img src={roadPhoto} alt="Ladakh mountain road, illustrating a fictional road-trip journal" loading="lazy" /><p>Some roads stay with you long after the ride.</p></article>
  </div>;
}

export function ProductPreview({ screen, onScreen }: { screen: Screen; onScreen: (screen: Screen) => void }) {
  const [entries, setEntries] = useState(initialFuel);
  const [done, setDone] = useState<string[]>([]);
  const [selected, setSelected] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<string[]>([]);
  return <Phone screen={screen} onScreen={onScreen} className="showcase-phone"><div className="screen-transition" key={screen} role="tabpanel" id={`panel-${screen}`} aria-labelledby={`tab-${screen}`}>
    {screen === "bike" && <GarageScreen />}
    {screen === "fuel" && <FuelScreen entries={entries} onAdd={entry => setEntries(previous => [entry, ...previous])} />}
    {screen === "maintenance" && <MaintenanceScreen done={done} onToggle={id => setDone(previous => previous.includes(id) ? previous.filter(item => item !== id) : [...previous, id])} />}
    {screen === "centres" && <CentresScreen selected={selected} onSelect={setSelected} />}
    {screen === "community" && <CommunityScreen liked={liked} onLike={() => setLiked(previous => !previous)} comments={comments} onComment={text => setComments(previous => [...previous, text])} />}
  </div></Phone>;
}

export function DayReadout({ index }: { index: number }) {
  const content = [
    <><Gauge size={19} /><span>12,450 km<strong>Ready for the road</strong></span><Check size={17} /></>,
    <><Fuel size={19} /><span>10 litres · ₹105/L<strong>₹1,050 recorded</strong></span><Plus size={17} /></>,
    <><ArrowDownLeft size={19} /><span>260 km · full to full<strong>26.0 km/L</strong></span><span className="readout-bars"><i /><i /><i /></span></>,
    <><Bell size={19} /><span>Engine oil & filter<strong>Service at 13,000 km</strong></span><Wrench size={17} /></>,
    <><Check size={19} /><span>Routine service<strong>Record saved · ₹2,400</strong></span><span className="readout-date">12 SEP</span></>,
  ];
  return <div className="day-readout">{content[index]}</div>;
}