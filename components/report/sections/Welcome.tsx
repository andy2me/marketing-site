import type { Report } from "@/lib/report/types";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { IconBed, IconBath, IconCar, IconArea, IconPin } from "@/components/icons";
import s from "../report.module.css";

// 01 · Welcome — "An appraisal prepared for [vendor]", hero, address, overture, facts, features.
export function Welcome({ report }: { report: Report }) {
  const { property, vendor, ref, preparedOn, agent } = report;
  const facts = [
    { ic: <IconBed />, v: property.beds, l: "Bedrooms" },
    { ic: <IconBath />, v: property.baths, l: "Bathrooms" },
    { ic: <IconCar />, v: property.cars, l: "Car" },
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

        <div className={s.welcomeIntroText}>
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

          <p className={s.lede}>{property.blurb}</p>
        </div>
      </div>

      <div className={s.block}>
        <div className="overline">At a glance</div>
        <div className={s.factsGrid}>
          {facts.map((f, i) => (
            <div key={i} className={s.factCell}>
              <span className={s.factIcon}>{f.ic}</span>
              <span className={s.num} style={{ fontSize: 24 }}>
                {f.v}
              </span>
              <span className={s.factLabel}>{f.l}</span>
            </div>
          ))}
        </div>
      </div>

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
    </>
  );
}
