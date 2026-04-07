import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const sections = [
  {
    id: "definitions",
    title: "1.0 Definitions & Interpretation",
    content: [
      {
        subtitle: "1.1 Definitions",
        text: "In this Privacy Policy, the following terms shall have the following meanings:",
        list: [
          "<b>'User'</b> refers to any individual accessing the Ronjoo Safaris website or utilizing its services.",
          "<b>'Service'</b> refers to the safari planning, booking, and logistical support provided by Ronjoo Safaris.",
          "<b>'Personal Data'</b> refers to any information that identifies or can be used to identify a specific individual.",
          "<b>'Processing'</b> refers to any operation performed on Personal Data, such as collection, storage, or disclosure."
        ]
      }
    ]
  },
  {
    id: "collection",
    title: "2.0 Types of Information We Collect",
    content: [
      {
        subtitle: "2.1 Personal Identification Information",
        text: "We collect information required to facilitate international travel and park permits, including but not limited to:",
        list: [
          "Full legal names as appearing on government-issued travel documents.",
          "Contact details including email addresses, phone numbers, and physical residency.",
          "Passport copies and visa details for official park and immigration processing."
        ]
      },
      {
        subtitle: "2.2 Sensitive Personal Data",
        text: "Due to the nature of remote wilderness expeditions, we may collect information regarding dietary requirements, medical conditions, and physical fitness levels to ensure your safety and wellbeing."
      },
      {
        subtitle: "2.3 Automated Technical Data",
        text: "Upon accessing our digital platform, we automatically collect data such as IP addresses, browser types, and interaction logs through cookies and similar tracking technologies."
      }
    ]
  },
  {
    id: "lawful-basis",
    title: "3.0 Lawful Basis for Processing",
    content: [
      {
        subtitle: "3.1 Contractual Necessity",
        text: "We process your data primarily to fulfill our contractual obligations to you, such as securing lodge reservations and park entrance permits."
      },
      {
        subtitle: "3.2 Legal Compliance",
        text: "We may process data as required by Tanzanian law, including tax reporting and compliance with the Tanzania National Parks (TANAPA) regulations."
      },
      {
        subtitle: "3.3 Legitimate Interest",
        text: "We process data for our legitimate business interests, such as improving our safari offerings and ensuring the security of our website."
      }
    ]
  },
  {
    id: "usage",
    title: "4.0 How We Utilize Your Information",
    content: [
      {
        subtitle: "4.1 Operational Use",
        text: "Your data is used to secure your itinerary, providing necessary details to bush pilots, lodge managers, and specialized field guides."
      },
      {
        subtitle: "4.2 Communication",
        text: "We utilize contact information to provide vital trip updates, safety briefings, and post-safari follow-ups."
      },
      {
        subtitle: "4.3 Marketing",
        text: "With your explicit consent, we may send you occasional newsletters regarding conservation efforts and new expedition routes. You may opt-out at any time."
      }
    ]
  },
  {
    id: "sharing",
    title: "5.0 Disclosure and Sharing of Data",
    content: [
      {
        subtitle: "5.1 Third-Party Service Providers",
        text: "We share essential data with vetted partners including luxury lodges, local aviation companies, and ground handling teams strictly for the execution of your safari."
      },
      {
        subtitle: "5.2 Statutory Disclosures",
        text: "We may disclose Personal Data to government authorities or law enforcement agencies when required by law or in response to a valid legal request."
      },
      {
        subtitle: "5.3 Non-Disclosure",
        text: "Ronjoo Safaris does not sell, trade, or rent your Personal Data to third-party marketing firms."
      }
    ]
  },
  {
    id: "security",
    title: "6.0 Data Security and Retention",
    content: [
      {
        subtitle: "6.1 Security Measures",
        text: "We utilize SSL encryption and secure server environments to safeguard your data against unauthorized access or loss."
      },
      {
        subtitle: "6.2 Data Retention",
        text: "We retain Personal Data only for as long as necessary to fulfill the purposes for which it was collected, including for the purposes of satisfying any legal, accounting, or reporting requirements."
      }
    ]
  },
  {
    id: "rights",
    title: "7.0 Your Privacy Rights",
    content: [
      {
        subtitle: "7.1 Access and Rectification",
        text: "You have the right to request a copy of the Personal Data we hold about you and to request the correction of any inaccuracies."
      },
      {
        subtitle: "7.2 Right to Erasure",
        text: "Under certain conditions, you may request the deletion of your Personal Data from our systems, subject to our legal retention obligations."
      },
      {
        subtitle: "7.3 Data Portability",
        text: "You may request that we transfer your Personal Data to another service provider in a structured, commonly used, and machine-readable format."
      }
    ]
  },
  {
    id: "transfers",
    title: "8.0 International Data Transfers",
    content: [
      {
        subtitle: "8.1 Global Operations",
        text: "As our services involve international travel, your data may be transferred to and processed in countries outside of your residency, specifically within the United Republic of Tanzania."
      }
    ]
  },
  {
    id: "contact",
    title: "9.0 Contact and Redress",
    content: [
      {
        subtitle: "9.1 Inquiries",
        text: "Direct all inquiries regarding this Privacy Policy or your Personal Data to our Data Protection Team at info@ronjoosafaris.co.tz."
      }
    ]
  }
];

