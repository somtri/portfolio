# My Portfolio

My personal portfolio for software engineering, applied AI, quantitative
research, research software, and data systems work.

Live site: [somtripathi.dev](https://somtripathi.dev) (deployed on Vercel)

## Overview

I built this site to keep my projects, research experience, resume, and contact
information in one place. The portfolio is statically generated with Next.js
and uses typed local data, so project and experience content can be updated
without a database or content management system. It also includes a grounded
AI assistant, available as a site-wide floating widget and at `/ask`, that
answers questions about my projects, experience, and resume from the site's
own content.

The interface uses a near-monochrome visual system with one accent color,
strong typography, grid details, clear borders, responsive layouts, and light
and dark themes.

## Projects

The projects section currently includes:

- **RunScope** — A Rust and React application for simulated real-time LPBF
  process monitoring, WebSocket telemetry, anomaly detection, and run history.
- **SmartSignal** — A leakage-aware stock-movement forecasting pipeline with
  chronological validation, sentiment features, and an interactive dashboard.
- **Poke327** — A terminal RPG built with C and C++, featuring procedural world
  generation, pathfinding, battles, inventory systems, and Linux CI.
- **Personal Portfolio Website** — A statically generated Next.js portfolio
  with typed content, responsive project pages, accessibility support, tests,
  and Vercel deployment.
- **Cine ML** — A movie-rating regression system built from TMDB metadata and
  verified IMDb labels, with model comparison and holdout evaluation.
- **MacroMarkets ML** — A release-aware R analysis of unemployment data, recent
  market behavior, and next-month S&P 500 direction.

Each project has a dedicated page covering the problem, implementation,
technical focus, results, technology stack, and source repository.

## Experience

The experience section documents my work in:

- Agricultural computer vision and 3D maize reconstruction with the AI
  Institute for Resilient Agriculture
- Decentralized in-context learning benchmarks with the Translational AI Center
- Supply chain management course development at Iowa State University
- Computer vision and spatter tracking for laser powder bed fusion research

Experience entries include my role, organization, dates, technical focus,
responsibilities, tools, and relevant repository links.

## Site Features

- Responsive project, experience, resume, and contact pages
- Static project and experience detail routes
- Light and dark theme switching
- Active navigation states
- Downloadable resume PDF
- Links to GitHub, LinkedIn, email, and individual repositories
- Typed content models for projects, experience, profile, skills, and resume
- Keyboard navigation, visible focus states, semantic markup, and reduced-motion
  support
- Grounded AI assistant, as a site-wide floating widget and at `/ask`:
  RAG-lite retrieval over the site's typed content — build-time embeddings,
  cosine top-k with a similarity-gated refusal, citation validation, per-IP
  rate limiting; falls back to full-context when retrieval is unavailable
- Hack and Space Grotesk, self-hosted via `next/font`

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Vitest
- ESLint
- pnpm
- Vercel

Runtime dependencies stay at next/react/react-dom only — the assistant uses
plain fetch adapters (OpenAI-compatible chat: Groq by default; embeddings:
Cloudflare Workers AI), no AI SDKs.

## Project Structure

```text
app/          App Router pages and global styles
app/api/      Assistant endpoint (/api/ask)
components/   Shared layout, content, and UI components
data/         Profile, project, experience, skills, and resume content
lib/          Project and experience lookup helpers
lib/assistant/ Assistant retrieval, grounding, and rate limiting
public/       Resume and public assets
scripts/      Build-time corpus embedding
tests/        Project and experience data tests
types/        TypeScript content models
```

## Local Development

Requirements:

- Node.js 20.9 or newer
- pnpm 11

Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

Open [localhost:3000](http://localhost:3000).

## Available Commands

```bash
pnpm dev        # Start the local development server
pnpm lint       # Run ESLint
pnpm typecheck  # Run the TypeScript compiler
pnpm test       # Run the Vitest test suite
pnpm build      # Create an optimized production build
pnpm start      # Run the production build locally
pnpm embed      # embed the content corpus (needs Cloudflare env vars; optional — site falls back to full-context)
```

## Deployment

The portfolio is deployed on Vercel. It's static pages plus one serverless
route, `/api/ask`, for the assistant. No database.

### Assistant setup

- Create a Groq API key at [console.groq.com](https://console.groq.com) and a
  Cloudflare API token with Workers AI access at
  [dash.cloudflare.com](https://dash.cloudflare.com), and note the Cloudflare
  account ID.
- In Vercel: Project → Settings → Environment Variables → add each variable
  from `.env.example` with its real value — `ASSISTANT_BASE_URL`,
  `ASSISTANT_MODEL`, `ASSISTANT_API_KEY`, `EMBEDDINGS_ACCOUNT_ID`,
  `EMBEDDINGS_API_TOKEN`, `EMBEDDINGS_MODEL` — scoped to Production (and
  Preview if I want it there too). These are server-side only; no key is ever
  exposed to the browser.
- I can run `pnpm embed` locally (with the same env vars in `.env.local`) and
  commit nothing — `lib/assistant/vectors.json` is gitignored. Without it the
  assistant runs in full-context mode; with it, retrieval activates. To
  activate retrieval in production, `pnpm embed` needs to run during the
  build — that's a follow-up I still need to wire into the build command, not
  part of this pass.
- An NVIDIA API key works for local development via the commented base URL in
  `.env.example`, but NVIDIA's API Trial ToS does not permit free-tier
  production use.

## Future Work

- Add more project screenshots, architecture diagrams, and demo GIFs.
- Add GitHub API integration for live repository metadata.
- Add project search and keyboard navigation.
- Add short technical notes for selected research and quantitative finance projects.
- Add privacy-friendly analytics to understand which projects visitors engage with.
- Add optional dark mode after the default monochrome theme is polished.
