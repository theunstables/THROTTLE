import { useEffect, useState, type MouseEvent } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Bike,
  Check,
  Fuel,
  Gauge,
  Instagram,
  Mail,
  MapPin,
  Menu,
  UsersRound,
  Warehouse,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import garageBike from "./assets/garage-bike.webp";
import heroMotorcycle from "./assets/hero-motorcycle.webp";
import indiaRoad from "./assets/india-road.webp";
import { CONTACT_EMAIL, INSTAGRAM_URL, WAITLIST_FORM_URL } from "./config";

const navigation = [
  { label: "Features", href: "#features" },
  { label: "Why THROTTLE", href: "#why-throttle" },
  { label: "For Indian riders", href: "#indian-riders" },
];

type Feature = {
  title: string;
  description: string;
  status: "In development" | "Exploring";
  icon: LucideIcon;
  className: string;
  image?: string;
};

const features: Feature[] = [
  {
    title: "Smart maintenance",
    description:
      "Keep track of servicing, maintenance schedules, expenses and upcoming reminders.",
    status: "In development",
    icon: Wrench,
    className: "feature-card--wide",
  },
  {
    title: "Mileage & fuel tracker",
    description:
      "Monitor fuel expenses, calculate real-world mileage and review fuel history.",
    status: "In development",
    icon: Fuel,
    className: "feature-card--standard",
  },
  {
    title: "Digital bike garage",
    description:
      "Keep your motorcycle details, service records, repair history and important documents together.",
    status: "In development",
    icon: Warehouse,
    className: "feature-card--garage",
    image: garageBike,
  },
  {
    title: "Service centre discovery",
    description:
      "Explore the idea of finding nearby motorcycle mechanics and service centres.",
    status: "Exploring",
    icon: MapPin,
    className: "feature-card--standard",
  },
  {
    title: "Rider community",
    description:
      "Connect with fellow riders, discover routes and share riding experiences.",
    status: "Exploring",
    icon: UsersRound,
    className: "feature-card--standard",
  },
];

const benefits = [
  "Stay on top of maintenance.",
  "Understand your motorcycle's running costs.",
  "Spend less time worrying and more time riding.",
];

function Brand() {
  return (
    <a className="brand" href="#top" aria-label="THROTTLE home">
      <span className="brand__mark" aria-hidden="true">
        <Gauge size={23} strokeWidth={2.4} />
      </span>
      <span>THROTTLE</span>
    </a>
  );
}

type WaitlistButtonProps = {
  className?: string;
  onClick?: () => void;
};

function WaitlistButton({ className = "", onClick }: WaitlistButtonProps) {
  const isConfigured = WAITLIST_FORM_URL.trim().length > 0;
  const classes = `button button--primary ${className}`.trim();

  if (isConfigured) {
    return (
      <a
        className={classes}
        href={WAITLIST_FORM_URL}
        target="_blank"
        rel="noreferrer"
        onClick={onClick}
      >
        Join the waitlist
        <ArrowUpRight aria-hidden="true" size={18} />
      </a>
    );
  }

  const showPlaceholder = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onClick?.();
    const notice = document.getElementById("waitlist-notice");
    notice?.scrollIntoView({ behavior: "smooth", block: "center" });
    notice?.focus({ preventScroll: true });
  };

  return (
    <button
      className={classes}
      type="button"
      aria-controls="waitlist-notice"
      onClick={showPlaceholder}
    >
      Join the waitlist
      <ArrowUpRight aria-hidden="true" size={18} />
    </button>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <WaitlistButton className="site-header__cta" />
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      {menuOpen && (
        <nav
          className="mobile-nav"
          id="mobile-navigation"
          aria-label="Mobile navigation"
        >
          <div className="container mobile-nav__inner">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
                <ArrowRight aria-hidden="true" size={18} />
              </a>
            ))}
            <WaitlistButton onClick={() => setMenuOpen(false)} />
          </div>
        </nav>
      )}
    </header>
  );
}

