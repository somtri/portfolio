import { buildContext } from "./context";
import { buildSystemPrompt } from "./prompt";
import { validateAnswer } from "./citations";
import {
  leaksSystemPrompt,
  looksLikeInjection,
  sanitizeQuestion,
  wrapQuestion,
} from "./guardrails";
import { MAX_QUESTION_CHARS, REFUSAL_MESSAGE } from "./constants";
import { ChatUnavailableError } from "./types";
import type { Section } from "./types";

export type AskCitation = { cite: string; href: string };

export type AskResponseBody =
  | {
      answer: string;
      citations: AskCitation[];
      mode: "retrieved" | "full" | "refused" | "rejected";
    }
  | { error: string; retryAfterSec?: number };

export type HandlerDeps = {
  corpus: Section[];
  known: Set<string>;
  vectors: { id: string; vector: number[] }[] | null;
  embed: (texts: string[]) => Promise<number[][]>;
  chat: (opts: { system: string; user: string }) => Promise<string>;
  rateLimit: (ip: string) => { allowed: boolean; retryAfterSec?: number };
};

type HandlerResult = { status: number; body: AskResponseBody };

// Every guardrail returns the same body. A visitor probing the endpoint
// learns which questions are answered, never which rule stopped one.
function refused(): HandlerResult {
  return {
    status: 200,
    body: { answer: REFUSAL_MESSAGE, citations: [], mode: "refused" },
  };
}

export async function handleAsk(
  question: unknown,
  ip: string,
  deps: HandlerDeps,
): Promise<{ status: number; body: AskResponseBody }> {
  try {
    if (
      typeof question !== "string" ||
      question.trim().length === 0 ||
      question.length > MAX_QUESTION_CHARS
    ) {
      return {
        status: 400,
        body: { error: "Ask one question, up to 500 characters." },
      };
    }

    const rate = deps.rateLimit(ip);
    if (!rate.allowed) {
      return {
        status: 429,
        body: {
          error: "Rate limit reached. Try again shortly.",
          retryAfterSec: rate.retryAfterSec,
        },
      };
    }

    const clean = sanitizeQuestion(question);
    if (clean.length === 0) {
      return {
        status: 400,
        body: { error: "Ask one question, up to 500 characters." },
      };
    }

    // Screened after the rate limit, so repeated attempts still burn quota,
    // and before the provider call, so they never cost a request.
    if (looksLikeInjection(clean)) {
      return refused();
    }

    const context = await buildContext(clean, {
      corpus: deps.corpus,
      vectors: deps.vectors,
      embed: deps.embed,
    });

    if (context.mode === "refuse") {
      return refused();
    }

    const system = buildSystemPrompt(context.sections);

    let answer: string;
    try {
      answer = await deps.chat({ system, user: wrapQuestion(clean) });
    } catch (error) {
      if (error instanceof ChatUnavailableError) {
        return {
          status: 503,
          body: {
            error: "The assistant is temporarily unavailable. Try again later.",
          },
        };
      }
      throw error;
    }

    // A prompt rule is a request to the model, not a control, so the two
    // rules worth naming in the prompt are also checked on the way out:
    // rule 5 here, rule 1 by the citation validator below.
    if (leaksSystemPrompt(answer)) {
      return {
        status: 200,
        body: { answer: REFUSAL_MESSAGE, citations: [], mode: "rejected" },
      };
    }

    const validation = validateAnswer(answer, deps.known);
    if (!validation.ok) {
      return {
        status: 200,
        body: { answer: REFUSAL_MESSAGE, citations: [], mode: "rejected" },
      };
    }

    const hrefByCite = new Map(
      deps.corpus.map((section) => [section.cite, section.href]),
    );

    const citations = validation.citations
      .map((cite) => {
        const href = hrefByCite.get(cite);
        return href ? { cite, href } : null;
      })
      .filter((entry): entry is AskCitation => entry !== null);

    return {
      status: 200,
      body: { answer, citations, mode: context.mode },
    };
  } catch {
    return { status: 500, body: { error: "Something went wrong." } };
  }
}
