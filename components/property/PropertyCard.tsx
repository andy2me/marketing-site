import Link from "next/link";
import Image from "next/image";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { SaveButton } from "./SaveButton";
import { IconBed, IconBath, IconCar, IconLand } from "@/components/icons";
import { STATUS_COLOR, type ListingCard } from "@/lib/rex/types";
import styles from "./PropertyCard.module.css";

export function PropertyCard({ p, saved = false }: { p: ListingCard; saved?: boolean }) {
  const sold = p.status === "Sold";

  return (
    <Link
      href={`/properties/${p.slug}`}
      className={styles.card}
      style={{ opacity: sold ? 0.78 : 1 }}
    >
      <div className={styles.media}>
        {p.image ? (
          <Image
            src={p.image}
            alt={p.street}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
            className={styles.img}
          />
        ) : (
          <ImageSlot ratio="3/2" className={styles.slot} />
        )}
        <span className={styles.status} style={{ background: STATUS_COLOR[p.status] }}>
          {p.status}
        </span>
        <SaveButton id={p.id} initial={saved} />
      </div>

      <div className={styles.body}>
        <div className={styles.price}>{p.price}</div>
        <div className={styles.street}>{p.street}</div>
        <div className={styles.suburb}>{p.suburb}</div>

        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <IconBed /> {p.beds}
          </span>
          <span className={styles.metaItem}>
            <IconBath /> {p.baths}
          </span>
          <span className={styles.metaItem}>
            <IconCar /> {p.cars}
          </span>
          <span className={styles.metaItem}>
            <IconLand /> {p.land}
          </span>
        </div>

        <div className={styles.agent}>
          <span className={styles.agentAvatar} aria-hidden />
          <span className={styles.agentName}>{p.agent.name}</span>
        </div>
      </div>
    </Link>
  );
}
