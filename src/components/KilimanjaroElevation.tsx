import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface Waypoint {
  day: number;
  name: string;
  altitude: number;
  x: number;
  y: number;
  description: string;
  isAcclimatization?: boolean;
  isSummit?: boolean;
}

const waypoints: Waypoint[] = [
  { day: 1, name: "Lemosho Gate", altitude: 2100, x: 0, y: 2100, description: "Trailhead, montane rainforest begins" },
  { day: 1, name: "Big Tree Camp", altitude: 2780, x: 1, y: 2780, description: "First camp in dense rainforest" },
  { day: 2, name: "Shira 1 Camp", altitude: 3500, x: 2, y: 3500, description: "Above the cloud line, heath zone" },
  { day: 3, name: "Shira 2 Camp", altitude: 3840, x: 3, y: 3840, description: "Shira Plateau, views to Mt Meru" },
  { day: 4, name: "Lava Tower", altitude: 4630, x: 3.7, y: 4630, description: "Climb high, sleep low, acclimatization", isAcclimatization: true },
  { day: 4, name: "Barranco Camp", altitude: 3960, x: 4, y: 3960, description: "Below the Great Barranco Wall" },
  { day: 5, name: "Karanga Camp", altitude: 4035, x: 5, y: 4035, description: "Final water point on the route" },
  { day: 6, name: "Barafu Camp", altitude: 4680, x: 6, y: 4680, description: "Summit base camp, midnight departure" },
  { day: 7, name: "Uhuru Peak", altitude: 5895, x: 6.8, y: 5895, description: "Roof of Africa, 5,895m", isSummit: true },
  { day: 8, name: "Millennium Camp", altitude: 3820, x: 7.5, y: 3820, description: "Descent camp after summit" },
  { day: 8, name: "Mweka Gate", altitude: 1630, x: 8, y: 1630, description: "Trek complete, certificate time" },
];

