/* Sauna + Flow — shared components & motion helpers
   Loaded via Babel; exports onto window for the other scripts. */
const { useState, useEffect, useRef, useCallback } = React;

/* Asset resolver: when bundled offline, window.__resources maps the asset
   path to an inlined blob URL; otherwise it returns the path unchanged. */
function asset(p) { return (window.__resources && window.__resources[p]) || p; }
window.asset = asset;

/* Global motion settings, written by <App> from the Tweaks panel and
   read inside imperative handlers (mousemove / scroll). */
window.SFM = window.SFM || { motion: "cinematic", parallax: true };
const MAG = { calm: 0, cinematic: 0.14, bold: 0.26 };

/* smooth scroll that respects the fixed nav (avoids scrollIntoView) */
function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 64;
  window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
}

/* ---------- Icons (Lucide-style, stroke 2 rounded) ---------- */
const IcPath = {
  arrow: "M5 12h14M13 6l6 6-6 6",
  check: "M20 6 9 17l-5-5",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  menu: "M4 6h16M4 12h16M4 18h16",
  x: "M18 6 6 18M6 6l12 12",
  chevron: "M6 9l6 6 6-6"
};
function Icon({ name, size = 20, stroke = 2, className = "", style }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round", className, style };
  if (name === "instagram") return (
    <svg {...common}><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>);
  if (name === "linkedin") return (
    <svg {...common}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-9h4v1.5" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>);
  if (name === "facebook") return (
    <svg {...common}><circle cx="12" cy="12" r="10" /><path d="M13.5 21v-7h2.2l.3-2.6h-2.5v-1.6c0-.75.2-1.3 1.3-1.3h1.4V6.1C15.9 6 15 6 14 6c-2.1 0-3.5 1.3-3.5 3.6V11.4H8.3V14h2.2v7" fill="currentColor" stroke="none" /></svg>);
  return <svg {...common}><path d={IcPath[name]} /></svg>;
}

function LogoStamp({ size = 42 }) {
  return <img src={asset("assets/logo-stamp-trim.svg")} alt="Sauna + Flow" style={{ width: size, height: size, display: "block", objectFit: "contain" }} />;
}

function LogoLine({ height = 32 }) {
  return <img src={asset("assets/logo-line-mark-white.svg")} alt="Sauna + Flow" style={{ height, width: "auto", display: "block" }} />;
}

function Eyebrow({ children, tone = "gold", style }) {
  const cls = tone === "light" ? "eyebrow eyebrow--light" : tone === "ink" ? "eyebrow eyebrow--ink" : "eyebrow";
  return <span className={cls} style={{ ...style, color: "rgba(34, 32, 32, 0.48)" }}>{children}</span>;
}

/* ---------- Magnetic hook ---------- */
function useMagnetic(strengthBase = 1) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;if (!el) return;
    let raf = 0;
    const move = (e) => {
      const s = (MAG[window.SFM.motion] ?? 0.28) * strengthBase;
      if (!s) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * s;
      const y = (e.clientY - (r.top + r.height / 2)) * s;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {el.style.transform = `translate(${x}px, ${y}px)`;});
    };
    const leave = () => {cancelAnimationFrame(raf);el.style.transform = "";};
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {el.removeEventListener("mousemove", move);el.removeEventListener("mouseleave", leave);cancelAnimationFrame(raf);};
  }, [strengthBase]);
  return ref;
}

/* ---------- Button (optionally magnetic, with arrow) ---------- */
function Button({ children, variant = "primary", pillcap, arrow, magnetic, className = "", style, ...p }) {
  const ref = useMagnetic(magnetic ? 1 : 0);
  return (
    <button ref={magnetic ? ref : null} className={`btn btn--${variant} ${pillcap ? "btn--pillcap" : ""} ${className}`} style={{ transition: magnetic ? "transform .35s var(--ease), background var(--dur), box-shadow var(--dur)" : undefined, ...style }} {...p}>
      {children}
      {arrow && <span className="arrow-mini"><Icon name="arrow" size={15} /></span>}
    </button>);

}

/* ---------- Reveal-on-scroll ---------- */
function Reveal({ children, delay = 0, variant = "", as = "div", className = "", style, ...rest }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;if (!el) return;
    const io = new IntersectionObserver(([e]) => {if (e.isIntersecting) {setSeen(true);io.disconnect();}}, { threshold: 0.01, rootMargin: "0px 0px -5% 0px" });
    io.observe(el);
    // Fail-safe: never let content stay hidden if the observer doesn't fire.
    const t = setTimeout(() => setSeen(true), 1600);
    return () => {io.disconnect();clearTimeout(t);};
  }, []);
  const As = as;
  const v = variant ? `reveal--${variant}` : "";
  return <As ref={ref} className={`reveal ${v} ${seen ? "in" : ""} ${className}`} style={{ transitionDelay: delay + "ms", ...style }} {...rest}>{children}</As>;
}

/* ---------- Count-up ---------- */
function Counter({ to, suffix = "" }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;io.disconnect();setShown(true);
    }, { threshold: 0.6 });
    io.observe(el);return () => io.disconnect();
  }, []);
  return <span ref={ref} className={"stat__val " + (shown ? "in" : "")}>{to}{suffix && <span className="stat__suffix">{suffix}</span>}</span>;
}

