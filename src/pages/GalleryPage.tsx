import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Grid, List, X, Camera, MapPin, Trees, Sun, Waves } from "lucide-react";
import { getGalleryImages } from "@/services/publicApi";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingElements from "@/components/FloatingElements";

interface GalleryImage {
  id: string | number;
  src: string;
  alt: string;
  caption: string;
  tags: string[];
  category: string;
  destination: string;
  safari: string;
  createdAt?: string;
}

const categories = ['All', 'Safaris', 'Destinations', 'Wildlife', 'Accommodation', 'Team'];

const GalleryPage = () => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'asymmetric'>('asymmetric');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const { data: rawData = [], isLoading } = useQuery<GalleryImage[] | { data: GalleryImage[] }>({
    queryKey: ['gallery-images'],
    queryFn: getGalleryImages,
  });

  const images = Array.isArray(rawData) ? rawData : (rawData as any)?.data ?? [];

  const filteredImages = (images as GalleryImage[]).filter((img: GalleryImage) => {
    const matchSearch = !search ||
      (img.alt || '').toLowerCase().includes(search.toLowerCase()) ||
      (img.caption || '').toLowerCase().includes(search.toLowerCase()) ||
      (img.tags || []).some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    
    const matchCategory = categoryFilter === 'All' || img.category === categoryFilter;
    
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen bg-warm-canvas selection:bg-terracotta/20 selection:text-terracotta">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[80vh] overflow-hidden group">
        <motion.div
          initial={{ scale: 1.15 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 12, ease: "linear", repeat: Infinity, repeatType: "mirror" }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(/assets/hero-gallery.jpg)` }}
        />
        <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
        
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
          >
            <span className="label-accent text-warm-canvas/80 text-[11px] tracking-[0.4em] mb-6 block uppercase">
              The Visual Narrative
            </span>
            <h1 className="heading-display text-warm-canvas text-[64px] md:text-[96px] leading-[0.9] mb-8">
              Capturing <br />
              <span className="italic font-light">the Wild Soul</span>
            </h1>
            <div className="w-16 h-[1px] bg-warm-canvas/30 mx-auto mb-8" />
            <p className="font-sub text-warm-canvas/60 text-sm tracking-[0.1em] max-w-lg mx-auto uppercase">
               Tanzania through the lens of those who call it home.
            </p>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 cursor-pointer group/scroll"
          >
            <span className="label-accent text-warm-canvas/40 text-[9px] tracking-[0.2em] group-hover/scroll:text-warm-canvas/80 transition-colors">EXPLORE GALLERY</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-warm-canvas/60 to-transparent" />
          </motion.div>
      </section>

      {/* Intro Editorial section */}
      <section className="bg-warm-canvas noise-overlay py-32 md:py-48 relative overflow-hidden">
        {/* Background Decorative Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
           <motion.span 
              initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
              whileInView={{ opacity: 0.03, scale: 1, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="font-display italic text-[200px] md:text-[400px] text-warm-charcoal leading-none whitespace-nowrap"
           >
             Wildlife
           </motion.span>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
              className="lg:col-span-7"
            >
              <span className="label-accent text-terracotta text-[10px] tracking-[0.4em] mb-6 block">
                 ESTABLISHED 2010
              </span>
              <h2 className="heading-display text-warm-charcoal text-[48px] md:text-[72px] leading-[1.05] mb-10">
                Every frame tells <br />
                <span className="italic font-light">a story of the bush</span>
              </h2>
              
              <div className="flex items-center gap-12 mb-10">
                 <div className="w-16 h-[1px] bg-terracotta/40" />
                 <p className="body-text text-warm-charcoal/70 text-[18px] leading-relaxed max-w-md italic">
                    "We don't just photograph the wild; we capture the moments where time stands still."
                 </p>
              </div>

              <p className="body-text text-warm-charcoal/60 text-[16px] leading-[1.9] max-w-xl">
                 From the golden plains of the Serengeti to the turquoise waters of Zanzibar, our gallery captures the pulse and rhythm of Tanzania. These are not just photographs; they are windows into the soul of Africa, curated for those who seek the extraordinary.
              </p>
            </motion.div>

            <div className="lg:col-span-5 space-y-16">
                {[
                  { label: "MOMENTS CAPTURED", value: "500+", desc: "A decade of wild encounters" },
                  { label: "EXPEDITIONS", value: "150+", desc: "Across the Great Rift Valley" },
                  { label: "AUTHENTICITY", value: "100%", desc: "Unfiltered safari perspective" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className="flex items-center gap-8 group"
                  >
                    <div className="h-10 w-[1px] bg-terracotta/20 group-hover:bg-terracotta group-hover:h-12 transition-all duration-500" />
                    <div>
                       <span className="heading-display text-terracotta text-[32px] md:text-[42px] leading-none block mb-1">
                          {stat.value}
                       </span>
                       <span className="label-accent text-warm-charcoal/40 text-[9px] tracking-[0.2em] block">
                          {stat.label}
                       </span>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Controls */}
      <section className="bg-warm-canvas relative z-20 pb-12">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-y border-faded-sand/30 py-8">
                {/* Category Filters */}
                <div className="flex flex-wrap items-center justify-center gap-8">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategoryFilter(cat)}
                            className={`label-accent text-[11px] tracking-[0.25em] transition-all duration-500 relative group ${
                                categoryFilter === cat ? 'text-terracotta' : 'text-warm-charcoal/40 hover:text-warm-charcoal'
                            }`}
                        >
                            {cat}
                            <span className={`absolute -bottom-2 left-0 h-[1px] bg-terracotta transition-all duration-500 ${
                                categoryFilter === cat ? 'w-full' : 'w-0'
                            }`} />
                        </button>
                    ))}
                </div>

                {/* Search and View Controls */}
                <div className="flex items-center gap-8 w-full md:w-auto">
                    <div className="relative group flex-1 md:flex-none min-w-[200px]">
                        <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-warm-charcoal/30 group-focus-within:text-terracotta transition-colors" size={14} />
                        <input
                            type="text"
                            placeholder="SEARCH BY TAG..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-transparent border-none focus:ring-0 w-full pl-6 pr-4 py-2 label-accent text-[10px] text-warm-charcoal placeholder-warm-charcoal/30 caret-terracotta outline-none"
                        />
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Main Gallery Grid */}
      <section className="pb-32 bg-warm-canvas noise-overlay">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-20">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="aspect-[4/5] bg-faded-sand/20 animate-pulse rounded-[16px]" />
              ))}
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-40 border border-dashed border-faded-sand/30 rounded-[32px]">
               <Camera size={42} strokeWidth={1} className="mx-auto text-warm-charcoal/20 mb-6" />
               <h3 className="heading-display text-2xl text-warm-charcoal/40 italic">The wild remains hidden...</h3>
               <p className="label-accent text-[10px] text-warm-charcoal/30 mt-4">Try adjusting your filters to reveal more.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              {filteredImages.map((image: GalleryImage, i: number) => {
                // Create a staggered/asymmetric grid feel with column spans
                const spans = [
                   "lg:col-span-4 aspect-[4/5]",
                   "lg:col-span-8 aspect-[16/9]",
                   "lg:col-span-7 aspect-[4/3]",
                   "lg:col-span-5 aspect-[3/4]",
                   "lg:col-span-12 aspect-[21/9]",
                   "lg:col-span-6 aspect-[1/1]",
                   "lg:col-span-6 aspect-[1/1]",
                ];
                const spanClass = spans[i % spans.length];

                return (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: (i % 3) * 0.1 }}
                    className={`${spanClass} relative overflow-hidden group cursor-none`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <div className="absolute inset-0 bg-deep-earth/10 transition-colors group-hover:bg-transparent duration-500" />
                    <img
                      src={image.src}
                      alt={image.alt}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[0.19, 1, 0.22, 1] group-hover:scale-105"
                    />
                    
                    {/* Overlay info */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-end p-8">
                       <span className="label-accent text-warm-canvas text-[9px] mb-2 block tracking-[0.3em]">
                          {image.category} • {image.destination || 'Expedition'}
                       </span>
                       <h3 className="heading-display text-warm-canvas text-[24px] italic leading-none mb-1">
                          {image.caption}
                       </h3>
                    </div>

                    {/* Custom Cursor Preview (Hover effect dot) */}
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                        <div className="w-16 h-16 rounded-full bg-terracotta backdrop-blur-sm text-warm-canvas flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-500 ease-out font-sub text-[10px] tracking-widest uppercase">
                           View
                        </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[400] bg-[#110D0A]/98 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12"
          >
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 md:top-10 md:right-10 w-14 h-14 flex items-center justify-center rounded-full bg-warm-charcoal/80 backdrop-blur-md border border-warm-canvas/10 text-warm-canvas hover:bg-terracotta hover:text-warm-canvas transition-all duration-500 z-[500] group shadow-2xl"
            >
              <X size={24} className="group-hover:rotate-90 transition-transform duration-500" />
            </motion.button>

            <div className="max-w-[1200px] w-full flex flex-col items-center">
              <motion.div
                 initial={{ scale: 0.9, opacity: 0, filter: "blur(10px)" }}
                 animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                 className="relative group/image overflow-hidden"
              >
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  className="max-h-[75vh] w-auto object-contain border border-warm-canvas/10 shadow-2xl"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-12 text-center"
              >
                 <span className="label-accent text-terracotta text-[10px] tracking-[0.4em] mb-4 block">
                   {selectedImage.category} • {selectedImage.destination || 'Uncharted Territory'}
                 </span>
                 <h2 className="heading-display text-warm-canvas text-[36px] md:text-[52px] leading-tight mb-4 italic">
                   {selectedImage.caption}
                 </h2>
                 <p className="font-sub font-light text-warm-canvas/50 text-sm max-w-2xl mx-auto leading-relaxed">
                   {selectedImage.alt}
                 </p>
                 
                 <div className="flex flex-wrap justify-center gap-3 mt-8">
                   {selectedImage.tags?.map(tag => (
                     <span key={tag} className="px-3 py-1 border border-warm-canvas/10 text-warm-canvas/40 font-sub text-[10px] uppercase tracking-wider">
                       #{tag}
                     </span>
                   ))}
                 </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
      <FloatingElements />
    </div>
  );
};

export default GalleryPage;