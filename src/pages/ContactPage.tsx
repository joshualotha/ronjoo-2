import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Plane, Globe, Shield, Heart, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingElements from "@/components/FloatingElements";
import { submitEnquiry } from "@/services/publicApi";
import { ApiError } from "@/services/api";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const faqs = [
  { q: "How quickly will I hear back after submitting the form?", a: "Our team responds within 4 hours during office hours (Mon–Sat, 8 AM – 6 PM EAT). For an immediate response, reach us on WhatsApp, we're available 24/7." },
  { q: "Can I customize an existing safari itinerary?", a: "Absolutely. Every itinerary we offer is a starting point. We tailor dates, accommodations, activities, and pace to your preferences. Just tell us what you'd like to change." },
  { q: "What is the best way to reach you for urgent requests?", a: "WhatsApp is the fastest channel. Send us a message at +255 123 456 789 and a safari specialist will respond within minutes." },
  { q: "Do you offer virtual consultations?", a: "Yes. We're happy to arrange a video call via Zoom or Google Meet to discuss your safari in detail. Just mention it in your message and we'll send a booking link." },
  { q: "Is there a deposit required to start planning?", a: "No deposit is needed for the planning phase. We only require a deposit once you've approved your final itinerary and wish to confirm your booking." },
];

const reasons = [
  { icon: Shield, title: "Licensed & Certified", desc: "TATO-registered operator with full government licensing" },
  { icon: Heart, title: "Tailored Experiences", desc: "Every safari is custom-built around your interests and pace" },
  { icon: Globe, title: "Local Expertise", desc: "Born and raised in Tanzania, we know every trail and camp" },
  { icon: Plane, title: "End-to-End Service", desc: "From airport pickup to final farewell, we handle everything" },
];

