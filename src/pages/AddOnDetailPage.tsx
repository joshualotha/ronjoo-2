import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getAddOnBySlug, getAddOns } from "@/services/publicApi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NotFound from "./NotFound";

const AddOnDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: addon, isLoading } = useQuery({
    queryKey: ['addOn', slug],
    queryFn: () => getAddOnBySlug(slug || ''),
    enabled: !!slug,
  });
  const { data: allAddOns = [] } = useQuery({
    queryKey: ['addOns'],
    queryFn: getAddOns,
  });
  const [heroIdx, setHeroIdx] = useState(0);
  const [isSticky, setIsSticky] = useState(false);
  const infoBarRef = useRef<HTMLDivElement>(null);

  const related = useMemo(() => {
    if (!addon?.relatedSlugs) return [];
    return allAddOns.filter((a: any) => addon.relatedSlugs.includes(a.slug));
  }, [addon, allAddOns]);

  useEffect(() => {
    if (!addon) return;
    const interval = setInterval(() => {
      setHeroIdx((prev) => (prev + 1) % (addon.heroImages || []).length);
    }, 5000);
    return () => clearInterval(interval);
  }, [addon]);

  useEffect(() => {
    const handleScroll = () => {
      if (infoBarRef.current) {
        const rect = infoBarRef.current.getBoundingClientRect();
        setIsSticky(rect.top <= 0);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  if (!addon) return <NotFound />;

  const titleWords = addon.name.split(" ");

  return (
    <div className="min-h-screen bg-warm-canvas">
      <Navbar />

      {/* HERO, 100vh with crossfade images */}
      <section className="relative h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={heroIdx}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1.06 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.2 }, scale: { duration: 14, ease: "easeOut" } }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${addon.heroImages[heroIdx]})` }}
          />
        </AnimatePresence>
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(160deg, rgba(0,0,0,0.07) 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.45) 100%)",
          }}
        />

        <div className="relative h-full flex flex-col justify-end px-6 lg:px-20 pb-16">
          {/* Breadcrumb */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-sub font-light text-[11px] mb-8"
            style={{ color: "rgba(245,239,224,0.45)" }}
          >
            <Link to="/safaris" className="hover:text-warm-canvas transition-colors">Safaris</Link>
            {" / "}
            <Link to="/add-ons" className="hover:text-warm-canvas transition-colors">Add-Ons</Link>
            {" / "}
            {addon.name}
          </motion.p>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-sub font-light text-[11px] uppercase tracking-[0.3em] mb-4"
            style={{ color: "#B8922A" }}
          >
            {addon.category}
          </motion.span>

          <div className="flex flex-wrap gap-x-4">
            {titleWords.map((word, i) => (
              <motion.span
                key={`${word}-${i}`}
                initial={{ opacity: 0, y: -24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.09, duration: 0.5 }}
                className="font-display italic text-[52px] md:text-[92px] leading-[1.05]"
                style={{ color: "#F5EFE0" }}
              >
                {word}
              </motion.span>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="font-sub font-light text-[18px] max-w-[500px] mt-5 leading-relaxed"
            style={{ color: "rgba(245,239,224,0.7)" }}
          >
            {addon.tagline}
          </motion.p>

          {/* Detail row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="flex flex-wrap items-center gap-3 mt-5"
          >
            {[addon.duration, addon.location, addon.groupSize].map((tag, i) => (
              <span key={i} className="flex items-center gap-1">
                <span className="font-sub font-light text-[12px]" style={{ color: "rgba(245,239,224,0.55)" }}>{tag}</span>
                {i < 2 && <span style={{ color: "#C4603A" }}>·</span>}
              </span>
            ))}
          </motion.div>

          {/* Price + CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex flex-wrap items-end gap-8 mt-8"
          >
            <div>
              <span className="font-sub font-light text-[11px] uppercase tracking-[0.15em] block" style={{ color: "rgba(245,239,224,0.5)" }}>
                Add from
              </span>
              <span className="font-display italic text-[44px]" style={{ color: "#B8922A" }}>
                {addon.price}
              </span>
              <span className="font-sub font-light text-[13px] ml-2" style={{ color: "rgba(245,239,224,0.6)" }}>
                {addon.priceSuffix}
              </span>
            </div>
            <Link to="/plan" className="btn-safari-primary">Add to My Safari</Link>
            <Link to="/contact" className="btn-safari border text-warm-canvas" style={{ borderColor: "rgba(245,239,224,0.5)" }}>
              Ask a Question
            </Link>
          </motion.div>

          {/* Availability */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="absolute bottom-6 right-6 font-sub font-light text-[11px] hidden lg:block"
            style={{ color: "rgba(245,239,224,0.45)" }}
          >
            {addon.bestSeason}
          </motion.p>
        </div>
      </section>

      {/* QUICK INFO BAR */}
      <div ref={infoBarRef}>
        <section
          className={`bg-deep-earth transition-all ${isSticky ? "sticky top-0 z-40" : ""}`}
        >
          <div className="max-w-[1400px] mx-auto px-6 lg:px-20 py-4 flex flex-wrap items-center justify-between gap-4">
            {[
              { label: "Duration", value: addon.duration },
              { label: "Location", value: addon.location },
              { label: "Group", value: addon.groupSize },
              { label: "Best Season", value: addon.bestSeason },
              { label: "Price", value: `${addon.price} ${addon.priceSuffix || ""}` },
            ].map((fact) => (
              <div key={fact.label} className="text-center">
                <p className="font-sub font-light text-[10px] uppercase tracking-[0.2em]" style={{ color: "#B8922A" }}>{fact.label}</p>
                <p className="font-sub font-light text-[13px] mt-0.5" style={{ color: "#1A0F08" }}>{fact.value}</p>
              </div>
            ))}
            {isSticky && (
              <Link to="/plan" className="btn-safari text-[11px] px-5 py-2 bg-terracotta text-warm-canvas">
                Add to Safari
              </Link>
            )}
          </div>
        </section>
      </div>

      {/* THE EXPERIENCE */}
      <section className="bg-warm-canvas noise-overlay relative py-20 px-6 lg:px-20">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-5 gap-16">
          {/* Left 60% */}
          <div className="lg:col-span-3">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-sub font-light text-[11px] uppercase tracking-[0.3em] mb-4"
              style={{ color: "#B8922A" }}
            >
              The Experience
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display italic text-[36px] md:text-[52px] text-warm-charcoal mb-4"
            >
              {addon.name}
            </motion.h2>
            <div className="w-[100px] h-px mb-10" style={{ background: "#B8922A", opacity: 0.4 }} />

            {/* Prose with drop cap */}
            {addon.overviewProse.map((para, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`font-body font-light text-[17px] text-warm-charcoal leading-[1.9] mb-6 ${i === 0 ? "first-letter:font-display first-letter:italic first-letter:text-[72px] first-letter:text-terracotta first-letter:float-left first-letter:mr-3 first-letter:leading-[0.8] first-letter:mt-1" : ""}`}
              >
                {para}
              </motion.p>
            ))}

            {/* Included */}
            <div className="mt-12">
              <h3 className="font-sub font-normal text-[14px] text-warm-charcoal uppercase tracking-[0.15em] mb-4">What's Included</h3>
              <div className="space-y-2.5">
                {addon.included.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-sage mt-0.5">✓</span>
                    <span className="font-sub font-light text-[14px] text-warm-charcoal">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Not Included */}
            <div className="mt-8">
              <h3 className="font-sub font-normal text-[14px] text-warm-charcoal uppercase tracking-[0.15em] mb-4">Not Included</h3>
              <div className="space-y-2.5">
                {addon.notIncluded.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span style={{ color: "rgba(245,239,224,0.4)" }}>✗</span>
                    <span className="font-sub font-light text-[14px]" style={{ color: "rgba(107,92,78,0.7)" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right 40% */}
          <div className="lg:col-span-2">
            {/* Image with terracotta backing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative mb-8"
            >
              <div className="absolute -bottom-3 -right-3 inset-0" style={{ background: "#C4603A" }} />
              <img
                src={addon.heroImages[1] || addon.heroImages[0]}
                alt={addon.name}
                className="relative w-full h-[400px] object-cover"
              />
            </motion.div>

            {/* Pull quote - moved up to replace details card space */}
            <motion.blockquote
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-display italic text-[20px] text-terracotta max-w-[280px] mt-8 leading-relaxed"
            >
              "{addon.pullQuote}"
            </motion.blockquote>
          </div>
        </div>
      </section>

      {/* ADD TO SAFARI CTA */}
      <section className="bg-deep-earth py-20 px-6 lg:px-20 text-center">
        <div className="max-w-[600px] mx-auto">
          <motion.h2
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="font-display italic text-[40px] md:text-[56px]"
            style={{ color: "#1A0F08" }}
          >
            Add This to Your Safari
          </motion.h2>

          <div className="mt-6">
            <span className="font-display italic text-[44px]" style={{ color: "#B8922A" }}>
              {addon.price}
            </span>
            <span className="font-sub font-light text-[14px] ml-2" style={{ color: "rgba(0,0,0,0.3)" }}>
              {addon.priceSuffix}
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link to="/plan" className="btn-safari-primary">Add to My Safari</Link>
            <Link to="/contact" className="btn-safari border text-warm-canvas" style={{ borderColor: "rgba(245,239,224,0.5)" }}>
              Ask Our Team
            </Link>
          </div>
        </div>
      </section>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="bg-warm-canvas py-20 px-6 lg:px-20">
          <div className="max-w-[1400px] mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display italic text-[36px] md:text-[48px] text-warm-charcoal text-center mb-12"
            >
              You Might Also Love
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.slice(0, 3).map((rel, i) => (
                <motion.div
                  key={rel.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={`/add-ons/${rel.slug}`}
                    className="group relative block overflow-hidden"
                    style={{ height: "360px" }}
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.06]"
                      style={{ backgroundImage: `url(${rel.heroImages[0]})` }}
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(to top, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.1) 60%)" }}
                    />
                    <span className="absolute top-5 left-5 font-sub font-light text-[10px] uppercase tracking-[0.25em]" style={{ color: "#B8922A" }}>
                      {rel.category}
                    </span>
                    <span className="absolute top-5 right-5 font-sub font-light text-[11px] px-3 py-1 border" style={{ color: "#F5EFE0", borderColor: "#C4603A" }}>
                      {rel.price}
                    </span>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="font-display italic text-[28px] leading-[1.15] mb-2" style={{ color: "#F5EFE0" }}>
                        {rel.name}
                      </h3>
                      <span className="font-sub font-light text-[12px]" style={{ color: "rgba(245,239,224,0.55)" }}>
                        ⏱ {rel.duration}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 w-0 h-[5px] group-hover:w-full transition-all duration-500" style={{ background: "#C4603A" }} />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default AddOnDetailPage;
