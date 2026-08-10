# PRODUCT.md — somtripathi.dev

## What this is
Som Tripathi's portfolio: a static Next.js site with one serverless route (`/api/ask`, a grounded AI assistant). The site presents Som — software engineering student at Iowa State University, ML/CV research intern, quant-finance projects — as a hireable engineer.

## Audience
Recruiters and engineers screening for AI/ML internships. They skim first; the site must land its identity in seconds and then survive a deep read.

## Register
Brand — design IS the product here. The identity: a linux terminal session (Konsole on Kubuntu), not a trading terminal. The visitor reads `som@portfolio: ~`.

## Jobs
1. Show the work (projects, experience, resume) with honest-results wording (test-guarded).
2. Answer questions about Som via the grounded assistant: cited answers, refuses off-corpus questions.
3. Signal engineering taste through the design itself.

## Constraints
- Content in `data\*.ts` is frozen build input; pages and the assistant corpus both import it.
- Runtime dependencies: next / react / react-dom only.
- `pnpm lint`, `typecheck`, `test`, `build` all pass offline with no env vars.
- API keys stay server-side; `.env.example` holds names only.

## Non-goals
Blog, CMS, analytics dashboards, multi-turn chat memory.
