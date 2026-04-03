import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const cookieSections = [
  {
    id: "overview",
    title: "1.0 Overview & Scope",
    content: [
      {
        subtitle: "1.1 Policy Intent",
        text: "This Tracking Technology Framework ('Cookie Policy') explains how Ronjoo Safaris utilizes cookies and similar local storage technologies to enhance your digital expedition planning. We believe in absolute transparency regarding how your interactions are monitored."
      },
      {
        subtitle: "1.2 Scope of Application",
        text: "This framework applies to all electronic interfaces, mobile applications, and web services owned and operated by Ronjoo Safaris. It operates in conjunction with our primary Privacy Framework."
      }
    ]
  },
  {
    id: "definitions",
    title: "2.0 Technical Definitions",
    content: [
      {
        subtitle: "2.1 Essential Terminology",
        text: "To help you understand this framework, we define the following technical mechanisms:",
        list: [
          "<b>'Browser Cookies'</b>: Small data files placed on your hard drive to track movement and session persistence.",
          "<b>'Web Beacons'</b>: Transparent graphic images used to monitor behavior such as email opens or page interactions.",
          "<b>'Local Storage'</b>: A method for storing persistent data within your browser, similar to cookies but with larger capacity."
        ]
      }
    ]
  },
  {
    id: "strictly-necessary",
    title: "3.0 Strictly Necessary Cookies",
    content: [
      {
        subtitle: "3.1 Fundamental Operations",
        text: "These cookies are indispensable for the operation of our platform. They ensure baseline functions including secure login, session continuity, and the integrity of your safari enquiry form.",
        list: [
          "<b>'XSRF-TOKEN'</b>: A essential security cookie used to prevent Cross-Site Request Forgery attacks.",
          "<b>'ronjoo_safaris_session'</b>: Maintains your unique session identifier to ensure your progress is saved while navigating between destination pages."
        ]
      }
    ]
  },
  {
    id: "performance",
    title: "4.0 Performance & Analytics",
    content: [
      {
        subtitle: "4.1 Analytical Insights",
        text: "We utilize anonymized tracking to understand which Tanzanian parks and routes are most engaging for our global audience. This data allows us to optimize site speed and content relevance.",
        list: [
          "<b>'Google Analytics'</b>: We use GA4 to track visitor flows, bounce rates, and conversion paths on a strictly anonymized basis.",
          "<b>'Heatmaps'</b>: Occasionally, we measure where users click most to improve the user interface of our maps and itinerary displays."
        ]
      }
    ]
  },
  {
    id: "functional",
    title: "5.0 Functional Customization",
    content: [
      {
        subtitle: "5.1 User Preferences",
        text: "These cookies remember your personalized settings to provide a more tailored browsing experience.",
        list: [
          "<b>'Currency Preference'</b>: Remembers whether you prefer to see safari pricing in USD, EUR, or GBP.",
          "<b>'Language Setting'</b>: Stores your preferred Swahili or English interface setting.",
          "<b>'Cookie Consent Status'</b>: Stores your choice regarding this very policy to avoid repetitive prompts."
        ]
      }
    ]
  },
  {
    id: "third-party",
    title: "6.0 Third-Party Tracking",
    content: [
      {
        subtitle: "6.1 Collaborative Plugins",
        text: "Our website features integrations from trusted partners that may place their own cookies upon interaction.",
        list: [
          "<b>'WhatsApp Chat Plugin'</b>: Utilized for instant communication with our specialists.",
          "<b>'MapBox / Google Maps'</b>: Powering our interactive territory maps.",
          "<b>'Social Connect'</b>: Pixels from Instagram or Facebook may track interactions if you are currently logged into those platforms."
        ]
      }
    ]
  },
  {
    id: "management",
    title: "7.0 Managing Your Tracking Preferences",
    content: [
      {
        subtitle: "7.1 Browser Constraints",
        text: "You may choose to restrict or block all cookies through your browser's security settings. Please note that disabling 'Strictly Necessary' cookies will render certain booking features inoperative."
      },
      {
        subtitle: "7.2 Global Opt-Out",
        text: "For more information on opting out of specialized analytics, you may visit the Network Advertising Initiative (NAI) or the Digital Advertising Alliance (DAA) portals."
      }
    ]
  },
  {
    id: "updates",
    title: "8.0 Policy Revisions",
    content: [
      {
        subtitle: "8.1 Review Schedule",
        text: "This framework is reviewed annually or upon the integration of new digital technologies. We encourage regular review of this page."
      }
    ]
  }
];

