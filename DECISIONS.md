# Decisions

Append-only decision ledger. Read in full before proposing any approach in this repo.
Reopening a decision requires naming its ID and new evidence — ideally its revisit condition firing.

## D-001 — Keep the Next.js stack (2026-08-08)
**Decision:** Keep Next.js 16 / React 19 / Tailwind 4 / TypeScript / Vitest / pnpm / Vercel. No framework port for the redesign or the chatbot.
**Rejected:** Astro / SvelteKit port — no measured problem to fix: the site is fully static with three runtime dependencies, and the redesign brief's own prior ("recommend a change only if you can point at a measured problem") found none. The chatbot needs exactly one server route, which Next.js on Vercel provides natively (route handler), so the chatbot imposes no constraint the stack cannot meet.
**Revisit if:** A measured constraint appears — a Core Web Vitals failure attributable to the framework, a build-output regression, or a chatbot requirement (e.g., long-lived connections) that Next.js route handlers cannot serve on Vercel.

## D-002 — Normal commits on a work branch; main untouched (2026-08-08)
**Decision:** Redesign + chatbot work happens on a new local branch with a coherent commit per slice. No push, no PR, no touching main. User reviews diffs before anything deploys (main auto-deploys to production).
**Rejected:** The previous amend-and-force-push single-commit workflow (handoff.md §Git History) — superseded by the user's redesign brief, which explicitly instructs branch + frequent commits + no push. Committing straight to main — main auto-deploys; unreviewed production deploys are ruled out by the brief.
**Revisit if:** The user states a different history preference when merging the work branch (the single-visible-commit preference for the PUBLIC history may still stand at merge time — squashing the branch on merge would honor both).

## D-003 — RAG-lite retrieval, no vector store, no LangChain (2026-08-08)
**Decision:** The assistant uses build-time section embeddings + in-route cosine top-k + similarity-gated refusal, with automatic full-context fallback when the embedding API fails. No vector database. No LangChain/LangGraph.
**Rejected:** Full-context as the primary path — loses the measurable pre-model refusal gate and exceeds Groq's 12K TPM free cap (~11k tokens/request vs ~2k). Vector database — zero retrieval-quality gain over exact in-process cosine at ~50–80 vectors; adds latency and a dependency. LangChain/LangGraph — no graph in a retrieve→call→validate pipeline; abstracts the parts worth demonstrating; breaks the three-runtime-dependency leanness.
**Revisit if:** Retrieval tests show top-k misses on real questions, or the embedding dependency causes measured latency/reliability problems (either flips v1 to full-context via the shared buildContext seam), or the corpus outgrows single-request context.

## D-004 — Providers: Groq chat + Cloudflare embeddings; NVIDIA dev-only (2026-08-08)
**Decision:** Production chat = Groq (llama-3.3-70b-versatile). Production embeddings = Cloudflare Workers AI (@cf/baai/bge-small-en-v1.5). NVIDIA (integrate.api.nvidia.com) = development/evaluation adapter only. Gemini = documented alternate. All behind env-configured OpenAI-compatible adapters.
**Rejected:** NVIDIA free tier in production — its API Trial ToS §1.4 (v. 2025-09-19) permits only "internal testing and evaluation purposes, not in production"; credits expire after 30 days. OpenRouter free models — OpenRouter's own FAQ: "usually not suitable for production use." Mistral free tier — Mistral Help Center: "intended for evaluation and prototyping." Cohere trial keys — "not permitted to be used for production or commercial purposes." Gemini as default — free tier trains on prompts with possible human review, and bars unpaid production use for EEA/CH/UK users.
**Revisit if:** Any provider's terms or limits change on re-verification (facts dated 2026-08-08), an NVIDIA paid subscription is purchased (NVIDIA becomes production-eligible), or Groq/Cloudflare free tiers are withdrawn.

