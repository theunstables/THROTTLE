import { useEffect, useState } from "react";
import { ArrowDown, ArrowRight, Check, Gauge, Instagram, Mail, Menu, X, ArrowUpRight } from "lucide-react";
import heroMotorcycle from "./assets/hero-motorcycle.webp";
import indiaRoad from "./assets/india-road.webp";
import { CONTACT_EMAIL, INSTAGRAM_URL } from "./config";
import { screens, type Screen } from "./demo";
import { Dashboard, DayReadout, Phone, ProductPreview } from "./ProductPreview";
import { Button, WaitlistButton } from "./ui";

const navigation = [
  { label: "The experience", href: "#experience" },
  { label: "A day with THROTTLE", href: "#your-day" },
  { label: "For Indian riders", href: "#indian-riders" },
];
const journey = [
  { time: "07:00", title: "Check in. Head out.", text: "A quick look at your bike, its kilometres and what's coming up." },
  { time: "08:15", title: "Fill up. Log it.", text: "Record the litres, the price and the odometer while it's fresh." },
  { time: "08:16", title: "Know what it costs.", text: "See the mileage from your last full tank and the month's fuel spend." },
  { time: "18:00", title: "Stay a ride ahead.", text: "A maintenance reminder keeps the next service on your radar." },
  { time: "NEXT SERVICE", title: "Keep the whole story.", text: "Service details and expenses stay with the bike, not in a forgotten receipt." },
];

function Brand() {
  return <a className="brand" href="#top" aria-label="THROTTLE home"><span className="brand__mark"><Gauge size={23} aria-hidden="true" /></span><span>THROTTLE</span></a>;
}
function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  return <header className="site-header"><div className="container site-header__inner"><Brand /><nav className="desktop-nav" aria-label="Main navigation">{navigation.map(item => <a key={item.href} href={item.href}>{item.label}</a>)}</nav><WaitlistButton className="site-header__cta" /><Button className="menu-toggle" aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button></div>{menuOpen && <nav className="mobile-nav container" id="mobile-navigation" aria-label="Mobile navigation">{navigation.map(item => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}<ArrowRight size={16} /></a>)}<WaitlistButton onClick={() => setMenuOpen(false)} /></nav>}</header>;
}

