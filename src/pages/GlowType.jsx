import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from './AppLayout';

/* ==========================================================
   GlowWise · Glow Types — complete page
   - AppLayout for nav (no sidebar)
   - Compass constellation restored
   - Updated Orbit logo (strokeWidth 6, brand spec)
   - Hero centred
   - Mobile responsive
   - "Begin today" → /checkin
   - Journey + FAQ + "Explore types" button removed
   ========================================================== */

const C = {
  paper: "#FAF8F5", paperWarm: "#F3EFE8",
  ink: "#3D4A52", body: "#5A6770", mute: "#A89968",
  sage: "#6B9E7F", sageDark: "#557E64", sageMint: "#EDF4EF",
  terracotta: "#A85A3D", terracottaMid: "#C97B5C", terracottaBg: "#F5DDD0",
  plum: "#7A5C77", plumBg: "#EDE2EC",
  amber: "#A07E3D", amberBg: "#FAF3DC",
  ocean: "#5B8FA3", oceanBg: "#E8EFF5",
  line: "rgba(168,153,104,0.16)",
  lineSoft: "rgba(168,153,104,0.10)",
};

const FF_DISPLAY = "'Fraunces', Georgia, serif";
const FF_UI = "'Manrope', system-ui, sans-serif";

// ─── Icons ───────────────────────────────────────────────
const Icon = {
  moon:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>,
  bolt:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M13 3 4 14h6l-1 7 9-11h-6z"/></svg>,
  heart: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/></svg>,
  trend: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 17l6-6 4 4 8-8M14 7h7v7"/></svg>,
  bulb:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.7.6 1 1.4 1 2.3v1h6v-1c0-.9.3-1.7 1-2.3A7 7 0 0 0 12 2z"/></svg>,
  users: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="9" cy="8" r="3.5"/><path d="M2 21c0-3.6 3-6 7-6s7 2.4 7 6"/><circle cx="17" cy="6" r="2.5"/><path d="M22 17c0-2.6-1.8-4.5-4.5-4.5"/></svg>,
  sun:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...p}><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4l1.4-1.4M17 7l1.4-1.4"/></svg>,
  chat:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12z"/></svg>,
  cal:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>,
  chart: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" {...p}><path d="M4 20V8M10 20v-7M16 20V4M22 20H2"/></svg>,
  cog:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>,
  spark: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></svg>,
  bell:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9zM10 21a2 2 0 0 0 4 0"/></svg>,
  plus:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}><path d="M12 5v14M5 12h14"/></svg>,
  arrow: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 6l6 6-6 6"/></svg>,
  caret: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 9l6 6 6-6"/></svg>,
  check: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12l5 5L20 7"/></svg>,
  bloom: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="2"/><path d="M12 4a4 4 0 0 1 4 4M12 20a4 4 0 0 0 4-4M12 4a4 4 0 0 0-4 4M12 20a4 4 0 0 1-4-4M4 12a4 4 0 0 1 4-4M20 12a4 4 0 0 0-4-4M4 12a4 4 0 0 0 4 4M20 12a4 4 0 0 1-4 4"/></svg>,
  wave:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...p}><path d="M3 12c2 0 2-3 4-3s2 6 4 6 2-9 4-9 2 6 4 6 2-3 2-3"/></svg>,
};

// ─── Brand ───────────────────────────────────────────────
const Orbit = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <circle cx="50" cy="46" r="28" stroke="#557E64" strokeWidth="6" fill="none" />
    <path d="M 78 46 Q 78 78 50 80 Q 32 81 30 72" stroke="#6B9E7F" strokeWidth="6" strokeLinecap="round" fill="none" />
    <circle cx="78" cy="46" r="6" fill="#C97B5C" />
  </svg>
);

const Wordmark = ({ size = 22, color = C.ink }) => (
  <span style={{
    fontFamily: FF_DISPLAY, fontWeight: 500, fontSize: size, color,
    letterSpacing: '-0.018em', lineHeight: 1, whiteSpace: 'nowrap',
  }}>GlowWise</span>
);

