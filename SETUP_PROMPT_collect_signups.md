# Setup Prompt — collect sign-ups with new Google Forms

The easiest way to capture the site's form submissions: create **new Google Forms**,
link their responses to a spreadsheet, and point the site's forms at each Form's response
endpoint. **No Apps Script, no deployment authorization** — and responses can still land
in your existing spreadsheet.

There are **two forms** on the site, and this sets up **both**:
- **A — Banner priority sign-up** (top announcement bar → modal): Name, Email.
- **B — "Connect" contact form** (bottom of page): Name, Email, Phone, Message.

Copy everything in the block below and paste it to Claude (Claude Code) **together with
the `saunaflow-vercel` project files**.

> You can link the Forms' responses to your existing sheet:
> https://docs.google.com/spreadsheets/d/1PA90XQQKwP-10gBWFJG4kO7G-Hldr-eX03mryan5ceA/edit

---

```text
You are helping me deploy a static marketing site (the attached `saunaflow-vercel`
project) to Vercel and collect its form submissions via NEW Google Forms.

IMPORTANT: The attached `saunaflow-vercel` folder IS the complete, finished site —
all HTML, CSS, JS, animations, images and fonts are already built and working. Do NOT
recreate, redesign, scaffold, or rebuild it, and do not add a framework or bundler.
Your only code changes are the small form-wiring edits below. Otherwise deploy the
folder exactly as-is.

CONTEXT
- The site is build-free static HTML/CSS/JS + images. No bundler.
- There are TWO forms:
  A) The "announcement banner" (top bar) opens a modal with a Name + Email form
     ("Secure my priority spot"). Its submit handler is in `components.jsx`, inside
     `PartnershipModal` → `submit`. It posts to `window.SF_SHEETS_ENDPOINT` (set in
     index.html) fields: name, email, partner, source, timestamp.
  B) The bottom "Connect" contact form (Name, Email, Phone, "Your Space / Project"
     message). Its submit handler is in `sections2.jsx`, inside the `Contact` component
     → `submit`. It posts to `window.SF_CONTACT_ENDPOINT` (set in index.html) fields:
     name, email, phone, message, source, timestamp.
- Both post with fetch(..., { method:"POST", mode:"no-cors",
  headers:{ "Content-Type":"application/x-www-form-urlencoded" }, body }).
- Both endpoints are "" today, so both run in demo mode (validate + show success, no send).

GOAL
Wire BOTH forms to Google Forms (whose responses feed a Google Sheet), then deploy to
Vercel.

STEPS (I will do the parts that need my Google login; you tell me exactly where to click)

=== FORM A — banner priority sign-ups ===

1) Create the Form.
   - Guide me: go to https://forms.new (or forms.google.com → blank form).
   - Title it "Sauna + Flow — Priority Sign-ups".
   - Add these questions, all "Short answer", set Name and Email to Required:
       1. Name   2. Email   3. Partner   4. Source
   - (Partner/Source record which club/placement the sign-up came from.)

2) Link responses to a spreadsheet.
   - In the form's "Responses" tab → the Sheets icon → "Link to Sheets".
   - Choose "Select existing spreadsheet" and pick my spreadsheet
     (https://docs.google.com/spreadsheets/d/1PA90XQQKwP-10gBWFJG4kO7G-Hldr-eX03mryan5ceA/edit),
     OR create a new sheet if simpler — tell me the tradeoff.

3) Get Form A's entry IDs + POST URL.
   - Have me open the live form → ⋮ menu → "Get pre-filled link".
   - Fill each field with an obvious dummy value, click "Get link", copy the URL.
   - Extract the `entry.NNNNNNN` for each field; tell me which maps to Name, Email,
     Partner, Source.
   - The POST endpoint is the form's URL with `/viewform` replaced by `/formResponse`:
     https://docs.google.com/forms/d/e/<FORM_A_ID>/formResponse

4) Wire the BANNER form to Form A (you do this in code).
   - In `index.html`:
       window.SF_SHEETS_ENDPOINT = "https://docs.google.com/forms/d/e/<FORM_A_ID>/formResponse";
   - In `components.jsx`, update the `submit` body in `PartnershipModal` so the KEYS are
     Form A's entry IDs (keep mode:"no-cors"):
       const body = new URLSearchParams({
         "entry.1111111111": name.trim(),               // Name
         "entry.2222222222": email.trim(),              // Email
         "entry.3333333333": "Ealing Cricket Club",     // Partner
         "entry.4444444444": "Announcement banner",     // Source
       });
     Use the real entry IDs from step 3. Don't change any other behaviour.

=== FORM B — bottom "Connect" contact enquiries ===

5) Create a SECOND Form.
   - Title it "Sauna + Flow — Contact Enquiries".
   - Questions, all "Short answer" except Message = "Paragraph"; Name and Email Required:
       1. Name   2. Email   3. Phone   4. Message   5. Source
   - Link its responses to a spreadsheet the same way as step 2 (same spreadsheet is fine
     — it gets its own "Form Responses" tab — or a new one; tell me which you'd suggest).

6) Get Form B's entry IDs + /formResponse URL (same "Get pre-filled link" method).
   Tell me which entry ID maps to Name, Email, Phone, Message, Source.

7) Wire the CONTACT form to Form B (you do this in code).
   - In `index.html`:
       window.SF_CONTACT_ENDPOINT = "https://docs.google.com/forms/d/e/<FORM_B_ID>/formResponse";
   - In `sections2.jsx`, update the `submit` body in the `Contact` component so the KEYS
     are Form B's entry IDs (it currently posts { ...vals, source, timestamp } where vals
     is { name, email, phone, message }). Example:
       const body = new URLSearchParams({
         "entry.5555555555": vals.name,      // Name
         "entry.6666666666": vals.email,     // Email
         "entry.7777777777": vals.phone,     // Phone
         "entry.8888888888": vals.message,   // Message
         "entry.9999999999": "Contact form", // Source
       });
     Use the real entry IDs. Don't change any other behaviour.

8) Test BOTH locally.
   - Run a static server (e.g. `python3 -m http.server 8080`) and open the site.
   - Submit the BANNER form (open the top announcement bar) with a test Name/Email.
   - Submit the BOTTOM "Connect" form with a test Name/Email/Phone/Message.
   - Confirm a new response appears in each Form (Responses tab) and its linked Sheet.
   - If nothing appears: check each endpoint ends in `/formResponse`, the entry IDs are
     correct for THAT form, and every Required question has a value in the POST.

9) Deploy to Vercel as a static site (no build command, output dir = project root).
   Prefer Git → Vercel import so future edits auto-deploy; otherwise `vercel --prod`.
   Give me the production URL when it's live.

NOTES
- The POST uses mode:"no-cors", so the browser can't read Google's response — that's
  expected; the response is still recorded. Each form's UI always advances to success.
- Keep the project build-free; don't add a framework/bundler.
- Don't mix up the entry IDs between the two forms — Form A's IDs only work on Form A.
```

---

## Which method should I use?

- **Google Forms (this file)** — simplest. No script, no authorization headaches. Responses
  auto-collect and can flow into your existing spreadsheet. Slight extra step: grabbing the
  `entry.*` field IDs once per form.
- **Apps Script (alternative)** — posts straight into a sheet with your own column names and
  no separate Form, but you must authorize a Web App deployment. See README.md for that
  route (works the same way for both `SF_SHEETS_ENDPOINT` and `SF_CONTACT_ENDPOINT`).
