import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Info, AlertTriangle, Lightbulb, Check, MessageCircle, Volume2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getTravelGuideBySlug, getTravelGuides } from "@/services/publicApi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface ContentBlock {
  type: string;
  text?: string;
  title?: string;
  icon?: string;
  items?: string[];
  phrases?: { swahili: string; english: string; pronunciation: string }[];
  headers?: string[];
  rows?: string[][];
}

const categoryLabels: Record<string, string> = {
  "before-you-go": "Before You Go",
  "on-safari": "On Safari",
  "people-culture": "People & Culture",
  specialist: "Specialist Guides",
};

const TravelGuideDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: guide, isLoading } = useQuery({
    queryKey: ['travelGuide', slug],
    queryFn: () => getTravelGuideBySlug(slug || ''),
    enabled: !!slug,
  });
  const { data: allGuides = [] } = useQuery({
    queryKey: ['travelGuides'],
    queryFn: getTravelGuides,
  });
  const [activeSection, setActiveSection] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  const h2Sections = useMemo(() => {
    if (!guide) return [];
    return (guide.content || []).filter((b: any) => b.type === "h2").map((b: any) => b.text || "");
  }, [guide]);

  const related = useMemo(() => {
    if (!guide?.relatedSlugs) return [];
    return allGuides.filter((g: any) => guide.relatedSlugs.includes(g.slug));
  }, [guide, allGuides]);

  // IntersectionObserver for TOC
  useEffect(() => {
    if (!guide) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sectionRefs.current.indexOf(entry.target as HTMLElement);
            if (idx !== -1) setActiveSection(idx);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );
    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [guide]);

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

  if (!guide) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <p className="font-sub text-warm-charcoal text-lg">Guide not found.</p>
      </div>
    );
  }

  const heroTitleWords = guide.title.split(" ");

  let h2Index = -1;

  const scrollToSection = (idx: number) => {
    sectionRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* HERO */}
      <section className="relative h-[50vh] min-h-[380px] flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${guide.heroImage})` }} />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.36)" }} />
        <div className="relative z-10 px-6 lg:px-12 pb-12 max-w-[1400px] mx-auto w-full">
          <p className="font-sub font-light text-[11px] text-warm-canvas/45 tracking-[0.15em] mb-4">
            <Link to="/travel-resources" className="hover:text-warm-canvas/70 transition-colors">Travel Resources</Link>
            {" / "}
            {categoryLabels[guide.category]}
          </p>
          <span className="label-accent text-gold/80 text-[10px] block mb-3">
            {categoryLabels[guide.category]}
          </span>
          <h1 className="heading-display text-warm-canvas text-[48px] md:text-[80px] leading-[1.05]">
            {heroTitleWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                className="inline-block mr-[0.3em]"
              >
                {word}
              </motion.span>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="font-sub font-light text-[12px] text-warm-canvas/55 mt-4 tracking-wide"
          >
            {guide.readTime} · Updated {guide.updatedDate} · By Ronjoo Team
          </motion.p>
        </div>
      </section>

      {/* CONTENT AREA */}
      <section className="bg-warm-canvas">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row">
          {/* TOC Sidebar */}
          <aside className="lg:w-[260px] shrink-0">
            <div className="lg:sticky lg:top-24 py-8 px-6 lg:px-8">
              <span className="font-sub font-light text-[10px] text-gold tracking-[0.3em] uppercase block mb-5">
                In This Guide
              </span>
              {/* Mobile: horizontal scroll */}
              <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                {h2Sections.map((title, i) => (
                  <button
                    key={i}
                    onClick={() => scrollToSection(i)}
                    className={`text-left font-sub font-light text-[13px] whitespace-nowrap lg:whitespace-normal py-1.5 px-3 lg:px-0 lg:py-1 border-l-0 lg:border-l-2 transition-all duration-300 ${
                      activeSection === i
                        ? "text-terracotta lg:border-terracotta"
                        : "text-warm-charcoal/60 lg:border-transparent hover:text-warm-charcoal"
                    }`}
                  >
                    {activeSection === i && <span className="hidden lg:inline-block w-1.5 h-1.5 rounded-full bg-terracotta mr-2 align-middle" />}
                    {title}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 max-w-[720px] py-12 px-6 lg:px-12">
            {guide.content.map((block, i) => {
              if (block.type === "h2") {
                h2Index++;
                const currentH2Index = h2Index;
                return (
                  <motion.div
                    key={i}
                    ref={(el) => { sectionRefs.current[currentH2Index] = el; }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5 }}
                    className="mt-16 first:mt-0"
                  >
                    <h2 className="heading-display text-deep-earth text-[36px] md:text-[44px] mb-2">{block.text}</h2>
                    <div className="w-20 h-[1px] bg-gold/40 mb-6" />
                  </motion.div>
                );
              }

              if (block.type === "h3") {
                return <h3 key={i} className="font-sub font-normal text-[18px] text-deep-earth uppercase tracking-[0.15em] mt-10 mb-4">{block.text}</h3>;
              }

              if (block.type === "paragraph") {
                const isFirstAfterH2 = i > 0 && guide.content[i - 1].type === "h2";
                const text = block.text || "";
                return (
                  <p key={i} className="body-text text-warm-charcoal leading-[1.9] mb-5 max-w-[680px]">
                    {isFirstAfterH2 && text.length > 0 ? (
                      <>
                        <span className="font-display text-[72px] float-left leading-[0.8] mr-3 mt-1 text-terracotta">
                          {text[0]}
                        </span>
                        {text.slice(1)}
                      </>
                    ) : (
                      text
                    )}
                  </p>
                );
              }

              if (block.type === "info-box" || block.type === "warning-box") {
                const isWarning = block.type === "warning-box";
                const Icon = block.icon === "warning" ? AlertTriangle : block.icon === "tip" ? Lightbulb : Info;
                return (
                  <div
                    key={i}
                    className={`my-8 p-6 border-l-4 ${isWarning ? "border-gold bg-dust-ivory" : "border-terracotta bg-dust-ivory"}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon size={16} className={isWarning ? "text-gold" : "text-terracotta"} />
                      <span className="font-sub font-normal text-[14px] text-deep-earth uppercase tracking-[0.1em]">
                        {block.title}
                      </span>
                    </div>
                    <p className="body-text text-warm-charcoal text-[15px] leading-[1.8]">{block.text}</p>
                  </div>
                );
              }

              if (block.type === "pull-quote") {
                return (
                  <motion.blockquote
                    key={i}
                    initial={{ opacity: 0, scale: 0.97 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="my-12 mx-auto max-w-[520px] text-center"
                  >
                    <div className="w-20 h-[1px] bg-gold/40 mx-auto mb-6" />
                    <p className="heading-display text-terracotta text-[22px] md:text-[26px] leading-relaxed">
                      "{block.text}"
                    </p>
                    <div className="w-20 h-[1px] bg-gold/40 mx-auto mt-6" />
                  </motion.blockquote>
                );
              }

              if (block.type === "numbered-list") {
                return (
                  <div key={i} className="my-8 space-y-0">
                    {block.items?.map((item, j) => (
                      <motion.div
                        key={j}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: j * 0.1, duration: 0.4 }}
                        className="flex gap-4 items-start py-4 border-b border-faded-sand"
                      >
                        <span className="font-display italic text-[32px] text-gold/80 leading-none mt-1 shrink-0 w-8 text-center">
                          {j + 1}
                        </span>
                        <p className="body-text text-warm-charcoal text-[16px] leading-[1.8]">{item}</p>
                      </motion.div>
                    ))}
                  </div>
                );
              }

              if (block.type === "checklist") {
                return <ChecklistBlock key={i} items={block.items || []} />;
              }

              if (block.type === "phrase-cards" && block.phrases) {
                return (
                  <div key={i} className="my-8 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {block.phrases.map((phrase, j) => (
                      <motion.div
                        key={j}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: j * 0.05, duration: 0.3 }}
                        className="border border-faded-sand p-5 group hover:border-terracotta transition-colors bg-warm-canvas"
                      >
                        <p className="heading-display text-terracotta text-[22px] md:text-[24px] leading-tight">
                          {phrase.swahili}
                        </p>
                        <p className="font-sub font-normal text-[16px] text-deep-earth mt-1">
                          {phrase.english}
                        </p>
                        <div className="flex items-center gap-1.5 mt-2">
                          <Volume2 size={12} className="text-gold/60" />
                          <p className="font-sub font-light text-[13px] text-gold italic">
                            {phrase.pronunciation}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                );
              }

              if (block.type === "comparison-table") {
                return (
                  <div key={i} className="my-8 overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-deep-earth">
                          {block.headers?.map((h, j) => (
                            <th key={j} className="font-sub font-light text-[12px] text-warm-charcoal uppercase tracking-[0.15em] px-4 py-3 text-left">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {block.rows?.map((row, j) => (
                          <tr key={j} className={j % 2 === 0 ? "bg-warm-canvas" : "bg-dust-ivory"}>
                            {row.map((cell, k) => (
                              <td key={k} className="body-text text-warm-charcoal text-[14px] px-4 py-3 border border-faded-sand">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }

              return null;
            })}
          </main>
        </div>
      </section>

      {/* RELATED GUIDES */}
      <section className="bg-deep-earth py-20 noise-overlay relative">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <h2 className="heading-display text-warm-canvas text-[40px] md:text-[48px] mb-12">Continue Planning</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.slice(0, 3).map((g) => (
              <Link
                key={g.slug}
                to={`/travel-resources/${g.slug}`}
                className="block relative h-[320px] overflow-hidden group"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.07]"
                  style={{ backgroundImage: `url(${g.heroImage})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F08]/90 via-[#1A0F08]/30 to-transparent" />
                <div className="absolute bottom-0 left-0 w-0 h-[4px] bg-terracotta transition-all duration-500 group-hover:w-full" />
                <div className="absolute inset-0 p-6 flex flex-col justify-between transition-transform duration-500 group-hover:-translate-y-2">
                  <span className="label-accent text-gold/80 text-[10px]">{categoryLabels[g.category]}</span>
                  <div>
                    <h3 className="heading-display text-warm-canvas text-[24px] md:text-[32px] leading-tight">{g.title}</h3>
                    <span className="label-accent text-terracotta text-[10px] mt-2 block">{g.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="relative py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.15]"
          style={{ backgroundImage: `url(https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1600&q=80)` }}
        />
        <div className="absolute inset-0 bg-warm-canvas/90" />
        <div className="relative z-10 text-center px-6">
          <h2 className="heading-display text-deep-earth text-[48px] md:text-[64px]">Ready to Start Planning?</h2>
          <p className="font-sub font-light text-[16px] text-warm-charcoal mt-4 max-w-lg mx-auto">
            Speak with a Ronjoo safari specialist, we'll build your perfect Tanzania itinerary.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link to="/safaris" className="btn-safari-primary inline-flex items-center gap-2">
              Browse Safaris <ArrowRight size={16} />
            </Link>
            <a
              href="https://wa.me/255747394631"
              className="btn-safari bg-deep-earth text-warm-charcoal inline-flex items-center gap-2 hover:bg-warm-charcoal hover:text-warm-canvas transition-colors"
            >
              <MessageCircle size={16} /> WhatsApp Us Now
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

/* ── Checklist Component ── */
const ChecklistBlock = ({ items }: { items: string[] }) => {
  const [checked, setChecked] = useState<boolean[]>(() => items.map(() => false));

  return (
    <div className="my-8 space-y-0">
      {items.map((item, j) => (
        <button
          key={j}
          onClick={() => setChecked((prev) => prev.map((v, k) => (k === j ? !v : v)))}
          className="flex items-center gap-3 w-full text-left py-3 border-b border-faded-sand group"
        >
          <span
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
              checked[j] ? "bg-terracotta border-terracotta" : "border-faded-sand"
            }`}
          >
            {checked[j] && <Check size={12} className="text-warm-canvas" />}
          </span>
          <span
            className={`body-text text-[16px] transition-all ${
              checked[j] ? "line-through text-warm-charcoal/40" : "text-warm-charcoal"
            }`}
          >
            {item}
          </span>
        </button>
      ))}
    </div>
  );
};

export default TravelGuideDetailPage;