const Watermark = ({ size = 220, color = "rgba(85,126,100,0.06)", style: s }) => (
  <span aria-hidden style={{
    position: "absolute", fontFamily: FF_DISPLAY, fontStyle: "italic",
    fontWeight: 400, fontSize: size, color, lineHeight: 1,
    pointerEvents: "none", userSelect: "none", ...s,
  }}>g</span>
);

// ─── Style helpers ───────────────────────────────────────
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

// ─── Data ────────────────────────────────────────────────
const GLOW_TYPES = [
  {
    id: "bloomer", name: "The Steady Bloomer", icon: Icon.moon,
    color: C.sage, accent: C.sageDark, bg: C.sageMint,
    tagline: "Routine is the soil. Ritual is the bloom.",
    essence: "Small daily rituals compound into a deep, quiet bloom.",
    metaphor: "A garden in season", peak: "Mid-morning · early afternoon",
    fuels: ["Predictable mornings", "Consistent bedtime", "Repeated, simple rituals"],
    depletes: ["Surprise schedules", "All-or-nothing pushes", "Big emotional swings"],
    ritual: "A 10-minute morning anchor — same place, same time, every day.",
    x: 0.30, y: 0.18,
  },
  {
    id: "optimizer", name: "The Energy Optimizer", icon: Icon.bolt,
    color: C.amber, accent: "#8B6A30", bg: C.amberBg,
    tagline: "Variety is the vitamin. Novelty is the medicine.",
    essence: "Monotony dims me. New rooms, new routes, new music light me up.",
    metaphor: "A river finding new paths", peak: "Late-morning bursts · evening surge",
    fuels: ["New movement styles", "Fresh playlists & places", "Novel routes & food"],
    depletes: ["Identical days", "Long stretches without change", "Over-scheduled repetition"],
    ritual: "One small 'first' a day — a new walk, a new dish, a new song.",
    x: 0.78, y: 0.82,
  },
  {
    id: "nurturer", name: "The Sensitive Nurturer", icon: Icon.heart,
    color: C.plum, accent: "#5D4459", bg: C.plumBg,
    tagline: "Sensitivity is signal. Calm is the practice.",
    essence: "I feel acutely. The skill is protecting that feeling as an asset.",
    metaphor: "A lantern at dusk", peak: "Soft mornings · twilight hours",
    fuels: ["Quiet rooms", "Soft transitions", "Small, trusted circles"],
    depletes: ["Loud, crowded spaces", "Rushed hand-offs", "Pressure to perform"],
    ritual: "A 'buffer hour' between worlds — work to home, day to evening.",
    x: 0.18, y: 0.34,
  },
  {
    id: "achiever", name: "The Resilient Achiever", icon: Icon.trend,
    color: C.terracotta, accent: "#8B4A30", bg: C.terracottaBg,
    tagline: "Recovery is fuel — not failure.",
    essence: "Deep reserves, big goals — and a habit of overriding rest.",
    metaphor: "A tide returning to itself", peak: "Early morning · sustained through afternoon",
    fuels: ["Goals with rest baked in", "Strength training", "Deep, uninterrupted work blocks"],
    depletes: ["Skipping recovery", "Ignoring early stress signals", "Weekend catch-up sleep"],
    ritual: "A protected rest window — same hour each evening, non-negotiable.",
    x: 0.82, y: 0.62,
  },
  {
    id: "explorer", name: "The Intuitive Explorer", icon: Icon.bulb,
    color: C.ocean, accent: "#3F6E82", bg: C.oceanBg,
    tagline: "Body-aware. Acts without overthinking.",
    essence: "I move when my body tells me to — and rest the same way.",
    metaphor: "Wind through an open window", peak: "Variable — listens to the day",
    fuels: ["Unscheduled white space", "Body-led movement", "Intuitive eating"],
    depletes: ["Rigid plans", "External 'shoulds'", "Borrowed routines that don't fit"],
    ritual: "A morning body-scan — five minutes, eyes closed, before the phone.",
    x: 0.34, y: 0.78,
  },
  {
    id: "connector", name: "The Community Connector", icon: Icon.users,
    color: "#D96A4A", accent: "#A94E35", bg: "#FCE9E2",
    tagline: "Movement is medicine when it's shared.",
    essence: "I bloom in the company of others. Solitude is the off-day, not the goal.",
    metaphor: "A choir in unison", peak: "Anytime others are present",
    fuels: ["Group classes & shared meals", "Walking conversations", "Accountability partners"],
    depletes: ["Long solo stretches", "Silent days", "Working from home alone"],
    ritual: "One 'with-someone' activity a day — even a 10-minute call counts.",
    x: 0.70, y: 0.30,
  },
];

