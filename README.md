# My Portfolio

My personal portfolio for software engineering, applied AI, quantitative
research, research software, and data systems work.

Live site: [som-tripathi.vercel.app](https://som-tripathi.vercel.app)

## Overview

I built this site to keep my projects, research experience, resume, and contact
information in one place. The portfolio is statically generated with Next.js
and uses typed local data, so project and experience content can be updated
without a database or content management system.

The interface uses a monochrome visual system with strong typography, grid
details, clear borders, responsive layouts, and light and dark themes.

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

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Vitest
- ESLint
- pnpm
- Vercel

## Project Structure

```text
app/          App Router pages and global styles
components/   Shared layout, content, and UI components
data/         Profile, project, experience, skills, and resume content
lib/          Project and experience lookup helpers
public/       Resume and public assets
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
```

## Deployment

The portfolio is deployed on Vercel. The application uses static content and
does not require a database, backend service, or runtime API routes.

## Future Work

- Add more project screenshots, architecture diagrams, and demo GIFs.
- Add a grounded AI portfolio assistant for answering questions about my projects and experience.
- Add GitHub API integration for live repository metadata.
- Add project search and keyboard navigation.
- Add short technical notes for selected research and quantitative finance projects.
- Add privacy-friendly analytics to understand which projects visitors engage with.
- Add optional dark mode after the default monochrome theme is polished.
