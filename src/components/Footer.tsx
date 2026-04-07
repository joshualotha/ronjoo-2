import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Footer = () => {
  const { settings } = useSiteSettings();
  const businessName = settings.business_name || "Ronjoo Safaris";
  const whatsapp = settings.whatsapp_number || "+255 747 394 631";
  const email = settings.email_address || "info@ronjoosafaris.co.tz";
  const physical = settings.physical_address || "Arusha, Tanzania";
  const socials = [
    { Icon: Instagram, href: settings.instagram_url || "#" },
    { Icon: Facebook, href: settings.facebook_url || "#" },
    { Icon: Youtube, href: settings.youtube_url || "#" },
  ];

  return (
    <footer className="section-dark noise-overlay relative">
      {/* Quote */}
      <div className="text-center py-20 px-6 border-b border-gold/10">
        <p className="heading-display text-gold/80 text-2xl md:text-4xl max-w-3xl mx-auto leading-relaxed">
          "The wilderness is not a luxury but a necessity of the human spirit."
        </p>
        <p className="heading-sub text-warm-charcoal/40 text-[11px] mt-6">
         , Edward Abbey
        </p>
      </div>

        {/* Columns */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
        {/* Brand */}
        <div className="space-y-6">
          <Link to="/" className="inline-block">
            <span className="font-display italic text-[32px] text-warm-charcoal tracking-tighter">
              {businessName}
            </span>
          </Link>
          <p className="body-text text-warm-charcoal/60 text-[15px] leading-[1.8] max-w-[280px]">
            Private safaris and guided expeditions across Tanzania's most extraordinary wild places, crafted with 15 years of local mastery.
          </p>
          <div className="flex gap-5 pt-2">
            {socials.map(({ Icon, href }, i) => (
              <a
                key={i}
                href={href}
                className="w-10 h-10 rounded-full border border-warm-charcoal/10 flex items-center justify-center text-warm-charcoal/40 hover:text-terracotta hover:border-terracotta transition-all duration-500"
                target="_blank"
                rel="noreferrer"
              >
                <Icon size={18} strokeWidth={1} />
              </a>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div>
          <h4 className="heading-sub text-gold text-[10px] uppercase tracking-[0.3em] mb-10">The Experience</h4>
          <div className="flex flex-col gap-4">
            {[
              { label: "Our Safaris", to: "/safaris" },
              { label: "Destinations", to: "/destinations" },
              { label: "Join a Safari", to: "/departures" },
              { label: "Safari Gallery", to: "/gallery" },
              { label: "Add-Ons", to: "/add-ons" },
              { label: "Custom Planning", to: "/plan" },
            ].map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="body-text text-warm-charcoal/60 text-[14px] hover:text-terracotta transition-all duration-300 transform hover:translate-x-1"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Company & Media */}
        <div>
          <h4 className="heading-sub text-gold text-[10px] uppercase tracking-[0.3em] mb-10">Discovery</h4>
          <div className="flex flex-col gap-4">
            {[
              { label: "About Our Story", to: "/about" },
              { label: "The Wild Blog", to: "/blog" },
              { label: "Guest Reviews", to: "/reviews" },
              { label: "Travel FAQ", to: "/faq" },
              { label: "Contact Us", to: "/contact" },
            ].map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="body-text text-warm-charcoal/60 text-[14px] hover:text-terracotta transition-all duration-300 transform hover:translate-x-1"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="heading-sub text-gold text-[10px] uppercase tracking-[0.3em] mb-10">Get in Touch</h4>
          <div className="space-y-6">
            <div>
              <p className="label-accent text-warm-charcoal/40 text-[9px] mb-2 uppercase tracking-[0.1em]">DIRECT LINE</p>
              <a
                href={`https://wa.me/${String(whatsapp).replace(/[^\d]/g, "")}`}
                className="font-sub text-warm-charcoal text-[18px] hover:text-terracotta transition-colors block"
              >
                {whatsapp}
              </a>
            </div>
            <div>
              <p className="label-accent text-warm-charcoal/40 text-[9px] mb-2 uppercase tracking-[0.1em]">CORRESPONDENCE</p>
              <p className="body-text text-warm-charcoal/70 text-[14px]">
                {email}
              </p>
            </div>
            <div>
              <p className="label-accent text-warm-charcoal/40 text-[9px] mb-2 uppercase tracking-[0.1em]">HEADQUARTERS</p>
              <p className="body-text text-warm-charcoal/60 text-[13px] leading-relaxed">
                {physical}<br />
                Mon–Sat: 8:00 AM – 6:00 PM EAT
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gold/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="label-accent text-warm-charcoal/40 text-[11px]">
            © 2026 {businessName}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="label-accent text-warm-charcoal/30 hover:text-terracotta transition-colors text-[10px]">
              Privacy Policy
            </Link>
            <Link to="/cookie-policy" className="label-accent text-warm-charcoal/30 hover:text-terracotta transition-colors text-[10px]">
              Cookie Policy
            </Link>
          </div>
          <p className="label-accent text-warm-charcoal/30 text-[10px]">
            Certified Member: TATO · Tanzania Association of Tour Operators
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
