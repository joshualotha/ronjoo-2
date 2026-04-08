import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Menu, X, MapPin, Mail, Phone } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const GT_SCRIPT_ID = "gtranslate-script";
const GT_STYLE_ID = "gtranslate-style";

const useGTranslate = () => {
  useEffect(() => {
    const wrapper = document.querySelector<HTMLDivElement>(".gtranslate_wrapper");
    if (wrapper) {
      wrapper.innerHTML = "";
    }

    (window as any).gtranslateSettings = {
      default_language: "en",
      languages: ["en", "fr", "it", "es", "de", "zh-CN", "ko"],
      wrapper_selector: ".gtranslate_wrapper",
    };

    // Remove existing script to force re-evaluation when navigating between pages natively
    const existingScript = document.getElementById(GT_SCRIPT_ID);
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.id = GT_SCRIPT_ID;
    script.src = "https://cdn.gtranslate.net/widgets/latest/flags.js";
    script.defer = true;
    document.body.appendChild(script);

    // Check if style already exists
    if (!document.getElementById(GT_STYLE_ID)) {
      const style = document.createElement("style");
      style.id = GT_STYLE_ID;
      style.innerHTML = `
        .gtranslate_wrapper { display: flex !important; align-items: center !important; gap: 0.45rem !important; }
        .gtranslate_wrapper img { width: 16px !important; height: 11px !important; margin: 0 2px !important; }
        .gtranslate_wrapper .gtranslate_selector a { font-size: 11px !important; }
        .gtranslate_wrapper .gtranslate_selector { margin: 0 !important; }
      `;
      document.head.appendChild(style);
    }

    return () => {
      // Don't remove script on unmount as it may break consecutive navigations
    };
  }, []);
};

const navLinks = [
  { label: "Safaris", href: "/safaris" },
  { label: "Add-Ons", href: "/add-ons" },
  { label: "Destinations", href: "/destinations" },
  { label: "Gallery", href: "/gallery" },
  { label: "Join a Safari", href: "/departures" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  useGTranslate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { settings } = useSiteSettings();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[60] bg-warm-canvas text-warm-charcoal border-b border-warm-charcoal/10 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex items-center justify-between h-9">
          <div className="hidden sm:flex items-center gap-5 text-[11px] font-semibold tracking-wider uppercase">
            <div className="flex items-center gap-1 text-warm-charcoal/80">
              <MapPin size={12} />
              <span>{settings.physical_address}</span>
            </div>
            <div className="flex items-center gap-1 text-warm-charcoal/80">
              <Phone size={12} />
              <span>{settings.whatsapp_number}</span>
            </div>
          </div>

          <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-2">
            <div className="flex items-center gap-1 rounded-lg px-2 py-1">
              <img
                src="https://img.icons8.com/?size=100&id=V5cGWnc9R4xj&format=png&color=000000"
                alt="Google Logo"
                className="h-[14px] w-auto"
              />
              <div className="flex flex-col">
                <span className="text-[9px] text-warm-charcoal font-semibold leading-tight">Google Reviews</span>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-warm-charcoal font-bold">5.0</span>
                  <span className="text-[9px] text-gold">★★★★★</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[10px] font-semibold">
              <div className="gtranslate_wrapper" />
            </div>
          </div>
        </div>
      </div>

      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={`fixed top-8 left-0 right-0 z-50 transition-all duration-500 bg-white/10 backdrop-blur-xl border border-white/20`}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex items-center h-20">
          {/* Logo - Left */}
          <motion.div
            initial={{ opacity: 0, filter: "blur(12px)", scale: 0.98 }}
            animate={{ 
              opacity: 1,
              filter: "blur(0px)",
              scale: 1
            }}
            transition={{ 
              duration: 2, 
              ease: "easeOut",
              delay: 0.5
            }}
            className="flex-shrink-0"
          >
            <Link to="/" className="flex items-center">
              <img src="/Ronjoo-Safaris-Logo-new.png" alt="Ronjoo Safaris Logo" className="h-16 w-auto" />
            </Link>
          </motion.div>

          {/* Desktop Nav - Center */}
          <div className="hidden lg:flex items-center justify-center gap-7 flex-1">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (i + 1), duration: 0.3 }}
              >
                <Link
                  to={link.href}
                  className={`label-accent nav-link-hover transition-colors text-[12px] font-semibold ${scrolled ? 'text-[#B78E29] hover:text-[#B78E29]/80' : 'text-white/90 hover:text-white'}`}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* CTA - Right */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="hidden lg:block flex-shrink-0"
          >
            <Link
              to="/plan"
              className={`btn-safari-terracotta-outline text-[12px] px-6 h-[42px] inline-flex items-center justify-center transition-all border-warm-canvas/30 hover:bg-terracotta hover:text-warm-canvas hover:border-terracotta ${scrolled ? 'text-[#B78E29] border-[#B78E29]/30' : 'text-white border-white/30'}`}
            >
              Plan My Safari
            </Link>
          </motion.div>

          {/* Mobile menu button */}
          <button
            className={`lg:hidden ml-auto transition-colors ${scrolled ? 'text-[#B78E29]' : 'text-white'}`}
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={28} strokeWidth={1} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-deep-earth noise-overlay flex flex-col items-start justify-center px-10"
          >
            <button
              className="absolute top-6 right-6 text-[#B78E29]"
              onClick={() => setMobileOpen(false)}
            >
              <X size={32} strokeWidth={1} />
            </button>
            {navLinks.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.4 }}
              >
                <Link
                  to={link.href}
                  className="font-display italic text-[#B78E29] text-[48px] leading-[1.3] hover:text-[#B78E29]/80 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12"
            >
              <Link
                to="/plan"
                className="btn-safari-terracotta-outline inline-block"
                onClick={() => setMobileOpen(false)}
              >
                Plan My Safari
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
