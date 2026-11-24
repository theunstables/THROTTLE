import { useState, type Dispatch, type SetStateAction } from "react";
import { Plus, RotateCcw } from "lucide-react";
import { formatDate, initialOdometer, validateOdometer } from "./demo";

function isoDate(date: string) { const [day, month, year] = date.split("/"); return `${year}-${month}-${day}`; }
export function validateReadingDate(date: string, latest: string, today: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0,10) !== date) return "Choose a valid date.";
  if (date < latest) return "Date cannot be before your latest reading.";
  if (date > today) return "Date cannot be in the future.";
  return null;
}
export function OdometerPreview({ history, setHistory }: { history: typeof initialOdometer; setHistory: Dispatch<SetStateAction<typeof initialOdometer>> }) {
  const [adding, setAdding] = useState(false);
  const [value, setValue] = useState(""); const [date, setDate] = useState(() => isoDate(formatDate(new Date())));
  const [error, setError] = useState<string | null>(null);
  const current = history[0]; if (!current) return null;
  const previous = history[1] ?? current; const first = history[history.length - 1] ?? current;
  const today = isoDate(formatDate(new Date()));
  const submit = () => {
    const issue = validateOdometer(current.reading, Number(value)) ?? validateReadingDate(date, isoDate(current.date), today);
    setError(issue); if (issue) return;
    const [year, month, day] = date.split("-"); setHistory(h => [{ reading: Number(value), date: `${day}/${month}/${year}` }, ...h]); setValue(""); setAdding(false);
  };
  const max = Math.max(...history.map(h => h.reading)); const min = Math.min(...history.map(h => h.reading));
  return <>
    <div className="odo"><small>Current odometer</small><strong>{current.reading.toLocaleString("en-IN")}<span> km</span></strong><small>Last recorded {current.date}</small></div>
    <div className="odo-metrics"><div><small>Previous reading</small><strong>{previous.reading.toLocaleString("en-IN")} km</strong><span>{previous.date}</span></div><div><small>Ridden since first log</small><strong>{(current.reading-first.reading).toLocaleString("en-IN")} km</strong><span>Since {first.date}</span></div></div>
    <div className="row-head"><button type="button" className="mini-btn" onClick={() => { setAdding(a => !a); setError(null); }}><Plus size={14} aria-hidden="true" />{adding ? "Cancel" : "Add reading"}</button><button type="button" className="text-btn" onClick={() => { setHistory(initialOdometer); setAdding(false); setError(null); setValue(""); setDate(today); }}><RotateCcw size={13} aria-hidden="true" />Reset demo</button></div>
    {adding && <form className="reading-form" onSubmit={e => { e.preventDefault(); submit(); }}>
      <label><span>New reading (km)</span><input type="number" inputMode="numeric" required min={1} step={1} max={9999999} value={value} onChange={e => setValue(e.target.value)} /></label>
      <label><span>Reading date</span><input type="date" required min={isoDate(current.date)} max={today} value={date} onChange={e => setDate(e.target.value)} /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button type="submit" className="mini-btn mini-btn--wide">Save reading</button>
    </form>}
    <h4 className="list-label">Mileage progression · km</h4>
    <div className="bars bars--lime" aria-label="Odometer progression chart">{[...history].slice(0,6).reverse().map((h,i) => <div key={`${h.date}-${i}`} className="bar" title={`${h.date}: ${h.reading} km`}><span style={{ height: `${max===min ? 80 : 20 + (h.reading-min)/(max-min)*60}%` }} /><small>{h.date.slice(0,5)}</small></div>)}</div>
    <h4 className="list-label">Recent readings</h4><ul className="list list--quiet">{history.slice(0,6).map((h,i) => <li key={`${h.date}-${i}`}><span>{h.date}</span><strong>{h.reading.toLocaleString("en-IN")} km</strong></li>)}</ul>
    <p className="fine">Illustrative motorcycle and readings. Changes stay in this preview.</p>
  </>;
}
