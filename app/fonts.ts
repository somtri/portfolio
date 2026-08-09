import { IBM_Plex_Sans, Martian_Mono } from "next/font/google";

export const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-plex-sans",
  display: "swap",
});

export const martianMono = Martian_Mono({
  subsets: ["latin"],
  variable: "--font-martian",
  display: "swap",
});
