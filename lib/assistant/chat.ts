import { ChatUnavailableError } from "./types";
import { MAX_ANSWER_TOKENS } from "./constants";

const TIMEOUT_MS = 30_000;

export async function chatComplete(opts: {
  system: string;
  user: string;
}): Promise<string> {
  const baseUrl = process.env.ASSISTANT_BASE_URL;
  const model = process.env.ASSISTANT_MODEL;
  const apiKey = process.env.ASSISTANT_API_KEY;

  if (!baseUrl || !model || !apiKey) {
    throw new ChatUnavailableError(
      "Missing ASSISTANT_BASE_URL, ASSISTANT_MODEL, or ASSISTANT_API_KEY",
    );
  }

  let response: Response;
  try {
    response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: opts.system },
          { role: "user", content: opts.user },
        ],
        temperature: 0.2,
        max_tokens: MAX_ANSWER_TOKENS,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    throw new ChatUnavailableError(
      `Chat request failed: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  if (!response.ok) {
    throw new ChatUnavailableError(
      `Chat request returned status ${response.status}`,
    );
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch (error) {
    throw new ChatUnavailableError(
      `Chat response was not valid JSON: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  const content = (
    body as { choices?: { message?: { content?: unknown } }[] } | null
  )?.choices?.[0]?.message?.content;

  if (typeof content !== "string" || content.length === 0) {
    throw new ChatUnavailableError("Chat response had an unexpected shape");
  }

  return content;
}
