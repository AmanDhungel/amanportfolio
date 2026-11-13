# Aman Dhungel, portfolio

Personal site for Aman Dhungel, full-stack developer. Next.js 16 (App Router), TypeScript, Tailwind CSS 4, GSAP 3.15 and Lenis. Every page is prerendered as static HTML; the only server code is the contact form.

## Run it locally

Requires Node.js 20.9 or newer.

```bash
npm install
cp .env.example .env.local   # optional: only needed to send real contact-form email
npm run dev                  # http://localhost:3000
```

Before you push:

```bash
npm run lint
npm run build && npm start   # production build at http://localhost:3000
```

The opening sequence plays once per browser tab. To see it again, open a new tab or run `sessionStorage.clear()` in the console.

## Edit the content

All text lives in [`src/content/site.ts`](src/content/site.ts). Components only read from it, so you never need to open them to change words.

| To change | Edit |
| --- | --- |
| Name, headline, location, availability, email, phone, links | `person` |
| SEO title and description | `person.seo` |
| About text, degree, certifications | `about` |
| The three large projects and their case-study pages | `featured` |
| The Sunyaverse walkthrough steps | `walkthrough.steps` |
| The compact project list | `otherWork` |
| Jobs | `experience` (newest first; `current: true` shows the Current label) |
| Skill groups | `skills` |
| Nav links | `nav` |

Notes:

- **Featured projects.** Each entry becomes a page at `/work/<slug>`. The slug is used in URLs and the sitemap, so avoid changing it once the site is shared. `qualities` holds the Faster / Safer / More reliable lines. Keep them plain and true: name what you used and why, without percentages.
- **Adding a featured project.** Add an object to `featured` with a screenshot (see below). The page, metadata, sitemap entry and index row are created automatically.
- **Ordering.** Lists render in the order they appear in the file.

## Swap images

Screenshots are in [`src/assets/work/`](src/assets/work/). They were captured from the live sites at 1440 × 900 with Playwright. They are imported statically, so Next.js knows their size, makes a blur placeholder, and serves AVIF/WebP at the right width.

- **To replace one:** overwrite the PNG with a new one of the same name. Any size works, but 16:10 at 2160 × 1350 matches the rest.
- **To add one:** put the file in `src/assets/work/`, import it at the top of `site.ts`, and pass it as `shot: { src, alt }`. Write `alt` text that describes what the screenshot shows.
- **Walkthrough screenshots.** Each walkthrough step shows a labelled diagram until you add a screenshot. Add `shot: { src, alt }` to that step in `walkthrough.steps` and the screenshot replaces the diagram. Good candidates are the business dashboard, the staff roster, and the ticket scanner, which all sit behind a login.

## Swap the resume

Put the PDF at **`public/Aman_Dhungel_Resume.pdf`**. Every Download resume button links there. To use a different file name, change `person.resume` in `site.ts`.

## Contact form

