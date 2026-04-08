import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingElements from "@/components/FloatingElements";
import HeroSection from "@/components/home/HeroSection";
import FeaturedSafaris from "@/components/home/FeaturedSafaris";
import HowItWorks from "@/components/home/HowItWorks";
import GroupDepartures from "@/components/home/GroupDepartures";
import MapSection from "@/components/home/MapSection";
import Testimonials from "@/components/home/Testimonials";
import InstagramGallery from "@/components/home/InstagramGallery";
import NewsletterSection from "@/components/NewsletterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-warm-canvas">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedSafaris />
        <HowItWorks />
        <GroupDepartures />
        <MapSection />
        <Testimonials />
        <InstagramGallery />
        <NewsletterSection />
      </main>
      <Footer />
      <FloatingElements />
    </div>
  );
};

export default Index;
