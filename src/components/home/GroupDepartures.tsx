import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getDepartures } from "@/services/publicApi";

const SeatDots = ({ taken, total }: { taken: number; total: number }) => (
  <div className="flex gap-1">
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        className={`w-2 h-2 rounded-full ${
          i < taken ? "bg-terracotta" : "bg-faded-sand/40"
        }`}
      />
    ))}
  </div>
);

const GroupDepartures = () => {
  const { data: departures = [] } = useQuery({
    queryKey: ['departures'],
    queryFn: getDepartures,
  });
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-light noise-overlay relative py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-6">
          <motion.h2
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="heading-display text-warm-charcoal text-[48px] md:text-[64px]"
          >
            Open Departures, Join a Group
          </motion.h2>
          <p className="font-sub font-light text-warm-charcoal/60 text-[16px] mt-4 max-w-lg mx-auto">
            Travel with like-minded adventurers. Private guide. Maximum 8 guests per vehicle.
          </p>
          <div className="gold-rule mt-8" />
        </div>

        <div ref={ref} className="mt-12 space-y-0">
          {departures.map((dep, i) => (
            <motion.div
              key={dep.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group grid grid-cols-1 md:grid-cols-[1fr_1.5fr_1fr_auto_auto_auto] gap-4 items-center py-6 border-b border-faded-sand/60 hover:bg-dust-ivory/50 transition-colors px-4 cursor-pointer"
            >
              <span className="font-sub font-light text-warm-charcoal/70 text-[14px]">
                {dep.dateRange}
              </span>
              <span className="heading-display text-warm-charcoal text-[22px]">
                {dep.safariName}
              </span>
              <div className="flex gap-2 flex-wrap">
                {(dep.destinations || []).map((d: string) => (
                  <span
                    key={d}
                    className="label-accent text-warm-charcoal/50 text-[10px] border border-faded-sand px-2 py-0.5"
                  >
                    {d}
                  </span>
                ))}
              </div>
              <SeatDots taken={dep.seatsTaken || dep.bookedSeats || 0} total={dep.totalSeats} />
              <span className="font-display text-warm-charcoal text-[20px]">
                ${(dep.pricePerPerson || 0).toLocaleString()}
                <span className="font-sub font-light text-[12px] text-warm-charcoal/50 ml-1">
                  /pp
                </span>
              </span>
              <span className="font-sub font-light text-terracotta text-[13px] tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all">
                Join Safari
                <ArrowRight size={14} strokeWidth={1.5} className="transition-transform group-hover:translate-x-1" />
              </span>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="/departures"
            className="font-sub font-light text-terracotta text-[14px] tracking-wider hover:underline inline-flex items-center gap-2"
          >
            View All Departures
            <ArrowRight size={14} strokeWidth={1.5} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default GroupDepartures;
