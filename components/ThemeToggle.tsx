"use client";

import { useRef, useSyncExternalStore } from "react";

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
  const buttonRef = useRef<HTMLButtonElement>(null);

  function toggleTheme() {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";
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
      buttonRef.current
    ) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );
      root.style.setProperty("--vt-x", `${x}px`);
      root.style.setProperty("--vt-y", `${y}px`);
      root.style.setProperty("--vt-radius", `${radius}px`);
      document.startViewTransition(applyTheme);
      return;
    }

    root.classList.add("theme-transitioning");
    applyTheme();

    window.setTimeout(() => {
      root.classList.remove("theme-transitioning");
    }, 350);
  }

  const isDark = theme === "dark";

  return (
    <button
      ref={buttonRef}
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      title={`Switch to ${isDark ? "light" : "dark"} theme`}
      onClick={toggleTheme}
      className="theme-toggle"
    >
      <span className="sr-only">
        {isDark ? "Dark theme active" : "Light theme active"}
      </span>
      <span aria-hidden="true" className="theme-toggle__track">
        <span className="theme-toggle__sun">L</span>
        <span className="theme-toggle__moon">D</span>
        <span className="theme-toggle__thumb" />
      </span>
    </button>
  );
}
