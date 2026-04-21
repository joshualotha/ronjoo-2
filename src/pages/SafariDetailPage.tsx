import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown, ChevronUp, Clock, MapPin, Users, Mountain, Sun } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getSafariBySlug } from "@/services/publicApi";
import { resolveSafariImage } from "@/data/safariImageKeys";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingElements from "@/components/FloatingElements";
import SEO from "@/components/seo/SEO";

function mealCodesForDay(day: any): string[] {
  if (Array.isArray(day.mealsJson) && day.mealsJson.length > 0) {
    return day.mealsJson
      .map((x: any) =>
        String(x)
          .trim()
          .toUpperCase()
          .replace(/^BREAKFAST$/i, "B")
          .replace(/^LUNCH$/i, "L")
          .replace(/^DINNER$/i, "D")
      )
      .filter((t): t is string => /^[BLD]$/.test(t));
  }
  const raw = String(day.meals ?? "");
  if (!raw.trim()) return [];
  if (raw.includes("/")) {
    return raw.split("/").map((m) => m.trim().toUpperCase());
  }
  return raw
    .toUpperCase()
    .split(/[,|]/)
    .map((x) =>
      x
        .trim()
        .replace(/^BREAKFAST$/i, "B")
        .replace(/^LUNCH$/i, "L")
        .replace(/^DINNER$/i, "D")
    )
    .map((x) => x.replace(/[^BLD]/g, "").charAt(0))
    .filter((c): c is string => c.length === 1 && "BLD".includes(c));
}

