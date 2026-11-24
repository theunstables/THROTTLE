import { useState } from "react";
import { Calendar, Check, FileText, Fuel, Gauge, Heart, MapPin, MessageCircle, RotateCcw, Send, Users, Wrench } from "lucide-react";
import bikePhoto from "./assets/classic-350.webp";
import ridePhoto from "./assets/hero-motorcycle.webp";
import {
  calculateFill,
  communities,
  documents,
  initialFuel,
  maintenance,
  rupees,
  serviceHistory,
  upcomingRides,
  type FuelEntry,
} from "./demo";
import { Button } from "./ui";

function PhoneFrame({ label, onReset, children }: { label: string; onReset?: () => void; children: React.ReactNode }) {
  return (
    <div className="phone-shell">
      <div className="phone-topbar">
        <span className="phone-badge">{label}</span>
        {onReset && (
          <Button className="reset" onClick={onReset} aria-label={`Reset ${label}`}>
            <RotateCcw size={13} />
            Reset
          </Button>
        )}
      </div>
      <div className="phone-body">{children}</div>
    </div>
  );
}

export function BikeGarageDemo() {
  const [view, setView] = useState<"bike" | "care" | "history" | "docs">("bike");
  const [odometer, setOdometer] = useState(8450);
  const [odoInput, setOdoInput] = useState("8620");
  const [odoStatus, setOdoStatus] = useState("");
  const [done, setDone] = useState<string[]>([]);

  const reset = () => {
    setView("bike");
    setOdometer(8450);
    setOdoInput("8620");
    setOdoStatus("");
    setDone([]);
  };

  const updateOdometer = (event: React.FormEvent) => {
    event.preventDefault();
    const next = Number(odoInput);
    if (!Number.isFinite(next) || next <= odometer) {
      setOdoStatus(`Enter a reading above ${odometer.toLocaleString("en-IN")} km.`);
      return;
    }
    setOdometer(next);
    setOdoInput(String(next + 150));
    setOdoStatus(`Odometer updated to ${next.toLocaleString("en-IN")} km.`);
  };

  return (
    <PhoneFrame label="BIKE GARAGE · PREVIEW" onReset={reset}>
      <div className="phone-pills" role="group" aria-label="Bike Garage views">
        {(
          [
            ["bike", "Bike & Odo"],
            ["care", "Maintenance"],
            ["history", "History"],
            ["docs", "Documents"],
          ] as const
        ).map(([id, text]) => (
          <Button key={id} className={view === id ? "active" : ""} aria-pressed={view === id} onClick={() => setView(id)}>
            {text}
          </Button>
        ))}
      </div>

      {view === "bike" && (
        <div className="phone-pane">
          <div className="bike-card">
            <img src={bikePhoto} alt="Illustrative green Royal Enfield Classic 350" loading="lazy" />
            <div>
              <small>2024 · 349 CC</small>
              <h4>Royal Enfield Classic 350</h4>
              <span>“Evergreen” · First owner</span>
            </div>
          </div>
          <div className="odo-display">
            <span>
              <Gauge size={16} /> Current odometer
            </span>
            <strong>{odometer.toLocaleString("en-IN")} km</strong>
          </div>
          <form className="odo-form" onSubmit={updateOdometer}>
            <label>
              Update sample odometer (km)
              <div className="odo-row">
                <input
                  type="number"
                  inputMode="numeric"
                  min={odometer + 1}
                  step="1"
                  value={odoInput}
                  onChange={e => setOdoInput(e.target.value)}
                />
                <Button className="demo-primary" type="submit">
                  Update
                </Button>
              </div>
            </label>
            {odoStatus && (
              <p className="feedback" role="status">
                {odoStatus}
              </p>
            )}
          </form>
          <p className="sample-note">Illustrative demo motorcycle · Local preview only</p>
        </div>
      )}

      {view === "care" && (
        <div className="phone-pane">
          <div className="care-progress" role="status">
            <strong>{done.length === maintenance.length ? "All tasks complete" : `${maintenance.length - done.length} upcoming`}</strong>
            <span>
              {done.length} / {maintenance.length}
            </span>
          </div>
          <div className="progress-track" aria-hidden="true">
            {maintenance.map(item => (
              <span key={item.id} className={done.includes(item.id) ? "complete" : ""} />
            ))}
          </div>
          <div className="maintenance-list">
            {maintenance.map(item => (
              <label key={item.id} className={`task ${done.includes(item.id) ? "is-done" : ""}`}>
                <input
                  type="checkbox"
                  checked={done.includes(item.id)}
                  onChange={() => setDone(old => (old.includes(item.id) ? old.filter(id => id !== item.id) : [...old, item.id]))}
                />
                <span>
                  <b>{item.name}</b>
                  <small>{done.includes(item.id) ? "Completed in preview" : item.due}</small>
                </span>
                <Check size={16} />
              </label>
            ))}
          </div>
          <p className="sample-note">Illustrative maintenance intervals · Not manufacturer advice</p>
        </div>
      )}

      {view === "history" && (
        <div className="phone-pane">
          <div className="history-summary">
            <span>
              <Wrench size={15} /> Recorded upkeep
            </span>
            <strong>{rupees(serviceHistory.reduce((sum, item) => sum + item.cost, 0))}</strong>
          </div>
          <ol className="garage-timeline">
            {serviceHistory.map(record => (
              <li key={record.title}>
                <small>{record.date}</small>
                <h4>{record.title}</h4>
                <p>{record.detail}</p>
                <strong>{rupees(record.cost)}</strong>
              </li>
            ))}
          </ol>
          <p className="sample-note">Illustrative service records in INR</p>
        </div>
      )}

      {view === "docs" && (
        <div className="phone-pane">
          <div className="doc-list">
            {documents.map(doc => (
              <div className="doc-row" key={doc.id}>
                <div>
                  <b>
                    <FileText size={15} /> {doc.name}
                  </b>
                  <small>{doc.expiry}</small>
                </div>
                <span className={`doc-status ${doc.status === "Due soon" ? "warn" : ""}`}>{doc.status}</span>
              </div>
            ))}
          </div>
          <p className="sample-note">Illustrative demo documents · No personal data stored</p>
        </div>
      )}
    </PhoneFrame>
  );
}

