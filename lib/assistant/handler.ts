import { buildContext } from "./context";
import { buildSystemPrompt } from "./prompt";
import { validateAnswer } from "./citations";
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

    const context = await buildContext(question, {
      corpus: deps.corpus,
      vectors: deps.vectors,
      embed: deps.embed,
    });

    if (context.mode === "refuse") {
      return {
        status: 200,
        body: { answer: REFUSAL_MESSAGE, citations: [], mode: "refused" },
      };
    }

    const system = buildSystemPrompt(context.sections);

    let answer: string;
    try {
      answer = await deps.chat({ system, user: question });
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
