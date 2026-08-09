"use client";

import { useEffect, useRef } from "react";
import { Fragment } from "react";

type ReactiveHeadlineProps = {
  name: string;
};

const REST_WDTH = 80;
const MAX_WDTH = 100;
const RADIUS = 130;
const DAMPING = 0.15;
const SETTLE_EPSILON = 0.05;
const WAVE_DURATION_MS = 600;
const WAVE_PEAK_WDTH = 92;

function setLetterWdth(letter: HTMLElement, wdth: number) {
  letter.style.fontVariationSettings = `"wght" 800, "wdth" ${wdth.toFixed(2)}`;
}

export function ReactiveHeadline({ name }: ReactiveHeadlineProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const letters = Array.from(
      container.querySelectorAll<HTMLSpanElement>("[data-letter]"),
    );
    if (letters.length === 0) return;

    const current = letters.map(() => REST_WDTH);
    const target = letters.map(() => REST_WDTH);
    let rafId: number | null = null;

    function step() {
      let settled = true;
      for (let i = 0; i < letters.length; i++) {
        const c = current[i];
        const t = target[i];
        const next = c + (t - c) * DAMPING;
        current[i] = next;
        if (Math.abs(t - next) > SETTLE_EPSILON) settled = false;
        setLetterWdth(letters[i], next);
      }
      rafId = settled ? null : requestAnimationFrame(step);
    }

    function ensureLoop() {
      if (rafId === null) {
        rafId = requestAnimationFrame(step);
      }
    }

    if (window.matchMedia("(pointer: fine)").matches) {
      const hero =
        container.closest<HTMLElement>("[data-headline-zone]") ?? container;

      const handlePointerMove = (event: PointerEvent) => {
        letters.forEach((letter, i) => {
          const rect = letter.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = event.clientX - cx;
          const dy = event.clientY - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const falloff = Math.max(0, 1 - dist / RADIUS);
          target[i] = REST_WDTH + (MAX_WDTH - REST_WDTH) * falloff;
        });
        ensureLoop();
      };

      const handlePointerLeave = () => {
        for (let i = 0; i < target.length; i++) target[i] = REST_WDTH;
        ensureLoop();
      };

      hero.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      });
      hero.addEventListener("pointerleave", handlePointerLeave, {
        passive: true,
      });

      return () => {
        hero.removeEventListener("pointermove", handlePointerMove);
        hero.removeEventListener("pointerleave", handlePointerLeave);
        if (rafId !== null) cancelAnimationFrame(rafId);
      };
    }

    // Coarse pointer (touch): a single left-to-right width wave on load.
    const start = performance.now();
    const staggerWindow = 0.5;

    function waveStep(now: number) {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / WAVE_DURATION_MS);
      letters.forEach((letter, i) => {
        const delay = (i / letters.length) * staggerWindow;
        const local = Math.min(
          1,
          Math.max(0, (progress - delay) / staggerWindow),
        );
        const wave = Math.sin(local * Math.PI);
        setLetterWdth(letter, REST_WDTH + (WAVE_PEAK_WDTH - REST_WDTH) * wave);
      });
      if (progress < 1) {
        rafId = requestAnimationFrame(waveStep);
      } else {
        letters.forEach((letter) => {
          letter.style.fontVariationSettings = "";
        });
        rafId = null;
      }
    }
    rafId = requestAnimationFrame(waveStep);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  const words = name.split(" ");

  return (
    <span ref={containerRef} aria-hidden="true">
      {words.map((word, wi) => (
        <Fragment key={wi}>
          {wi > 0 ? " " : null}
          <span style={{ whiteSpace: "nowrap" }}>
            {word.split("").map((char, ci) => (
              <span key={ci} data-letter="">
                {char}
              </span>
            ))}
          </span>
        </Fragment>
      ))}
    </span>
  );
}
