# Redesign v2 — the living index

Type: explanation (design plan). Status: APPROVED 2026-08-08 (owner; accent = Cobalt #2547F4). EXECUTION HELD — build starts only on the owner's trigger word ("execute v2"). Decisions: D-006, D-007, D-008.
Supersedes the monochrome constraint of docs/redesign.md §3 (D-005) per the owner's direction change: "minimalistic but more fun, add some motion." Chatbot surface changes to a floating widget per the owner.
Research evidence: `.claude/orchestration/returns/015-stack-lightness.md` (measured) and `016-design-v2-sweep.md` (live-fetched exemplars).

## 1. Stack verdict first (closes the reopened D-001)

**Keep Next.js + TypeScript.** Measured today on this repo: First Load JS is 189 KB gzip, 97.5% of it React/Next runtime, ~6 KB actual site code. An Astro port would ship ~10–20 KB (vendor-claim-backed) — but costs a full manual rewrite of 28 React component files (1,481 lines) mid-redesign, while the visitor sees server-rendered HTML first either way. SvelteKit lands in between (~32–50 KB, unconfirmed) with the same rewrite cost. 8 of 10 praised design-engineer portfolios sampled run Next.js. TypeScript ships zero bytes (type erasure — TS's own handbook); dropping it saves nothing and loses the typed content models and tests. Astro is the documented future path if maximal lightness ever becomes a goal in itself.

## 2. The direction: keep the bones, change the temperament

v1 built the right skeleton — the index home, ruled ledgers, memo detail pages, real typography. What the owner wants changed is the *temperament*: from austere to alive. The evidence says exactly how world-class sites do "alive" without clutter (every claim below is grounded in sites fetched 2026-08-08):

- Restraint IS the fun: near-empty base + one or two high-craft moments (rauno.me, emilkowal.ski).
- UI animation stays under ~300 ms and never becomes repetitive-annoying (Emil Kowalski's own published rule).
- The memorable detail is ONE bespoke, personally-signed thing, not a library flex (Josh Comeau's hidden header trick; Maxime Heckel's joke captcha).
- Playful heavy experiments get quarantined off the resume-facing pages (Anthony Fu's `100.antfu.me`).
- Reduced motion is non-negotiable (W3C technique C39; vestibular triggers).
- A floating assistant feels native only when the whole site shares its visual language (the one good live example found is terminal-styled end to end).

### 2.1 Color — near-monochrome plus one accent with a point of view

The warm paper base and ink stay. ONE saturated accent enters, used only where it means something: active nav state, row-hover underline sweep, citation chips, focus rings, selection, the widget's live dot, section-number marks on detail pages. Both themes share the accent. Candidates (owner picks at checkpoint):

**Decided: Cobalt #2547F4** (owner, 2026-08-08) — blueprint register. Rejected at approval: instrument orange #E8490F, plot green #0F9D58. Final shades get contrast-tuned against both themes during the build (WCAG AA for text/focus uses).

Fashion-risk note (from round-1 research): purple-to-blue gradients are the AI-slop tell — none of these approach it, and there are no gradients anywhere in this plan.

### 2.2 Typography — unchanged, but it becomes an instrument

Martian Mono + IBM Plex Sans stay (approved this morning; churn without evidence is churn). New: we exploit Martian Mono's variable axes (weight 100–800, width 75–112.5%) for the signature moment below — the typeface stops being a static choice and becomes the site's one toy.

### 2.3 The signature moment — cursor-reactive headline (the bespoke thing)

On the home page, the big "SOM TRIPATHI" glyphs respond to pointer proximity: letters near the cursor thicken and widen (font-variation-settings interpolation), springing back as the cursor leaves (CSS `linear()` spring easing). Typography-as-physics on a quant's index — personally signed, zero dependencies, no canvas, no WebGL. Touch devices get a single subtle weight-wave on load instead. `prefers-reduced-motion`: fully static. This is the site's Josh-Comeau-trick: most visitors just see a great headline; the curious find it plays.

### 2.4 Motion system (all under 300 ms, all reduced-motion-gated, CSS-native)

1. **Page-load choreography:** the existing staggered index reveal, retimed with `linear()` spring curves (a slight overshoot settle instead of a plain fade-slide).
2. **Page navigations:** View Transitions API (90.2% global support, caniuse today) as progressive enhancement — index row morphs toward the detail-page title; unsupported browsers navigate normally.
3. **Row hover:** the v1 ink inversion stays instant; an accent underline sweeps in (~200 ms) and the row lifts 2 px with a spring settle.
4. **Theme toggle:** icon morph plus a one-time radial sweep on switch (view-transition-based where supported).
5. **Widget open/close:** spring scale-up from the pill (~250 ms).

No scroll-jacking, no parallax, no cursor trails, no marquee. Two fun details total (signature headline + the widget easter egg below) — the evidence says one or two, not twelve.

### 2.5 Layout

IA unchanged (index home, ledger lists, memo details). Spacing and hierarchy get a tuning pass under the new accent (accent section-number marks, slightly warmer surface contrast). This is a re-skin and a behavior pass, not a re-layout.

## 3. The assistant becomes a floating companion

- **Placement:** bottom-right on every page. Collapsed: a pill — accent dot + "Ask me anything about Som" in Martian Mono — shrinking to a dot-only disc after first scroll (and always on small screens).
- **Expanded:** spring-scale into a 400-px panel (full-width bottom sheet on mobile): terminal-flavored header (`som@portfolio:~$`), the four suggested questions as mini index rows, input capped at 500 chars, answers with accent citation chips that deep-link to the cited page. Q&A stays single-turn.
- **Easter egg (fun detail #2):** typing `som --resume` in the widget opens the resume PDF; `som --help` lists the joke flags. Cheap, discoverable, personally signed.
- **A11y:** proper dialog semantics, focus trap, Esc to close, `aria-live` answers, reduced-motion = instant open. Widget never covers the footer's last line on mobile (sheet pushes, not overlays, at the bottom).
- **Backend: unchanged.** Same `/api/ask` endpoint, grounding contract, citation validation, rate limits, provider adapters (D-003/D-004 untouched). The `/ask` page stays as the deep-linkable full surface; "Ask" leaves the nav (the widget is everywhere); the footer links to /ask.

## 4. Implementation shape

Zero new runtime dependencies: `linear()` easing, View Transitions, `font-variation-settings`, scroll-driven reveal are all native; the widget is React state on the existing endpoint. Slices, each ending green on all four checks: (V2-A) accent tokens + motion primitives + retimed reveal; (V2-B) signature headline + theme-toggle moment + view transitions; (V2-C) floating widget + easter egg + nav/footer adjustments; (V2-D) detail-page accent pass + fresh-eyes verification + browser audit both themes. Everything a11y-verified in v1 stays verified.

## 5. Open items for the owner (asked at the checkpoint)

1. Approve this direction, or adjust.
2. Pick the accent (2.1) — or delegate the call.
3. RESOLVED at approval: the sources are agent skills — the frontend-design skill and the impeccable design-vocabulary plugin. The build's first act is loading both as implementation guidance; if either is not installed, the builder reports it to the owner instead of substituting.
4. After approval: owner creates the Groq + Cloudflare keys (unchanged from v1 plan) — the widget needs them to answer in production.

## 6. Ledger entries on approval

D-006: stack keep re-affirmed with measurements (closes reopened D-001). D-007: v2 direction (supersedes D-005's monochrome constraint; type and IA carried forward). D-008: assistant surface = floating widget, /ask retained, backend unchanged.

## Changed during build (2026-08-08)

1. Page-navigation view transitions deferred: Next 16.2.7 exposes `experimental.viewTransition`, but it requires React's `<ViewTransition>` component, which stable React 19.2.4 does not ship (Canary-only). The theme-toggle radial sweep DID ship via `document.startViewTransition`. Revisit when React ships ViewTransition stable.
2. Signature headline is widen-only (wdth 80→100): the resting weight already sits at Martian Mono's wght ceiling (800), so "thicken" had no headroom; wdth capped at 100 (conservative overflow margin).
3. Tuned accent values: dark-theme `--accent` #5e77f7 (4.8–5.1:1 on dark surfaces), light-theme `--accent-panel` #2e4ef4 (3.16:1 on the ink panel); light `--accent` #2547F4 as approved.
4. Surface tokens unchanged (the §2.5 "warmer surface contrast" idea was deliberately dropped — restraint).
