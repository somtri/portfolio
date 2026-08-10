import type { Metadata } from "next";
import { AskWidget } from "@/components/AskWidget";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PageMotion } from "@/components/PageMotion";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/site";
import { hack, spaceGrotesk } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  // Resolves the relative URLs below, and the og:image/twitter:image that
  // Next derives from app/opengraph-image.png and app/twitter-image.png.
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: "/",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${hack.variable} ${spaceGrotesk.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{document.documentElement.dataset.theme=localStorage.getItem("portfolio-theme")==="light"?"light":"dark"}catch(e){}',
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <PageMotion />
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[100] -translate-y-24 border border-[var(--line-strong)] bg-[var(--surface)] px-4 py-2 text-xs font-bold text-[var(--ink)] tracking-wider focus:translate-y-0"
        >
          skip to content
        </a>
        <Navbar />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        <AskWidget />
      </body>
    </html>
  );
}
