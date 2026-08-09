"use client";

import { useState } from "react";

export type AskCitation = { cite: string; href: string };

export type AskResult = {
  question: string;
  answer: string;
  citations: AskCitation[];
};

export const SUGGESTED_QUESTIONS = [
  "What is RunScope?",
  "What ML research has Som done?",
  "What is Som's experience with computer vision?",
  "Which projects use Rust?",
];

export function useAsk() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AskResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function ask(value: string) {
    const trimmed = value.trim();
    if (!trimmed || loading) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });

      let body: {
        answer?: string;
        citations?: AskCitation[];
        error?: string;
      } | null = null;

      try {
        body = await response.json();
      } catch {
        body = null;
      }

      if (!response.ok || !body || typeof body.answer !== "string") {
        setError(body?.error ?? "Something went wrong. Try again.");
        setResult(null);
        return;
      }

      setResult({
        question: trimmed,
        answer: body.answer,
        citations: body.citations ?? [],
      });
    } catch {
      setError("Network error. Try again.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return {
    question,
    setQuestion,
    loading,
    result,
    setResult,
    error,
    setError,
    ask,
  };
}
