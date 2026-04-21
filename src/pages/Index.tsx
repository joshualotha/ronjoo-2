import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/seo/SEO";
import FloatingElements from "@/components/FloatingElements";
import HeroSection from "@/components/home/HeroSection";
import FeaturedSafaris from "@/components/home/FeaturedSafaris";
import HowItWorks from "@/components/home/HowItWorks";
import GroupDepartures from "@/components/home/GroupDepartures";
import MapSection from "@/components/home/MapSection";
import Testimonials from "@/components/home/Testimonials";
import InstagramGallery from "@/components/home/InstagramGallery";
import QuoteSection from "@/components/home/QuoteSection";

const Index = () => {
  const schemaData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://ronjoosafaris.com/",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://ronjoosafaris.com/safaris?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  });

  return (
    <div className="min-h-screen bg-warm-canvas">
      <SEO 
        title="Ronjoo Safaris | Premium Tanzania Tours & Expeditions"
        description="Experience the ultimate luxury African safari in Tanzania. Unforgettable wildlife encounters, premium guides, and custom itineraries."
        url="https://ronjoosafaris.com/"
        canonicalUrl="https://ronjoosafaris.com/"
        type="website"
        schema={schemaData}
      />
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedSafaris />
        <HowItWorks />
        <GroupDepartures />
        <MapSection />
        <Testimonials />
        <InstagramGallery />
        <QuoteSection />
      </main>
      <Footer />
      <FloatingElements />
    </div>
  );
};

export default Index;
