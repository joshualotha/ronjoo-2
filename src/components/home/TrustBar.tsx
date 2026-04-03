import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useSiteSettings } from "@/hooks/useSiteSettings";

interface StatProps {
  value: number;
  suffix: string;
  label: string;
}

const AnimatedStat = ({ value, suffix, label }: StatProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-center px-6 py-4 md:py-0">
      <span className="font-display text-gold text-[36px]">
        {count}{suffix}
      </span>
      <p className="label-accent text-warm-charcoal/70 text-[11px] mt-2">{label}</p>
    </div>
  );
};

const TrustBar = () => {
  const { settings } = useSiteSettings();
  const years = Number(settings.years_operating || 18);
  const travelers = Number(settings.travelers_hosted || 4200);
  const rating = Number(settings.tripadvisor_rating || 4.9);
  const stats = [
    { value: Number.isFinite(years) ? years : 18, suffix: "+", label: "Years Operating" },
    { value: Number.isFinite(travelers) ? travelers : 4200, suffix: "+", label: "Travelers Hosted" },
    { value: Number.isFinite(rating) ? rating : 4.9, suffix: "★", label: "TripAdvisor Rating" },
    { value: 100, suffix: "%", label: "Private Guides" },
  ];

  return (
    <section className="section-dark noise-overlay relative">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-[1200px] mx-auto px-6 py-10 flex flex-row md:flex-row items-center justify-between gap-4 overflow-x-auto scrollbar-none"
      >
        {stats.map((stat, i) => (
          <div key={stat.label} className="flex items-center">
            {i > 0 && (
              <div className="hidden md:block w-px h-12 bg-gold/20 mr-8" />
            )}
            <AnimatedStat
              value={typeof stat.value === "number" ? Math.floor(stat.value * (stat.suffix === "★" ? 10 : 1)) : stat.value}
              suffix={stat.suffix === "★" ? "" : stat.suffix}
              label={stat.suffix === "★" ? `${stat.value}★ TripAdvisor Rating` : stat.label}
            />
          </div>
        ))}
      </motion.div>
    </section>
  );
};

export default TrustBar;
