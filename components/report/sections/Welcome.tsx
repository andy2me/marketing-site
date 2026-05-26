import type { Report } from "@/lib/report/types";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { IconBed, IconBath, IconCar, IconArea, IconPin } from "@/components/icons";
import s from "../report.module.css";

// 01 · Welcome — prepared-for, hero (5/7 on desktop), address, overture, facts strip, features.
export function Welcome({ report }: { report: Report }) {
  const { property, vendor, ref, preparedOn, agent } = report;
  const facts = [
    { ic: <IconBed />, v: property.beds, l: "Bedrooms" },
    { ic: <IconBath />, v: property.baths, l: "Bathrooms" },
    { ic: <IconCar />, v: property.cars, l: "Car spaces" },
    { ic: <IconArea />, v: property.internal, l: "Internal" },
    { ic: <IconArea />, v: property.outdoor, l: "Terrace" },
  ];
  return (
    <>
      <div className={s.welcomeFor}>
        <div className="overline">An appraisal prepared for</div>
        <div className={s.welcomeForName}>{vendor.fullName}</div>
      </div>

      <div className={s.welcomeIntro}>
        <ImageSlot
          label={`hero · ${property.street.toLowerCase()} · river twilight · 4:5 portrait`}
          ratio="4/5"
          className={s.welcomeHero}
        />
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
        <div className={s.factsGrid}>
          {facts.map((f, i) => (
            <div key={i} className={s.factCell}>
              <span className={s.factIcon}>{f.ic}</span>
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
