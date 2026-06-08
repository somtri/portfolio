import type { Metadata } from "next";
import { ContactLinks } from "@/components/ContactLinks";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Contact",
  description: "Email, LinkedIn, GitHub, resume, and location.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact and profiles."
        summary="Email, LinkedIn, GitHub, resume, and current location."
      />
      <section className="site-container pb-20">
        <ContactLinks />
      </section>
    </>
  );
}
