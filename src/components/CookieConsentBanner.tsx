import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { X, Cookie } from "lucide-react";

const CookieConsentBanner = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent-v1");
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent-v1", "true");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: -20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed bottom-6 left-6 z-[100] max-w-[420px] w-[calc(100vw-48px)] h-auto"
        >
          <div className="bg-white/80 backdrop-blur-xl border border-warm-charcoal/10 shadow-2xl p-6 md:p-8 rounded-2xl relative overflow-hidden group">
            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 noise-overlay opacity-[0.03] pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-10 h-10 rounded-full bg-terracotta/10 flex items-center justify-center text-terracotta flex-shrink-0">
                  <Cookie size={20} strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <h4 className="heading-display text-warm-charcoal text-[20px] leading-tight mb-2">
                    Our Digital Journal
                  </h4>
                  <p className="body-text text-warm-charcoal/60 text-[14px] leading-relaxed">
                    We use cookies to enhance your journey through our wild spaces, ensuring every interaction feels as seamless as a savanna breeze. By continuing, you agree to our digital etiquette.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={handleAccept}
                  className="w-full sm:w-auto btn-safari-terracotta px-8 py-3 text-[12px] h-auto"
                >
                  Acknowledge
                </button>
                <div className="flex gap-4 items-center">
                  <Link
                    to="/privacy-policy"
                    className="label-accent text-warm-charcoal/40 hover:text-terracotta transition-colors text-[10px]"
                  >
                    Privacy Policy
                  </Link>
                  <span className="w-1 h-1 bg-warm-charcoal/10 rounded-full" />
                  <Link
                    to="/cookie-policy"
                    className="label-accent text-warm-charcoal/40 hover:text-terracotta transition-colors text-[10px]"
                  >
                    Cookie Policy
                  </Link>
                </div>
              </div>
            </div>

            {/* Simple close button */}
            <button
              onClick={() => setShow(false)}
              className="absolute top-4 right-4 text-warm-charcoal/30 hover:text-warm-charcoal transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsentBanner;