const CookiePolicyPage = () => {
  const [activeSection, setActiveSection] = useState(cookieSections[0].id);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );

    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-warm-canvas">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 lg:px-12 bg-deep-earth overflow-hidden">
        <div className="absolute inset-0 noise-overlay opacity-[0.03]" />
        <div className="max-w-[1400px] mx-auto relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="label-accent text-gold text-[12px] mb-6 block tracking-[0.3em]"
          >
            TECHNICAL ETIQUETTE
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="heading-display text-warm-canvas text-[48px] md:text-[72px] leading-tight"
          >
            Cookie <br className="hidden md:block" />
            <span className="italic">Etiquette</span>
          </motion.h1>
          <div className="flex flex-col md:flex-row md:items-center gap-8 mt-12">
            <div className="border-l border-gold/30 pl-4">
              <p className="font-sub text-[10px] text-warm-canvas/30 uppercase tracking-widest mb-1">Version</p>
              <p className="font-sub text-[14px] text-warm-canvas/70">2026.4.02-v1</p>
            </div>
            <div className="border-l border-gold/30 pl-4">
              <p className="font-sub text-[10px] text-warm-canvas/30 uppercase tracking-widest mb-1">Policy Category</p>
              <p className="font-sub text-[14px] text-warm-canvas/70">Tracking & Metadata</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <section className="bg-warm-canvas border-t border-warm-charcoal/5">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row relative">
          
          {/* TOC Sidebar */}
          <aside className="lg:w-[320px] shrink-0 lg:border-r border-warm-charcoal/5">
            <div className="lg:sticky lg:top-24 py-12 px-6 lg:px-12">
              <span className="font-sub font-light text-[10px] text-gold tracking-[0.3em] uppercase block mb-8">
                In This Framework
              </span>
              <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide">
                {cookieSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`text-left font-sub font-normal text-[13px] whitespace-nowrap lg:whitespace-normal py-2 px-4 lg:px-0 transition-all duration-300 border-l-2 ${
                      activeSection === section.id
                        ? "text-terracotta border-terracotta translate-x-2"
                        : "text-warm-charcoal/40 border-transparent hover:text-warm-charcoal group"
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Detailed Content */}
          <main className="flex-1 max-w-[800px] py-20 px-6 lg:px-20 mx-auto">
            <div className="prose prose-lg max-w-none">
              <p className="body-text text-warm-charcoal/60 leading-[1.8] italic mb-16 border-b border-warm-charcoal/5 pb-12">
                This policy outlines our approach to digital tracking. By utilizing our platform, you acknowledge the placement of trackers for the purposes of security, site optimization, and performance analysis.
              </p>

              {cookieSections.map((section) => (
                <div
                  key={section.id}
                  id={section.id}
                  ref={(el) => (sectionRefs.current[section.id] = el)}
                  className="mb-24 scroll-mt-32"
                >
                  <h2 className="heading-display text-warm-charcoal text-[32px] md:text-[44px] mb-8 border-b border-terracotta/20 pb-4">
                    {section.title}
                  </h2>
                  
                  {section.content.map((block, idx) => (
                    <div key={idx} className="mb-12 last:mb-0">
                      <h3 className="font-sub font-semibold text-[18px] text-deep-earth mb-4 tracking-tight">
                        {block.subtitle}
                      </h3>
                      <p className="body-text text-warm-charcoal/80 leading-[1.9] mb-5">
                        {block.text}
                      </p>
                      {block.list && (
                        <ul className="space-y-4 my-6">
                          {block.list.map((item, i) => (
                            <li key={i} className="flex gap-4 items-start py-3 border-b border-warm-charcoal/5 last:border-0 text-warm-charcoal/70 body-text text-[15px]">
                              <span className="text-terracotta/40 mt-1.5 shrink-0">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                  <circle cx="6" cy="6" r="3" fill="currentColor" />
                                </svg>
                              </span>
                              <span dangerouslySetInnerHTML={{ __html: item }} />
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              ))}

              {/* Interaction Warning */}
              <div className="bg-dust-ivory p-8 rounded-lg mt-24 border-l-4 border-terracotta relative overflow-hidden">
                <p className="label-accent text-terracotta text-[10px] mb-4 uppercase">User Note</p>
                <p className="body-text text-warm-charcoal/60 text-[14px] leading-relaxed">
                  Blocking certain cookies through your browser settings may cause specific interactive elements, such as our "Safari Add-On" selectors or live WhatsApp integration, to behave unexpectedly or fail to load.
                </p>
              </div>
            </div>
          </main>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CookiePolicyPage;
