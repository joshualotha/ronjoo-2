import React, { useRef, useState, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getDestinations } from "@/services/publicApi";
import { tanzaniaMapPaths } from "../../data/mapData";

// SVG positions keyed by slug for stable matching with the DB
const mapPositions: Record<string, { x: number; y: number; label: string }> = {
  serengeti:    { x: 290, y: 100, label: "SERENGETI" },
  ngorongoro:   { x: 360, y: 120, label: "NGORONGORO" },
  tarangire:    { x: 400, y: 160, label: "TARANGIRE" },
  "lake-manyara": { x: 380, y: 135, label: "LAKE MANYARA" },
  mikumi:       { x: 410, y: 360, label: "MIKUMI" },
  ruaha:        { x: 320, y: 385, label: "RUAHA" },
  selous:       { x: 510, y: 380, label: "SELOUS" },
  zanzibar:     { x: 610, y: 288, label: "ZANZIBAR" },
  kilimanjaro:  { x: 470, y: 110, label: "KILIMANJARO" },
  arusha:       { x: 440, y: 130, label: "ARUSHA" },
};

const MapSection = () => {
  const { data: apiDestinations = [] } = useQuery({
    queryKey: ['destinations'],
    queryFn: getDestinations,
  });

  // Merge API data with map positions using slug
  const destinations = useMemo(() => 
    apiDestinations
      .filter((dest: any) => mapPositions[dest.slug])
      .map((dest: any) => ({
        ...dest,
        x: mapPositions[dest.slug].x,
        y: mapPositions[dest.slug].y,
        mapLabel: mapPositions[dest.slug].label,
        teaser: dest.tagline || dest.teaser || '',
        season: dest.bestSeason || '',
      })),
    [apiDestinations]
  );
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [hoveredDest, setHoveredDest] = useState<string | null>(null);

  return (
    <section className="section-dark noise-overlay relative py-24 md:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-16 relative">
          {/* Subtle watermark background */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 0.02, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[120px] md:text-[200px] font-serif font-bold whitespace-nowrap pointer-events-none select-none text-warm-charcoal"
          >
            TERRITORIES
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="heading-display text-warm-charcoal text-[48px] md:text-[64px] relative z-10"
          >
            Explore Our Territories
          </motion.h2>
          <div className="gold-rule mt-6 mx-auto relative z-10" />
        </div>

        <div ref={ref} className="relative max-w-4xl mx-auto">
          {/* Official High-Fidelity SVG Map (Derived from users' tz-04.svg) */}
          <svg
            viewBox="-30 -20 860 640" 
            className="w-full h-auto"
            style={{ filter: "drop-shadow(0 12px 40px rgba(0,0,0,0.06))" }}
          >
            <g id="Tanzania-Official" fill="hsl(38, 38%, 92%)" fillOpacity="0.08" stroke="hsl(43, 64%, 44%)" strokeWidth="1.2" strokeOpacity="0.4">
              {tanzaniaMapPaths.map((path, index) => (
                <motion.path
                  key={index}
                  d={path}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                  transition={{ duration: 1.5, delay: index * 0.02, ease: "easeInOut" }}
                  className="transition-all duration-700 hover:fill-opacity-10"
                />
              ))}
            </g>

            {/* Destination dots */}
            {destinations.map((dest) => (
              <g key={dest.name} className="pointer-events-none">
                {/* Ripple animation */}
                <circle
                  cx={dest.x}
                  cy={dest.y}
                  r={hoveredDest === dest.name ? 12 : 8}
                  fill="hsl(15, 55%, 50%)"
                  fillOpacity={hoveredDest === dest.name ? 0.2 : 0}
                  className="transition-all duration-500"
                />
                {/* Main dot */}
                <circle
                  cx={dest.x}
                  cy={dest.y}
                  r={hoveredDest === dest.name ? 6 : 4}
                  fill="hsl(15, 55%, 50%)"
                  className="cursor-pointer transition-all duration-300 pointer-events-auto"
                  onMouseEnter={() => setHoveredDest(dest.name)}
                  onMouseLeave={() => setHoveredDest(null)}
                />
                {/* Pulse ring */}
                <circle
                  cx={dest.x}
                  cy={dest.y}
                  r="8"
                  fill="none"
                  stroke="hsl(15, 55%, 50%)"
                  strokeWidth="1.5"
                  strokeOpacity="0.4"
                  className="animate-ping"
                  style={{ transformOrigin: `${dest.x}px ${dest.y}px`, animationDuration: "3s" }}
                />
                {/* Label */}
                <text
                  x={dest.x + 10}
                  y={dest.y + 4}
                  fill="hsl(24, 30%, 13%)"
                  fillOpacity="0.8"
                  fontSize="12"
                  fontFamily="Jost, sans-serif"
                  fontWeight="500"
                  letterSpacing="0.05em"
                  className="select-none pointer-events-none"
                >
                  {dest.mapLabel}
                </text>
              </g>
            ))}
          </svg>

          {/* Tooltip */}
          {hoveredDest && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-4 right-4 bg-deep-earth border border-gold/20 p-5 max-w-[240px]"
            >
              <h4 className="heading-display text-warm-charcoal text-[22px]">
                {hoveredDest}
              </h4>
              <p className="font-body font-light text-warm-charcoal/60 text-[14px] mt-2">
                {destinations.find((d: any) => d.name === hoveredDest)?.teaser}
              </p>
              <p className="label-accent text-gold text-[10px] mt-3">
                Best Season: {destinations.find((d: any) => d.name === hoveredDest)?.season}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MapSection;
