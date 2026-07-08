# CreatorFox — Premium Agency Website

A complete redesign of creatorfox.com: a futuristic, award-grade agency site built on **Next.js 14, Tailwind CSS, GSAP (ScrollTrigger + SplitText), Lenis smooth scroll, and React Three Fiber**.

Brand system: **#F3BC09 gold** on warm-black "carbon" with bone-white editorial sections, Clash Display + Satoshi typography, and a signature 3D golden particle galaxy ("the fox eye") in the hero.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve production build
```

Requires Node 18.17+.

## Deployment

**Vercel (recommended):** push to GitHub → import at vercel.com → deploy. Zero config needed.

**Any Node host:** `npm run build && npm start` behind a reverse proxy.

Set the production domain in `src/data/site.ts` (`url`) — it drives canonical URLs, sitemap and JSON-LD.

## Project structure

```
src/
├── app/                    # routes (App Router)
│   ├── layout.tsx          # fonts, providers, Organization schema
│   ├── page.tsx            # Home
│   ├── template.tsx        # page-transition animation
│   ├── about/ services/ services/[slug]/ case-studies/
│   ├── portfolio/ industries/ blog/ careers/ contact/
│   ├── thank-you/ privacy-policy/ terms/ not-found.tsx
│   ├── sitemap.ts robots.ts icon.svg
├── components/
│   ├── layout/             # Header (mega menu), Footer, Preloader, PageHero…
│   ├── home/               # homepage sections
│   ├── ui/                 # Reveal/SplitReveal/ScentLine, Magnetic, Cursor,
│   │                       # Marquee, Counter, Accordion, CtaButton
│   ├── three/HeroScene.tsx # R3F particle galaxy
│   └── providers/SmoothScroll.tsx
├── data/                   # ALL content lives here — edit copy without touching UI
│   ├── site.ts             # contact info, offices, stats, FAQs, testimonials
│   ├── services.ts         # all 14 service pages' content
│   ├── case-studies.ts     # case study entries
│   └── content.ts          # blog, careers, values, timeline
└── lib/                    # gsap registration, utils
```

**All 14 service pages** (SEO, Google Ads, Meta Ads, Social, GBP, Website/WordPress/Shopify dev, AI Automation, Branding, Graphic Design, Video, Content, Email) are generated from `src/data/services.ts` through one template at `app/services/[slug]/page.tsx` — statically rendered at build time, each with hero, problem, solution, benefits, process, results, tools, FAQs (with FAQ schema) and related services.

## How to customise

| Change | Where |
|---|---|
| Brand colors | `tailwind.config.ts` → `colors` (single source of truth) |
| Logo | `src/components/layout/Logo.tsx` (swap the SVG path) + `src/app/icon.svg` |
| Contact info / offices | `src/data/site.ts` |
| Service copy | `src/data/services.ts` |
| Add a service | Add an entry to `services.ts` — page, sitemap, menus, footer all update automatically |
| Contact form backend | `src/components/contact/ContactForm.tsx` → set `FORM_ENDPOINT` (Formspree/webhook) |
| Calendly | `src/data/site.ts` → `calendly` |

## Content to verify before launch ⚠️

Placeholders styled on real patterns that need your confirmation or replacement:

1. **Case study clients & numbers** (`data/case-studies.ts`) — anonymised; replace with approved client names, logos and verified metrics.
2. **Stats** (250+ clients, 640+ projects, 93% retention, founding year 2018, timeline years) — verify every figure (`data/site.ts`, `data/content.ts`).
3. **Testimonials** — replace with real, permissioned quotes.
4. **Social URLs** in `data/site.ts`.
5. **Calendly URL** and **form endpoint**.
6. **Blog posts** are teaser data only — connect a CMS (see below) for real articles.
7. **Logo** — a placeholder fox mark was drawn; swap in the official SVG.

## Performance & accessibility built in

- Static generation for every page; the only heavy client bundle (Three.js) is code-split via `next/dynamic` and never blocks first paint.
- Fonts preconnected + `display=swap`; no layout-shifting assets; no stock images (generative gradient art).
- `prefers-reduced-motion` disables smooth scroll, cursor, preloader, 3D auto-rotation and all reveals.
- Semantic HTML, skip link, ARIA on accordion/menus/testimonial tabs, keyboard-focus styles, WCAG-conscious contrast.
- SEO: per-page metadata + canonicals, OG/Twitter cards, `sitemap.xml`, `robots.txt`, Organization + Service + FAQPage + BreadcrumbList JSON-LD.

## Optional next steps

- **Blog CMS**: pair `app/blog` with MDX or a headless CMS (Sanity/Contentlayer) — card components are ready.
- **OG images**: add `opengraph-image.tsx` per route for branded share cards.
- **Exit-intent modal**: a `mouseleave` listener on `document` gating a CTA dialog — hook into `FloatingCta`.
- **Analytics**: add GA4/Umami snippet in `app/layout.tsx`.
