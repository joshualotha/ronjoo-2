import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import SafariToPackageRedirect from "./pages/SafariToPackageRedirect";
import Index from "./pages/Index";
import SafarisPage from "./pages/SafarisPage";
import SafariDetailPage from "./pages/SafariDetailPage";
import SafariPackagePage from "./pages/SafariPackagePage";
import JoinSafariPage from "./pages/JoinSafariPage";
import CustomSafariPage from "./pages/CustomSafariPage";
import DestinationsPage from "./pages/DestinationsPage";
import BookSafariPage from "./pages/BookSafariPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import DestinationDetailPage from "./pages/DestinationDetailPage";
import NotFound from "./pages/NotFound";
import FaqPage from "./pages/FaqPage";
import AddOnsPage from "./pages/AddOnsPage";
import AddOnDetailPage from "./pages/AddOnDetailPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import CookiePolicyPage from "./pages/CookiePolicyPage";
import GalleryPage from "./pages/GalleryPage";
import CookieConsentBanner from "./components/CookieConsentBanner";
import BlogPage from "./pages/BlogPage";
import BlogPostDetailPage from "./pages/BlogPostDetailPage";
import ReviewsPage from "./pages/ReviewsPage";

// Admin imports
import { AdminProvider } from "./admin/context/AdminContext";
import AdminLayout from "./admin/components/AdminLayout";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminBookings from "./admin/pages/AdminBookings";
import AdminEnquiries from "./admin/pages/AdminEnquiries";
import AdminDepartures from "./admin/pages/AdminDepartures";
import AdminSafaris from "./admin/pages/AdminSafaris";
import AdminBlog from "./admin/pages/AdminBlog";
import AdminReviews from "./admin/pages/AdminReviews";
import AdminNewsletter from "./admin/pages/AdminNewsletter";
import AdminTeam from "./admin/pages/AdminTeam";
import AdminSettings from "./admin/pages/AdminSettings";
import AdminFaqs from "./admin/pages/AdminFaqs";
import AdminGallery from "./admin/pages/AdminGallery";
import AdminAddOns from "./admin/pages/AdminAddOns";
import AdminDestinations from "./admin/pages/AdminDestinations";

import AdminWaitlists from "./admin/pages/AdminWaitlists";
import AdminPromotions from "./admin/pages/AdminPromotions";
import AdminSeo from "./admin/pages/AdminSeo";
import AdminEmailTemplates from "./admin/pages/AdminEmailTemplates";
import AdminPricing from "./admin/pages/AdminPricing";
import AdminUsers from "./admin/pages/AdminUsers";
import AdminProfile from "./admin/pages/AdminProfile";
import AdminWildlife from "./admin/pages/AdminWildlife";
import AdminAccommodations from "./admin/pages/AdminAccommodations";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/safaris" element={<SafarisPage />} />
          <Route path="/safari/:id" element={<SafariToPackageRedirect />} />
          <Route path="/safaris/:slug" element={<SafariDetailPage />} />
          <Route path="/book/:slug" element={<BookSafariPage />} />
          <Route path="/departures" element={<JoinSafariPage />} />
          <Route path="/plan" element={<CustomSafariPage />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/destinations/:slug" element={<DestinationDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/add-ons" element={<AddOnsPage />} />
          <Route path="/add-ons/:slug" element={<AddOnDetailPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostDetailPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/cookie-policy" element={<CookiePolicyPage />} />

          {/* Admin routes */}
          <Route path="/kijani-desk/login" element={<AdminProvider><AdminLogin /></AdminProvider>} />
          <Route path="/kijani-desk" element={<AdminProvider><AdminLayout /></AdminProvider>}>
            <Route index element={<AdminDashboard />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="enquiries" element={<AdminEnquiries />} />
            <Route path="departures" element={<AdminDepartures />} />
            <Route path="waitlists" element={<AdminWaitlists />} />
            <Route path="safaris" element={<AdminSafaris />} />
            <Route path="safaris/new" element={<AdminSafaris />} />
            <Route path="destinations" element={<AdminDestinations />} />
            <Route path="wildlife" element={<AdminWildlife />} />
            <Route path="accommodations" element={<AdminAccommodations />} />
            <Route path="add-ons" element={<AdminAddOns />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="faqs" element={<AdminFaqs />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="newsletter" element={<AdminNewsletter />} />
            <Route path="promotions" element={<AdminPromotions />} />
            <Route path="seo" element={<AdminSeo />} />
            <Route path="team" element={<AdminTeam />} />
            <Route path="email-templates" element={<AdminEmailTemplates />} />
            <Route path="pricing" element={<AdminPricing />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
        <CookieConsentBanner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;
