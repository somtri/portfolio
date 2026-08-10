"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { SUGGESTED_QUESTIONS, useAsk } from "@/components/useAsk";
import { TerminalSkeleton } from "@/components/TerminalSkeleton";
import {
  RESUME_HREF,
  detectEasterEgg,
  easterEggText,
  type EasterEgg,
} from "@/components/askEasterEgg";

const LABELS = [
  "ask me anything_",
  "questions?_",
  "som --help_",
  "got a question? type it_",
  "wanna know more about som?_",
  "som's looking hireable rn_",
  "works on my machine_",
  "segfault-free since 2005_",
  "it's not a bug, it's a feature_",
  "will code for coffee_",
  "talk data to me_",
  "what's som building rn?_",
  "what's som best at?_",
  "wanna know about som's research?_",
  "som --resume_",
  "it compiles, ship it_",
  "0 bugs (that i know of)_",
  "deploys on fridays_",
  "this button follows you around_",
  "the answers are cited, relax_",
];

const DOT_HOLD_MS = 1500;
const DOT_HOLD_FIRST_MS = 3000;
const PILL_HOLD_MS = 3500;

type Phase = "dot" | "pill";

function subscribeMediaQuery(query: string) {
  return (callback: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", callback);
    return () => mql.removeEventListener("change", callback);
  };
}

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    subscribeMediaQuery(query),
    () => window.matchMedia(query).matches,
    () => false,
  );
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
  const [egg, setEgg] = useState<EasterEgg | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("dot");
  const [labelIndex, setLabelIndex] = useState(0);
  const isFirstDotRef = useRef(true);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pillRef = useRef<HTMLButtonElement>(null);

  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const isMobile = useMediaQuery("(max-width: 639px)");
  const cyclingActive = !dialogOpen && !reducedMotion && !isMobile;

  // dot <-> pill state machine: labels only change while collapsed to a dot,
  // so the pill never reflows mid-hold.
  useEffect(() => {
    if (!cyclingActive) {
      return;
    }

    const isDot = phase === "dot";
    const delay = isDot
      ? isFirstDotRef.current
        ? DOT_HOLD_FIRST_MS
        : DOT_HOLD_MS
      : PILL_HOLD_MS;

    const timer = window.setTimeout(() => {
      if (isDot) {
        isFirstDotRef.current = false;
        setPhase("pill");
      } else {
        setLabelIndex((index) => (index + 1) % LABELS.length);
        setPhase("dot");
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, [phase, cyclingActive]);

  const effectivePhase: Phase = isMobile ? "dot" : reducedMotion ? "pill" : phase;
  const effectiveLabelIndex = reducedMotion ? 0 : labelIndex;

  function openDialog() {
    setDialogOpen(true);
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  function handleDialogClose() {
    setDialogOpen(false);
    // the widget button is visibility:hidden while the dialog is open, so it
    // can't take focus until the re-show has painted.
    requestAnimationFrame(() => pillRef.current?.focus());
  }

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
    <>
      <button
        ref={pillRef}
        type="button"
        onClick={openDialog}
        aria-label="ask about som"
        className={`ask-pill ${effectivePhase === "dot" ? "ask-pill--dot" : ""} ${dialogOpen ? "ask-pill--hidden" : ""}`}
      >
        {effectivePhase === "dot" ? (
          <span className="ask-pill__caret" aria-hidden="true" />
        ) : (
          <span className="ask-pill__label" aria-hidden="true">
            <span className="ask-pill__prompt">&gt;</span>
            {LABELS[effectiveLabelIndex]}
          </span>
        )}
      </button>

      <dialog
        ref={dialogRef}
        onClose={handleDialogClose}
        className="ask-dialog"
        aria-label="Ask about Som's work"
      >
        <div className="ask-dialog__head flex items-center justify-between gap-3 border-b border-[var(--line-strong)] bg-[var(--surface)] px-6 py-3.5 text-[12.5px] text-[var(--muted)]">
          <span>
            <b className="font-bold text-[var(--ink)]">ask</b> · grounded on
            this site&apos;s content
          </span>
          <button
            type="button"
            onClick={closeDialog}
            aria-label="close"
            className="border border-transparent px-2 py-1 hover:border-[var(--line-strong)] focus-visible:border-[var(--line-strong)]"
          >
            ✕
          </button>
        </div>

        <div className="ask-dialog__body">
          <div className="grid gap-3 px-6 py-5 text-[13.5px]">
            {SUGGESTED_QUESTIONS.map((suggested, index) => (
              <button
                key={suggested}
                type="button"
                disabled={loading}
                onClick={() => handleSuggested(suggested)}
                className="index-row w-full text-left text-[var(--muted)] hover:text-[var(--ink)] focus-visible:text-[var(--ink)]"
              >
                <span className="text-[var(--accent)]">[{index + 1}]</span>{" "}
                {suggested}
              </button>
            ))}
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-3 border-t border-[var(--line)] px-6 py-4 text-[14.5px]"
          >
            <label
              htmlFor="ask-widget-input"
              className="shrink-0 text-[var(--accent)]"
            >
              som@portfolio:~$
            </label>
            <input
              id="ask-widget-input"
              name="question"
              aria-label="ask a question about som"
              type="text"
              maxLength={500}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              disabled={loading}
              autoComplete="off"
              spellCheck={false}
              className="w-full min-w-0 border-0 bg-transparent text-[var(--ink)] caret-[var(--accent)] outline-none placeholder:text-[var(--muted)]"
              placeholder="ask about a project, role, or skill…"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-h-9 shrink-0 items-center border border-[var(--line-strong)] px-3 font-mono text-[13px] text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:border-[var(--accent)] focus-visible:text-[var(--accent)]"
            >
              ask
            </button>
          </form>

          <div
            aria-live="polite"
            className="border-t border-[var(--line)] px-6 py-4 text-[13.5px]"
          >
            {loading ? (
              <div>
                <p className="flex items-center text-[var(--muted)]">
                  …querying index
                  <span className="ask-cursor" aria-hidden="true" />
                </p>
                <div className="mt-3">
                  <TerminalSkeleton rows={[56, 44, 28]} />
                </div>
              </div>
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
                  <div className="mt-3 flex flex-wrap gap-2">
                    {result.citations.map((citation) => (
                      <Link
                        key={citation.cite}
                        href={citation.href}
                        className="inline-flex items-center border border-[var(--line-strong)] px-2 py-1 text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:border-[var(--accent)] focus-visible:text-[var(--accent)]"
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
      </dialog>
    </>
  );
}
