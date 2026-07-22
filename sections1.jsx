/* Sauna + Flow — sections 1: Hero, Ritual, Benefits */

function splitWords(text) {
  return text.split(" ").map((w, i) =>
  <span className="word" key={i}><span style={{ "--d": i * 55 + "ms" }}>{w} </span></span>
  );
}

function Hero({ onDiscover }) {
  const heroRef = useRef(null),bgRef = useRef(null),contentRef = useRef(null);
  const cueRef = useMagnetic(0.5);
  useEffect(() => {
    const h = heroRef.current;
    const id = requestAnimationFrame(() => h && h.classList.add("in"));
    const inFallback = setTimeout(() => h && h.classList.add("in"), 400);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const bg = bgRef.current,c = contentRef.current;if (!bg || !c) return;
        if (reduce || !window.SFM.parallax) {bg.style.transform = "";c.style.transform = "";c.style.opacity = "";return;}
        const y = window.scrollY;
        bg.style.transform = `translateY(${y * 0.14}px) scale(${1 + Math.min(y, 900) * 0.00018})`;
        c.style.transform = `translateY(${y * 0.07}px)`;
        c.style.opacity = String(Math.max(0, 1 - y / 620));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {cancelAnimationFrame(id);clearTimeout(inFallback);cancelAnimationFrame(raf);window.removeEventListener("scroll", onScroll);};
  }, []);
  return (
    <header className="hero" ref={heroRef}>
      <div className="hero__bg" ref={bgRef}><img src={asset("assets/hero-ealing-cricket-club.jpg")} alt="Sauna + Flow mobile sauna and cold plunge set up at Ealing Cricket Club, dusk" /></div>
      <div className="hero__scrim" /><div className="hero__grad" />
      <div className="hero__content" ref={contentRef}>
        <div className="wrap">
          <div style={{ maxWidth: 900 }}>
            <div className="kicker-row"><Eyebrow tone="light" style={{ letterSpacing: ".25em" }}>Est. 2026</Eyebrow></div>
            <div className="hero__lockup">
              <img className="hero__wm" src={asset("assets/logo-wordmark-trim.svg")} alt="Sauna + Flow" />
            </div>
            <div style={{ maxWidth: 580, marginTop: 22 }}>
              <h2 className="hero__accent">{splitWords("Coming soon to Ealing Cricket Club")}</h2>
              <button className="textlink" onClick={onDiscover}>Discover <span ref={cueRef} className="arrow-circ" style={{ transition: "transform .35s var(--ease), border-color var(--dur)" }}><Icon name="arrow" size={16} /></span></button>
            </div>
          </div>
        </div>
      </div>
      <div className="hero__cue"><span>Scroll</span><span className="line" /></div>
    </header>);

}

