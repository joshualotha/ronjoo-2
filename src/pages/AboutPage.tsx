import { motion } from "framer-motion";
import { Heart, Shield, Eye, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getTeamMembers } from "@/services/publicApi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingElements from "@/components/FloatingElements";

const values = [
  { icon: Heart, title: "Passion for Africa", desc: "Every member of our team was born and raised in Tanzania. We don't just show you the bush, we share our home." },
  { icon: Shield, title: "Conservation First", desc: "We partner with local conservation programs and allocate 5% of every booking to anti-poaching and community projects." },
  { icon: Eye, title: "Authentic Experiences", desc: "No tourist traps. No rushed itineraries. We take you to the places only locals know, at the pace the bush demands." },
  { icon: Users, title: "Small Groups Only", desc: "Maximum 8 guests per vehicle. Your guide's full attention. Your own rhythm. Your own safari." },
];

interface TeamMember {
  id: string | number;
  name: string;
  role: string;
  bio: string;
  photo: string;
  experience?: number;
  specializations?: string[];
}

const AboutPage = () => {
  const { data: teamMembers = [], isLoading } = useQuery<TeamMember[]>({
    queryKey: ["team-members"],
    queryFn: getTeamMembers,
  });

  // Use API data if available, otherwise fall back to static data
  const team = teamMembers.length > 0 ? teamMembers.map(member => ({
    name: member.name,
    role: member.role,
    years: member.experience || 5,
    desc: member.bio,
    photo: member.photo
  })) : [
    { name: "Emmanuel Laizer", role: "Founder & Lead Guide", years: 18, desc: "Born in Arusha to a Maasai family, Emmanuel has been guiding safaris since 2008. He holds a degree in wildlife management and speaks five languages." },
    { name: "David Mollel", role: "Senior Safari Guide", years: 14, desc: "David's knowledge of big cat behavior is unmatched in the northern circuit. Guests consistently call him the best guide they've ever had." },
    { name: "Joseph Maasai", role: "Safari Guide & Cultural Expert", years: 10, desc: "Joseph bridges the gap between safari and culture, offering guests deep insights into Maasai traditions and local ecology." },
    { name: "Amina Mshanga", role: "Operations Director", years: 12, desc: "Amina ensures every safari runs flawlessly, from airport transfers to lodge bookings to emergency contingencies." },
  ];

  return (
    <div className="min-h-screen bg-warm-canvas">
      <Navbar />

      {/* Cinematic Hero */}
      <section className="relative h-[80vh] overflow-hidden group">
        <motion.div
           initial={{ scale: 1.15 }}
           animate={{ scale: 1.05 }}
           transition={{ duration: 15, ease: "linear", repeat: Infinity, repeatType: "mirror" }}
           className="absolute inset-0 bg-cover bg-center bg-no-repeat"
           style={{ backgroundImage: `url(/assets/hero-gallery.jpg)` }}
        />
        
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
          >
            <span className="label-accent text-warm-canvas/80 text-[11px] tracking-[0.4em] mb-6 block uppercase">
              Since 2010
            </span>
            <h1 className="heading-display text-warm-canvas text-[56px] md:text-[84px] leading-[1.1] mb-8">
              Our <br />
              <span className="italic font-light">Story</span>
            </h1>
            <div className="w-16 h-[1px] bg-warm-canvas/30 mx-auto mb-8" />
            <p className="font-sub text-warm-canvas/60 text-sm tracking-[0.1em] max-w-lg mx-auto uppercase">
               Maasai roots, global horizons, and 15 years of silent wilderness mastery.
            </p>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 cursor-pointer group/scroll"
          >
            <span className="label-accent text-warm-canvas/40 text-[9px] tracking-[0.2em] group-hover/scroll:text-warm-canvas/80 transition-colors">DISCOVER MORE</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-warm-canvas/60 to-transparent" />
          </motion.div>
      </section>

      {/* Origin: Born in the Bush */}
      <section className="bg-warm-canvas noise-overlay relative py-24 md:py-32 overflow-hidden border-b border-[#E8E0D5]/50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            
            {/* Visual Column */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
              className="lg:col-span-5 relative"
            >
              <div className="aspect-[4/5] relative overflow-hidden rounded-t-full rounded-b-[32px]">
                <img 
                  src="/assets/hero-destinationspage.jpg" 
                  alt="Maasai heritage" 
                  className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-[2s]" 
                />
              </div>
              {/* Decorative texture or badge */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-terracotta/90 rounded-full flex flex-col items-center justify-center text-warm-canvas p-4 text-center shadow-2xl">
                <span className="font-display italic text-[24px] leading-none mb-1">100%</span>
                <span className="font-sub uppercase tracking-[0.1em] text-[9px] leading-tight">Maasai Founded</span>
              </div>
            </motion.div>

            {/* Narrative Column */}
            <div className="lg:col-span-7 space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <p className="heading-sub text-terracotta mb-4 uppercase tracking-[0.2em] text-[11px]">The Origin Story</p>
                <h2 className="heading-display text-warm-charcoal text-[48px] md:text-[64px] leading-[1.1] mb-8">
                  Born in <br /><span className="italic font-light">the Bush</span>
                </h2>
                <div className="space-y-6 font-body font-normal text-[17px] leading-[1.8] text-warm-charcoal/70">
                  <p>
                    Ronjoo Safaris was founded in 2010 by Emmanuel Laizer, a Maasai guide who grew up on the edge of the Serengeti. After a decade of guiding for international operators, he saw a gap: travelers wanted authenticity, intimacy, and local expertise, not factory-line tourism.
                  </p>
                  <blockquote className="border-l-2 border-gold/40 pl-8 my-10 relative">
                    <div className="absolute -left-[5px] top-0 bottom-0 w-[10px] bg-gold/10" />
                    <p className="font-display italic text-[26px] md:text-[32px] text-warm-charcoal leading-relaxed mb-4">
                      "Ronjoo means 'journey' in Maa. We started with a single Land Cruiser and a promise: every safari would feel like family."
                    </p>
                  </blockquote>
                  <p>
                    Eighteen years later, that promise remains our anchor. We've hosted over 4,200 travelers from 50+ countries, but we've remained fiercely independent. Every guide on our team is handpicked by Emmanuel to ensure that same Maasai spirit of hospitality.
                  </p>
                </div>
              </motion.div>

              {/* Trust Bar / Stats Badges */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="grid grid-cols-3 gap-8 pt-10 border-t border-[#E8E0D5]"
              >
                <div>
                  <p className="font-display italic text-[32px] text-terracotta leading-none mb-2">18</p>
                  <p className="font-sub uppercase tracking-[0.15em] text-[9px] text-warm-charcoal/50">Years Guiding</p>
                </div>
                <div>
                  <p className="font-display italic text-[32px] text-terracotta leading-none mb-2">4,200</p>
                  <p className="font-sub uppercase tracking-[0.15em] text-[9px] text-warm-charcoal/50">Guests Hosted</p>
                </div>
                <div>
                  <p className="font-display italic text-[32px] text-terracotta leading-none mb-2 text-nowrap">4.9/5 ★</p>
                  <p className="font-sub uppercase tracking-[0.15em] text-[10px] text-warm-charcoal/50">TripAdvisor</p>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-dark noise-overlay relative py-20">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="heading-display text-warm-charcoal text-[48px] md:text-[64px]"
            >
              What We Believe
            </motion.h2>
            <div className="gold-rule mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {values.map((val, i) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="flex gap-6"
              >
                <div className="w-12 h-12 border border-gold/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <val.icon size={20} strokeWidth={1} className="text-gold" />
                </div>
                <div>
                  <h3 className="heading-sub text-warm-charcoal text-[12px] mb-3">{val.title}</h3>
                  <p className="font-body font-light text-warm-charcoal/60 text-[15px] leading-relaxed">{val.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-light noise-overlay relative py-20">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="heading-display text-warm-charcoal text-[48px] md:text-[64px]"
            >
              Meet the Team
            </motion.h2>
            <div className="gold-rule mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="p-8 bg-dust-ivory/40 border border-faded-sand/40"
              >
                <div className="flex items-start gap-5">
                  {member.photo ? (
                    <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-full">
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-deep-earth/10 flex items-center justify-center flex-shrink-0 rounded-full">
                      <span className="font-display italic text-warm-charcoal/30 text-[28px]">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-display italic text-warm-charcoal text-[22px]">{member.name}</h3>
                    <p className="label-accent text-terracotta text-[10px] mt-1">{member.role}</p>
                    <p className="label-accent text-gold/60 text-[10px] mt-1">{member.years} Years Experience</p>
                    <p className="font-body font-light text-warm-charcoal/60 text-[14px] mt-4 leading-relaxed">{member.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Image strip */}
      <section className="h-[40vh] relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(/assets/hero-gallery.jpg)` }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.3))" }} />
        <div className="relative z-10 h-full flex items-center justify-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="heading-display text-warm-canvas/80 text-[28px] md:text-[42px] text-center px-6 max-w-3xl italic"
          >
            "We don't sell tours. We share our home."
          </motion.p>
        </div>
      </section>

      <Footer />
      <FloatingElements />
    </div>
  );
};

export default AboutPage;
