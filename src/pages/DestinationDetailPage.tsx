import { useParams, Link } from "react-router-dom";
import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  ChevronDown, ChevronLeft, ChevronRight, X,
  Plane, Car, DollarSign, Globe, Clock, FileText,
  Maximize2, PawPrint, Calendar, Thermometer, MapPin, Camera,
  Droplets, Sun,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getDestinationBySlug, getSafaris, getDestinations } from "@/services/publicApi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingElements from "@/components/FloatingElements";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/* ─── Icon helper ─── */
const factIcon = (icon: string) => {
  const cls = "w-6 h-6 text-gold/70";
  switch (icon) {
    case "paw": return <PawPrint className={cls} strokeWidth={1} />;
    case "calendar": return <Calendar className={cls} strokeWidth={1} />;
    case "thermometer": return <Thermometer className={cls} strokeWidth={1} />;
    case "map": return <MapPin className={cls} strokeWidth={1} />;
    case "camera": return <Camera className={cls} strokeWidth={1} />;
    default: return <MapPin className={cls} strokeWidth={1} />;
  }
};

/* ─── Animated word wrapper ─── */
const WordReveal = ({ text, className }: { text: string; className: string }) => (
  <span className={className}>
    {text.split(" ").map((word, i) => (
      <motion.span
        key={i}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
        className="inline-block mr-[0.3em]"
      >
        {word}
      </motion.span>
    ))}
  </span>
);

/* ─── Section wrapper ─── */
const Section = ({
  bg, children, className = "",
}: {
  bg: "dark" | "light";
  children: React.ReactNode;
  className?: string;
}) => (
  <section className={`${bg === "dark" ? "section-dark" : "section-light"} noise-overlay relative py-20 md:py-28 ${className}`}>
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12">{children}</div>
  </section>
);

/* ─── Band color ─── */
const bandColor = (band: string) => {
  if (band === "peak") return "bg-sage";
  if (band === "good") return "bg-gold";
  return "bg-faded-sand";
};

const bandLabel = (band: string) => {
  if (band === "peak") return "Peak";
  if (band === "good") return "Good";
  return "Low";
};

/* ════════════════════════════════════════════════════════════════ */
/*  PAGE                                                           */
/* ════════════════════════════════════════════════════════════════ */
const DestinationDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: dest, isLoading } = useQuery({
    queryKey: ['destination', slug],
    queryFn: () => getDestinationBySlug(slug || ''),
    enabled: !!slug,
  });
  const { data: safaris = [] } = useQuery({
    queryKey: ['safaris'],
    queryFn: getSafaris,
  });

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

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

  if (!dest) {
    return (
      <div className="min-h-screen bg-warm-canvas flex items-center justify-center">
        <Navbar />
        <div className="text-center mt-20">
          <h1 className="heading-display text-warm-charcoal text-[48px]">Destination Not Found</h1>
          <Link to="/destinations" className="btn-safari-terracotta-outline inline-block mt-8">Back to Destinations</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-canvas">
      <Navbar />
      <HeroSection dest={dest} />
      <QuickFacts dest={dest} />
      <StorySection dest={dest} />
      <WildlifeSection dest={dest} />
      <ExperiencesSection dest={dest} />
      <AccommodationsSection dest={dest} />
      <SafarisHere dest={dest} safaris={safaris} />
      <TravelEssentials dest={dest} />
      <RelatedDestinations dest={dest} />
      <FinalCTA dest={dest} />
      <Footer />
      <FloatingElements />
    </div>
  );
};

