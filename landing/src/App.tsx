import { useEffect, useState, type ReactNode } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Gauge, Menu, X } from "lucide-react";
import motorcycle from "./assets/classic-350.webp";
import indiaRoad from "./assets/india-road.webp";
import { LAUNCH_TARGET_ISO, WAITLIST_EMBED_URL, WAITLIST_FORM_URL } from "./config";
import { getCountdown } from "./demo";
import { BikeGarageDemo, CommunityFeatureDemo, FuelFeatureDemo } from "./ProductPreview";
import { Button, WaitlistButton } from "./ui";

const navigation = [
  { label: "What is THROTTLE", href: "#what-is-throttle" },
  { label: "Bike Garage", href: "#garage" },
  { label: "Community", href: "#community" },
  { label: "Fuel", href: "#fuel" },
];

const benefits = [
  { num: "01", title: "Know your motorcycle better.", detail: "Keep your bike profile, odometer and key documents organised in one place." },
  { num: "02", title: "Stay ahead of maintenance.", detail: "Stay ahead of avoidable maintenance surprises with clear kilometre intervals." },
  { num: "03", title: "Connect with riders and discover rides.", detail: "Share stories, join upcoming group rides and find riding communities." },
  { num: "04", title: "Understand your fuel expenses and mileage.", detail: "Turn every full tank into a transparent km/l and rupee cost log." },
];

