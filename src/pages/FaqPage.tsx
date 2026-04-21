import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, X, Mail, FileText, MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getFaqs } from "@/services/publicApi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/seo/SEO";

interface FaqItem {
  question: string;
  answer: string;
  relatedGuide?: { label: string; href: string };
  relatedSafari?: { label: string; href: string };
}

interface FaqCategory {
  id: string;
  name: string;
  icon: string;
  teaser: string;
  questions: FaqItem[];
}


/* ── Category SVG Icons ── */
const CategoryIcon = ({ icon, size = 32, className = "" }: { icon: string; size?: number; className?: string }) => {
  const s = size;
  switch (icon) {
    case "compass":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className}>
          <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="16" cy="16" r="2" fill="currentColor" />
          <polygon points="16,4 18,14 16,16 14,14" fill="currentColor" opacity="0.8" />
          <polygon points="16,28 14,18 16,16 18,18" fill="currentColor" opacity="0.4" />
          <polygon points="4,16 14,14 16,16 14,18" fill="currentColor" opacity="0.6" />
          <polygon points="28,16 18,18 16,16 18,14" fill="currentColor" opacity="0.3" />
        </svg>
      );
    case "calendar":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className}>
          <rect x="4" y="6" width="24" height="22" rx="1" stroke="currentColor" strokeWidth="1.2" />
          <line x1="4" y1="12" x2="28" y2="12" stroke="currentColor" strokeWidth="1.2" />
          <line x1="10" y1="4" x2="10" y2="8" stroke="currentColor" strokeWidth="1.2" />
          <line x1="22" y1="4" x2="22" y2="8" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="11" cy="18" r="1.5" fill="currentColor" opacity="0.5" />
          <circle cx="16" cy="18" r="1.5" fill="currentColor" opacity="0.5" />
          <circle cx="21" cy="18" r="1.5" fill="currentColor" opacity="0.5" />
          <circle cx="11" cy="23" r="1.5" fill="currentColor" opacity="0.5" />
        </svg>
      );
    case "shield":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className}>
          <path d="M16 3L4 8v8c0 7.5 5.1 14.5 12 16 6.9-1.5 12-8.5 12-16V8L16 3z" stroke="currentColor" strokeWidth="1.2" />
          <path d="M12 16l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "binoculars":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className}>
          <circle cx="10" cy="22" r="6" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="22" cy="22" r="6" stroke="currentColor" strokeWidth="1.2" />
          <path d="M10 16V8a2 2 0 012-2h0a2 2 0 012 2v8" stroke="currentColor" strokeWidth="1.2" />
          <path d="M18 16V8a2 2 0 012-2h0a2 2 0 012 2v8" stroke="currentColor" strokeWidth="1.2" />
          <line x1="14" y1="14" x2="18" y2="14" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      );
    case "mountain":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className}>
          <path d="M2 28L12 8l5 8 5-4 8 16H2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M10 18l2-3 3 4" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          <circle cx="24" cy="6" r="3" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        </svg>
      );
    case "dhow":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className}>
          <path d="M4 24h24" stroke="currentColor" strokeWidth="1.2" />
          <path d="M8 24l2-12h0l6 12" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M10 12c0 0 8-3 14 0" stroke="currentColor" strokeWidth="1.2" />
          <path d="M10 12V8" stroke="currentColor" strokeWidth="1.2" />
          <path d="M3 27c2-2 4-2 6 0s4 2 6 0 4-2 6 0 4 2 6 0" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        </svg>
      );
    case "leaf":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className}>
          <path d="M8 28C8 28 6 16 16 8c10-2 12 4 12 4S24 24 16 28" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M8 28c4-4 8-8 20-16" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          <path d="M14 20c2-2 4-3 6-3" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        </svg>
      );
    case "handshake":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" className={className}>
          <path d="M4 14l6-6h4l4 4-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M28 14l-6-6h-4l-4 4 6 6" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M12 18l4 4 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="2" y1="14" x2="8" y2="14" stroke="currentColor" strokeWidth="1.2" />
          <line x1="24" y1="14" x2="30" y2="14" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      );
    default:
      return null;
  }
};

/* ── Highlight matching text ── */
const HighlightText = ({ text, query }: { text: string; query: string }) => {
  if (!query.trim()) return <>{text}</>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} className="bg-terracotta text-warm-canvas px-1">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};

/* ── Parse markdown-like bold ── */
const RichAnswer = ({ text }: { text: string }) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-bold text-foreground">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
};

