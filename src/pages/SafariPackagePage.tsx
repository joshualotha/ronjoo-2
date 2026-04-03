import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown, ChevronUp, Check, X, Star, MessageCircle, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getSafariBySlug, getSafaris } from "@/services/publicApi";
import { mapSafariApiToPackage } from "@/lib/mapSafariApiToPackage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import KilimanjaroElevation from "@/components/KilimanjaroElevation";

const SafariPackagePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: raw, isLoading } = useQuery({
    queryKey: ["safariPackage", slug],
    queryFn: () => getSafariBySlug(slug || ""),
    enabled: !!slug,
  });
  const { data: allRaw = [] } = useQuery({
    queryKey: ["safaris"],
    queryFn: getSafaris,
  });

  const safari = useMemo(
    () => (raw ? mapSafariApiToPackage(raw as Record<string, unknown>) : null),
    [raw]
  );

  const related = useMemo(() => {
    if (!safari?.relatedSlugs?.length) return [];
    return safari.relatedSlugs
      .map((rs) => allRaw.find((x: { slug?: string }) => x.slug === rs))
      .filter(Boolean)
      .map((x) => mapSafariApiToPackage(x as Record<string, unknown>));
  }, [safari, allRaw]);

  const [heroIdx, setHeroIdx] = useState(0);
  const [expandedDays, setExpandedDays] = useState<number[]>([1]);
  const [allExpanded, setAllExpanded] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const heroRef = useRef<HTMLElement>(null);

  // Hero carousel
  useEffect(() => {
    if (!safari?.heroImages?.length) return;
    const timer = setInterval(() => setHeroIdx((p) => (p + 1) % safari.heroImages.length), 5000);
    return () => clearInterval(timer);
  }, [safari]);

  // Sticky bar
  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > window.innerHeight - 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-8 h-8 border-2 border-terracotta border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!safari) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Navbar /><p className="font-sub text-warm-charcoal text-lg">Safari not found.</p></div>;
  }

  const titleWords = safari.name.split(" ");

  const toggleDay = (day: number) => {
    setExpandedDays((p) => p.includes(day) ? p.filter((d) => d !== day) : [...p, day]);
  };
  const toggleAll = () => {
    if (allExpanded) { setExpandedDays([1]); setAllExpanded(false); }
    else { setExpandedDays(safari.itinerary.map((d) => d.day)); setAllExpanded(true); }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── SECTION 1: HERO ── */}
      <section ref={heroRef} className="relative h-screen min-h-[600px] flex items-end overflow-hidden">
        {safari.heroImages.map((img, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${img})` }}
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: heroIdx === i ? 1 : 0, scale: heroIdx === i ? 1.06 : 1 }}
            transition={{ opacity: { duration: 1.2 }, scale: { duration: 10 } }}
          />
        ))}
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(0,0,0,0.13) 0%, rgba(0,0,0,0.28) 50%, rgba(0,0,0,0.44) 100%)" }} />

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-20 pb-16">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-2 mb-4">
            <span className="font-sub font-light text-[11px] text-gold tracking-[0.3em] uppercase">{safari.typeBadge.split(" · ")[0]}</span>
            {safari.typeBadge.includes("·") && <><span className="w-1 h-1 rounded-full bg-terracotta" /><span className="font-sub font-light text-[11px] text-gold tracking-[0.3em] uppercase">{safari.typeBadge.split(" · ")[1]}</span></>}
            <span className="w-1 h-1 rounded-full bg-terracotta" />
            <span className="font-sub font-light text-[11px] text-gold tracking-[0.3em] uppercase">{safari.duration}</span>
            <span className="w-1 h-1 rounded-full bg-terracotta" />
            <span className="font-sub font-light text-[11px] text-gold tracking-[0.3em] uppercase">{safari.destinations}</span>
          </motion.div>

          <h1 className="heading-display text-warm-canvas text-[54px] md:text-[96px] leading-[1.02]">
            {titleWords.map((word, i) => (
              <motion.span key={i} initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.09, duration: 0.5 }} className="inline-block mr-[0.3em]">{word}</motion.span>
            ))}
          </h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="font-sub font-light text-[19px] text-warm-canvas/72 max-w-[500px] mt-4">{safari.tagline}</motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }} className="flex flex-wrap items-center gap-4 mt-8">
            <div className="flex items-baseline gap-2">
              <span className="font-sub font-light text-[12px] text-warm-canvas/55 uppercase tracking-wider">From</span>
              <span className="heading-display text-gold text-[42px]">{safari.priceFrom}</span>
              <span className="font-sub font-light text-[12px] text-warm-canvas/55 uppercase tracking-wider">per person</span>
            </div>
            <div className="flex gap-3 ml-4">
              <a href="#departures" className="btn-safari bg-terracotta text-warm-canvas text-[13px] hover:bg-[#A0502E] transition-colors inline-flex items-center gap-2">
                Book This Safari <ArrowRight size={14} />
              </a>
              <a href="#departures" className="btn-safari border border-warm-canvas/40 text-warm-canvas text-[13px] hover:bg-warm-canvas/[0.12] transition-colors">
                Request Custom Dates
              </a>
            </div>
          </motion.div>

          {/* Image counter */}
          <div className="absolute bottom-6 left-6 lg:left-20 font-sub font-light text-[11px] text-warm-canvas/50">
            {String(heroIdx + 1).padStart(2, "0")} / {String(safari.heroImages.length).padStart(2, "0")}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-[1px] h-8 bg-warm-canvas/30 scroll-indicator" />
          <span className="font-sub font-light text-[9px] text-warm-canvas/40 uppercase tracking-[0.3em]">Scroll to Explore</span>
        </div>
      </section>

      {/* ── SECTION 2: STICKY FACTS BAR ── */}
      <div className={`${isSticky ? "fixed top-20 z-40" : "relative"} w-full bg-deep-earth h-16 transition-all duration-300`}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-full flex items-center justify-between overflow-x-auto">
          <div className="flex items-center gap-0 shrink-0">
            {[
              { label: "Duration", value: safari.duration },
              { label: "Destinations", value: safari.destinations.replace(/ · /g, ", ") },
              { label: "Group Size", value: safari.groupSize },
              { label: "Difficulty", value: safari.difficulty },
              { label: "Best Season", value: safari.bestSeason },
              { label: "Price From", value: safari.priceFrom },
            ].map((fact, i) => (
              <div key={i} className={`flex flex-col px-5 ${i > 0 ? "border-l border-gold/20" : ""}`}>
                <span className="font-sub font-light text-[10px] text-gold uppercase tracking-[0.2em] whitespace-nowrap">{fact.label}</span>
                <span className="font-sub font-normal text-[14px] text-warm-charcoal whitespace-nowrap">{fact.value}</span>
              </div>
            ))}
          </div>
          {isSticky && (
            <motion.a initial={{ opacity: 0 }} animate={{ opacity: 1 }} href="#departures" className="shrink-0 ml-4 bg-terracotta text-warm-charcoal font-sub font-light text-[12px] uppercase tracking-[0.15em] px-7 py-2.5 hover:bg-[#A0502E] transition-colors">
              Book Now
            </motion.a>
          )}
        </div>
      </div>

      {/* ── SECTION 3: OVERVIEW ── */}
      <section className="bg-warm-canvas noise-overlay relative py-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-[58%_42%] gap-12">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <span className="label-accent text-gold/80 text-[10px] tracking-[0.25em]">THE EXPERIENCE</span>
            <h2 className="heading-display text-deep-earth text-[42px] md:text-[52px] mt-2">What Awaits You</h2>
            <div className="w-24 h-[1px] bg-gold/40 mt-4 mb-8" />
            {safari.overviewProse.map((para, i) => (
              <p key={i} className="body-text text-warm-charcoal leading-[1.9] mb-5 max-w-[680px]">
                {i === 0 ? <><span className="font-display text-[72px] float-left leading-[0.8] mr-3 mt-1 text-terracotta">{para[0]}</span>{para.slice(1)}</> : para}
              </p>
            ))}
            <h3 className="font-sub font-normal text-[14px] text-deep-earth uppercase tracking-[0.15em] mt-10 mb-4">Safari Highlights</h3>
            {safari.highlights.map((h, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex gap-3 items-start mb-3">
                <ArrowRight size={14} className="text-terracotta mt-1 shrink-0" />
                <span className="body-text text-warm-charcoal text-[15px]">{h}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="relative">
              <div className="absolute -bottom-2 -right-2 w-full h-full border-2 border-terracotta" />
              <img src={safari.heroImages[0]} alt={safari.name} className="relative z-10 w-full h-[400px] object-cover" />
            </div>
            <div className="bg-deep-earth p-6 mt-8">
              <span className="font-sub font-light text-[11px] text-gold uppercase tracking-[0.2em]">What's Included</span>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {safari.inclusions.slice(0, 8).map((inc, i) => (
                  <div key={i} className="flex items-start gap-2"><Check size={12} className="text-warm-charcoal mt-1 shrink-0" /><span className="font-sub font-light text-[13px] text-warm-charcoal">{inc}</span></div>
                ))}
              </div>
              <div className="w-full h-[1px] bg-gold/20 mt-4 pt-0" />
              <a href="#inclusions" className="font-sub font-light text-[12px] text-terracotta mt-3 block hover:underline">Full inclusions & exclusions ↓</a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 4: ITINERARY ── */}
      <section className="bg-deep-earth py-20 noise-overlay relative">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <span className="label-accent text-gold/80 text-[11px]">ITINERARY</span>
          <h2 className="heading-display text-warm-charcoal text-[46px] md:text-[56px] mt-2">Day by Day</h2>
          <p className="font-sub font-light text-[15px] text-warm-charcoal/65 mt-2">{safari.duration.toLowerCase()} across {safari.destinations.toLowerCase().replace(/ · /g, " and ")}.</p>
          <button onClick={toggleAll} className="font-sub font-light text-[13px] text-terracotta mt-6 hover:underline">{allExpanded ? "Collapse All" : "Expand All Days"}</button>

          <div className="mt-8 space-y-3">
            {safari.itinerary.map((day) => {
              const isOpen = expandedDays.includes(day.day);
              return (
                <div key={day.day} className={`border transition-colors ${isOpen ? "border-terracotta/40 bg-warm-canvas/[0.07]" : "border-gold/15 bg-warm-canvas/[0.04] hover:border-gold/30"}`}>
                  <button onClick={() => toggleDay(day.day)} className="w-full flex items-center justify-between px-6 py-5 text-left">
                    <div className="flex items-center gap-6">
                      <span className={`heading-display text-[28px] transition-colors ${isOpen ? "text-terracotta" : "text-gold"}`}>DAY {String(day.day).padStart(2, "0")}</span>
                      <div>
                        <span className="heading-display text-warm-charcoal text-[20px] md:text-[22px]">{day.title}</span>
                        <span className="block font-sub font-light text-[12px] text-warm-charcoal/50 mt-0.5">{day.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="hidden md:flex gap-1.5">
                        {day.meals.split(", ").map((m) => (
                          <span key={m} className="border border-terracotta/50 text-terracotta font-sub font-light text-[10px] px-2 py-0.5 uppercase">{m.trim()}</span>
                        ))}
                      </div>
                      <ChevronDown size={16} className={`text-warm-canvas/40 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden border-l-[3px] border-terracotta mx-6 mb-6">
                        <div className="pl-6 grid grid-cols-1 lg:grid-cols-[65%_35%] gap-6">
                          <div>
                            <p className="body-text text-warm-charcoal/80 text-[15px] leading-[1.85]">{day.description}</p>
                            {day.driveTime && <p className="font-sub font-light text-[12px] text-warm-canvas/45 italic mt-3">{day.driveTime}</p>}
                            {day.activityTags && (
                              <div className="flex flex-wrap gap-2 mt-4">
                                {day.activityTags.map((tag) => (
                                  <span key={tag} className="border border-terracotta/40 text-warm-charcoal font-sub font-light text-[11px] uppercase tracking-[0.1em] px-3 py-1">{tag}</span>
                                ))}
                              </div>
                            )}
                          </div>
                          {day.accommodation && (
                            <div className="bg-warm-canvas/[0.05] p-4">
                              <span className="heading-display text-warm-charcoal text-[18px]">{day.accommodation}</span>
                              {day.accommodationTier && <span className="block label-accent text-gold/60 text-[10px] mt-1">{day.accommodationTier}</span>}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 6: INCLUSIONS ── */}
      <section id="inclusions" className="bg-deep-earth py-20 border-t border-gold/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <h2 className="heading-display text-warm-charcoal text-[46px] md:text-[56px]">What's Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
            <div>
              <div className="flex items-center gap-2 mb-6"><Check size={14} className="text-sage" /><span className="font-sub font-light text-[11px] text-sage uppercase tracking-[0.2em]">INCLUDED</span></div>
              {safari.inclusions.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="flex items-start gap-3 py-2 border-b border-gold/10">
                  <Check size={12} className="text-sage mt-1 shrink-0" /><span className="font-sub font-light text-[14px] text-warm-charcoal">{item}</span>
                </motion.div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-6"><X size={14} className="text-warm-charcoal/40" /><span className="font-sub font-light text-[11px] text-warm-charcoal/40 uppercase tracking-[0.2em]">NOT INCLUDED</span></div>
              {safari.exclusions.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="flex items-start gap-3 py-2 border-b border-gold/10">
                  <X size={12} className="text-warm-charcoal/40 mt-1 shrink-0" /><span className="font-sub font-light text-[14px] text-warm-charcoal/50">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="mt-10 bg-gold/[0.08] border-l-[3px] border-gold p-5">
            <p className="font-sub font-light text-[14px] text-warm-charcoal/75">All Ronjoo safaris include a dedicated private guide, unlimited game drives, and 24/7 in-country support. We never mix your group with other travel companies.</p>
          </div>
        </div>
      </section>

      {/* ── SECTION 7: ACCOMMODATION ── */}
      <section className="bg-warm-canvas noise-overlay relative py-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <span className="label-accent text-gold/80 text-[11px]">WHERE YOU'LL STAY</span>
          <h2 className="heading-display text-deep-earth text-[46px] md:text-[56px] mt-2">Your Accommodations</h2>
          <p className="font-sub font-light text-[15px] text-warm-charcoal mt-2">We partner only with properties that reflect the character of their surroundings.</p>
          <div className="mt-12 space-y-6">
            {safari.accommodations.map((lodge, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="grid grid-cols-1 md:grid-cols-[40%_60%] overflow-hidden group">
                <div className="relative h-[280px] overflow-hidden">
                  <img src={lodge.image} alt={lodge.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                  <span className="absolute bottom-3 left-3 label-accent text-gold bg-deep-earth px-3 py-1 text-[10px]">{lodge.tier}</span>
                </div>
                <div className="bg-dust-ivory p-8 border-l-0 md:border-l-[3px] border-transparent group-hover:border-terracotta transition-colors relative">
                  <span className="font-sub font-light text-[11px] text-terracotta uppercase tracking-[0.15em]">{lodge.nights}</span>
                  <h3 className="heading-display text-deep-earth text-[24px] md:text-[28px] mt-1">{lodge.name}</h3>
                  <p className="body-text text-warm-charcoal text-[14px] mt-2">{lodge.description}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {lodge.amenities.map((a) => <span key={a} className="border border-faded-sand font-sub font-light text-[10px] text-warm-charcoal uppercase tracking-[0.1em] px-3 py-1">{a}</span>)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 8: PRICING ── */}
      <section className="bg-deep-earth py-20 noise-overlay relative">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <span className="label-accent text-gold/80 text-[11px]">INVESTMENT</span>
          <h2 className="heading-display text-warm-charcoal text-[46px] md:text-[56px] mt-2">Safari Pricing</h2>
          <p className="font-sub font-light text-[14px] text-warm-charcoal/60 mt-2">All prices in USD per person. Minimum 2 travelers for private departures.</p>
          <div className="mt-10 overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-gold/[0.12]">
                {["Group Size", "Per Person", "Total Cost", "Savings"].map((h) => <th key={h} className="font-sub font-light text-[11px] text-gold uppercase tracking-[0.15em] px-5 py-3 text-left">{h}</th>)}
              </tr></thead>
              <tbody>
                {safari.pricing.map((row, i) => (
                  <tr key={i} className={`${i % 2 ? "bg-warm-canvas/[0.03]" : ""} ${row.bestValue ? "border-l-[3px] border-terracotta" : ""} border-b border-warm-canvas/[0.08]`}>
                    <td className="font-sub font-light text-[14px] text-warm-charcoal px-5 py-4 relative">
                      {row.groupSize}
                      {row.bestValue && <span className="absolute top-1 right-2 label-accent text-terracotta text-[9px]">BEST VALUE</span>}
                    </td>
                    <td className="heading-display text-gold text-[20px] px-5 py-4">{row.perPerson}</td>
                    <td className="font-sub font-light text-[14px] text-warm-charcoal/70 px-5 py-4">{row.total}</td>
                    <td className="font-sub font-light text-[13px] text-terracotta px-5 py-4">{row.savings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {safari.addOns.length > 0 && (
            <div className="mt-12">
              <h3 className="heading-display text-warm-charcoal text-[30px] md:text-[36px]">Enhance Your Safari</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {safari.addOns.map((addon, i) => (
                  <div key={i} className="border border-gold/20 bg-warm-canvas/[0.05] p-5 hover:border-gold transition-colors">
                    <h4 className="heading-display text-warm-charcoal text-[20px]">{addon.name}</h4>
                    <p className="font-sub font-light text-[12px] text-warm-charcoal/60 mt-1">{addon.description}</p>
                    <span className="heading-display text-gold text-[16px] block mt-3">{addon.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="mt-10 bg-gold/[0.08] border-l-[3px] border-gold p-5">
            <p className="font-sub font-light text-[14px] text-warm-charcoal/75">A 30% deposit secures your booking. Full payment due 60 days before departure. We accept Visa, Mastercard, Amex, PayPal, and bank transfer.</p>
          </div>
        </div>
      </section>

      {/* ── SECTION 9: DEPARTURES ── */}
      <section id="departures" className="bg-warm-canvas noise-overlay relative py-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <span className="label-accent text-gold/80 text-[11px]">AVAILABILITY</span>
          <h2 className="heading-display text-deep-earth text-[46px] md:text-[56px] mt-2">Departure Dates</h2>
          <div className="mt-10 space-y-4">
            {safari.departures.map((dep, i) => {
              const available = dep.totalSeats - dep.takenSeats;
              return (
                <div key={i} className={`flex flex-col md:flex-row items-start md:items-center justify-between p-5 border border-faded-sand transition-colors ${dep.soldOut ? "opacity-40" : "hover:bg-dust-ivory hover:border-terracotta"}`}>
                  <div className="flex-1">
                    <span className="heading-display text-deep-earth text-[20px] md:text-[22px]">{dep.dateRange}</span>
                    <div className="flex gap-1 mt-2">
                      {Array.from({ length: dep.totalSeats }).map((_, j) => (
                        <span key={j} className={`w-2.5 h-2.5 rounded-full ${j < dep.takenSeats ? "bg-terracotta" : "border border-faded-sand"}`} />
                      ))}
                    </div>
                    <span className="font-sub font-light text-[12px] text-terracotta mt-1 block">
                      {dep.soldOut ? "SOLD OUT" : `${available} seats remaining`}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 mt-4 md:mt-0">
                    <span className="heading-display text-gold text-[24px] md:text-[28px]">{dep.pricePerPerson}</span>
                    {dep.soldOut ? (
                      <span className="font-sub font-light text-[12px] text-terracotta">Join Waitlist →</span>
                    ) : (
                      <a href={`https://wa.me/255747394631?text=I'd like to join the ${dep.dateRange} departure of ${safari.name}`} className="btn-safari border border-terracotta text-terracotta text-[12px] hover:bg-terracotta hover:text-warm-canvas transition-colors px-6 py-2.5">
                        Join This Departure
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 11: WILDLIFE / ELEVATION ── */}
      {safari.slug === "kilimanjaro-lemosho" ? (
        <KilimanjaroElevation />
      ) : safari.wildlife.length > 0 ? (
        <section className="bg-warm-canvas noise-overlay relative py-20">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <span className="label-accent text-gold/80 text-[11px]">WILDLIFE</span>
            <h2 className="heading-display text-deep-earth text-[46px] md:text-[56px] mt-2">What You'll Encounter</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 mt-10 scrollbar-thin">
              {safari.wildlife.map((animal, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="shrink-0 w-[280px] h-[380px] relative overflow-hidden group cursor-pointer"
                >
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.07]" style={{ backgroundImage: `url(${animal.image})` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F08]/90 via-[#1A0F08]/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 w-0 h-[3px] bg-terracotta transition-all duration-500 group-hover:w-full" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <span className="inline-block border border-terracotta/60 text-terracotta font-sub font-light text-[10px] uppercase tracking-[0.15em] px-2.5 py-0.5 mb-2">{animal.likelihood}</span>
                    <h3 className="heading-display text-warm-canvas text-[26px]">{animal.name}</h3>
                    <p className="font-sub font-light text-warm-canvas/60 text-[12px] mt-1">{animal.fact}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── SECTION 12: REVIEWS ── */}
      {safari.reviews.length > 0 && (
        <section className="bg-deep-earth py-20 noise-overlay relative">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <span className="label-accent text-gold/80 text-[11px]">GUEST REVIEWS</span>
            <h2 className="heading-display text-warm-charcoal text-[46px] md:text-[56px] mt-2">From the Field</h2>
            <div className="flex items-start gap-8 mt-8">
              <span className="heading-display text-gold text-[72px] md:text-[88px] leading-none">4.9</span>
              <div className="pt-2">
                {["Overall", "Guide", "Wildlife", "Accommodation", "Value"].map((cat, i) => (
                  <div key={cat} className="flex items-center gap-3 mb-1">
                    <span className="font-sub font-light text-[11px] text-warm-charcoal/60 w-28">{cat}</span>
                    <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, j) => <Star key={j} size={12} className={j < (i < 3 ? 5 : 4) ? "text-terracotta fill-terracotta" : "text-warm-charcoal/20"} />)}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {safari.reviews.map((review, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="border border-gold/15 p-6">
                  <p className="heading-display text-warm-charcoal/85 text-[18px] leading-[1.75] italic">"{review.text}"</p>
                  <div className="mt-4">
                    <span className="font-sub font-normal text-[14px] text-gold uppercase tracking-[0.1em]">{review.name}</span>
                    <span className="block font-sub font-light text-[12px] text-warm-canvas/50 mt-1">{review.countryFlag} {review.country} · {review.safari} · {review.date}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION 13: FAQ ── */}
      <section className="bg-warm-canvas noise-overlay relative py-20">
        <div className="max-w-[900px] mx-auto px-6">
          <h2 className="heading-display text-deep-earth text-[46px] md:text-[56px] text-center">Common Questions</h2>
          <div className="mt-12 space-y-0">
            {safari.faqs.map((faq, i) => (
              <div key={i} className="border-b border-faded-sand">
                <button onClick={() => setActiveFaq(activeFaq === i ? null : i)} className="w-full flex items-center justify-between py-5 text-left">
                  <span className="heading-display text-deep-earth text-[20px] md:text-[22px] pr-4">{faq.question}</span>
                  <span className="text-terracotta text-[20px] shrink-0">{activeFaq === i ? "−" : "+"}</span>
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <p className="body-text text-warm-charcoal text-[15px] leading-[1.85] pb-5">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 14: RELATED ── */}
      <section className="bg-deep-earth py-20 noise-overlay relative">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <h2 className="heading-display text-warm-charcoal text-[40px] md:text-[48px] mb-12">You May Also Love</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.slice(0, 3).map((s, i) => (
              <motion.div key={s.slug} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
                <Link to={`/safaris/${s.slug}`} className="block relative h-[360px] overflow-hidden group">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.07]" style={{ backgroundImage: `url(${s.heroImages[0]})` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F08]/90 via-[#1A0F08]/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 w-0 h-[4px] bg-terracotta transition-all duration-500 group-hover:w-full" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-between group-hover:-translate-y-2 transition-transform">
                    <span className="label-accent text-gold/80 text-[10px]">{s.duration} · {s.destinations}</span>
                    <div>
                      <h3 className="heading-display text-warm-canvas text-[28px] md:text-[32px] leading-tight">{s.name}</h3>
                      <span className="heading-display text-gold text-[20px] block mt-2">From {s.priceFrom}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 15: BOOKING CTA ── */}
      <section className="relative h-[55vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${safari.heroImages[1] ?? safari.heroImages[0]})` }} />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.36)" }} />
        <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative z-10 text-center px-6">
          <h2 className="heading-display text-warm-canvas text-[48px] md:text-[72px]">Ready to Experience This?</h2>
          <p className="font-sub font-light text-[17px] text-warm-canvas/70 max-w-[500px] mx-auto mt-4">Our specialists will handle every detail, from flights to your first sunrise game drive.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <a href="#departures" className="btn-safari bg-terracotta text-warm-canvas inline-flex items-center gap-2 hover:bg-[#A0502E]">Book This Safari <ArrowRight size={14} /></a>
            <a href={`https://wa.me/255747394631?text=I'm interested in the ${safari.name}`} className="btn-safari bg-deep-earth text-warm-canvas inline-flex items-center gap-2 hover:bg-warm-charcoal"><MessageCircle size={14} /> Chat on WhatsApp</a>
          </div>
          <p className="font-sub font-light text-[12px] text-warm-canvas/50 mt-6">No booking fees · Free cancellation up to 60 days · 24hr response</p>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default SafariPackagePage;
