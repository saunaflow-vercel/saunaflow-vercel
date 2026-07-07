/* Sauna + Flow — Smart brand-slide carousel.
   Recreates the design-system brand deck (Title / Statement / Pillars / Stat /
   Image / Quote / Identity / Mark) as a self-advancing, swipeable carousel
   framed inside the marketing page. The slides are authored on a fixed
   1280×720 canvas and scaled to the frame width so they stay brand-accurate. */

const SF_SLIDE_W = 1280,SF_SLIDE_H = 720;

function BrandSlides() {
  const eb = (txt, style) => <div className="bs-eb" style={style}>{txt}</div>;

  const pillars = [
  [asset("assets/pillar-physical.png"), "Physical", "Heat. Cold. Breathe.", "For a stronger body and better health."],
  [asset("assets/pillar-social.png"), "Social", "Connection. Community.", "A space to belong and be together."],
  [asset("assets/pillar-spiritual.png"), "Spiritual", "Rest. Restore.", "For clarity, calm and inner balance."]];


  return [
  // 1 — TITLE
  <div className="bs-pad" style={{ justifyContent: "center", alignItems: "flex-start", background: "var(--coal-deep)" }} data-screen-label="Brand · Title">
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 44 }}>
        <span style={{ width: 56, height: 1, background: "#fff" }} />
        {eb("Est. 2026 · London", { color: "#fff" })}
      </div>
      <img src={asset("assets/logo-wordmark-trim.svg")} alt="Sauna + Flow" style={{ width: 640, maxWidth: "78%", filter: "brightness(0) invert(1)" }} />
      <p className="bs-serif bs-ital" style={{ fontSize: 34, color: "var(--gold)", marginTop: 28 }}>Reset where you play.</p>
    </div>,

  // 2 — STATEMENT
  <div className="bs-pad" style={{ justifyContent: "center", background: "var(--coal)" }} data-screen-label="Brand · Statement">
      {eb("The Ritual", { marginBottom: 26 })}
      <h2 className="bs-serif" style={{ fontSize: 124, lineHeight: .92, color: "#fff", letterSpacing: "-.02em" }}>
        Sweat.<br />Plunge.<br /><span className="bs-ital" style={{ color: "var(--gold)" }}>Connect.</span>
      </h2>
    </div>,

  // 3a–3c — PILLARS (one slide each)
  ...pillars.map(([ic, t, s, d]) =>
  <div key={t} className="bs-pad" style={{ background: "var(--steam)", color: "var(--coal-deep)", justifyContent: "center" }} data-screen-label={"Brand · " + t}>
      {eb("Built on three pillars", { color: "rgba(35,31,32,.5)", marginBottom: 40 })}
      <img src={ic} alt="" style={{ width: 92, height: 92, objectFit: "contain", marginBottom: 30 }} />
      <h2 className="bs-serif" style={{ fontSize: 108, lineHeight: 1, marginBottom: 24 }}>{t}</h2>
      <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 14 }}>{s}</div>
      <div style={{ color: "rgba(35,31,32,.65)", fontSize: 26, maxWidth: 640, lineHeight: 1.45 }}>{d}</div>
    </div>
  ),

  // 4 — STAT
  <div className="bs-pad" style={{ justifyContent: "center", background: "var(--coal-deep)" }} data-screen-label="Brand · Stat">
      {eb("A 60-minute nervous-system reset", { marginBottom: 40 })}
      <div style={{ display: "flex", gap: 80, alignItems: "flex-end", flexWrap: "wrap" }}>
        <div><div className="bs-serif" style={{ fontSize: 132, lineHeight: .85, color: "var(--gold)" }}>80°C</div><div className="bs-eb" style={{ color: "#fff", marginTop: 14 }}>Avg. Heat</div></div>
        <div><div className="bs-serif" style={{ fontSize: 132, lineHeight: .85, color: "var(--gold)" }}>5°C</div><div className="bs-eb" style={{ color: "#fff", marginTop: 14 }}>Avg. Cold</div></div>
        <div><div className="bs-serif" style={{ fontSize: 132, lineHeight: .85, color: "rgb(229, 194, 92)" }}>60<span style={{ fontSize: 56, color: "rgb(229, 194, 92)" }}>min</span></div><div className="bs-eb" style={{ color: "#fff", marginTop: 14 }}>Reset</div></div>
      </div>
    </div>,

  // 5 — FULL-BLEED IMAGE
  <div style={{ position: "absolute", inset: 0, background: "var(--coal-deep)" }} data-screen-label="Brand · Image">
      <img src={asset("assets/hero-mobile-sauna.jpg")} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(12,12,12,.85), rgba(12,12,12,.12) 55%, rgba(12,12,12,.4))" }} />
      <div className="bs-pad" style={{ position: "relative", justifyContent: "flex-end" }}>
        {eb("Mobile · London", { marginBottom: 16 })}
        <h2 className="bs-serif" style={{ fontSize: 86, lineHeight: .95, color: "#fff" }}>Heat. Cold.<br /><span className="bs-ital" style={{ color: "var(--gold)" }}>Connect.</span></h2>
        <p style={{ fontSize: 22, color: "rgba(255,255,255,.85)", maxWidth: 560, marginTop: 18 }}>Sauna and cold plunge for London's sports venues and communities.</p>
      </div>
    </div>,

  // 6 — QUOTE
  <div className="bs-pad" style={{ justifyContent: "center", background: "var(--coal-ink)" }} data-screen-label="Brand · Quote">
      <div className="bs-serif" style={{ fontSize: 120, lineHeight: .6, color: "var(--gold)", height: 54 }}>“</div>
      <p className="bs-serif bs-ital" style={{ fontSize: 46, lineHeight: 1.3, color: "#fff", maxWidth: 900 }}>
        There's something pure and simple about heat. It's one of the oldest wellness practices we have.
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 44 }}>
        <span style={{ width: 48, height: 1, background: "var(--gold)" }} />
        {eb("Twig & Hema · Founders", { color: "#fff" })}
      </div>
    </div>,

  // CLOSING MARK
  <div className="bs-pad" style={{ justifyContent: "center", alignItems: "center", textAlign: "center", background: "var(--coal-deep)" }} data-screen-label="Brand · Mark">
      <img src={asset("assets/badge-flame-gold.png")} alt="Sauna + Flow flame badge" style={{ width: 380, height: 380, objectFit: "contain" }} />
      <p className="bs-serif bs-ital" style={{ fontSize: 38, color: "var(--gold)", marginTop: 36 }}>Reset where you play.</p>
    </div>];

}

