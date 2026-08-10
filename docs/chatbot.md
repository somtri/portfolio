# Chatbot architecture

Type: explanation (architecture and decision record). Audience: the site owner, and future sessions.
Status: approved at checkpoint, 2026-08-08. Provider facts verified 2026-08-08; free tiers change — re-verify before relying on them later. Decisions: D-003, D-004.
Research evidence: `.claude/orchestration/returns/002-nvidia-tier.md`, `004-provider-alternatives.md`, `005-embedding-feasibility.md`.

## 1. What it is

A grounded Q&A assistant at `/ask`. It answers questions about Som's projects, experience, resume, and skills — from the site's own content and nothing else. It says "I don't know" rather than invent facts. One question, one answer; no conversation memory in v1.

## 2. The retrieval decision

The corpus is `data/*.ts` — 36,848 bytes, roughly 9–10k tokens. It fits in one request, so both designs below are honest options. The tension, stated openly: sending everything is the simplest correct thing; a retrieval pipeline is the more substantial thing to have built, and this is a portfolio. The two designs were evaluated on engineering merit, not on which sounds better.

### Option A — full-context

Send all sections with every request (~11k input tokens). Perfect recall by construction. No extra moving parts.

### Option B — RAG-lite (recommended)

Retrieval-augmented generation sized honestly for a 10k-token corpus:

- **Build time:** compile `data/*.ts` into ~50–80 sections along their natural boundaries (each project field, each experience entry — semantic chunking is free here), embed each section once, ship vectors as a static JSON asset.
- **Query time:** embed the question (one API call), score all sections by exact cosine similarity in the route handler (under 100 vectors — microseconds of plain TypeScript), send the top-k sections (~1.5k tokens) to the chat model.
- **No vector database.** At this scale a hosted vector store adds latency, a dependency, and zero retrieval quality. That omission is documented deliberately: knowing when the industry-standard component is unnecessary is the senior signal.
- **Similarity-gated refusal:** if no section clears the similarity threshold, the endpoint refuses — before any chat-model call. "I don't know" becomes a measurable retrieval decision instead of prompt obedience, and off-topic or abusive questions cost zero chat-model tokens.
- **Full-context fallback:** if the embedding API fails or its quota is exhausted, the route falls back to Option A automatically — the corpus is small enough to make failure graceful. Most RAG systems cannot have this property; this one gets it from the same corpus size that makes RAG optional.

**Why B wins:** the gated refusal is a genuine grounding improvement; input tokens drop ~7x, which is what makes free-tier per-minute caps comfortable (it is the difference between Groq being viable and not — §6); and the pipeline (chunking, embeddings, retrieval scoring, threshold evals) is a demonstrable artifact. The cost is one embedding call of latency per query and a build step. If no embedding provider verifies as production-legal (§6), the same architecture runs on lexical scoring (BM25-style, pure TypeScript, zero extra APIs) — still retrieval-augmented, still gated refusal, honestly documented.

**What full-context would have bought:** perfect recall and one less API dependency. With top-k over 50–80 hand-authored sections and the fallback path, the recall risk is small and measured by the retrieval tests.

Revisit trigger (ledger entry at approval): retrieval-quality tests show top-k misses on real questions, or the embedding dependency causes measured latency/reliability problems — either flips v1 to full-context with one config change, since the seam (`buildContext(question)`) is shared.

### Rejected: LangChain / LangGraph

- LangGraph orchestrates stateful multi-step agent graphs; this endpoint is retrieve → one model call → validate. There is no graph. Wrapping a single completion call in LangGraph reads as resume-driven development to any reviewer who opens the repo.
- LangChain would abstract exactly the parts worth demonstrating (prompt contract, retrieval scoring, citation validation), add a heavy dependency tree to a codebase whose three runtime dependencies are a stated feature, and buy nothing at this pipeline's size.
- The vocabulary AI-role postings scan for (RAG, embeddings, cosine similarity, top-k, similarity threshold, grounding, hallucination mitigation, retrieval evals) is earned honestly by the system itself and used in this doc and the README. A project that legitimately needs LangGraph — a real multi-step agent — belongs in future work, not bolted on here.

## 3. Architecture

```
Browser (/ask page)
  → POST /api/ask  { question }             ← size-capped, rate-limited, same-origin
      → validate + rate-limit (server)
      → embed(question)                      ← embedding provider, key server-side
      → retrieve top-k by cosine similarity  ← build-time vectors, static JSON
      |    below threshold → refuse (no chat call)
      |    embedding API down → fall back to full corpus
      → provider.chat(system + sections + question)   ← OpenAI-compatible adapter
      → validate citations, enforce refusal contract
  ← { answer, citations[] }
```

