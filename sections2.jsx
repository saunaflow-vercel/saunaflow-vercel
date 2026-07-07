/* Sauna + Flow — sections 2: Plans, Story, Host, FAQ, Contact */

function Plans({ onBook }) {
  const plans = [
  { name: "The Drop-In", price: "£19", desc: "Perfect for the curious or the occasional visitor.", features: ["1 × 60min Session", "Towel Service", "Hydration included"] },
  { name: "The Reset Pack", price: "£79", desc: "Commit to your recovery. 5 sessions to use anytime.", features: ["5 × 60min Sessions", "Priority Booking", "Guest Pass ×1", "10% off Merch"], popular: true },
  { name: "Private Hire", price: "From £400", desc: "Exclusive use of the sauna and plunge for your team.", features: ["Up to 10 people", "90min Session", "Guided Ritual", "Bespoke Playlist"] }];

  return (
    <section id="plans" className="section plans">
      <div className="wrap">
        <div className="plans__head">
          <h2 className="plans__h" style={{ fontSize: "65px" }}>Rest. Reset. <em style={{ fontSize: "65px" }}>Restore.</em></h2>
          <p style={{ color: "var(--on-dark-3)", maxWidth: 520, margin: "0 auto" }}>Return home to the elements of nature.</p>
        </div>
        <div className="plan-grid">
          {plans.map((p, i) =>
          <Reveal key={p.name} delay={i * 90} className={`plan ${p.popular ? "plan--pop" : ""}`}>
              {p.popular && <span className="plan__badge">Popular</span>}
              <Eyebrow style={{ color: p.popular ? "var(--coal-deep)" : "var(--gold)" }}>{p.name}</Eyebrow>
              <div className="plan__price">{p.price}</div>
              <p className="plan__desc" style={{ color: p.popular ? "rgba(35,31,32,.78)" : "var(--on-dark-3)" }}>{p.desc}</p>
              <div className="plan__feats">
                {p.features.map((f) =>
              <div className="plan__feat" key={f}>
                    <span className="tick" style={{ width: 20, height: 20, borderRadius: "50%", display: "grid", placeItems: "center", background: p.popular ? "rgba(35,31,32,.12)" : "var(--gold-wash)", color: p.popular ? "var(--coal-deep)" : "var(--gold)" }}><Icon name="check" size={12} /></span>
                    {f}
                  </div>
              )}
              </div>
              <Button variant={p.popular ? "dark" : "outline"} arrow magnetic onClick={onBook}>Choose plan</Button>
            </Reveal>
          )}
        </div>
      </div>
    </section>);

}

function Story() {
  return (
    <section id="about" className="section story">
      <div className="wrap story__grid">
        <Reveal variant="img" className="portrait"><img src={asset("assets/founders.png")} alt="Founders Twig and Hema by the fire" /></Reveal>
        <div>
          <Eyebrow tone="ink">Twig &amp; Hema's Story</Eyebrow>
          <h2 className="story__h">From burnout to balance…</h2>
          <p>"<em>Sauna + Flow was born out of a simple need: to slow down, breathe, and reconnect. After years teaching and working in the NHS, we'd forgotten how to return to our own centre.</em>"</p>
          <p><em>Everything changed after a trip to Finland. There, sauna wasn't a luxury or a trend, but a way of life — woven into the rhythm of community.</em></p>
          <p><em>Sauna + Flow is our way of bringing that spirit of ritual to our own neighbourhoods. More than heat and cold — a place to reconnect with your body, your breath, and the people around you.</em></p>
        </div>
      </div>
    </section>);

}