function Brand() {
  return (
    <a className="brand" href="#top" aria-label="THROTTLE home">
      <Gauge size={24} />
      <span>THROTTLE</span>
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map(item => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <WaitlistButton className="header-cta">Join Waitlist</WaitlistButton>
        <Button
          className="menu-toggle"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-controls="mobile-navigation"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </Button>
      </div>
      {open && (
        <nav id="mobile-navigation" className="mobile-nav container" aria-label="Mobile navigation">
          {navigation.map(item => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
              <ArrowRight size={18} />
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

function LaunchCountdown() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const state = getCountdown(LAUNCH_TARGET_ISO, now);

  if (state.launched) {
    return (
      <div className="countdown countdown--launched" role="status">
        <p className="countdown-label">LAUNCH DAY · 1 JANUARY 2027</p>
        <strong>THE RIDE HAS BEGUN.</strong>
      </div>
    );
  }

  const units = [
    { value: String(state.days).padStart(2, "0"), label: "Days" },
    { value: String(state.hours).padStart(2, "0"), label: "Hours" },
    { value: String(state.minutes).padStart(2, "0"), label: "Minutes" },
    { value: String(state.seconds).padStart(2, "0"), label: "Seconds" },
  ];

  return (
    <div className="countdown" aria-label="Countdown to 1 January 2027 00:00 IST">
      <p className="countdown-label">THE WAIT ENDS IN</p>
      <div className="countdown-grid">
        {units.map(unit => (
          <div className="countdown-unit" key={unit.label}>
            <strong>{unit.value}</strong>
            <span>{unit.label}</span>
          </div>
        ))}
      </div>
      <p className="countdown-date">1 January 2027 · 00:00 IST</p>
    </div>
  );
}

function Feature({
  id,
  eyebrow,
  title,
  what,
  why,
  children,
  className = "",
}: {
  id: string;
  eyebrow: string;
  title: string;
  what: string;
  why: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`feature-section ${className}`} aria-labelledby={`${id}-title`}>
      <div className="container feature-layout">
        <div className="feature-copy">
          <p className="eyebrow">{eyebrow}</p>
          <h2 id={`${id}-title`}>{title}</h2>
          <p className="feature-what">{what}</p>
          <div className="why-block">
            <span>WHY IT MATTERS</span>
            <p>{why}</p>
          </div>
        </div>
        <div className="feature-demo">{children}</div>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header />
      <main id="main-content">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <img
            className="hero-image"
            src={motorcycle}
            alt="Royal Enfield Classic 350 parked beside a roadside café in India"
            fetchPriority="high"
          />
          <div className="hero-shade" />
          <div className="container hero-content">
            <p className="eyebrow">THROTTLE</p>
            <h1 id="hero-title">
              THE WAIT ENDS.
              <br />
              <em>THE RIDE BEGINS.</em>
            </h1>
            <p className="hero-description">
              Your motorcycle deserves more than just a garage. A better way to own, maintain and experience every ride is coming.
            </p>
            <LaunchCountdown />
            <div className="hero-actions">
              <WaitlistButton>JOIN THE WAITLIST</WaitlistButton>
              <a className="explore-link" href="#what-is-throttle">
                EXPLORE THROTTLE
                <ArrowDown size={18} />
              </a>
            </div>
          </div>
        </section>

        <section className="intro-section" id="what-is-throttle" aria-labelledby="intro-title">
          <div className="container intro-grid">
            <div className="intro-lead">
              <p className="eyebrow">WHAT IS THROTTLE</p>
              <h2 id="intro-title">
                One motorcycle.
                <br />
                <em>One home for everything.</em>
              </h2>
              <p className="intro-copy">
                THROTTLE is a motorcycle ownership companion designed to bring your bike’s garage, maintenance records, rider community and fuel
                expenses together in one place.
              </p>
              <figure className="intro-photo">
                <img src={indiaRoad} alt="The winding Gata Loops on the Leh–Manali Highway in Ladakh, India" loading="lazy" />
                <figcaption>
                  <span>LADAKH, INDIA</span>
                  <a
                    href="https://commons.wikimedia.org/wiki/File:Gata_Loops,Leh_Manali_Highway.jpg"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Narender9 · CC BY-SA 4.0
                    <ArrowUpRight size={13} />
                  </a>
                </figcaption>
              </figure>
            </div>
            <ol className="benefit-list">
              {benefits.map(item => (
                <li key={item.num}>
                  <span>{item.num}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <Feature
          id="garage"
          eyebrow="01 / BIKE GARAGE"
          title="Your motorcycle. Your records. All in one garage."
          what="Bike Garage keeps your motorcycle profile, odometer updates, upcoming maintenance tasks, servicing history and essential documents organised in one place."
          why="Your bike’s important information should never be scattered across notes, messages and forgotten paperwork."
        >
          <BikeGarageDemo />
        </Feature>

        <Feature
          id="community"
          eyebrow="02 / RIDER COMMUNITY"
          title="More than a motorcycle. A community."
          what="THROTTLE brings motorcycle enthusiasts together — share ride stories, discover upcoming group rides and join touring, weekend and wrenching communities."
          why="Great rides are better when you have people who know the roads, the stops and the bikes worth talking about."
          className="dark-section"
        >
          <CommunityFeatureDemo />
        </Feature>

        <Feature
          id="fuel"
          eyebrow="03 / FUEL & MILEAGE"
          title="Know your mileage. Control your fuel expenses."
          what="Record a full tank in seconds and see your exact fuel expenditure in rupees alongside transparent full-to-full km/l mileage."
          why="Understanding what your motorcycle actually costs to run makes every commute and weekend highway run clearer."
          className="soft-section"
        >
          <FuelFeatureDemo />
        </Feature>

        <section className="waitlist-section" id="waitlist" aria-labelledby="waitlist-title">
          <div className="container waitlist-inner">
            <p className="eyebrow">THROTTLE / EARLY ACCESS</p>
            <h2 id="waitlist-title">
              Your Next Ride
              <br />
              <em>Starts Here.</em>
            </h2>
            <p className="waitlist-copy">
              Join the early-access waitlist for launch updates ahead of 1 January 2027. No spam — just a note when THROTTLE is ready.
            </p>
            <div className="waitlist-embed">
              <iframe
                src={WAITLIST_EMBED_URL}
                title="THROTTLE early-access waitlist form"
                loading="lazy"
                width="100%"
                height="620"
              >
                Loading waitlist form…
              </iframe>
            </div>
            <div className="waitlist-fallback">
              <span>Prefer opening the form directly?</span>
              <a href={WAITLIST_FORM_URL} target="_blank" rel="noopener noreferrer">
                Open Google Form in a new tab
                <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="container">
          <Brand />
          <p>© {new Date().getFullYear()} THROTTLE · In development · All previews use illustrative sample data.</p>
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>
    </>
  );
}