- **Route:** one Next.js route handler, `app/api/ask/route.ts`, Node runtime on Vercel. The static site stays static; this is the only server code.
- **Corpus:** compiled at build from the same `data/*.ts` files the pages render. No duplication; content edits flow into the assistant on the next build.
- **Chat provider interface:** every candidate (NVIDIA, Gemini, Groq, Cerebras, OpenRouter) exposes an OpenAI-compatible `POST /v1/chat/completions`. The "thin interface" is one adapter over `fetch` — no SDK dependency — configured by environment: `ASSISTANT_BASE_URL`, `ASSISTANT_MODEL`, `ASSISTANT_API_KEY`. Swapping chat providers is a three-variable change in Vercel.
- **Embedding provider:** separate, smaller adapter (`EMBEDDINGS_BASE_URL`, `EMBEDDINGS_MODEL`, `EMBEDDINGS_API_KEY`). The corpus and the query must use the same embedding model; changing it means re-running the build-time embed step (a script, not a redeploy of new code).
- **No key in the browser:** keys live in Vercel environment variables, read only in the route handler. `.env.example` carries variable names only.

## 4. The grounding contract

- System prompt: answer ONLY from the provided sections; cite section IDs (`projects/runscope`, `experience/aiira`, …) for every claim; if the sections do not answer the question, reply with the refusal message; never speculate about Som.
- Low temperature; `max_tokens` capped (~512).
- Server-side enforcement, not just prompt hope: cited IDs are validated against the known section set — unknown citations are stripped and the answer is rejected to the refusal path; an answer with no citations that is not a refusal is rejected the same way. The similarity gate (§2) refuses off-corpus questions before the model is called at all.
- Tests (Vitest, providers mocked — no live API in CI): corpus builder emits every section with a stable unique ID; cosine scoring ranks an exact-match section first; below-threshold questions refuse without a chat call; citation validator accepts known and rejects unknown IDs; fallback path activates on embedding failure; request-size and rate-limit rejections return the right status codes.

## 5. Public-endpoint protection

Assume someone tries to drain the key.

- **Request caps:** question length ≤ 500 characters; body size capped; one question per request (no client-supplied history — smaller prompt-injection surface, bounded token spend).
- **Similarity gate as abuse filter:** junk and off-topic traffic never reaches the chat model (§2).
- **Per-IP rate limit:** sliding window in the route (e.g., 5/minute, 25/day per IP), in-memory per serverless instance. Honest limit: per-instance state is not a global guarantee on serverless.
- **Global backstop:** the provider's own free-tier per-key limits cap total spend at zero — a free-tier key cannot spend money; worst case is quota exhaustion and a clear "try later" message. If billing is ever attached, add durable rate limiting (e.g., Upstash) at that point — not before.
- **Same-origin check** on the route; no CORS opening.

## 6. Provider facts (verified 2026-08-08)

### NVIDIA build.nvidia.com — dev/eval adapter only, not the production default

- OpenAI-compatible at `https://integrate.api.nvidia.com/v1`; `nvapi-` key. Models with 128K–1M context (Llama 3.3 70B, Llama 3.1 8B, Nemotron 3 Super 120B) — verified on docs.api.nvidia.com.
- **API Trial Terms of Service (v. 2025-09-19), §1.4, verbatim:** "Unless you purchase a Subscription from NVIDIA or a Service Provider (as applicable), you may only use the API Service for internal testing and evaluation purposes, not in production." A public portfolio endpoint is production use.
- Free credits: 1,000 on signup, **expire after 30 days** (NVIDIA staff, developer forums). No official rate-limit number published.
- Consequence: the NVIDIA adapter works for local development and evaluation (ToS-compliant), and becomes production-eligible only with a paid subscription. The site must not claim the live assistant runs on NVIDIA's free tier.

### Chat-provider comparison (free tiers, verified against each provider's own pages)

| | Production terms | Limits (verified) | Data training | Fit |
|---|---|---|---|---|
| **Groq** (recommended default) | Governing Services Agreement is silent — no ban found | Llama 3.3 70B: 30 RPM / 1,000 RPD / **12K TPM**; 131K context | **Contractually barred** from training on inputs/outputs (§4.2) | Fits ONLY the RAG-lite request shape (~2k tokens); full-context (~11k) consumes the entire per-minute token budget |
| **Gemini** (alternate) | No explicit ban, but: free tier is "not for consumer use" (ambiguous) and **may not serve EEA/CH/UK users in production** — a global portfolio audience trips this | Numbers login-gated (secondary, unconfirmed: ~10 RPM / 500 RPD Flash-class); 1M context verified | Free-tier prompts train Google products; human review possible | Fits both request shapes; the terms caveats are the cost |
| **Cerebras** | Primary ToS silent; secondary "dev-only" claims unconfirmed | 5 RPM / 30K TPM verified; context window **unconfirmed** (one 8K-cap claim would kill it) | Not checked | Usable fallback candidate pending context-window confirmation |
| **OpenRouter** | Own FAQ: free models "usually not suitable for production use" | 20 RPM / 50 RPD verified | Deferred to upstream per-model terms | Out |

