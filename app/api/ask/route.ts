import { handleAsk } from "@/lib/assistant/handler";
import { buildCorpus, knownCites } from "@/lib/assistant/corpus";
import { loadVectors } from "@/lib/assistant/vectors";
import { embedTexts } from "@/lib/assistant/embeddings";
import { chatComplete } from "@/lib/assistant/chat";
import { checkRateLimit } from "@/lib/assistant/ratelimit";

export async function POST(request: Request) {
  let question: unknown;

  try {
    const parsed = await request.json();
    question = (parsed as { question?: unknown } | null)?.question;
  } catch {
    return Response.json(
      { error: "Ask one question, up to 500 characters." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const origin = request.headers.get("origin");
  if (origin) {
    const originHost = new URL(origin).host;
    const requestHost = new URL(request.url).host;
    if (originHost !== requestHost) {
      return Response.json(
        { error: "Forbidden" },
        { status: 403, headers: { "Cache-Control": "no-store" } },
      );
    }
  }

  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || "unknown";

  const { status, body } = await handleAsk(question, ip, {
    corpus: buildCorpus(),
    known: knownCites(),
    vectors: loadVectors(),
    embed: embedTexts,
    chat: chatComplete,
    rateLimit: checkRateLimit,
  });

  const headers: Record<string, string> = { "Cache-Control": "no-store" };
  if (status === 429 && "retryAfterSec" in body && body.retryAfterSec !== undefined) {
    headers["Retry-After"] = String(body.retryAfterSec);
  }

  return Response.json(body, { status, headers });
}
