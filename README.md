# Sauna + Flow — Marketing Site

A single-page marketing site for **Sauna + Flow**, a mobile sauna and cold-plunge
experience for London's sports venues and communities. Cinematic scroll animations,
micro-interactions, a partnership announcement banner, and a priority-access sign-up
form wired to Google Sheets.

> **Heat. Cold. Connect.** — *Reset where you play.*

This is a **static site** — plain HTML, CSS, JS and images. There is **no build step**.
It deploys to Vercel (or any static host) as-is.

---

## Quick start

### Deploy to Vercel

Pick whichever you prefer — all three work with zero configuration:

**A. Drag & drop (fastest)**
1. Go to <https://vercel.com/new>.
2. Drag this whole folder onto the page (or zip it and upload).
3. Framework preset: **Other**. Build command: **(none)**. Output directory: **`./`** (root).
4. Deploy. Done.

**B. Vercel CLI**
```bash
npm i -g vercel        # once
cd saunaflow-vercel
vercel                 # preview deploy — accept the defaults
vercel --prod          # production deploy
```
When asked about build settings, leave the build command **empty** and the output
directory as the project root (`.`). `vercel.json` already sets sensible caching.

**C. Git → Vercel (recommended for ongoing work)**
1. Push this folder to a GitHub/GitLab/Bitbucket repo.
2. In Vercel: **Add New → Project → Import** the repo.
3. Framework preset **Other**, no build command, output dir `./`.
4. Every push to `main` auto-deploys.

### Run it locally
Because the browser loads the `.jsx` files over the network (and transpiles them with
Babel), you must serve the folder over HTTP — opening `index.html` from `file://`
**will not work**. Any static server is fine:

```bash
cd saunaflow-vercel
python3 -m http.server 8080      # then open http://localhost:8080
# or:  npx serve .
```

---

## Collecting the sign-up form submissions

