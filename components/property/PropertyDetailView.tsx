import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PropertyCard } from "./PropertyCard";
import { PropertyGallery } from "./PropertyGallery";
import { PDSubnav } from "./PDSubnav";
import { EnquiryForm } from "./EnquiryForm";
import {
  IconBed,
  IconBath,
  IconCar,
  IconLand,
  IconGrid,
  IconArrowR,
  IconPin,
} from "@/components/icons";
import type { Listing, ListingCard } from "@/lib/rex/types";
import s from "./detail.module.css";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "features", label: "Features" },
  { id: "inspections", label: "Inspections" },
  { id: "location", label: "Location" },
];

const suburbName = (suburb: string) => suburb.replace(/\s+QLD.*$/, "");

export function PropertyDetailView({
  listing,
  similar,
}: {
  listing: Listing;
  similar: ListingCard[];
}) {
  const name = suburbName(listing.suburb);
  const stats = [
    { label: "Bedrooms", value: listing.beds, icon: <IconBed size={20} /> },
    { label: "Bathrooms", value: listing.baths, icon: <IconBath size={20} /> },
    { label: "Car spaces", value: listing.cars, icon: <IconCar size={20} /> },
    { label: "Land size", value: listing.land, icon: <IconLand size={20} /> },
    { label: "Floorplan", value: listing.floorArea, icon: <IconGrid size={20} /> },
  ];

  return (
    <main className={s.main}>
      <Container as="nav" className={s.breadcrumb}>
        <Link href="/buy" className={s.bcLink}>
          Properties
        </Link>
        <span>›</span>
        <Link href={`/buy?suburb=${encodeURIComponent(name)}`} className={s.bcLink}>
          {name}
        </Link>
        <span>›</span>
        <span className={s.bcCurrent}>{listing.street}</span>
      </Container>

      <PropertyGallery
        title={`${listing.street}, ${name}`}
        images={listing.gallery}
        alt={listing.street}
        videoTour={listing.videoTour}
        walkthrough={listing.walkthrough}
        floorplan={listing.floorplan}
      />

      {/* Key facts */}
      <Container as="section" className={s.keyfacts}>
        <div className={s.kfTop}>
          <div>
            <div className={`overline ${s.kfStatus}`}>{listing.status}</div>
            <h1 className={s.kfTitle}>{listing.street}</h1>
            <div className={s.kfSuburb}>{listing.suburb}</div>
          </div>
          <div className={s.kfPriceCol}>
            <div className={s.kfPrice}>{listing.price}</div>
            {listing.nextOpen ? <div className={s.kfOpen}>{listing.nextOpen}</div> : null}
          </div>
        </div>
        <div className={s.kfStats}>
          {stats.map((f) => (
            <div key={f.label} className={s.kfStat}>
              <div className={s.kfStatIcon}>{f.icon}</div>
              <div className={s.kfStatValue}>{f.value}</div>
              <div className={s.kfStatLabel}>{f.label}</div>
            </div>
          ))}
        </div>
      </Container>

      <PDSubnav sections={SECTIONS} refId={listing.ref} />

      {/* Body */}
      <Container as="section" className={s.body}>
        <div className={s.bodyGrid}>
          <div>
            <div id="overview" className={s.anchor}>
              <div className="overline">Overview</div>
              <h2 className={s.h2}>{listing.overviewHeading}</h2>
              <div className={s.prose}>
                {listing.description.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            <div id="features" className={`${s.block} ${s.anchor}`}>
              <div className="overline">Features</div>
              <h3 className={s.h3}>What this home offers.</h3>
              <div className={s.featureGrid}>
                {listing.features.map((f) => (
                  <div key={f} className={s.featureItem}>
                    <span className={s.featureDash}>—</span>
                    {f}
                  </div>
                ))}
              </div>
            </div>

            <div id="inspections" className={`${s.block} ${s.anchor}`}>
              <div className="overline">Inspections</div>
              <h3 className={s.h3}>Open homes &amp; private inspections.</h3>
              <div className={s.inspectList}>
                {listing.inspections.map((o, i) => (
                  <div key={i} className={s.inspectRow}>
                    <div className={s.inspectDay}>{o.day}</div>
                    <div>
                      <div className={s.inspectDate}>{o.date}</div>
                      <div className={s.inspectTime}>{o.time}</div>
                    </div>
                    <div className={s.inspectType}>{o.type}</div>
                    <button type="button" className="btn btn-tertiary" style={{ fontSize: 13 }}>
                      + Calendar
                    </button>
                  </div>
                ))}
              </div>
              <Link href="/contact?enquiry=buy" className="btn btn-secondary btn-sm" style={{ marginTop: 16 }}>
                Request a private inspection
              </Link>
            </div>

            <div id="location" className={`${s.block} ${s.anchor}`}>
              <div className="overline">Location</div>
              <h3 className={s.h3}>{listing.suburb}</h3>
              {/* TODO(§8): replace this schematic with MapLibre GL using listing.coords. */}
              <div className={s.locMap}>
                <svg className={s.locMapSvg} viewBox="0 0 800 340" preserveAspectRatio="xMidYMid slice" aria-hidden>
                  <defs>
                    <pattern id="pd-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(86,76,68,.08)" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="800" height="340" fill="var(--soft-linen-500)" />
                  <rect width="800" height="340" fill="url(#pd-grid)" />
                  <path d="M0,40 Q220,80 380,140 T800,180" stroke="var(--soft-linen-200)" strokeWidth="60" fill="none" opacity="0.7" />
                  <path d="M40,300 Q260,200 480,240 T800,220" stroke="var(--white-mist-300)" strokeWidth="3" fill="none" />
                </svg>
                <div className={s.locMapPin}>{listing.street}</div>
              </div>
              <div className={s.distances}>
                {listing.distances.map((d) => (
                  <div key={d.label}>
                    <div className={s.distanceValue}>{d.value}</div>
                    <div className={s.distanceLabel}>{d.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky agent panel */}
          <aside className={s.aside}>
            <div className={s.agentCard}>
              <div className={s.agentHead}>
                <div className="overline">Your agent</div>
                <div className={s.agentRow}>
                  <span className={s.agentAvatar} aria-hidden>
                    {listing.agent.photo ? (
                      <Image
                        src={listing.agent.photo}
                        alt=""
                        fill
                        sizes="56px"
                        className={s.agentAvatarImg}
                      />
                    ) : null}
                  </span>
                  <div>
                    <div className={s.agentName}>{listing.agent.name}</div>
                    <div className={s.agentMeta}>
                      {listing.agent.role}
                      {listing.agent.patch ? ` · ${listing.agent.patch}` : ""}
                    </div>
                  </div>
                </div>
                <div className={s.agentBtns}>
                  <a href="tel:0754471000" className="btn btn-secondary btn-sm">
                    Call
                  </a>
                  <a href="mailto:hello@maxproperty.au" className="btn btn-secondary btn-sm">
                    Email
                  </a>
                </div>
              </div>
              <EnquiryForm street={listing.street} />
            </div>

            <div className={s.appraisalCard}>
              <span className={s.apIcon}>
                <IconPin size={16} />
              </span>
              <div className={s.apText}>
                Selling in {name}? Get an instant local appraisal.
                <Link href="/sell#appraisal" className={s.apLink}>
                  Start the conversation →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </Container>

      {/* Similar */}
      {similar.length > 0 && (
        <section className={s.similar}>
          <Container>
            <div className={s.similarHead}>
              <div>
                <div className="overline">Similar in {name}</div>
                <h2 className={s.similarTitle}>Three more worth a look.</h2>
              </div>
              <Link href={`/buy?suburb=${encodeURIComponent(name)}`} className="btn btn-tertiary">
                All {name} <IconArrowR />
              </Link>
            </div>
            <div className={s.similarGrid}>
              {similar.map((p) => (
                <PropertyCard key={p.id} p={p} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* CTA band */}
      <section className={s.cta}>
        <Container className={s.ctaInner}>
          <div>
            <div className="overline" style={{ color: "rgba(244,237,229,.5)" }}>
              Two homes down the street?
            </div>
            <h2 className={s.ctaHeading}>See what your home is worth in this market.</h2>
          </div>
          <Link href="/sell#appraisal" className="btn btn-primary btn-lg">
            Request an appraisal <IconArrowR />
          </Link>
        </Container>
      </section>
    </main>
  );
}
