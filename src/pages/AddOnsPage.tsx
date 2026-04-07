import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, Calendar, UserCheck, Star, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAddOns } from "@/services/publicApi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const wordAnimation = {
  hidden: { opacity: 0, y: -24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.09, duration: 0.5, ease: "easeOut" as const },
  }),
};

const AddOnsPage = () => {
  const { data: addOns = [], isLoading } = useQuery({
    queryKey: ['addOns'],
    queryFn: getAddOns,
  });
  const [activeFilter, setActiveFilter] = useState("all");
  const gridRef = useRef<HTMLDivElement>(null);

  // Keep filter bar order/labels identical to the original frontend.
  const addOnCategories = [
    { label: "All Experiences", value: "all" },
    { label: "In the Air", value: "In the Air" },
    { label: "On the Ground", value: "On the Ground" },
    { label: "Culture", value: "Culture" },
    { label: "Romance", value: "Romance" },
    { label: "Adventure", value: "Adventure" },
  ];

  const filtered = activeFilter === "all"
    ? addOns
    : addOns.filter((a: any) => {
        const fc = a.filterCategory;
        return Array.isArray(fc) ? fc.includes(activeFilter) : fc === activeFilter;
      });

  const titleWords1 = ["Extraordinary"];
  const titleWords2 = ["Extras."];

  // Grid layout: row assignments
  const row1 = filtered.slice(0, 1); // hero
  const row2 = filtered.slice(1, 3);
  const row3 = filtered.slice(3, 6);
  const row4 = filtered.slice(6, 8);
  const row5 = filtered.slice(8, 10);

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

      {/* HERO */}
      <section className="relative h-[75vh] overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(/assets/hero-addonspage.jpg)`,
          }}
          animate={{ scale: [1, 1.06] }}
          transition={{ duration: 14, ease: "easeOut" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(160deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.28) 50%, rgba(0,0,0,0.42) 100%)",
          }}
        />
        <div className="relative h-full flex flex-col justify-end px-6 lg:px-20 pb-16">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-sub font-light text-[11px] uppercase tracking-[0.3em] mb-5"
            style={{ color: "#B8922A" }}
          >
            Enhance Your Safari
          </motion.p>

          <div className="flex flex-wrap gap-x-4">
            {titleWords1.map((word, i) => (
              <motion.span
                key={word}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={wordAnimation}
                className="font-display italic text-[54px] md:text-[96px] leading-[1.05]"
                style={{ color: "#F5EFE0" }}
              >
                {word}
              </motion.span>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-4">
            {titleWords2.map((word, i) => (
              <motion.span
                key={word}
                custom={i + titleWords1.length}
                initial="hidden"
                animate="visible"
                variants={wordAnimation}
                className="font-display italic text-[54px] md:text-[96px] leading-[1.05]"
                style={{ color: "#F5EFE0" }}
              >
                {word}
              </motion.span>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="font-sub font-light text-[18px] max-w-[480px] mt-5 leading-relaxed"
            style={{ color: "rgba(245,239,224,0.7)" }}
          >
            Every safari is already exceptional. These are the moments that make it unforgettable.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            className="font-sub font-light text-[11px] mt-6"
            style={{ color: "rgba(245,239,224,0.45)" }}
          >
            10 Curated Experiences · All Arrangeable by Our Team
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <span className="font-sub font-light text-[9px] uppercase tracking-[0.3em]" style={{ color: "rgba(245,239,224,0.4)" }}>
              Scroll
            </span>
            <motion.div
              className="w-px h-8"
              style={{ background: "rgba(245,239,224,0.3)" }}
              animate={{ scaleY: [1, 0.5, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </section>

      {/* INTRO STRIP */}
      <section className="bg-deep-earth">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-20 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0">
          {[
            { icon: <Calendar size={18} />, title: "Book Anytime", sub: "Add-ons can be added at booking or up to 7 days before departure." },
            { icon: <UserCheck size={18} />, title: "Fully Arranged", sub: "We handle every detail, no separate bookings or logistics on your part." },
            { icon: <Star size={18} />, title: "Private & Exclusive", sub: "All add-ons are private to your group, never shared with other travelers." },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`flex flex-col items-center text-center px-8 ${i < 2 ? "md:border-r" : ""}`}
              style={{ borderColor: "rgba(184,146,42,0.2)" }}
            >
              <div style={{ color: "#B8922A" }}>{item.icon}</div>
              <p className="font-sub font-normal text-[14px] mt-3" style={{ color: "#1A0F08" }}>{item.title}</p>
              <p className="font-sub font-light text-[12px] mt-1 max-w-[280px]" style={{ color: "rgba(0,0,0,0.28)" }}>{item.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FILTER BAR */}
      <section className="bg-warm-canvas px-6 lg:px-20 pt-8">
        <div className="max-w-[1400px] mx-auto flex flex-wrap gap-6 items-center">
          {addOnCategories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveFilter(cat.value)}
              className="relative font-sub font-light text-[12px] uppercase tracking-[0.2em] pb-2 transition-colors"
              style={{ color: activeFilter === cat.value ? "#C4603A" : "#1A0F08" }}
            >
              {cat.label}
              {activeFilter === cat.value && (
                <motion.div
                  layoutId="filter-underline"
                  className="absolute bottom-0 left-0 right-0 h-[2px]"
                  style={{ background: "#C4603A" }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* EDITORIAL GRID */}
      <section className="bg-warm-canvas noise-overlay relative px-6 lg:px-20 pt-10 pb-20">
        <div className="max-w-[1400px] mx-auto" ref={gridRef}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Row 1 - Hero Card */}
              {row1.length > 0 && (
                <div className="mb-5">
                  <HeroCard addon={row1[0]} index={0} />
                </div>
              )}

              {/* Row 2 */}
              {row2.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  {row2.map((a, i) => (
                    <StandardCard key={a.slug} addon={a} index={i + 1} height="400px" />
                  ))}
                </div>
              )}

              {/* Row 3 */}
              {row3.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                  {row3.map((a, i) => (
                    <StandardCard key={a.slug} addon={a} index={i + 3} height="360px" />
                  ))}
                </div>
              )}

              {/* Row 4 */}
              {row4.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-5">
                  {row4.slice(0, 1).map((a, i) => (
                    <div key={a.slug} className="md:col-span-3">
                      <StandardCard addon={a} index={i + 6} height="400px" />
                    </div>
                  ))}
                  {row4.slice(1, 2).map((a, i) => (
                    <div key={a.slug} className="md:col-span-2">
                      <StandardCard addon={a} index={i + 7} height="400px" />
                    </div>
                  ))}
                </div>
              )}

              {/* Row 5 */}
              {row5.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {row5.map((a, i) => (
                    <StandardCard key={a.slug} addon={a} index={i + 8} height="400px" />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* HOW TO ADD */}
      <section className="bg-deep-earth py-20 px-6 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display italic text-[40px] md:text-[56px] text-center mb-16"
            style={{ color: "#F5EFE0" }}
          >
            How to Add an Experience
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Dashed line connecting steps */}
            <div className="hidden md:block absolute top-12 left-[20%] right-[20%] border-t border-dashed" style={{ borderColor: "rgba(196,96,58,0.4)" }} />

            {[
              { num: "01", title: "Tell Us When Booking", desc: "Select your add-ons during the booking process or mention them in your enquiry. No separate booking required.", icon: "💬" },
              { num: "02", title: "We Handle Everything", desc: "Our team arranges all logistics, permits, timing, operators, and integration into your itinerary seamlessly.", icon: "📅" },
              { num: "03", title: "Experience It", desc: "Simply arrive and experience it. Every detail is prepared before you get there.", icon: "⭐" },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="text-center relative"
              >
                <span
                  className="font-display italic text-[110px] absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 select-none"
                  style={{ color: "rgba(245,239,224,0.07)" }}
                >
                  {step.num}
                </span>
                <div className="relative z-10 pt-10">
                  <div className="text-2xl mb-4">{step.icon}</div>
                  <p className="font-sub font-normal text-[16px] mb-3" style={{ color: "#1A0F08" }}>{step.title}</p>
                  <p className="font-sub font-light text-[14px] max-w-[320px] mx-auto" style={{ color: "rgba(0,0,0,0.33)" }}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICE SUMMARY */}
      <section className="bg-warm-canvas py-20 px-6 lg:px-20">
        <div className="max-w-[900px] mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display italic text-[40px] md:text-[48px] text-deep-earth text-center mb-12"
          >
            Quick Reference
          </motion.h2>

          <div>
            {addOns.map((addon, i) => (
              <motion.div
                key={addon.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
              >
                <Link
                  to={`/add-ons/${addon.slug}`}
                  className="group flex items-center justify-between py-[18px] border-b transition-all hover:pl-3"
                  style={{ borderColor: "#D9CDBF" }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-display italic text-[20px] text-deep-earth group-hover:text-terracotta transition-colors">
                      {addon.name}
                    </p>
                    <p className="font-sub font-light text-[13px] text-warm-charcoal truncate">
                      {addon.tagline}
                    </p>
                  </div>
                  <div className="flex items-center gap-6 ml-4 flex-shrink-0">
                    <span className="font-display italic text-[22px]" style={{ color: "#B8922A" }}>
                      {addon.price}
                    </span>
                    <span className="font-sub font-light text-[12px] text-terracotta opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      View Details →
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Info box */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 p-5"
            style={{ background: "#EDE4D0", borderLeft: "3px solid #C4603A" }}
          >
            <p className="font-sub font-light text-[14px] text-warm-charcoal leading-relaxed">
              All prices are in USD per person unless stated. Group discounts available for parties of 5 or more.
              Some add-ons are location-specific, ask us about availability for your itinerary.
            </p>
          </motion.div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="relative h-[50vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(/assets/hero-addonspage.jpg)`,
          }}
        />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.36)" }} />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <motion.h2
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="font-display italic text-[48px] md:text-[72px]"
            style={{ color: "#F5EFE0" }}
          >
            Build Your Perfect Safari.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-sub font-light text-[17px] max-w-[480px] mt-5"
            style={{ color: "rgba(245,239,224,0.7)" }}
          >
            Tell us which experiences speak to you, we'll weave them into your itinerary perfectly.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-4 mt-8"
          >
            <Link to="/plan" className="btn-safari-primary">Plan My Safari</Link>
            <a
              href="https://wa.me/255747394631"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-safari bg-deep-earth text-warm-charcoal border border-warm-charcoal/30 hover:bg-warm-charcoal hover:text-warm-canvas transition-all"
            >
              Chat on WhatsApp
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

/* ============ CARD COMPONENTS ============ */

const HeroCard = ({ addon, index }: { addon: any; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.08, duration: 0.5 }}
  >
    <Link
      to={`/add-ons/${addon.slug}`}
      className="group relative block overflow-hidden"
      style={{ height: "520px" }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.06]"
        style={{ backgroundImage: `url(${addon.heroImages[0]})` }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.05) 100%)",
        }}
      />
      {/* Category badge */}
      <span
        className="absolute top-6 left-6 font-sub font-light text-[10px] uppercase tracking-[0.25em]"
        style={{ color: "#B8922A" }}
      >
        {addon.category}
      </span>
      {/* Price badge */}
      <span
        className="absolute top-6 right-6 font-sub font-light text-[12px] px-4 py-1.5 border"
        style={{ color: "#F5EFE0", borderColor: "#C4603A" }}
      >
        {addon.price} {addon.priceSuffix}
      </span>
      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-8 transition-transform duration-400 group-hover:-translate-y-2.5">
        <h3
          className="font-display italic text-[36px] md:text-[52px] leading-[1.1] mb-3"
          style={{ color: "#F5EFE0" }}
        >
          {addon.name}
        </h3>
        <p className="font-sub font-light text-[15px] mb-3" style={{ color: "rgba(245,239,224,0.7)" }}>
          {addon.tagline}
        </p>
        <div className="flex items-center gap-4 mb-4">
          <span className="font-sub font-light text-[12px]" style={{ color: "rgba(245,239,224,0.55)" }}>
            📍 {addon.location}
          </span>
          <span className="font-sub font-light text-[12px]" style={{ color: "rgba(245,239,224,0.55)" }}>
            ⏱ {addon.duration}
          </span>
        </div>
        <span className="font-sub font-light text-[14px] inline-flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: "#F5EFE0" }}>
          Discover More <span className="transition-transform group-hover:translate-x-1">→</span>
        </span>
      </div>
      {/* Terracotta bar on hover */}
      <div
        className="absolute bottom-0 left-0 w-0 h-[5px] group-hover:w-full transition-all duration-500"
        style={{ background: "#C4603A" }}
      />
    </Link>
  </motion.div>
);

const StandardCard = ({ addon, index, height }: { addon: any; index: number; height: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.08, duration: 0.5 }}
  >
    <Link
      to={`/add-ons/${addon.slug}`}
      className="group relative block overflow-hidden"
      style={{ height }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.06]"
        style={{ backgroundImage: `url(${addon.heroImages[0]})` }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.1) 60%)",
        }}
      />
      <span
        className="absolute top-5 left-5 font-sub font-light text-[10px] uppercase tracking-[0.25em]"
        style={{ color: "#B8922A" }}
      >
        {addon.category}
      </span>
      <span
        className="absolute top-5 right-5 font-sub font-light text-[11px] px-3 py-1 border"
        style={{ color: "#F5EFE0", borderColor: "#C4603A" }}
      >
        {addon.price}
      </span>
      <div className="absolute bottom-0 left-0 right-0 p-6 transition-transform duration-400 group-hover:-translate-y-2">
        <h3
          className="font-display italic text-[26px] md:text-[32px] leading-[1.15] mb-2"
          style={{ color: "#F5EFE0" }}
        >
          {addon.name}
        </h3>
        <p className="font-sub font-light text-[12px] mb-3" style={{ color: "rgba(245,239,224,0.55)" }}>
          ⏱ {addon.duration} · 📍 {addon.location}
        </p>
        <span className="font-sub font-light text-[13px] inline-flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: "#F5EFE0" }}>
          Discover <span className="transition-transform group-hover:translate-x-1">→</span>
        </span>
      </div>
      <div
        className="absolute bottom-0 left-0 w-0 h-[5px] group-hover:w-full transition-all duration-500"
        style={{ background: "#C4603A" }}
      />
    </Link>
  </motion.div>
);

export default AddOnsPage;