> **Recommended:** create a **new Google Form** to collect fills — no Apps Script or
> deployment authorization needed, and its responses can flow into your existing sheet.
> A ready-to-paste prompt is in **`SETUP_PROMPT_collect_signups.md`**.
>
> Existing spreadsheet (link the Form's responses here):
> <https://docs.google.com/spreadsheets/d/1PA90XQQKwP-10gBWFJG4kO7G-Hldr-eX03mryan5ceA/edit>

The banner's "Secure my priority spot" form posts its fields to the URL in
`window.SF_SHEETS_ENDPOINT` (in `index.html`). Point that at a **Google Form**
`…/formResponse` endpoint (easiest — see the prompt above) or a **Google Apps Script**
Web App. Until it's set, the form runs in **demo mode** (validates + shows the success
state but doesn't send).

<details>
<summary>Alternative: Google Apps Script (posts straight into a sheet)</summary>

The partnership banner's "Secure my priority spot" form can log every sign-up to a
Google Sheet. Out of the box it runs in **demo mode** (validates + shows the success
state, but doesn't send anywhere). To turn it on:

1. Create a Google Sheet. Add a tab named **`Signups`** (optional — the script creates
   it if missing).
2. In the Sheet: **Extensions → Apps Script**. Replace the contents with:

   ```js
   function doPost(e) {
     const ss = SpreadsheetApp.getActiveSpreadsheet();
     const sheet = ss.getSheetByName('Signups') || ss.insertSheet('Signups');
     if (sheet.getLastRow() === 0) {
       sheet.appendRow(['Timestamp', 'Name', 'Email', 'Partner', 'Source']);
     }
     const p = e.parameter || {};
     sheet.appendRow([new Date(), p.name || '', p.email || '', p.partner || '', p.source || '']);
     return ContentService
       .createTextOutput(JSON.stringify({ ok: true }))
       .setMimeType(ContentService.MimeType.JSON);
   }
   ```

3. **Deploy → New deployment → Web app.**
   - *Execute as:* **Me**
   - *Who has access:* **Anyone**
   - Deploy, authorise, and copy the **Web app URL** (ends in `/exec`).
4. Open `index.html`, find this near the bottom and paste your URL:
   ```js
   window.SF_SHEETS_ENDPOINT = "https://script.google.com/macros/s/AKfy…/exec";
   ```
5. Redeploy. Sign-ups now append to the sheet with a timestamp, name, email, the
   partner ("Ealing Cricket Club") and source ("Announcement banner").

**Note on CORS:** the form posts with `mode: "no-cors"`, so the browser can't read the
response — this is normal for the Apps Script pattern and the row is still written. The
UI always advances to the success state after posting.

</details>

---

## What's on the page

Top to bottom: **Announcement banner** (marquee → opens the sign-up modal) · **Nav** ·
**Hero** (parallax) · **The Ritual** (Activation → Contrast → Integration, heat↔cold
meter) · **Benefits / three pillars** · **Membership** (pricing) · **Our Story** ·
**Brand carousel** · **Partner / Host the flow** · **FAQ** · **Connect** (contact form)
· **Footer**.

### Signature interactions
- **Parallax hero** — background scales/drifts on scroll, content fades up, flame breathes.
- **Announcement banner** — slow gold marquee (pauses on hover), pulsing "COMING SOON",
  dismissable; the whole bar opens the partnership modal.
- **Partnership modal** — Ealing CC crest × Sauna + Flow flame, name/email fields,
  client-side validation, animated success state, Esc / backdrop / ✕ to close.
- **Count-up stats**, **magnetic buttons**, **scroll reveals**, **animated FAQ accordion**,
  sliding partner-row arrows, focus-grow form fields, scroll-progress bar, film grain.

### Tweaks panel
`tweaks-panel.jsx` renders a small dev panel (motion intensity, hero parallax, film
grain). It stays **hidden** unless toggled by the design-tool host, so it does not
appear on the public site — safe to leave in. Remove the `<TweaksPanel>` block and the
`tweaks-panel.jsx` script tag in `index.html` if you want it gone entirely.

---

## Project structure

```
saunaflow-vercel/
├── index.html            # entry point — mounts the React app, holds the Sheets endpoint
├── vercel.json           # static config + asset cache headers
├── colors_and_type.css   # design tokens (colours, type scale) + @font-face for Argue
├── site.css              # all layout, component styles & animations
├── tweaks-panel.jsx      # dev-only tweak controls (hidden in production)
├── components.jsx        # primitives, nav, footer, banner, modal, motion helpers
├── sections1.jsx         # Hero, Ritual, Benefits
├── sections2.jsx         # Membership, Story, Host, FAQ, Contact
├── carousel.jsx          # brand carousel section
├── fonts/
│   └── Argue-Regular.otf # display serif (self-hosted)
└── assets/               # photography, logos, crest, pillar & flame marks
```

Scripts are loaded in order in `index.html`; each `.jsx` attaches its components to
`window`, so later files can use earlier ones. `components.jsx` defines
`window.asset(path)`, which just returns the relative path (`assets/…`) at runtime.

---

## Tech notes

- **React 18** (UMD) + **Babel Standalone** transpile the JSX in the browser. This keeps
  the project build-free and easy to edit, at the cost of a small first-load transpile.
  For a production-grade build you can precompile the `.jsx` with a bundler (Vite/esbuild)
  and drop Babel — the component code is standard React and ports directly. Not required
  to ship.
- **Fonts:** Argue (self-hosted, `fonts/Argue-Regular.otf`) for display; **DM Sans** from
  Google Fonts for body/UI.
- **Reduced motion:** all entrance animations and the marquee respect
  `prefers-reduced-motion: reduce`.
- **Icons** are inline SVG (Lucide-style) — no icon-font dependency.

## Design tokens (quick reference)

| Token | Value | Role |
|---|---|---|
| Steam | `#E7E2D8` | warm cream / light surface |
| Heat (gold) | `#E6C15A` | single accent |
| Coal | `#3E3D3D` | dark surface & ink |
| Ink | `#231F20` | near-black (hero night, footer) |
| Stone | `#9A9389` | warm mid-grey |

Radii: 6 / 8 / 16 / 24 / 48px, pill. Full token set lives in `colors_and_type.css`.

## Assets & credit
- **Ealing Cricket Club crest** (`assets/ealing-crest.png`) — partner club crest with its
  white background removed. Swap in an updated crest by replacing this file (keep the name).
- Photography and Sauna + Flow logo marks are the brand's own assets.

## The contact form
The bottom "Connect" form is **front-end only** — it validates and shows a thank-you but
does not send anywhere. Wire it to your backend/CRM (or a second Apps Script endpoint)
the same way as the banner form if you want submissions delivered.
