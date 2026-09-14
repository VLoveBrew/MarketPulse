# MarketPulse Deployment Notes

## Current app

MarketPulse is a Vite React single-page prototype for a market and competitor intelligence engine.

The current MVP is frontend-only. It demonstrates the product journey, including:

- Free market snapshot generation
- Paid deep-dive modules
- MCP access positioning
- Human consultant upsell offers
- A practical monetization ladder

## Local commands

```bash
pnpm install
pnpm run dev
pnpm run build
pnpm run preview
```

The production build outputs static files to `dist/`.

## Static deployment

Deploy the contents of `dist/` to any static host:

- Vercel
- Netlify
- Cloudflare Pages
- GitHub Pages
- S3/CloudFront

Required hosting behavior:

- Serve `index.html` for unknown routes if deep links are added later.
- Serve `manifest.webmanifest`, `icon.svg`, and `sw.js` from the site root.
- Use HTTPS for service worker support.

## Current production limitations

- No live research backend yet.
- No source ingestion or evidence ledger storage yet.
- No account system, payments, or saved workspaces yet.
- Paid buttons are prototype interactions only.
- MCP tools are positioned in the UI but not implemented as a server yet.
- No formal test suite yet.

## Recommended next production milestones

1. Add a real research backend with source collection, extraction, and citation tracking.
2. Define the market intelligence ontology for competitors, segments, signals, risks, and claims.
3. Add account creation, saved research projects, and report exports.
4. Add Stripe for paid modules and consultant intake.
5. Implement an MCP server exposing `research_market`, `map_competitors`, `score_opportunity`, and `generate_brief`.
