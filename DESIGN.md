# DESIGN.md — v3 "linux session"

Authoritative visual contract: `.claude\orchestration\design\v3-comps\b3-hack-adj.html` (dark) and `b3-hack-adj-light.html` (light). When this file and the comps disagree, the comps win. Decision ledger: D-010, D-011, D-012.

## Identity
A Konsole session on Kubuntu. Dark-native pure black. Everything lowercase. Left-anchored. Sections are shell commands: `$ whoami`, `$ ls ./projects`, `$ cat ./experience`, `$ fortune`, `$ som --ask`, `$ contact --open`.

## Type
- **Hack** (self-hosted woff2, weights 400/700) for all text. It is Konsole's default face (KDE review D1816).
- **Space Grotesk 700** (self-hosted woff2) ONLY at the two display moments: the wordmark and the connect button.
- `text-transform: lowercase` globally. No uppercase anywhere.
- Never fetch fonts at build time (next/font/google is banned here): the offline-green build guarantee depends on local files.

## Tokens (semantic only, in app\globals.css)
Dark (default): `--paper #000000; --surface #1F1F1F; --ink #FFFFFF; --muted rgba(255,255,255,.7); --faint rgba(255,255,255,.42); --line rgba(255,255,255,.12); --line-strong rgba(255,255,255,.25); --accent #2F6BFF; --live #2EE58A`
Light: `--paper #FFFFFF; --surface #F3F3F3; --ink #000000; --muted rgba(0,0,0,.68); --faint rgba(0,0,0,.45); --line rgba(0,0,0,.12); --line-strong rgba(0,0,0,.3); --accent #0B76CC; --live #0A7A46`
Contrast: accents computed 4.67:1 on black, 4.69:1 on white. Never use #001FEB on black or #1D99F3 on white for text (2.40:1 / 3.04:1 — D-012 rejected them).

## Signature elements
- Wordmark `som tripathi` with a block cursor structurally anchored to the last name (nowrap unit — the cursor never separates from "tripathi" at any width).
- Coordinate annotations: `[ 42.026°N 93.646°W ]`, `[ NOW: ... ]` in accent, `[ EST. 2005 · IDX 001 ]` (renders lowercase).
- Session bar: `som@portfolio: ~` + coordinates + light/dark mode pills.
- Nav: `[0] index` … `[?] ask` — bracket numbers in accent.
- Green `live` tags on current roles.
- `$ fortune` line: "currently training models and arguing with opus 5", weekly auto-rotating tail (rollout slice: ISR + HN fetch + Groq quip + curated fallback).
- Morphing ask widget: circle ⇄ cycling labels (rollout slice).

## Layout
Left-anchored: `.wrap` max-width 1200px, margin-inline 0, padding-inline 56px (24px on mobile). Ruled rows (1px `--line`) for projects and experience. Spacious: 96–130px vertical section padding. No cards, no shadows, no gradients, no glass, no border-radius except the widget circle/pill.

## Motion
Sparse and terminal-true: cursor blink (steps, ~1.1s), widget morph (rollout), reveals only where they enhance an already-visible default. `--ease-spring` is retained (single 1.5% overshoot, approved; the detector's "bounce" flag on it is a recorded false positive). Every animation has a `prefers-reduced-motion` fallback (instant or crossfade).

## A11y bar
WCAG AA: 4.5:1 for text (token values above), 3:1 for large display text. Visible accent focus outline. Skip link stays. Native `<dialog>` for the widget. `aria-live` for assistant output.

## Voice
Lowercase, shell-flavored, plain: "grounded on this site's content", "try: som --resume · som --help". No marketing language. Honest-results wording is test-guarded: never soften the SmartSignal simulation caveat, Cine ML post-release framing, or MacroMarkets negative result.