// ─── Orbital decoration ──────────────────────────────────
const TypeOrbit = ({ color, size = 88 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="34" stroke={color} strokeWidth="1.5" opacity="0.4" strokeDasharray="2 4"/>
    <circle cx="50" cy="50" r="22" stroke={color} strokeWidth="1.5" opacity="0.6"/>
    <circle cx="50" cy="50" r="6" fill={color}/>
    <circle cx="84" cy="50" r="3.5" fill={color} opacity="0.7"/>
    <circle cx="22" cy="62" r="2.5" fill={color} opacity="0.5"/>
  </svg>
);

// ─── Compass ─────────────────────────────────────────────
const Compass = ({ onSelect }) => {
  const [hover, setHover] = useState(null);
  const W = 640, H = 460, PAD = 60;
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
        <div style={{ position: "relative", zIndex: 2, display: "grid", gridTemplateColumns: "minmax(0, 1fr) 280px", gap: 32, alignItems: "center" }} className="gt-compass-grid">
          <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
            <defs>
              <radialGradient id="compassGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(107,158,127,0.10)" />
                <stop offset="100%" stopColor="rgba(107,158,127,0)" />
              </radialGradient>
            </defs>
            <ellipse cx={W/2} cy={H/2} rx={W/2 - PAD/2} ry={H/2 - PAD/2} fill="url(#compassGlow)" />
            {[0.18, 0.36, 0.5].map((r, i) => (
              <ellipse key={i} cx={W/2} cy={H/2}
                rx={(W/2 - PAD) * (1 - r * 0.4)} ry={(H/2 - PAD) * (1 - r * 0.4)}
                fill="none" stroke={C.line} strokeWidth="1"
                strokeDasharray={i === 2 ? "0" : "2 6"}
              />
            ))}
            <line x1={PAD} y1={H/2} x2={W-PAD} y2={H/2} stroke={C.line} strokeWidth="1" strokeDasharray="2 6" />
            <line x1={W/2} y1={PAD} x2={W/2} y2={H-PAD} stroke={C.line} strokeWidth="1" strokeDasharray="2 6" />
            <text x={PAD-8} y={H/2+4} fontSize="10" fontWeight="700" letterSpacing="2" fill={C.mute} fontFamily="Manrope" textAnchor="end">INWARD</text>
            <text x={W-PAD-8} y={H/2+4} fontSize="10" fontWeight="700" letterSpacing="2" fill={C.mute} fontFamily="Manrope">OUTWARD</text>
            <text x={W/2} y={PAD-14} fontSize="10" fontWeight="700" letterSpacing="2" fill={C.mute} fontFamily="Manrope" textAnchor="middle">DYNAMIC</text>
            <text x={W/2} y={H-PAD+22} fontSize="10" fontWeight="700" letterSpacing="2" fill={C.mute} fontFamily="Manrope" textAnchor="middle">STEADY</text>
            {GLOW_TYPES.map((t) => {
              const cx = px(t.x), cy = py(t.y);
              const isHover = hover === t.id;
              return (
                <g key={t.id} style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHover(t.id)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => onSelect && onSelect(t.id)}
                >
                  <circle cx={cx} cy={cy} r={isHover ? 36 : 26} fill={t.color} opacity={isHover ? 0.18 : 0.10} style={{ transition: "all 0.3s ease" }}/>
                  <circle cx={cx} cy={cy} r={isHover ? 14 : 11} fill={t.color} style={{ transition: "all 0.3s ease" }}/>
                  <circle cx={cx} cy={cy} r={4} fill={C.paper}/>
                  <text x={cx} y={cy + (t.y > 0.55 ? 36 : -22)}
                    fontFamily="Fraunces" fontSize="14" fill={C.ink} textAnchor="middle"
                    style={{ fontStyle: isHover ? "italic" : "normal", fontWeight: isHover ? 500 : 400, transition: "all 0.2s ease" }}>
                    {t.name.replace("The ", "")}
                  </text>
                </g>
              );
            })}
          </svg>

          <div style={{
            padding: "26px 24px", borderRadius: 18,
            background: hover ? GLOW_TYPES.find(t => t.id === hover).bg : C.paperWarm,
            border: `1px solid ${C.lineSoft}`,
            minHeight: 280, transition: "background 0.3s ease",
            display: "flex", flexDirection: "column",
          }}>
            {hover ? (() => {
              const t = GLOW_TYPES.find(x => x.id === hover);
              const I = t.icon;
              return (
                <>
                  <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 42, height: 42, borderRadius: "50%", background: C.paper, color: t.color, marginBottom: 14 }}>
                    <I width={22} height={22} />
                  </div>
                  <h4 style={{ ...display(22), margin: "0 0 6px", color: t.accent, fontWeight: 500 }}>{t.name}</h4>
                  <div style={{ color: t.accent, fontStyle: "italic", fontFamily: FF_DISPLAY, fontSize: 15, marginBottom: 14 }}>"{t.metaphor}"</div>
                  <p style={{ ...bodyText(13.5), margin: 0, lineHeight: 1.7 }}>{t.tagline}</p>
                  <button onClick={() => onSelect && onSelect(t.id)} style={{
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
                <h4 style={{ ...display(20), margin: "0 0 14px", fontWeight: 500 }}>Where do you sit on the map?</h4>
                <p style={{ ...bodyText(13.5), margin: 0, lineHeight: 1.7 }}>
                  Most people lean toward one quadrant, but everyone has a blend. Your starting type comes from onboarding — and your daily check-ins sharpen it over time, sometimes shifting it as your rhythm changes.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Type Card ───────────────────────────────────────────
const TypeCard = ({ type, isOpen, onToggle, index, isFocused }) => {
  const I = type.icon;
  return (
    <div data-type-id={type.id} className="fade-up hover-lift" style={{
      position: "relative", overflow: "hidden", borderRadius: 24, background: type.bg,
      border: `1px solid ${isFocused ? `${type.color}55` : "rgba(255,255,255,0.34)"}`,
      boxShadow: isFocused
        ? `0 0 0 3px ${type.color}18, 0 28px 54px -34px rgba(61,74,82,0.26)`
        : "0 18px 40px -32px rgba(61,74,82,0.16)",
      animationDelay: `${index * 0.06}s`,
      transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
    }}>
      <div style={{ position: "absolute", top: 20, right: 20, opacity: 0.38 }}>
        <TypeOrbit color={type.color} />
      </div>
      <button onClick={onToggle} style={{ all: "unset", display: "block", width: "100%", padding: "28px 30px 24px", cursor: "pointer", boxSizing: "border-box" }}>
        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", color: type.color, marginBottom: 18 }}>
          <I width={24} height={24} />
        </div>
        <div style={{ ...eyebrow(type.accent), marginBottom: 10, fontSize: 10 }}>{String(index + 1).padStart(2, "0")} · Glow Type</div>
        <h3 style={{ ...display(28), margin: "0 0 16px", color: type.accent, fontWeight: 500, lineHeight: 1.12 }}>{type.name}</h3>
        <p style={{ ...bodyText(14), margin: "0 0 20px", fontFamily: FF_DISPLAY, fontStyle: "italic", fontSize: 18, lineHeight: 1.55, color: type.accent, maxWidth: 360 }}>"{type.tagline}"</p>
        <p style={{ ...bodyText(13.5), margin: "0 0 4px", lineHeight: 1.8, maxWidth: 390 }}>{type.essence}</p>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 22, color: type.accent, fontFamily: FF_UI, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" }}>
          <span>{isOpen ? "Close reflection" : "Explore this rhythm"}</span>
          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: "50%", background: "rgba(255,255,255,0.5)", transition: "transform 0.3s ease", transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}>
            <Icon.caret width={12} height={12} />
          </span>
        </div>
      </button>

      <div style={{ maxHeight: isOpen ? 1200 : 0, opacity: isOpen ? 1 : 0, overflow: "hidden", transition: "max-height 0.55s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease" }}>
        <div style={{ padding: "0 30px 30px" }}>
          <div style={{ height: 1, background: `${type.color}33`, margin: "0 0 22px" }}/>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 22 }}>
            <div style={{ padding: "14px 16px", borderRadius: 14, background: "rgba(255,255,255,0.5)" }}>
              <div style={{ ...eyebrow(type.accent), fontSize: 9.5, marginBottom: 6 }}>Metaphor</div>
              <div style={{ fontFamily: FF_DISPLAY, fontStyle: "italic", fontSize: 15, color: C.ink, lineHeight: 1.3 }}>{type.metaphor}</div>
            </div>
            <div style={{ padding: "14px 16px", borderRadius: 14, background: "rgba(255,255,255,0.5)" }}>
              <div style={{ ...eyebrow(type.accent), fontSize: 9.5, marginBottom: 6 }}>Peak</div>
              <div style={{ fontFamily: FF_DISPLAY, fontStyle: "italic", fontSize: 15, color: C.ink, lineHeight: 1.3 }}>{type.peak}</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 22 }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, ...eyebrow(C.sageDark), fontSize: 10, marginBottom: 12 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.sage }}/>
                What fuels you
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                {type.fuels.map((f, i) => (
                  <li key={i} style={{ ...bodyText(13), color: C.ink, display: "flex", gap: 8, lineHeight: 1.5 }}>
                    <Icon.check width={14} height={14} style={{ color: C.sageDark, flexShrink: 0, marginTop: 2 }}/>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, ...eyebrow(C.terracotta), fontSize: 10, marginBottom: 12 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.terracotta }}/>
                What depletes you
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                {type.depletes.map((d, i) => (
                  <li key={i} style={{ ...bodyText(13), color: C.ink, display: "flex", gap: 8, lineHeight: 1.5 }}>
                    <span style={{ width: 14, height: 14, flexShrink: 0, marginTop: 5, borderTop: `1.5px solid ${C.terracotta}` }}/>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div style={{ padding: "18px 20px", borderRadius: 16, background: "rgba(255,255,255,0.55)", border: `1px solid ${type.color}33` }}>
            <div style={{ ...eyebrow(type.accent), fontSize: 10, marginBottom: 8 }}>Signature ritual</div>
            <div style={{ fontFamily: FF_DISPLAY, fontSize: 18, color: C.ink, lineHeight: 1.4, letterSpacing: "-0.01em" }}>{type.ritual}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Page ────────────────────────────────────────────────
export default function GlowTypes() {
  const navigate = useNavigate();
  const [openId, setOpenId] = useState(null);
  const [focusedId, setFocusedId] = useState(null);

  const handleCompassSelect = (id) => {
    setOpenId(id);
    setFocusedId(id);
    setTimeout(() => {
      const el = document.querySelector(`[data-type-id="${id}"]`);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 40, behavior: "smooth" });
    }, 60);
    setTimeout(() => setFocusedId(null), 2400);
  };

  return (
    <AppLayout>
      <style>{`
        .fade-up { animation: fu 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .fade-up.d1 { animation-delay: 0.06s; }
        .fade-up.d2 { animation-delay: 0.12s; }
        .fade-up.d3 { animation-delay: 0.18s; }
        .fade-up.d4 { animation-delay: 0.24s; }
        @keyframes fu { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .hover-lift { transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease; }
        .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 22px 50px -28px rgba(61,74,82,0.28); }
        @media (max-width: 768px) {
          .gt-hero-pad        { padding: 36px 24px 40px !important; }
          .gt-hero-title      { font-size: 34px !important; }
          .gt-hero-stats      { gap: 16px !important; }
          .gt-main-pad        { padding: 28px 18px 80px !important; }
          .gt-principles-grid { grid-template-columns: 1fr !important; }
          .gt-types-grid      { grid-template-columns: 1fr !important; }
          .gt-closing-pad     { padding: 36px 24px !important; }
          .gt-closing-title   { font-size: 28px !important; }
          .gt-compass-grid    { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .gt-hero-title { font-size: 28px !important; }
        }
      `}</style>

      <div className="gt-main-pad" style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 48px 96px" }}>

        {/* ── Hero ── */}
        <section className="fade-up" style={{
          position: "relative", overflow: "hidden", marginBottom: 64,
          padding: "60px 56px 64px", borderRadius: 32,
          background: "linear-gradient(135deg, rgba(107,158,127,0.16) 0%, rgba(237,226,236,0.55) 55%, rgba(245,221,208,0.40) 100%)",
          border: `1px solid rgba(107,158,127,0.10)`,
        }}>
          <div style={{ position: "absolute", width: 380, height: 380, borderRadius: "50%", background: "rgba(107,158,127,0.10)", filter: "blur(90px)", top: -150, right: -100 }}/>
          <div style={{ position: "absolute", width: 260, height: 260, borderRadius: "50%", background: "rgba(168,90,61,0.08)", filter: "blur(80px)", bottom: -100, left: 200 }}/>
          <Watermark size={360} style={{ bottom: -130, left: -30 }}/>
          <div className="gt-hero-pad" style={{ position: "relative", zIndex: 2, maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, justifyContent: "center" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.terracottaMid, boxShadow: `0 0 0 4px rgba(201,123,92,0.18)` }}/>
              <div style={{ ...eyebrow(C.sageDark) }}>Understanding your wellness</div>
            </div>
            <h1 className="gt-hero-title" style={{ ...display(64), margin: "0 0 22px", lineHeight: 1.02, letterSpacing: "-0.028em" }}>
              What's your <em style={{ fontStyle: "italic", color: C.sage }}>Glow Type</em>?
            </h1>
            <p style={{ ...bodyText(17), lineHeight: 1.8, maxWidth: 620, margin: "0 auto 32px" }}>
              Everyone has a natural rhythm for thriving. Glow Types map how <em style={{ fontFamily: FF_DISPLAY, fontStyle: "italic", fontSize: 18 }}>you</em> function — your energy needs, your pace, what depletes you, and what compounds beautifully. Six honest patterns. No hierarchy.
            </p>
            <div className="gt-hero-stats" style={{ display: "flex", gap: 28, flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
              {[{ n: "6", l: "Glow Types" }, { n: "5", l: "Check-ins to sharpen it" }, { n: "∞", l: "Ways to thrive" }].map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                  <span style={{ ...display(38), color: C.sageDark, lineHeight: 1 }}>{s.n}</span>
                  <span style={{ ...eyebrow(C.mute), fontSize: 10.5, maxWidth: 100, lineHeight: 1.4 }}>{s.l}</span>
                  {i < 2 && <span style={{ width: 1, height: 28, background: C.line, marginLeft: 18 }}/>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Principles ── */}
        <section className="fade-up d1" style={{ marginBottom: 80 }}>
          <div style={{ marginBottom: 28, maxWidth: 720 }}>
            <div style={{ ...eyebrow(C.mute), marginBottom: 10 }}>How it works</div>
            <h2 style={{ ...display(36), margin: "0 0 14px" }}>
              A type isn't a label. It's a <em style={{ fontStyle: "italic", color: C.sage }}>pattern of thriving</em>.
            </h2>
            <p style={{ ...bodyText(15), margin: 0, maxWidth: 580 }}>Three principles shape how GlowWise frames your type — so it actually helps, instead of pigeonholing you.</p>
          </div>
          <div className="gt-principles-grid" style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
            {[
              { I: Icon.bloom, color: C.sage,  bg: C.sageMint, title: "Earned from your data",  body: "Your type emerges from real check-ins — sleep, energy, mood, movement. Not a personality quiz. Patterns, not guesses." },
              { I: Icon.spark, color: C.amber, bg: C.amberBg,  title: "Practical, not poetic",  body: "Once your type is clear, you get specific practices tailored to how you thrive — never generic wellness advice you'd find anywhere." },
              { I: Icon.heart, color: C.plum,  bg: C.plumBg,   title: "Honest and unranked",    body: "No type is 'better.' These are six different shapes of thriving. Knowing yours means working with your nature, not against it." },
            ].map((it, i) => (
              <div key={i} className="fade-up hover-lift" style={{ padding: 30, borderRadius: 22, background: C.paper, border: `1px solid ${C.lineSoft}`, animationDelay: `${0.08 * i}s` }}>
                <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, borderRadius: "50%", background: it.bg, color: it.color, marginBottom: 18 }}>
                  <it.I width={22} height={22} />
                </div>
                <h3 style={{ ...display(20), margin: "0 0 10px", fontWeight: 500 }}>{it.title}</h3>
                <p style={{ ...bodyText(13.5), margin: 0, lineHeight: 1.7 }}>{it.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Compass ── */}
        <Compass onSelect={handleCompassSelect} />

        {/* ── Types Grid ── */}
        <section className="fade-up d3" id="types-grid" style={{ marginBottom: 80 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
            <div style={{ maxWidth: 620 }}>
              <div style={{ ...eyebrow(C.mute), marginBottom: 10 }}>The six types</div>
              <h2 style={{ ...display(36), margin: "0 0 14px" }}>Find yourself in these <em style={{ fontStyle: "italic", color: C.sage }}>patterns</em>.</h2>
              <p style={{ ...bodyText(15), margin: 0 }}>Tap any card to open the full type — its metaphor, peak hours, what fuels and depletes you, and the one ritual that anchors the pattern.</p>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 16px", borderRadius: 999, background: C.paperWarm, border: `1px solid ${C.lineSoft}` }}>
              <Icon.spark width={14} height={14} style={{ color: C.sageDark }}/>
              <span style={{ fontFamily: FF_UI, fontSize: 12, fontWeight: 600, color: C.body }}>{openId ? "1 type open" : "Tap any to expand"}</span>
            </div>
          </div>
          <div className="gt-types-grid" style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", alignItems: "start" }}>
            {GLOW_TYPES.map((t, i) => (
              <TypeCard key={t.id} type={t} index={i}
                isOpen={openId === t.id} isFocused={focusedId === t.id}
                onToggle={() => setOpenId(openId === t.id ? null : t.id)}
              />
            ))}
          </div>
        </section>

        {/* ── Closing CTA ── */}
        <section className="fade-up d4">
          <div className="gt-closing-pad" style={{
            position: "relative", overflow: "hidden", padding: "56px 48px",
            borderRadius: 32, textAlign: "center",
            background: "linear-gradient(135deg, rgba(107,158,127,0.14) 0%, rgba(237,226,236,0.50) 100%)",
            border: `1px solid rgba(107,158,127,0.10)`,
          }}>
            <div style={{ position: "absolute", width: 280, height: 280, borderRadius: "50%", background: "rgba(107,158,127,0.10)", filter: "blur(70px)", top: -100, right: -60 }}/>
            <Watermark size={360} style={{ bottom: -130, right: -20 }}/>
            <div style={{ position: "relative", zIndex: 2, maxWidth: 640, margin: "0 auto" }}>
              <div style={{ ...eyebrow(C.sageDark), marginBottom: 20 }}>Your type deepens with every check-in.</div>
             <h2 className="gt-closing-title" style={{ ...display(40), margin: "0 0 22px", lineHeight: 1.15 }}>
                You already have a <em style={{ fontStyle: "italic", color: C.sage }}>starting type</em>.
              </h2>
              <p style={{ ...bodyText(15.5), maxWidth: 520, margin: "0 auto 30px", lineHeight: 1.8 }}>
                Your Glow Type begins with your onboarding answers. Each gentle check-in sharpens it — and as your habits and rhythm shift, your type can evolve with you.
              </p>
              <button onClick={() => navigate('/checkin')} style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "14px 28px", borderRadius: 999,
                background: C.sage, color: C.paper, border: "none", cursor: "pointer",
                fontFamily: FF_UI, fontSize: 14, fontWeight: 600,
                boxShadow: "0 10px 24px -12px rgba(107,158,127,0.55)",
              }}>
                <Icon.plus width={14} height={14} /> Begin today
              </button>
            </div>
          </div>
        </section>

      </div>
    </AppLayout>
  );
}
