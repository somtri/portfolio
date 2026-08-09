# Redesign direction

Type: explanation (design rationale). Audience: the site owner, and future sessions.
Status: approved at checkpoint, 2026-08-08. Decisions recorded as D-003 to D-005 in DECISIONS.md.
Research evidence: `.claude/orchestration/returns/001-portfolio-sota.md` (full evidence log, search trail).

## 1. What the research found

Research date: 2026-08-08. Sources: 10 portfolio sites fetched directly, plus primary font-license pages. Two findings carry the design:

**Finding 1 — there are two portfolio genres, and this site is in the right one.**
The award-show genre (Awwwards portfolio category) rewards 3D, motion, and WebGL showreels. Bruno Simon's drivable-world site is its canonical case. The design-engineer and research-index genre rewards the opposite: typographic restraint, index-like density, stated design philosophy. Sites fetched and confirmed in this genre: rauno.me (Vercel staff design engineer), emilkowal.ski (an animation specialist whose own site is black-and-white and airy — restraint as a choice, not a limitation), jakub.kr, floguo.com, marcel.io, gwern.net, andymatuschak.org. Seven of eight fetched sites in this cluster are monochrome or near-monochrome. The site's locked direction — "technical research index + builder board" — matches this genre. The redesign stays in it.

**Finding 2 — what is load-bearing versus what is fashion.**
Load-bearing across the praised sites: typography chosen and named on purpose; information architecture that rewards a 30-second scan and a 30-minute read (gwern.net calls this "semantic zoom"); restraint stated as a philosophy. Fashion, not load-bearing: command-menu chrome, ASCII-art flourishes, strict #000/#fff grayscale (the real pattern is near-monochrome — which this site's warm paper palette already is).

**The AI-slop tells to avoid** (practitioner source, single-sourced, medium confidence): Inter as an unconsidered default, indigo-purple gradients, three-rounded-card hero sections, weightless headlines, interchangeable line icons. The current site avoids all of these except one adjacent case: its type system is Arial + Courier New — system defaults, the one place the site currently reads "unconsidered."

## 2. What the current site does well

The audit before judgment (full repo read, 2026-08-08): coherent warm-monochrome palette in CSS variables; numbered-section memo structure on detail pages (01 / Overview); honest content with stated caveats; working light/dark themes; skip link, focus states, semantic markup, keyboard navigation, reduced-motion support. These survive.

