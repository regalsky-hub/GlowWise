/* global React, ReactDOM */
import React, { useState } from 'react';

/* ==========================================================
   GlowWise · Glow Types overview — editorial + interactive
   Same fonts (Fraunces + Manrope + Instrument Serif), same palette.
   ========================================================== */

// ─────────── tokens ───────────
const C = {
  paper: "#FAF8F5", paperWarm: "#F3EFE8",
  ink: "#3D4A52", body: "#5A6770", mute: "#A89968",
  sage: "#6B9E7F", sageDark: "#557E64", sageMint: "#EDF4EF",
  terracotta: "#A85A3D", terracottaMid: "#C97B5C", terracottaBg: "#F5DDD0",
  plum: "#7A5C77", plumBg: "#EDE2EC",
  amber: "#A07E3D", amberBg: "#FAF3DC",
  ocean: "#5B8FA3", oceanBg: "#E8EFF5",
  rose: "#A77090", roseBg: "#F5E5ED",
  line: "rgba(168,153,104,0.16)",
  lineSoft: "rgba(168,153,104,0.10)",
};

const FF_DISPLAY = "'Fraunces', Georgia, serif";
const FF_UI = "'Manrope', system-ui, sans-serif";
const FF_WORDMARK = "'Instrument Serif', Georgia, serif";

// ─────────── tiny inline icons ───────────
const Icon = {
  moon: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>,
  bolt: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M13 3 4 14h6l-1 7 9-11h-6z"/></svg>,
  heart: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/></svg>,
  trend: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 17l6-6 4 4 8-8M14 7h7v7"/></svg>,
  bulb: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.7.6 1 1.4 1 2.3v1h6v-1c0-.9.3-1.7 1-2.3A7 7 0 0 0 12 2z"/></svg>,
  users: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="9" cy="8" r="3.5"/><path d="M2 21c0-3.6 3-6 7-6s7 2.4 7 6"/><circle cx="17" cy="6" r="2.5"/><path d="M22 17c0-2.6-1.8-4.5-4.5-4.5"/></svg>,
  sun: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...p}><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4l1.4-1.4M17 7l1.4-1.4"/></svg>,
  wave: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...p}><path d="M3 12c2 0 2-3 4-3s2 6 4 6 2-9 4-9 2 6 4 6 2-3 2-3"/></svg>,
  chat: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12z"/></svg>,
  cal: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>,
  chart: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" {...p}><path d="M4 20V8M10 20v-7M16 20V4M22 20H2"/></svg>,
  cog: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>,
  spark: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></svg>,
  bell: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9zM10 21a2 2 0 0 0 4 0"/></svg>,
  plus: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}><path d="M12 5v14M5 12h14"/></svg>,
  arrow: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 6l6 6-6 6"/></svg>,
  caret: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 9l6 6 6-6"/></svg>,
  check: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12l5 5L20 7"/></svg>,
  bloom: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="2"/><path d="M12 4a4 4 0 0 1 4 4M12 20a4 4 0 0 0 4-4M12 4a4 4 0 0 0-4 4M12 20a4 4 0 0 1-4-4M4 12a4 4 0 0 1 4-4M20 12a4 4 0 0 0-4-4M4 12a4 4 0 0 0 4 4M20 12a4 4 0 0 1-4 4"/></svg>,
};

// ─────────── brand mark (echo from dashboard) ───────────
const Orbit = ({ size = 32, color = C.sageDark, tail = C.sage, accent = C.terracottaMid }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="46" r="28" stroke={color} strokeWidth="5" />
    <path d="M 78 46 Q 78 78 50 80 Q 32 81 30 72" stroke={tail} strokeWidth="5" strokeLinecap="round" />
    <circle cx="78" cy="46" r="6" fill={accent} />
  </svg>
);

const Wordmark = ({ size = 22, color = C.sageDark }) => (
  <span style={{
    fontFamily: FF_WORDMARK, fontWeight: 400, fontSize: size, color,
    letterSpacing: "-0.008em", lineHeight: 1, whiteSpace: "nowrap",
  }}>
    Glow<span style={{ display: "inline-block", width: size * 0.12 }}></span>
    <span style={{ fontStyle: "italic", display: "inline-block", transform: "skewX(2deg)" }}>Wise</span>
  </span>
);

// editorial 'g' watermark
const Watermark = ({ size = 220, color = "rgba(85,126,100,0.06)", style }) => (
  <span aria-hidden style={{
    position: "absolute", fontFamily: FF_DISPLAY, fontStyle: "italic",
    fontWeight: 400, fontSize: size, color, lineHeight: 1,
    pointerEvents: "none", userSelect: "none", ...style,
  }}>g</span>
);

// ─────────── shared style helpers ───────────
const eyebrow = (color = C.mute) => ({
  fontFamily: FF_UI, fontSize: 11, fontWeight: 700,
  letterSpacing: "0.18em", textTransform: "uppercase", color, lineHeight: 1,
});
const display = (size = 28) => ({
  fontFamily: FF_DISPLAY, fontWeight: 400, fontSize: size, lineHeight: 1.1,
  letterSpacing: "-0.02em", color: C.ink,
});
const bodyText = (size = 14) => ({
  fontFamily: FF_UI, fontSize: size, lineHeight: 1.65, color: C.body,
});

