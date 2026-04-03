import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const wordVariants = {
  hidden: { opacity: 0, y: -20, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: 0.6 + i * 0.08, duration: 0.9, ease: "easeOut" as const },
  }),
};

const HeroSection = () => {
  const { settings } = useSiteSettings();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  const line1 = ["Africa,", "Experienced"];
  const line2 = ["Differently."];

  return (
    <section ref={ref} className="relative min-h-[600px] h-[85vh] md:h-screen overflow-hidden pt-36 sm:pt-32 mb-16 sm:mb-24">
      {/* Background video with parallax */}
      <motion.div
        className="absolute inset-0"
        style={{ y: bgY }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-video.webm" type="video/webm" />
        </video>
      </motion.div>

      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.35) 100%)",
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-4 sm:px-8">
        <div className="max-w-[1200px] w-full flex flex-col items-center">
          {/* Top label */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="heading-sub text-[12px] sm:text-[14px] lg:text-[16px] mb-6 sm:mb-8"
          >
            {settings.physical_address || "Tanzania · East Africa"}
          </motion.p>

          {/* Headline with fluid scaling */}
          <h1 
            className="heading-display text-warm-canvas leading-[1.02] flex flex-col items-center"
            style={{ fontSize: "clamp(48px, 12vw, 120px)" }}
          >
            <span className="flex flex-wrap justify-center gap-x-[0.25em]">
              {line1.map((word, i) => (
                <motion.span
                  key={word}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={wordVariants}
                >
                  {word}
                </motion.span>
              ))}
            </span>
            <span className="block">
              {line2.map((word, i) => (
                <motion.span
                  key={word}
                  custom={i + line1.length}
                  initial="hidden"
                  animate="visible"
                  variants={wordVariants}
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </h1>
  
          {/* Subtext with fluid scaling */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="font-sub font-light text-warm-canvas max-w-[580px] mt-6 sm:mt-10 leading-relaxed"
            style={{ fontSize: "clamp(16px, 2.5vw, 22px)" }}
          >
            {settings.tagline || "Private safaris, bespoke itineraries, and guided expeditions across Tanzania's most extraordinary wild places."}
          </motion.p>
  
          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 mt-8 sm:mt-12"
          >
            <a href="#safaris" className="btn-safari-primary px-8 py-4 sm:px-10">
              Explore Safaris
            </a>
            <a href="#plan" className="btn-safari-outline hidden sm:inline-block px-8 py-4 sm:px-10">
              Plan My Trip
            </a>
          </motion.div>
        </div>
      </div>
  
        {/* Coordinates */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-10 left-6 lg:left-12 hidden md:block"
        >
          <p className="font-sub font-light text-warm-canvas/60 text-[11px] tracking-wider">
            03°22'S 036°41'E, Arusha, Tanzania
          </p>
        </motion.div>
    </section>
  );
};

export default HeroSection;
