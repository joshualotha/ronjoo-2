import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getSafaris } from "@/services/publicApi";
import heroImg from "@/assets/hero-savanna.jpg";

interface CardProps {
  slug: string;
  tag: string;
  duration: string;
  name: string;
  price: string;
  image: string;
  tall?: boolean;
}

const SafariCard = ({ slug, tag, duration, name, price, image, tall }: CardProps) => {
  return (
    <Link to={`/safari/${slug}`}>
    <motion.div
      initial={{ opacity: 0, scale: 1.04 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" as const }}
      className={`group relative overflow-hidden cursor-pointer ${
        tall ? "row-span-2 min-h-[500px] md:min-h-[640px]" : "min-h-[300px]"
      }`}
    >
      {/* Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.07]"
        style={{ backgroundImage: `url(${image})` }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F08]/80 via-[#1A0F08]/20 to-transparent" />
      {/* Hover bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-terracotta transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

      {/* Tags */}
      <div className="absolute top-5 left-5">
        <span className="label-accent text-gold text-[10px]">{tag}</span>
      </div>
      <div className="absolute top-5 right-5">
        <span className="font-sub text-[11px] tracking-wider bg-terracotta/90 text-warm-canvas px-3 py-1">
          {duration}
        </span>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 transition-transform duration-500 group-hover:-translate-y-1.5">
        <h3 className="heading-display text-warm-canvas text-[28px] md:text-[32px] leading-tight">
          {name}
        </h3>
        <div className="flex items-center justify-between mt-3">
          <p className="font-sub font-light text-warm-canvas/80 text-[14px]">
            {price}
          </p>
          <ArrowRight
            size={18}
            className="text-warm-canvas/60 group-hover:text-terracotta group-hover:translate-x-1 transition-all duration-300"
            strokeWidth={1.5}
          />
        </div>
      </div>
    </motion.div>
    </Link>
  );
};

const FeaturedSafaris = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const { data: allSafaris = [] } = useQuery({
    queryKey: ["safaris"],
    queryFn: getSafaris,
  });

  // Pick the first 3 featured safaris from the DB
  const featured = allSafaris.filter((s: any) => s.featured).slice(0, 3);

  // Resolve a display image for each safari
  const resolveImage = (safari: any): string => {
    if (safari.heroImages?.length) return safari.heroImages[0];
    if (safari.image) return safari.image;
    // Fallback to the local hero asset
    return heroImg;
  };

  // Tag line for card: join destinations or first category
  const resolveTag = (safari: any): string => {
    if (safari.destinations?.length) return safari.destinations.join(" · ");
    if (safari.category?.length) return safari.category[0];
    return "Safari";
  };

  return (
    <section id="safaris" className="section-light noise-overlay relative py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Title Area with Premium Watermark */}
        <div ref={ref} className="relative text-center mb-16 py-10">
          {/* Background Watermark */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 0.04, scale: 1 } : {}}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
          >
            <span 
              className="font-display italic leading-none whitespace-nowrap"
              style={{ fontSize: "clamp(80px, 20vw, 240px)" }}
            >
              Expeditions
            </span>
          </motion.div>

          <div className="relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="heading-display text-warm-charcoal text-[48px] md:text-[64px]"
            >
              Signature Experiences
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="gold-rule mt-6"
            />
          </div>
        </div>

        {/* Asymmetric grid - Top 3 featured from DB */}
        {featured.length >= 3 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SafariCard
              slug={featured[0].slug}
              tag={resolveTag(featured[0])}
              duration={featured[0].duration}
              name={featured[0].name}
              price={featured[0].priceFrom ? `From ${featured[0].priceFrom} per person` : ""}
              image={resolveImage(featured[0])}
              tall
            />
            <div className="grid grid-rows-2 gap-4">
              <SafariCard
                slug={featured[1].slug}
                tag={resolveTag(featured[1])}
                duration={featured[1].duration}
                name={featured[1].name}
                price={featured[1].priceFrom ? `From ${featured[1].priceFrom} per person` : ""}
                image={resolveImage(featured[1])}
              />
              <SafariCard
                slug={featured[2].slug}
                tag={resolveTag(featured[2])}
                duration={featured[2].duration}
                name={featured[2].name}
                price={featured[2].priceFrom ? `From ${featured[2].priceFrom} per person` : ""}
                image={resolveImage(featured[2])}
              />
            </div>
          </div>
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((s: any) => (
              <SafariCard
                key={s.slug}
                slug={s.slug}
                tag={resolveTag(s)}
                duration={s.duration}
                name={s.name}
                price={s.priceFrom ? `From ${s.priceFrom} per person` : ""}
                image={resolveImage(s)}
              />
            ))}
          </div>
        ) : null}

        {/* View All Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex justify-center mt-16"
        >
          <Link 
            to="/safaris" 
            className="btn-safari-terracotta-outline group flex items-center gap-3 px-10 py-5"
          >
            <span>View All Expeditions</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedSafaris;
