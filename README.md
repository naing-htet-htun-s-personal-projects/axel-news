# Axel News

**AI-powered Myanmar IT news aggregation, enrichment, and semantic search platform.** Built with Next.js 16, Supabase (PostgreSQL + pgvector), Clerk, Playwright, and Groq/Google AI.

---

## Overview

Axel News collects Myanmar and international tech news from RSS feeds and web sources, enriches articles with AI-generated summaries, sentiment, and bias analysis, indexes them with vector embeddings for semantic search, and delivers a fast, installable PWA experience with offline support.

---

## Features

- **AI Enrichment** — Automatically generates concise summaries, sentiment badges, bias notes, and language tags (`EN` / `MM`) using Groq and Google AI (`npm run enrich`).
- **Vector Semantic Search** — Combines `pgvector` similarity search with keyword filtering via `/api/search` (`npm run embed`).
- **RSS & Playwright Scraper** — Aggregates articles from configurable RSS and Playwright-scraped sources (`npm run scrape`), managed via `/admin/sources`.
- **PWA & Offline Support** — Installable Progressive Web App with service worker caching (`public/sw.js`, `public/manifest.json`) and a dedicated `/offline` fallback page.
- **Saved Articles & Auth** — Bookmark articles to `/saved` with Clerk authentication.
- **Bilingual UI (EN / MM)** — Seamless English and Myanmar language switching with `Noto Sans Myanmar` typography and dark mode support.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling & Motion** | Tailwind CSS v4, Framer Motion |
| **Database & Search** | Supabase (PostgreSQL + `pgvector`) |
| **Authentication** | Clerk (`@clerk/nextjs`) |
| **AI & Embeddings** | Groq, Google AI |
| **Scraping** | Playwright, `rss-parser` |
| **Analytics** | PostHog |

---

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

**Required variables:**
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — Clerk publishable key
- `CLERK_SECRET_KEY` — Clerk secret key

**Optional variables:**
- `SUPABASE_ACCESS_TOKEN` — For running Supabase CLI migrations
- `GROQ_API_KEY` — For AI enrichment
- `GOOGLE_AI_API_KEY` — For AI enrichment & embeddings
- `NEXT_PUBLIC_POSTHOG_KEY` & `NEXT_PUBLIC_POSTHOG_HOST` — For PostHog analytics

### 3. Run database migrations

Apply the SQL files in `supabase/migrations/` in order (`001_articles.sql` through `004_fix_vector_dimension.sql`) via Supabase SQL Editor or CLI:

```bash
npm run migrate
```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js development server |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run scrape` | Run RSS + Playwright news scraper |
| `npm run scrape:install` | Install Playwright Chromium browser |
| `npm run enrich` | Run AI article enrichment worker |
| `npm run embed` | Generate vector embeddings for articles |
| `npm run embed:status` | Check embedding coverage status |
| `npm run migrate` | Push Supabase database migrations |

---

## Project Structure

```text
axel-news/
├── src/
│   ├── app/           # Next.js App Router pages & API routes
│   ├── components/    # Reusable UI components
│   ├── lib/           # Supabase, Clerk, PostHog, i18n & article helpers
│   ├── scraper/       # RSS & Playwright scrapers
│   └── ai/            # AI enrichment & vector embedding workers
├── supabase/          # PostgreSQL + pgvector migrations
├── public/            # PWA manifest, service worker & icons
└── docs/              # Architecture & roadmap documentation
```

---

## Documentation

- [Project Guide](docs/project-guide.md) — How to use project docs
- [Architecture](docs/architecture.md) — System design
- [Roadmap](docs/roadmap.md) — Build phases
- [UI Conventions](docs/context/ui-conventions.md) — Design patterns

---

## License

MIT