## D-005 — Typography and layout direction (2026-08-08)
**Decision:** Type: Martian Mono (headings/labels/nav, variable, OFL) + IBM Plex Sans (body, OFL), self-hosted via next/font. Layout: home becomes a dense ruled index (ledger rows for all work); list pages become full-width ruled rows; detail pages keep the numbered-memo structure; offset shadows retire; theming rebuilt on semantic tokens only. Approved at checkpoint 2026-08-08.
**Rejected:** Berkeley Mono — paid, license terms unverifiable at primary source (403). JetBrains Mono — editor-default connotation. Commit Mono — deliberately neutral, opposite of a point of view. Departure Mono — pixel gimmick at scale. Award-show showreel genre — wrong genre for the recruiter reading. Retype-only option — leaves the weakest element (hero-card layout) in place; user chose the full direction.
**Revisit if:** Owner taste changes at merge review, or a measured readability/performance problem appears in the new type system.

## D-006 — Stack re-examined with measurements; keep confirmed (2026-08-08)
**Decision:** Keep Next.js + TypeScript (closes the owner's reopening of D-001). Measured today: 189 KB gzip First Load JS, 97.5% framework runtime, ~6 KB site code; server-rendered HTML renders first regardless.
**Rejected:** Astro port — would ship ~10–20 KB gzip but costs a full manual rewrite of 28 React UI files (1,481 lines) with no automated path, for no visitor-visible gain on a static site. SvelteKit — ~32–50 KB (unconfirmed) at the same rewrite cost. Dropping TypeScript — type annotations erase at compile (TypeScript handbook); saves zero shipped bytes and loses the typed content models and tests.
**Revisit if:** Maximal shipped-JS lightness becomes a goal in itself (Astro is the documented path — returns/015-stack-lightness.md), or Next.js runtime weight grows materially.

## D-007 — Redesign v2 direction: the living index (2026-08-08)
**Decision:** Keep v1's bones (index IA, ruled ledgers, memo pages, Martian Mono + IBM Plex Sans). Change the temperament: single accent Cobalt #2547F4 (active states, hover sweeps, citation chips, focus rings, widget dot — both themes); spring motion system all under 300 ms, all reduced-motion-gated, CSS-native (linear() easing, View Transitions API, retimed reveal stagger); signature moment = cursor-reactive variable-font headline on home; exactly two fun details site-wide (headline + widget easter egg). Owner-named agent skills (frontend-design, impeccable) load at build start as implementation guidance. Approved by owner 2026-08-08; execution held until the owner's trigger word.
**Rejected:** Full monochrome constraint (D-005's) — superseded by the owner's explicit direction change ("doesn't have to be monochrome, minimalistic but more fun"). Instrument orange #E8490F and plot green #0F9D58 — owner chose cobalt. Many-small-motions approach — evidence says one or two high-craft moments (returns/016-design-v2-sweep.md). Gradients of any kind — the documented AI-slop tell.
**Revisit if:** Owner taste changes at review, or motion measurably hurts performance/accessibility in the build's verification.

## D-008 — Assistant surface: floating widget, backend unchanged (2026-08-08)
**Decision:** Bottom-right floating pill ("Ask me anything about Som", cobalt dot) on every page, spring-expanding to a terminal-flavored 400px panel (full-width bottom sheet on mobile); suggested questions as mini index rows; cited answers with cobalt citation chips; easter egg commands (som --resume, som --help); dialog a11y (focus trap, Esc, aria-live). /ask page retained for deep links; "Ask" leaves the nav; footer links to /ask. Backend (endpoint, grounding, citations, rate limits, providers — D-003/D-004) unchanged.
**Rejected:** Widget-only (deleting /ask) — loses the deep-linkable surface for zero savings. Nav "Ask" retention — redundant once the widget is global. Third-party chat-widget components — the evidence's one native-feeling example works because the site's own language carries it; this widget is bespoke to the design system.
**Revisit if:** Mobile testing shows the sheet harms usability, or widget traffic patterns argue for restoring the nav entry.
