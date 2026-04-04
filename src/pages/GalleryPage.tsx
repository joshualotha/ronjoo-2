import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Grid, List, X } from "lucide-react";
import { getGalleryImages } from "@/services/publicApi";
import { useQuery } from "@tanstack/react-query";

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

export default function GalleryPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const { data: images = [], isLoading } = useQuery({
    queryKey: ['gallery-images'],
    queryFn: getGalleryImages,
  });

  const filteredImages = images.filter((img: GalleryImage) => {
    const matchSearch = !search || 
      img.alt.toLowerCase().includes(search.toLowerCase()) ||
      img.caption.toLowerCase().includes(search.toLowerCase()) ||
      img.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    
    const matchCategory = categoryFilter === 'All' || img.category === categoryFilter;
    
    return matchSearch && matchCategory;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warm-canvas pt-24 pb-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="animate-pulse">
            <div className="h-12 bg-warm-charcoal/10 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 bg-warm-charcoal/10 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-canvas pt-24 pb-20">
      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4">
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 text-warm-canvas hover:text-terracotta transition-colors"
          >
            <X size={24} />
          </button>
          <div className="max-w-4xl max-h-[80vh] overflow-hidden">
            <img 
              src={selectedImage.src} 
              alt={selectedImage.alt}
              className="w-full h-auto max-h-[70vh] object-contain"
            />
            <div className="mt-4 text-warm-canvas">
              <h3 className="text-xl font-display italic">{selectedImage.caption}</h3>
              <p className="text-sm opacity-80 mt-2">{selectedImage.alt}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedImage.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-terracotta/20 text-terracotta text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="heading-display text-warm-charcoal text-[48px] md:text-[64px] mb-4">
            Gallery
          </h1>
          <p className="font-sub text-warm-charcoal/80 text-lg max-w-3xl">
            Explore our collection of stunning safari moments, wildlife encounters, and breathtaking destinations from across Tanzania.
          </p>
        </motion.div>

        {/* Filters and Controls */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 font-sub font-normal text-[13px] uppercase tracking-[0.1em] border transition-colors ${
                  categoryFilter === cat 
                    ? 'bg-warm-charcoal text-warm-canvas border-warm-charcoal' 
                    : 'border-[#E8E0D5] text-warm-charcoal hover:border-terracotta'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-warm-charcoal/50" size={18} />
              <input
                type="text"
                placeholder="Search images by tags, caption, or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-64 pl-10 pr-4 py-2 border border-[#E8E0D5] bg-transparent text-warm-charcoal placeholder-warm-charcoal/50 focus:outline-none focus:border-terracotta"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 border transition-colors ${
                  viewMode === 'grid' 
                    ? 'border-terracotta text-terracotta' 
                    : 'border-[#E8E0D5] text-warm-charcoal hover:border-terracotta'
                }`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 border transition-colors ${
                  viewMode === 'list' 
                    ? 'border-terracotta text-terracotta' 
                    : 'border-[#E8E0D5] text-warm-charcoal hover:border-terracotta'
                }`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="font-sub text-warm-charcoal/70">
            Showing {filteredImages.length} of {images.length} images
          </p>
        </div>

        {/* Gallery Grid */}
        {filteredImages.length === 0 ? (
          <div className="text-center py-20">
            <Filter size={48} className="mx-auto text-warm-charcoal/30 mb-4" />
            <h3 className="text-xl font-display italic text-warm-charcoal mb-2">No images found</h3>
            <p className="text-warm-charcoal/70">Try adjusting your search or filter criteria</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image: GalleryImage) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="group relative overflow-hidden cursor-pointer bg-warm-charcoal/5 border border-[#E8E0D5]"
                onClick={() => setSelectedImage(image)}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-warm-canvas font-display italic text-lg mb-2">{image.caption}</h3>
                  <p className="text-warm-canvas/80 text-sm line-clamp-2">{image.alt}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {image.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-1 bg-terracotta/80 text-warm-canvas text-xs rounded">
                        {tag}
                      </span>
                    ))}
                    {image.tags.length > 3 && (
                      <span className="px-2 py-1 bg-warm-charcoal/80 text-warm-canvas text-xs rounded">
                        +{image.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="inline-block px-2 py-1 bg-terracotta/10 text-terracotta text-xs font-medium uppercase tracking-wider">
                        {image.category}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredImages.map((image: GalleryImage) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col md:flex-row gap-4 p-4 border border-[#E8E0D5] hover:border-terracotta transition-colors cursor-pointer group"
                onClick={() => setSelectedImage(image)}
              >
                <div className="md:w-48 h-48 flex-shrink-0 overflow-hidden">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <h3 className="text-xl font-display italic text-warm-charcoal">{image.caption}</h3>
                    <span className="px-2 py-1 bg-terracotta/10 text-terracotta text-xs font-medium uppercase tracking-wider">
                      {image.category}
                    </span>
                  </div>
                  <p className="text-warm-charcoal/80 mb-4">{image.alt}</p>
                  <div className="flex flex-wrap gap-2">
                    {image.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-warm-charcoal/10 text-warm-charcoal text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {(image.destination || image.safari) && (
                    <div className="mt-4 pt-4 border-t border-[#E8E0D5]">
                      <div className="flex flex-wrap gap-4 text-sm text-warm-charcoal/70">
                        {image.destination && (
                          <span>Destination: {image.destination}</span>
                        )}
                        {image.safari && (
                          <span>Safari: {image.safari}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State for No Images */}
        {images.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <div className="text-warm-charcoal/30 mb-6">
              <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-display italic text-warm-charcoal mb-4">Gallery Coming Soon</h3>
            <p className="text-warm-charcoal/70 max-w-md mx-auto">
              Our gallery is being prepared with stunning images from our safaris. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}