function FAQ() {
  const [open, setOpen] = React.useState([0]);
  const faqs = [
  { q: "What should I bring?", a: "Bring swimwear, two towels (one for sitting, one for drying), a water bottle, and slides/flip-flops. We provide the rest." },
  { q: "Is it suitable for beginners?", a: "Absolutely. Our guides are trained to help you manage your heat and cold exposure safely. You are in control of your own limits." },
  { q: "Do you offer partner programmes for sports clubs?", a: "Yes, we work with elite football, rugby, and strength gyms to provide on-site recovery zones. We handle all logistics and staffing." },
  { q: "Can I book a private session?", a: "Yes, we offer private hire for groups, teams, or events. Check the membership section for starting rates." },
  { q: "What are the health contraindications?", a: "If you have heart conditions, high blood pressure, or are pregnant, please consult your doctor before using the sauna or ice bath." }];

  const toggle = (i) => setOpen((o) => o.includes(i) ? o.filter((x) => x !== i) : [...o, i]);
  return (
    <section className="section faq">
      <div className="wrap" style={{ maxWidth: 760 }}>
        <h2 className="faq__h">Common Questions</h2>
        {faqs.map((f, i) => {
          const isOpen = open.includes(i);
          return (
            <div className={`faq-row ${isOpen ? "open" : ""}`} key={i}>
              <button className="faq-q" onClick={() => toggle(i)} aria-expanded={isOpen}>
                <span>{f.q}</span>
                <Icon name="chevron" size={22} className="faq-icn" />
              </button>
              <div className="faq-a"><div><p>{f.a}</p></div></div>
            </div>);

        })}
      </div>
    </section>);

}

function Contact({ formRef }) {
  const [sent, setSent] = React.useState(false);
  const [err, setErr] = React.useState({});
  const submit = async (e) => {
    e.preventDefault();
    const f = e.currentTarget;
    const vals = { name: f.name.value.trim(), email: f.email.value.trim(), phone: f.phone.value.trim(), message: f.message.value.trim() };
    const ne = {};
    if (!vals.name) ne.name = true;
    if (!vals.email) ne.email = true;
    setErr(ne); if (Object.keys(ne).length) return;
    const endpoint = window.SF_CONTACT_ENDPOINT;
    try {
      if (endpoint) {
        const body = new URLSearchParams({ ...vals, source: "Contact form", timestamp: new Date().toISOString() });
        await fetch(endpoint, { method: "POST", mode: "no-cors", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body });
      }
    } catch (_) { /* opaque no-cors response; assume delivered */ }
    setSent(true);
  };
  if (sent) return (
    <section id="contact" className="section contact" ref={formRef}>
      <div className="wrap contact-success">
        <div className="success-ring"><svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg></div>
        <h2 style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "clamp(2.5rem,6vw,4.5rem)", marginBottom: 18 }}>Thank you.</h2>
        <p style={{ color: "var(--on-dark-3)", fontSize: 18, marginBottom: 30 }}>Your enquiry has been received. We'll be in touch shortly.</p>
        <Button variant="outline" pillcap magnetic onClick={() => {setSent(false);window.scrollTo({ top: 0, behavior: "smooth" });}}>Return Home</Button>
      </div>
    </section>);

  return (
    <section id="contact" className="section contact" ref={formRef}>
      <div className="wrap" style={{ maxWidth: 880 }}>
        <div className="contact__head">
          <h2 className="contact__h">Connect.</h2>
          <p className="contact__sub">Start the conversation.</p>
        </div>
        <div className="formcard">
          <form onSubmit={submit} className="contact-grid" noValidate>
            <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
              <div className={`field ${err.name ? "err" : ""}`}><label>Name <span style={{ color: "rgba(255,255,255,.4)" }}>*</span></label><input name="name" placeholder="Enter your name" /><span className="uline" /></div>
              <div className={`field ${err.email ? "err" : ""}`}><label>Email <span style={{ color: "rgba(255,255,255,.4)" }}>*</span></label><input name="email" type="email" placeholder="Enter your email" /><span className="uline" /></div>
              <div className="field"><label>Phone</label><input name="phone" placeholder="Enter your phone number" /><span className="uline" /></div>
            </div>
            <div className="field field--msg">
              <label>Your Space / Project</label>
              <textarea name="message" placeholder="Tell us about your needs" /><span className="uline" />
            </div>
            <div className="contact-actions">
              <Button variant="primary" arrow magnetic>Send Enquiry</Button>
            </div>
          </form>
        </div>
      </div>
    </section>);

}

Object.assign(window, { Plans, Story, FAQ, Contact });