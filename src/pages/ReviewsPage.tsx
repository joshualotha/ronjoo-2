import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getReviews } from "@/services/publicApi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingElements from "@/components/FloatingElements";
import SEO from "@/components/seo/SEO";
import { Link } from "react-router-dom";
import { Star, MapPin, Calendar, MessageSquare, Quote, ArrowRight } from "lucide-react";

interface Review {
  id: string | number;
  guestName: string;
  country: string;
  countryFlag: string;
  rating: number;
  safariName: string;
  safariDate: string;
  excerpt: string;
  fullText: string;
  ownerResponse?: string;
}

const ReviewsPage = () => {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const { data: reviews = [], isLoading } = useQuery<Review[]>({
    queryKey: ["reviews"],
    queryFn: getReviews,
  });

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  const schemaData = reviews.length > 0 ? JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Ronjoo Safaris",
    "url": "https://ronjoosafaris.com",
    "logo": "https://ronjoosafaris.com/Ronjoo-Safaris-Logo-new.png",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": averageRating,
      "reviewCount": reviews.length
    }
  }) : undefined;

  return (
    <div className="min-h-screen bg-warm-canvas selection:bg-terracotta/20">
      <SEO 
        title="Guest Reviews & Chronicles | Ronjoo Safaris"
        description="Read unfiltered reviews and stories from our past safari guests."
        url="https://ronjoosafaris.com/reviews"
        canonicalUrl="https://ronjoosafaris.com/reviews"
        type="website"
        schema={schemaData}
      />
      <Navbar />

      {/* Cinematic Hero */}
      <section className="relative h-[80vh] overflow-hidden group">
        <motion.div
           initial={{ scale: 1.15 }}
           animate={{ scale: 1.05 }}
           transition={{ duration: 15, ease: "linear", repeat: Infinity, repeatType: "mirror" }}
           className="absolute inset-0 bg-cover bg-center bg-no-repeat"
           style={{ backgroundImage: `url(/assets/hero-gallery.jpg)` }}
        />
        <div className="absolute inset-0 bg-black/20 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-warm-canvas/80" />
        
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
          >
            <span className="label-accent text-warm-canvas/80 text-[11px] tracking-[0.4em] mb-6 block uppercase">
              Guest Chronicles
            </span>
            <h1 className="heading-display text-warm-canvas text-[56px] md:text-[84px] leading-[1.1] mb-12">
              Letters from <br />
              <span className="italic font-light">the wilderness</span>
            </h1>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20">
               <div className="text-center">
                  <span className="heading-display text-4xl text-gold block mb-2">{averageRating}</span>
                  <div className="flex gap-1 mb-2 justify-center text-gold">
                     {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <span className="label-accent text-warm-canvas/40 text-[9px] uppercase tracking-widest">Average Rating</span>
               </div>
               <div className="w-[1px] h-12 bg-warm-canvas/20 hidden md:block" />
               <div className="text-center">
                  <span className="heading-display text-4xl text-gold block mb-2">{reviews.length}</span>
                  <span className="label-accent text-warm-canvas/40 text-[9px] uppercase tracking-widest">Global Reviews</span>
               </div>
               <div className="w-[1px] h-12 bg-warm-canvas/20 hidden md:block" />
               <div className="text-center">
                  <span className="heading-display text-4xl text-gold block mb-2">98%</span>
                  <span className="label-accent text-warm-canvas/40 text-[9px] uppercase tracking-widest">Excellence Rate</span>
               </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 cursor-pointer group/scroll"
            onClick={() => {
              document.getElementById('intro-chronicles')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span className="label-accent text-warm-canvas/40 text-[9px] tracking-[0.2em] group-hover/scroll:text-warm-canvas/80 transition-colors">READ REVIEWS</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-warm-canvas/60 to-transparent" />
          </motion.div>
      </section>

      {/* Editorial Intro */}
      <section id="intro-chronicles" className="relative py-24 md:py-32 px-6 overflow-hidden bg-warm-canvas">
        <div className="max-w-[1400px] mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <span className="label-accent text-terracotta text-[10px] tracking-[0.4em] mb-8 block uppercase">The Experiences</span>
            <p className="heading-display text-warm-charcoal text-3xl md:text-5xl italic leading-tight mb-8">
              "Every journey is a legacy <br />
              <span className="text-terracotta/80">written in the heart.</span>"
            </p>
            <div className="w-16 h-[1px] bg-terracotta/20 mx-auto mb-8" />
            <p className="body-text text-warm-charcoal/60 text-lg leading-[1.8]">
              Read the unfiltered stories of those who have ventured into the wild with us. From the first roar of a lion to the quiet sunset over the caldera, these are the moments that define a lifetime.
            </p>
          </motion.div>
        </div>
        
        {/* Background Decorative Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
          <span className="font-display italic text-[250px] md:text-[500px] text-warm-charcoal/[0.03] leading-none whitespace-nowrap">
            Chronicles
          </span>
        </div>
      </section>

      {/* Main Grid */}
      <section className="max-w-[1400px] mx-auto px-6 pb-32">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-faded-sand/20 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {reviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.1 }}
                className="bg-white border border-faded-sand/30 p-10 rounded-[32px] group hover:border-terracotta/20 hover:shadow-xl transition-all duration-500 flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-8">
                   <div className="flex gap-1 text-gold">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} stroke="currentColor" />
                      ))}
                   </div>
                   <Quote className="text-terracotta/10 group-hover:text-terracotta/20 transition-colors" size={32} strokeWidth={1} />
                </div>

                <div className="grow">
                   <h3 className="heading-display text-2xl text-warm-charcoal italic mb-4 leading-snug">
                     {review.excerpt}
                   </h3>
                   <p className="body-text text-warm-charcoal/60 text-[15px] leading-relaxed mb-8 line-clamp-4">
                     "{review.fullText}"
                   </p>
                </div>

                <div className="pt-8 border-t border-faded-sand/10 flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-faded-sand/20 flex items-center justify-center text-warm-charcoal/40 uppercase font-display italic text-xl">
                      {review.guestName.charAt(0)}
                   </div>
                   <div>
                      <h4 className="heading-sub text-warm-charcoal text-[13px] uppercase tracking-wider mb-1">
                        {review.guestName}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-warm-charcoal/40 font-sub tracking-widest uppercase">
                         <span className="flex items-center gap-1"><MapPin size={10} /> {review.country}</span>
                         <span className="w-1 h-1 rounded-full bg-warm-charcoal/10" />
                         <span className="flex items-center gap-1"><Calendar size={10} /> {new Date(review.safariDate).toLocaleDateString("en-GB", { month: 'short', year: 'numeric' })}</span>
                      </div>
                   </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* Trust Quote */}
      <section className="bg-deep-earth py-32 md:py-48 px-6 text-center relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full noise-overlay opacity-30" />
         <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 1 }}
           className="relative z-10 max-w-4xl mx-auto"
         >
            <span className="label-accent text-gold text-[10px] tracking-[0.4em] mb-12 block uppercase">A Legacy of Trust</span>
            <p className="heading-display text-warm-canvas text-[42px] md:text-[64px] leading-tight italic">
              "We arrived as strangers, but <br />
              <span className="text-gold/80">we left as family.</span>"
            </p>
            <div className="w-24 h-[1px] bg-gold/20 mx-auto mt-16 mb-12" />
            <Link to="/plan" className="btn-safari-gold uppercase text-[11px] tracking-widest px-12">Begin Your Story</Link>
         </motion.div>
      </section>

      <Footer />
      <FloatingElements />
    </div>
  );
};

export default ReviewsPage;
