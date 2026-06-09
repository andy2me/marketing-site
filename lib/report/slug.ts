/** Address → stable URL slug (e.g. "17/140 Noosa Parade" + "Noosaville" → "17-140-noosa-parade-noosaville"). */
export function addressToSlug(street: string, suburb: string): string {
  const raw = `${street} ${suburb}`.toLowerCase();
  return raw
    .replace(/\//g, "-")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
