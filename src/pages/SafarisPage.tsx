import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getSafaris } from "@/services/publicApi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingElements from "@/components/FloatingElements";

const categories = [
  { key: "all", label: "All" },
  { key: "wildlife", label: "Wildlife" },
  { key: "migration", label: "Migration" },
  { key: "kilimanjaro", label: "Kilimanjaro" },
  { key: "family", label: "Family" },
  { key: "beach", label: "Beach Extension" },
];

const SafarisPage = () => {
  const { data: safaris = [], isLoading } = useQuery({
    queryKey: ['safaris'],
    queryFn: getSafaris,
  });
  const [activeFilter, setActiveFilter] = useState("all");
  const [compareList, setCompareList] = useState<string[]>([]);

  const filtered = useMemo(() => {
    if (activeFilter === "all") return safaris;
    return safaris.filter((s: any) => 
      (s.category || []).some((c: string) => c.toLowerCase() === activeFilter.toLowerCase())
    );
  }, [activeFilter, safaris]);

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

  const toggleCompare = (id: string) => {
    setCompareList((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  return (
    <div className="min-h-screen bg-warm-canvas">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[75vh] overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(/assets/hero-safarispage.jpg)` }}
          animate={{ scale: [1, 1.05] }}
          transition={{ duration: 12, ease: "linear", repeat: Infinity, repeatType: "mirror" }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.35))" }} />
        <div className="relative z-10 h-full flex items-center justify-center">
          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9 }}
            className="heading-display text-warm-canvas text-[56px] md:text-[80px]"
          >
            Safari Experiences
          </motion.h1>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="sticky top-20 z-40 bg-warm-canvas/95 backdrop-blur-md border-b border-faded-sand">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-4">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveFilter(cat.key)}
                className={`label-accent text-[11px] px-5 py-2 whitespace-nowrap transition-all ${
                  activeFilter === cat.key
                    ? "bg-terracotta text-warm-canvas"
                    : "border border-faded-sand text-warm-charcoal/70 hover:border-terracotta"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <section className="section-light noise-overlay relative py-16">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {filtered.map((safari, i) => {
                const safariId = String((safari as any).id ?? (safari as any).slug ?? "");
                const isCompared = compareList.includes(safariId);
                const isTall = i === 0 || i === 3;
                const imageUrl = safari.heroImages?.[0] || safari.image;

                return (
                  <div
                    key={safariId}
                    className={`relative ${isTall ? "md:row-span-2" : ""}`}
                  >
                    <Link
                      to={`/safaris/${safari.slug}`}
                      className={`group block relative overflow-hidden cursor-pointer ${
                        isTall ? "min-h-[500px] md:min-h-[640px]" : "min-h-[300px]"
                      }`}
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.07]"
                        style={{ backgroundImage: `url(${imageUrl})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F08]/80 via-[#1A0F08]/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-terracotta transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                      <div className="absolute top-5 left-5">
                        <span className="label-accent text-gold text-[10px]">
                          {(safari.destinations || []).join(" · ")}
                        </span>
                      </div>
                      <div className="absolute top-5 right-5">
                        <span className="font-sub text-[11px] tracking-wider bg-terracotta/90 text-warm-canvas px-3 py-1">
                          {safari.duration}
                        </span>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-6 transition-transform duration-500 group-hover:-translate-y-1.5">
                        <h3 className="heading-display text-warm-canvas text-[28px] md:text-[32px] leading-tight">
                          {safari.name}
                        </h3>
                        <p className="font-body font-light text-warm-canvas/60 text-[14px] mt-2 line-clamp-2">
                          {safari.description}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <p className="font-sub font-light text-warm-canvas/80 text-[14px]">
                            From ${safari.price.toLocaleString()} per person
                          </p>
                          <ArrowRight
                            size={18}
                            className="text-warm-canvas/60 group-hover:text-terracotta group-hover:translate-x-1 transition-all duration-300"
                            strokeWidth={1.5}
                          />
                        </div>
                      </div>
                    </Link>

                    {/* Compare checkbox */}
                    <button
                      onClick={() => toggleCompare(safariId)}
                      className={`absolute top-5 right-24 label-accent text-[10px] px-3 py-1 transition-all ${
                        isCompared
                          ? "bg-terracotta text-warm-canvas"
                          : "bg-[#1A0F08]/50 text-warm-canvas/70 hover:bg-[#1A0F08]/70"
                      }`}
                    >
                      {isCompared ? "✓ Compare" : "Compare"}
                    </button>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Compare Bar */}
      <AnimatePresence>
        {compareList.length >= 2 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-deep-earth/95 backdrop-blur-md border-t border-gold/10 py-4 px-6"
          >
            <div className="max-w-[1400px] mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-sub font-light text-warm-charcoal text-[14px]">
                  {compareList.length} safaris selected
                </span>
                <div className="flex gap-2">
                  {compareList.map((id) => {
                    const s = safaris.find((x: any) => x.id === id || x.slug === id);
                    return (
                      <span key={id} className="label-accent text-warm-charcoal/60 text-[10px] border border-gold/20 px-2 py-1">
                        {s?.name}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setCompareList([])}
                  className="font-sub font-light text-warm-charcoal/50 text-[13px] hover:text-warm-charcoal transition-colors"
                >
                  Clear
                </button>
                <button className="btn-safari-primary text-[11px] px-6 py-2">
                  Compare
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
      <FloatingElements />
    </div>
  );
};

export default SafarisPage;