/* ── Single FAQ Item ── */
const FaqAccordionItem = ({
  item,
  index,
  isOpen,
  onToggle,
  searchQuery,
}: {
  item: FaqItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  searchQuery: string;
}) => {
  const num = String(index + 1).padStart(2, "0");

  return (
    <div
      className={`border-faded-sand transition-all duration-200 ${index === 0 ? "border-t" : ""} border-b group`}
    >
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-4 py-5 px-0 text-left transition-all duration-200 hover:bg-dust-ivory ${
          isOpen ? "bg-dust-ivory" : ""
        }`}
        style={{ borderLeft: isOpen ? "3px solid hsl(15, 55%, 50%)" : "3px solid transparent" }}
      >
        <span className="font-display italic text-lg text-gold/50 w-12 flex-shrink-0 text-center">
          {num}
        </span>
        <span className="font-display italic text-xl text-foreground flex-1 leading-snug">
          <HighlightText text={item.question} query={searchQuery} />
        </span>
        <span
          className={`text-gold transition-all duration-300 flex-shrink-0 ml-6 ${
            isOpen ? "text-terracotta rotate-45" : ""
          }`}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <line x1="9" y1="2" x2="9" y2="16" stroke="currentColor" strokeWidth="1.5" />
            <line x1="2" y1="9" x2="16" y2="9" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="overflow-hidden"
            style={{ borderLeft: "3px solid hsl(15, 55%, 50%)" }}
          >
            <div className="pb-6 pl-16 pr-4 max-w-[720px]">
              <p className="font-body font-light text-[15px] text-warm-charcoal leading-[1.85]">
                <RichAnswer text={item.answer} />
              </p>
              {item.relatedGuide && (
                <div className="mt-4">
                  <Link
                    to={item.relatedGuide.href}
                    className="font-sub text-[13px] text-terracotta hover:underline"
                  >
                    → Read our full guide: {item.relatedGuide.label}
                  </Link>
                </div>
              )}
              {item.relatedSafari && (
                <div className="mt-3">
                  <Link
                    to={item.relatedSafari.href}
                    className="font-sub text-[13px] text-terracotta hover:underline"
                  >
                    → View safari: {item.relatedSafari.label}
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Main FAQ Page ── */
const FaqPage = () => {
  const { data: faqCategories = [], isLoading } = useQuery({
    queryKey: ['faqs'],
    queryFn: getFaqs,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [highlightedCategory, setHighlightedCategory] = useState<string | null>(null);
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Set initial active category when data loads
  useEffect(() => {
    if (faqCategories.length > 0 && !activeCategory) {
      setActiveCategory(faqCategories[0].id || faqCategories[0].slug);
    }
  }, [faqCategories, activeCategory]);

  const popularTags = ["visa requirements", "best time", "what to pack", "malaria", "solo travel", "payment", "cancellation", "children"];

  const heroWords1 = "Every Question".split(" ");
  const heroWords2 = "Answered.".split(" ");

  // Filter questions
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return faqCategories;
    const q = searchQuery.toLowerCase();
    return faqCategories
      .map((cat: any) => ({
        ...cat,
        questions: (cat.questions || []).filter(
          (faq: any) =>
            faq.question.toLowerCase().includes(q) ||
            faq.answer.toLowerCase().includes(q)
        ),
      }))
      .filter((cat: any) => (cat.questions || []).length > 0);
  }, [searchQuery, faqCategories]);

  const totalMatching = useMemo(
    () => filteredCategories.reduce((sum: number, cat: any) => sum + (cat.questions || []).length, 0),
    [filteredCategories]
  );

  // Toggle accordion
  const toggleItem = useCallback((key: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const expandAllInCategory = useCallback(
    (cat: FaqCategory) => {
      setOpenItems((prev) => {
        const next = new Set(prev);
        cat.questions.forEach((_, i) => next.add(`${cat.id}-${i}`));
        return next;
      });
    },
    []
  );

  const collapseAllInCategory = useCallback(
    (cat: FaqCategory) => {
      setOpenItems((prev) => {
        const next = new Set(prev);
        cat.questions.forEach((_, i) => next.delete(`${cat.id}-${i}`));
        return next;
      });
    },
    []
  );

  const isCategoryAllOpen = (cat: FaqCategory) =>
    cat.questions.every((_, i) => openItems.has(`${cat.id}-${i}`));

  // Scroll category into view
  const scrollToCategory = (id: string) => {
    const el = categoryRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setHighlightedCategory(id);
      setTimeout(() => setHighlightedCategory(null), 1500);
    }
  };

  // IntersectionObserver for active sidebar
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    faqCategories.forEach((cat) => {
      const el = categoryRefs.current[cat.id];
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveCategory(cat.id);
        },
        { rootMargin: "-120px 0px -60% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const schemaData = faqCategories.length > 0 ? JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqCategories.flatMap((cat: any) => (cat.questions || []).map((q: any) => ({
      "@type": "Question",
      "name": q.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.answer
      }
    })))
  }) : undefined;

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Frequently Asked Questions | Ronjoo Safaris"
        description="Find answers to all your Tanzania safari questions including visas, what to pack, and safety."
        url="https://ronjoosafaris.com/faq"
        canonicalUrl="https://ronjoosafaris.com/faq"
        type="website"
        schema={schemaData}
      />
      <Navbar />

      {/* ─── HERO ─── */}
      <section className="relative h-[75vh] flex items-end justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(/assets/hero-faqpage.jpg)`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.39) 100%)",
          }}
        />
        <div className="relative z-10 text-center pb-16 px-6 max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-sub font-light text-[11px] text-gold uppercase tracking-[0.3em] mb-6"
          >
            Ronjoo Safaris
          </motion.p>

          <h1 className="font-display italic text-warm-canvas leading-none mb-6">
            <span className="block text-[52px] md:text-[92px]">
              {heroWords1.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: -24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.09 }}
                  className="inline-block mr-[0.3em]"
                >
                  {word}
                </motion.span>
              ))}
            </span>
            <span className="block text-[52px] md:text-[92px]">
              {heroWords2.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: -24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + (heroWords1.length + i) * 0.09 }}
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
            transition={{ delay: 0.9 }}
            className="font-sub font-light text-[17px] text-warm-canvas/70 max-w-[520px] mx-auto mb-8"
          >
            Planning a safari involves real decisions. We believe in giving you real, honest answers, not brochure speak.
          </motion.p>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            {["80+ Questions Answered", "Updated March 2026", "Written by Our Safari Team"].map(
              (stat, i) => (
                <motion.span
                  key={stat}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 + i * 0.1 }}
                  className="font-sub font-light text-[12px] text-warm-canvas/50"
                >
                  {i > 0 && <span className="text-terracotta mr-3">·</span>}
                  {stat}
                </motion.span>
              )
            )}
          </div>
        </div>
      </section>

      {/* ─── SEARCH BAR ─── */}
      <section className="section-dark noise-overlay relative py-12">
        <div className="relative z-10 max-w-[1400px] mx-auto px-6">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-sub font-light text-[10px] text-gold uppercase tracking-[0.3em] text-center mb-4"
          >
            Search All Questions
          </motion.p>

          <div className="max-w-[680px] mx-auto">
            <div
              className="relative flex items-center h-[58px] border transition-all duration-300 focus-within:border-gold/90 focus-within:shadow-[0_0_0_4px_rgba(184,146,42,0.10)]"
              style={{
                background: "rgba(0,0,0,0.03)",
                borderColor: "rgba(184,146,42,0.35)",
              }}
            >
              <Search className="absolute left-5 text-gold" size={16} />
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Try 'malaria', 'deposit', 'best time', 'solo travel', 'children'..."
                className="w-full h-full bg-transparent pl-12 pr-20 font-sub font-light text-[16px] text-warm-charcoal placeholder:text-warm-charcoal/45 outline-none"
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-5 text-warm-charcoal/40 hover:text-warm-charcoal transition-colors"
                >
                  <X size={16} />
                </button>
              ) : (
                <span className="absolute right-5 font-sub font-light text-[11px] text-warm-charcoal/25">
                  ⌘K
                </span>
              )}
            </div>

            {searchQuery && (
              <p className="font-sub font-light text-[12px] text-warm-charcoal/40 mt-3 text-center">
                Showing {totalMatching} matching question{totalMatching !== 1 ? "s" : ""}
              </p>
            )}

            {searchQuery && totalMatching === 0 && (
              <div className="text-center mt-8">
                <p className="font-display italic text-2xl text-warm-canvas/60">
                  No questions match that search.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    const el = document.getElementById("faq-cta");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="font-sub text-[13px] text-terracotta mt-3 hover:underline"
                >
                  Can't find your answer? Ask us directly →
                </button>
              </div>
            )}

            {/* Popular tags */}
            <div className="flex items-center flex-wrap gap-2 mt-5 justify-center">
              <span className="font-sub font-light text-[11px] text-warm-charcoal/40 mr-1">
                Popular:
              </span>
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className="border border-terracotta/50 font-sub font-light text-[11px] text-warm-charcoal uppercase tracking-[0.15em] px-3 py-1.5 hover:bg-terracotta hover:text-warm-canvas transition-all duration-200"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CATEGORY NAVIGATION ─── */}
      <section className="bg-background noise-overlay relative py-14">
        <div className="relative z-10 max-w-[1400px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display italic text-[52px] text-foreground">Browse by Topic</h2>
            <div className="w-[100px] h-px bg-gold mx-auto mt-4" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {faqCategories.map((cat, i) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                onClick={() => scrollToCategory(cat.id)}
                className="group bg-dust-ivory border border-gold/15 p-8 text-center flex flex-col items-center hover:border-terracotta/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.04)]"
              >
                <div className="text-gold group-hover:text-terracotta group-hover:scale-110 transition-all duration-300">
                  <CategoryIcon icon={cat.icon} size={32} />
                </div>
                <h3 className="font-display italic text-[22px] text-warm-charcoal mt-4">
                  {cat.name}
                </h3>
                <p className="font-sub font-light text-[11px] text-gold uppercase tracking-[0.15em] mt-2">
                  {(cat.questions ?? []).length} questions
                </p>
                <p className="font-sub font-light text-[12px] text-warm-charcoal/50 mt-2">
                  {cat.teaser}
                </p>
                <span className="font-sub font-light text-[12px] text-terracotta mt-auto pt-4 group-hover:translate-x-1 transition-transform duration-200">
                  Browse Questions →
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ BODY ─── */}
      <section className="bg-background noise-overlay relative py-16">
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 flex gap-12">
          {/* Sticky Sidebar, desktop only */}
          <aside className="hidden lg:block w-[220px] flex-shrink-0">
            <div className="sticky top-20 border-r border-faded-sand pr-8">
              <p className="font-sub font-light text-[10px] text-gold uppercase tracking-[0.3em] mb-5">
                Categories
              </p>
              <nav className="flex flex-col gap-3">
                {faqCategories.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => scrollToCategory(cat.id)}
                      className="flex items-center gap-3 text-left group transition-colors duration-200"
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-200 ${
                          isActive ? "bg-terracotta scale-125" : "bg-faded-sand group-hover:bg-gold"
                        }`}
                      />
                      <span
                        className={`font-sub font-light text-[14px] transition-colors duration-200 ${
                          isActive
                            ? "text-terracotta"
                            : "text-warm-charcoal group-hover:text-foreground"
                        }`}
                      >
                        {cat.name}
                      </span>
                      <span className="font-sub font-light text-[11px] text-gold/60 ml-auto">
                        ({(cat.questions ?? []).length})
                      </span>
                    </button>
                  );
                })}
              </nav>

              <div className="border-t border-faded-sand mt-6 pt-6">
                <p className="font-sub font-light text-[13px] text-warm-charcoal mb-2">
                  Didn't find your answer?
                </p>
                <a
                  href="https://wa.me/255747394631"
                  className="font-sub text-[13px] text-terracotta hover:underline inline-flex items-center gap-1"
                >
                  <MessageCircle size={12} /> Chat with our team →
                </a>
              </div>
            </div>
          </aside>

          {/* FAQ Content */}
          <div className="flex-1 min-w-0">
            {filteredCategories.map((cat, catIdx) => {
              const allOpen = isCategoryAllOpen(cat);
              return (
                <div
                  key={cat.id}
                  ref={(el) => (categoryRefs.current[cat.id] = el)}
                  className={`scroll-mt-24 transition-colors duration-1000 ${
                    catIdx > 0 ? "mt-20" : ""
                  } ${highlightedCategory === cat.id ? "bg-terracotta/[0.08]" : ""}`}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-between mb-8"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-gold">
                        <CategoryIcon icon={cat.icon} size={24} />
                      </span>
                      <h3 className="font-display italic text-[36px] md:text-[48px] text-foreground leading-none">
                        {cat.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="hidden md:block font-sub font-light text-[11px] text-gold uppercase tracking-[0.15em]">
                        {(cat.questions ?? []).length} Questions
                      </span>
                      <button
                        onClick={() =>
                          allOpen ? collapseAllInCategory(cat) : expandAllInCategory(cat)
                        }
                        className="font-sub font-light text-[12px] text-terracotta hover:underline"
                      >
                        {allOpen ? "Collapse All" : "Expand All"}
                      </button>
                    </div>
                  </motion.div>

                  <div className="w-[80px] h-px bg-gold mb-8" />

                  {cat.questions.map((item, i) => (
                    <FaqAccordionItem
                      key={`${cat.id}-${i}`}
                      item={item}
                      index={i}
                      isOpen={openItems.has(`${cat.id}-${i}`)}
                      onToggle={() => toggleItem(`${cat.id}-${i}`)}
                      searchQuery={searchQuery}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── STILL HAVE QUESTIONS? ─── */}
      <section id="faq-cta" className="section-dark noise-overlay relative py-20">
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="font-display italic text-[48px] md:text-[64px] text-warm-charcoal"
          >
            Still Have Questions?
          </motion.h2>
          <p className="font-sub font-light text-[16px] text-warm-charcoal/65 max-w-[500px] mx-auto mt-4 mb-12">
            Our safari specialists are based in Arusha and available Monday to Saturday, 8am to 7pm
            EAT. We answer WhatsApp messages 7 days a week.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* WhatsApp */}
            <a
              href="https://wa.me/255747394631"
              className="group border border-gold/20 p-8 text-center hover:border-gold hover:-translate-y-1 transition-all duration-300"
              style={{ background: "rgba(0,0,0,0.02)" }}
            >
              <div className="flex justify-center mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#25D366">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <h3 className="font-display italic text-2xl text-warm-charcoal">WhatsApp Us</h3>
              <p className="font-sub font-light text-lg text-gold mt-2">+255 747 394 631</p>
              <p className="font-sub font-light text-[12px] text-warm-charcoal/50 mt-2">
                Fastest response, usually within 1 hour
              </p>
              <span className="inline-block mt-4 bg-terracotta text-warm-charcoal font-sub font-light text-[12px] uppercase tracking-[0.15em] px-6 py-2.5">
                Open WhatsApp →
              </span>
            </a>

            {/* Email */}
            <a
              href="mailto:info@ronjoosafaris.co.tz"
              className="group border border-gold/20 p-8 text-center hover:border-gold hover:-translate-y-1 transition-all duration-300"
              style={{ background: "rgba(0,0,0,0.02)" }}
            >
              <div className="flex justify-center mb-4">
                <Mail className="text-gold" size={28} strokeWidth={1.2} />
              </div>
              <h3 className="font-display italic text-2xl text-warm-charcoal">Email Our Team</h3>
              <p className="font-sub font-light text-lg text-gold mt-2">info@ronjoosafaris.co.tz</p>
              <p className="font-sub font-light text-[12px] text-warm-charcoal/50 mt-2">
                We respond within 4 hours during business hours
              </p>
              <span className="inline-block mt-4 border border-terracotta text-warm-charcoal font-sub font-light text-[12px] uppercase tracking-[0.15em] px-6 py-2.5 group-hover:bg-terracotta transition-colors">
                Send Email →
              </span>
            </a>

            {/* Plan */}
            <Link
              to="/plan"
              className="group border border-gold/20 p-8 text-center hover:border-gold hover:-translate-y-1 transition-all duration-300"
              style={{ background: "rgba(0,0,0,0.02)" }}
            >
              <div className="flex justify-center mb-4">
                <FileText className="text-gold" size={28} strokeWidth={1.2} />
              </div>
              <h3 className="font-display italic text-2xl text-warm-charcoal">Plan My Safari</h3>
              <p className="font-sub font-light text-lg text-gold mt-2">
                Tell us your dream itinerary
              </p>
              <p className="font-sub font-light text-[12px] text-warm-charcoal/50 mt-2">
                Receive a custom quote within 24 hours
              </p>
              <span className="inline-block mt-4 bg-terracotta text-warm-charcoal font-sub font-light text-[12px] uppercase tracking-[0.15em] px-6 py-2.5">
                Start Planning →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── BOTTOM CTA STRIP ─── */}
      <section className="bg-terracotta">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          <p className="font-display italic text-2xl text-warm-canvas">
            Ready to start planning your Tanzania safari?
          </p>
          <Link
            to="/safaris"
            className="hidden md:inline-block border border-warm-canvas text-warm-canvas font-sub font-light text-[13px] uppercase tracking-[0.15em] px-6 py-2.5 hover:bg-warm-canvas hover:text-terracotta transition-all duration-300"
          >
            Browse All Safaris →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FaqPage;