// ─────────── DATA: the six types ───────────
const GLOW_TYPES = [
  {
    id: "bloomer",
    name: "The Steady Bloomer",
    icon: Icon.moon,
    color: C.sage, accent: C.sageDark, bg: C.sageMint,
    tagline: "Routine is the soil. Ritual is the bloom.",
    essence: "Small daily rituals compound into a deep, quiet bloom.",
    metaphor: "A garden in season",
    peak: "Mid-morning · early afternoon",
    fuels: ["Predictable mornings", "Consistent bedtime", "Repeated, simple rituals"],
    depletes: ["Surprise schedules", "All-or-nothing pushes", "Big emotional swings"],
    ritual: "A 10-minute morning anchor — same place, same time, every day.",
    x: 0.30, y: 0.18,
  },
  {
    id: "optimizer",
    name: "The Energy Optimizer",
    icon: Icon.bolt,
    color: C.amber, accent: "#8B6A30", bg: C.amberBg,
    tagline: "Variety is the vitamin. Novelty is the medicine.",
    essence: "Monotony dims me. New rooms, new routes, new music light me up.",
    metaphor: "A river finding new paths",
    peak: "Late-morning bursts · evening surge",
    fuels: ["New movement styles", "Fresh playlists & places", "Novel routes & food"],
    depletes: ["Identical days", "Long stretches without change", "Over-scheduled repetition"],
    ritual: "One small 'first' a day — a new walk, a new dish, a new song.",
    x: 0.78, y: 0.82,
  },
  {
    id: "nurturer",
    name: "The Sensitive Nurturer",
    icon: Icon.heart,
    color: C.plum, accent: "#5D4459", bg: C.plumBg,
    tagline: "Sensitivity is signal. Calm is the practice.",
    essence: "I feel acutely. The skill is protecting that feeling as an asset.",
    metaphor: "A lantern at dusk",
    peak: "Soft mornings · twilight hours",
    fuels: ["Quiet rooms", "Soft transitions", "Small, trusted circles"],
    depletes: ["Loud, crowded spaces", "Rushed hand-offs", "Pressure to perform"],
    ritual: "A 'buffer hour' between worlds — work to home, day to evening.",
    x: 0.18, y: 0.34,
  },
  {
    id: "achiever",
    name: "The Resilient Achiever",
    icon: Icon.trend,
    color: C.terracotta, accent: "#8B4A30", bg: C.terracottaBg,
    tagline: "Recovery is fuel — not failure.",
    essence: "Deep reserves, big goals — and a habit of overriding rest.",
    metaphor: "A tide returning to itself",
    peak: "Early morning · sustained through afternoon",
    fuels: ["Goals with rest baked in", "Strength training", "Deep, uninterrupted work blocks"],
    depletes: ["Skipping recovery", "Ignoring early stress signals", "Weekend catch-up sleep"],
    ritual: "A protected rest window — same hour each evening, non-negotiable.",
    x: 0.82, y: 0.62,
  },
  {
    id: "explorer",
    name: "The Intuitive Explorer",
    icon: Icon.bulb,
    color: C.ocean, accent: "#3F6E82", bg: C.oceanBg,
    tagline: "Body-aware. Acts without overthinking.",
    essence: "I move when my body tells me to — and rest the same way.",
    metaphor: "Wind through an open window",
    peak: "Variable — listens to the day",
    fuels: ["Unscheduled white space", "Body-led movement", "Intuitive eating"],
    depletes: ["Rigid plans", "External 'shoulds'", "Borrowed routines that don't fit"],
    ritual: "A morning body-scan — five minutes, eyes closed, before the phone.",
    x: 0.34, y: 0.78,
  },
  {
    id: "connector",
    name: "The Community Connector",
    icon: Icon.users,
    color: C.rose, accent: "#7A4D63", bg: C.roseBg,
    tagline: "Movement is medicine when it's shared.",
    essence: "I bloom in the company of others. Solitude is the off-day, not the goal.",
    metaphor: "A choir in unison",
    peak: "Anytime others are present",
    fuels: ["Group classes & shared meals", "Walking conversations", "Accountability partners"],
    depletes: ["Long solo stretches", "Silent days", "Working from home alone"],
    ritual: "One 'with-someone' activity a day — even a 10-minute call counts.",
    x: 0.70, y: 0.30,
  },
];

// ─────────── SIDEBAR ───────────
const NavItem = ({ Icon: I, label, active }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 12,
    padding: "10px 14px", borderRadius: 12,
    color: active ? C.sageDark : C.body,
    background: active ? C.sageMint : "transparent",
    fontFamily: FF_UI, fontSize: 13.5, fontWeight: active ? 600 : 500,
    cursor: "pointer",
  }}>
    <I width={18} height={18} />
    <span>{label}</span>
  </div>
);