The form posts to a server action ([`src/app/actions/contact.ts`](src/app/actions/contact.ts)) that sends email through [Resend](https://resend.com). It validates every field, ignores bots with a hidden honeypot field and a minimum fill time, and limits each IP to 5 messages per 10 minutes. The limit is per server instance, so it stops bursts rather than a determined attacker.

1. Create a free Resend account with **dhungelaman2000@gmail.com** and create an API key.
2. Set `RESEND_API_KEY` (in `.env.local` locally, and on Vercel for production).
3. Until a domain is verified in Resend, mail is sent from `onboarding@resend.dev`, and Resend only delivers it to the address you signed up with. That is fine for a contact form that emails you.
4. To send from your own domain, verify amandhungel.com.np in Resend (it gives you DNS records to add) and set `CONTACT_FROM_EMAIL="Portfolio <hello@amandhungel.com.np>"`. After that the form can deliver to any address.

Without a key the site still works: the form tells visitors to email you directly.

## Deploy to Vercel

1. Push this repository to a new GitHub repo, for example `AmanDhungel/portfolio-next`:
   ```bash
   git remote add origin https://github.com/AmanDhungel/portfolio-next.git
   git push -u origin main
   ```
2. On [vercel.com/new](https://vercel.com/new), import the repo. Vercel detects Next.js, so leave the build settings as they are.
3. Under **Environment Variables**, add `RESEND_API_KEY` (and `CONTACT_TO_EMAIL` / `CONTACT_FROM_EMAIL` if you use them). Leave `NEXT_PUBLIC_SITE_URL` empty for now.
4. Click **Deploy**. The site goes live at `https://<project>.vercel.app`, and every later push to `main` redeploys it.

### Custom domain (amandhungel.com.np)

The site's address is `https://www.amandhungel.com.np`, set once as `PRODUCTION_URL` in [`src/lib/site-url.ts`](src/lib/site-url.ts).

- **Production builds on Vercel** use it for canonical URLs, the sitemap, `robots.txt`, Open Graph and JSON-LD, whatever `NEXT_PUBLIC_SITE_URL` says. Previews and local builds use `NEXT_PUBLIC_SITE_URL`, then Vercel's domain, then localhost.
- **amandhungel.info** (with or without `www`) redirects permanently to the same path on amandhungel.com.np. The redirect is in [`next.config.ts`](next.config.ts).
- **To change domain**, edit `PRODUCTION_URL`, add the new domain in Vercel (**Project → Settings → Domains**), and redeploy.

After a domain change, add the domain in [Google Search Console](https://search.google.com/search-console) and submit `https://www.amandhungel.com.np/sitemap.xml`.

## How the motion works

All animation lives in client components under [`src/components/motion/`](src/components/motion/). Pages and content stay server components, so all text is in the HTML.

- **[`src/lib/gsap.ts`](src/lib/gsap.ts)** registers ScrollTrigger, SplitText, Flip and `useGSAP` once, and holds the motion tokens (eases, durations, media queries).
- **[`src/lib/boot-script.ts`](src/lib/boot-script.ts)** runs inline before first paint. It adds `js-motion` to `<html>` (or nothing at all with reduced motion) and `intro-seen` after the first visit in a tab. Elements are only ever hidden through `js-motion`, and a failsafe removes it if the scripts have not started within 4s.
- **[`MotionProvider`](src/components/motion/MotionProvider.tsx)** runs Lenis on GSAP's ticker, keeps it in sync with ScrollTrigger, scrolls to the top on page change, and draws the progress line.
- **[`Intro`](src/components/motion/Intro.tsx)** is the opening sequence. Any click, key or scroll skips it.
- **[`PageMotion`](src/components/motion/PageMotion.tsx)** reads `data-*` attributes on the server markup: `data-split="chars" | "lines"`, `data-reveal="clip"`, `data-work-row` / `data-batch-item`, `data-skill-group`, `data-timeline`, `data-magnetic`. To animate a new element, add the attribute; no new code is needed.
- **[`WorkPreview`](src/components/motion/WorkPreview.tsx)** and **[`WalkthroughMotion`](src/components/motion/WalkthroughMotion.tsx)** handle the cursor preview and the one pinned section.

Rules the code follows:

- Every effect sits inside `gsap.matchMedia()`. Reduced motion shows the final state with no intro and no Lenis. Below 1024px there is no pinning and no cursor effect.
- Reveals play once. Only `transform`, `opacity` and `clip-path` are animated.
- Content waiting to reveal is hidden with `opacity`, never `visibility`, so screen readers can still reach it.

## Project map

```
src/
  app/                    routes, metadata, sitemap, robots, OG image, icons
    actions/contact.ts    contact form server action
    work/[slug]/page.tsx  case-study pages (one per featured project)
  assets/                 screenshots and fonts for the OG image
  components/
    layout/               nav, footer, smooth-scroll anchor link
    sections/             page sections (server components)
    contact/              form and copy-email button (client)
    motion/               every animation (client)
  content/site.ts         all copy
  lib/                    gsap setup, boot script, site URL, hooks
```
