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
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div>
          <span className="font-display italic text-[28px] text-warm-charcoal block">
            {businessName}
          </span>
          <p className="body-text text-warm-charcoal/60 text-[15px] mt-4 leading-relaxed">
            Private safaris and guided expeditions across Tanzania's most extraordinary wild places.
          </p>
            <div className="flex gap-4 mt-6">
            {socials.map(({ Icon, href }, i) => (
              <a
                key={i}
                href={href}
                className="text-warm-charcoal/50 hover:text-terracotta transition-colors"
                target="_blank"
                rel="noreferrer"
              >
                <Icon size={20} strokeWidth={1.2} />
              </a>
            ))}
          </div>
        </div>

        {/* Explore */}
        <div>
          <h4 className="heading-sub text-gold text-[11px] mb-6">Explore</h4>
          <div className="flex flex-col gap-3">
            {[
              { label: "Safaris", to: "/safaris" },
              { label: "Destinations", to: "/destinations" },
              { label: "Join a Safari", to: "/departures" },
              { label: "Safari Add-Ons", to: "/add-ons" },
              { label: "Custom Safari", to: "/plan" },
              { label: "Travel Resources", to: "/travel-resources" },
              { label: "FAQ", to: "/faq" },
              { label: "About Us", to: "/about" },
              { label: "Contact", to: "/contact" },
            ].map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="body-text text-warm-charcoal/60 text-[15px] hover:text-warm-charcoal transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Safaris */}
        <div>
          <h4 className="heading-sub text-gold text-[11px] mb-6">Safaris</h4>
          <div className="flex flex-col gap-3">
            {[
              { label: "The Great Migration", to: "/safaris/great-migration" },
              { label: "Northern Circuit Classic", to: "/safaris/northern-circuit-classic" },
              { label: "Kilimanjaro Lemosho", to: "/safaris/kilimanjaro-lemosho" },
              { label: "Safari & Zanzibar", to: "/safaris/safari-and-zanzibar" },
              { label: "Family Safari", to: "/safaris/family-safari-tanzania" },
            ].map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="body-text text-warm-charcoal/60 text-[15px] hover:text-warm-charcoal transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="heading-sub text-gold text-[11px] mb-6">Contact</h4>
          <a
            href={`https://wa.me/${String(whatsapp).replace(/[^\d]/g, "")}`}
            className="font-display text-warm-charcoal text-2xl hover:text-terracotta transition-colors block"
          >
            {whatsapp}
          </a>
          <p className="body-text text-warm-charcoal/60 text-[15px] mt-3">
            {email}
          </p>
          <p className="body-text text-warm-charcoal/40 text-[14px] mt-3 leading-relaxed">
            {physical}<br />
            Mon–Sat: 8:00 AM – 6:00 PM EAT
          </p>
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