const PrivacyPolicyPage = () => {
  const [activeSection, setActiveSection] = useState(sections[0].id);
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
      <section className="relative h-[65vh] overflow-hidden flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url(/assets/hero-privacypolicypage.jpg)` }} 
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10 w-full">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="label-accent text-gold text-[12px] mb-6 block tracking-[0.3em]"
          >
            OFFICIAL DOCUMENTATION
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="heading-display text-warm-canvas text-[48px] md:text-[72px] leading-tight"
          >
            Privacy <br className="hidden md:block" />
            <span className="italic">Framework</span>
          </motion.h1>
          <div className="flex flex-col md:flex-row md:items-center gap-8 mt-12">
            <div className="border-l border-gold/30 pl-4">
              <p className="font-sub text-[10px] text-warm-canvas/30 uppercase tracking-widest mb-1">Version</p>
              <p className="font-sub text-[14px] text-warm-canvas/70">2026.4.02-v1</p>
            </div>
            <div className="border-l border-gold/30 pl-4">
              <p className="font-sub text-[10px] text-warm-canvas/30 uppercase tracking-widest mb-1">Effective Date</p>
              <p className="font-sub text-[14px] text-warm-canvas/70">April 02, 2026</p>
            </div>
            <div className="border-l border-gold/30 pl-4">
              <p className="font-sub text-[10px] text-warm-canvas/30 uppercase tracking-widest mb-1">Jurisdiction</p>
              <p className="font-sub text-[14px] text-warm-canvas/70">United Republic of Tanzania</p>
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
                Document Structure
              </span>
              <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide">
                {sections.map((section) => (
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
                This document constitutes a binding agreement regarding the management of your Personal Data. We urge you to read these provisions in their entirety as they outline your legal rights and our statutory obligations.
              </p>

              {sections.map((section) => (
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

              {/* Legal Disclaimer Box */}
              <div className="bg-deep-earth p-8 rounded-lg mt-24 border border-gold/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
                    <path d="M12 16V12" />
                    <path d="M12 8H12.01" />
                  </svg>
                </div>
                <p className="label-accent text-gold text-[10px] mb-4">LEGAL ACKNOWLEDGEMENT</p>
                <p className="font-sub text-warm-canvas/60 text-[13px] leading-relaxed">
                  Ronjoo Safaris reserves the right to modify this Privacy Framework at any time. Significant changes will be communicated via the email address provided in your latest expedition enquiry or through a prominent notice on our primary digital portal.
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

export default PrivacyPolicyPage;
