"use client";

import { useState } from "react";
import Link from "next/link";
import { PropertyCard } from "@/components/property/PropertyCard";
import type { ListingCard } from "@/lib/rex/types";
import s from "./agent.module.css";

type Tab = "active" | "sold";

export function AgentListings({
  active,
  sold,
  agentName,
}: {
  active: ListingCard[];
  sold: ListingCard[];
  agentName: string;
}) {
  const [tab, setTab] = useState<Tab>(active.length > 0 ? "active" : "sold");
  const showSoldTab = sold.length > 0;
  if (active.length === 0 && sold.length === 0) return null;

  const current = tab === "active" ? active : sold;

  return (
    <section className={s.section}>
      <div className={s.sectionHead}>
        <div>
          <div className="overline">§ Campaigns</div>
          <h2 className={s.sectionH2}>What {agentName.split(" ")[0]} is selling.</h2>
        </div>
        <div className={s.listingTabs} role="tablist" aria-label="Listings filter">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "active"}
            className={`${s.listingTab} ${tab === "active" ? s.listingTabActive : ""}`}
            onClick={() => setTab("active")}
          >
            Available · {active.length}
          </button>
          {showSoldTab ? (
            <button
              type="button"
              role="tab"
              aria-selected={tab === "sold"}
              className={`${s.listingTab} ${tab === "sold" ? s.listingTabActive : ""}`}
              onClick={() => setTab("sold")}
            >
              Recently sold · {sold.length}
            </button>
          ) : null}
        </div>
      </div>

      {current.length > 0 ? (
        <div className={s.listingGrid}>
          {current.map((p) => (
            <PropertyCard key={p.id} p={p} />
          ))}
        </div>
      ) : (
        <div className={s.listingEmpty}>
          <h3 className={s.listingEmptyH3}>No active listings right now.</h3>
          <p className={s.listingEmptyBody}>
            {agentName.split(" ")[0]} only lists what he can sell well. If you&rsquo;d like to be
            on his next campaign, start with an honest appraisal.
          </p>
          <Link href="#appraisal" className="btn btn-primary">
            Request an appraisal
          </Link>
        </div>
      )}
    </section>
  );
}
