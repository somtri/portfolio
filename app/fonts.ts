import localFont from "next/font/local";

export const hack = localFont({
  src: [
    {
      path: "./fonts/hack-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/hack-bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-hack",
  display: "swap",
});

export const spaceGrotesk = localFont({
  src: [
    {
      path: "./fonts/space-grotesk-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-display",
  display: "swap",
});
