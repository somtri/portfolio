"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const REVEAL_MS = 280;
const EASE_FALLBACK = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * Reveals [data-reveal] elements on scroll using the Web Animations API.
 *
 * This effect lives in the root layout, so it can run BEFORE the page segment
 * has hydrated. Any attribute we write on those elements first — a class, a
 * data attribute, an inline style — is an attribute React did not render, and
 * React reports it as a hydration mismatch it "won't patch up", leaving its
 * own view of the element stale. element.animate() writes no attributes at
 * all, so the reveal cannot collide with hydration whenever it happens.
 */
export function PageMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;

    // Reduced motion: never add motion-ready, so [data-reveal] is never
    // hidden in the first place and there is nothing to reveal.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    if (targets.length === 0) {
      return;
    }

    // Gates the hidden start state in globals.css. Added only once we know we
    // can animate, so content is never hidden without a way back.
    root.classList.add("motion-ready");

    const easing =
      getComputedStyle(root).getPropertyValue("--ease-spring").trim() ||
      EASE_FALLBACK;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const target = entry.target as HTMLElement;
          observer.unobserve(target);

          // IndexRow carries its stagger as an inline transition-delay.
          const delay = Number.parseFloat(target.style.transitionDelay) || 0;

          try {
            target.animate(
              [
                { opacity: "0", transform: "translateY(1rem)" },
                { opacity: "1", transform: "translateY(0)" },
              ],
              { duration: REVEAL_MS, delay, easing, fill: "forwards" },
            );
          } catch {
            // Nothing may stay invisible. Dropping motion-ready removes the
            // hidden start state for every target at once.
            root.classList.remove("motion-ready");
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.08,
      },
    );

    targets.forEach((target) => observer.observe(target));

    return () => {
      observer.disconnect();
      root.classList.remove("motion-ready");
    };
  }, [pathname]);

  return null;
}
