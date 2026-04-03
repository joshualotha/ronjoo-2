import { useState, useMemo } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Send, MessageCircle, ArrowLeft } from "lucide-react";
import { getSafariBySlug } from "@/services/publicApi";
import { submitEnquiry } from "@/services/publicApi";
import { ApiError } from "@/services/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingElements from "@/components/FloatingElements";

const resolveSafariImage = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/")) return url;
  return `/storage/${url}`;
};

const BookSafariPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams ] = useSearchParams();
  const initialTravelers = parseInt(searchParams.get("travelers") || "2", 10);

  const { data: rawData, isLoading } = useQuery({
    queryKey: ["safari", slug],
    queryFn: () => getSafariBySlug(slug!),
    enabled: !!slug,
  });

  const safari = useMemo(() => {
    if (!rawData) return null;
    const s = rawData as any;
    const basePrice = s.price || 0;
    return {
      ...s,
      name: s.name || "",
      slug: s.slug || slug,
      duration: s.duration || "N/A",
      destinations: Array.isArray(s.destinations) ? s.destinations : [],
      heroImages: Array.isArray(s.heroImages) ? s.heroImages : [],
      image: s.image || "",
      price: (typeof basePrice === "string" ? parseInt(basePrice.replace(/[^0-9]/g, "")) : basePrice) || 0,
      priceTiers: Array.isArray(s.priceTiers) ? s.priceTiers : [],
      difficulty: s.difficulty || "",
      groupSize: s.groupSize || "",
    };
  }, [rawData, slug]);

  const [travelers, setTravelers] = useState(initialTravelers);
  const [preferredDates, setPreferredDates] = useState("");
  const [flexible, setFlexible] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "", country: "", notes: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Tier matching
  const getTierPrice = (count: number): number => {
    if (!safari?.priceTiers || safari.priceTiers.length === 0) return safari?.price || 0;
    const tiers = safari.priceTiers as { label: string; price: number }[];
    const parsed = tiers.map((t) => {
      const nums = t.label.match(/\d+/g);
      if (!nums) return { min: 1, max: 99, price: t.price };
      const min = parseInt(nums[0]);
      const max = nums.length > 1 ? parseInt(nums[1]) : min;
      return { min, max, price: t.price };
    });
    const match = parsed.find((p) => count >= p.min && count <= p.max);
    if (match) return match.price;
    return parsed[parsed.length - 1]?.price || safari.price || 0;
  };

  const perPerson = getTierPrice(travelers);
  const totalPrice = perPerson * travelers;

  const heroUrl = safari
    ? resolveSafariImage(safari.heroImages?.[0] || safari.image || "")
    : "";

  const canSubmit = form.name.trim() !== "" && form.email.trim() !== "";

  const handleSubmit = async () => {
    if (!canSubmit || !safari) return;
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const dateStr = preferredDates + (flexible ? " (flexible)" : "");
      await submitEnquiry({
        guestName: form.name,
        email: form.email,
        whatsapp: form.whatsapp || null,
        country: form.country || null,
        safariInterest: safari.name,
        preferredDates: dateStr || null,
        travelers,
        message: [
          `Booking inquiry for: ${safari.name}`,
          `Travelers: ${travelers}`,
          `Per person: $${perPerson.toLocaleString()}`,
          `Estimated total: $${totalPrice.toLocaleString()}`,
          `Dates: ${dateStr || "Not specified"}`,
          "",
          form.notes ? `Notes: ${form.notes}` : "",
        ].filter(Boolean).join("\n"),
        source: "safari-booking",
        tags: ["safari-booking", safari.slug],
      });
      setSubmitted(true);
    } catch (err: any) {
      if (err instanceof ApiError) {
        const details = err.errors ? Object.values(err.errors).flat().join(" ") : "";
        setSubmitError([err.message, details].filter(Boolean).join(" "));
      } else {
        setSubmitError("Failed to submit. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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

  if (!safari) {
    return (
      <div className="min-h-screen bg-warm-canvas">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh] text-center">
          <div>
            <h1 className="heading-display text-warm-charcoal text-[36px]">Safari Not Found</h1>
            <Link to="/safaris" className="font-sub text-terracotta mt-4 inline-block">← Back to Safaris</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-canvas">
      <Navbar />

      <div className="pt-28 pb-20 px-6">
        <div className="max-w-[1100px] mx-auto">

          {/* Back link */}
          <Link
            to={`/safaris/${safari.slug}`}
            className="inline-flex items-center gap-2 font-sub font-light text-warm-charcoal/50 text-[13px] mb-8 hover:text-terracotta transition-colors"
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
            Back to {safari.name}
          </Link>

          <AnimatePresence mode="wait">
            {submitted ? (
              /* ─── Thank You ─── */
              <motion.div
                key="thankyou"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-[640px] mx-auto text-center py-16"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="w-16 h-16 mx-auto mb-6 bg-terracotta flex items-center justify-center rounded-full"
                >
                  <Check size={28} className="text-warm-canvas" strokeWidth={2} />
                </motion.div>

                <h2 className="heading-display text-warm-charcoal text-[36px] md:text-[48px] mb-4">
                  Request Sent
                </h2>
                <p className="font-sub font-light text-warm-charcoal/60 text-[16px] leading-relaxed mb-8">
                  Your safari consultant will review your request and get back to you
                  <strong className="text-warm-charcoal"> within 4 hours</strong> (often much sooner).
                </p>

                {/* Summary */}
                <div className="bg-dust-ivory/60 border border-faded-sand/40 p-6 text-left mb-8 max-w-[440px] mx-auto">
                  <div className="flex justify-between mb-3">
                    <span className="font-body text-warm-charcoal/40 text-[13px]">Safari</span>
                    <span className="font-sub text-warm-charcoal text-[13px]">{safari.name}</span>
                  </div>
                  <div className="flex justify-between mb-3">
                    <span className="font-body text-warm-charcoal/40 text-[13px]">Travelers</span>
                    <span className="font-sub text-warm-charcoal text-[13px]">{travelers}</span>
                  </div>
                  <div className="flex justify-between mb-3">
                    <span className="font-body text-warm-charcoal/40 text-[13px]">Estimated Total</span>
                    <span className="font-display text-warm-charcoal text-[18px]">${totalPrice.toLocaleString()}</span>
                  </div>
                  {preferredDates && (
                    <div className="flex justify-between">
                      <span className="font-body text-warm-charcoal/40 text-[13px]">Dates</span>
                      <span className="font-sub text-warm-charcoal text-[13px]">{preferredDates}{flexible ? " (flexible)" : ""}</span>
                    </div>
                  )}
                </div>

                {/* WhatsApp + browse */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={`https://wa.me/255123456789?text=${encodeURIComponent(`Hi, I just submitted a booking inquiry for ${safari.name} (${travelers} travelers). Looking forward to hearing from you!`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#25D366] text-[#25D366] font-sub text-[12px] uppercase tracking-[0.1em] hover:bg-[#25D366] hover:text-white transition-colors"
                  >
                    <MessageCircle size={16} />
                    Chat on WhatsApp
                  </a>
                  <Link
                    to="/safaris"
                    className="btn-safari-terracotta-outline text-center text-[12px] px-6 py-3"
                  >
                    Browse More Safaris
                  </Link>
                </div>
              </motion.div>
            ) : (
              /* ─── Booking Form ─── */
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <h1 className="heading-display text-warm-charcoal text-[36px] md:text-[52px] mb-2">
                  Book Your Safari
                </h1>
                <p className="font-sub font-light text-warm-charcoal/50 text-[15px] mb-12">
                  Complete the form below and we'll craft your perfect experience
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">

                  {/* Left: Form */}
                  <div className="space-y-8">

                    {/* Travelers */}
                    <div>
                      <h3 className="label-accent text-warm-charcoal/50 text-[10px] mb-4">Travelers</h3>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setTravelers((c) => Math.max(1, c - 1))}
                          className="w-10 h-10 border border-faded-sand text-warm-charcoal/50 flex items-center justify-center hover:border-terracotta transition-colors text-[18px]"
                        >−</button>
                        <span className="font-display text-warm-charcoal text-[28px] w-10 text-center">{travelers}</span>
                        <button
                          onClick={() => setTravelers((c) => Math.min(10, c + 1))}
                          className="w-10 h-10 border border-faded-sand text-warm-charcoal/50 flex items-center justify-center hover:border-terracotta transition-colors text-[18px]"
                        >+</button>
                        <span className="font-sub font-light text-warm-charcoal/40 text-[14px] ml-2">
                          {travelers === 1 ? "traveler" : "travelers"}
                        </span>
                      </div>
                    </div>

                    {/* Dates */}
                    <div>
                      <h3 className="label-accent text-warm-charcoal/50 text-[10px] mb-4">Preferred Travel Dates</h3>
                      <input
                        type="text"
                        value={preferredDates}
                        onChange={(e) => setPreferredDates(e.target.value)}
                        className="w-full bg-transparent border border-faded-sand px-4 py-3 font-sub font-light text-warm-charcoal text-[15px] focus:outline-none focus:border-terracotta transition-colors"
                        placeholder="e.g. Late September 2026, December 15-22, 2026"
                      />
                      <label className="flex items-center gap-2 mt-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={flexible}
                          onChange={() => setFlexible(!flexible)}
                          className="w-4 h-4 border border-faded-sand accent-terracotta"
                        />
                        <span className="font-sub font-light text-warm-charcoal/50 text-[13px]">My dates are flexible</span>
                      </label>
                    </div>

                    {/* Contact */}
                    <div>
                      <h3 className="label-accent text-warm-charcoal/50 text-[10px] mb-4">Your Details</h3>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="label-accent text-warm-charcoal/40 text-[9px] block mb-2">Name *</label>
                          <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                            disabled={isSubmitting}
                            className="w-full bg-transparent border border-faded-sand px-4 py-3 font-sub font-light text-warm-charcoal text-[15px] focus:outline-none focus:border-terracotta transition-colors disabled:opacity-60"
                            placeholder="Your full name"
                          />
                        </div>
                        <div>
                          <label className="label-accent text-warm-charcoal/40 text-[9px] block mb-2">Email *</label>
                          <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                            disabled={isSubmitting}
                            className="w-full bg-transparent border border-faded-sand px-4 py-3 font-sub font-light text-warm-charcoal text-[15px] focus:outline-none focus:border-terracotta transition-colors disabled:opacity-60"
                            placeholder="you@email.com"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="label-accent text-warm-charcoal/40 text-[9px] block mb-2">WhatsApp</label>
                          <input
                            type="tel"
                            value={form.whatsapp}
                            onChange={(e) => setForm((p) => ({ ...p, whatsapp: e.target.value }))}
                            disabled={isSubmitting}
                            className="w-full bg-transparent border border-faded-sand px-4 py-3 font-sub font-light text-warm-charcoal text-[15px] focus:outline-none focus:border-terracotta transition-colors disabled:opacity-60"
                            placeholder="+1 234 567 890"
                          />
                        </div>
                        <div>
                          <label className="label-accent text-warm-charcoal/40 text-[9px] block mb-2">Country</label>
                          <input
                            type="text"
                            value={form.country}
                            onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))}
                            disabled={isSubmitting}
                            className="w-full bg-transparent border border-faded-sand px-4 py-3 font-sub font-light text-warm-charcoal text-[15px] focus:outline-none focus:border-terracotta transition-colors disabled:opacity-60"
                            placeholder="Your country"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <h3 className="label-accent text-warm-charcoal/50 text-[10px] mb-4">Special Requests</h3>
                      <textarea
                        value={form.notes}
                        onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                        rows={4}
                        disabled={isSubmitting}
                        className="w-full bg-transparent border border-faded-sand px-4 py-3 font-sub font-light text-warm-charcoal text-[15px] focus:outline-none focus:border-terracotta transition-colors resize-none disabled:opacity-60"
                        placeholder="Dietary requirements, mobility needs, celebration details, preferred activities..."
                      />
                    </div>

                    {/* Error */}
                    {submitError && (
                      <div className="border border-terracotta/30 bg-terracotta/5 px-4 py-3">
                        <p className="font-sub font-light text-terracotta text-[13px]">{submitError}</p>
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      onClick={handleSubmit}
                      disabled={!canSubmit || isSubmitting}
                      className="btn-safari-primary w-full text-center text-[13px] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={16} strokeWidth={1.5} />
                      {isSubmitting ? "Sending..." : "Send Booking Request"}
                    </button>
                    <p className="font-body text-warm-charcoal/30 text-[12px] text-center">
                      We respond within 4 hours · No obligation · Free consultation
                    </p>
                  </div>

                  {/* Right: Safari Summary Card */}
                  <div className="hidden lg:block">
                    <div className="sticky top-28">
                      <div className="border border-faded-sand/40 overflow-hidden">
                        {heroUrl && (
                          <div
                            className="h-[200px] bg-cover bg-center"
                            style={{ backgroundImage: `url(${heroUrl})` }}
                          />
                        )}
                        <div className="p-6 bg-dust-ivory/60">
                          <p className="label-accent text-terracotta/60 text-[10px] mb-1">
                            {(safari.destinations ?? []).join(" · ")}
                          </p>
                          <h3 className="font-display italic text-warm-charcoal text-[22px] mb-4">
                            {safari.name}
                          </h3>

                          <div className="h-px bg-faded-sand/60 mb-4" />

                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                              <span className="font-body text-warm-charcoal/40 text-[13px]">Duration</span>
                              <span className="font-sub text-warm-charcoal text-[13px]">{safari.duration}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-body text-warm-charcoal/40 text-[13px]">Travelers</span>
                              <span className="font-sub text-warm-charcoal text-[13px]">{travelers}</span>
                            </div>
                          </div>

                          <div className="h-px bg-faded-sand/60 mb-4" />

                          <div className="flex justify-between items-baseline mb-1">
                            <span className="label-accent text-warm-charcoal/40 text-[10px]">Per Person</span>
                            <span className="font-display text-warm-charcoal text-[28px]">${perPerson.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-baseline">
                            <span className="label-accent text-warm-charcoal/40 text-[10px]">Group Total</span>
                            <span className="font-display text-terracotta text-[22px]">${totalPrice.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Footer />
      <FloatingElements />
    </div>
  );
};

export default BookSafariPage;