const ContactPage = () => {
  const { settings } = useSiteSettings();
  const whatsapp = settings.whatsapp_number || "+255 747 394 631";
  const email = settings.email_address || "info@ronjoosafaris.co.tz";
  const address = settings.physical_address || "Arusha, Tanzania";
  const businessName = settings.business_name || "Ronjoo Safaris";
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", subject: "", message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await submitEnquiry({
        guestName: formData.name,
        email: formData.email,
        whatsapp: formData.phone || null,
        safariInterest: formData.subject || null,
        message: formData.message,
        source: "contact",
      });
      setSubmitted(true);
    } catch (err: any) {
      if (err instanceof ApiError) {
        const details = err.errors ? Object.values(err.errors).flat().join(" ") : "";
        setSubmitError([err.message, details].filter(Boolean).join(" "));
      } else {
        setSubmitError("Failed to send message. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-canvas">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[75vh] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(/assets/hero-contactpage.jpg)` }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.38))" }} />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9 }}
            className="heading-display text-warm-canvas text-[56px] md:text-[72px]"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="font-sub font-light text-warm-canvas/70 text-[16px] mt-3"
          >
            We respond within 4 hours, usually sooner
          </motion.p>
        </div>
      </section>

      {/* Contact info + Form */}
      <section className="section-light noise-overlay relative py-20">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-16">
            {/* Left: Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="heading-display text-warm-charcoal text-[36px] mb-8">
                Reach Us Directly
              </h2>
              <div className="gold-rule !mx-0 mb-10" />

              <div className="space-y-8">
                <a href={`https://wa.me/${String(whatsapp).replace(/[^\d]/g, "")}`} className="flex items-start gap-4 group">
                  <div className="w-10 h-10 bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
                    <MessageCircle size={18} className="text-[#25D366]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="label-accent text-warm-charcoal/40 text-[10px] mb-1">WhatsApp (Fastest)</p>
                    <p className="font-display text-warm-charcoal text-[22px] group-hover:text-terracotta transition-colors">{whatsapp}</p>
                  </div>
                </a>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-faded-sand flex items-center justify-center flex-shrink-0">
                    <Phone size={16} className="text-terracotta/60" strokeWidth={1} />
                  </div>
                  <div>
                    <p className="label-accent text-warm-charcoal/40 text-[10px] mb-1">Phone</p>
                    <p className="font-sub font-light text-warm-charcoal text-[16px]">{whatsapp}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-faded-sand flex items-center justify-center flex-shrink-0">
                    <Mail size={16} className="text-terracotta/60" strokeWidth={1} />
                  </div>
                  <div>
                    <p className="label-accent text-warm-charcoal/40 text-[10px] mb-1">Email</p>
                    <p className="font-sub font-light text-warm-charcoal text-[16px]">{email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-faded-sand flex items-center justify-center flex-shrink-0">
                    <MapPin size={16} className="text-terracotta/60" strokeWidth={1} />
                  </div>
                  <div>
                    <p className="label-accent text-warm-charcoal/40 text-[10px] mb-1">Office</p>
                    <p className="font-sub font-light text-warm-charcoal text-[15px] leading-relaxed">
                      {address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-faded-sand flex items-center justify-center flex-shrink-0">
                    <Clock size={16} className="text-terracotta/60" strokeWidth={1} />
                  </div>
                  <div>
                    <p className="label-accent text-warm-charcoal/40 text-[10px] mb-1">Office Hours</p>
                    <p className="font-sub font-light text-warm-charcoal text-[15px]">Mon–Sat: 8:00 AM – 6:00 PM EAT</p>
                    <p className="font-body font-light text-warm-charcoal/40 text-[13px] mt-1">WhatsApp available 24/7</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {submitted ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 mx-auto mb-6 border border-terracotta flex items-center justify-center">
                    <Send size={24} className="text-terracotta" strokeWidth={1} />
                  </div>
                  <h3 className="heading-display text-warm-charcoal text-[32px] mb-4">Message Sent</h3>
                  <p className="font-body font-light text-warm-charcoal/60 text-[16px] max-w-md mx-auto">
                    Thank you for reaching out. Our team will get back to you within 4 hours. In the meantime, feel free to WhatsApp us for an immediate response.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-8 font-sub font-light text-terracotta text-[14px] tracking-wider hover:underline"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h2 className="heading-display text-warm-charcoal text-[36px] mb-2">Send Us a Message</h2>
                  <div className="gold-rule !mx-0 mb-4" />
                  {submitError && (
                    <div className="border border-terracotta/30 bg-terracotta/5 px-4 py-3">
                      <p className="font-sub font-light text-terracotta text-[13px]">{submitError}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="label-accent text-warm-charcoal/50 text-[10px] block mb-2">Full Name *</label>
                      <input type="text" required value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} disabled={isSubmitting} className="w-full bg-transparent border border-faded-sand px-4 py-3 font-sub font-light text-warm-charcoal text-[15px] focus:outline-none focus:border-terracotta transition-colors disabled:opacity-60" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="label-accent text-warm-charcoal/50 text-[10px] block mb-2">Email *</label>
                      <input type="email" required value={formData.email} onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))} disabled={isSubmitting} className="w-full bg-transparent border border-faded-sand px-4 py-3 font-sub font-light text-warm-charcoal text-[15px] focus:outline-none focus:border-terracotta transition-colors disabled:opacity-60" placeholder="you@email.com" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="label-accent text-warm-charcoal/50 text-[10px] block mb-2">Phone / WhatsApp</label>
                      <input type="tel" value={formData.phone} onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))} disabled={isSubmitting} className="w-full bg-transparent border border-faded-sand px-4 py-3 font-sub font-light text-warm-charcoal text-[15px] focus:outline-none focus:border-terracotta transition-colors disabled:opacity-60" placeholder="+1 234 567 890" />
                    </div>
                    <div>
                      <label className="label-accent text-warm-charcoal/50 text-[10px] block mb-2">Subject</label>
                      <input type="text" value={formData.subject} onChange={(e) => setFormData((p) => ({ ...p, subject: e.target.value }))} disabled={isSubmitting} className="w-full bg-transparent border border-faded-sand px-4 py-3 font-sub font-light text-warm-charcoal text-[15px] focus:outline-none focus:border-terracotta transition-colors disabled:opacity-60" placeholder="Safari inquiry, custom trip, etc." />
                    </div>
                  </div>

                  <div>
                    <label className="label-accent text-warm-charcoal/50 text-[10px] block mb-2">Message *</label>
                    <textarea required rows={6} value={formData.message} onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))} disabled={isSubmitting} className="w-full bg-transparent border border-faded-sand px-4 py-3 font-sub font-light text-warm-charcoal text-[15px] focus:outline-none focus:border-terracotta transition-colors resize-none disabled:opacity-60" placeholder="Tell us about your dream safari, questions, or anything else..." />
                  </div>

                  <button type="submit" disabled={isSubmitting} className="btn-safari-primary text-[13px] flex items-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed">
                    <Send size={16} strokeWidth={1.5} />
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>

                  <p className="font-body text-warm-charcoal/30 text-[13px]">
                    We respond within 4 hours · No obligation · Free consultation
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="section-dark noise-overlay relative">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="label-accent text-gold/60 text-[11px] mb-4">OUR LOCATION</p>
            <h2 className="heading-display text-warm-charcoal text-[48px] md:text-[56px]">Find Us in Arusha</h2>
            <p className="font-sub font-light text-warm-charcoal/50 text-[16px] mt-3 max-w-lg mx-auto">
              The safari capital of Tanzania, gateway to the Serengeti, Ngorongoro, and Kilimanjaro
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="border border-gold/15 overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.482!2d36.6827!3d-3.3731!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM8KwMjInMjMuMiJTIDM2wrA0MCc1Ny43IkU!5e0!3m2!1sen!2stz!4v1700000000000"
                width="100%"
                height="450"
                style={{ border: 0, filter: "sepia(30%) saturate(70%) brightness(90%)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${businessName} Office - ${address}`}
              />
            </div>
            <div className="absolute bottom-6 left-6 bg-deep-earth/90 backdrop-blur-sm border border-gold/15 px-6 py-4">
              <p className="font-display italic text-warm-charcoal text-[20px]">{businessName}</p>
              <p className="font-sub font-light text-warm-charcoal/60 text-[13px] mt-1">{address}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Ronjoo */}
      <section className="section-light noise-overlay relative py-20">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="label-accent text-gold/60 text-[11px] mb-4">WHY CHOOSE US</p>
            <h2 className="heading-display text-warm-charcoal text-[48px] md:text-[56px]">Why Travel With Ronjoo</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {reasons.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 mx-auto border border-faded-sand flex items-center justify-center mb-5">
                  <r.icon size={22} className="text-terracotta/70" strokeWidth={1} />
                </div>
                <h3 className="font-display italic text-warm-charcoal text-[22px] mb-2">{r.title}</h3>
                <p className="font-sub font-light text-warm-charcoal/60 text-[14px] leading-relaxed">{r.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-dark noise-overlay relative py-20">
        <div className="max-w-[800px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="label-accent text-gold/60 text-[11px] mb-4">COMMON QUESTIONS</p>
            <h2 className="heading-display text-warm-charcoal text-[48px] md:text-[56px]">Before You Reach Out</h2>
          </motion.div>

          <div className="space-y-0">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="border-b border-gold/10"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-6 text-left group"
                >
                  <span className="font-display italic text-warm-charcoal text-[20px] pr-8 group-hover:text-terracotta transition-colors">
                    {faq.q}
                  </span>
                  <motion.span
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown size={18} className="text-terracotta/60" strokeWidth={1.5} />
                  </motion.span>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: openFaq === i ? "auto" : 0,
                    opacity: openFaq === i ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="font-sub font-light text-warm-charcoal/60 text-[15px] leading-relaxed pb-6">
                    {faq.a}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative h-[50vh] overflow-hidden">
        <motion.div
           initial={{ scale: 1.15 }}
           animate={{ scale: 1.05 }}
           transition={{ duration: 15, ease: "linear", repeat: Infinity, repeatType: "mirror" }}
           className="absolute inset-0 bg-cover bg-center bg-no-repeat"
           style={{ backgroundImage: `url(/assets/hero-contactpage.jpg)` }}
        />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.35)" }} />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <motion.h2
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="heading-display text-warm-canvas text-[48px] md:text-[72px] max-w-4xl"
          >
            Ready to Start Planning?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="font-sub font-light text-warm-canvas/60 text-[17px] mt-4 max-w-lg"
          >
            Our safari specialists craft journeys as unique as the landscapes you'll explore.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4 mt-8"
          >
            <Link to="/safaris" className="btn-safari-primary text-[13px]">View Safaris</Link>
            <Link to="/custom-safari" className="btn-safari-outline text-[13px]">Plan Custom Trip</Link>
          </motion.div>
          <motion.a
            href={`https://wa.me/${String(whatsapp).replace(/[^\d]/g, "")}`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
            className="mt-6 flex items-center gap-2 font-sub font-light text-warm-canvas/50 text-[13px] hover:text-warm-canvas transition-colors"
          >
            <MessageCircle size={14} strokeWidth={1.5} />
            Or chat with us on WhatsApp →
          </motion.a>
        </div>
      </section>

      <Footer />
      <FloatingElements />
    </div>
  );
};

export default ContactPage;