export function CommunityFeatureDemo() {
  const [view, setView] = useState<"posts" | "rides" | "groups">("posts");
  const [liked, setLiked] = useState(false);
  const [openComments, setOpenComments] = useState(false);
  const [comments, setComments] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [joinedRides, setJoinedRides] = useState<string[]>([]);
  const [joinedGroups, setJoinedGroups] = useState<string[]>(["weekend"]);

  const reset = () => {
    setView("posts");
    setLiked(false);
    setOpenComments(false);
    setComments([]);
    setText("");
    setJoinedRides([]);
    setJoinedGroups(["weekend"]);
  };

  return (
    <PhoneFrame label="RIDER COMMUNITY · PREVIEW" onReset={reset}>
      <div className="phone-pills" role="group" aria-label="Rider Community views">
        {(
          [
            ["posts", "Posts"],
            ["rides", "Upcoming Rides"],
            ["groups", "Communities"],
          ] as const
        ).map(([id, textLabel]) => (
          <Button key={id} className={view === id ? "active" : ""} aria-pressed={view === id} onClick={() => setView(id)}>
            {textLabel}
          </Button>
        ))}
      </div>

      {view === "posts" && (
        <div className="phone-pane">
          <article className="rider-post">
            <div className="post-author">
              <span className="avatar">MK</span>
              <div>
                <b>Meera Kapoor</b>
                <small>Fictional rider · Weekend journal</small>
              </div>
            </div>
            <p>Early start. Quiet roads. A chai stop that became the best part of the ride.</p>
            <img src={ridePhoto} alt="Motorcycle parked outside a café, illustrating a sample weekend ride" loading="lazy" />
            <div className="post-actions">
              <Button aria-label="Like sample post" aria-pressed={liked} className={liked ? "liked" : ""} onClick={() => setLiked(!liked)}>
                <Heart size={18} fill={liked ? "currentColor" : "none"} />
                {liked ? "Liked" : "Like"} · {24 + Number(liked)}
              </Button>
              <Button aria-expanded={openComments} onClick={() => setOpenComments(!openComments)}>
                <MessageCircle size={18} />
                Comments · {1 + comments.length}
              </Button>
            </div>
            <div className="comment-space">
              {openComments ? (
                <div className="comments">
                  <p>
                    <b>Kabir (fictional)</b> Always time for chai!
                  </p>
                  {comments.map((comment, i) => (
                    <p key={i}>
                      <b>You (preview)</b> {comment}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="sample-note">Fictional post & local reactions</p>
              )}
            </div>
            <form
              className="comment-form"
              onSubmit={event => {
                event.preventDefault();
                if (!text.trim()) return;
                setComments(old => [...old, text.trim()]);
                setText("");
                setOpenComments(true);
              }}
            >
              <input
                aria-label="Write a sample comment"
                placeholder="Add a sample comment…"
                value={text}
                maxLength={200}
                onChange={event => setText(event.target.value)}
              />
              <Button type="submit" aria-label="Post sample comment" disabled={!text.trim()}>
                <Send size={16} />
              </Button>
            </form>
          </article>
        </div>
      )}

      {view === "rides" && (
        <div className="phone-pane">
          <div className="ride-list">
            {upcomingRides.map(ride => {
              const going = joinedRides.includes(ride.id);
              return (
                <div className="ride-card" key={ride.id}>
                  <div className="ride-meta">
                    <h4>{ride.title}</h4>
                    <span>
                      <Calendar size={14} /> {ride.date}
                    </span>
                    <span>
                      <MapPin size={14} /> {ride.meet}
                    </span>
                    <small>{ride.distance}</small>
                  </div>
                  <Button
                    className={going ? "demo-primary" : "ride-join"}
                    aria-pressed={going}
                    onClick={() => setJoinedRides(old => (going ? old.filter(id => id !== ride.id) : [...old, ride.id]))}
                  >
                    {going ? "Interested ✓" : "Join ride"}
                  </Button>
                </div>
              );
            })}
          </div>
          <p className="sample-note">Illustrative group rides · Local preview only</p>
        </div>
      )}

      {view === "groups" && (
        <div className="phone-pane">
          <div className="group-list">
            {communities.map(group => {
              const joined = joinedGroups.includes(group.id);
              return (
                <div className="group-card" key={group.id}>
                  <div>
                    <small>{group.category}</small>
                    <h4>
                      <Users size={15} /> {group.name}
                    </h4>
                    <p>{group.members}</p>
                  </div>
                  <Button
                    className={joined ? "demo-primary" : "ride-join"}
                    aria-pressed={joined}
                    onClick={() => setJoinedGroups(old => (joined ? old.filter(id => id !== group.id) : [...old, group.id]))}
                  >
                    {joined ? "Joined" : "Join"}
                  </Button>
                </div>
              );
            })}
          </div>
          <p className="sample-note">Illustrative riding communities · Local preview only</p>
        </div>
      )}
    </PhoneFrame>
  );
}

export function FuelFeatureDemo() {
  const [entries, setEntries] = useState<FuelEntry[]>(initialFuel);
  const [odometer, setOdometer] = useState("8800");
  const [litres, setLitres] = useState("10");
  const [price, setPrice] = useState("105");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const previous = entries[0]?.odometer ?? null;
  const result = calculateFill(previous, Number(odometer), Number(litres), Number(price));

  const reset = () => {
    setEntries(initialFuel);
    setOdometer("8800");
    setLitres("10");
    setPrice("105");
    setSaved(false);
    setError("");
  };

  return (
    <PhoneFrame label="FUEL & MILEAGE · PREVIEW" onReset={reset}>
      <div className="phone-pane">
        <div className="tool-heading">
          <Fuel size={19} />
          <h3>Record a full tank</h3>
        </div>
        <form
          className="fuel-form"
          onSubmit={event => {
            event.preventDefault();
            if (!result || !odometer || !litres || !price) {
              setError("Enter a higher odometer and positive litres and price.");
              return;
            }
            setEntries(old => [
              { odometer: Number(odometer), litres: Number(litres), price: Number(price), date: "Just now", mileage: result.mileage },
              ...old,
            ]);
            setSaved(true);
            setError("");
            setOdometer(String(Number(odometer) + 350));
          }}
        >
          <p className="form-note">Last full tank: {previous === null ? "No previous entry" : `${previous.toLocaleString("en-IN")} km`}</p>
          <label>
            Odometer (km)
            <input
              type="number"
              inputMode="numeric"
              min={previous === null ? 0 : previous + 1}
              step="1"
              required
              value={odometer}
              onChange={e => {
                setOdometer(e.target.value);
                setSaved(false);
              }}
            />
          </label>
          <div className="form-pair">
            <label>
              Litres filled
              <input
                type="number"
                inputMode="decimal"
                min="0.01"
                step="0.01"
                required
                value={litres}
                onChange={e => {
                  setLitres(e.target.value);
                  setSaved(false);
                }}
              />
            </label>
            <label>
              Price (₹/litre)
              <input
                type="number"
                inputMode="decimal"
                min="0.01"
                step="0.01"
                required
                value={price}
                onChange={e => {
                  setPrice(e.target.value);
                  setSaved(false);
                }}
              />
            </label>
          </div>
          <div className="calculation" aria-live="polite">
            <div>
              <span>Fuel expenditure</span>
              <strong>{result ? rupees(result.expense) : "—"}</strong>
            </div>
            <div>
              <span>Full-to-full mileage</span>
              <strong>{result?.mileage != null ? `${result.mileage.toFixed(1)} km/l` : "—"}</strong>
            </div>
          </div>
          <p className="formula">
            {result?.mileage != null && previous !== null
              ? `(${odometer} − ${previous}) km ÷ ${litres} L = ${result.mileage.toFixed(1)} km/l`
              : "Mileage needs two full-tank odometer readings."}
          </p>
          {error && (
            <p role="alert" className="error">
              {error}
            </p>
          )}
          <Button className="demo-primary" type="submit">
            <Check size={16} />
            Save sample entry
          </Button>
          <div className="feedback" role="status">
            {saved
              ? `Entry saved · ${rupees((entries[0]?.litres ?? 0) * (entries[0]?.price ?? 0))} · ${entries[0]?.mileage?.toFixed(1)} km/l`
              : "Local sample entries · Full tanks only"}
          </div>
        </form>
        <h4 className="history-title">Fuel history</h4>
        <div className="fuel-history">
          {entries.slice(0, 3).map(entry => (
            <div className="history-row" key={entry.odometer}>
              <div>
                <b>
                  {entry.odometer.toLocaleString("en-IN")} km · {entry.litres} L
                </b>
                <span>
                  {entry.date} · ₹{entry.price}/L
                </span>
              </div>
              <div>
                <strong>{rupees(entry.litres * entry.price)}</strong>
                <span>{entry.mileage === null ? "First full tank" : `${entry.mileage.toFixed(1)} km/l`}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PhoneFrame>
  );
}
