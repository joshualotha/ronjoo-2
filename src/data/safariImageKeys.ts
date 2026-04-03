/**
 * Resolves hero/accommodation image keys (e.g. "safari-migration") to bundled URLs,
 * same as the original ronjoo-safari-experience static data. Full URLs from the API pass through.
 */
import migrationImg from "@/assets/safari-migration.jpg";
import ngorongoroImg from "@/assets/safari-ngorongoro.jpg";
import elephantImg from "@/assets/safari-elephant.jpg";
import kilimanjaroImg from "@/assets/safari-kilimanjaro.jpg";
import zanzibarImg from "@/assets/safari-zanzibar.jpg";
import lionImg from "@/assets/safari-lion.jpg";
import campImg from "@/assets/safari-camp.jpg";
import heroImg from "@/assets/hero-savanna.jpg";

export const safariImageKeys: Record<string, string> = {
  "safari-migration": migrationImg,
  "safari-ngorongoro": ngorongoroImg,
  "safari-elephant": elephantImg,
  "safari-kilimanjaro": kilimanjaroImg,
  "safari-zanzibar": zanzibarImg,
  "safari-lion": lionImg,
  "safari-camp": campImg,
  "hero-savanna": heroImg,
};

export function resolveSafariImage(urlOrKey: string | null | undefined): string {
  if (!urlOrKey) return "";
  const t = urlOrKey.trim();
  if (/^https?:\/\//i.test(t) || t.startsWith("/") || t.startsWith("blob:")) return t;
  return safariImageKeys[t] ?? t;
}
