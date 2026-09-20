# CreatorFox AI agency website

A pre-rendered 19-page agency site with eight service pages, industry coverage, illustrative case studies, contact and privacy pages. Uses the supplied CreatorFox logo and imagery. Lightweight HTML/CSS/JS keeps the content accessible without a client-side framework.

## Run

Requires Node 22+.

```
npm ci
npm run build
npm run dev
npm test
```

## Deploy to Vercel

Import the `ai-agency-website` branch from the CreatorFox repository. Build command: `npm run build`. Output: `dist`. Framework: Other. Node functions are in `api/`. Set production branch to `ai-agency-website` for this separate project, or deploy that branch explicitly. Existing main-branch site is preserved.

Set SITE_URL to the actual production origin and rebuild for correct canonicals, sitemap and origin checks. The build also uses VERCEL_PROJECT_PRODUCTION_URL when SITE_URL is absent. The contact API requires an explicit SITE_URL.

## Enable proposal email

Set all values listed in `.env.example` in the Vercel project, then redeploy:

- Resend API key and a verified sender address (domain verification required).
- Cloudflare Turnstile site key and secret for the deployed hostname.
- Upstash Redis REST URL and token for distributed rate limits and deduplication.
- A random FORM_SIGNING_SECRET (at least 32 bytes).
- SITE_URL: exact public origin without trailing slash.
- LEAD_NOTIFICATION_EMAIL defaults to make.creatorfox@gmail.com.

Until these are present, submission is disabled and the page offers direct email. It never claims an email was sent. A successful API response means Resend accepted the message, not proof of inbox delivery.

Proposals are service-specific initial scope outlines with the user's brief, budget preference, indicative timeline and next steps. Prices are intentionally not invented; the final priced quote requires scope review. Generated PDFs currently use embedded Latin PDF fonts; non-Latin characters are transliterated where possible and otherwise omitted. The original brief is preserved in the email body. Embed a suitable Unicode font before using this with predominantly non-Latin briefs.

The enquiry inbox receives a BCC of the same email and PDF. Spam defences: honeypot, signed time window, exact-origin check, field and payload validation, server-side Turnstile with hostname/action validation, distributed per-IP and per-email limits, short-lived lock and provider idempotency. No system guarantees zero spam. Do not substitute test CAPTCHA keys in production.

## Content integrity

No major global company is represented as a client. Case-study scenarios are prominently labelled illustrative. Nike, Spotify and Shopify are independent brand observations, not client relationships. Replace them with approved, evidenced client work when available. Famous influencer videos are omitted pending verified official embed links; no invented endorsement or copied video is used.

## Validation

`npm test` checks all eight PDF variants, long input, malicious email input, service and consent validation, signed timestamps and the unconfigured fail-closed response. Final delivery and live mobile/browser testing must be completed once hosting and email services are connected.
