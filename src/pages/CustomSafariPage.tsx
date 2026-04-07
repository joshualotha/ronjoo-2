import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, MapPin, Calendar, Users, Home, Send, Info } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDestinations, getSafariBySlug } from "@/services/publicApi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingElements from "@/components/FloatingElements";
import campImg from "@/assets/safari-camp.jpg";
import ngorongoroImg from "@/assets/safari-ngorongoro.jpg";
import heroImg from "@/assets/hero-savanna.jpg";
import lionImg from "@/assets/safari-lion.jpg";
import { submitEnquiry } from "@/services/publicApi";
import { ApiError } from "@/services/api";

const totalSteps = 5;

const accommodationTiers = [
  { id: "tented", name: "Tented Camp", tier: "Budget", priceRange: "$150–250/night", image: campImg },
  { id: "classic", name: "Classic Lodge", tier: "Mid-Range", priceRange: "$250–450/night", image: ngorongoroImg },
  { id: "luxury", name: "Luxury Lodge", tier: "Premium", priceRange: "$450–800/night", image: heroImg },
  { id: "ultra", name: "Ultra-Private Camp", tier: "Exclusive", priceRange: "$800+/night", image: lionImg },
];

const CustomSafariPage = () => {
  const [searchParams] = useSearchParams();
  const safariSlug = searchParams.get("safari");
  const initialTravelers = parseInt(searchParams.get("travelers") || "2", 10);

  const { data: destinations = [], isLoading } = useQuery({
    queryKey: ['destinations'],
    queryFn: getDestinations,
  });

  // Fetch specific safari if slug provided, to get its destinations for pre-filling
  const { data: sourceSafari } = useQuery({
    queryKey: ['safari', safariSlug],
    queryFn: () => getSafariBySlug(safariSlug!),
    enabled: !!safariSlug,
  });

  const [step, setStep] = useState(1);
  const [selectedDests, setSelectedDests] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [travelerType, setTravelerType] = useState("couple");
  const [adults, setAdults] = useState(initialTravelers);
  const [children, setChildren] = useState(0);
  const [occasion, setOccasion] = useState<string[]>([]);
  const [accommodation, setAccommodation] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", whatsapp: "", country: "", notes: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Pre-fill from source safari
  useEffect(() => {
    if (sourceSafari) {
      if (Array.isArray(sourceSafari.destinations) && selectedDests.length === 0) {
        setSelectedDests(sourceSafari.destinations);
      }
    }
  }, [sourceSafari]);

  const toggleDest = (name: string) => {
    setSelectedDests((prev) =>
      prev.includes(name) ? prev.filter((d) => d !== name) : [...prev, name]
    );
  };

  const canAdvance = () => {
    if (step === 1) return selectedDests.length > 0;
    if (step === 2) return dateRange.start !== "";
    if (step === 3) return true;
    if (step === 4) return accommodation !== "";
    if (step === 5) return formData.name !== "" && formData.email !== "";
    return true;
  };

  const estimatePrice = () => {
    const base = accommodation === "tented" ? 150 : accommodation === "classic" ? 350 : accommodation === "luxury" ? 600 : 1000;
    const days = selectedDests.length * 2 + 1;
    const people = adults + children;
    const low = Math.round(base * days * 0.8);
    const high = Math.round(base * days * 1.3);
    return { low: low * people, high: high * people, perPerson: { low, high }, days };
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const accommodationLabel =
        accommodationTiers.find((t) => t.id === accommodation)?.name || accommodation;

      const messageLines = [
        `Custom safari request`,
        ``,
        `Destinations: ${selectedDests.join(", ")}`,
        `Dates: ${dateRange.start}${dateRange.end ? ` → ${dateRange.end}` : ""}`,
        `Travelers: ${adults} adults${children ? `, ${children} children` : ""} (${travelerType})`,
        `Occasion: ${occasion.length ? occasion.join(", ") : "—"}`,
        `Accommodation: ${accommodationLabel}`,
        ``,
        `Notes: ${formData.notes || "—"}`,
      ];

      await submitEnquiry({
        guestName: formData.name,
        email: formData.email,
        whatsapp: formData.whatsapp || null,
        country: formData.country || null,
        safariInterest: sourceSafari ? `Customize: ${sourceSafari.name}` : "Custom Safari",
        preferredDates: `${dateRange.start}${dateRange.end ? ` to ${dateRange.end}` : ""}`,
        travelers: adults + children,
        message: messageLines.join("\n"),
        source: "custom-safari",
        tags: ["custom-safari"],
      });
      setSubmitted(true);
    } catch (err: any) {
      if (err instanceof ApiError) {
        const details = err.errors ? Object.values(err.errors).flat().join(" ") : "";
        setSubmitError([err.message, details].filter(Boolean).join(" "));
      } else {
        setSubmitError("Failed to submit request. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-canvas">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[75vh] overflow-hidden flex items-end">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url(/assets/hero-customsafaripage.jpg)` }} 
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10 w-full mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="label-accent text-gold text-[12px] mb-6 block tracking-[0.3em]"
          >
            BESPOKE JOURNEYS
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="heading-display text-warm-canvas text-[48px] md:text-[72px] leading-tight"
          >
            Design Your <span className="italic">Dream Safari</span>
          </motion.h1>
        </div>
      </section>

      <div className="pt-20 pb-20 px-6">
        <div className="max-w-[900px] mx-auto">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-3 mb-16">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full transition-all ${
                    i + 1 <= step ? "bg-terracotta" : "bg-faded-sand/40"
                  } ${i + 1 === step ? "w-4 h-4" : ""}`}
                />
                {i < totalSteps - 1 && (
                  <div className={`w-12 h-0.5 transition-all ${i + 1 < step ? "bg-terracotta" : "bg-faded-sand/20"}`} />
                )}
              </div>
            ))}
          </div>

          {sourceSafari && step === 1 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2 mb-10 p-3 bg-terracotta/5 border border-terracotta/10 rounded-xl max-w-fit mx-auto"
            >
              <Info size={14} className="text-terracotta" />
              <span className="font-sub text-[13px] text-terracotta">
                Customizing: <span className="font-medium italic">{sourceSafari.name}</span>
              </span>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {/* Step 1: Destinations */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="heading-display text-warm-charcoal text-[36px] md:text-[52px] text-center mb-3">
                  Where do you want to go?
                </h2>
                <p className="font-sub font-light text-warm-charcoal/50 text-[15px] text-center mb-12">
                  Select the destinations you'd like to visit
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {destinations.filter((d) => d.name !== "Arusha").map((dest) => {
                    const selected = selectedDests.includes(dest.name);
                    return (
                      <button
                        key={dest.name}
                        onClick={() => toggleDest(dest.name)}
                        className={`relative text-left p-5 border transition-all ${
                          selected
                            ? "border-terracotta bg-terracotta/5"
                            : "border-faded-sand/60 hover:border-terracotta/40"
                        }`}
                      >
                        {selected && (
                          <div className="absolute top-3 right-3 w-5 h-5 bg-terracotta flex items-center justify-center">
                            <Check size={12} className="text-warm-canvas" strokeWidth={2} />
                          </div>
                        )}
                        <MapPin size={16} className="text-terracotta/60 mb-2" strokeWidth={1} />
                        <h3 className="font-display italic text-warm-charcoal text-[20px]">{dest.name}</h3>
                        <p className="font-body font-light text-warm-charcoal/40 text-[13px] mt-1">{dest.teaser}</p>
                        <p className="label-accent text-gold/60 text-[9px] mt-2">Best: {dest.season}</p>
                      </button>
                    );
                  })}
                </div>

                {selectedDests.length > 0 && (
                  <div className="mt-8 p-4 bg-dust-ivory/50 flex items-center gap-3 flex-wrap">
                    <span className="label-accent text-warm-charcoal/40 text-[10px]">Your Route:</span>
                    {selectedDests.map((d) => (
                      <span key={d} className="label-accent text-terracotta text-[11px] border border-terracotta/30 px-3 py-1">{d}</span>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 2: Dates */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="heading-display text-warm-charcoal text-[36px] md:text-[52px] text-center mb-3">
                  When are you traveling?
                </h2>
                <p className="font-sub font-light text-warm-charcoal/50 text-[15px] text-center mb-12">
                  Select your preferred travel dates
                </p>

                <div className="max-w-md mx-auto space-y-6">
                  <div>
                    <label className="label-accent text-warm-charcoal/50 text-[10px] block mb-2">
                      <Calendar size={12} className="inline mr-2" />Start Date
                    </label>
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
                      className="w-full bg-transparent border border-faded-sand px-4 py-3 font-sub font-light text-warm-charcoal text-[15px] focus:outline-none focus:border-terracotta transition-colors"
                    />
                  </div>
                  <div>
                    <label className="label-accent text-warm-charcoal/50 text-[10px] block mb-2">
                      <Calendar size={12} className="inline mr-2" />End Date (optional)
                    </label>
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
                      className="w-full bg-transparent border border-faded-sand px-4 py-3 font-sub font-light text-warm-charcoal text-[15px] focus:outline-none focus:border-terracotta transition-colors"
                    />
                  </div>
                  {selectedDests.length > 0 && (
                    <p className="font-body text-warm-charcoal/40 text-[14px] text-center">
                      Estimated duration: {selectedDests.length * 2 + 1} days based on your destinations
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 3: Who */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="heading-display text-warm-charcoal text-[36px] md:text-[52px] text-center mb-3">
                  Who is joining you?
                </h2>
                <p className="font-sub font-light text-warm-charcoal/50 text-[15px] text-center mb-12">
                  Tell us about your travel group
                </p>

                <div className="max-w-lg mx-auto">
                  {/* Traveler type */}
                  <div className="grid grid-cols-4 gap-3 mb-10">
                    {["Solo", "Couple", "Family", "Group"].map((type) => (
                      <button
                        key={type}
                        onClick={() => setTravelerType(type.toLowerCase())}
                        className={`label-accent text-[11px] py-3 border transition-all ${
                          travelerType === type.toLowerCase()
                            ? "border-terracotta bg-terracotta/5 text-terracotta"
                            : "border-faded-sand text-warm-charcoal/50"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  {/* Counters */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="font-sub font-light text-warm-charcoal text-[16px]">Adults</span>
                      <div className="flex items-center gap-4">
                        <button onClick={() => setAdults(Math.max(1, adults - 1))} className="w-10 h-10 border border-faded-sand text-warm-charcoal/50 flex items-center justify-center hover:border-terracotta transition-colors text-[18px]">−</button>
                        <span className="font-display text-warm-charcoal text-[22px] w-8 text-center">{adults}</span>
                        <button onClick={() => setAdults(adults + 1)} className="w-10 h-10 border border-faded-sand text-warm-charcoal/50 flex items-center justify-center hover:border-terracotta transition-colors text-[18px]">+</button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-sub font-light text-warm-charcoal text-[16px]">Children</span>
                      <div className="flex items-center gap-4">
                        <button onClick={() => setChildren(Math.max(0, children - 1))} className="w-10 h-10 border border-faded-sand text-warm-charcoal/50 flex items-center justify-center hover:border-terracotta transition-colors text-[18px]">−</button>
                        <span className="font-display text-warm-charcoal text-[22px] w-8 text-center">{children}</span>
                        <button onClick={() => setChildren(children + 1)} className="w-10 h-10 border border-faded-sand text-warm-charcoal/50 flex items-center justify-center hover:border-terracotta transition-colors text-[18px]">+</button>
                      </div>
                    </div>
                  </div>

                  {/* Special occasion */}
                  <div className="mt-10">
                    <p className="label-accent text-warm-charcoal/40 text-[10px] mb-4">Special Occasion?</p>
                    <div className="flex gap-3 flex-wrap">
                      {["Honeymoon", "Birthday", "Anniversary"].map((occ) => (
                        <button
                          key={occ}
                          onClick={() => setOccasion((prev) => prev.includes(occ) ? prev.filter((o) => o !== occ) : [...prev, occ])}
                          className={`label-accent text-[11px] px-4 py-2 border transition-all ${
                            occasion.includes(occ) ? "border-terracotta bg-terracotta/5 text-terracotta" : "border-faded-sand text-warm-charcoal/50"
                          }`}
                        >
                          {occ}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Accommodation */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="heading-display text-warm-charcoal text-[36px] md:text-[52px] text-center mb-3">
                  How do you like to sleep under the stars?
                </h2>
                <p className="font-sub font-light text-warm-charcoal/50 text-[15px] text-center mb-12">
                  Choose your accommodation tier
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {accommodationTiers.map((tier) => {
                    const selected = accommodation === tier.id;
                    return (
                      <button
                        key={tier.id}
                        onClick={() => setAccommodation(tier.id)}
                        className={`relative overflow-hidden text-left group border transition-all ${
                          selected ? "border-terracotta" : "border-faded-sand/40 hover:border-terracotta/40"
                        }`}
                      >
                        <div
                          className="h-40 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                          style={{ backgroundImage: `url(${tier.image})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F08]/70 to-transparent" />
                        {selected && (
                          <div className="absolute top-3 right-3 w-6 h-6 bg-terracotta flex items-center justify-center">
                            <Check size={14} className="text-warm-canvas" strokeWidth={2} />
                          </div>
                        )}
                        <div className="relative p-5 -mt-16 z-10">
                          <p className="label-accent text-gold text-[9px]">{tier.tier}</p>
                          <h3 className="font-display italic text-warm-canvas text-[22px]">{tier.name}</h3>
                          <p className="font-sub font-light text-warm-canvas/60 text-[13px] mt-1">{tier.priceRange}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 5: Summary + Form */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="heading-display text-warm-charcoal text-[36px] md:text-[52px] text-center mb-3">
                  Your Estimated Safari
                </h2>
                {submitted ? (
                  <div className="max-w-lg mx-auto mt-8 p-8 bg-dust-ivory/40 border border-faded-sand/40 text-center">
                    <p className="heading-display text-warm-charcoal text-[28px]">Request Sent</p>
                    <p className="font-sub font-light text-warm-charcoal/60 text-[15px] mt-3">
                      Thank you. Our team will reach out within 4 hours (often sooner).
                    </p>
                  </div>
                ) : (
                  <>

                {/* Price estimate */}
                <div className="text-center mb-10 p-8 bg-dust-ivory/40 border border-faded-sand/40">
                  <p className="label-accent text-warm-charcoal/40 text-[10px] mb-2">Estimated Total</p>
                  <p className="font-display text-warm-charcoal text-[42px]">
                    ${estimatePrice().low.toLocaleString()} – ${estimatePrice().high.toLocaleString()}
                  </p>
                  <p className="font-sub font-light text-warm-charcoal/50 text-[14px] mt-1">
                    ${estimatePrice().perPerson.low.toLocaleString()} – ${estimatePrice().perPerson.high.toLocaleString()} per person · {estimatePrice().days} days
                  </p>

                  <div className="flex flex-wrap justify-center gap-4 mt-6">
                    <div className="text-left">
                      <p className="label-accent text-warm-charcoal/30 text-[9px]">Destinations</p>
                      <p className="font-body text-warm-charcoal/70 text-[14px]">{selectedDests.join(", ")}</p>
                    </div>
                    <div className="text-left">
                      <p className="label-accent text-warm-charcoal/30 text-[9px]">Travelers</p>
                      <p className="font-body text-warm-charcoal/70 text-[14px]">{adults} adults{children > 0 ? `, ${children} children` : ""}</p>
                    </div>
                    <div className="text-left">
                      <p className="label-accent text-warm-charcoal/30 text-[9px]">Accommodation</p>
                      <p className="font-body text-warm-charcoal/70 text-[14px]">{accommodationTiers.find((t) => t.id === accommodation)?.name || "—"}</p>
                    </div>
                  </div>
                </div>

                {/* Contact form */}
                <div className="max-w-lg mx-auto space-y-5">
                  {submitError && (
                    <div className="border border-terracotta/30 bg-terracotta/5 px-4 py-3">
                      <p className="font-sub font-light text-terracotta text-[13px]">{submitError}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label-accent text-warm-charcoal/50 text-[10px] block mb-2">Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        disabled={isSubmitting}
                        className="w-full bg-transparent border border-faded-sand px-4 py-3 font-sub font-light text-warm-charcoal text-[15px] focus:outline-none focus:border-terracotta transition-colors disabled:opacity-60"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="label-accent text-warm-charcoal/50 text-[10px] block mb-2">Email *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        disabled={isSubmitting}
                        className="w-full bg-transparent border border-faded-sand px-4 py-3 font-sub font-light text-warm-charcoal text-[15px] focus:outline-none focus:border-terracotta transition-colors disabled:opacity-60"
                        placeholder="you@email.com"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label-accent text-warm-charcoal/50 text-[10px] block mb-2">WhatsApp</label>
                      <input
                        type="tel"
                        value={formData.whatsapp}
                        onChange={(e) => setFormData((prev) => ({ ...prev, whatsapp: e.target.value }))}
                        disabled={isSubmitting}
                        className="w-full bg-transparent border border-faded-sand px-4 py-3 font-sub font-light text-warm-charcoal text-[15px] focus:outline-none focus:border-terracotta transition-colors disabled:opacity-60"
                        placeholder="+1 234 567 890"
                      />
                    </div>
                    <div>
                      <label className="label-accent text-warm-charcoal/50 text-[10px] block mb-2">Country</label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => setFormData((prev) => ({ ...prev, country: e.target.value }))}
                        disabled={isSubmitting}
                        className="w-full bg-transparent border border-faded-sand px-4 py-3 font-sub font-light text-warm-charcoal text-[15px] focus:outline-none focus:border-terracotta transition-colors disabled:opacity-60"
                        placeholder="Your country"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label-accent text-warm-charcoal/50 text-[10px] block mb-2">Additional Notes</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                      rows={4}
                      disabled={isSubmitting}
                      className="w-full bg-transparent border border-faded-sand px-4 py-3 font-sub font-light text-warm-charcoal text-[15px] focus:outline-none focus:border-terracotta transition-colors resize-none disabled:opacity-60"
                      placeholder="Any special requests, interests, or questions..."
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !canAdvance()}
                    className="btn-safari-primary w-full text-center text-[13px] flex items-center justify-center gap-3 mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Send size={16} strokeWidth={1.5} />
                    {isSubmitting ? "Sending..." : "Send My Custom Safari Request"}
                  </button>
                  <p className="font-body text-warm-charcoal/30 text-[13px] text-center">
                    We respond within 4 hours · No obligation · Free consultation
                  </p>
                </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-16">
            {step > 1 ? (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center gap-2 font-sub font-light text-warm-charcoal/50 text-[14px] hover:text-warm-charcoal transition-colors"
              >
                <ArrowLeft size={16} strokeWidth={1.5} /> Back
              </button>
            ) : (
              <div />
            )}
            {step < totalSteps && (
              <button
                onClick={() => canAdvance() && setStep((s) => s + 1)}
                disabled={!canAdvance()}
                className={`flex items-center gap-2 btn-safari-primary text-[12px] px-8 py-3 ${
                  !canAdvance() ? "opacity-30 cursor-not-allowed" : ""
                }`}
              >
                Continue <ArrowRight size={16} strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>
      </div>

      <Footer />
      <FloatingElements />
    </div>
  );
};

export default CustomSafariPage;
