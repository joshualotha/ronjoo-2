import { motion } from "framer-motion";
import { Heart, Instagram } from "lucide-react";
import migrationImg from "@/assets/safari-migration.jpg";
import campImg from "@/assets/safari-camp.jpg";
import ngorongoroImg from "@/assets/safari-ngorongoro.jpg";
import kilimanjaroImg from "@/assets/safari-kilimanjaro.jpg";
import elephantImg from "@/assets/safari-elephant.jpg";
import zanzibarImg from "@/assets/safari-zanzibar.jpg";
import lionImg from "@/assets/safari-lion.jpg";
import heroImg from "@/assets/hero-savanna.jpg";

const galleryImages = [
  migrationImg, campImg, ngorongoroImg, kilimanjaroImg,
  elephantImg, zanzibarImg, lionImg, heroImg,
];

const InstagramGallery = () => {
  // Double for marquee effect
  const doubled = [...galleryImages, ...galleryImages];

  return (
    <section className="section-dark noise-overlay relative py-20 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 mb-10">
        <div className="flex items-end gap-4">
          <motion.h2
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="heading-display text-warm-charcoal text-[36px] md:text-[48px]"
          >
            Life in the Wild
          </motion.h2>
          <span className="font-sub font-light text-terracotta text-[14px] tracking-wider mb-2">
            @ronjoosafaris
          </span>
        </div>
      </div>

      {/* Marquee */}
      <div className="flex marquee" style={{ width: "fit-content" }}>
        {doubled.map((img, i) => (
          <div
            key={i}
            className="group relative flex-shrink-0 mx-1 overflow-hidden cursor-pointer"
            style={{
              width: "240px",
              height: i % 2 === 0 ? "240px" : "300px",
            }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url(${img})` }}
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-terracotta/0 group-hover:bg-terracotta/20 transition-colors duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
              <Heart size={20} className="text-warm-canvas" strokeWidth={1.5} />
              <Instagram size={20} className="text-warm-canvas" strokeWidth={1.5} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default InstagramGallery;