function App() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header />
      <main id="main-content">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <img
            className="hero__image"
            src={heroMotorcycle}
            alt="Classic motorcycle outside a rider café at sunset"
            fetchPriority="high"
          />
          <div className="hero__overlay" aria-hidden="true" />
          <div className="container hero__content">
            <p className="eyebrow hero__eyebrow">
              <span aria-hidden="true" /> Made for Indian riders
            </p>
            <h1 id="hero-title">
              Your motorcycle.
              <br />
              Your journey.
              <br />
              <span>Everything in one place.</span>
            </h1>
            <p className="hero__description">
              From maintenance and mileage to service records and riding
              communities, make every part of motorcycle ownership easier with
              THROTTLE.
            </p>
            <div className="hero__actions">
              <WaitlistButton />
              <a className="button button--secondary" href="#features">
                Explore features
                <ArrowDown aria-hidden="true" size={18} />
              </a>
            </div>
          </div>
          <div className="container hero__rail" aria-label="Product focus areas">
            <span>01 / Maintenance</span>
            <span>02 / Mileage</span>
            <span>03 / Community</span>
          </div>
        </section>

        <section className="section features" id="features" aria-labelledby="features-title">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">What we're building</p>
                <h2 id="features-title">Own the ride.<br />We'll help with the rest.</h2>
              </div>
              <p>
                Thoughtful tools for the everyday realities of motorcycle
                ownership — designed with riders, not assumptions.
              </p>
            </div>
            <div className="features__grid">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <article
                    className={`feature-card ${feature.className}`}
                    key={feature.title}
                  >
                    {feature.image && (
                      <>
                        <img
                          className="feature-card__image"
                          src={feature.image}
                          alt="Motorcycle in a well-equipped home garage"
                          loading="lazy"
                        />
                        <div className="feature-card__shade" aria-hidden="true" />
                      </>
                    )}
                    <div className="feature-card__content">
                      <div className="feature-card__topline">
                        <span className="feature-card__icon" aria-hidden="true">
                          <Icon size={24} strokeWidth={1.8} />
                        </span>
                        <span className="feature-card__number">
                          0{index + 1}
                        </span>
                      </div>
                      <div className="feature-card__copy">
                        <span className="status-pill">{feature.status}</span>
                        <h3>{feature.title}</h3>
                        <p>{feature.description}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
            <p className="features__note">
              <Bike aria-hidden="true" size={18} />
              These are proposed capabilities. Availability may change as we
              build and test with riders.
            </p>
          </div>
        </section>

        <section
          className="why-section"
          id="why-throttle"
          aria-labelledby="why-title"
        >
          <div className="container why-section__grid">
            <div className="why-section__intro">
              <p className="eyebrow eyebrow--dark">Why THROTTLE?</p>
              <h2 id="why-title">More than just owning a motorcycle.</h2>
              <p>
                Your motorcycle deserves more than occasional maintenance.
                THROTTLE is being built to make ownership simpler, more
                organised and more enjoyable.
              </p>
            </div>
            <ol className="benefit-list">
              {benefits.map((benefit, index) => (
                <li key={benefit}>
                  <span className="benefit-list__number">0{index + 1}</span>
                  <p>{benefit}</p>
                  <Check aria-hidden="true" size={24} />
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          className="india-section"
          id="indian-riders"
          aria-labelledby="india-title"
        >
          <img
            className="india-section__image"
            src={indiaRoad}
            alt="The winding Gata Loops road through the mountains of Ladakh, India"
            loading="lazy"
          />
          <div className="india-section__overlay" aria-hidden="true" />
          <div className="container india-section__content">
            <p className="eyebrow">Built for Indian riders</p>
            <h2 id="india-title">Made for the<br />roads we ride.</h2>
            <p>
              From everyday commutes to weekend rides and unforgettable road
              trips, THROTTLE is being shaped around the experiences of Indian
              motorcycle owners.
            </p>
          </div>
          <a
            className="photo-credit"
            href="https://commons.wikimedia.org/wiki/File:Gata_Loops,Leh_Manali_Highway.jpg"
            target="_blank"
            rel="noreferrer"
          >
            Gata Loops, Ladakh · Narender9 / CC BY-SA 4.0
          </a>
        </section>

        <section className="waitlist-section" id="waitlist" aria-labelledby="waitlist-title">
          <div className="waitlist-section__mark" aria-hidden="true">
            T
          </div>
          <div className="container waitlist-section__content">
            <p className="eyebrow">Ride with us from the start</p>
            <h2 id="waitlist-title">Be part of the ride.</h2>
            <p>
              We're building THROTTLE with motorcycle owners, not just for them.
              Join our early community and help shape what comes next.
            </p>
            <WaitlistButton />
            {!WAITLIST_FORM_URL.trim() && (
              <p className="waitlist-notice" id="waitlist-notice" role="note" tabIndex={-1}>
                <strong>The early-access waitlist is not open yet.</strong>
                Add the externally hosted Google Form link to
                <code>WAITLIST_FORM_URL</code> to activate this button. No details
                have been collected or saved.
              </p>
            )}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container site-footer__top">
          <div>
            <Brand />
            <p>Your Motorcycle. Your Journey.</p>
          </div>
          <div className="site-footer__links" aria-label="Contact and social links">
            {INSTAGRAM_URL.trim() ? (
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
                <Instagram aria-hidden="true" size={19} /> Instagram
              </a>
            ) : (
              <span title="Add INSTAGRAM_URL in src/config.ts">
                <Instagram aria-hidden="true" size={19} /> Instagram link coming soon
              </span>
            )}
            {CONTACT_EMAIL.trim() ? (
              <a href={`mailto:${CONTACT_EMAIL}`}>
                <Mail aria-hidden="true" size={19} /> {CONTACT_EMAIL}
              </a>
            ) : (
              <span title="Add CONTACT_EMAIL in src/config.ts">
                <Mail aria-hidden="true" size={19} /> Contact email coming soon
              </span>
            )}
          </div>
        </div>
        <div className="container site-footer__bottom">
          <p>© {new Date().getFullYear()} THROTTLE. All rights reserved.</p>
          <p>A motorcycle ownership companion in development.</p>
        </div>
      </footer>
    </>
  );
}

export default App;
