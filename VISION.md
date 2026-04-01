# Setup-AI: Shopify for Service Businesses

## The Thesis

Independent service businesses — phone repair shops, tax preparers, plumbers, lawn care, cleaning services — need websites that actually work. Not a Wix canvas they'll never finish. Not a WordPress install they can't maintain. A complete, beautiful, functional website with booking, scheduling, email notifications, and a CMS they can actually use. Out of the box.

We build vertical-specific themes on a shared platform. The infrastructure costs near zero. The design is generated (Variant.ai). The CMS, auth, admin panel, and multi-tenant hosting are provided by EmDash + Cloudflare. The only variable cost is domain knowledge — understanding what each vertical actually needs.

## Three-Layer Architecture

```
WEBSITE (external)     What customers see
  └── Themes           Shopify-like skins. Each vertical has 2-3 curated themes.
                       Phone repair: Revive (dark), Goth-Clean (light).
                       Tax prep: TBD. Plumbing: TBD.
                       Themes are Astro projects reading from EmDash collections.

OS (internal)          What makes every site functional
  └── Plugins          Booking, scheduling, email notifications, Google Calendar
                       sync, cancellation flow, payment processing.
                       Same OS across all verticals. Runs as EmDash plugins
                       with declared capabilities (network:fetch, email:send).

MIRROR (CMS)           What the owner manages
  └── EmDash Admin     Edit services, hours, FAQ, contact info.
                       No code. No deploy. Click and change.
                       Theme enforces structure — can change content, not layout.
```

## What's Shared vs. What's Vertical

### Shared across ALL verticals (build once)
- EmDash CMS (collections, admin, auth, media)
- Booking OS plugin (calendar sync, email, scheduling, cancellation)
- Multi-tenant infrastructure (Cloudflare for Platforms)
- Subscription billing (Stripe)

### Vertical-specific (build per niche)
- Theme designs (2-3 per vertical, generated via Variant.ai)
- Collection schemas (phone repair has devices + issues; tax prep has specialties + credentials; plumbing has service areas + emergency availability)
- Booking flow variations (phone repair: device → issue → schedule; tax prep: service type → document upload → schedule)
- Trust signals (phone repair: warranty + certifications; tax prep: licenses + years of experience)
- SEO content structure (different JSON-LD, different local signals)

## Verticals

### Active
- **Phone Repair** — First wedge. 2,365 scored leads. Revive theme built. Booking OS proven. Collections: services, devices, issue types, process steps, FAQ.

### Planned
- **Tax Preparers** — Second vertical. Existing research in setup-os. Different booking flow (service type → document upload). Credential badges as trust signals.
- **Plumbing** — Service area maps. Emergency availability toggle. Estimate requests instead of fixed-time booking.
- **Lawn Care / Landscaping** — Seasonal service packages. Recurring booking. Before/after photo galleries.
- **Cleaning Services** — Square footage estimator. Recurring schedule. Checklist-based service tiers.

### Expansion criteria
- Service-based (not product/retail)
- Booking/scheduling is core to the business
- Current solutions are bad (GoDaddy, broken WordPress, social-only)
- Can be scored and prospected at scale (Google Maps, Yelp, BBB)

## Pricing

| Tier | Price | What they get |
|------|-------|--------------|
| Self-Serve | $49/mo | Website + booking + CMS. Customer edits their own site. |
| Professional | $99/mo | + Custom domain + branded emails + priority support. |
| Managed | $249/mo | We handle everything. Customer never logs in. |

## Revenue Strategy (Option C)

Sell managed tier ($249/mo) NOW to fund platform development. Build self-serve tier in parallel. Managed customers don't need the CMS — we edit for them. When CMS is ready, migrate them to self-serve and sell $49/$99 tiers.

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| CMS + Auth + Admin | EmDash (MIT, v0.1) | Free CMS, plugin sandbox, passkey auth, collections, media |
| Frontend Framework | Astro + React islands | Server-rendered pages + interactive booking wizard |
| Styling | Tailwind CSS v4 | Same tokens across themes |
| Database | SQLite (local) / D1 (Cloudflare) | EmDash manages schema, we manage collections |
| Storage | Local (dev) / R2 (production) | Customer uploads |
| Backend Plugins | EmDash plugin system | Declared capabilities, sandboxed, external HTTP |
| Calendar | Google Calendar API | Via plugin with network:fetch capability |
| Email | Resend | Via plugin with network:fetch capability |
| Hosting | Cloudflare Workers | Scale-to-zero, multi-tenant via Workers for Platforms |
| Design | Variant.ai | Theme generation — iterate design system, extend pages |

## What This Repo Contains

- `src/pages/` — Revive theme (Astro pages)
- `src/components/` — React islands (booking wizard, interactive UI)
- `src/plugins/` — OS plugins (booking, calendar, email)
- `src/styles/` — Theme tokens (Revive dark theme)
- `src/layouts/` — Shared layout (sidebar, footer)
- `seed/` — Collection schemas + demo data
- `astro.config.mjs` — EmDash integration config

## Repos

| Repo | Purpose |
|------|---------|
| `kanoliban/setup-ai-emdash` | THIS REPO — EmDash platform (themes + OS plugins) |
| `kanoliban/setup-ai-platform` | Previous Next.js prototype (deprecated by this repo) |
| `kanoliban/setup-os` | Sales pipeline + operations (lead scoring, outreach, mockups) |
| `gothtech5/goth-repair` | Original phone repair template (production-proven, pre-platform) |

## Key Decisions Log

| Date | Decision | Why |
|------|----------|-----|
| 2026-03-25 | Theme model validated | Variant.ai Revive + goth-repair render same data through different visuals |
| 2026-03-25 | SaaS over fork model | Can't do CMS, auth, or multi-tenant with forked repos |
| 2026-04-01 | Option C (hybrid) | Sell managed now, build platform in parallel. Revenue funds engineering. |
| 2026-04-01 | EmDash over custom CMS | Spike passed all 7 criteria. CMS + auth + admin for free. |
| 2026-04-01 | Cloudflare over Vercel | EmDash native to Cloudflare Workers. Scale-to-zero multi-tenant. |