const Sidebar = () => (
  <aside style={{
    width: 240, padding: "32px 18px",
    borderRight: `1px solid ${C.lineSoft}`,
    background: C.paper,
    display: "flex", flexDirection: "column", gap: 4,
    position: "sticky", top: 0, height: "100vh", boxSizing: "border-box",
    flexShrink: 0,
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px 28px" }}>
      <Orbit size={32} />
      <Wordmark size={22} />
    </div>
    <div style={{ ...eyebrow(C.mute), padding: "8px 14px 10px", fontSize: 10 }}>Today</div>
    <NavItem Icon={Icon.sun} label="Dashboard" />
    <NavItem Icon={Icon.cal} label="Check-in" />
    <NavItem Icon={Icon.chat} label="Wellness coach" />
    <NavItem Icon={Icon.chart} label="Insights" />
    <div style={{ ...eyebrow(C.mute), padding: "20px 14px 10px", fontSize: 10 }}>You</div>
    <NavItem Icon={Icon.heart} label="Glow type" active />
    <NavItem Icon={Icon.spark} label="Plan" />
    <NavItem Icon={Icon.cog} label="Settings" />
  </aside>
);

// ─────────── HERO ───────────
const Hero = () => (
  <section className="fade-up" style={{
    position: "relative", overflow: "hidden",
    marginBottom: 64, padding: "60px 56px 64px",
    borderRadius: 32,
    background: `linear-gradient(135deg, rgba(107,158,127,0.16) 0%, rgba(237,226,236,0.55) 55%, rgba(245,221,208,0.40) 100%)`,
    border: `1px solid rgba(107,158,127,0.10)`,
  }}>
    <div style={{
      position: "absolute", width: 380, height: 380, borderRadius: "50%",
      background: "rgba(107,158,127,0.10)", filter: "blur(90px)",
      top: -150, right: -100,
    }}/>
    <div style={{
      position: "absolute", width: 260, height: 260, borderRadius: "50%",
      background: "rgba(168,90,61,0.08)", filter: "blur(80px)",
      bottom: -100, left: 200,
    }}/>
    <Watermark size={360} style={{ bottom: -130, left: -30 }}/>

    <div style={{ position: "relative", zIndex: 2, maxWidth: 760 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <span style={{
          width: 6, height: 6, borderRadius: "50%", background: C.terracottaMid,
          boxShadow: `0 0 0 4px rgba(201,123,92,0.18)`,
        }}/>
        <div style={{ ...eyebrow(C.sageDark) }}>Understanding your wellness</div>
      </div>

      <h1 style={{
        ...display(64), margin: "0 0 22px",
        lineHeight: 1.02, letterSpacing: "-0.028em",
      }}>
        What's your{" "}
        <em style={{ fontStyle: "italic", color: C.sage }}>Glow Type</em>?
      </h1>

      <p style={{
        ...bodyText(17), lineHeight: 1.8, maxWidth: 620, margin: "0 0 32px",
      }}>
        Everyone has a natural rhythm for thriving. Glow Types map how <em style={{ fontFamily: FF_DISPLAY, fontStyle: "italic", fontSize: 18 }}>you</em> function — your energy needs, your pace, what depletes you, and what compounds beautifully.
        Six honest patterns. No hierarchy. No mystical language. Just yours.
      </p>

      <div style={{ display: "flex", gap: 28, flexWrap: "wrap", alignItems: "center" }}>
        {[
          { n: "6", l: "Glow Types" },
          { n: "5", l: "Check-ins to clarity" },
          { n: "∞", l: "Ways to thrive" },
        ].map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ ...display(38), color: C.sageDark, lineHeight: 1 }}>{s.n}</span>
            <span style={{
              ...eyebrow(C.mute), fontSize: 10.5, maxWidth: 100,
              lineHeight: 1.4, letterSpacing: "0.14em",
            }}>{s.l}</span>
            {i < 2 && <span style={{
              width: 1, height: 28, background: C.line, marginLeft: 18,
            }}/>}
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─────────── PRINCIPLES ───────────
const Principles = () => {
  const items = [
    {
      Icon: Icon.bloom, color: C.sage, bg: C.sageMint,
      title: "Earned from your data",
      body: "Your type emerges from real check-ins — sleep, energy, mood, movement. Not a personality quiz. Patterns, not guesses.",
    },
    {
      Icon: Icon.spark, color: C.amber, bg: C.amberBg,
      title: "Practical, not poetic",
      body: "Once your type is clear, you get specific practices tailored to how you thrive — never generic wellness advice you'd find anywhere.",
    },
    {
      Icon: Icon.heart, color: C.plum, bg: C.plumBg,
      title: "Honest and unranked",
      body: "No type is 'better.' These are six different shapes of thriving. Knowing yours means working with your nature, not against it.",
    },
  ];

  return (
    <section className="fade-up d1" style={{ marginBottom: 80 }}>
      <div style={{ marginBottom: 28, maxWidth: 720 }}>
        <div style={{ ...eyebrow(C.mute), marginBottom: 10 }}>How it works</div>
        <h2 style={{ ...display(36), margin: "0 0 14px" }}>
          A type isn't a label. It's a{" "}
          <em style={{ fontStyle: "italic", color: C.sage }}>pattern of thriving</em>.
        </h2>
        <p style={{ ...bodyText(15), margin: 0, maxWidth: 580 }}>
          Three principles shape how GlowWise frames your type — so it actually helps, instead of pigeonholing you.
        </p>
      </div>

      <div style={{
        display: "grid", gap: 20,
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      }}>
        {items.map((it, i) => (
          <div key={i} className="fade-up hover-lift" style={{
            padding: 30, borderRadius: 22,
            background: C.paper, border: `1px solid ${C.lineSoft}`,
            boxShadow: "0 8px 24px -18px rgba(61,74,82,0.18)",
            animationDelay: `${0.08 * i}s`,
          }}>
            <div style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 44, height: 44, borderRadius: "50%",
              background: it.bg, color: it.color, marginBottom: 18,
            }}>
              <it.Icon width={22} height={22} />
            </div>
            <h3 style={{ ...display(20), margin: "0 0 10px", fontWeight: 500 }}>{it.title}</h3>
            <p style={{ ...bodyText(13.5), margin: 0, lineHeight: 1.7 }}>{it.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

// ─────────── COMPASS ───────────
const Compass = ({ onSelect }) => {
  const [hover, setHover] = useState(null);
  const W = 640, H = 460;
  const PAD = 60;
  const px = (x) => PAD + x * (W - PAD * 2);
  const py = (y) => H - PAD - y * (H - PAD * 2);

  return (
    <section className="fade-up d2" style={{ marginBottom: 80 }}>
      <div style={{ marginBottom: 28, maxWidth: 720 }}>
        <div style={{ ...eyebrow(C.mute), marginBottom: 10 }}>The constellation</div>
        <h2 style={{ ...display(36), margin: "0 0 14px" }}>
          Six types,{" "}
          <em style={{ fontStyle: "italic", color: C.sage }}>one map</em>.
        </h2>
        <p style={{ ...bodyText(15), margin: 0, maxWidth: 580 }}>
          Every Glow Type sits somewhere along two axes — how inward or outward your energy flows, and whether you thrive on steadiness or change. Hover to explore.
        </p>
      </div>

      <div className="hover-lift" style={{
        position: "relative", overflow: "hidden",
        background: C.paper, border: `1px solid ${C.lineSoft}`,
        borderRadius: 24, padding: "36px 32px",
        boxShadow: "0 10px 30px -22px rgba(61,74,82,0.18)",
      }}>
        <Watermark size={300} color="rgba(168,153,104,0.05)" style={{ top: -70, right: -40 }}/>

        <div style={{
          position: "relative", zIndex: 2,
          display: "grid", gridTemplateColumns: "minmax(0, 1fr) 280px",
          gap: 32, alignItems: "center",
        }}>
          <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
            <defs>
              <radialGradient id="compassGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(107,158,127,0.10)" />
                <stop offset="100%" stopColor="rgba(107,158,127,0)" />
              </radialGradient>
            </defs>

            <ellipse cx={W/2} cy={H/2} rx={W/2 - PAD/2} ry={H/2 - PAD/2} fill="url(#compassGlow)" />

            {[0.18, 0.36, 0.5].map((r, i) => (
              <ellipse key={i}
                cx={W/2} cy={H/2}
                rx={(W/2 - PAD) * (1 - r * 0.4)}
                ry={(H/2 - PAD) * (1 - r * 0.4)}
                fill="none" stroke={C.line} strokeWidth="1"
                strokeDasharray={i === 2 ? "0" : "2 6"}
              />
            ))}

            <line x1={PAD} y1={H/2} x2={W - PAD} y2={H/2} stroke={C.line} strokeWidth="1" strokeDasharray="2 6" />
            <line x1={W/2} y1={PAD} x2={W/2} y2={H - PAD} stroke={C.line} strokeWidth="1" strokeDasharray="2 6" />

            <text x={PAD - 8} y={H/2 + 4} fontSize="10" fontWeight="700" letterSpacing="2"
              fill={C.mute} fontFamily="Manrope" textAnchor="end">INWARD</text>
            <text x={W - PAD + 8} y={H/2 + 4} fontSize="10" fontWeight="700" letterSpacing="2"
              fill={C.mute} fontFamily="Manrope">OUTWARD</text>
            <text x={W/2} y={PAD - 14} fontSize="10" fontWeight="700" letterSpacing="2"
              fill={C.mute} fontFamily="Manrope" textAnchor="middle">DYNAMIC</text>
            <text x={W/2} y={H - PAD + 22} fontSize="10" fontWeight="700" letterSpacing="2"
              fill={C.mute} fontFamily="Manrope" textAnchor="middle">STEADY</text>

            {GLOW_TYPES.map((t) => {
              const cx = px(t.x), cy = py(t.y);
              const isHover = hover === t.id;
              return (
                <g
  key={t.id}
  className="orbit-float"
                  style={{ cursor: "pointer", transition: "transform 0.3s ease" }}
                  onMouseEnter={() => setHover(t.id)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => onSelect && onSelect(t.id)}
                >
                  <circle cx={cx} cy={cy} r={isHover ? 36 : 26}
                    fill={t.color} opacity={isHover ? 0.18 : 0.10}
                    style={{ transition: "all 0.3s ease" }}/>
                  <circle cx={cx} cy={cy} r={isHover ? 14 : 11}
                    fill={t.color}
                    style={{ transition: "all 0.3s ease" }}/>
                  <circle cx={cx} cy={cy} r={4} fill={C.paper}/>

                  <text x={cx} y={cy + (t.y > 0.55 ? 36 : -22)}
                    fontFamily="Fraunces" fontSize="14"
                    fill={C.ink} textAnchor="middle"
                    style={{
                      fontStyle: isHover ? "italic" : "normal",
                      fontWeight: isHover ? 500 : 400,
                      transition: "all 0.2s ease",
                    }}>
                    {t.name.replace("The ", "")}
                  </text>
                </g>
              );
            })}
          </svg>

          <div style={{
            padding: "26px 24px", borderRadius: 18,
            background: hover ? GLOW_TYPES.find(t=>t.id===hover).bg : C.paperWarm,
            border: `1px solid ${C.lineSoft}`,
            minHeight: 280, transition: "background 0.3s ease",
            display: "flex", flexDirection: "column",
          }}>
            {hover ? (() => {
              const t = GLOW_TYPES.find(x => x.id === hover);
              const I = t.icon;
              return (
                <>
                  <div style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    width: 42, height: 42, borderRadius: "50%",
                    background: C.paper, color: t.color, marginBottom: 14,
                  }}>
                    <I width={22} height={22} />
                  </div>
                  <h4 style={{ ...display(22), margin: "0 0 6px", color: t.accent, fontWeight: 500 }}>
                    {t.name}
                  </h4>
                  <div style={{
                    ...bodyText(13), color: t.accent, fontStyle: "italic",
                    fontFamily: FF_DISPLAY, fontSize: 15, marginBottom: 14,
                  }}>
                    "{t.metaphor}"
                  </div>
                  <p style={{ ...bodyText(13.5), margin: 0, lineHeight: 1.7 }}>
                    {t.tagline}
                  </p>
                  <button
                    onClick={() => onSelect && onSelect(t.id)}
                    style={{
                      marginTop: "auto", alignSelf: "flex-start",
                      display: "inline-flex", alignItems: "center", gap: 6,
                      background: "transparent", border: "none", padding: "8px 0",
                      color: t.accent, fontFamily: FF_UI, fontSize: 12,
                      fontWeight: 600, letterSpacing: "0.06em",
                      textTransform: "uppercase", cursor: "pointer",
                    }}>
                    Read full type <Icon.arrow width={12} height={12} />
                  </button>
                </>
              );
            })() : (
              <>
                <div style={{ ...eyebrow(C.mute), marginBottom: 14 }}>Hover a type</div>
                <h4 style={{ ...display(20), margin: "0 0 14px", fontWeight: 500 }}>
                  Where do you sit on the map?
                </h4>
                <p style={{ ...bodyText(13.5), margin: 0, lineHeight: 1.7 }}>
                  Most people lean toward one quadrant, but everyone has a blend. Your daily check-ins reveal exactly where your centre of gravity sits.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// ─────────── ORBITAL DECORATION ───────────
const TypeOrbit = ({ color, size = 88 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="34" stroke={color} strokeWidth="1.5" opacity="0.4" strokeDasharray="2 4"/>
    <circle cx="50" cy="50" r="22" stroke={color} strokeWidth="1.5" opacity="0.6"/>
    <circle cx="50" cy="50" r="6" fill={color}/>
    <circle cx="84" cy="50" r="3.5" fill={color} opacity="0.7"/>
    <circle cx="22" cy="62" r="2.5" fill={color} opacity="0.5"/>
  </svg>
);

// ─────────── TYPE CARD ───────────
const TypeCard = ({ type, isOpen, onToggle, index, isFocused }) => {
  const I = type.icon;

  return (
    <div
      data-type-id={type.id}
      className="fade-up hover-lift"
      style={{
        position: "relative", overflow: "hidden",
        borderRadius: 24, background: type.bg,
        border: `1px solid ${isFocused ? type.color : C.lineSoft}`,
        boxShadow: isFocused
          ? `0 0 0 3px ${type.color}22, 0 20px 40px -28px rgba(61,74,82,0.28)`
          : "0 10px 30px -24px rgba(61,74,82,0.18)",
        animationDelay: `${index * 0.06}s`,
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div style={{ position: "absolute", top: 18, right: 22, opacity: 0.7 }}>
        <TypeOrbit color={type.color} />
      </div>

      <button
        onClick={onToggle}
        style={{
          all: "unset", display: "block", width: "100%",
          padding: "28px 30px 24px", cursor: "pointer", boxSizing: "border-box",
        }}>
        <div style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 50, height: 50, borderRadius: "50%",
          background: C.paper, color: type.color, marginBottom: 18,
          boxShadow: `0 6px 18px -10px ${type.color}88`,
        }}>
          <I width={24} height={24} />
        </div>

        <div style={{ ...eyebrow(type.accent), marginBottom: 10, fontSize: 10 }}>
          {String(index + 1).padStart(2, "0")} · Glow Type
        </div>

        <h3 style={{
          ...display(26), margin: "0 0 12px", color: type.accent,
          fontWeight: 500, lineHeight: 1.15,
        }}>
          {type.name}
        </h3>

        <p style={{
          ...bodyText(14), margin: "0 0 16px", fontFamily: FF_DISPLAY,
          fontStyle: "italic", fontSize: 17, lineHeight: 1.5, color: type.accent,
          maxWidth: 340,
        }}>
          "{type.tagline}"
        </p>

        <p style={{ ...bodyText(13.5), margin: 0, lineHeight: 1.7, maxWidth: 380 }}>
          {type.essence}
        </p>

        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          marginTop: 22, color: type.accent,
          fontFamily: FF_UI, fontSize: 11.5, fontWeight: 700,
          letterSpacing: "0.16em", textTransform: "uppercase",
        }}>
          <span>{isOpen ? "Show less" : "Read full type"}</span>
          <span style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 22, height: 22, borderRadius: "50%",
            background: "rgba(255,255,255,0.5)",
            transition: "transform 0.3s ease",
            transform: isOpen ? "rotate(180deg)" : "rotate(0)",
          }}>
            <Icon.caret width={12} height={12} />
          </span>
        </div>
      </button>

      <div style={{
        maxHeight: isOpen ? 1000 : 0,
        opacity: isOpen ? 1 : 0,
        overflow: "hidden",
        transition: "max-height 0.55s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease",
      }}>
        <div style={{ padding: "0 30px 30px" }}>
          <div style={{ height: 1, background: `${type.color}33`, margin: "0 0 22px" }}/>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 22 }}>
            <div style={{
              padding: "14px 16px", borderRadius: 14,
              background: "rgba(255,255,255,0.5)",
            }}>
              <div style={{ ...eyebrow(type.accent), fontSize: 9.5, marginBottom: 6 }}>Metaphor</div>
              <div style={{ fontFamily: FF_DISPLAY, fontStyle: "italic", fontSize: 15, color: C.ink, lineHeight: 1.3 }}>
                {type.metaphor}
              </div>
            </div>
            <div style={{
              padding: "14px 16px", borderRadius: 14,
              background: "rgba(255,255,255,0.5)",
            }}>
              <div style={{ ...eyebrow(type.accent), fontSize: 9.5, marginBottom: 6 }}>Peak</div>
              <div style={{ fontFamily: FF_DISPLAY, fontStyle: "italic", fontSize: 15, color: C.ink, lineHeight: 1.3 }}>
                {type.peak}
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 22 }}>
            <div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                ...eyebrow(C.sageDark), fontSize: 10, marginBottom: 12,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.sage }}/>
                What fuels you
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                {type.fuels.map((f, i) => (
                  <li key={i} style={{
                    ...bodyText(13), color: C.ink, display: "flex", gap: 8, lineHeight: 1.5,
                  }}>
                    <Icon.check width={14} height={14} style={{ color: C.sageDark, flexShrink: 0, marginTop: 2 }}/>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                ...eyebrow(C.terracotta), fontSize: 10, marginBottom: 12,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.terracotta }}/>
                What depletes you
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                {type.depletes.map((d, i) => (
                  <li key={i} style={{
                    ...bodyText(13), color: C.ink, display: "flex", gap: 8, lineHeight: 1.5,
                  }}>
                    <span style={{
                      width: 14, height: 14, flexShrink: 0, marginTop: 5,
                      borderTop: `1.5px solid ${C.terracotta}`,
                    }}/>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{
            padding: "18px 20px", borderRadius: 16,
            background: "rgba(255,255,255,0.55)",
            border: `1px solid ${type.color}33`,
          }}>
            <div style={{ ...eyebrow(type.accent), fontSize: 10, marginBottom: 8 }}>
              Signature ritual
            </div>
            <div style={{
              fontFamily: FF_DISPLAY, fontSize: 18, color: C.ink, lineHeight: 1.4,
              fontWeight: 400, letterSpacing: "-0.01em",
            }}>
              {type.ritual}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────── TYPES GRID ───────────
const TypesGrid = ({ openId, setOpenId, focusedId }) => {
  return (
    <section className="fade-up d3" id="types-grid" style={{ marginBottom: 80 }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-end",
        gap: 16, marginBottom: 28, flexWrap: "wrap", maxWidth: 1200,
      }}>
        <div style={{ maxWidth: 620 }}>
          <div style={{ ...eyebrow(C.mute), marginBottom: 10 }}>The six types</div>
          <h2 style={{ ...display(36), margin: "0 0 14px" }}>
            Find yourself in these{" "}
            <em style={{ fontStyle: "italic", color: C.sage }}>patterns</em>.
          </h2>
          <p style={{ ...bodyText(15), margin: 0 }}>
            Tap any card to open the full type — its metaphor, peak hours, what fuels and depletes you, and the one ritual that anchors the pattern.
          </p>
        </div>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "9px 16px", borderRadius: 999,
          background: C.paperWarm, border: `1px solid ${C.lineSoft}`,
        }}>
          <Icon.spark width={14} height={14} style={{ color: C.sageDark }}/>
          <span style={{
            fontFamily: FF_UI, fontSize: 12, fontWeight: 600, color: C.body,
          }}>
            {openId ? "1 type open" : "Tap any to expand"}
          </span>
        </div>
      </div>

      <div style={{
        display: "grid", gap: 20,
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        alignItems: "start",
      }}>
        {GLOW_TYPES.map((t, i) => (
          <TypeCard
            key={t.id}
            type={t}
            index={i}
            isOpen={openId === t.id}
            isFocused={focusedId === t.id}
            onToggle={() => setOpenId(openId === t.id ? null : t.id)}
          />
        ))}
      </div>
    </section>
  );
};

// ─────────── JOURNEY ───────────
const Journey = () => {
  const steps = [
    {
      n: "01", color: C.sage, bg: C.sageMint,
      title: "Check in daily",
      body: "Sleep, energy, mood, movement. 60 seconds. The more honestly you log, the clearer your pattern becomes.",
    },
    {
      n: "02", color: C.plum, bg: C.plumBg,
      title: "After 5 check-ins",
      body: "GlowWise has enough data to suggest your most likely Glow Type — with a confidence score, not a verdict.",
    },
    {
      n: "03", color: C.terracotta, bg: C.terracottaBg,
      title: "Refine over time",
      body: "Your type may shift slightly as you log more — that's not a glitch, it's calibration. Real bodies don't fit one box.",
    },
  ];

  return (
    <section className="fade-up d4" style={{ marginBottom: 80 }}>
      <div style={{ marginBottom: 28, maxWidth: 720 }}>
        <div style={{ ...eyebrow(C.mute), marginBottom: 10 }}>How you discover yours</div>
        <h2 style={{ ...display(36), margin: "0 0 14px" }}>
          A type that's{" "}
          <em style={{ fontStyle: "italic", color: C.sage }}>earned</em>,
          not assigned.
        </h2>
        <p style={{ ...bodyText(15), margin: 0 }}>
          You won't take a quiz. Your type appears gently, the way a print develops — from honest data over a few days.
        </p>
      </div>

      <div style={{
        display: "grid", gap: 18,
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      }}>
        {steps.map((s, i) => (
          <div key={i} className="hover-lift" style={{
            position: "relative", overflow: "hidden",
            padding: "30px 26px 28px", borderRadius: 22,
            background: s.bg, border: `1px solid ${C.lineSoft}`,
          }}>
            <div style={{
              position: "absolute", width: 120, height: 120, borderRadius: "50%",
              background: "rgba(255,255,255,0.30)", filter: "blur(40px)",
              top: -40, right: -30,
            }}/>
            <div style={{ position: "relative", zIndex: 2 }}>
              <div style={{
                fontFamily: FF_DISPLAY, fontStyle: "italic",
                fontSize: 44, color: s.color, lineHeight: 1, marginBottom: 18,
                letterSpacing: "-0.02em", opacity: 0.85,
              }}>{s.n}</div>
              <h3 style={{ ...display(20), margin: "0 0 10px", fontWeight: 500 }}>{s.title}</h3>
              <p style={{ ...bodyText(13.5), margin: 0, lineHeight: 1.7 }}>{s.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// ─────────── FAQ ───────────
const FAQ = () => {
  const [open, setOpen] = useState(0);
  const items = [
    {
      q: "Can I be more than one type?",
      a: "Yes — most people are a blend, with one type leading. Your type is your centre of gravity, not a cage. GlowWise will show you the primary and any secondary leanings.",
    },
    {
      q: "What if my type changes?",
      a: "It happens. Life seasons shift — a new baby, a new job, a different sleep schedule. Your type recalibrates with you. Think of it as a snapshot of how you're functioning now.",
    },
    {
      q: "Is one type better than another?",
      a: "No. Every type has its own strengths and its own depletions. The 'best' type is the one that fits you, used with awareness. A Steady Bloomer isn't more disciplined than an Energy Optimizer — they just thrive on different inputs.",
    },
    {
      q: "What if I don't see myself in any of these?",
      a: "Worth telling us. Check in for a couple of weeks anyway — most people land in one of the six once they've logged honest data. If you still don't fit, your feedback shapes the next version of the framework.",
    },
  ];

  return (
    <section className="fade-up d5" style={{ marginBottom: 80 }}>
      <div style={{ marginBottom: 28, maxWidth: 720 }}>
        <div style={{ ...eyebrow(C.mute), marginBottom: 10 }}>Common questions</div>
        <h2 style={{ ...display(36), margin: 0 }}>
          Honest answers to{" "}
          <em style={{ fontStyle: "italic", color: C.sage }}>fair questions</em>.
        </h2>
      </div>

      <div style={{
        background: C.paper, border: `1px solid ${C.lineSoft}`,
        borderRadius: 22, overflow: "hidden",
        boxShadow: "0 10px 30px -22px rgba(61,74,82,0.18)",
      }}>
        {items.map((it, i) => {
          const isOpen = open === i;
          return (
            <div key={i} style={{
              borderBottom: i < items.length - 1 ? `1px solid ${C.lineSoft}` : "none",
            }}>
              <button
                onClick={() => setOpen(isOpen ? -1 : i)}
                style={{
                  all: "unset", display: "flex", width: "100%",
                  padding: "22px 28px", cursor: "pointer", boxSizing: "border-box",
                  justifyContent: "space-between", alignItems: "center", gap: 16,
                }}>
                <span style={{
                  fontFamily: FF_DISPLAY, fontSize: 20, color: C.ink,
                  fontWeight: 500, letterSpacing: "-0.01em", lineHeight: 1.3,
                }}>{it.q}</span>
                <span style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: 32, height: 32, borderRadius: "50%",
                  background: isOpen ? C.sageMint : C.paperWarm,
                  color: isOpen ? C.sageDark : C.mute,
                  flexShrink: 0,
                  transition: "all 0.3s ease",
                  transform: isOpen ? "rotate(180deg)" : "rotate(0)",
                }}>
                  <Icon.caret width={14} height={14}/>
                </span>
              </button>
              <div style={{
                maxHeight: isOpen ? 200 : 0, opacity: isOpen ? 1 : 0,
                overflow: "hidden",
                transition: "max-height 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease",
              }}>
                <p style={{
                  ...bodyText(14.5), margin: 0, padding: "0 28px 24px",
                  maxWidth: 720, lineHeight: 1.75,
                }}>{it.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

// ─────────── CLOSING CTA ───────────
const Closing = () => (
  <section className="fade-up">
    <div style={{
      position: "relative", overflow: "hidden",
      padding: "56px 48px", borderRadius: 32,
      background: `linear-gradient(135deg, rgba(107,158,127,0.14) 0%, rgba(237,226,236,0.50) 100%)`,
      border: `1px solid rgba(107,158,127,0.10)`,
    }}>
      <div style={{
        position: "absolute", width: 280, height: 280, borderRadius: "50%",
        background: "rgba(107,158,127,0.10)", filter: "blur(70px)",
        top: -100, right: -60,
      }}/>
      <Watermark size={360} style={{ bottom: -130, right: -20 }}/>

      <div style={{
        position: "relative", zIndex: 2, textAlign: "center",
        maxWidth: 640, margin: "0 auto",
      }}>
        <div style={{ ...eyebrow(C.sageDark), marginBottom: 20 }}>
          Ready when you are
        </div>
        <h2 style={{
          ...display(40), margin: "0 0 22px", lineHeight: 1.15,
        }}>
          Your type is{" "}
          <em style={{ fontStyle: "italic", color: C.sage }}>five check-ins</em>{" "}
          away.
        </h2>
        <p style={{
          ...bodyText(15.5), maxWidth: 520, margin: "0 auto 30px", lineHeight: 1.8,
        }}>
          Start with today. A 60-second check-in tonight gets you one step closer to a pattern you can actually use.
        </p>
        <div style={{ display: "inline-flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <button style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "13px 24px", borderRadius: 999,
            background: C.sage, color: C.paper, border: "none", cursor: "pointer",
            fontFamily: FF_UI, fontSize: 13.5, fontWeight: 600, letterSpacing: "0.01em",
            boxShadow: "0 10px 24px -12px rgba(107,158,127,0.55)",
          }}>
            <Icon.plus width={14} height={14} />
            Start tonight's check-in
          </button>
          <button style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "13px 22px", borderRadius: 999,
            background: "transparent", color: C.sageDark,
            border: `1px solid ${C.sage}`, cursor: "pointer",
            fontFamily: FF_UI, fontSize: 13, fontWeight: 600,
          }}>
            See sample types
            <Icon.arrow width={12} height={12}/>
          </button>
        </div>
      </div>
    </div>
  </section>
);

// ─────────── PAGE ───────────
export default function GlowTypes() {
  const [openId, setOpenId] = useState(null);
  const [focusedId, setFocusedId] = useState(null);

  const handleCompassSelect = (id) => {
    setOpenId(id);
    setFocusedId(id);
    setTimeout(() => {
      const el = document.querySelector(`[data-type-id="${id}"]`);
      if (el) {
        window.scrollTo({
          top: el.getBoundingClientRect().top + window.scrollY - 40,
          behavior: "smooth",
        });
      }
    }, 60);
    setTimeout(() => setFocusedId(null), 2400);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.paper }}>
      <Sidebar />

      <main style={{ flex: 1, minWidth: 0 }}>
        <style>{`
  .fade-up { animation: fu 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }
  .fade-up.d1 { animation-delay: 0.06s; }
  .fade-up.d2 { animation-delay: 0.12s; }
  .fade-up.d3 { animation-delay: 0.18s; }
  .fade-up.d4 { animation-delay: 0.24s; }
  .fade-up.d5 { animation-delay: 0.30s; }

  @keyframes fu {
    from {
      opacity: 0;
      transform: translateY(14px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes floatOrbit {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-4px);
    }
    100% {
      transform: translateY(0px);
    }
  }

  .hover-lift {
    transition:
      transform 0.4s cubic-bezier(0.16,1,0.3,1),
      box-shadow 0.4s ease;
  }

  .hover-lift:hover {
    transform: translateY(-4px);
    box-shadow: 0 22px 50px -28px rgba(61,74,82,0.28);
  }

  .orbit-float {
    animation: floatOrbit 5s ease-in-out infinite;
    transform-origin: center;
  }

  .orbit-float:nth-child(2n) {
    animation-duration: 6s;
  }

  .orbit-float:nth-child(3n) {
    animation-duration: 7s;
  }
`}</style>

        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "24px 48px", borderBottom: `1px solid ${C.lineSoft}`,
        }}>
          <div style={{ ...eyebrow(C.mute) }}>Glow Type · Overview</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button style={{
              display: "inline-flex", alignItems: "center",
              padding: "9px 12px", borderRadius: 999,
              background: "transparent", color: C.sageDark,
              border: `1px solid ${C.lineSoft}`, cursor: "pointer",
            }}>
              <Icon.bell width={16} height={16}/>
            </button>
            <button style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "11px 18px", borderRadius: 999,
              background: C.sage, color: C.paper, border: "none", cursor: "pointer",
              fontFamily: FF_UI, fontSize: 13, fontWeight: 600,
            }}>
              <Icon.plus width={14} height={14}/> New check-in
            </button>
          </div>
        </div>

        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "40px 48px 96px" }}>
          <Hero />
          
          <Compass onSelect={handleCompassSelect} />
          <TypesGrid openId={openId} setOpenId={setOpenId} focusedId={focusedId} />
          <Journey />
          <FAQ />
          <Closing />
        </div>
      </main>
    </div>
  );
}
