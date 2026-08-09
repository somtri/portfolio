import { EmbeddingsUnavailableError } from "./types";

const DEFAULT_MODEL = "@cf/baai/bge-small-en-v1.5";
const TIMEOUT_MS = 10_000;

export async function embedTexts(texts: string[]): Promise<number[][]> {
  const accountId = process.env.EMBEDDINGS_ACCOUNT_ID;
  const token = process.env.EMBEDDINGS_API_TOKEN;
  const model = process.env.EMBEDDINGS_MODEL || DEFAULT_MODEL;

  if (!accountId || !token) {
    throw new EmbeddingsUnavailableError(
      "Missing EMBEDDINGS_ACCOUNT_ID or EMBEDDINGS_API_TOKEN",
    );
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: texts }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    throw new EmbeddingsUnavailableError(
      `Embeddings request failed: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  if (!response.ok) {
    throw new EmbeddingsUnavailableError(
      `Embeddings request returned status ${response.status}`,
    );
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch (error) {
    throw new EmbeddingsUnavailableError(
      `Embeddings response was not valid JSON: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  const data = (body as { result?: { data?: unknown } } | null)?.result?.data;

  if (
    !Array.isArray(data) ||
    data.length !== texts.length ||
    !data.every(
      (vector) =>
        Array.isArray(vector) && vector.every((n) => typeof n === "number"),
    )
  ) {
    throw new EmbeddingsUnavailableError(
      "Embeddings response had an unexpected shape",
    );
  }

  return data as number[][];
}
