import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Search, ArrowRight, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getTravelGuides } from "@/services/publicApi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type GuideCategory = "before-you-go" | "on-safari" | "people-culture" | "specialist";

const categoryLabels: Record<string, string> = {
  "before-you-go": "Before You Go",
  "on-safari": "On Safari",
  "people-culture": "People & Culture",
  specialist: "Specialist Guides",
};

const allCategories: (GuideCategory | "all")[] = ["all", "before-you-go", "on-safari", "people-culture", "specialist"];
const categoryTabLabels: Record<string, string> = {
  all: "All Guides",
  "before-you-go": "Before You Go",
  "on-safari": "On Safari",
  "people-culture": "People & Culture",
  specialist: "Specialist Guides",
};


const heroWords1 = ["Plan", "With", "Confidence."];
const heroWords2 = ["Travel", "With", "Knowledge."];

const TravelResourcesPage = () => {
  const { data: travelGuides = [], isLoading } = useQuery({
    queryKey: ['travelGuides'],
    queryFn: getTravelGuides,
  });
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<GuideCategory | "all">("all");

  const popularGuides = useMemo(() => travelGuides.filter((g: any) => g.popular).slice(0, 5), [travelGuides]);

  const filtered = useMemo(() => {
    let guides = travelGuides;
    if (activeCategory !== "all") {
      guides = guides.filter((g: any) => g.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      guides = guides.filter(
        (g: any) =>
          g.title.toLowerCase().includes(q) ||
          (g.description || '').toLowerCase().includes(q)
      );
    }
    return guides;
  }, [search, activeCategory, travelGuides]);

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

  const sectionTitle = activeCategory === "all" ? "All Travel Guides" : categoryLabels[activeCategory];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* HERO */}
      <section className="relative h-[55vh] min-h-[420px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1600&q=80)` }}
        />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.35)" }} />
        <div className="relative z-10 text-center px-6">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="heading-sub text-gold/80 text-[11px] tracking-[0.25em] block mb-6"
          >
            RONJOO SAFARIS
          </motion.span>
          <h1 className="heading-display text-warm-canvas">
            <span className="block text-[52px] md:text-[88px] leading-[1.05]">
              {heroWords1.map((word, i) => (
                <motion.span
                  key={`w1-${i}`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                  className="inline-block mr-[0.3em]"
                >
                  {word}
                </motion.span>
              ))}
            </span>
            <span className="block text-[52px] md:text-[88px] leading-[1.05]">
              {heroWords2.map((word, i) => (
                <motion.span
                  key={`w2-${i}`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + (heroWords1.length + i) * 0.08, duration: 0.5 }}
                  className="inline-block mr-[0.3em]"
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="font-sub font-light text-[17px] text-warm-canvas/70 max-w-[520px] mx-auto mt-6"
          >
            Everything you need to know before, during, and after your Tanzania safari, written by people who live it.
          </motion.p>
        </div>
      </section>

      {/* SEARCH BAR */}
      <section className="bg-deep-earth py-8">
        <div className="max-w-[600px] mx-auto px-6">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search guides... e.g. 'visa', 'packing', 'malaria'"
              className="w-full font-sub font-light text-[15px] text-warm-charcoal placeholder:text-warm-charcoal/50 bg-warm-charcoal/[0.08] border border-gold/40 px-5 py-4 pr-12 outline-none transition-all duration-300 focus:border-gold focus:shadow-[0_0_0_3px_rgba(184,146,42,0.15)]"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/60" size={18} />
          </div>
        </div>
      </section>

      {/* POPULAR GUIDES STRIP */}
      <section className="bg-deep-earth py-6 border-t border-gold/10">
        <div className="max-w-[1400px] mx-auto px-6">
          <span className="label-accent text-gold/80 text-[11px] block mb-4">MOST READ</span>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {popularGuides.map((guide) => (
              <Link
                key={guide.slug}
                to={`/travel-resources/${guide.slug}`}
                className="flex items-center gap-3 shrink-0 border border-gold/30 px-4 py-3 hover:border-terracotta transition-colors group"
              >
                <div
                  className="w-[60px] h-[60px] rounded-full bg-cover bg-center shrink-0"
                  style={{ backgroundImage: `url(${guide.heroImage})` }}
                />
                <div>
                  <span className="font-display italic text-[16px] text-warm-charcoal group-hover:text-gold transition-colors block leading-tight">
                    {guide.title}
                  </span>
                  <span className="label-accent text-terracotta text-[10px]">{guide.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORY TABS */}
      <section className="bg-deep-earth py-6 border-t border-gold/10">
        <div className="max-w-[1400px] mx-auto px-6">
          <LayoutGroup>
            <div className="flex gap-6 overflow-x-auto pb-2">
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`relative label-accent text-[12px] tracking-[0.2em] pb-3 whitespace-nowrap transition-colors ${
                    activeCategory === cat ? "text-gold" : "text-warm-charcoal/50 hover:text-warm-charcoal/80"
                  }`}
                >
                  {categoryTabLabels[cat]}
                  {activeCategory === cat && (
                    <motion.div
                      layoutId="tab-underline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-terracotta"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </LayoutGroup>
        </div>
      </section>

      {/* GUIDE CARDS GRID */}
      <section className="bg-warm-canvas noise-overlay relative py-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.h2
            key={sectionTitle}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="heading-display text-deep-earth text-[42px] md:text-[52px] mb-12"
          >
            {sectionTitle}
          </motion.h2>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory + search}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filtered.length === 0 ? (
                <p className="font-sub font-light text-warm-charcoal/60 text-center py-20 text-lg">
                  No guides match your search. Try a different term.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filtered.map((guide, i) => {
                    const isHero = i === 0;
                    return (
                      <motion.div
                        key={guide.slug}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06, duration: 0.4 }}
                        className={isHero ? "md:col-span-2 md:row-span-1" : ""}
                      >
                        <GuideCard guide={guide} isHero={isHero} />
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="bg-terracotta py-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="heading-display text-warm-canvas text-[40px] md:text-[48px]">
              The Safari Dispatch
            </h2>
            <p className="font-sub font-light text-[15px] text-warm-canvas/80 mt-4 max-w-md">
              Monthly guides, seasonal wildlife updates, and exclusive itineraries, delivered to your inbox.
            </p>
          </div>
          <div>
            <div className="flex gap-0">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-warm-canvas text-deep-earth px-5 py-4 font-sub font-light text-[15px] placeholder:text-warm-charcoal/40 outline-none"
              />
              <button className="bg-deep-earth text-warm-canvas px-8 py-4 font-sub font-light text-[13px] tracking-[0.2em] uppercase hover:bg-warm-charcoal transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
            <p className="font-sub font-light text-[11px] text-warm-canvas/60 mt-3">
              No spam. Unsubscribe anytime. 4,200+ subscribers.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

/* ── Guide Card Component ── */
interface GuideCardProps {
  guide: any;
  isHero?: boolean;
}

const GuideCard = ({ guide, isHero }: GuideCardProps) => {
  const height = isHero ? "h-[460px]" : "h-[320px]";
  const titleSize = isHero ? "text-[32px] md:text-[42px]" : "text-[24px] md:text-[32px]";

  return (
    <Link to={`/travel-resources/${guide.slug}`} className={`block relative ${height} overflow-hidden group`}>
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.07]"
        style={{ backgroundImage: `url(${guide.heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F08]/90 via-[#1A0F08]/30 to-transparent" />
      {/* Terracotta bar on hover */}
      <div className="absolute bottom-0 left-0 w-0 h-[4px] bg-terracotta transition-all duration-500 group-hover:w-full" />

      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between transition-transform duration-500 group-hover:-translate-y-2">
        {/* Top */}
        <span className="label-accent text-gold/80 text-[10px]">
          {categoryLabels[guide.category]}
        </span>

        {/* Bottom */}
        <div>
          <h3 className={`heading-display text-warm-canvas ${titleSize} leading-tight`}>
            {guide.title}
          </h3>
          <p className="font-sub font-light text-[14px] text-warm-canvas/70 mt-2 line-clamp-2">
            {guide.description}
          </p>
          <div className="flex items-center justify-between mt-4">
            <span className="label-accent text-terracotta text-[10px] flex items-center gap-1">
              <Clock size={12} /> {guide.readTime}
            </span>
            <span className="font-sub font-light text-[13px] text-warm-canvas/80 flex items-center gap-1 group-hover:gap-3 transition-all">
              Read Guide <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TravelResourcesPage;
