"use client";

import { useRef, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark";

const themeEvent = "portfolio-theme-change";

function subscribe(callback: () => void) {
  window.addEventListener(themeEvent, callback);
  return () => window.removeEventListener(themeEvent, callback);
}

function getTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "light");
  const lightRef = useRef<HTMLButtonElement>(null);
  const darkRef = useRef<HTMLButtonElement>(null);

  function setTheme(nextTheme: Theme, buttonEl: HTMLButtonElement | null) {
    if (nextTheme === theme) return;
    const root = document.documentElement;

    const applyTheme = () => {
      root.dataset.theme = nextTheme;
      window.localStorage.setItem("portfolio-theme", nextTheme);
      window.dispatchEvent(new Event(themeEvent));
    };

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (
      !reduceMotion &&
      typeof document.startViewTransition === "function" &&
      document.visibilityState === "visible" &&
      buttonEl
    ) {
      const rect = buttonEl.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );
      root.style.setProperty("--vt-x", `${x}px`);
      root.style.setProperty("--vt-y", `${y}px`);
      root.style.setProperty("--vt-radius", `${radius}px`);
      const transition = document.startViewTransition(applyTheme);
      transition.finished.catch(() => {});
      return;
    }

    root.classList.add("theme-transitioning");
    applyTheme();

    window.setTimeout(() => {
      root.classList.remove("theme-transitioning");
    }, 350);
  }

  return (
    <span className="inline-flex items-center gap-0" role="group" aria-label="Theme">
      <button
        ref={lightRef}
        type="button"
        aria-pressed={theme === "light"}
        onClick={() => setTheme("light", lightRef.current)}
        className={cn("mode-pill", theme === "light" && "mode-pill--active")}
      >
        light
      </button>
      <button
        ref={darkRef}
        type="button"
        aria-pressed={theme === "dark"}
        onClick={() => setTheme("dark", darkRef.current)}
        className={cn("mode-pill", theme === "dark" && "mode-pill--active")}
      >
        dark
      </button>
    </span>
  );
}
