export const RESUME_HREF = "/resume.pdf";

export type EasterEgg = {
  kind: "resume" | "help" | "unknown";
  raw: string;
};

export function detectEasterEgg(trimmed: string): EasterEgg | null {
  if (!/^som\s+--/i.test(trimmed)) {
    return null;
  }

  const lower = trimmed.toLowerCase();

  if (/^som\s+--resume\s*$/i.test(lower)) {
    return { kind: "resume", raw: trimmed };
  }

  if (/^som\s+--help\s*$/i.test(lower)) {
    return { kind: "help", raw: trimmed };
  }

  return { kind: "unknown", raw: trimmed };
}

export function easterEggText(egg: EasterEgg): string {
  if (egg.kind === "resume") {
    return "Opening the resume PDF…";
  }
  if (egg.kind === "help") {
    return "som --resume   open the resume PDF\nsom --help     show this help";
  }
  return "unknown flag: try 'som --help'";
}