function App() {
  const [screen, setScreen] = useState<Screen>("bike");
  const active = screens.find(item => item.id === screen) ?? screens[0];
  return <>
    <a className="skip-link" href="#main-content">Skip to content</a><Header />
    <main id="main-content">
      <section className="hero" id="top" aria-labelledby="hero-title">
        <img className="hero__image" src={heroMotorcycle} alt="Motorcycle outside a rider café at sunset" fetchPriority="high" />
        <div className="hero__overlay" aria-hidden="true" />
        <div className="container hero__layout">
          <div className="hero__copy"><p className="eyebrow"><span className="signal-dot" /> Built for Indian motorcycle owners</p><p className="hero__wordmark">THROTTLE / EARLY ACCESS</p><h1 id="hero-title">Your Motorcycle.<br />Your Journey.<br /><em>One Smarter Way<br />to Own It.</em></h1><p className="hero__description">From tracking every kilometre to staying ahead of maintenance, THROTTLE brings your motorcycle ownership experience together in one place.</p><div className="hero__actions"><WaitlistButton /><a className="button button--secondary" href="#experience">Explore THROTTLE<ArrowDown size={17} /></a></div><p className="hero__note">In development. Built around the ride.</p></div>
          <div className="hero__product"><div className="product-caption"><span className="signal-dot" /> PRODUCT PREVIEW <span>01 / DASHBOARD</span></div><Phone className="hero-phone"><Dashboard /></Phone><div className="product-footnote"><span>One motorcycle. A clearer picture.</span><ArrowDown size={16} /></div></div>
        </div>
        <div className="container hero__rail"><span>THE RIDE IS YOURS.</span><span>THE DETAILS, TOGETHER.</span><a href="#experience">Meet your riding companion <ArrowDown size={14} /></a></div>
      </section>

      <section className="section experience" id="experience" aria-labelledby="experience-title"><div className="container">
        <div className="section-heading"><div><p className="eyebrow">01 / The product experience</p><h2 id="experience-title">Get a feel<br />for the ride.</h2></div><div className="section-intro"><p>A closer look at the ownership companion we're building. From your first kilometre to your next service.</p><span className="concept-label">PRODUCT PREVIEW · LOCAL SAMPLE DATA</span></div></div>
        <div className="showcase-tabs" role="tablist" aria-label="Product experiences">{screens.map((item, index) => <Button key={item.id} id={`tab-${item.id}`} role="tab" aria-selected={screen === item.id} aria-controls={`panel-${item.id}`} tabIndex={screen === item.id ? 0 : -1} className={screen === item.id ? "is-active" : ""} onClick={() => setScreen(item.id)} onKeyDown={event => { const change = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0; if (!change && event.key !== "Home" && event.key !== "End") return; event.preventDefault(); const next = event.key === "Home" ? screens[0] : event.key === "End" ? screens[screens.length - 1] : screens[(index + change + screens.length) % screens.length]; if (next) { setScreen(next.id); document.getElementById(`tab-${next.id}`)?.focus(); } }}><span>0{index + 1}</span>{item.label}</Button>)}</div>
        <div className="showcase-layout">
          <div className="showcase-copy" key={screen}><p className="eyebrow">{active.kicker}</p><h3>{active.title}</h3><p>{active.description}</p><ul>{active.facts.map(fact => <li key={fact}><Check size={16} />{fact}</li>)}</ul><div className="development-note"><span className="signal-dot" /><p>{screen === "centres" || screen === "community" ? "Exploring this experience" : "In development"}<small>Concept demo. Not a live service.</small></p></div></div>
          <div className="showcase-device"><ProductPreview screen={screen} onScreen={setScreen} /><p className="device-note">Fictional sample data · Changes reset on refresh</p></div>
          <div className="showcase-index" aria-hidden="true"><strong>0{screens.findIndex(item => item.id === screen) + 1}</strong><span>/ 05</span><span className="index-line" /><span>OWNERSHIP,<br />REIMAGINED.</span></div>
        </div>
        <div className="showcase-conversion"><div><h3>Your bike. Your details. Your next chapter.</h3><p>Join the early-access waitlist and be part of what comes next.</p></div><WaitlistButton>Get Early Access</WaitlistButton></div>
      </div></section>

      <section className="section day-section" id="your-day" aria-labelledby="day-title"><div className="container"><div className="section-heading"><div><p className="eyebrow">02 / A day with THROTTLE</p><h2 id="day-title">More riding.<br />Less remembering.</h2></div><div className="section-intro"><p>The little moments of ownership, connected. An illustrative day with your motorcycle.</p><span className="concept-label">A FICTIONAL RIDER'S DAY</span></div></div><ol className="day-timeline">{journey.map((step, i) => <li key={step.title}><div className="day-time"><span>0{i + 1}</span><small>{step.time}</small></div><div className="day-copy"><h3>{step.title}</h3><p>{step.text}</p></div><DayReadout index={i} /></li>)}</ol></div></section>

      <section className="india-section" id="indian-riders" aria-labelledby="india-title"><img className="india-section__image" src={indiaRoad} alt="The winding Gata Loops on the Leh–Manali Highway in Ladakh, India" loading="lazy" /><div className="india-section__overlay" /><div className="container india-section__content"><p className="eyebrow">03 / Designed for Indian motorcycle owners</p><h2 id="india-title">Everyday roads.<br />Extraordinary rides.</h2><p>For the commute, the chai stop and the long way home. THROTTLE is being shaped around the details of motorcycle ownership in India.</p><ul className="india-details"><li><span>01</span>Regular services & unexpected repairs</li><li><span>02</span>Real-world mileage & rupee-by-rupee costs</li><li><span>03</span>Service history & bike details, organised</li><li><span>04</span>Exploring nearby service options</li></ul><WaitlistButton>Be Among the First Riders</WaitlistButton></div><a className="photo-credit" href="https://commons.wikimedia.org/wiki/File:Gata_Loops,Leh_Manali_Highway.jpg" target="_blank" rel="noopener noreferrer">Gata Loops, Ladakh · Narender9 / CC BY-SA 4.0<ArrowUpRight size={11} /></a></section>

      <section className="waitlist-section" id="waitlist" aria-labelledby="waitlist-title"><div className="container"><p className="eyebrow">This is just the beginning</p><h2 id="waitlist-title">Your Next Ride<br /><em>Starts Here.</em></h2><p>Be among the first riders to experience a smarter way of owning a motorcycle.</p><WaitlistButton>Join the THROTTLE Waitlist</WaitlistButton><span className="waitlist-note">Early access · In development · Opens Google Forms</span></div></section>
    </main>
    <footer className="site-footer"><div className="container site-footer__top"><div><Brand /><p>Your Motorcycle. Your Journey.</p></div><div className="site-footer__links">{INSTAGRAM_URL ? <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"><Instagram size={17} />Instagram</a> : <span><Instagram size={17} />Instagram coming soon</span>}{CONTACT_EMAIL ? <a href={`mailto:${CONTACT_EMAIL}`}><Mail size={17} />{CONTACT_EMAIL}</a> : <span><Mail size={17} />Contact email coming soon</span>}</div></div><div className="container site-footer__bottom"><p>© {new Date().getFullYear()} THROTTLE</p><p>Product previews are concepts, not live features.</p><a href="#top">Back to top ↑</a></div></footer>
  </>;
}
export default App;
