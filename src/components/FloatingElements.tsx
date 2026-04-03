import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, X } from "lucide-react";

const WhatsAppIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const FloatingElements = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Show the greeting bubble after 4 seconds, then hide after 8 more
  useEffect(() => {
    const showTimer = setTimeout(() => setShowBubble(true), 4000);
    const hideTimer = setTimeout(() => setShowBubble(false), 12000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const waLink = "https://wa.me/255747394631?text=Hello%20Ronjoo%20Safaris%2C%20I%27d%20like%20to%20enquire%20about%20a%20safari.";

  return (
    <>
      {/* Back to top */}
      <div className="fixed bottom-6 left-6 z-50">
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="w-11 h-11 rounded-full border border-warm-charcoal/20 bg-warm-canvas/80 backdrop-blur-md text-warm-charcoal/60 flex items-center justify-center hover:bg-warm-canvas hover:text-terracotta hover:border-terracotta/40 transition-all shadow-sm"
            >
              <ArrowUp size={18} strokeWidth={1.5} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* WhatsApp Widget - Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Greeting Bubble (auto-shows once) */}
        <AnimatePresence>
          {showBubble && !chatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative bg-white rounded-2xl shadow-xl px-5 py-4 max-w-[260px] border border-warm-charcoal/5"
            >
              {/* Close bubble */}
              <button
                onClick={() => setShowBubble(false)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-warm-charcoal/10 rounded-full flex items-center justify-center text-warm-charcoal/50 hover:bg-warm-charcoal/20 transition-colors"
              >
                <X size={12} />
              </button>
              <p className="text-[13px] text-warm-charcoal/80 leading-relaxed" style={{ fontFamily: "Jost, sans-serif" }}>
                <span className="text-[15px]">👋</span> <strong className="text-warm-charcoal">Jambo!</strong> Planning a Tanzania safari? We usually reply within minutes.
              </p>
              {/* Tail */}
              <div className="absolute -bottom-[6px] right-8 w-3 h-3 bg-white rotate-45 border-r border-b border-warm-charcoal/5" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Panel */}
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.92 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="w-[340px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-warm-charcoal/5"
            >
              {/* Header */}
              <div className="bg-[#075E54] px-5 py-4 flex items-center gap-3">
                <div className="relative">
                  <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center overflow-hidden">
                    <img
                      src="/Ronjoo-Safaris-Logo-new.png"
                      alt="Ronjoo"
                      className="w-9 h-9 object-contain"
                    />
                  </div>
                  {/* Online indicator */}
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#25D366] rounded-full border-2 border-[#075E54]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-[14px] font-semibold leading-tight" style={{ fontFamily: "Jost, sans-serif" }}>
                    Ronjoo Safaris
                  </p>
                  <p className="text-[#25D366] text-[11px] flex items-center gap-1" style={{ fontFamily: "Jost, sans-serif" }}>
                    <span className="inline-block w-1.5 h-1.5 bg-[#25D366] rounded-full animate-pulse" />
                    Online now
                  </p>
                </div>
                <button
                  onClick={() => setChatOpen(false)}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Chat Body */}
              <div
                className="px-4 py-5 min-h-[160px] flex flex-col gap-3"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundColor: "#ECE5DD",
                }}
              >
                {/* Agent message */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-xl rounded-tl-sm px-4 py-3 shadow-sm max-w-[85%] self-start"
                >
                  <p className="text-[13px] text-warm-charcoal leading-relaxed" style={{ fontFamily: "Jost, sans-serif" }}>
                    Jambo! 🌍 Welcome to Ronjoo Safaris. How can we help you plan your dream Tanzania adventure?
                  </p>
                  <p className="text-[10px] text-warm-charcoal/40 mt-1 text-right" style={{ fontFamily: "Jost, sans-serif" }}>
                    just now
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white rounded-xl rounded-tl-sm px-4 py-3 shadow-sm max-w-[85%] self-start"
                >
                  <p className="text-[13px] text-warm-charcoal leading-relaxed" style={{ fontFamily: "Jost, sans-serif" }}>
                    Tap below to start chatting on WhatsApp 👇
                  </p>
                </motion.div>
              </div>

              {/* Footer CTA */}
              <div className="px-4 py-4 bg-white border-t border-warm-charcoal/5">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20BD5A] text-white py-3 rounded-xl transition-colors shadow-sm"
                  style={{ fontFamily: "Jost, sans-serif" }}
                >
                  <WhatsAppIcon size={18} />
                  <span className="text-[14px] font-semibold">Start Conversation</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating WhatsApp Button */}
        <motion.button
          onClick={() => {
            setChatOpen(!chatOpen);
            setShowBubble(false);
          }}
          className="relative group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Pulse rings */}
          <span className="absolute inset-0 rounded-full bg-[#25D366]/30 animate-ping" style={{ animationDuration: "2.5s" }} />
          <span className="absolute -inset-1 rounded-full bg-[#25D366]/15 animate-pulse" style={{ animationDuration: "3s" }} />

          {/* Main button */}
          <motion.div
            className="relative w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-[#25D366]/30"
            animate={chatOpen ? { rotate: 0 } : {}}
          >
            <AnimatePresence mode="wait">
              {chatOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="wa"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <WhatsAppIcon size={26} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Notification badge */}
          {!chatOpen && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-sm"
            >
              1
            </motion.span>
          )}
        </motion.button>
      </div>
    </>
  );
};

export default FloatingElements;
