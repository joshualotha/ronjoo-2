import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getBlogPostBySlug, getBlogPosts } from "@/services/publicApi";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingElements from "@/components/FloatingElements";
import SEO from "@/components/seo/SEO";
import { Calendar, User, ArrowLeft, Share2, Tag, BookOpen } from "lucide-react";

const BlogPostDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: () => getBlogPostBySlug(slug!),
    enabled: !!slug,
  });

  const { data: recentPosts = [] } = useQuery({
    queryKey: ["recent-posts"],
    queryFn: getBlogPosts,
    select: (data) => data.filter((p: any) => p.slug !== slug).slice(0, 3)
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warm-canvas flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-terracotta/20 border-t-terracotta rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-warm-canvas flex flex-col items-center justify-center p-6 text-center">
        <h1 className="heading-display text-4xl mb-6">Story not found...</h1>
        <Link to="/blog" className="btn-safari-terracotta">Back to Journal</Link>
      </div>
    );
  }

  const schemaData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://ronjoosafaris.com/blog/${slug}`
    },
    "headline": post.title,
    "image": [
      post.featuredImage
    ],
    "datePublished": post.publishedDate,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Ronjoo Safaris",
      "logo": {
        "@type": "ImageObject",
        "url": "https://ronjoosafaris.com/Ronjoo-Safaris-Logo-new.png"
      }
    }
  });

  return (
    <div className="min-h-screen bg-warm-canvas selection:bg-terracotta/20">
      <SEO 
        title={`${post.title} — Journal | Ronjoo Safaris`}
        description={post.excerpt || `Read ${post.title} on the Ronjoo Safaris journal.`}
        image={post.featuredImage}
        url={`https://ronjoosafaris.com/blog/${slug}`}
        canonicalUrl={`https://ronjoosafaris.com/blog/${slug}`}
        type="article"
        schema={schemaData}
      />
      <Navbar />

      {/* Cinematic Hero */}
      <section className="relative h-[70vh] md:h-[85vh] overflow-hidden">
        <motion.div
           initial={{ scale: 1.15 }}
           animate={{ scale: 1 }}
           transition={{ duration: 15, ease: "easeOut" }}
           className="absolute inset-0 bg-cover bg-center bg-no-repeat"
           style={{ backgroundImage: `url(${post.featuredImage})` }}
        />
        <div className="absolute inset-0 bg-black/30 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1812] via-transparent to-transparent opacity-80" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-20 z-10">
          <div className="max-w-[900px] mx-auto text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-8"
            >
              <span className="px-4 py-1.5 bg-terracotta text-warm-canvas text-[11px] font-sub tracking-[0.3em] uppercase">
                {post.category}
              </span>
              <span className="w-8 h-[1px] bg-warm-canvas/40" />
              <span className="text-warm-canvas/80 text-[11px] font-sub tracking-[0.3em] uppercase">
                {new Date(post.publishedDate).toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="heading-display text-warm-canvas text-[42px] md:text-[72px] leading-[1.05] italic mb-8"
            >
              {post.title}
            </motion.h1>
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 0.6 }}
               transition={{ delay: 0.5 }}
               className="flex items-center justify-center md:justify-start gap-4 text-warm-canvas"
            >
               <User size={18} strokeWidth={1} />
               <span className="label-accent text-[12px] tracking-widest">{post.author}</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <article className="max-w-[1400px] mx-auto px-6 py-24 md:py-32 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
        {/* Left: Metadata Sidebar */}
        <div className="lg:col-span-3 space-y-12">
           <div className="sticky top-40">
              <Link to="/blog" className="flex items-center gap-3 text-terracotta text-[11px] font-sub tracking-widest uppercase hover:text-terracotta/80 transition-colors mb-12">
                 <ArrowLeft size={16} /> Back to stories
              </Link>

              <div className="space-y-8 pb-12 border-b border-faded-sand/20">
                 <div>
                    <h4 className="label-accent text-warm-charcoal/30 text-[9px] tracking-[0.3em] mb-3 uppercase">Words by</h4>
                    <p className="heading-display text-warm-charcoal text-2xl italic">{post.author}</p>
                 </div>
                 <div>
                    <h4 className="label-accent text-warm-charcoal/30 text-[9px] tracking-[0.3em] mb-3 uppercase">Published</h4>
                    <p className="body-text text-warm-charcoal text-[15px]">{new Date(post.publishedDate).toLocaleDateString("en-GB", { day: 'numeric', month: 'long' })}</p>
                 </div>
                 <div className="flex gap-4">
                    <button className="w-10 h-10 rounded-full border border-faded-sand text-warm-charcoal/40 hover:text-terracotta hover:border-terracotta transition-all duration-300 flex items-center justify-center">
                       <Share2 size={16} />
                    </button>
                 </div>
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="pt-8">
                   <h4 className="label-accent text-warm-charcoal/30 text-[9px] tracking-[0.3em] mb-4 uppercase">Topics</h4>
                   <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag: string) => (
                        <span key={tag} className="px-3 py-1 bg-faded-sand/10 text-warm-charcoal/60 text-[10px] font-sub tracking-wider uppercase">#{tag}</span>
                      ))}
                   </div>
                </div>
              )}
           </div>
        </div>

        {/* Center: Main Content */}
        <div className="lg:col-span-6">
           <div 
              className="prose prose-stone max-w-none prose-p:body-text prose-p:text-lg prose-p:leading-[1.9] prose-p:mb-10 prose-headings:heading-display prose-headings:mb-8 prose-img:rounded-[32px] prose-img:shadow-2xl prose-blockquote:italic prose-blockquote:text-2xl prose-blockquote:text-terracotta prose-blockquote:border-l-terracotta prose-blockquote:bg-terracotta/5 prose-blockquote:py-10 prose-blockquote:px-12"
              dangerouslySetInnerHTML={{ __html: post.content }}
           />
           
           <div className="mt-20 pt-20 border-t border-faded-sand/20">
              <div className="flex flex-col items-center text-center">
                 <div className="w-16 h-16 rounded-full bg-terracotta/10 flex items-center justify-center text-terracotta mb-6">
                    <BookOpen size={28} />
                 </div>
                 <h4 className="heading-display text-3xl mb-4 italic">Thank you for reading</h4>
                 <p className="body-text text-warm-charcoal/50 max-w-sm mb-10">Our stories are part of a larger mission to celebrate and protect the wild heart of Tanzania.</p>
                 <Link to="/contact" className="btn-safari-terracotta uppercase text-[11px] tracking-widest px-10">Inquire About an Expedition</Link>
              </div>
           </div>
        </div>

        {/* Right: Related / Recent */}
        <div className="lg:col-span-3">
           <div className="sticky top-40">
              <h4 className="heading-sub text-gold text-[10px] uppercase tracking-[0.4em] mb-10">Related Stories</h4>
              <div className="space-y-12">
                 {recentPosts.map((rPost: any) => (
                   <Link key={rPost.id} to={`/blog/${rPost.slug}`} className="block group">
                      <div className="aspect-video overflow-hidden rounded-2xl mb-4">
                         <img src={rPost.featuredImage} alt={`Related story: ${rPost.title}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                      </div>
                      <span className="label-accent text-terracotta text-[9px] uppercase tracking-widest block mb-2">{rPost.category}</span>
                      <h4 className="heading-display text-xl leading-snug group-hover:text-terracotta transition-colors italic">{rPost.title}</h4>
                   </Link>
                 ))}
              </div>
           </div>
        </div>
      </article>

      <Footer />
      <FloatingElements />
    </div>
  );
};

export default BlogPostDetailPage;
