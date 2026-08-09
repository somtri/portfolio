"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { SUGGESTED_QUESTIONS, useAsk } from "@/components/useAsk";

const RESUME_HREF = "/resume.pdf";

type EasterEgg = {
  kind: "resume" | "help" | "unknown";
  raw: string;
};

function easterEggText(egg: EasterEgg): string {
  if (egg.kind === "resume") {
    return "Opening the resume PDF…";
  }
  if (egg.kind === "help") {
    return "som --resume   open the resume PDF\nsom --help     show this help";
  }
  return "unknown flag: try 'som --help'";
}

export function AskWidget() {
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
  const [shrunk, setShrunk] = useState(false);
  const [egg, setEgg] = useState<EasterEgg | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pillRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleScroll() {
      setShrunk(true);
      window.removeEventListener("scroll", handleScroll);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function openDialog() {
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  function handleDialogClose() {
    pillRef.current?.focus();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) {
      return;
    }

    const trimmed = question.trim();

    if (/^som\s+--/i.test(trimmed)) {
      setResult(null);
      setError(null);

      const trimmedLower = trimmed.toLowerCase();
      if (/^som\s+--resume\s*$/i.test(trimmedLower)) {
        window.open(RESUME_HREF, "_blank", "noreferrer");
        setEgg({ kind: "resume", raw: trimmed });
      } else if (/^som\s+--help\s*$/i.test(trimmedLower)) {
        setEgg({ kind: "help", raw: trimmed });
      } else {
        setEgg({ kind: "unknown", raw: trimmed });
      }
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
    <>
      <button
        ref={pillRef}
        type="button"
        onClick={openDialog}
        aria-label="Ask me anything about Som"
        className={`ask-pill ${shrunk ? "ask-pill--dot-only" : ""}`}
      >
        <span className="ask-pill__dot" aria-hidden="true" />
        <span className="ask-pill__label">Ask me anything about Som</span>
      </button>

      <dialog
        ref={dialogRef}
        onClose={handleDialogClose}
        className="ask-dialog"
        aria-label="Ask about Som's work"
      >
        <div className="ink-panel flex items-center justify-between px-4 py-3">
          <p className="label">som@portfolio:~$</p>
          <button
            type="button"
            onClick={closeDialog}
            aria-label="Close"
            className="label border border-transparent px-2 py-1 hover:border-[var(--panel-text)] focus-visible:border-[var(--panel-text)]"
          >
            ✕
          </button>
        </div>

        <div className="ask-dialog__body px-4 py-4">
          <div>
            {SUGGESTED_QUESTIONS.map((suggested, index) => (
              <button
                key={suggested}
                type="button"
                disabled={loading}
                onClick={() => handleSuggested(suggested)}
                className="index-row w-full text-left grid grid-cols-[2rem_1fr] gap-x-3 py-2 text-sm"
              >
                <span className="label row-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{suggested}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2">
            <label htmlFor="ask-widget-input" className="label">
              Ask:
            </label>
            <div className="flex gap-2">
              <input
                id="ask-widget-input"
                name="question"
                type="text"
                maxLength={500}
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                disabled={loading}
                className="w-full border border-[var(--line-strong)] bg-[var(--surface)] px-3 py-2 font-mono text-sm"
                placeholder="Ask about a project, role, or skill…"
              />
              <button
                type="submit"
                disabled={loading}
                className="button-link button-link--solid inline-flex min-h-9 shrink-0 items-center px-3 font-mono text-xs font-medium uppercase tracking-[0.1em]"
              >
                Ask
              </button>
            </div>
          </form>

          <div aria-live="polite" className="mt-4">
            {loading ? (
              <p className="label row-muted flex items-center">
                …querying index
                <span className="ask-cursor" aria-hidden="true" />
              </p>
            ) : null}

            {!loading && egg ? (
              <pre className="rule-strong mt-4 whitespace-pre-wrap pt-3 font-mono text-sm">
                {easterEggText(egg)}
              </pre>
            ) : null}

            {!loading && !egg && error ? (
              <p className="label mt-4" role="status">
                {error}
              </p>
            ) : null}

            {!loading && !egg && !error && result ? (
              <div className="rule-strong mt-4 pt-3">
                <p className="label row-muted">{result.question}</p>
                <p className="mt-2 text-sm leading-6">{result.answer}</p>
                {result.citations.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
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
      </dialog>
    </>
  );
}
