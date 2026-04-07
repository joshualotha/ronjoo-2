import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Sun, Camera, Trees, Mountain, Palmtree, Building, Waves } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getDestinations } from "@/services/publicApi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingElements from "@/components/FloatingElements";

type SafariCircuit = "northern" | "southern" | "coastal";

const circuitMeta: Record<SafariCircuit, { label: string; icon: React.ReactNode; description: string; tagline: string }> = {
  northern: {
    label: "Northern Circuit",
    tagline: "The World Heritage Trail",
    icon: <Trees size={22} strokeWidth={1} />,
    description: "Tanzania's most iconic route. Home to the legendary Serengeti plains and the Ngorongoro Crater, this circuit offers the classic African safari experience with unparalleled wildlife density.",
  },
  southern: {
    label: "Southern Circuit",
    tagline: "The Untracked Wilderness",
    icon: <Sun size={22} strokeWidth={1} />,
    description: "For those seeking solitude and raw authenticity. The southern parks are vast, remote, and significantly less visited, offering an intimate connection with the wild.",
  },
  coastal: {
    label: "Coastal & Islands",
    tagline: "The Swahili Sands",
    icon: <Palmtree size={22} strokeWidth={1} />,
    description: "Where the adventure meets the ocean. From the historic Stone Town to white-sand beaches, the coast offers a perfect blend of culture and relaxation.",
  },
};

// Map the API's region field to our circuit categories
const regionToCircuit: Record<string, SafariCircuit> = {
  "Northern Circuit": "northern",
  "Southern Circuit": "southern",
  "Coastal Region": "coastal",
};

const circuitOrder: SafariCircuit[] = ["northern", "southern", "coastal"];