function BrandCarousel() {
  const slides = React.useMemo(() => BrandSlides(), []);
  const N = slides.length;
  const [idx, setIdx] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const frameRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const [scale, setScale] = React.useState(1);
  const reduce = React.useRef(typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches);
  const DURATION = 6000;

  const go = React.useCallback((n) => setIdx((n % N + N) % N), [N]);
  const next = React.useCallback(() => go(idx + 1), [idx, go]);
  const prev = React.useCallback(() => go(idx - 1), [idx, go]);

  // Scale the fixed canvas to the frame width
  React.useEffect(() => {
    const frame = frameRef.current;if (!frame) return;
    const ro = new ResizeObserver(() => setScale(frame.clientWidth / SF_SLIDE_W));
    ro.observe(frame);setScale(frame.clientWidth / SF_SLIDE_W);
    return () => ro.disconnect();
  }, []);

  // Autoplay (paused on hover/focus, off-screen, or reduced motion)
  const [progress, setProgress] = React.useState(0);
  React.useEffect(() => {
    if (reduce.current || paused) {setProgress(0);return;}
    let raf,t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / DURATION);
      setProgress(p);
      if (p >= 1) {go(idx + 1);return;}
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [idx, paused, go]);

  // Pause when the section is scrolled out of view
  React.useEffect(() => {
    const el = frameRef.current;if (!el) return;
    const io = new IntersectionObserver(([e]) => setPaused((p) => {return !e.isIntersecting ? true : false;}), { threshold: 0.35 });
    io.observe(el);return () => io.disconnect();
  }, []);

  // Tap to jump to Connect (no drag-to-scroll hijack — page scrolls normally)
  const onFrameClick = () => scrollToId("contact");

  return (
    <section id="brand" className="section brandshow"
    onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} style={{ padding: "132px 0px" }}>

      <div className="brandshow__stage">
        <div
          className="brandshow__frame"
          ref={frameRef}
          style={{ height: SF_SLIDE_H * scale }}
          onClick={onFrameClick}
          tabIndex={0}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          onKeyDown={(e) => {if (e.key === "ArrowRight") next();if (e.key === "ArrowLeft") prev();}}
          role="group" aria-roledescription="carousel" aria-label="Brand slides">
          
          <div className="brandshow__canvas" ref={canvasRef} style={{ width: SF_SLIDE_W, height: SF_SLIDE_H, transform: `scale(${scale})` }}>
            {slides.map((s, i) =>
            <div key={i} className={"bs-slide " + (i === idx ? "on" : "")} aria-hidden={i !== idx}>{s}</div>
            )}
          </div>
        </div>

        <button className="brandshow__arrow brandshow__arrow--prev" onClick={prev} aria-label="Previous slide"><Icon name="arrow" size={22} /></button>
        <button className="brandshow__arrow brandshow__arrow--next" onClick={next} aria-label="Next slide"><Icon name="arrow" size={22} /></button>
      </div>

      <div className="wrap brandshow__ctrl">
        <div className="brandshow__dots">
          {slides.map((_, i) =>
          <button key={i} className={"brandshow__dot " + (i === idx ? "on" : "")} onClick={() => go(i)} aria-label={"Go to slide " + (i + 1)}>
              <span className="brandshow__dotfill" style={i === idx && !paused && !reduce.current ? { width: progress * 100 + "%" } : i === idx ? { width: "100%" } : null} />
            </button>
          )}
        </div>
        <div className="brandshow__count"><b>{String(idx + 1).padStart(2, "0")}</b> <span>/ {String(N).padStart(2, "0")}</span></div>
      </div>
    </section>);

}

Object.assign(window, { BrandCarousel });