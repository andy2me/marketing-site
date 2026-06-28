// Horace event tracking — typed authoring surface over window.dataLayer.
//
// Horace runs through GTM (GTM-PHTG3D6N). This module is NOT a separate
// transport; it's a small typed wrapper around `dataLayer.push(...)` so the
// spec's named events stay correct from day one and aren't a string typo away
// from silently missing. Common payload bits (snippet_key, page entity
// context) are computed once here instead of at every call site.
//
// GTM tags subscribe to these events the same way they subscribe to any other
// site event. Before launch, confirm each event has a tag mapping in GTM that
// forwards to Horace — see the plan's open dependency #2.

type Primitive = string | number | boolean | null | undefined;
type Payload = Record<string, Primitive>;

// Spec §Tracking events — one entry per event name. Listed here so the union
// stays explicit; only events in this set are pushable through track().
export type HoraceEvent =
  | "complex_profile_viewed"
  | "complex_event_clicked"
  | "complex_buyer_interest_opened"
  | "complex_buyer_interest_submitted"
  | "unit_profile_viewed"
  | "unit_event_history_expanded"
  | "unit_comparable_clicked"
  | "unit_buyer_interest_opened"
  | "unit_buyer_interest_submitted"
  | "property_scroll_depth"
  | "property_appraisal_cta_clicked"
  | "identity_registered";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

// Best-effort `snippet_key` read — Horace identifies anonymous visitors via
// this cookie. Returns null on the server, in non-browser contexts, or when
// the cookie is absent. Don't throw — tracking should never break the page.
function readSnippetKey(): string | null {
  if (typeof document === "undefined") return null;
  try {
    const cookies = document.cookie ? document.cookie.split("; ") : [];
    for (const c of cookies) {
      const eq = c.indexOf("=");
      const k = eq >= 0 ? c.slice(0, eq) : c;
      if (k === "snippet_key" || k === "hx_snippet_key" || k === "hx_anon") {
        return decodeURIComponent(c.slice(eq + 1));
      }
    }
  } catch {
    return null;
  }
  return null;
}

function push(event: HoraceEvent, payload: Payload): void {
  if (typeof window === "undefined") return;
  const layer = (window.dataLayer = window.dataLayer ?? []);
  layer.push({ event, snippet_key: readSnippetKey(), ...payload });
}

// ── Typed call surface (one per spec event) ───────────────────────────────
// Use camelCase here for ergonomics; snake_case lands in the payload so it
// matches the spec / Horace property names verbatim.

export const track = {
  complexProfileViewed(args: {
    complexId: string;
    totalUnits: number;
    recentEventsCount: number;
  }) {
    push("complex_profile_viewed", {
      complex_id: args.complexId,
      total_units: args.totalUnits,
      recent_events_count: args.recentEventsCount,
    });
  },
  complexEventClicked(args: {
    complexId: string;
    eventType: string;
    unitId: string;
  }) {
    push("complex_event_clicked", {
      complex_id: args.complexId,
      event_type: args.eventType,
      unit_id: args.unitId,
    });
  },
  complexBuyerInterestOpened(args: { complexId: string }) {
    push("complex_buyer_interest_opened", { complex_id: args.complexId });
  },
  complexBuyerInterestSubmitted(args: {
    complexId: string;
    hasBudget: boolean;
    hasTimeframe: boolean;
  }) {
    push("complex_buyer_interest_submitted", {
      complex_id: args.complexId,
      has_budget: args.hasBudget,
      has_timeframe: args.hasTimeframe,
    });
  },
  unitProfileViewed(args: {
    complexId: string;
    unitId: string;
    currentStatus: string;
    hasCommentary: boolean;
  }) {
    push("unit_profile_viewed", {
      complex_id: args.complexId,
      unit_id: args.unitId,
      current_status: args.currentStatus,
      has_commentary: args.hasCommentary,
    });
  },
  unitEventHistoryExpanded(args: {
    complexId: string;
    unitId: string;
    eventCount: number;
  }) {
    push("unit_event_history_expanded", {
      complex_id: args.complexId,
      unit_id: args.unitId,
      event_count: args.eventCount,
    });
  },
  unitComparableClicked(args: {
    sourceUnitId: string;
    destinationUnitId: string;
  }) {
    push("unit_comparable_clicked", {
      source_unit_id: args.sourceUnitId,
      destination_unit_id: args.destinationUnitId,
    });
  },
  unitBuyerInterestOpened(args: { complexId: string; unitId: string }) {
    push("unit_buyer_interest_opened", {
      complex_id: args.complexId,
      unit_id: args.unitId,
    });
  },
  unitBuyerInterestSubmitted(args: {
    complexId: string;
    unitId: string;
    hasBudget: boolean;
    hasTimeframe: boolean;
  }) {
    push("unit_buyer_interest_submitted", {
      complex_id: args.complexId,
      unit_id: args.unitId,
      has_budget: args.hasBudget,
      has_timeframe: args.hasTimeframe,
    });
  },
  propertyScrollDepth(args: { depth: 25 | 50 | 75 | 100 }) {
    push("property_scroll_depth", { depth: args.depth });
  },
  propertyAppraisalCtaClicked(args: {
    sourcePage: string;
    entityType: "complex" | "unit";
    entityId: string;
  }) {
    push("property_appraisal_cta_clicked", {
      source_page: args.sourcePage,
      entity_type: args.entityType,
      entity_id: args.entityId,
    });
  },
  // Identity event — fires on buyer-interest submit, stitching anonymous
  // snippet_key history to the named contact. Email is the strongest stitch
  // Horace has; protect it.
  identityRegistered(args: {
    entityType: "complex" | "unit";
    entityId: string;
    registrationType: "complex" | "unit";
    email: string;
  }) {
    push("identity_registered", {
      entity_type: args.entityType,
      entity_id: args.entityId,
      registration_type: args.registrationType,
      email: args.email,
    });
  },
};