function Ritual() {
  const steps = [
  { num: "/01", title: "Activation", temp: { v: "80°C+", k: "hot" }, desc: "10 minutes. High heat (80°C+) to expand blood vessels, delivering oxygen and nutrient-rich blood to muscles and tissues, beginning the repair of damaged areas." },
  { num: "/02", title: "Contrast", temp: { v: "5°C", k: "cold" }, cold: true, desc: "1–2 minutes. Full immersion in cold water. Vessels rapidly contract, forcing blood toward the core, which reduces inflammation and swelling in the muscles." },
  { num: "/03", title: "Integration", temp: { v: "Hot ⇄ Cold", k: "hot" }, desc: "Alternating hot and cold, ending cold. The pumping action of opening and closing — 'vascular exercise' — flushes metabolic waste and improves circulation." }];

  const imgs = [["sauna-interior.png", "Cedar sauna interior lit by amber strip-light"], ["sauna-stove.png", "Narvi stove between the benches"], ["sauna-bucket.png", "Sauna bucket and ladle by the heater"]];
  return (
    <section id="experience" className="section ritual">
      <div className="wrap">
        <div className="ritual__head">
          <div>
            <Eyebrow>The Ritual</Eyebrow>
            <h2 className="ritual__title">The <span className="up" style={{ fontFamily: "Argue", fontWeight: "300" }}>Ritual.</span></h2>
          </div>
          <p className="ritual__sub" style={{ padding: "0px 0px 16px" }}>A 60-Minute Nervous System Reset. A Social Ritual. Not a Treatment.</p>
        </div>
        <div className="imggrid">
          {imgs.map(([im, alt], i) => <figure key={im}><img src={asset("assets/" + im)} alt={alt} /></figure>)}
        </div>
        <div className="ritual-split">
          <div className="ritual-aside">
            <p className="ritual-quote">"<em>There's something pure and simple about heat. It's one of the oldest wellness practices we have.</em>"</p>
            <Eyebrow tone="light" style={{ fontSize: 12 }}>Included in every session</Eyebrow>
            <ul style={{ listStyle: "none", marginTop: 20, marginBottom: 38 }}>
              {["Organic essential oils", "Salt scrubs", "Electrolyte hydration"].map((x) =>
              <li className="check-li" key={x}><span className="tick"><Icon name="check" size={13} /></span> {x}</li>)}
            </ul>
            <ContrastMeter />
          </div>
          <div className="steps">
            {steps.map((s, i) =>
            <Reveal as="div" key={s.num} delay={i * 90} className={`step ${s.cold ? "cold" : ""}`}>
                <span className="step__bar" />
                <span className="step__num">{s.num}</span>
                <div>
                  <h4 className="step__title">{s.title}<span className={`step__temp ${s.temp.k}`}>{s.temp.v}</span></h4>
                  <p>{s.desc}</p>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>);

}

function Benefits() {
  const pillars = [
  { ic: "pillar-physical.png", t: "Physical", s: "Heat. Cold. Breathe.", d: "For a stronger body and better health." },
  { ic: "pillar-social.png", t: "Social", s: "Connection. Community.", d: "A space to belong and be together." },
  { ic: "pillar-spiritual.png", t: "Spiritual", s: "Rest. Restore.", d: "For clarity, calm and inner balance." }];

  const items = [
  { t: "Neuro-Restoration", d: "Calm the sympathetic nervous system and exit the 'fight or flight' loop of modern life.", p: "M3 12h4l2.5 7 4-14 2.5 7h5" },
  { t: "Circulation Boost", d: "Thermal cycles create a workout for your heart, improving circulation and elasticity.", p: "M12 21s-7-4.5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.5-7 10-7 10z" },
  { t: "Peak Recovery", d: "Flush metabolic waste and reduce inflammation post-training with heat exposure.", p: "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2" },
  { t: "Community Engagement", d: "Being together with others in the present moment. There is no past or future in the sauna.", p: "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM15 11a3 3 0 1 0 0-6M3 20c0-3 3-5 6-5s6 2 6 5M15 16c3 0 6 1 6 4" }];

  return (
    <section id="benefits" className="benefits">
      <div className="wrap">
        <div className="benefits__head">
          <div>
            <Eyebrow tone="ink">Built on three pillars</Eyebrow>
            <h2 className="benefits__h" style={{ fontWeight: "300" }}>Why <em style={{ fontFamily: "Argue", fontWeight: "300" }}>We Gather.</em></h2>
          </div>
          <div className="stats">
            {[["80", "°C", "Avg. Heat"], ["5", "°C", "Avg. Cold"], ["60", "min", "Reset"]].map(([n, s, l]) =>
            <div key={l}><div className="stat__n"><Counter to={+n} suffix={s} /></div><div className="stat__l">{l}</div></div>)}
          </div>
        </div>

        <div className="pillars-grid">
          {pillars.map((p) =>
          <div className="pillar-card" key={p.t}>
              <img className="pillar-card__ico" src={asset("assets/" + p.ic)} alt="" />
              <h3 className="pillar-card__t">{p.t}</h3>
              <div className="pillar-card__s">{p.s}</div>
              <p className="pillar-card__d">{p.d}</p>
            </div>
          )}
        </div>

        <div className="benefit-grid">
          {items.map((b, i) =>
          <Reveal key={b.t} delay={i * 80} className="benefit-card">
              <div className="benefit-ico"><svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d={b.p} /></svg></div>
              <div>
                <h3>{b.t}</h3>
                <p>{b.d}</p>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>);

}

Object.assign(window, { Hero, Ritual, Benefits });