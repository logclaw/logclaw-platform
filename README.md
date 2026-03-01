# LogClaw Platform

> AI-powered SRE platform that turns terabytes of Kubernetes logs into actionable incidents — before your users notice anything is wrong.

[![Deploy to Cloudflare Pages](https://img.shields.io/badge/Deploys%20on-Cloudflare%20Pages-F38020?logo=cloudflare&logoColor=white)](https://pages.cloudflare.com)
[![Next.js](https://img.shields.io/badge/Next.js-15.3-black?logo=next.js)](https://nextjs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## What is this?

Think of LogClaw like a **smoke detector for your software**.

A regular smoke detector sits in your home, listens for danger, and screams when something is burning. LogClaw does the same thing — but for the computer systems that power apps and websites. It watches your infrastructure (Kafka message queues, Flink data pipelines, OpenSearch databases) and alerts you on a dashboard the moment something starts going wrong.

**This repo is the control room.** It's the web app that your engineering team logs into to:

- See live health dashboards for every system
- Onboard new customers by auto-generating Kubernetes configuration via GitHub PRs
- Receive and store health reports sent from the LogClaw Agent running in each cluster
- Manage multi-tenant access with secure per-customer JWT tokens

---

## How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│  Your Browser                                                   │
│  app.logclaw.ai ──→ Next.js (Cloudflare Pages)                 │
│                          │                                      │
│                    ┌─────┴──────┐                               │
│                    │            │                               │
│               Clerk Auth    Supabase DB                        │
│              (login/SSO)  (tenants + metrics)                  │
└─────────────────────────────────────────────────────────────────┘
                          ↑
              POST /api/metrics (Bearer JWT)
                          │
┌─────────────────────────────────────────────────────────────────┐
│  Your Kubernetes Cluster                                        │
│  logclaw-agent pod → collects Kafka lag, Flink jobs,           │
│                       OpenSearch health, ESO status            │
│                       every 30 seconds                          │
└─────────────────────────────────────────────────────────────────┘
```

The agent (see [`logclaw/logclaw-agent`](https://github.com/logclaw/logclaw-agent)) lives in your cluster and pushes data here. This platform stores it and shows it on the dashboard.

---

## Quick Start

Get the platform running locally in under 5 minutes:

```bash
# 1. Clone the repo
git clone https://github.com/logclaw/logclaw-platform.git
cd logclaw-platform

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env.local
# Open .env.local and fill in your keys (see Environment Variables below)

# 4. Start the dev server
npx next dev --turbopack --port 3000
```

Open [http://localhost:3000](http://localhost:3000) — you should see the marketing homepage.

> **Why `--turbopack`?** Next.js dev mode normally uses webpack's `eval-source-map`, which is blocked by Node.js 24's V8 security context in the Edge Runtime. Turbopack avoids this entirely. Always use the command above when developing locally.

---

## Prerequisites

| Tool | Version | Why |
|---|---|---|
| [Node.js](https://nodejs.org) | 20+ | Runtime (tested on 24.x) |
| [pnpm](https://pnpm.io) | 8+ | Package manager |
| [Clerk account](https://clerk.com) | Free tier | Authentication |
| [Supabase project](https://supabase.com) | Free tier | PostgreSQL database |
| [GitHub App](https://github.com/settings/apps) | — | Onboarding wizard (optional for local dev) |

---

## Local Development

### 1 — Install dependencies

```bash
pnpm install
```

### 2 — Environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

See the [Environment Variables](#environment-variables) section for what each key means and where to get it.

### 3 — Database setup

This project uses [Drizzle ORM](https://orm.drizzle.team) with Supabase PostgreSQL.

**Get your connection string from Supabase:**
1. Go to your [Supabase project](https://supabase.com/dashboard)
2. Navigate to **Settings → Database → Connection string**
3. Click the **Transaction pooler** tab
4. Copy the URI — it looks like:
   ```
   postgresql://postgres.xxxx:PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
5. Paste it as `DATABASE_URL` in your `.env.local`

> **Important:** Use the **Transaction Pooler** URL (port `6543`), not the direct database URL (port `5432`). The direct URL uses a hostname that may not resolve depending on your network.

**Apply the schema:**

```bash
# Generate the migration SQL
pnpm db:generate

# The SQL file is created in drizzle/
# Open your Supabase dashboard → SQL Editor
# Paste and run the generated SQL
```

### 4 — Start the dev server

```bash
npx next dev --turbopack --port 3000
```

| URL | What you see |
|---|---|
| `http://localhost:3000` | Marketing homepage |
| `http://localhost:3000/sign-up` | Create account (Clerk) |
| `http://localhost:3000/sign-in` | Sign in |
| `http://localhost:3000/onboard` | Onboarding wizard (sign in first) |
| `http://localhost:3000/dashboard` | Dashboard (sign in first) |

### 5 — Test the API

Once signed in, you can test the metrics endpoint directly:

```bash
# Simulate an agent push (replace JWT with your LOGCLAW_AGENT_JWT_SECRET value)
curl -X POST http://localhost:3000/api/metrics \
  -H "Authorization: Bearer YOUR_JWT_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId": "your-tenant-slug",
    "collectedAt": "2025-01-01T00:00:00Z",
    "kafkaLag": { "payments.v1": 1234 },
    "flinkJobs": [{ "name": "processor", "state": "RUNNING", "restarts": 0 }],
    "osHealth": { "status": "green", "numberOfNodes": 3, "numberOfDataNodes": 3 },
    "esoStatus": [{ "name": "kafka-secrets", "ready": true, "lastSync": "2025-01-01T00:00:00Z" }]
  }'
# Expected: {"ok":true,"health":"healthy"}
```

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in each value.

### Authentication (Clerk)

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✅ | Publishable key from [Clerk dashboard](https://dashboard.clerk.com) |
| `CLERK_SECRET_KEY` | ✅ | Secret key from Clerk dashboard (never expose to browser) |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | ✅ | Set to `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | ✅ | Set to `/sign-up` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | ✅ | Set to `/dashboard` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | ✅ | Set to `/onboard` |

### Database

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | Supabase **Transaction Pooler** URI (port 6543) |

### GitHub App

| Variable | Required | Description |
|---|---|---|
| `GITHUB_APP_ID` | ✅ | Numeric app ID from GitHub App settings |
| `GITHUB_APP_PRIVATE_KEY` | ✅ | Base64-encoded PEM private key. Generate: `base64 -i logclaw.pem \| tr -d '\n'` |
| `GITHUB_APP_WEBHOOK_SECRET` | ✅ | Random string set in GitHub App webhook config |
| `NEXT_PUBLIC_GITHUB_APP_INSTALL_URL` | ✅ | `https://github.com/apps/YOUR_APP/installations/new` |

### Agent

| Variable | Required | Description |
|---|---|---|
| `LOGCLAW_AGENT_JWT_SECRET` | ✅ | Shared secret for verifying agent pushes. Generate: `openssl rand -hex 32` |

### Optional

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_CALENDLY_URL` | — | Calendly link shown on pricing/contact pages |

---

## Project Structure

```
logclaw-platform/
├── src/
│   ├── app/
│   │   ├── (marketing)/        # Public pages: homepage, pricing, security
│   │   ├── (auth)/             # Sign-in, sign-up (Clerk hosted UI)
│   │   ├── (app)/              # Protected: /onboard, /dashboard/[tenantId]
│   │   │   ├── onboard/        # 7-step onboarding wizard
│   │   │   └── dashboard/      # Per-tenant health dashboards
│   │   └── api/
│   │       ├── metrics/        # POST (agent push) + GET (dashboard reads)
│   │       ├── tenants/        # CRUD for tenant records
│   │       ├── onboard/pr/     # Creates GitHub PR for Helm values
│   │       └── webhooks/github # GitHub App webhook handler
│   └── middleware.ts           # Clerk auth guard for /dashboard + /onboard
├── components/
│   ├── dashboard/              # HealthRing, MetricCard, ComponentStatusGrid
│   ├── marketing/              # Navbar, Hero, PricingCard
│   ├── onboard/                # Step1–7 wizard components
│   └── ui/                    # Shared: Button, Card, Badge, etc.
├── lib/
│   ├── db/
│   │   ├── client.ts           # postgres-js + Drizzle client
│   │   └── schema.ts           # tenants, metrics, integrations, onboardSessions
│   ├── metrics/aggregator.ts   # Converts raw metrics → health: healthy|degraded|critical
│   └── github-app/client.ts    # Creates Helm values PR via GitHub App
├── drizzle/                    # Generated SQL migrations
├── helm/logclaw-agent/         # Helm chart bundled for onboarding downloads
├── next.config.ts              # Turbopack-compatible, Cloudflare-optimised
├── wrangler.toml               # Cloudflare Pages project config
└── drizzle.config.ts           # Points to DATABASE_URL
```

---

## Deployment

### Cloudflare Pages (production)

```bash
# Build for Cloudflare Workers (Edge Runtime)
pnpm pages:build

# Deploy
pnpm deploy
# or: wrangler pages deploy .vercel/output/static --project-name=logclaw-platform
```

**Set environment variables** in the [Cloudflare Pages dashboard](https://dash.cloudflare.com) under **Settings → Environment variables**. Add all variables from the [Environment Variables](#environment-variables) section.

> **Note for Cloudflare deployment:** The database driver currently uses `postgres-js` (TCP), which is incompatible with Cloudflare Workers. Before deploying to Cloudflare, swap `lib/db/client.ts` to use `@neondatabase/serverless` (HTTP transport) and point `DATABASE_URL` to a [Neon](https://neon.tech) database.

---

## Database Schema

| Table | Purpose |
|---|---|
| `tenants` | One row per customer cluster. Stores slug, name, tier, cloud provider, GitHub repo |
| `metrics` | Time-series health data from agents. Kafka lag, Flink jobs, OpenSearch status as JSONB |
| `integrations` | Per-tenant integration config (ticketing, alerting) |
| `onboard_sessions` | Wizard progress — persists step state across page refreshes |

---

## Contributing

1. Fork the repo and create a branch: `git checkout -b feat/your-feature`
2. Make your changes
3. Make sure the dev server starts: `npx next dev --turbopack --port 3000`
4. Open a pull request

Please open an issue first for large changes so we can discuss the approach.

---

## License

MIT — see [LICENSE](LICENSE)
