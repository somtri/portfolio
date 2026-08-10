"use client";

import { useEffect } from "react";

const ICONS = {
  dark: { svg: "/icon-dark.svg", png: "/icon-dark.png" },
  light: { svg: "/icon-light.svg", png: "/icon-light.png" },
} as const;

const THEME_EVENT = "portfolio-theme-change";

/**
 * Points the browser tab icon at the site's own theme.
 *
 * Both links are created here rather than through Next's icon file convention.
 * A file-convention icon is rendered by React, and rewriting its href would
 * either fight React's own head updates on navigation or race hydration
 * (D-014). These elements are ours alone, so nothing re-renders them.
 *
 * Two formats, because Safari ignores SVG favicons entirely: it takes the PNG,
 * everything else takes the SVG. The PNG carries an explicit size and the SVG
 * does not, which is the shape that keeps SVG-capable browsers on the SVG.
 */
export function TabIcon() {
  useEffect(() => {
    const png = document.createElement("link");
    png.rel = "icon";
    png.type = "image/png";
    png.setAttribute("sizes", "96x96");

    const svg = document.createElement("link");
    svg.rel = "icon";
    svg.type = "image/svg+xml";

    const sync = () => {
      const theme =
        document.documentElement.dataset.theme === "light" ? "light" : "dark";
      png.href = ICONS[theme].png;
      svg.href = ICONS[theme].svg;
    };

    sync();
    document.head.append(png, svg);
    window.addEventListener(THEME_EVENT, sync);

    return () => {
      window.removeEventListener(THEME_EVENT, sync);
      png.remove();
      svg.remove();
    };
  }, []);

  return null;
}
