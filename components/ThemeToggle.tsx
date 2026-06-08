"use client";

import { useSyncExternalStore } from "react";

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

  function toggleTheme() {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";
    const root = document.documentElement;

    root.classList.add("theme-transitioning");
    root.dataset.theme = nextTheme;
    window.localStorage.setItem("portfolio-theme", nextTheme);
    window.dispatchEvent(new Event(themeEvent));

    window.setTimeout(() => {
      root.classList.remove("theme-transitioning");
    }, 350);
  }

  const isDark = theme === "dark";

  return (
    <button
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
