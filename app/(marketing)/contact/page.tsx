import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <PagePlaceholder
      title="Contact"
      current="Contact"
      note="Single unified enquiry form — dropdown drives conditional fields, heading, textarea prompt and the sidebar agent card (§9). Built in the Forms stage."
    />
  );
}
