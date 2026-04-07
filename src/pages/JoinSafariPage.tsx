import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown, ChevronUp, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getDepartures, getSafaris } from "@/services/publicApi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingElements from "@/components/FloatingElements";

const months = ["All", "Jun", "Jul", "Aug", "Sep", "Oct"];

const JoinSafariPage = () => {
  const { data: departures = [], isLoading } = useQuery({
    queryKey: ['departures'],
    queryFn: getDepartures,
  });
  const { data: safaris = [] } = useQuery({
    queryKey: ['safaris'],
    queryFn: getSafaris,
  });
  const [activeMonth, setActiveMonth] = useState("All");
  const [expandedDep, setExpandedDep] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const deps = Array.isArray(departures) ? departures : [];
    if (activeMonth === "All") return deps;
    return deps.filter((d: any) => d.month === activeMonth);
  }, [activeMonth, departures]);

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

  const steps = [
    { num: "01", title: "Choose Your Departure", desc: "Pick a date and destination that speaks to you." },
    { num: "02", title: "Reserve Your Seat", desc: "A small deposit secures your place, cancel anytime." },
    { num: "03", title: "Show Up & Explore", desc: "We handle everything. You just experience Africa." },
  ];

  return (
    <div className="min-h-screen bg-warm-canvas">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[75vh] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(/assets/hero-joinsafarispage.jpg)` }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.38))" }} />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9 }}
            className="heading-display text-warm-canvas text-[48px] md:text-[72px]"
          >
            Safari for the Independent Traveler
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="font-sub font-light text-warm-canvas/70 text-[16px] mt-4 max-w-lg"
          >
            Join a small group departure. Private guide. Maximum 8 guests. No single supplements.
          </motion.p>
        </div>
      </section>

      {/* How it works */}
      <section className="section-dark noise-overlay relative py-16">
        <div className="max-w-[1000px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-px border-t border-dashed border-gold/20" />
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center relative"
              >
                <span className="font-display text-terracotta text-[28px] mb-3 block">{step.num}</span>
                <h3 className="heading-sub text-warm-charcoal text-[12px] mb-2">{step.title}</h3>
                <p className="font-body font-light text-warm-charcoal/50 text-[14px]">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Month tabs + Departures */}
      <section className="section-light noise-overlay relative py-16">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          {/* Month tabs */}
          <div className="flex gap-2 mb-10 overflow-x-auto">
            {months.map((month) => (
              <button
                key={month}
                onClick={() => setActiveMonth(month)}
                className={`label-accent text-[11px] px-5 py-2 whitespace-nowrap transition-all ${
                  activeMonth === month
                    ? "border-b-2 border-terracotta text-terracotta"
                    : "text-warm-charcoal/50 hover:text-warm-charcoal"
                }`}
              >
                {month}
              </button>
            ))}
          </div>

          {/* Departure list */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMonth}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="space-y-0"
            >
              {filtered.length === 0 && (
                <p className="font-body text-warm-charcoal/40 text-center py-12">No departures for this month yet.</p>
              )}
              {filtered.map((dep) => {
                const safari = safaris.find((s: any) => s.id === dep.safariId || s.slug === dep.safariSlug);
                const isExpanded = expandedDep === dep.id;

                return (
                  <div key={dep.id} className={`border-b border-faded-sand/60 ${dep.soldOut ? "opacity-50" : ""}`}>
                    {/* Collapsed row */}
                    <button
                      onClick={() => setExpandedDep(isExpanded ? null : dep.id)}
                      className="w-full text-left py-5 px-4 grid grid-cols-1 md:grid-cols-[1fr_1.5fr_1fr_auto_auto_auto] gap-4 items-center group hover:bg-dust-ivory/30 transition-colors"
                    >
                      <span className="font-sub font-light text-warm-charcoal/70 text-[14px]">{dep.dateRange}</span>
                      <span className="heading-display text-warm-charcoal text-[22px]">{dep.safariName}</span>
                      <div className="flex gap-2 flex-wrap">
                        {(dep.destinations ?? []).map((d: any) => (
                          <span key={d} className="label-accent text-warm-charcoal/50 text-[10px] border border-faded-sand px-2 py-0.5">{d}</span>
                        ))}
                      </div>
                      <div className="flex gap-1">
                        {Array.from({ length: dep.totalSeats ?? 0 }).map((_, i) => (
                          <div key={i} className={`w-2 h-2 rounded-full ${i < (dep.seatsTaken ?? 0) ? "bg-terracotta" : "bg-faded-sand/40"}`} />
                        ))}
                      </div>
                      <span className="font-display text-warm-charcoal text-[20px]">
                        ${(dep.pricePerPerson ?? 0).toLocaleString()}<span className="font-sub font-light text-[12px] text-warm-charcoal/40 ml-1">/pp</span>
                      </span>
                      <div className="flex items-center gap-2">
                        {dep.soldOut ? (
                          <span className="label-accent text-warm-charcoal/40 text-[11px]">Sold Out</span>
                        ) : (
                          <span className="font-sub font-light text-terracotta text-[13px] tracking-wider flex items-center gap-1">
                            {dep.soldOut ? "Waitlist" : "Details"}
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </span>
                        )}
                      </div>
                    </button>

                    {/* Expanded */}
                    <AnimatePresence>
                      {isExpanded && safari && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-6 grid grid-cols-1 md:grid-cols-[1fr_200px] gap-8">
                            <div>
                              <p className="body-text text-warm-charcoal/60 text-[15px] mb-4">{safari.description}</p>
                              <div className="flex flex-wrap gap-3 mb-4">
                                {(safari.highlights ?? []).map((h: any) => (
                                  <span key={h} className="label-accent text-[10px] border border-faded-sand text-warm-charcoal/50 px-2 py-1">{h}</span>
                                ))}
                              </div>
                              <div className="flex items-center gap-3 mb-4">
                                <MapPin size={14} className="text-terracotta/60" strokeWidth={1} />
                                <span className="font-body text-warm-charcoal/50 text-[14px]">
                                  {(safari.destinations ?? []).join(" → ")}
                                </span>
                              </div>
                              {(dep.nationalities ?? []).length > 0 && (
                                <div className="flex items-center gap-3 p-3 bg-dust-ivory/50">
                                  <div className="flex gap-1">
                                    {(dep.nationalities ?? []).map((flag: any, i: number) => (
                                      <span key={i} className="text-[18px]">{flag}</span>
                                    ))}
                                  </div>
                                  <p className="font-body font-light text-warm-charcoal/50 text-[13px]">
                                    {dep.seatsTaken} travelers have already joined
                                  </p>
                                </div>
                              )}
                              <div className="flex gap-3 mt-6">
                                {dep.soldOut ? (
                                  <button className="btn-safari-terracotta-outline text-[11px] px-6 py-2.5">
                                    Join Waitlist
                                  </button>
                                ) : (
                                  <>
                                    <Link to={`/safari/${safari.slug}`} className="btn-safari-primary text-[11px] px-6 py-2.5 inline-flex items-center gap-2">
                                      Join This Safari <ArrowRight size={14} />
                                    </Link>
                                    <Link to={`/safari/${safari.slug}`} className="btn-safari-terracotta-outline text-[11px] px-6 py-2.5">
                                      View Full Itinerary
                                    </Link>
                                  </>
                                )}
                              </div>
                            </div>
                            <div
                              className="h-48 md:h-full bg-cover bg-center min-h-[200px]"
                              style={{ backgroundImage: `url(${safari?.image || '/assets/hero-joinsafarispage.jpg'})` }}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <Footer />
      <FloatingElements />
    </div>
  );
};

export default JoinSafariPage;
