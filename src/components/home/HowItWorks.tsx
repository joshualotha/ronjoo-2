import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MessageCircle, Map, Compass, Plane } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: MessageCircle,
    title: "Share Your Vision",
    desc: "Tell us your dream safari, where, when, and who's coming.",
  },
  {
    num: "02",
    icon: Map,
    title: "We Craft Your Route",
    desc: "Our experts design a bespoke itinerary tailored to you.",
  },
  {
    num: "03",
    icon: Compass,
    title: "Refine Together",
    desc: "Review, adjust, and perfect every detail of your journey.",
  },
  {
    num: "04",
    icon: Plane,
    title: "Arrive & Explore",
    desc: "Step off the plane. Your guide is waiting. Adventure begins.",
  },
];

const HowItWorks = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-dark noise-overlay relative py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="heading-display text-warm-charcoal text-[48px] md:text-[64px]"
          >
            Your Safari, Our Craft
          </motion.h2>
          <div className="gold-rule mt-6" />
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
          {/* Dashed connecting line */}
          <div className="hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-px border-t border-dashed border-gold/20" />

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
              className="relative text-center"
            >
              {/* Big decorative number */}
              <span className="font-display text-[120px] leading-none text-warm-charcoal/[0.04] absolute -top-8 left-1/2 -translate-x-1/2 pointer-events-none select-none">
                {step.num}
              </span>
              {/* Icon */}
              <div className="relative z-10 w-12 h-12 mx-auto mb-6 flex items-center justify-center border border-gold/30">
                <step.icon size={22} strokeWidth={1} className="text-gold" />
              </div>
              <h3 className="heading-sub text-warm-charcoal text-[12px] mb-3">
                {step.title}
              </h3>
              <p className="font-body font-light text-warm-charcoal/60 text-[15px] leading-relaxed max-w-[220px] mx-auto">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