**Recommendation: Groq default (llama-3.3-70b-versatile), Gemini as the documented alternate, NVIDIA as the dev/eval adapter.** Groq has the cleanest data terms, no production restriction in its governing agreement, verified public limits, and 131K context — and the RAG-lite design is what makes it fit. The EEA/UK clause and training-data terms make Gemini the weaker default for a public global site despite its bigger context window.

### Embedding provider: Cloudflare Workers AI (verified 2026-08-08)

- **Model:** `@cf/baai/bge-small-en-v1.5` (384 dimensions). REST endpoint `api.cloudflare.com/client/v4/accounts/{id}/ai/run/{model}` with a bearer token — plain `fetch` from the Vercel route.
- **Free allowance:** 10,000 neurons/day (Cloudflare's own pricing page), which at bge-small's 1,841 neurons per million tokens is ~5.4M embedding tokens/day — three orders of magnitude above this site's need. Rate limit 3,000 requests/minute.
- **Data terms, verbatim:** "Cloudflare does not use your Customer Content to (1) train any AI models made available on Workers AI or (2) improve any Cloudflare or third-party services." Combined with Groq's no-training clause, visitor questions never reach a training-permitted provider on the default path.
- **Honest caveat:** no Cloudflare page says "free tier permitted in production" in so many words. The verdict rests on: Workers AI is Generally Available (not beta or trial), the allowance has no evaluation-only label, and no restriction language was found. That inference is the strongest available signal and is stated here as an inference, not a quote.
- **Input cap:** bge model per-call input limits are not stated on the catalog page. Corpus sections are small (~100–400 tokens) and the question is capped at 500 characters; the build-time embed step asserts every section embeds successfully, which verifies the cap empirically.
- Killed alternatives: Mistral free tier ("intended for evaluation and prototyping" — Mistral's own Help Center) and Cohere trial keys ("not permitted to be used for production or commercial purposes" — cohere.com/pricing). Gemini embeddings and Jina remain unclear on terms; documented as unresolved, not used.

## 7. How to swap providers

1. Create an API key with the new provider.
2. In Vercel: set `ASSISTANT_BASE_URL`, `ASSISTANT_MODEL`, `ASSISTANT_API_KEY` (chat) or the `EMBEDDINGS_*` trio (embeddings) to the new values.
3. Chat swap: redeploy — no code change. Embedding swap: re-run the build-time embed step, then deploy.

## 8. Rejected alternatives

- **Vector database:** unnecessary at 50–80 vectors — exact cosine in-process beats a network hop on every axis at this scale. See §2.
- **LangChain / LangGraph:** wrong tool for a single-call pipeline; hides the demonstrable parts; breaks the three-dependency leanness. See §2.
- **NVIDIA free tier as production default:** killed by NVIDIA's own trial ToS §1.4 and 30-day credit expiry. See §6.
- **OpenRouter free models:** killed by OpenRouter's own FAQ. See §6.
- **Client-side provider calls:** the key would reach the browser.
- **Floating chat widget:** template tell; `/ask` page instead (redesign doc).
- **Multi-turn conversation memory (v1):** token spend and injection surface grow with history; single-turn covers the goal. Revisit if real usage shows follow-up questions failing.

## Changed during build (2026-08-08)

- Final env-var names, as implemented in `.env.example`: `ASSISTANT_BASE_URL`, `ASSISTANT_MODEL`, `ASSISTANT_API_KEY` (chat); `EMBEDDINGS_ACCOUNT_ID`, `EMBEDDINGS_API_TOKEN`, `EMBEDDINGS_MODEL` (embeddings, Cloudflare-shaped — account ID + token, not the generic `EMBEDDINGS_BASE_URL`/`EMBEDDINGS_API_KEY` pair this doc's §3 describes). Optional: `ASSISTANT_MIN_SIMILARITY`.
- The route is split as designed: `lib/assistant/handler.ts` holds the testable core (`handleAsk`, deps injected), and `app/api/ask/route.ts` is a thin adapter that parses the request, checks same-origin, extracts the IP, and wires the real corpus/vectors/embed/chat/rate-limit implementations into it.
- `lib/assistant/vectors.json` is the build-time vectors file; it's gitignored (`/lib/assistant/vectors.json`). Its absence is not an error — `handleAsk` falls back to full-context. Running `pnpm embed` generates it locally to activate retrieval; the file itself is never committed.
- Gitignore fix: `.env*` was blanket-ignoring `.env.example` too. Added `!.env.example` after it so the template stays tracked.
- Everything else in this doc's architecture (§3), grounding contract (§4), and abuse protections (§5) matches the implementation as read.
