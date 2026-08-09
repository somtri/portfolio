import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { AskAssistant } from "@/components/AskAssistant";

export const metadata: Metadata = {
  title: "Ask",
  description:
    "A grounded assistant that answers questions about Som's work from the site's own content.",
};

export default function AskPage() {
  return (
    <>
      <PageHeader
        title="Ask about the work."
        summary={
          "A grounded assistant that answers from this site's project, experience, and resume content — and says \"I don't know\" otherwise."
        }
      />
      <section className="site-container pb-20">
        <AskAssistant />
      </section>
    </>
  );
}
