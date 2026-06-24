import "server-only";
import { randomInt } from "node:crypto";

// Crockford-ish alphabet — no 0/O or 1/I/L so a barista can read the code back
// without misfires. ~32^6 ≈ 1B combinations; codes are display-only so no
// persistence or collision check is required.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function generateVoucherCode(length = 6): string {
  let out = "";
  for (let i = 0; i < length; i++) out += ALPHABET[randomInt(ALPHABET.length)];
  return out;
}