const KilimanjaroElevation = () => {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [pathLength, setPathLength] = useState(0);
  const pathRef = useRef<SVGPathElement>(null);

  const svgW = 900;
  const svgH = 400;
  const padL = 70;
  const padR = 30;
  const padT = 40;
  const padB = 60;
  const chartW = svgW - padL - padR;
  const chartH = svgH - padT - padB;

  const minAlt = 1000;
  const maxAlt = 6200;

  const toX = (dayIdx: number) => padL + (dayIdx / 8) * chartW;
  const toY = (alt: number) => padT + chartH - ((alt - minAlt) / (maxAlt - minAlt)) * chartH;

  // Build path
  const points = waypoints.map((wp) => ({ x: toX(wp.x), y: toY(wp.altitude) }));
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx1 = prev.x + (curr.x - prev.x) * 0.4;
    const cpx2 = prev.x + (curr.x - prev.x) * 0.6;
    pathD += ` C ${cpx1} ${prev.y}, ${cpx2} ${curr.y}, ${curr.x} ${curr.y}`;
  }

  // Acclimatization segment (Shira 2 → Lava Tower → Barranco)
  const accStart = 3; // Shira 2
  const accPeak = 4; // Lava Tower
  const accEnd = 5; // Barranco
  let accPathD = `M ${points[accStart].x} ${points[accStart].y}`;
  for (let i = accStart + 1; i <= accEnd; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx1 = prev.x + (curr.x - prev.x) * 0.4;
    const cpx2 = prev.x + (curr.x - prev.x) * 0.6;
    accPathD += ` C ${cpx1} ${prev.y}, ${cpx2} ${curr.y}, ${curr.x} ${curr.y}`;
  }

  // Summit segment (Barafu → Uhuru)
  const sumStart = 7; // Barafu
  const sumEnd = 8; // Uhuru
  let sumPathD = `M ${points[sumStart].x} ${points[sumStart].y}`;
  const sPrev = points[sumStart];
  const sCurr = points[sumEnd];
  const scpx1 = sPrev.x + (sCurr.x - sPrev.x) * 0.4;
  const scpx2 = sPrev.x + (sCurr.x - sPrev.x) * 0.6;
  sumPathD += ` C ${scpx1} ${sPrev.y}, ${scpx2} ${sCurr.y}, ${sCurr.x} ${sCurr.y}`;

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);

  const altMarks = [1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 5895];

  return (
    <section className="bg-warm-canvas noise-overlay relative py-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <span className="label-accent text-gold/80 text-[11px]">ELEVATION PROFILE</span>
        <h2 className="heading-display text-deep-earth text-[46px] md:text-[56px] mt-2">The Ascent</h2>
        <p className="font-sub font-light text-[15px] text-warm-charcoal mt-2 mb-10">
          9 days through 5 climate zones, from equatorial rainforest to the arctic summit.
        </p>

        <div className="w-full overflow-x-auto">
          <svg
            ref={ref}
            viewBox={`0 0 ${svgW} ${svgH}`}
            className="w-full min-w-[700px]"
            style={{ maxHeight: "450px" }}
          >
            {/* Grid lines */}
            {altMarks.map((alt) => (
              <g key={alt}>
                <line
                  x1={padL}
                  y1={toY(alt)}
                  x2={svgW - padR}
                  y2={toY(alt)}
                  stroke="hsl(var(--faded-sand))"
                  strokeWidth={0.5}
                  strokeDasharray="4 4"
                  opacity={0.5}
                />
                <text
                  x={padL - 8}
                  y={toY(alt) + 4}
                  textAnchor="end"
                  className="fill-warm-charcoal"
                  style={{ fontSize: "9px", fontFamily: "Jost, sans-serif", fontWeight: 300 }}
                >
                  {alt === 5895 ? "5,895m" : `${(alt / 1000).toFixed(1)}k`}
                </text>
              </g>
            ))}

            {/* Day labels */}
            {Array.from({ length: 9 }).map((_, i) => (
              <text
                key={i}
                x={toX(i)}
                y={svgH - 20}
                textAnchor="middle"
                className="fill-warm-charcoal"
                style={{ fontSize: "10px", fontFamily: "Jost, sans-serif", fontWeight: 300, letterSpacing: "0.1em" }}
              >
                DAY {i + 1}
              </text>
            ))}

            {/* Main route line */}
            <path
              ref={pathRef}
              d={pathD}
              fill="none"
              stroke="hsl(var(--terracotta))"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: pathLength || 2000,
                strokeDashoffset: isInView ? 0 : pathLength || 2000,
                transition: "stroke-dashoffset 3s ease-in-out",
              }}
            />

            {/* Acclimatization loop highlight */}
            <path
              d={accPathD}
              fill="none"
              stroke="hsl(var(--gold))"
              strokeWidth={3}
              strokeLinecap="round"
              opacity={isInView ? 0.7 : 0}
              style={{ transition: "opacity 1s ease 2.5s" }}
            />

            {/* Summit segment highlight */}
            <path
              d={sumPathD}
              fill="none"
              stroke="hsl(var(--terracotta))"
              strokeWidth={4}
              strokeLinecap="round"
              opacity={isInView ? 1 : 0}
              style={{ transition: "opacity 1s ease 2.5s" }}
            >
              <animate
                attributeName="opacity"
                values="1;0.5;1"
                dur="2s"
                repeatCount="indefinite"
                begin="3s"
              />
            </path>

            {/* Waypoint dots and labels */}
            {waypoints.map((wp, i) => {
              const cx = toX(wp.x);
              const cy = toY(wp.altitude);
              const isHovered = hoveredIdx === i;
              return (
                <g
                  key={i}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  style={{ cursor: "pointer" }}
                >
                  {/* Dot */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={wp.isSummit ? 7 : wp.isAcclimatization ? 5 : 4}
                    fill={wp.isSummit ? "hsl(var(--terracotta))" : wp.isAcclimatization ? "hsl(var(--gold))" : "hsl(var(--terracotta))"}
                    opacity={isInView ? 1 : 0}
                    style={{ transition: `opacity 0.3s ease ${0.3 * i}s` }}
                  />
                  {wp.isSummit && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={12}
                      fill="none"
                      stroke="hsl(var(--terracotta))"
                      strokeWidth={1}
                      opacity={0.4}
                    >
                      <animate attributeName="r" values="10;16;10" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}

                  {/* Label */}
                  <text
                    x={cx}
                    y={cy - (wp.isSummit ? 16 : 10)}
                    textAnchor="middle"
                    className="fill-warm-charcoal"
                    style={{
                      fontSize: wp.isSummit ? "11px" : "8px",
                      fontFamily: wp.isSummit ? "Cormorant Garamond, serif" : "Jost, sans-serif",
                      fontWeight: wp.isSummit ? 400 : 300,
                      fontStyle: wp.isSummit ? "italic" : "normal",
                      opacity: isInView ? 1 : 0,
                      transition: `opacity 0.3s ease ${0.3 * i}s`,
                    }}
                  >
                    {wp.name}
                  </text>

                  {/* Tooltip */}
                  {isHovered && (
                    <foreignObject
                      x={cx - 100}
                      y={cy - 75}
                      width={200}
                      height={55}
                    >
                      <div className="bg-deep-earth p-2 text-center" style={{ borderRadius: 0 }}>
                        <p className="font-display italic text-warm-charcoal text-[12px]">{wp.name}, {wp.altitude.toLocaleString()}m</p>
                        <p className="font-sub font-light text-warm-charcoal/60 text-[9px] mt-0.5">{wp.description}</p>
                      </div>
                    </foreignObject>
                  )}

                  {/* Hit area */}
                  <circle cx={cx} cy={cy} r={16} fill="transparent" />
                </g>
              );
            })}

            {/* Legend */}
            <g transform={`translate(${padL + 10}, ${padT + 10})`}>
              <line x1={0} y1={0} x2={16} y2={0} stroke="hsl(var(--terracotta))" strokeWidth={2.5} />
              <text x={22} y={3} style={{ fontSize: "8px", fontFamily: "Jost, sans-serif", fontWeight: 300 }} className="fill-warm-charcoal">Main Route</text>
              <line x1={0} y1={14} x2={16} y2={14} stroke="hsl(var(--gold))" strokeWidth={2.5} />
              <text x={22} y={17} style={{ fontSize: "8px", fontFamily: "Jost, sans-serif", fontWeight: 300 }} className="fill-warm-charcoal">Acclimatization (climb high, sleep low)</text>
            </g>
          </svg>
        </div>

        {/* AMS Warning Box */}
        <div className="mt-10 bg-gold/[0.08] border-l-[3px] border-gold p-5 max-w-[900px]">
          <p className="font-sub font-light text-[14px] text-warm-charcoal leading-[1.8]">
            <strong className="font-normal text-deep-earth">Altitude Sickness Warning:</strong> Acute Mountain Sickness (AMS) affects travelers regardless of fitness level. Symptoms include headache, nausea, and fatigue. Our guides are trained in AMS recognition and carry a pulse oximeter to monitor your blood oxygen levels throughout the climb. If AMS becomes severe, descent is the only treatment, and your guide will initiate this without hesitation.
          </p>
        </div>
      </div>
    </section>
  );
};

export default KilimanjaroElevation;