function Grain() {return <div className="grain" aria-hidden="true" />;}

/* ---------- Contrast meter (heat -> cold) ---------- */
function ContrastMeter() {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;if (!el) return;
    const io = new IntersectionObserver(([e]) => {if (e.isIntersecting) {setOn(true);io.disconnect();}}, { threshold: 0.4 });
    io.observe(el);return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={"meter " + (on ? "in" : "")}>
      <Eyebrow tone="light" style={{ fontSize: 11, marginBottom: 14, display: "inline-block" }}>The Contrast</Eyebrow>
      <div className="meter__track"><span className="meter__knob" /></div>
      <div className="meter__ends"><span><b>80°C</b> Heat</span><span><b>5°C</b> Cold</span></div>
    </div>);

}

/* ---------- Scroll progress ---------- */
function ScrollProgress() {
  const bar = useRef(null);
  useEffect(() => {
    let raf;
    const upd = () => {
      const h = document.documentElement;
      const p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {cancelAnimationFrame(raf);raf = requestAnimationFrame(upd);};
    window.addEventListener("scroll", onScroll, { passive: true });upd();
    return () => {window.removeEventListener("scroll", onScroll);cancelAnimationFrame(raf);};
  }, []);
  return <div ref={bar} className="scrollbar" />;
}

/* ---------- Navbar ---------- */
const NAV_LINKS = [["The Ritual", "experience"], ["Benefits", "benefits"], ["Our Story", "about"]];
function Navbar({ onBook }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l[1]);
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      const mid = window.scrollY + innerHeight * 0.32;
      let cur = "";
      for (const id of ids) {const el = document.getElementById(id);if (el && el.offsetTop <= mid) cur = id;}
      setActive(cur);
    };
    window.addEventListener("scroll", onScroll, { passive: true });onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const go = (id) => {setOpen(false);scrollToId(id);};
  return (
    <React.Fragment>
      <nav className={`nav ${scrolled ? "nav--scrolled" : "nav--top"}`}>
        <div className="wrap nav__inner">
          <button className="nav__logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Top"><LogoLine height={scrolled ? 28 : 34} /></button>
          <div className="nav__links">
            {NAV_LINKS.map(([l, id]) => <button key={id} className={`nav__link ${active === id ? "active" : ""}`} onClick={() => go(id)}>{l}</button>)}
            <Button variant="outline" pillcap magnetic onClick={onBook} style={{ marginLeft: 10 }}>Join Waitlist</Button>
          </div>
          <button className="nav__burger" onClick={() => setOpen(!open)} aria-label="Menu"><Icon name={open ? "x" : "menu"} size={26} /></button>
        </div>
      </nav>
      {open &&
      <div className="mobnav">
          {NAV_LINKS.map(([l, id], i) => <button key={id} className="mobnav__link" style={{ animationDelay: i * 60 + "ms" }} onClick={() => go(id)}>{l}</button>)}
          <Button variant="primary" arrow onClick={() => {setOpen(false);onBook();}} style={{ marginTop: 22 }}>Join Waitlist</Button>
        </div>
      }
    </React.Fragment>);

}

/* ---------- Footer ---------- */
function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__top">
          <div style={{ maxWidth: 320 }}>
            <img src={asset("assets/logo-wordmark-flame-cream.png")} alt="Sauna + Flow" className="footer__logo" />
            <p className="blurb" style={{ marginTop: 26 }}>Restoring the nervous systems of London's high performers through contrast therapy and breath.</p>
          </div>
          <div className="footer__cols">
            <div className="footer__col">
              <Eyebrow>Sitemap</Eyebrow>
              <ul>{[["About", "about"], ["The Ritual", "experience"], ["Science", "benefits"]].map(([l, id]) =>
                <li key={id}><a className="flink" onClick={() => scrollToId(id)} style={{ cursor: "pointer" }}>{l}</a></li>)}</ul>
            </div>
            <div className="footer__col">
              <Eyebrow>Social</Eyebrow>
              <ul>
                <li><a className="flink" href="https://www.instagram.com/saunaandflow" target="_blank" rel="noopener noreferrer"><Icon name="instagram" size={16} /> Instagram</a></li>
                <li><a className="flink" href="https://www.facebook.com/people/Sauna-Flow/61592338910424/" target="_blank" rel="noopener noreferrer"><Icon name="facebook" size={16} /> Facebook</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer__base">
          <p>© 2026 Sauna + Flow.</p>
          <p>Heat. Cold. Connect.</p>
        </div>
      </div>
    </footer>);

}

Object.assign(window, { scrollToId, Icon, LogoStamp, LogoLine, Eyebrow, Button, Reveal, Counter, Grain, ContrastMeter, ScrollProgress, Navbar, Footer, useMagnetic, PartnerCrest, AnnouncementBanner, PartnershipModal });

/* ============================================================
   Partner crest — placeholder club shield (swap for real crest)
   ============================================================ */
