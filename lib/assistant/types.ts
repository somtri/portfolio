export type Section = {
  id: string;
  cite: string;
  href: string;
  title: string;
  text: string;
};

export type RetrievedSection = {
  section: Section;
  score: number;
};

export type ContextResult =
  | { mode: "retrieved"; sections: RetrievedSection[] }
  | { mode: "full"; sections: Section[] }
  | { mode: "refuse" };

export class EmbeddingsUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EmbeddingsUnavailableError";
  }
}

export class ChatUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ChatUnavailableError";
  }
}
