import { resolveSafariImage } from "@/data/safariImageKeys";

/** Maps Laravel SafariResource JSON into the shape expected by SafariPackagePage (reference design). */
export function mapSafariApiToPackage(s: Record<string, unknown>) {
  const heroImages = ((s.heroImages as string[] | undefined) ?? []).map((u) => resolveSafariImage(u));
  const destinationsArr = (s.destinations as string[] | undefined) ?? [];
  const destinationsUpper = destinationsArr.join(" · ").toUpperCase();

  const days = (s.days as number | undefined) ?? parseInt(String(s.duration ?? "").match(/\d+/)?.[0] || "0", 10);
  const durStr = String(s.duration ?? "");
  const durationDisplay =
    durStr && /day/i.test(durStr) ? durStr.toUpperCase() : `${days || 8} DAYS`;

  const overviewProse = Array.isArray(s.overviewProse) && (s.overviewProse as string[]).length
    ? (s.overviewProse as string[])
    : s.description
      ? [String(s.description)]
      : [""];

  const itinerary = ((s.itinerary as Record<string, unknown>[]) ?? []).map((d) => {
    const mealsRaw = d.meals;
    let meals = "";
    if (Array.isArray(d.mealsJson) && (d.mealsJson as string[]).length) {
      meals = (d.mealsJson as string[]).join(", ");
    } else if (typeof mealsRaw === "string") {
      meals = mealsRaw.includes("/") ? mealsRaw.split("/").join(", ") : mealsRaw;
    }
    const activities = d.activities;
    const activitiesStr = Array.isArray(activities)
      ? (activities as string[]).join(", ")
      : String(activities ?? "");

    return {
      day: Number(d.day) || 0,
      title: String(d.title ?? ""),
      location: String(d.location ?? ""),
      meals,
      activities: activitiesStr,
      description: String(d.description ?? ""),
      driveTime: (d.driveTime ?? d.drive_time) as string | undefined,
      accommodation: String(d.accommodation ?? ""),
      accommodationTier: (d.accommodationTier ?? d.accommodation_tier) as string | undefined,
      activityTags: (d.activityTags ?? d.activity_tags ?? []) as string[],
    };
  });

  const accommodations = ((s.accommodations as Record<string, unknown>[]) ?? []).map((a) => ({
    name: String(a.name ?? ""),
    nights: String(a.nights ?? ""),
    tier: String(a.tier ?? ""),
    description: String(a.description ?? ""),
    amenities: (a.amenities as string[]) ?? [],
    image: resolveSafariImage(a.image as string | undefined),
  }));

  let pricing = (s.pricing as Record<string, unknown>[]) ?? [];
  if (!pricing.length && Array.isArray(s.priceTiers) && (s.priceTiers as unknown[]).length) {
    pricing = (s.priceTiers as Record<string, unknown>[]).map((tier, i) => ({
      groupSize: String(tier.label ?? tier.groupSize ?? `Tier ${i + 1}`),
      perPerson: tier.perPerson
        ? String(tier.perPerson)
        : `$${Number(tier.price ?? 0).toLocaleString()}`,
      total: tier.total
        ? String(tier.total)
        : `$${Number(tier.price ?? 0).toLocaleString()}`,
      savings: i > 0 ? "—" : "—",
      bestValue: Boolean(tier.bestValue) || i === 1,
    }));
  }

  const departures = ((s.departures as Record<string, unknown>[]) ?? []).map((d) => {
    const takenSeats = Number(d.takenSeats ?? d.seatsTaken ?? d.bookedSeats ?? 0);
    const price = d.pricePerPerson;
    const priceStr =
      typeof price === "number" && price > 0
        ? `$${price.toLocaleString()}`
        : String(price ?? "$0");
    return {
      dateRange: String(d.dateRange ?? ""),
      totalSeats: Number(d.totalSeats ?? 0),
      takenSeats,
      pricePerPerson: priceStr,
      soldOut: Boolean(d.soldOut),
    };
  });

  const reviews = ((s.reviews as Record<string, unknown>[]) ?? []).map((r) => ({
    name: String(r.guestName ?? r.name ?? ""),
    country: String(r.country ?? ""),
    countryFlag: String(r.countryFlag ?? "🌍"),
    text: String(r.fullText ?? r.text ?? r.excerpt ?? ""),
    date: String(r.safariDate ?? r.date ?? r.submittedDate ?? ""),
    safari: String(r.safariName ?? r.safari ?? ""),
  }));

  const wildlife = ((s.wildlife as Record<string, unknown>[]) ?? []).map((w) => ({
    name: String(w.name ?? ""),
    likelihood: String(w.likelihood ?? ""),
    fact: String(w.fact ?? ""),
    image: resolveSafariImage(w.image as string | undefined),
  }));

  const addOns = ((s.addOns ?? s.safariAddOns) as Record<string, unknown>[]) ?? [];

  return {
    slug: String(s.slug ?? ""),
    name: String(s.name ?? ""),
    typeBadge: String(s.typeBadge ?? s.type ?? ""),
    duration: durationDisplay,
    destinations: destinationsUpper,
    tagline: String(s.tagline ?? s.shortDescription ?? ""),
    priceFrom:
      String(s.priceFrom ?? "") ||
      (typeof s.price === "number" ? `$${(s.price as number).toLocaleString()}` : "$0"),
    groupSize: String(s.groupSize ?? ""),
    difficulty: String(s.difficulty ?? ""),
    bestSeason: String(s.bestSeason ?? ""),
    heroImages,
    overviewProse,
    highlights: (s.highlights as string[]) ?? [],
    itinerary,
    inclusions: (s.inclusions as string[]) ?? [],
    exclusions: (s.exclusions as string[]) ?? [],
    accommodations,
    pricing,
    addOns: addOns.map((a) => ({
      name: String(a.name ?? ""),
      description: String(a.description ?? ""),
      price: String(a.price ?? ""),
      icon: String(a.icon ?? ""),
    })),
    departures,
    wildlife,
    reviews,
    faqs: (s.faqs as { question: string; answer: string }[]) ?? [],
    relatedSlugs: (s.relatedSlugs as string[]) ?? [],
  };
}
