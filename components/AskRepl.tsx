"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { SUGGESTED_QUESTIONS, useAsk } from "@/components/useAsk";
import {
  RESUME_HREF,
  detectEasterEgg,
  easterEggText,
  type EasterEgg,
} from "@/components/askEasterEgg";

export function AskRepl() {
  const {
    question,
    setQuestion,
    loading,
    result,
    setResult,
    error,
    setError,
    ask,
  } = useAsk();
  const [egg, setEgg] = useState<EasterEgg | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) {
      return;
    }

    const trimmed = question.trim();
    const detected = detectEasterEgg(trimmed);

    if (detected) {
      setResult(null);
      setError(null);

      if (detected.kind === "resume") {
        window.open(RESUME_HREF, "_blank", "noreferrer");
      }
      setEgg(detected);
      return;
    }

    setEgg(null);
    void ask(question);
  }

  function handleSuggested(value: string) {
    setEgg(null);
    setQuestion(value);
    void ask(value);
  }

  return (
    <div className="border border-[var(--line-strong)]">
      <div className="flex flex-col gap-1 border-b border-[var(--line-strong)] px-6 py-3.5 text-[12.5px] text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
        <span>
          <b className="font-bold text-[var(--ink)]">ask</b> · grounded on
          this site&apos;s content
        </span>
        <span>single-turn · cited</span>
      </div>

      <div className="grid gap-3 px-6 py-7 text-[13.5px]">
        {SUGGESTED_QUESTIONS.map((suggested, index) => (
          <button
            key={suggested}
            type="button"
            disabled={loading}
            onClick={() => handleSuggested(suggested)}
            className="w-full text-left text-[var(--muted)] hover:text-[var(--ink)] focus-visible:text-[var(--ink)]"
          >
            <span className="text-[var(--accent)]">[{index + 1}]</span>{" "}
            {suggested}
          </button>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3 border-t border-[var(--line)] px-6 py-5 text-[14.5px]"
      >
        <label
          htmlFor="ask-repl-input"
          className="shrink-0 text-[var(--accent)]"
        >
          som@portfolio:~$
        </label>
        <input
          id="ask-repl-input"
          name="question"
          type="text"
          maxLength={500}
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          disabled={loading}
          autoComplete="off"
          spellCheck={false}
          className="w-full min-w-0 border-0 bg-transparent text-[var(--ink)] caret-[var(--accent)] outline-none placeholder:text-[var(--faint)]"
          placeholder="what is som working on right now"
        />
      </form>

      <div
        aria-live="polite"
        className="border-t border-[var(--line)] px-6 py-4 text-[13.5px]"
      >
        {loading ? (
          <p className="flex items-center text-[var(--muted)]">
            …querying index
            <span className="ask-cursor" aria-hidden="true" />
          </p>
        ) : null}

        {!loading && egg ? (
          <pre className="whitespace-pre-wrap text-[var(--muted)]">
            {easterEggText(egg)}
          </pre>
        ) : null}

        {!loading && !egg && error ? (
          <p className="text-[var(--muted)]" role="status">
            {error}
          </p>
        ) : null}

        {!loading && !egg && !error && result ? (
          <div>
            <p className="text-[var(--faint)]">{result.question}</p>
            <p className="mt-2 leading-6 text-[var(--muted)]">
              {result.answer}
            </p>
            {result.citations.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-3">
                {result.citations.map((citation) => (
                  <Link
                    key={citation.cite}
                    href={citation.href}
                    className="border border-[var(--accent)] px-2 py-1 text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--on-accent)] focus-visible:bg-[var(--accent)] focus-visible:text-[var(--on-accent)]"
                  >
                    [ {citation.cite} ]
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="border-t border-[var(--line)] px-6 py-3 text-[11.5px] text-[var(--faint)]">
        try: som --resume · som --help
      </div>
    </div>
  );
}
