// Lead → agent routing. Given a submitted form's identity (and, on the contact
// page, the chosen enquiry type), decide which agent owns the reply and what
// response-time copy to surface. Used by ContactForm (sidebar agent card) and
// the /thank-you page so both render the same answer.

export type LeadFormId =
  | "appraisal"
  | "contact"
  | "enquiry"
  | `appraisal-agent-${string}`
  | (string & {});

export type ContactEnquiry = "sell" | "buy" | "media" | "careers" | "general";

export type RoutedAgent = {
  /** Matches Agent.slug in lib/agents/store. */
  slug: string;
  /** Mono "when" tag for step 02 in the thank-you timeline. */
  responseWindow: string;
  /** Sidebar "Response time" copy on /contact. */
  responseLabel: string;
};

const MATT: RoutedAgent = { slug: "matt-powe", responseWindow: "Within 4 hours", responseLabel: "Inside 4 hours" };
const MATT_DAY: RoutedAgent = { slug: "matt-powe", responseWindow: "Within 1 business day", responseLabel: "Within 1 business day" };
const MATT_SAME: RoutedAgent = { slug: "matt-powe", responseWindow: "Same day", responseLabel: "Same day" };

const BY_ENQUIRY: Record<ContactEnquiry, RoutedAgent> = {
  sell: MATT,
  buy: MATT_DAY,
  media: MATT_SAME,
  careers: MATT_DAY,
  general: MATT_DAY,
};

/** Per-agent appraisal forms (agent profile pages) carry the slug in the formId. */
function slugFromAgentForm(formId: string): string | null {
  const prefix = "appraisal-agent-";
  return formId.startsWith(prefix) ? formId.slice(prefix.length) : null;
}

export function routeAgent(formId: string, enquiry?: string | null): RoutedAgent {
  const fromAgentForm = slugFromAgentForm(formId);
  if (fromAgentForm) return { slug: fromAgentForm, responseWindow: "Within 4 hours", responseLabel: "Inside 4 hours" };

  if (formId === "appraisal") return MATT;
  if (formId === "enquiry") return MATT;
  if (formId === "contact") {
    const key = (enquiry ?? "general") as ContactEnquiry;
    return BY_ENQUIRY[key] ?? BY_ENQUIRY.general;
  }
  return MATT_DAY;
}
