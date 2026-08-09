"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import { SUGGESTED_QUESTIONS, useAsk } from "@/components/useAsk";

export function AskAssistant() {
  const { question, setQuestion, loading, result, error, ask } = useAsk();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void ask(question);
  }

  function handleSuggested(value: string) {
    setQuestion(value);
    void ask(value);
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <label htmlFor="ask-input" className="label">
            Ask:
          </label>
          <input
            id="ask-input"
            name="question"
            type="text"
            maxLength={500}
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            disabled={loading}
            className="mt-2 w-full border border-[var(--line-strong)] bg-[var(--surface)] px-3 py-3 font-mono text-sm"
            placeholder="Ask about a project, role, or skill…"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="button-link button-link--solid inline-flex min-h-11 items-center px-4 font-mono text-xs font-medium uppercase tracking-[0.1em]"
        >
          Ask
        </button>
      </form>

      <div className="mt-6">
        <p className="label row-muted">[ Try ]</p>
        <div>
          {SUGGESTED_QUESTIONS.map((suggested, index) => (
            <button
              key={suggested}
              type="button"
              disabled={loading}
              onClick={() => handleSuggested(suggested)}
              className="index-row w-full text-left grid grid-cols-[2.5rem_1fr] gap-x-4 py-3"
            >
              <span className="label row-muted">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{suggested}</span>
            </button>
          ))}
        </div>
      </div>

      <div aria-live="polite">
        {loading ? (
          <p className="label row-muted mt-8">…querying index</p>
        ) : null}

        {!loading && error ? (
          <p className="label mt-8" role="status">
            {error}
          </p>
        ) : null}

        {!loading && !error && result ? (
          <div className="rule-strong mt-8 pt-5">
            <p className="label row-muted">{result.question}</p>
            <p className="mt-3 leading-7">{result.answer}</p>
            {result.citations.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-x-4">
                {result.citations.map((citation) => (
                  <Link
                    key={citation.cite}
                    href={citation.href}
                    className="ask-chip label"
                  >
                    [ {citation.cite} ]
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