const DestinationsPage = () => {
  const { data: destinations = [], isLoading } = useQuery({
    queryKey: ['destinations'],
    queryFn: getDestinations,
  });
  const [expanded, setExpanded] = useState<string | null>(null);

  const grouped = useMemo(() => circuitOrder
    .map((cat) => ({
      category: cat,
      ...circuitMeta[cat],
      items: destinations.filter((d: any) => regionToCircuit[d.region] === cat),
    }))
    .filter((g) => g.items.length > 0), [destinations]);

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

  return (
    <div className="min-h-screen bg-warm-canvas">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[75vh] overflow-hidden">
        <motion.div
           className="absolute inset-0 bg-cover bg-center"
           style={{ backgroundImage: `url(/assets/hero-destinationspage.jpg)` }}
           animate={{ scale: [1, 1.05] }}
           transition={{ duration: 12, ease: "linear", repeat: Infinity, repeatType: "mirror" }}
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9 }}
            className="heading-display text-warm-canvas text-[56px] md:text-[80px]"
          >
            Tanzania Destinations
          </motion.h1>
        </div>
      </section>

      {/* Tanzania at a Glance (Expedition Briefing) */}
      <section className="bg-warm-canvas relative py-24 md:py-32 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="label-accent text-terracotta text-[12px] mb-4 block">THE EXPEDITION BRIEF</span>
              <h2 className="heading-display text-warm-charcoal text-[48px] md:text-[64px] mb-8 leading-tight">
                Tanzania <br />
                At A Glance
              </h2>
              <div className="w-24 h-[1px] bg-terracotta/30 mb-8" />
              <div className="space-y-6">
                <p className="body-text text-warm-charcoal/80 text-[18px] leading-[1.9]">
                  Tanzania is not merely a destination; it is the absolute cradle of the safari experience. 
                  With over <span className="text-terracotta font-medium italic">28% of its land protected</span>, more than 
                  any other African nation, it remains the continent's most profound and authentic wilderness.
                </p>
                <p className="body-text text-warm-charcoal/70 text-[16px] leading-[1.8]">
                  From the northern "World Heritage" route featuring the Serengeti and Ngorongoro, to the 
                  vast, untouched expanses of the southern circuit, Tanzania offers a diversity of 
                  wildlife and landscapes that is simply unmatched.
                </p>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-8 md:gap-12">
              {[
                { value: "16+", label: "NATIONAL PARKS", icon: "🐾", desc: "A network of protected wilderness." },
                { value: "5,895m", label: "HIGHEST POINT", icon: "🏔️", desc: "Mount Kilimanjaro - Roof of Africa." },
                { value: "2M+", label: "THE MIGRATION", icon: "🦓", desc: "The world's greatest wildlife event." },
                { value: "1,100+", label: "BIRD SPECIES", icon: "🦅", desc: "A literal paradise for birders." },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="group"
                >
                  <span className="text-2xl mb-3 block">{stat.icon}</span>
                  <p className="heading-display text-terracotta text-[42px] leading-tight mb-1">{stat.value}</p>
                  <p className="label-accent text-warm-charcoal text-[11px] tracking-[0.15em] mb-2">{stat.label}</p>
                  <p className="font-sub font-light text-warm-charcoal/50 text-[13px] leading-relaxed group-hover:text-warm-charcoal transition-colors duration-300">
                    {stat.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Subtle decorative background text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none select-none">
          <span className="font-display italic text-[300px] leading-none whitespace-nowrap">Tanzania Safari</span>
        </div>
      </section>

      {/* Grouped Destinations by Circuit */}
      {grouped.map((group, gi) => (
        <section
          key={group.category}
          className={`relative py-32 ${gi % 2 === 0 ? "bg-deep-earth" : "bg-warm-canvas"} noise-overlay transition-colors duration-700`}
        >
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            {/* Circuit Header */}
            <div className="max-w-4xl mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 flex items-center justify-center rounded-full border ${gi % 2 === 0 ? "border-terracotta/30 text-terracotta" : "border-terracotta/30 text-terracotta"}`}>
                    {group.icon}
                  </div>
                  <div>
                    <span className={`label-accent text-[11px] tracking-[0.3em] ${gi % 2 === 0 ? "text-terracotta/60" : "text-terracotta/60"}`}>
                      {group.tagline}
                    </span>
                    <h2 className={`heading-display text-[48px] md:text-[56px] leading-none mt-1 ${gi % 2 === 0 ? "text-warm-charcoal" : "text-warm-charcoal"}`}>
                      {group.label}
                    </h2>
                  </div>
                </div>
                <p className={`body-text text-[18px] leading-[1.8] max-w-2xl ${gi % 2 === 0 ? "text-warm-charcoal/60" : "text-warm-charcoal/60"}`}>
                  {group.description}
                </p>
              </motion.div>
            </div>

            {/* Destination Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {group.items.map((dest, i) => (
                <motion.div
                  key={dest.name}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                  className="group"
                >
                  <Link 
                    to={`/destinations/${dest.slug || dest.name}`} 
                    className="block relative aspect-[4/5] overflow-hidden bg-deep-earth"
                  >
                    {/* Main Image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                      style={{ backgroundImage: `url(${dest.heroImage || dest.portraitImage || '/assets/hero-destinationspage.jpg'})` }}
                    />
                    
                    {/* Narrative Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F08] via-[#1A0F08]/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-90" />
                    
                    {/* Content */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                      <div className="mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <span className="label-accent text-gold text-[10px] tracking-[0.2em] mb-3 block">
                          {dest.season ?? "Best Season"} • Expedition
                        </span>
                        <h3 className="heading-display text-warm-canvas text-[36px] md:text-[42px] leading-tight mb-2 italic">
                          {dest.name}
                        </h3>
                        <p className="font-sub font-light text-warm-canvas/60 text-[15px] leading-relaxed line-clamp-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                          {dest.teaser ?? dest.tagline ?? ""}
                        </p>
                      </div>

                      {/* Interactive Wildlife Preview */}
                      <div className="flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                        {(((dest.wildlife ?? []) as any[]).map((w: any) => w?.name).filter(Boolean) as string[]).slice(0, 3).map((w) => (
                          <span key={w} className="px-3 py-1 border border-warm-canvas/20 text-warm-canvas/50 font-sub text-[10px] uppercase tracking-wider">
                            {w}
                          </span>
                        ))}
                      </div>

                      {/* CTA arrow */}
                      <div className="mt-8 flex items-center justify-between">
                         <span className="label-accent text-warm-canvas text-[11px] tracking-widest border-b border-warm-canvas/30 pb-1">
                            VIEW DETAILS
                         </span>
                         <div className="w-10 h-10 rounded-full border border-warm-canvas/20 flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-500 bg-terracotta text-warm-canvas">
                            →
                         </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Final Call to Adventure */}
      <section className="py-32 bg-warm-canvas relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="label-accent text-terracotta text-[12px] mb-6 block">COMMENCE YOUR JOURNEY</span>
            <h2 className="heading-display text-warm-charcoal text-[52px] md:text-[72px] mb-8 italic">
              Found Your Inspiration?
            </h2>
            <p className="body-text text-warm-charcoal/60 text-[18px] md:text-[20px] max-w-2xl mx-auto mb-12">
              Every great story begins with a single map. Let us help you chart a path 
              through Tanzania's most extraordinary wild places.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/custom-safari" className="btn-safari-primary">
                Design My Route
              </Link>
              <Link to="/safaris" className="btn-safari-terracotta-outline">
                Browse Itineraries
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-terracotta/5 rounded-full blur-[100px]" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gold/5 rounded-full blur-[100px]" />
      </section>

      <Footer />
      <FloatingElements />
    </div>
  );
};

export default DestinationsPage;
