import type { CSSProperties, ReactElement } from "react";
import type { PropertyFact, PropertyFactIcon, Report } from "@/lib/report/types";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { IconBed, IconBath, IconCar, IconArea, IconPin } from "@/components/icons";
import s from "../report.module.css";

const FACT_ICON: Record<PropertyFactIcon, ReactElement> = {
  bed: <IconBed />,
  bath: <IconBath />,
  car: <IconCar />,
  area: <IconArea />,
};

// 01 · Welcome — prepared-for, hero (5/7 on desktop), address, overture, facts strip, features.
export function Welcome({ report }: { report: Report }) {
  const { property, vendor, ref, preparedOn, agent } = report;
  // Use the property's bespoke facts override if supplied; otherwise auto-derive from beds/
  // baths/cars and any present internal / outdoor measurements (skip cells we have no value for).
  const facts: PropertyFact[] = property.facts ?? [
    { icon: "bed", v: property.beds, l: "Bedrooms" },
    { icon: "bath", v: property.baths, l: "Bathrooms" },
    { icon: "car", v: property.cars, l: "Car spaces" },
    ...(property.internal ? [{ icon: "area" as const, v: property.internal, l: "Internal" }] : []),
    ...(property.outdoor ? [{ icon: "area" as const, v: property.outdoor, l: "Terrace" }] : []),
  ];
  // Drive grid column count from data so the strip never has trailing empty cells.
  const factsStyle = { "--fact-cols": facts.length } as CSSProperties;
  return (
    <>
      <div className={s.welcomeFor}>
        <div className="overline">An appraisal prepared for</div>
        <div className={s.welcomeForName}>{vendor.fullName}</div>
      </div>

      <div className={s.welcomeIntro}>
        {property.heroUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- plain <img> keeps this presentational; next/image would need remotePatterns config when hosts change.
          <img
            src={property.heroUrl}
            alt={`${property.street}, ${property.suburb}`}
            className={s.welcomeHero}
            style={{ aspectRatio: "4 / 5", width: "100%", height: "auto", objectFit: "cover", display: "block" }}
          />
        ) : (
          <ImageSlot
            label={`hero · ${property.street.toLowerCase()} · 4:5 portrait`}
            ratio="4/5"
            className={s.welcomeHero}
          />
        )}
        <div>
          <div className={`overline ${s.addrEyebrow}`}>
            <IconPin />
            <span>
              {property.suburb} · {property.state} {property.postcode}
            </span>
          </div>
          <h1 className={s.welcomeH1}>
            {property.street}
            <span className={s.dot}>.</span>
          </h1>
          <blockquote className={s.overture}>
            <span className={s.dot}>&ldquo;</span>
            {property.overture}
            <span className={s.dot}>&rdquo;</span>
          </blockquote>
          <p className={s.welcomeBlurb}>{property.blurb}</p>
        </div>
      </div>

      {/* Facts strip */}
      <div className={s.factsBlock}>
        <div className="overline">At a glance</div>
        <div className={s.factsGrid} style={factsStyle}>
          {facts.map((f, i) => (
            <div key={i} className={s.factCell}>
              <span className={s.factIcon}>{FACT_ICON[f.icon]}</span>
              <span className={`${s.num} ${s.factNum}`}>{f.v}</span>
              <span className={s.factLabel}>{f.l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Features + reference — mobile */}
      <div className={s.mOnly}>
        <div className={s.block}>
          <div className="overline">What stands out</div>
          <ul className={s.featureList}>
            {property.features.map((f, i) => (
              <li key={i} className={s.featureItem}>
                <span className={s.featureDash}>&mdash;</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className={s.refLine}>
          Prepared {preparedOn} · Ref {ref} · By {agent.name}
        </p>
      </div>

      {/* Features + reference — desktop (numbered 2-col + heading) */}
      <div className={s.dOnly}>
        <div className={s.dFeatures}>
          <div>
            <div className="overline">What stands out</div>
            <h3 className={s.dFeaturesH3}>Six things we&rsquo;d want a buyer to feel first.</h3>
          </div>
          <ul className={s.dFeatureList}>
            {property.features.map((f, i) => (
              <li key={i} className={s.dFeatureItem}>
                <span className={s.dFeatureNum}>{String(i + 1).padStart(2, "0")}</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={s.dRefRow}>
          <span>
            Prepared {preparedOn} · Ref {ref}
          </span>
          <span>By {agent.name}</span>
        </div>
      </div>
    </>
  );
}