const SafariDetailPage = () => {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const identifier = id || slug || "";
  
  const { data: rawData, isLoading } = useQuery({
    queryKey: ["safari", identifier],
    queryFn: () => getSafariBySlug(identifier),
    enabled: !!identifier,
  });

  const safari = useMemo(() => {
    if (!rawData) return null;
    const s = rawData as any;
    
    // Safely extract primitive fields from possible alternative keys in API
    const basePrice = s.price || (s.pricing && s.pricing[0] && s.pricing[0].price) || 0;
    
    return {
      ...s,
      name: s.name || "Overview",
      description: s.description || s.overview || s.tagline || "",
      duration: s.duration || "N/A",
      destinations: Array.isArray(s.destinations) ? s.destinations : [],
      groupSize: s.groupSize || "Max 6 guests",
      difficulty: s.difficulty || "Easy",
      bestSeason: s.bestSeason || "Year-round",
      heroImages: Array.isArray(s.heroImages) ? s.heroImages : [],
      price: (typeof basePrice === "string" ? parseInt(basePrice.replace(/[^0-9]/g, "")) : basePrice) || 0,
      priceTiers: Array.isArray(s.priceTiers) ? s.priceTiers : [],
      highlights: Array.isArray(s.highlights) ? s.highlights : (s.inclusions || []),
      itinerary: Array.isArray(s.itineraryDays) ? s.itineraryDays : (s.itinerary || []),
      departures: Array.isArray(s.departures) ? s.departures : [],
      accommodations: Array.isArray(s.accommodations) ? s.accommodations : [],
    };
  }, [rawData]);

  const [currentImage, setCurrentImage] = useState(0);
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [showSticky, setShowSticky] = useState(false);
  const [travelersCount, setTravelersCount] = useState(2);

  // Tier-matching: parse admin labels like "1 person", "2 persons", "3-4 persons"
  const getTierPrice = (count: number): number => {
    if (!safari?.priceTiers || safari.priceTiers.length === 0) return safari?.price || 0;
    const tiers = safari.priceTiers as { label: string; price: number }[];
    // Build ranges: parse "3-4 persons" → { min: 3, max: 4, price }
    const parsed = tiers.map((t) => {
      const nums = t.label.match(/\d+/g);
      if (!nums) return { min: 1, max: 99, price: t.price };
      const min = parseInt(nums[0]);
      const max = nums.length > 1 ? parseInt(nums[1]) : min;
      return { min, max, price: t.price };
    });
    // Find matching tier
    const match = parsed.find((p) => count >= p.min && count <= p.max);
    if (match) return match.price;
    // If count exceeds all ranges, use the last (cheapest) tier
    return parsed[parsed.length - 1]?.price || safari.price || 0;
  };

  const soloPrice = getTierPrice(1);
  const perPerson = getTierPrice(travelersCount);
  const totalPrice = perPerson * travelersCount;
  const savings = soloPrice - perPerson;

  const heroUrls = useMemo(
    () => (safari?.heroImages ?? []).map((u: string) => resolveSafariImage(u)),
    [safari]
  );
  
  const safariDepartures = useMemo(() => {
    if (!safari?.departures) return [];
    return safari.departures.filter((d: any) => !d.soldOut);
  }, [safari]);

  useEffect(() => {
    const handleScroll = () => setShowSticky(window.scrollY > window.innerHeight * 0.8);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-advance hero slideshow
  useEffect(() => {
    if (!safari || heroUrls.length === 0) return;
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroUrls.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [safari, heroUrls.length]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warm-canvas">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-8 h-8 border-2 border-terracotta border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!safari) {
    return (
      <div className="min-h-screen bg-warm-canvas flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <h1 className="heading-display text-warm-charcoal text-[48px]">Safari Not Found</h1>
          <Link to="/safaris" className="font-sub text-terracotta mt-4 inline-block">
            ← Back to Safaris
          </Link>
        </div>
      </div>
    );
  }

  const quickStats = [
    { icon: Clock, label: "Duration", value: safari.duration },
    { icon: MapPin, label: "Parks", value: (safari.destinations ?? []).join(", ") },
    { icon: Users, label: "Group Size", value: safari.groupSize },
    { icon: Mountain, label: "Difficulty", value: safari.difficulty },
    { icon: Sun, label: "Best Season", value: safari.bestSeason },
  ];

  const schemaData = JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "Tour",
      "name": safari.name,
      "description": safari.description,
      "image": heroUrls,
      "tourProvider": {
        "@type": "Organization",
        "name": "Ronjoo Safaris",
        "url": "https://ronjoosafaris.com"
      },
      "offers": {
        "@type": "Offer",
        "price": safari.price,
        "priceCurrency": "USD"
      },
      "itinerary": (safari.itinerary || []).map((day: any) => ({
        "@type": "Itinerary",
        "name": day.title,
        "description": day.description
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://ronjoosafaris.com/" },
        { "@type": "ListItem", "position": 2, "name": "Safaris", "item": "https://ronjoosafaris.com/safaris" },
        { "@type": "ListItem", "position": 3, "name": safari.name, "item": `https://ronjoosafaris.com/safaris/${slug || identifier}` }
      ]
    }
  ]);

  return (
    <div className="min-h-screen bg-warm-canvas">
      <SEO 
        title={`${safari.name} — Luxury Tanzania Safari | Ronjoo Safaris`}
        description={safari.description}
        image={heroUrls[0]}
        url={`https://ronjoosafaris.com/safaris/${slug || identifier}`}
        canonicalUrl={`https://ronjoosafaris.com/safaris/${slug || identifier}`}
        type="product"
        schema={schemaData}
      />
      <Navbar />

      {/* Hero with image slider */}
      <section className="relative h-screen overflow-hidden">
        <AnimatePresence>
          {heroUrls.map((url, i) => (
            <motion.div
              key={url}
              initial={{ opacity: 0 }}
              animate={{ opacity: i === currentImage ? 1 : 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${url})` }}
            />
          ))}
        </AnimatePresence>
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.35))" }} />

        <div className="relative z-10 h-full flex flex-col justify-end pb-0">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full pb-24">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="label-accent text-gold text-[12px] mb-4"
            >
              {(safari.destinations ?? []).join(" · ")}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9 }}
              className="heading-display text-white text-[48px] md:text-[80px] leading-[1.05]"
            >
              {safari.name}
            </motion.h1>
          </div>

          {/* Quick stats bar */}
          <div className="bg-deep-earth/80 backdrop-blur-md border-t border-gold/10">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-5 flex flex-wrap gap-6 md:gap-0 md:justify-between">
              {quickStats.map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-6">
                  {i > 0 && <div className="hidden md:block w-px h-10 bg-gold/15" />}
                  <div className="flex items-center gap-3">
                    <stat.icon size={16} strokeWidth={1} className="text-gold/60" />
                    <div>
                      <p className="label-accent text-warm-charcoal/40 text-[9px]">{stat.label}</p>
                      <p className="font-sub font-light text-warm-charcoal text-[13px]">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Image dots */}
        <div className="absolute bottom-28 right-12 z-20 flex gap-2">
          {heroUrls.map((_: any, i: number) => (
            <button
              key={i}
              onClick={() => setCurrentImage(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === currentImage ? "bg-terracotta w-6" : "bg-warm-charcoal/40"}`}
            />
          ))}
        </div>
      </section>

      {/* Content + Sidebar */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-16">
          {/* Main content */}
          <div>
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <p className="body-text text-warm-charcoal/80 text-[17px] leading-[1.85] max-w-2xl">
                {safari.description}
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                {(safari.highlights ?? []).map((h: string) => (
                  <span key={h} className="label-accent text-[10px] border border-faded-sand text-warm-charcoal/60 px-3 py-1.5">
                    {h}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Day-by-Day Itinerary */}
            <div className="mb-16">
              <h2 className="heading-display text-warm-charcoal text-[36px] md:text-[48px] mb-8">
                Day-by-Day Itinerary
              </h2>
              <div className="gold-rule mb-12 !mx-0" />

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-px bg-terracotta/20" />

                {(safari.itinerary ?? []).map((day: any) => (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative pl-12 mb-6"
                  >
                    {/* Day marker */}
                    <div className="absolute left-0 top-2 w-8 h-8 border border-terracotta/40 flex items-center justify-center bg-warm-canvas">
                      <span className="font-display text-terracotta text-[14px]">{day.day}</span>
                    </div>

                    <button
                      onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                      className="w-full text-left py-3 flex items-center justify-between group"
                    >
                      <div>
                        <p className="label-accent text-terracotta/60 text-[10px] mb-1">Day {day.day}</p>
                        <h3 className="font-display italic text-warm-charcoal text-[22px] group-hover:text-terracotta transition-colors">
                          {day.title}
                        </h3>
                      </div>
                      {expandedDay === day.day ? (
                        <ChevronUp size={18} className="text-warm-charcoal/30" strokeWidth={1} />
                      ) : (
                        <ChevronDown size={18} className="text-warm-charcoal/30" strokeWidth={1} />
                      )}
                    </button>

                    <AnimatePresence>
                      {expandedDay === day.day && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="body-text text-warm-charcoal/60 text-[15px] leading-relaxed mb-3">
                            {day.description}
                          </p>
                          {Array.isArray(day.activities) && day.activities.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {day.activities.map((activity: string) => (
                                <span key={activity} className="label-accent text-[9px] bg-terracotta/10 text-terracotta px-2.5 py-1 tracking-widest">
                                  {activity}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="flex gap-4 items-center">
                            <div className="flex gap-1">
                              {mealCodesForDay(day).map((meal, index) => (
                                <span key={`${meal}-${index}`} className="label-accent text-[9px] bg-dust-ivory text-warm-charcoal/50 px-2 py-0.5">
                                  {meal === "B" ? "Breakfast" : meal === "L" ? "Lunch" : "Dinner"}
                                </span>
                              ))}
                            </div>
                            {day.accommodation && (
                              <span className="font-body text-warm-charcoal/40 text-[13px]">
                                📍 {day.accommodation}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Group departures for this safari */}
            {safariDepartures.length > 0 && (
              <div className="mb-16">
                <h2 className="heading-display text-warm-charcoal text-[36px] md:text-[48px] mb-8">
                  Join This Safari
                </h2>
                <div className="gold-rule mb-8 !mx-0" />

                {safariDepartures.length > 0 && (safariDepartures[0].seatsTaken > 0) && (
                  <div className="flex items-center gap-3 mb-6 p-4 bg-dust-ivory/50">
                    <div className="flex -space-x-2">
                      {(safariDepartures[0].nationalities || []).map((flag: string, i: number) => (
                        <span key={i} className="text-[20px]">{flag}</span>
                      ))}
                    </div>
                    <p className="font-body font-light text-warm-charcoal/60 text-[14px]">
                      {safariDepartures[0].seatsTaken} travelers have already joined the next departure
                    </p>
                  </div>
                )}

                {safariDepartures.map((dep: any) => (
                  <div key={dep.id} className="flex flex-col md:flex-row md:items-center justify-between py-4 border-b border-faded-sand/40 gap-3">
                    <div>
                      <p className="font-sub font-light text-warm-charcoal/70 text-[14px]">{dep.dateRange}</p>
                      <div className="flex gap-1 mt-2">
                        {Array.from({ length: dep.totalSeats }).map((_, i) => (
                          <div key={i} className={`w-2.5 h-2.5 rounded-full ${i < dep.seatsTaken ? "bg-terracotta" : "bg-faded-sand/40"}`} />
                        ))}
                      </div>
                      <p className="font-body text-warm-charcoal/40 text-[12px] mt-1">
                        {dep.totalSeats - dep.seatsTaken} seats remaining
                      </p>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="font-display text-warm-charcoal text-[22px]">
                        ${dep.pricePerPerson.toLocaleString()}<span className="font-sub font-light text-[12px] text-warm-charcoal/40 ml-1">/pp</span>
                      </span>
                      <Link to="/departures" className="btn-safari-primary text-[11px] px-5 py-2.5 inline-flex items-center gap-2">
                        Join Safari <ArrowRight size={14} strokeWidth={1.5} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Accommodations */}
            {safari.accommodations && safari.accommodations.length > 0 && (
              <div>
                <h2 className="heading-display text-warm-charcoal text-[36px] md:text-[48px] mb-8">
                  Where You'll Stay
                </h2>
                <div className="gold-rule mb-12 !mx-0" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {safari.accommodations.map((acc: any) => (
                    <motion.div
                      key={acc.name}
                      initial={{ opacity: 0, scale: 1.04 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      className="group overflow-hidden"
                    >
                      <div
                        className="h-48 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url(${resolveSafariImage(acc.image)})` }}
                      />
                      <div className="p-5 bg-dust-ivory/40">
                        <h4 className="font-display italic text-warm-charcoal text-[20px]">{acc.name}</h4>
                        <div className="flex gap-1 mt-2">
                          {Array.from({ length: acc.rating || 0 }).map((_, i) => (
                            <div key={i} className="w-1.5 h-1.5 rounded-full bg-terracotta" />
                          ))}
                        </div>
                        {acc.website && (
                          <a
                            href={acc.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-3 font-sub text-[13px] text-terracotta hover:underline transition-colors"
                          >
                            Visit Website →
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Sidebar */}
          <div className="hidden lg:block">
            <div className={`${showSticky ? "sticky top-24" : ""} transition-all`}>
              <div className="bg-dust-ivory/60 p-8 border border-faded-sand/40">

                {/* Traveler stepper */}
                <p className="label-accent text-warm-charcoal/40 text-[10px] mb-3">Travelers</p>
                <div className="flex items-center gap-3 mb-4">
                  <button
                    onClick={() => setTravelersCount((c) => Math.max(1, c - 1))}
                    className="w-8 h-8 border border-faded-sand/60 flex items-center justify-center text-warm-charcoal/50 hover:border-terracotta hover:text-terracotta transition-colors text-[16px]"
                  >
                    −
                  </button>
                  <div className="flex items-center gap-1.5 flex-1 justify-center">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          i < travelersCount ? 'bg-terracotta scale-110' : 'bg-faded-sand/40'
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setTravelersCount((c) => Math.min(6, c + 1))}
                    className="w-8 h-8 border border-faded-sand/60 flex items-center justify-center text-warm-charcoal/50 hover:border-terracotta hover:text-terracotta transition-colors text-[16px]"
                  >
                    +
                  </button>
                </div>
                <p className="font-display italic text-warm-charcoal text-[16px] text-center mb-6">
                  {travelersCount} {travelersCount === 1 ? 'Traveler' : 'Travelers'}
                </p>

                <div className="h-px bg-faded-sand/60 mb-6" />

                {/* Per person price */}
                <p className="label-accent text-warm-charcoal/40 text-[10px] mb-1">Per Person</p>
                <p className="font-display text-warm-charcoal text-[38px] leading-none">
                  ${perPerson.toLocaleString()}
                </p>

                {/* Group total */}
                <div className="flex justify-between items-baseline mt-3 mb-2">
                  <span className="font-body text-warm-charcoal/40 text-[13px]">Group Total</span>
                  <span className="font-display text-warm-charcoal text-[20px]">${totalPrice.toLocaleString()}</span>
                </div>

                {/* Savings */}
                {travelersCount > 1 && savings > 0 && (
                  <p className="font-sub text-[11px] text-terracotta mb-4">
                    ↓ Save ${savings.toLocaleString()}/pp vs solo
                  </p>
                )}

                <div className="h-px bg-faded-sand/60 my-5" />

                {/* Quick stats */}
                <div className="space-y-2.5 mb-6">
                  {quickStats.slice(0, 3).map((stat) => (
                    <div key={stat.label} className="flex justify-between">
                      <span className="font-body text-warm-charcoal/40 text-[13px]">{stat.label}</span>
                      <span className="font-sub font-light text-warm-charcoal text-[13px]">{stat.value}</span>
                    </div>
                  ))}
                </div>

                <Link to={`/book/${safari.slug}?travelers=${travelersCount}`} className="btn-safari-primary w-full text-center block text-[12px] mb-3">
                  Book This Safari
                </Link>
                <Link to={`/plan?safari=${safari.slug}&travelers=${travelersCount}`} className="btn-safari-terracotta-outline w-full text-center block text-[12px]">
                  Request Custom Quote
                </Link>

                <p className="font-body text-warm-charcoal/30 text-[11px] text-center mt-5 leading-relaxed">
                  We respond within 4 hours<br />No obligation · Free consultation
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Mobile CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-deep-earth/95 backdrop-blur-md p-4 flex items-center justify-between border-t border-gold/10">
        <div>
          <p className="font-display text-warm-canvas text-[24px]">${perPerson.toLocaleString()}</p>
          <p className="font-sub font-light text-warm-canvas/50 text-[11px]">per person · {travelersCount} travelers</p>
        </div>
        <Link to={`/book/${safari.slug}?travelers=${travelersCount}`} className="btn-safari-primary text-[11px] px-6 py-3">
          Book Safari
        </Link>
      </div>

      <Footer />
      <FloatingElements />
    </div>
  );
};

export default SafariDetailPage;