function PartnerCrest({ size = 26 }) {
  return (
    <img src="assets/ealing-crest.png" alt="Ealing Cricket Club"
      style={{ height: size * 1.12, width: "auto", display: "block", objectFit: "contain" }} />
  );
}

/* ============================================================
   Announcement banner — top marquee, click to open partnership modal
   ============================================================ */
function AnnouncementBanner({ onOpen }) {
  const [gone, setGone] = useState(false);
  useEffect(() => { document.body.classList.toggle("banner-dismissed", gone); return () => document.body.classList.remove("banner-dismissed"); }, [gone]);
  if (gone) return null;
  const items = [
    { t: "Recovery sessions coming to your club" },
    { t: "West London" },
    { t: "Ealing Cricket Club × Sauna + Flow", hot: true },
  ];
  const line = [];
  for (let r = 0; r < 3; r++) items.forEach((it, i) => line.push({ ...it, k: r + "-" + i }));
  const Half = () => (
    <div className="mq-half" aria-hidden="true">
      {line.map((it) => (
        <React.Fragment key={it.k}>
          <span className={"mq-item" + (it.hot ? " mq-item--hot" : "")}>{it.t}</span>
          <span className="mq-sep">✦</span>
        </React.Fragment>
      ))}
    </div>
  );
  return (
    <div className="abanner" role="button" tabIndex={0} aria-label="Partnership announcement — open sign-up"
      onClick={onOpen} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(); } }}>
      <div className="abanner__crest"><PartnerCrest size={24} /></div>
      <div className="abanner__marquee"><div className="abanner__track"><Half /><Half /></div></div>
      <button className="abanner__cta" onClick={onOpen} tabIndex={-1}>
        <span className="dot" /><span className="cta-txt">Coming soon</span>
      </button>
      <button className="abanner__x" aria-label="Dismiss announcement" onClick={(e) => { e.stopPropagation(); setGone(true); }}>
        <Icon name="x" size={16} />
      </button>
    </div>
  );
}

/* ============================================================
   Partnership modal — priority-access sign-up → Google Sheets
   ============================================================ */
function PartnershipModal({ open, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [err, setErr] = useState({});
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const nameRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const id = setTimeout(() => { if (nameRef.current) nameRef.current.focus(); }, 120);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); clearTimeout(id); };
  }, [open, onClose]);

  // reset shortly after close so reopening is fresh
  useEffect(() => { if (!open) { const id = setTimeout(() => { setSent(false); setName(""); setEmail(""); setErr({}); }, 300); return () => clearTimeout(id); } }, [open]);

  if (!open) return null;

  const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const submit = async (e) => {
    e.preventDefault();
    const ne = {};
    if (!name.trim()) ne.name = true;
    if (!validEmail(email)) ne.email = true;
    setErr(ne); if (Object.keys(ne).length) return;
    setBusy(true);
    const endpoint = window.SF_SHEETS_ENDPOINT;
    try {
      if (endpoint) {
        const body = JSON.stringify({ name: name.trim(), email: email.trim(), partner: "Ealing Cricket Club", source: "Announcement banner" });
        await fetch(endpoint, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body });
      } else {
        await new Promise((r) => setTimeout(r, 650)); // demo mode — no endpoint configured
      }
    } catch (_) { /* opaque no-cors response; assume delivered */ }
    setBusy(false); setSent(true);
  };

  return (
    <div className="pmodal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="pmodal" role="dialog" aria-modal="true" aria-label="Priority access sign-up">
        <span className="pmodal__handle" />
        <div className="pmodal__top">
          <div className="pmodal__marks">
            <PartnerCrest size={26} />
            <span className="x">×</span>
            <img src="assets/mark-flame-gold.png" alt="Sauna + Flow" />
          </div>
          <button className="pmodal__close" aria-label="Close" onClick={onClose}><Icon name="x" size={20} /></button>
        </div>

        {sent ? (
          <div className="pmodal__success">
            <div className="success-ring"><svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg></div>
            <h3>You're on the list.</h3>
            <p>Thanks{name ? ", " + name.trim().split(" ")[0] : ""} — we'll be in touch the moment sessions open at Ealing Cricket Club.</p>
            <Button variant="outline" pillcap onClick={onClose}>Close</Button>
          </div>
        ) : (
          <React.Fragment>
            <span className="pmodal__eyebrow">Partnership Announcement</span>
            <h2 className="pmodal__h">We're delighted to bring the ritual to <em>Ealing Cricket Club.</em></h2>
            <p className="pmodal__sub">Be first to know when sessions launch — and get priority access to book.</p>
            <form onSubmit={submit} noValidate>
              <div className={"field" + (err.name ? " err" : "")}>
                <label>Your name</label>
                <input ref={nameRef} value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" autoComplete="name" />
              </div>
              <div className={"field" + (err.email ? " err" : "")}>
                <label>Email address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" autoComplete="email" />
              </div>
              <Button variant="primary" type="submit" disabled={busy}>{busy ? "Securing…" : "Secure my priority spot"}</Button>
            </form>
            <p className="pmodal__note">No spam. Launch notification + first access only.</p>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}