import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getBlogPosts } from "@/services/publicApi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingElements from "@/components/FloatingElements";
import { Link } from "react-router-dom";
import { Calendar, User, ArrowRight, BookOpen } from "lucide-react";
import EditorialIntro from "@/components/EditorialIntro";

interface BlogPost {
  id: string | number;
  slug: string;
  title: string;
  category: string;
  author: string;
  publishedDate: string;
  excerpt: string;
  featuredImage: string;
}

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["blog-posts"],
    queryFn: getBlogPosts,
  });

  const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];

  const filteredPosts = activeCategory === "All" 
    ? posts 
    : posts.filter((p) => p.category === activeCategory);

  const featuredPost = posts[0];
  const remainingPosts = filteredPosts.filter((p) => p.id !== featuredPost?.id);

  return (
    <div className="min-h-screen bg-warm-canvas selection:bg-terracotta/20">
      <Navbar />

      {/* Cinematic Hero */}
      <section className="relative h-[80vh] overflow-hidden group">
        <motion.div
           initial={{ scale: 1.15 }}
           animate={{ scale: 1.05 }}
           transition={{ duration: 15, ease: "linear", repeat: Infinity, repeatType: "mirror" }}
           className="absolute inset-0 bg-cover bg-center bg-no-repeat"
           style={{ backgroundImage: `url(/assets/hero-blogs.jpg)` }}
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
              The Wild Journal
            </span>
            <h1 className="heading-display text-warm-canvas text-[56px] md:text-[84px] leading-[1.1] mb-8">
              Stories from <br />
              <span className="italic font-light">the Deep Heart</span>
            </h1>
            <div className="w-16 h-[1px] bg-warm-canvas/30 mx-auto mb-8" />
            <p className="font-sub text-warm-canvas/60 text-sm tracking-[0.1em] max-w-lg mx-auto uppercase">
               Reflections on conservation, culture, and the quiet moments between the wild.
            </p>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 cursor-pointer group/scroll"
            onClick={() => {
              document.getElementById('blog-intro')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span className="label-accent text-warm-canvas/40 text-[9px] tracking-[0.2em] group-hover/scroll:text-warm-canvas/80 transition-colors">EXPLORE STORIES</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-warm-canvas/60 to-transparent" />
          </motion.div>
      </section>

      {/* Editorial Intro */}
      <EditorialIntro 
        id="blog-intro"
        subtitle="The Wild Journal"
        title="Clarity in the Narratives"
      >
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-display italic text-[24px] md:text-[32px] text-warm-charcoal mb-8">
            Beyond the dust and the track, there are the stories that remain.
          </p>
          <div className="body-text text-warm-charcoal/60 text-[17px] leading-relaxed space-y-6">
            <p>
              Our journal is more than just travel logs; it is a collection of on-the-ground reflections, deep-dives into Tanzanian conservation efforts, and the human stories that define our heritage.
            </p>
            <p>
              We believe that to truly understand the African wilderness, one must listen to the voices of those who dwell within it. From our guides to our researchers, these are the chronicles of the savanna.
            </p>
          </div>
        </div>
      </EditorialIntro>

      {/* Category Filters */}
      <section className="sticky top-20 z-40 bg-warm-canvas/80 backdrop-blur-md border-y border-faded-sand/20 py-6 mb-20">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-center gap-8 md:gap-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`label-accent text-[11px] tracking-[0.2em] transition-all duration-300 relative group uppercase ${
                activeCategory === cat ? "text-terracotta" : "text-warm-charcoal/40 hover:text-warm-charcoal"
              }`}
            >
              {cat}
              <span className={`absolute -bottom-2 left-0 h-[1.5px] bg-terracotta transition-all duration-500 ${
                activeCategory === cat ? "w-full" : "w-0"
              }`} />
            </button>
          ))}
        </div>
      </section>

      <main className="max-w-[1400px] mx-auto px-6 pb-32">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[16/10] bg-faded-sand/20 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {activeCategory === "All" && featuredPost && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-24"
              >
                <Link to={`/blog/${featuredPost.slug}`} className="grid grid-cols-1 lg:grid-cols-12 gap-12 group overflow-hidden">
                  <div className="lg:col-span-8 overflow-hidden rounded-[32px]">
                    <img
                      src={featuredPost.featuredImage}
                      alt={featuredPost.title}
                      className="w-full h-[500px] object-cover transition-transform duration-[2s] ease-[0.19, 1, 0.22, 1] group-hover:scale-105"
                    />
                  </div>
                  <div className="lg:col-span-4 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="px-3 py-1 bg-terracotta/10 text-terracotta text-[10px] tracking-widest uppercase font-sub">
                        {featuredPost.category}
                      </span>
                      <span className="w-8 h-[1px] bg-warm-charcoal/10" />
                      <span className="text-warm-charcoal/40 text-[10px] tracking-widest uppercase font-sub">
                        Featured Story
                      </span>
                    </div>
                    <h2 className="heading-display text-4xl md:text-5xl text-warm-charcoal mb-6 group-hover:text-terracotta transition-colors duration-500 italic">
                      {featuredPost.title}
                    </h2>
                    <p className="body-text text-warm-charcoal/60 text-lg leading-relaxed mb-8 line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-6 text-[11px] font-sub tracking-widest uppercase text-warm-charcoal/40 group-hover:text-terracotta transition-colors">
                      <span className="flex items-center gap-2"><Calendar size={14} /> {new Date(featuredPost.publishedDate).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span className="flex items-center gap-2"><ArrowRight size={14} /> Read Narrative</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
              {remainingPosts.map((post, i) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 3) * 0.1 }}
                  className="group"
                >
                  <Link to={`/blog/${post.slug}`} className="block">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] mb-8 shadow-sm">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[0.19, 1, 0.22, 1] group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                    </div>
                    <div className="space-y-4">
                      <span className="label-accent text-terracotta text-[9px] tracking-[0.3em] uppercase block">
                        {post.category}
                      </span>
                      <h3 className="heading-display text-2xl text-warm-charcoal group-hover:text-terracotta transition-colors duration-500 italic leading-tight">
                        {post.title}
                      </h3>
                      <p className="body-text text-warm-charcoal/50 text-[15px] leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-faded-sand/10">
                        <span className="flex items-center gap-2 text-[10px] tracking-widest text-warm-charcoal/40 uppercase font-sub">
                          <Calendar size={12} /> {new Date(post.publishedDate).toLocaleDateString("en-GB", { day: 'numeric', month: 'short' })}
                        </span>
                        <div className="w-8 h-8 rounded-full border border-terracotta/20 flex items-center justify-center text-terracotta group-hover:bg-terracotta group-hover:text-warm-canvas transition-all duration-500">
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </motion.div>
        )}
      </main>

      <Footer />
      <FloatingElements />
    </div>
  );
};

export default BlogPage;
