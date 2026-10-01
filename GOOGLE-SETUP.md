# CreatorFox Google measurement setup

SEO is published for https://www.creatorfox.com. Sitemap: https://www.creatorfox.com/sitemap.xml.

Set these Production environment variables in the existing Vercel project, then rebuild:

- GOOGLE_ANALYTICS_ID: the GA4 web data stream Measurement ID (G-…).
- GOOGLE_ADS_ID: the Google Ads tag ID (AW-…).
- GOOGLE_ADS_CONVERSION_LABEL: the label from the enquiry conversion action event snippet. This is not the Ads customer ID.
- GOOGLE_SITE_VERIFICATION: only the content value of the Search Console HTML verification tag for URL-prefix property https://www.creatorfox.com/.

These are public identifiers, not passwords or API secrets. No fabricated IDs are installed. Missing IDs leave measurement inactive.

For a Search Console Domain property (creatorfox.com), add Google's exact TXT record at your DNS provider instead; the HTML verification tag verifies only a URL-prefix property. Click Verify in Search Console after deployment and submit sitemap.xml.

Tracking runs across all pages only after the visitor allows optional measurement. A successful server or FormSubmit acceptance dispatches creatorfox:enquiry-accepted. It sends GA4 generate_lead and the configured Ads conversion once per page session. Failed submissions, form clicks, PDF downloads and calendar opens do not count as conversions. Acceptance measures a lead submission, not confirmed email delivery. No form names, email addresses or enquiry messages are included in measurement parameters.

In GA4 mark generate_lead as a key event if desired. If direct Ads conversion is used for bidding, avoid also importing the same GA4 event as a second primary conversion. Verify with Tag Assistant, GA4 Realtime/DebugView and the Google Ads conversion diagnostics using a controlled successful test submission. Account linking between GA4 and Ads is a separate Google admin action.

Current status: awaiting real GA4 ID, Ads ID and conversion label, and Search Console verification token or DNS verification. Deployment of code alone does not create, verify or link Google accounts.