/* ════════ SECTION 1, HERO ════════ */
const HeroSection = ({ dest }: { dest: any }) => (
  <section className="relative h-screen overflow-hidden">
    {/* Ken Burns BG */}
    <div className="absolute inset-0">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${dest.heroImage})`,
          animation: "ken-burns 14s ease-in-out infinite alternate",
        }}
      />
    </div>
    <div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.42) 100%)",
      }}
    />

    {/* Breadcrumb */}
    <div className="absolute top-24 left-6 lg:left-12 z-10">
      <p className="font-sub font-light text-[11px] text-warm-canvas/50 tracking-wider">
        <Link to="/" className="hover:text-warm-canvas/80 transition-colors">Home</Link>
        {" / "}
        <Link to="/destinations" className="hover:text-warm-canvas/80 transition-colors">Destinations</Link>
        {" / "}
        <span className="text-warm-canvas/70">{dest.name}</span>
      </p>
    </div>

    {/* Content, bottom left */}
    <div className="absolute bottom-20 md:bottom-24 left-6 lg:left-12 z-10 max-w-2xl">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="label-accent text-gold/80 text-[11px] tracking-[0.25em] mb-4"
      >
        {dest.region.toUpperCase()}
      </motion.p>

      <h1>
        <WordReveal text={dest.name} className="heading-display text-warm-canvas text-[56px] md:text-[96px] leading-none" />
      </h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="font-sub font-light text-warm-canvas/70 text-[18px] mt-4 max-w-[480px]"
      >
        {dest.tagline}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.5 }}
        className="flex gap-4 mt-8"
      >
        <Link to="/safaris" className="btn-safari-primary">View Safaris Here</Link>
        <Link to="/plan" className="btn-safari-outline">Plan Custom Trip</Link>
      </motion.div>
    </div>

    {/* Area stat, bottom right */}
    <div className="absolute bottom-20 right-6 lg:right-12 z-10 text-right hidden md:block">
      <p className="heading-display text-warm-canvas/50 text-[18px]">{dest.areaStat}</p>
      <p className="label-accent text-warm-canvas/30 text-[10px] mt-1">{dest.areaLabel}</p>
    </div>

    {/* Scroll arrow */}
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 scroll-indicator">
      <div className="w-px h-10 bg-warm-canvas/30 mx-auto" />
      <ChevronDown size={16} className="text-warm-canvas/40 mx-auto mt-1" strokeWidth={1} />
    </div>
  </section>
);

/* ════════ SECTION 2, QUICK FACTS ════════ */
const QuickFacts = ({ dest }: { dest: any }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <section className="section-dark relative">
      <div
        ref={ref}
        className="max-w-[1400px] mx-auto px-6 lg:px-12 py-10 flex overflow-x-auto gap-0 scrollbar-none"
      >
        {(dest.quickFacts ?? []).map((f: any, i: number) => (
          <motion.div
            key={f.label}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className={`flex-1 min-w-[160px] flex flex-col items-center text-center py-4 ${
              i < (dest.quickFacts ?? []).length - 1 ? "border-r border-gold/15" : ""
            }`}
          >
            {factIcon(f.icon)}
            <p className="heading-display text-gold/80 text-[28px] mt-3">{f.value}</p>
            <p className="label-accent text-warm-charcoal/60 text-[11px] mt-1">{f.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

/* ════════ SECTION 3, THE STORY ════════ */
const StorySection = ({ dest }: { dest: any }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <Section bg="light">
      <div ref={ref} className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
        {/* Left, 60% */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="lg:col-span-3"
        >
          <p className="label-accent text-gold text-[11px] tracking-[0.2em] mb-4">ABOUT THIS DESTINATION</p>
          <h2 className="heading-display text-warm-charcoal text-[40px] md:text-[52px]">
            The {dest.name}
          </h2>
          <div className="w-[120px] h-px bg-gold/40 mt-4 mb-8" />
          {dest.overview?.map((p: string, i: number) => (
            <p key={i} className="body-text text-warm-charcoal/70 mb-6 last:mb-0">
              {p}
            </p>
          ))}
        </motion.div>

        {/* Right, 40% portrait image */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="border-2 border-terracotta p-2">
            <img
              src={dest.portraitImage}
              alt={dest.name}
              className="w-full h-[500px] object-cover"
              loading="lazy"
            />
          </div>
          <p className="heading-display text-terracotta text-[22px] mt-6 max-w-[280px] leading-relaxed">
            "{dest.pullQuote}"
          </p>
        </motion.div>
      </div>
    </Section>
  );
};

/* ════════ SECTION 4, WILDLIFE ════════ */
const WildlifeSection = ({ dest }: { dest: any }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  };
  const likelihoodColor = (l: string) => {
    if (l === "Very Common") return "bg-sage/80";
    if (l === "Common") return "bg-gold/80";
    if (l === "Rare") return "bg-terracotta/80";
    return "bg-terracotta";
  };

  return (
    <Section bg="dark">
      <p className="label-accent text-gold text-[11px] tracking-[0.2em] mb-4">WILDLIFE</p>
      <h2 className="heading-display text-warm-charcoal text-[40px] md:text-[56px] mb-10">
        What You'll Encounter
      </h2>

      <div className="relative">
        {/* Arrows */}
        <button
          onClick={() => scroll(-1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-warm-canvas/30 flex items-center justify-center text-warm-canvas/60 hover:border-terracotta hover:text-terracotta transition-colors -ml-2 hidden md:flex"
        >
          <ChevronLeft size={18} strokeWidth={1.5} />
        </button>
        <button
          onClick={() => scroll(1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-warm-canvas/30 flex items-center justify-center text-warm-canvas/60 hover:border-terracotta hover:text-terracotta transition-colors -mr-2 hidden md:flex"
        >
          <ChevronRight size={18} strokeWidth={1.5} />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin"
          style={{
            scrollbarColor: "hsl(var(--terracotta)) transparent",
            scrollbarWidth: "thin",
          }}
        >
          {dest.wildlife?.map((animal: any) => (
            <div
              key={animal.name}
              className="group flex-shrink-0 w-[320px] h-[420px] relative overflow-hidden cursor-pointer"
            >
              <img
                src={animal.image}
                alt={animal.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.08]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F08]/80 via-[#1A0F08]/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-terracotta transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              <div className="absolute bottom-0 left-0 right-0 p-5 transition-transform duration-500 group-hover:-translate-y-1.5">
                <span className={`label-accent text-[10px] text-warm-canvas px-2 py-0.5 ${likelihoodColor(animal.likelihood)} inline-block mb-2`}>
                  {animal.likelihood}
                </span>
                <h3 className="heading-display text-warm-canvas text-[28px]">{animal.name}</h3>
                <p className="font-sub font-light text-warm-canvas/60 text-[13px] mt-1">{animal.fact || animal.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

/* ════════ SECTION 6, EXPERIENCES ════════ */
const ExperiencesSection = ({ dest }: { dest: any }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const normalizeTags = (input: unknown): string[] => {
    if (Array.isArray(input)) return input.filter((t): t is string => typeof t === 'string' && t.trim().length > 0);
    if (typeof input === 'string') return input.split(',').map(s => s.trim()).filter(Boolean);
    return [];
  };

  return (
    <Section bg="dark">
      <h2 className="heading-display text-warm-charcoal text-[40px] md:text-[56px] mb-12">
        Experiences in {dest.name}
      </h2>
      <div ref={ref} className="space-y-12 max-w-4xl">
        {(dest.experiences ?? []).map((exp: any, i: number) => (
          <motion.div
            key={exp.title}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.15, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start"
          >
            <div className="md:col-span-2 relative">
              <span className="heading-display text-warm-charcoal/[0.07] text-[84px] leading-none select-none">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="md:col-span-10 pt-4">
              <h3 className="heading-display text-warm-charcoal text-[28px] md:text-[32px]">{exp.title}</h3>
              <p className="font-sub font-light text-warm-charcoal/70 text-[16px] mt-3 leading-relaxed max-w-2xl">{exp.description}</p>
              <div className="flex flex-wrap gap-2 mt-5">
                {normalizeTags(exp.tags).map((t) => (
                  <span key={t} className="label-accent text-[10px] text-terracotta border border-terracotta/30 px-2 py-0.5 hover:bg-terracotta/5 transition-colors">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

/* ════════ SECTION 8, ACCOMMODATIONS ════════ */
const AccommodationsSection = ({ dest }: { dest: any }) => (
  <Section bg="light">
    <h2 className="heading-display text-warm-charcoal text-[40px] md:text-[56px] mb-2">
      Where You'll Rest
    </h2>
    <p className="font-sub font-light text-warm-charcoal/60 text-[16px] mb-12 max-w-xl">
      We partner only with lodges and camps that reflect the character of their surroundings.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {(dest.accommodations ?? []).map((a: any) => (
        <div
          key={a.name}
          className="group transition-shadow duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.07)]"
        >
          <div className="relative h-[220px] overflow-hidden">
            <img src={a.image} alt={a.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" loading="lazy" />
          </div>
          <div className="p-5 bg-warm-canvas border border-faded-sand border-t-0">
            <p className="label-accent text-gold/60 text-[10px] mb-1">{a.tier}</p>
            <h3 className="heading-display text-warm-charcoal text-[26px]">{a.name}</h3>
            <div className="flex gap-1 mt-1 mb-2">
              {Array.from({ length: a.stars }).map((_, i) => (
                <span key={i} className="w-2 h-2 bg-terracotta rounded-full" />
              ))}
            </div>
            <p className="font-sub font-light text-warm-charcoal/60 text-[14px] mb-3">{a.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {a.amenities.map((am) => (
                <span key={am} className="label-accent text-[9px] text-warm-charcoal/40 border border-faded-sand px-2 py-0.5">
                  {am}
                </span>
              ))}
            </div>
            <Link to="/safaris" className="label-accent text-terracotta text-[11px] mt-4 inline-block hover:text-gold transition-colors">
              Included in These Safaris →
            </Link>
          </div>
        </div>
      ))}
    </div>
  </Section>
);

/* ════════ SECTION 9, SAFARIS HERE ════════ */
const SafarisHere = ({ dest, safaris = [] }: { dest: any; safaris?: any[] }) => {
  const [filter, setFilter] = useState("all");
  const matchingSafaris = useMemo(
    () => safaris.filter((s: any) =>
      (s.destinations || []).some((d: string) => d.toLowerCase().includes((dest.name || '').toLowerCase().split(" ")[0]))
    ),
    [dest.name, safaris]
  );
  const filters = ["All", "Private", "Family"];

  return (
    <Section bg="dark">
      <h2 className="heading-display text-warm-charcoal text-[40px] md:text-[56px] mb-6">
        Safaris Visiting {dest.name}
      </h2>
      <div className="flex gap-6 mb-10">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f.toLowerCase())}
            className={`label-accent text-[11px] pb-1 transition-colors ${
              filter === f.toLowerCase()
                ? "text-terracotta border-b border-terracotta"
                : "text-warm-canvas/40 hover:text-warm-canvas/70"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {matchingSafaris.slice(0, 4).map((s) => (
          <Link key={s.id} to={`/safari/${s.slug}`} className="group relative overflow-hidden min-h-[300px]">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.07]"
              style={{ backgroundImage: `url(${s.image || ""})` }}
            />
            {/* Fallback colored overlay if no image resolves */}
            <div className="absolute inset-0 bg-deep-earth/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F08]/80 via-[#1A0F08]/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-terracotta transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            <div className="absolute top-4 left-4">
              <span className="label-accent text-gold text-[10px]">{s.destinations.join(" · ")}</span>
            </div>
            <div className="absolute top-4 right-4">
              <span className="font-sub text-[11px] tracking-wider bg-terracotta/90 text-warm-canvas px-3 py-1">{s.duration}</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-5 transition-transform duration-500 group-hover:-translate-y-1.5">
              <h3 className="heading-display text-warm-canvas text-[28px] leading-tight">{s.name}</h3>
              <p className="font-sub font-light text-warm-canvas/80 text-[14px] mt-2">From ${s.price.toLocaleString()} per person</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link to="/safaris" className="label-accent text-terracotta text-[12px] hover:text-gold transition-colors group">
          View All Tanzania Safaris{" "}
          <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </Section>
  );
};

/* ════════ SECTION 10, TRAVEL ESSENTIALS ════════ */
const TravelEssentials = ({ dest }: { dest: any }) => {
  const infoRows = [
    { icon: <Plane size={14} strokeWidth={1} />, label: "GETTING THERE", value: dest.travelInfo?.gettingThere },
    { icon: <Car size={14} strokeWidth={1} />, label: "GETTING AROUND", value: dest.travelInfo?.gettingAround },
    { icon: <DollarSign size={14} strokeWidth={1} />, label: "CURRENCY", value: dest.travelInfo?.currency },
    { icon: <Globe size={14} strokeWidth={1} />, label: "LANGUAGE", value: dest.travelInfo?.language },
    { icon: <Clock size={14} strokeWidth={1} />, label: "TIME ZONE", value: dest.travelInfo?.timeZone },
    { icon: <FileText size={14} strokeWidth={1} />, label: "VISA", value: dest.travelInfo?.visa },
  ];

  return (
    <Section bg="light">
      <h2 className="heading-display text-warm-charcoal text-[40px] md:text-[56px] mb-10">
        Before You Go
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* FAQ Accordion */}
        <div>
          <Accordion type="single" collapsible className="space-y-0">
            {(dest.faqs ?? []).map((faq: any, i: number) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-b border-faded-sand">
                <AccordionTrigger className="font-display text-warm-charcoal text-[20px] text-left py-5 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="font-sub font-light text-warm-charcoal/70 text-[15px] pb-2">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Quick Reference */}
        <div className="bg-deep-earth p-8">
          <p className="label-accent text-gold text-[11px] tracking-[0.2em] mb-6">QUICK REFERENCE</p>
          <div className="space-y-0">
            {infoRows.map((row, i) => (
              <div key={row.label} className={`flex items-start gap-4 py-4 ${i < infoRows.length - 1 ? "border-b border-gold/10" : ""}`}>
                <span className="text-gold/50 mt-0.5">{row.icon}</span>
                <div>
                  <p className="label-accent text-gold/50 text-[11px]">{row.label}</p>
                  <p className="font-sub font-light text-warm-charcoal/80 text-[14px] mt-1">{row.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

/* ════════ SECTION 11, RELATED DESTINATIONS ════════ */
const RelatedDestinations = ({ dest }: { dest: any }) => {
  const { data: allDestinations = [] } = useQuery({
    queryKey: ['destinations'],
    queryFn: getDestinations,
  });
  const related = useMemo(() => {
    if (!dest.relatedSlugs) return [];
    return (allDestinations as any[])
      .filter((d: any) => dest.relatedSlugs.includes(d.slug))
      .slice(0, 3);
  }, [dest.relatedSlugs, allDestinations]);

  return (
    <Section bg="light">
      <h2 className="heading-display text-warm-charcoal text-[36px] md:text-[48px] mb-10">
        You May Also Love
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {related.map((r) => (
          <Link
            key={r.slug}
            to={`/destinations/${r.slug}`}
            className="group flex gap-4 border border-faded-sand p-3 hover:bg-dust-ivory transition-colors hover:border-l-[3px] hover:border-l-terracotta"
          >
            <img
              src={r.portraitImage}
              alt={r.name}
              className="w-[120px] h-[120px] object-cover flex-shrink-0 transition-transform duration-500 group-hover:scale-[1.05]"
              loading="lazy"
            />
            <div className="flex flex-col justify-center">
              <p className="label-accent text-gold/60 text-[10px]">{r.region}</p>
              <h3 className="heading-display text-warm-charcoal text-[22px] mt-1">{r.name}</h3>
              <p className="font-sub font-light text-warm-charcoal/50 text-[13px] mt-1">{r.tagline}</p>
              <span className="label-accent text-terracotta text-[11px] mt-2">Explore →</span>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
};

/* ════════ SECTION 12, FINAL CTA ════════ */
const FinalCTA = ({ dest }: { dest: any }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${dest.heroImage})` }}
      />
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.35)" }} />
      <div ref={ref} className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <motion.h2
          initial={{ opacity: 0, scale: 0.97 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="heading-display text-warm-canvas text-[40px] md:text-[72px] max-w-3xl"
        >
          Ready to Experience {dest.name}?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="font-sub font-light text-warm-canvas/70 text-[17px] mt-4 max-w-xl"
        >
          Our safari specialists craft journeys as unique as the landscapes you'll explore.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex gap-4 mt-8"
        >
          <Link to="/safaris" className="btn-safari-primary">View Safaris</Link>
          <Link to="/plan" className="btn-safari-outline">Plan Custom Trip</Link>
        </motion.div>
        <motion.a
          href="https://wa.me/255747394631"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="font-sub font-light text-warm-canvas/60 text-[13px] mt-6 hover:text-warm-canvas/80 transition-colors"
        >
          Or chat with us on WhatsApp →
        </motion.a>
      </div>
    </section>
  );
};

export default DestinationDetailPage;