Weak points: Courier New + Arial (no loaded typeface — typography is the genre's main carrier and this site delegates it to OS defaults); every page is the same boxed-card-plus-hard-shadow rhythm (the hero-then-cards shape the brief names as the template tell); dark mode works by remapping Tailwind utility classes with `!important` (fragile — it already caused one documented bug); the home page is a hero, not an index.

## 3. The direction: a ruled index, set in real type

One sentence: keep the field-notebook identity, replace default fonts with a committed two-family type system, and move the layout language from boxed cards to a ruled ledger — dense index rows on list pages, memo structure on detail pages.

### Typography (the spine of the redesign)

- **Martian Mono** — headings, labels, numbers, nav, all monospace voice. Evil Martians, SIL OFL 1.1, variable font, weights 100–800 plus a width axis (75% condensed to 112.5% semi-wide). Verified at the foundry repo and Google Fonts, 2026-08-08. At heavy weight and condensed width it is a gruff, technical display voice that matches "quant dashboard"; at small sizes it does field-notebook labels. It is distinctive without being a gimmick — and it is not Courier New, not JetBrains Mono (the editor default), not Inter.
- **IBM Plex Sans** — body text. IBM, SIL OFL 1.1, verified 2026-08-08. Industrial-neutral, built for technical reading, pairs with monos by design (gwern.net uses the Plex mono sibling). Detail pages carry long text; the body face must read effortlessly at length.
- Delivery: `next/font` — self-hosted at build, zero runtime requests to Google, no layout shift beyond font-swap.
- Two families, no more. Rejected: Berkeley Mono (paid, license terms unverifiable — primary site returned 403); Commit Mono (deliberately "neutral" — the opposite of a point of view); Departure Mono (pixel aesthetic, gimmick risk at scale); JetBrains Mono (reads as editor default).

### Layout

- **Home becomes the index — the builder board.** Identity block (name in heavy condensed Martian Mono, positioning line), then a dense unified index of all work: numbered full-width rows — experience entries and projects as ledger lines with number, title, organization or category, year, and stack tags. Every row links to its detail page. The whole site is scannable in 30 seconds from the home page; each row opens the 30-minute read. This replaces the hero-card home page.
- **List pages become ruled ledgers.** /projects and /experience drop the 3-column card grid for full-width index rows separated by hairline rules — table-like density on desktop, stacked rows on mobile. Hover inverts the row to ink (black row, paper text) — the existing inversion language, sharpened.
- **Detail pages keep the numbered-memo structure** (01 / Overview, 02 / Problem …) — it is already the genre's shape. They get the new type, a calmer meta rail, and hairline rules instead of boxed cards.
- **Hard offset shadows retire.** Hairline rules and ink inversion carry the aesthetic. The ubiquitous 8px-offset shadow is the most template-flavored element of the current design; black panels become rare so they land harder.
- Kept motifs: the paper background grid (subtler), numbered rows (01, 02 …), `+ tag` stack lists, `[bracketed]` labels, the compact black footer.

### Motion

One orchestrated page-load sequence: index rows and sections reveal with a short stagger (opacity + small translate, under half a second total), reusing the existing IntersectionObserver infrastructure. Hover states are instant. The scan-line shimmer effect is removed. `prefers-reduced-motion` shows everything immediately (existing behavior, preserved).

### Theming

Rebuild both themes on semantic CSS variables only (`--paper`, `--surface`, `--ink`, `--muted`, `--line`). Components reference tokens; no component references a literal color that needs remapping. Delete every `html[data-theme="dark"] … !important` utility override. This removes the bug class the handoff documents (footer links disappearing in dark mode).

### Chatbot surface (design only — architecture in docs/chatbot.md)

A dedicated `/ask` page, listed in the nav. Terminal-ledger aesthetic: a monospace prompt line, answers as memo blocks that cite their sources as index references (for example `[projects/runscope]`), suggested questions as index rows. No floating chat bubble — the floating widget is a template tell, and a page fits the index identity.

## 4. How far, and why

Full retheme (fonts, tokens, layout system, every page) plus the home-page shift from hero to index. No route changes except adding `/ask`. No content changes — `data/*.ts` is frozen. Rationale for this distance: the research says typography and information architecture are the load-bearing signals, and those are exactly the two places the current site is weakest; everything else (palette, motifs, memo structure, a11y) is already right and survives. Stopping short of the type-and-layout rebuild would leave the two weakest elements in place; going further (new routes, content rewrites, decorative systems) adds nothing the evidence supports.

## 5. What survives, verified

Light and dark themes, keyboard navigation, visible focus states, skip link, semantic markup, `prefers-reduced-motion` support — all verified present in the current code (2026-08-08 read) and all carried through the rebuild. The verify phase re-checks each at mobile, tablet, and desktop widths, in both themes, with reduced motion on.

## 6. Rejected directions

- **Award-show showreel (3D, WebGL, heavy motion)** — wrong genre for "this person can build" recruiter reading; contradicts the locked monochrome-typographic direction.
- **Strict #000/#fff grayscale purge** — evidence favors near-monochrome; the warm paper palette is distinctive and stays.
- **Command-menu / ASCII ornament layer** — fashion, not load-bearing; adds chrome without signal.
- **Buying Berkeley Mono** — license terms unverifiable at the primary source today; two verified-free OFL families meet the bar.
- **Floating chat widget** — template tell; `/ask` page instead.
