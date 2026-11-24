import { useEffect, useState } from "react";
import { ArrowDown, ArrowRight, Menu, X, Wrench, Fuel, Users, Gauge, MessageSquarePlus } from "lucide-react";
import hero from "./assets/hero-ghats.webp";
import closing from "./assets/closing-riders.webp";
import { LAUNCH_TARGET_ISO } from "./config";
import { JoinSection } from "./JoinSection";


import { getCountdown, pad } from "./demo";
import { CommunityPreview, FuelPreview, GaragePreview } from "./ProductPreview";



function AnnouncementBar() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => { setNow(Date.now()); const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const c = getCountdown(LAUNCH_TARGET_ISO, now ?? 0);
  return (
    <div className="announce" role="timer" aria-live="off">
      <div className="container announce-inner">
        {now !== null && c.launched ? (
          <span className="announce-launch">THROTTLE IS HERE</span>
        ) : (
          <>
            <span className="announce-label">The wait ends in</span>
            <span className="announce-clock" aria-label={`${c.days} days ${c.hours} hours ${c.minutes} minutes ${c.seconds} seconds`}>
              {now === null ? "-- : -- : -- : --" : <>{pad(c.days)}<i>D</i> : {pad(c.hours)}<i>H</i> : {pad(c.minutes)}<i>M</i> : {pad(c.seconds)}<i>S</i></>}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

const nav = [{ href: "#home", label: "Home" }, { href: "#features", label: "Features" }, { href: "#about", label: "About" }];

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a href="#home" className="brand" aria-label="THROTTLE home"><Gauge size={22} aria-hidden="true" />THROTTLE</a>
        <nav className="desktop-nav" aria-label="Main">{nav.map(n => <a key={n.href} href={n.href}>{n.label}</a>)}</nav>
        <a href="#waitlist" className="button button--small header-cta">Join waitlist</a>
        <button type="button" className="menu-toggle" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(o => !o)}>
          {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </div>
      {open && (
        <nav id="mobile-nav" className="mobile-nav container" aria-label="Mobile">
          {[...nav, { href: "#waitlist", label: "Join waitlist" }].map(n => <a key={n.href} href={n.href} onClick={() => setOpen(false)}>{n.label}<ArrowRight size={16} aria-hidden="true" /></a>)}
        </nav>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="home" className="hero">
      <img className="hero-img" src={hero} alt="A rider on a motorcycle climbing a misty ghat road at sunrise" width={1920} height={1088} fetchPriority="high" />
      <div className="hero-shade" aria-hidden="true" />
      <div className="container hero-content">
        <p className="eyebrow eyebrow--lime">Built for Indian riders</p>
        <h1>Your motorcycle is more than a machine. <em>Ownership should feel just as good.</em></h1>
        <p className="hero-copy">Keeping track of maintenance, servicing, documents, fuel expenses and fellow riders shouldn't be complicated. THROTTLE brings your motorcycle ownership essentials together in one place.</p>
        <p className="hero-value">Manage your motorcycle. Track every expense. Find your riding community.</p>
        <div className="hero-actions">
          <a href="#features" className="button button--ghost">Explore features<ArrowDown size={16} aria-hidden="true" /></a>
          <a href="#waitlist" className="button">Join the waitlist<ArrowRight size={16} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
}

function Intro() {
  const items = [
    { icon: Wrench, title: "Manage your garage", text: "Odometer, maintenance, servicing and documents — one place." },
    { icon: Fuel, title: "Know your costs", text: "Log every fill-up and understand your real mileage." },
    { icon: Users, title: "Ride together", text: "Find riders, communities and upcoming rides near you." },
  ];
  return (
    <section id="about" className="intro">
      <div className="container intro-grid">
        <div>
          <p className="eyebrow">What is THROTTLE</p>
          <h2 className="display-md">A motorcycle ownership companion.</h2>
          <p className="lead">THROTTLE is designed to help riders manage their garage, stay on top of maintenance, understand fuel expenses and connect with fellow motorcycle enthusiasts.</p>
        </div>
        <ol className="pillars">
          {items.map((i, n) => (
            <li key={i.title}><span className="pillar-num">0{n + 1}</span><i.icon size={22} aria-hidden="true" /><div><h3>{i.title}</h3><p>{i.text}</p></div></li>
          ))}
        </ol>
      </div>
    </section>
  );
}

type Feature = "garage" | "fuel" | "community";
const features: { id: Feature; label: string; headline: string; text: string; why: string }[] = [
  { id: "garage", label: "My Garage", headline: "Your motorcycle, fully organised.", text: "Odometer, maintenance, servicing and documents — everything your motorcycle needs, in one garage.", why: "Stay ahead of your motorcycle instead of chasing paperwork and reminders." },
  { id: "fuel", label: "Fuel & Maps", headline: "Know what every ride costs.", text: "Track your fuel expenses, understand your motorcycle's mileage and explore fuel stops through maps.", why: "Understand where your money goes and make every kilometre count." },
  { id: "community", label: "Community", headline: "More than a motorcycle. A community.", text: "Discover riders, share experiences, find communities and explore upcoming rides.", why: "Because some of the best motorcycle memories begin with the people you meet along the way." },
];

function Features() {
  const [active, setActive] = useState<Feature>("garage");
  const f = features.find(x => x.id === active) ?? features[0];
  if (!f) return null;
  return (
    <section id="features" className="features">
      <div className="container">
        <div className="features-head">
          <p className="eyebrow eyebrow--lime">Try it yourself</p>
          <h2 className="display-md">Three things every rider needs.</h2>
          <p className="features-hint">Tap a feature, then use the phone — these are live, interactive previews with sample data.</p>
        </div>
        <div className="feature-nav" role="tablist" aria-label="THROTTLE features">
          {features.map((x, i) => (
            <button key={x.id} type="button" role="tab" id={`tab-${x.id}`} aria-controls="feature-panel" aria-selected={active === x.id} className={active === x.id ? "is-active" : ""} onClick={() => setActive(x.id)}>
              <span className="fn-num">0{i + 1}</span>{x.label}
            </button>
          ))}
        </div>
        <div id="feature-panel" role="tabpanel" aria-labelledby={`tab-${active}`} className="feature-stage">
          <div className="feature-copy" key={f.id}>
            <h3>{f.headline}</h3>
            <p>{f.text}</p>
            <p className="feature-why"><strong>Why it matters</strong>{f.why}</p>
          </div>
          <div className="feature-device">
            {active === "garage" && <GaragePreview />}
            {active === "fuel" && <FuelPreview />}
            {active === "community" && <CommunityPreview />}
          </div>
        </div>
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section className="closing">
      <img src={closing} alt="A group of riders with headlights on at a Himalayan pass at sunset" loading="lazy" width={1920} height={1088} />
      <div className="closing-shade" aria-hidden="true" />
      <div className="container closing-content">
        <h2>Every ride has a story. <em>Let's make ownership better, together.</em></h2>
        <p>Every kilometre has a memory. Every motorcycle has a journey. And every rider deserves a better ownership experience.</p>
        <p>THROTTLE is being built for people who live for the ride. We're building this with riders, for riders. Be part of the journey from day one.</p>
        <div className="hero-actions">
          <a href="#feedback" className="button button--ghost">Share your ideas<MessageSquarePlus size={16} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span className="brand"><Gauge size={18} aria-hidden="true" />THROTTLE</span>
        <span>Built in India, for riders. All previews use illustrative sample data.</span>
        <span>© 2026 THROTTLE</span>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <AnnouncementBar />
      <Header />
      <main id="main">
        <Hero />
        <Intro />
        <Features />
        <Closing />
        <JoinSection />
      </main>
      <Footer />
    </>
  );
}
