import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = { title: "Locations — Our Patches" };

export default function LocationsPage() {
  return (
    <PagePlaceholder
      title="Locations"
      current="Locations"
      note="Patches/suburbs overview with a real map (MapLibre, editorial styling) replacing the prototype schematic (§8). Built in the Marketing-pages stage."
    />
  );
}
