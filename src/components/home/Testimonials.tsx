import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, Star, X, Send } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getReviews, submitReview } from "@/services/publicApi";
import { ApiError } from "@/services/api";

const Testimonials = () => {
  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews'],
    queryFn: getReviews,
  });
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [form, setForm] = useState({
    guestName: "",
    country: "",
    countryFlag: "🌍",
    safariName: "",
    rating: 5,
    fullText: "",
  });

  // Map API reviews to testimonial shape
  const testimonials = useMemo(() => reviews.map((r: any) => ({
    id: r.id,
    name: r.guestName,
    country: r.country,
    flag: r.countryFlag || '',
    safari: r.safariName,
    text: r.fullText || r.excerpt || '',
  })), [reviews]);

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [current, setCurrent] = useState(0);
  const smallTestimonials = testimonials.slice(1);

  useEffect(() => {
    if (smallTestimonials.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % smallTestimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [smallTestimonials.length]);

  if (testimonials.length === 0) return null;

  const featured = testimonials[0];

  return (
    <section className="section-light noise-overlay relative py-24 md:py-32">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="heading-display text-warm-charcoal text-[48px] md:text-[64px]"
          >
            Stories from the Field
          </motion.h2>
          <div className="gold-rule mt-6" />
          <div className="mt-8">
            <button
              onClick={() => { setSubmitError(null); setShowForm(true); }}
              className="btn-safari-outline text-[12px]"
            >
              Leave a Review
            </button>
          </div>
        </div>

        <div ref={ref}>
          {/* Featured */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            {/* Avatar */}
            <div className="w-20 h-20 mx-auto mb-8 rounded-full border-2 border-terracotta/40 bg-dust-ivory flex items-center justify-center">
              <span className="font-display italic text-warm-charcoal/40 text-[24px]">
                {featured.flag}
              </span>
            </div>
            <p className="heading-display text-warm-charcoal text-[20px] md:text-[22px] leading-relaxed italic">
              "{featured.text}"
            </p>
            <p className="heading-sub text-gold text-[12px] mt-8">
              {featured.name}
            </p>
            <p className="font-body font-light text-warm-charcoal/50 text-[14px] mt-1">
              {featured.country} · {featured.safari}
            </p>
          </motion.div>

          {/* Smaller reviews carousel */}
          <div className="relative">
            <div className="flex items-center gap-4 justify-center">
              <button
                onClick={() =>
                  setCurrent(
                    (prev) =>
                      (prev - 1 + smallTestimonials.length) %
                      smallTestimonials.length
                  )
                }
                className="text-warm-charcoal/30 hover:text-terracotta transition-colors"
              >
                <ChevronLeft size={24} strokeWidth={1} />
              </button>

              <div className="overflow-hidden max-w-2xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="text-center px-8 py-6"
                  >
                    <p className="font-body font-light text-warm-charcoal/70 text-[16px] leading-relaxed italic">
                      "{smallTestimonials[current].text}"
                    </p>
                    <p className="heading-sub text-gold text-[11px] mt-6">
                      {smallTestimonials[current].name}{" "}
                      {smallTestimonials[current].flag}
                    </p>
                    <p className="font-body text-warm-charcoal/40 text-[13px] mt-1">
                      {smallTestimonials[current].safari}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <button
                onClick={() =>
                  setCurrent(
                    (prev) => (prev + 1) % smallTestimonials.length
                  )
                }
                className="text-warm-charcoal/30 hover:text-terracotta transition-colors"
              >
                <ChevronRight size={24} strokeWidth={1} />
              </button>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {smallTestimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i === current ? "bg-terracotta" : "bg-faded-sand"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Review submission modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-[560px] bg-warm-canvas border border-faded-sand p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="heading-display text-warm-charcoal text-[28px]">Leave a Review</h3>
                <button onClick={() => setShowForm(false)} className="text-warm-charcoal/60 hover:text-warm-charcoal">
                  <X size={18} />
                </button>
              </div>

              {submitError && (
                <div className="border border-terracotta/30 bg-terracotta/5 px-4 py-3 mb-4">
                  <p className="font-sub font-light text-terracotta text-[13px]">{submitError}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-accent text-warm-charcoal/50 text-[10px] block mb-2">Name *</label>
                  <input
                    value={form.guestName}
                    onChange={(e) => setForm((p) => ({ ...p, guestName: e.target.value }))}
                    disabled={isSubmitting}
                    className="w-full bg-transparent border border-faded-sand px-4 py-3 font-sub font-light text-warm-charcoal text-[14px] focus:outline-none focus:border-terracotta transition-colors disabled:opacity-60"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="label-accent text-warm-charcoal/50 text-[10px] block mb-2">Country</label>
                  <input
                    value={form.country}
                    onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))}
                    disabled={isSubmitting}
                    className="w-full bg-transparent border border-faded-sand px-4 py-3 font-sub font-light text-warm-charcoal text-[14px] focus:outline-none focus:border-terracotta transition-colors disabled:opacity-60"
                    placeholder="e.g. USA"
                  />
                </div>
                <div>
                  <label className="label-accent text-warm-charcoal/50 text-[10px] block mb-2">Safari</label>
                  <input
                    value={form.safariName}
                    onChange={(e) => setForm((p) => ({ ...p, safariName: e.target.value }))}
                    disabled={isSubmitting}
                    className="w-full bg-transparent border border-faded-sand px-4 py-3 font-sub font-light text-warm-charcoal text-[14px] focus:outline-none focus:border-terracotta transition-colors disabled:opacity-60"
                    placeholder="Safari name"
                  />
                </div>
                <div>
                  <label className="label-accent text-warm-charcoal/50 text-[10px] block mb-2">Rating *</label>
                  <div className="flex gap-1 items-center h-[44px] border border-faded-sand px-3">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, rating: n }))}
                        disabled={isSubmitting}
                        className="disabled:opacity-60"
                        aria-label={`Rate ${n} stars`}
                      >
                        <Star size={18} className={n <= form.rating ? "text-terracotta fill-terracotta" : "text-faded-sand"} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="label-accent text-warm-charcoal/50 text-[10px] block mb-2">Review *</label>
                <textarea
                  value={form.fullText}
                  onChange={(e) => setForm((p) => ({ ...p, fullText: e.target.value }))}
                  disabled={isSubmitting}
                  rows={5}
                  className="w-full bg-transparent border border-faded-sand px-4 py-3 font-sub font-light text-warm-charcoal text-[14px] focus:outline-none focus:border-terracotta transition-colors resize-none disabled:opacity-60"
                  placeholder="Tell us about your experience…"
                />
              </div>

              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowForm(false)}
                  disabled={isSubmitting}
                  className="btn-safari-outline text-[12px] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    const guestName = form.guestName.trim();
                    const fullText = form.fullText.trim();
                    if (!guestName || !fullText) {
                      setSubmitError("Name and review text are required.");
                      return;
                    }
                    setSubmitError(null);
                    setIsSubmitting(true);
                    try {
                      await submitReview({
                        guestName,
                        country: form.country || null,
                        countryFlag: form.countryFlag || null,
                        safariName: form.safariName || null,
                        rating: form.rating,
                        fullText,
                      });
                      setShowForm(false);
                      setForm({ guestName: "", country: "", countryFlag: "🌍", safariName: "", rating: 5, fullText: "" });
                    } catch (err: any) {
                      if (err instanceof ApiError) {
                        const details = err.errors ? Object.values(err.errors).flat().join(" ") : "";
                        setSubmitError([err.message, details].filter(Boolean).join(" "));
                      } else {
                        setSubmitError("Failed to submit review. Please try again.");
                      }
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  disabled={isSubmitting}
                  className="btn-safari-primary text-[12px] disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send size={14} strokeWidth={1.5} />
                  {isSubmitting ? "Submitting…" : "Submit Review"}
                </button>
              </div>

              <p className="font-body text-warm-charcoal/40 text-[12px] mt-4">
                Reviews are moderated; your submission will appear after approval.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Testimonials;
