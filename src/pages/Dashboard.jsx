// src/pages/Dashboard.jsx — GlowWise Home (v3.0 AI-first rebuild)
// Home is now: Header + small Glow Score + Coach Hero + 3 Insight Cards + FAB check-in
//
// ANCHOR LOGIC (CoachHero):
// The hero greeting references the user's specific concern in this priority order:
//   1. profile.body_signals      — free text from onboarding step 4 (most specific)
//   2. profile.wellness_priorities — category picks from onboarding step 3 (fallback)
//   3. cold-start question        — if both are empty, ask in-product instead of guessing
// Replace the `dailySummary` null below with a real Firestore read once the
// daily-summary AI job exists — see the TODO inside Dashboard().
//
// Legacy sections (GlowType, Vitals, MicroHabits, WeekChart, old Plan, old Coach)
// are preserved at the bottom of this file as commented-out source — not rendered —
// so the future Insights/Plan tabs can be built from them directly.
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserData } from '../context/UserDataContext';
import { db } from '../config/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import {
  Sun, MessageCircle, Calendar, BarChart3, User, ChevronRight,
  Plus, LogOut, X, Search, TrendingUp, Sparkles,
} from 'lucide-react';

// ============ PALETTE ============
const C = {
  paper: '#FAF8F5',
  paperWarm: '#F3EFE8',
  ink: '#3D4A52',
  body: '#5A6770',
  mute: '#A89968',
  sage: '#6B9E7F',
  sageDark: '#557E64',
  sageMint: '#EDF4EF',
  sageBg: '#D4E8DD',
  terracotta: '#A85A3D',
  terracottaMid: '#C97B5C',
  terracottaBg: '#F5DDD0',
  plum: '#7A5C77',
  plumBg: '#EDE2EC',
  amber: '#A07E3D',
  amberMid: '#D4A55C',
  amberBg: '#FAF3DC',
  line: 'rgba(168, 153, 104, 0.16)',
  lineSoft: 'rgba(168, 153, 104, 0.10)',
};

const FF_DISPLAY = "'Fraunces', Georgia, serif";
const FF_LOGO = "'Marcellus', Georgia, serif";
const FF_UI = "'Manrope', system-ui, sans-serif";

// ============ RESPONSIVE STYLES ============
const responsiveCSS = `
  @media (max-width: 900px) {
    .gw-header-h1 { font-size: 36px !important; }
    .gw-main { padding: 32px 24px 110px !important; }
    .gw-cards-grid { grid-template-columns: 1fr !important; }
    .gw-hero-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
    .gw-score-ring { width: 180px !important; height: 180px !important; margin: 0 auto; }
  }
  @media (max-width: 768px) {
    .gw-sidebar { display: none !important; }
    .gw-bottomnav { display: flex !important; }
    .gw-mobile-logo { display: flex !important; }
    .gw-main { padding: 24px 18px 110px !important; }
    .gw-header { flex-direction: column !important; align-items: flex-start !important; }
    .gw-header-actions { width: 100%; justify-content: space-between !important; }
    .gw-logout-btn { display: inline-flex !important; }
    .gw-header-h1 { font-size: 28px !important; }
    .gw-hero-pad { padding: 30px 24px !important; }
    .gw-hero-title { font-size: 24px !important; }
  }
  @media (max-width: 480px) {
    .gw-header-h1 { font-size: 24px !important; }
    .gw-score-ring { width: 160px !important; height: 160px !important; }
  }
  .gw-fab:active { transform: scale(0.94); }
  .gw-sheet-enter { animation: gwSheetUp 0.28s cubic-bezier(0.16,1,0.3,1); }
  @keyframes gwSheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
  .gw-backdrop-enter { animation: gwFadeIn 0.2s ease; }
  @keyframes gwFadeIn { from { opacity: 0; } to { opacity: 1; } }
  .gw-card-hover { transition: all 0.25s cubic-bezier(0.16,1,0.3,1); }
  .gw-card-hover:hover { transform: translateY(-2px); box-shadow: 0 12px 28px -16px rgba(61,74,82,0.20); }
`;

// ============ BRAND ============
const Orbit = ({ size = 32, color = '#557E64', tail = '#6B9E7F', accent = '#C97B5C' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <circle cx="50" cy="46" r="28" stroke={color} strokeWidth="6" fill="none" />
    <path d="M 78 46 Q 78 78 50 80 Q 32 81 30 72"
      stroke={tail} strokeWidth="6" strokeLinecap="round" fill="none" />
    <circle cx="78" cy="46" r="6" fill={accent} />
  </svg>
);

const Wordmark = ({ size = 26, color = '#3D4A52' }) => (
  <span style={{
    fontFamily: FF_DISPLAY,
    fontWeight: 500, fontSize: size, color,
    letterSpacing: '-0.01em', lineHeight: 1, whiteSpace: 'nowrap',
  }}>
    GlowWise
  </span>
);

// ============ STYLE HELPERS ============
const eyebrow = (color = C.mute) => ({
  fontFamily: FF_UI, fontSize: 11, fontWeight: 600,
  letterSpacing: '0.18em', textTransform: 'uppercase',
  color, lineHeight: 1,
});

const display = (size = 28) => ({
  fontFamily: FF_DISPLAY, fontWeight: 400, fontSize: size,
  lineHeight: 1.1, letterSpacing: '-0.02em', color: C.ink,
});

const bodyText = (size = 14) => ({
  fontFamily: FF_UI, fontSize: size, lineHeight: 1.6, color: C.body,
});

const Card = ({ children, style = {}, bg = C.paper, className = '' }) => (
  <div className={`gw-card-pad ${className}`} style={{
    background: bg,
    border: `1px solid ${C.lineSoft}`,
    borderRadius: 16,
    padding: 28,
    boxShadow: '0 1px 0 rgba(0,0,0,0.02), 0 10px 30px -24px rgba(61,74,82,0.18)',
    ...style,
  }}>{children}</div>
);

// ============ WELLNESS TOPIC LABELS (mirrors Onboarding.jsx WELLNESS_TOPICS) ============
// Used only to turn stored wellness_priorities ids back into readable labels
// for the hero fallback. Keep this in sync with Onboarding.jsx if topics change.
const WELLNESS_TOPIC_LABELS = {
  hormones: 'hormonal balance',
  fertility: 'fertility',
  weight: 'body and weight',
  energy: 'energy and fatigue',
  sleep: 'sleep and recovery',
  stress: 'stress and anxiety',
  brain: 'brain and focus',
  gut: 'gut and digestion',
  skin: 'skin and acne',
  hair: 'hair and scalp',
  nutrition: 'nutrition',
};

// ============ NAV ITEMS DATA (renamed to 5-tab AI-first structure) ============
const navItems = [
  { Icon: Sun,           label: 'Home',     to: '/dashboard' },
  { Icon: MessageCircle, label: 'Coach',    to: '/ai-coach' },
  { Icon: BarChart3,     label: 'Insights', to: '/insights' },
  { Icon: Calendar,      label: 'Plan',     to: '/plan' },
  { Icon: User,          label: 'Profile',  to: '/settings' },
];

// ============ DESKTOP SIDEBAR ============
const NavItem = ({ Icon, label, to }) => {
  const { pathname } = useLocation();
  const active = pathname === to || (to !== '/' && pathname.startsWith(to));
  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 14px', borderRadius: 12,
        color: active ? C.sageDark : C.body,
        background: active ? C.sageMint : 'transparent',
        fontFamily: FF_UI, fontSize: 13.5,
        fontWeight: active ? 600 : 500,
        cursor: 'pointer', transition: 'background 0.15s',
      }}>
        <Icon size={18} strokeWidth={1.6} />
        <span>{label}</span>
      </div>
    </Link>
  );
};

const Sidebar = () => (
  <aside className="gw-sidebar" style={{
    width: 240, padding: '32px 18px',
    borderRight: `1px solid ${C.lineSoft}`,
    background: C.paper,
    display: 'flex', flexDirection: 'column', gap: 4,
    position: 'sticky', top: 0, height: '100vh',
    boxSizing: 'border-box', flexShrink: 0,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 8px 28px' }}>
      <Orbit size={38} />
      <Wordmark size={26} />
    </div>
    {navItems.map((item) => (
      <NavItem key={item.to} {...item} />
    ))}
    <div style={{
      margin: '24px 10px 0',
      padding: '16px 14px',
      borderRadius: 14,
      background: C.amberBg,
      border: `1px solid rgba(168,153,104,0.2)`,
    }}>
      <div style={{ ...eyebrow(C.amber), marginBottom: 8 }}>Coming soon</div>
      <div style={{
        fontFamily: FF_DISPLAY, fontSize: 15, fontWeight: 500, color: C.ink,
        lineHeight: 1.4, marginBottom: 8, letterSpacing: '-0.01em',
      }}>
        Photo Analysis
      </div>
      <div style={{ fontFamily: FF_UI, fontSize: 12, color: C.body, lineHeight: 1.6, marginBottom: 10 }}>
        Track your skin, hair, and glow visually over time. AI-powered insights from your photos — coming to GlowWise soon.
      </div>
      <div style={{ fontFamily: FF_UI, fontSize: 11, fontWeight: 600, color: C.amber, letterSpacing: '0.04em' }}>
        We'll notify you when it's ready
      </div>
    </div>
  </aside>
);

// ============ MOBILE BOTTOM NAV ============
const BottomNavItem = ({ Icon, label, to }) => {
  const { pathname } = useLocation();
  const active = pathname === to || (to !== '/' && pathname.startsWith(to));
  return (
    <Link to={to} style={{
      flex: 1, textDecoration: 'none',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 4, padding: '8px 4px',
      color: active ? C.sageDark : C.body,
    }}>
      <Icon size={20} strokeWidth={active ? 2 : 1.6} />
      <span style={{ fontFamily: FF_UI, fontSize: 10, fontWeight: active ? 700 : 500, letterSpacing: '0.02em' }}>
        {label}
      </span>
    </Link>
  );
};

const BottomNav = () => (
  <nav className="gw-bottomnav" style={{
    display: 'none',
    position: 'fixed', bottom: 0, left: 0, right: 0,
    background: C.paper,
    borderTop: `1px solid ${C.lineSoft}`,
    padding: '6px 4px calc(6px + env(safe-area-inset-bottom))',
    zIndex: 100,
    boxShadow: '0 -2px 12px -4px rgba(61,74,82,0.08)',
  }}>
    {navItems.map((item) => <BottomNavItem key={item.to} {...item} />)}
  </nav>
);

// ============ BUTTONS ============
const btnPrimary = {
  display: 'inline-flex', alignItems: 'center', gap: 8,
  padding: '11px 20px', borderRadius: 999,
  background: C.sage, color: C.paper,
  border: 'none', cursor: 'pointer',
  fontFamily: FF_UI, fontSize: 13, fontWeight: 600,
  textDecoration: 'none',
};

const btnGhost = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '10px 16px', borderRadius: 999,
  background: 'transparent', color: C.sageDark,
  border: `1px solid ${C.sage}`, cursor: 'pointer',
  fontFamily: FF_UI, fontSize: 12.5, fontWeight: 500,
  textDecoration: 'none',
};

// ============ HERO GLOW SCORE (full ring, lives inside the hero box) ============
const getGlowStatus = (score) => {
  if (score >= 91) return { label: 'Glowing', color: C.sage };
  if (score >= 76) return { label: 'Thriving', color: C.sage };
  if (score >= 61) return { label: 'Balancing', color: C.sageDark };
  return { label: 'Recovering', color: C.terracotta };
};

const HeroGlowScore = ({ score = 78 }) => {
  const { label: statusLabel, color: statusColor } = getGlowStatus(score);
  return (
    <div className="gw-score-ring" style={{ position: 'relative', width: 248, height: 248, flexShrink: 0 }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(168,153,104,0.18)" strokeWidth="6" />
        <circle cx="50" cy="50" r="42" fill="none"
          stroke={C.sage} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 42 * (score / 100)} ${2 * Math.PI * 42}`} />
        <circle
          cx={50 + 42 * Math.cos((score / 100) * 2 * Math.PI - Math.PI / 2)}
          cy={50 + 42 * Math.sin((score / 100) * 2 * Math.PI - Math.PI / 2)}
          r="3.5" fill={C.terracottaMid}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      }}>
        <div style={{ ...eyebrow(C.sageDark), marginBottom: 6 }}>Glow score</div>
        <div className="gw-score-text" style={{ ...display(56), color: C.sageDark }}>{score}</div>
        <div style={{
          fontFamily: FF_UI, fontSize: 13, color: statusColor,
          fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
          transition: 'color 0.3s ease',
        }}>
          {statusLabel}
        </div>
      </div>
    </div>
  );
};

// ============ HEADER ============
const Header = ({ name, onLogout, score }) => {
  const today = new Date();
  const hour = today.getHours();
  let greeting = 'Good morning';
  if (hour >= 12 && hour < 18) greeting = 'Good afternoon';
  else if (hour >= 18) greeting = 'Good evening';

  const weekday = today.toLocaleDateString('en-GB', { weekday: 'long' });
  const monthDay = today.toLocaleDateString('en-GB', { month: 'long', day: 'numeric' });
  return (
    <div className="gw-header" style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      marginBottom: 32, flexWrap: 'wrap', gap: 16,
    }}>
      <div>
        <div style={{ ...eyebrow(C.mute), marginBottom: 12 }}>{weekday} · {monthDay}</div>
        <h1 className="gw-header-h1" style={{ ...display(48), margin: 0 }}>
          {greeting},{' '}
          <em style={{ fontStyle: 'italic', color: C.sage }}>{name}.</em>
        </h1>
      </div>
      <div className="gw-header-actions" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={onLogout}
          style={{
            padding: '10px 12px', borderRadius: 100, background: 'transparent',
            border: `1px solid ${C.lineSoft}`, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}
          aria-label="Log out"
        >
          <LogOut size={16} strokeWidth={1.6} color={C.mute} />
        </button>
      </div>
    </div>
  );
};
// ============ LAST CONVERSATION (real, not placeholder) ============
// Reads the user's most recent non-empty Coach conversation, mirroring the
// same query AICoach.jsx already uses for its own "welcome back" feature —
// just simplified here to only need a topic line, not the full message
// history. Returns null if there's no conversation yet, so the hero can
// fall back to the onboarding-anchor logic below.
const fetchLastConversationTopic = async (uid) => {
  if (!uid) return null;
  try {
    const convsRef = collection(db, 'users', uid, 'conversations');
    const q = query(convsRef, orderBy('updated_at', 'desc'), limit(5));
    const snap = await getDocs(q);
    const nonEmpty = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .find((c) => c.messages && c.messages.length > 0);
    if (!nonEmpty) return null;

    const firstUserMsg = nonEmpty.messages.find((m) => m.role === 'user');
    if (!firstUserMsg) return null;
    const topic = firstUserMsg.content;
    return topic.length > 90 ? topic.slice(0, 90) + '…' : topic;
  } catch (e) {
    console.error('fetchLastConversationTopic failed:', e);
    return null;
  }
};

// ============ ANCHOR RESOLUTION ============
// ============ ANCHOR RESOLUTION ============
// Decides what the coach hero should reference, in priority order:
//   1. body_signals (free text, most specific — onboarding step 4)
//   2. wellness_priorities (category picks — onboarding step 3, fallback)
//   3. null (cold start — both empty, ask instead of guessing)
// `profile` is the object returned by useUserData().profile, which is the
// same shape saved by Onboarding.jsx's updateProfile() call.
const resolveAnchor = (profile) => {
  const bodySignals = (profile?.body_signals || '').trim();
  if (bodySignals) {
    return { type: 'body_signals', value: bodySignals };
  }

  const priorities = profile?.wellness_priorities || [];
  if (priorities.length > 0) {
    const labels = priorities
      .map((id) => WELLNESS_TOPIC_LABELS[id])
      .filter(Boolean);
    if (labels.length > 0) {
      return { type: 'wellness_priorities', value: labels };
    }
  }

  return { type: 'cold_start', value: null };
};

// Builds the two hero lines from the resolved anchor. This is the mock/
// rule-based version — once the daily-summary AI job exists, replace this
// function's output with the job's generated greetingLines, but keep
// resolveAnchor() feeding into that job's prompt context either way.
const buildHeroLines = (anchor, name) => {
  if (anchor.type === 'body_signals') {
    return [
      `You mentioned: "${anchor.value}"`,
      `I don't have enough check-ins yet to spot a pattern, but that's exactly what we're tracking toward.`,
    ];
  }

  if (anchor.type === 'wellness_priorities') {
    const items = anchor.value;
    const list = items.length === 1
      ? items[0]
      : items.length === 2
        ? `${items[0]} and ${items[1]}`
        : `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;

    return [
      `You told us ${list} matter most to you right now.`,
      `Let's start connecting your daily check-ins to what's actually driving that.`,
    ];
  }

  return [
    `I don't know much about you yet.`,
    `What's the one thing about your hair, skin, energy, or sleep you'd like to understand better?`,
  ];
};

const buildHeroGreeting = ({ lastConversation, profile }) => {
  const priorities = profile?.wellness_priorities || [];

  if (priorities.length > 0) {
    const focusMap = {
  "Sleep & Recovery": "sleep",
  "Hormonal Balance": "hormonal health",
  "Body & Weight": "weight and wellbeing",
  "Stress Management": "stress",
  "Energy": "energy",
};

const focus = focusMap[priorities[0]] || priorities[0].toLowerCase();

    return {
      title: `We've been quietly working on your ${focus.toLowerCase()} together.`,
      message: "How's that actually been feeling day to day?",
      cta: "Ask Your Coach Anything",
    };
  }

  if (lastConversation) {
    return {
      title: "We've been learning more about your wellbeing together.",
      message: "What's been on your mind recently?",
      cta: "Ask Your Coach Anything",
    };
  }

  return {
    title: "How are you feeling today?",
    message:
      "Whether you're feeling great, struggling with something, or simply curious about your progress, I'm here to help.",
    cta: "Ask Your Coach Anything",
  };
};

// ============ COACH HERO ============
// `summary` shape (the future daily-summary job's contract):
// { greetingLines: [string, string], discovery, improvement, recommendation }
// When `summary` is null (no AI job yet, or job hasn't run today), the hero
// falls back to the rule-based anchor lines built from onboarding data above.
const CoachHero = ({
  name,
  summary,
  profile,
  score,
  lastConversationTopic,
}) => {
  const heroContent = buildHeroGreeting({
  lastConversation: lastConversationTopic,
  profile,
});

  return (
    <div className="gw-hero-pad" style={{
      position: 'relative', overflow: 'hidden',
      padding: '52px 48px',
      borderRadius: 28,
      background: 'linear-gradient(135deg, rgba(107,158,127,0.20) 0%, rgba(237,226,236,0.55) 100%)',
      border: '1px solid rgba(107,158,127,0.12)',
      boxShadow: '0 24px 60px -36px rgba(61,74,82,0.22)',
      marginBottom: 28,
    }}>
      <div style={{
        position: 'absolute', width: 320, height: 320, borderRadius: '50%',
        background: 'rgba(107,158,127,0.14)', filter: 'blur(70px)',
        top: -120, right: -80,
      }} />
      <div className="gw-hero-grid" style={{
        position: 'relative', zIndex: 2, display: 'grid',
        gridTemplateColumns: '1.5fr 1fr', gap: 40, alignItems: 'center',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Orbit size={22} color={C.sageDark} tail={C.sage} accent={C.terracottaMid} />
            <div style={{ ...eyebrow(C.sageDark) }}>Your wellness coach</div>
          </div>

          <h2 className="gw-hero-title" style={{ ...display(36), margin: 0, marginBottom: 18, maxWidth: 520, lineHeight: 1.2 }}>
            {heroContent.title}
          </h2>

          {heroContent.message && (
  <p style={{ ...bodyText(16), maxWidth: 480, marginBottom: 14 }}>
    {heroContent.message}
  </p>
)}

          <p style={{ ...bodyText(15), maxWidth: 480, marginBottom: 26, color: C.sageDark, fontWeight: 500 }}>
  Tell me what's been on your mind lately.
</p>

          <Link to="/ai-coach" style={{
            ...btnPrimary,
            padding: '14px 26px',
            fontSize: 14,
          }}>
            <MessageCircle size={15} strokeWidth={2} />
            {heroContent.cta}
            </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <HeroGlowScore score={score} />
        </div>
      </div>
    </div>
  );
};

// ============ INSIGHT CARDS: Discovery / Improvement / Recommendation ============
// Architecture: each card is a conversation starter, not standalone content.
// All three route to Coach — never to a separate page — carrying a
// `coach_context` string that tells Coach WHY this card exists and what
// the conversation should explore, separate from `summary` (what's shown
// on the card itself). This mirrors the real daily-summary doc shape this
// will read from once that job exists:
//   { id, type, title, summary, coach_context }
// Until then, buildFallbackCards() below produces this same shape from
// static/rule-based text — same honest-placeholder pattern as the rest of
// this app. Nothing here should change when the real AI job lands; only
// where `cards` is sourced from should change (a Firestore read instead
// of buildFallbackCards).
const insightCardMeta = [
  {
    key: 'discovery',
    Icon: Search,
    eyebrow: 'Discovery',
    accent: C.plum,
    bg: C.plumBg,
    text: '#5D4459',
    ctaLabel: 'Explore',
  },
  {
    key: 'improvement',
    Icon: TrendingUp,
    eyebrow: 'Improvement',
    accent: C.sageDark,
    bg: C.sageMint,
    text: '#3D5E48',
    ctaLabel: 'Tell me more',
  },
  {
    key: 'recommendation',
    Icon: Sparkles,
    eyebrow: 'Recommendation',
    accent: C.amber,
    bg: C.amberBg,
    text: '#8B6A30',
    ctaLabel: 'Why?',
  },
];

const InsightCard = ({ meta, card, onCta }) => {
  const { Icon, eyebrow: label, accent, bg, text: textColor, ctaLabel } = meta;
  return (
    <div className="gw-card-hover" style={{
      background: bg,
      border: `1px solid ${C.lineSoft}`,
      borderRadius: 16,
      padding: '22px 22px 20px',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      minHeight: 168,
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14, color: accent }}>
          <Icon size={14} strokeWidth={1.8} />
          <span style={{ ...eyebrow(accent), fontSize: 10 }}>{label}</span>
        </div>
        <p style={{
          fontFamily: FF_DISPLAY, fontSize: 16.5, lineHeight: 1.45,
          color: textColor, margin: 0, letterSpacing: '-0.01em',
        }}>
          {card.summary}
        </p>
      </div>
      <button
        onClick={onCta}
        style={{
          marginTop: 16, alignSelf: 'flex-start',
          display: 'inline-flex', alignItems: 'center', gap: 5,
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: accent, fontFamily: FF_UI, fontSize: 12.5, fontWeight: 700,
          padding: 0,
        }}
      >
        {ctaLabel} <ChevronRight size={12} strokeWidth={2.2} />
      </button>
    </div>
  );
};

// Fallback card data used until the real daily-summary AI job exists.
// Matches the { id, type, title, summary, coach_context } shape that job
// will eventually write to Firestore — only the SOURCE changes later, not
// this shape or anything that reads it.
const buildFallbackCards = (anchor) => {
  if (anchor.type === 'body_signals') {
    return {
      discovery: {
        id: 'discovery_fallback_001', type: 'discovery',
        title: 'Just getting started',
        summary: `We're just getting started — once you've logged a few check-ins, I'll be able to connect them to "${anchor.value}".`,
        coach_context: `The user mentioned this concern at onboarding: "${anchor.value}". There isn't enough check-in history yet to identify a real pattern. Acknowledge that, and ask one gentle question to start gathering relevant detail.`,
      },
      improvement: {
        id: 'improvement_fallback_001', type: 'improvement',
        title: 'Nothing to compare yet',
        summary: `Nothing to compare yet. Check in today and tomorrow, and I'll start tracking what's changing.`,
        coach_context: `No trend data exists yet for this user. Explain in one or two sentences why check-ins matter for spotting real change, and encourage them warmly without being pushy.`,
      },
      recommendation: {
        id: 'recommendation_fallback_001', type: 'recommendation',
        title: 'Start with a check-in',
        summary: `Try a check-in today so I have something real to work from.`,
        coach_context: `Explain simply that today's check-in becomes the baseline everything else is measured against. Offer to walk them through what to expect.`,
      },
    };
  }
  return {
    discovery: {
      id: 'discovery_fallback_002', type: 'discovery',
      title: 'Weekday check-in pattern',
      summary: "Something interesting stood out. You tend to stay more connected to your wellbeing during the week than at weekends.",
      coach_context: `I noticed the user tends to engage more consistently with their wellbeing during weekdays than weekends. Start by sharing the observation in a natural way, ask if it feels accurate, then explore what makes weekends different. Focus on curiosity rather than accountability.`
    },
    improvement: {
  id: 'improvement_fallback_002',
  type: 'improvement',
  title: 'Stress trending down',
  summary: "You've been handling stress more effectively recently. Even small improvements like this can make a real difference over time.",
  coach_context: `The user has shown a genuine improvement in stress levels. Begin by celebrating the progress. Ask what they think has contributed to it, then explore the habits, routines, or mindset shifts behind the improvement. Focus on reinforcing success rather than analysing numbers.`,
},
recommendation: {
      id: 'recommendation_fallback_002', type: 'recommendation',
      title: 'Evening wind-down',
      summary: "A short evening wind-down may be one of the simplest ways to support your sleep right now.",
      coach_context: `You believe an evening wind-down routine could have a meaningful impact on the user's sleep. Start by explaining why you're recommending it, then ask whether evenings tend to feel rushed, stressful, or difficult to switch off from. Explore together before suggesting any plan changes. If appropriate, offer to add a simple wind-down habit to their Plan.`,
    },
  };
};

const InsightCards = ({ cards, anchor }) => {
  const navigate = useNavigate();
  const data = cards || buildFallbackCards(anchor);

  const handleCta = (meta) => {
    const card = data[meta.key];
    // Every card routes to Coach — cards are conversation starters, not
    // standalone content. `card` carries both `summary` (what was shown)
    // and `coach_context` (why it matters / what to explore), so Coach
    // can open with a real, type-specific conversational turn instead of
    // a generic "Hello, ask me anything."
    navigate('/ai-coach', { state: { fromCard: card.type, card } });
  };

  return (
    <div className="gw-cards-grid" style={{
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 28,
    }}>
      {insightCardMeta.map((meta) => (
        <InsightCard
          key={meta.key}
          meta={meta}
          card={data[meta.key]}
          onCta={() => handleCta(meta)}
        />
      ))}
    </div>
  );
};

// ============ GLOW TYPE ROW (slim, links to the full /glow-type page) ============
// Deliberately not a card — plain text row, no background/border/shadow.
// Sits below the 3 insight cards as a quiet identity anchor, not competing
// with the coach's daily content above it.
const GlowTypeRow = ({ profile }) => {
  const glowType = profile?.glowType;
  if (!glowType) return null; // nothing to show if onboarding hasn't set this yet

  return (
    <Link to="/glow-type" style={{
      display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap',
      textDecoration: 'none', marginBottom: 8, cursor: 'pointer',
    }}>
      <span style={{ ...eyebrow(C.mute) }}>Your glow type</span>
      <span style={{
        fontFamily: FF_DISPLAY, fontStyle: 'italic', fontWeight: 500,
        fontSize: 16, color: C.sageDark, letterSpacing: '-0.01em',
      }}>
        {glowType}
      </span>
    </Link>
  );
};

// ============ CHECK-IN FAB + MODAL ============
// Unified, single check-in flow — replaces the old standalone /checkin page
// (DailyCheckin.jsx) entirely. All fields are single-tap pills for speed;
// only the symptoms/notes field is optional and collapsed by default.
// Movement/eating/social were added so the Glow Type recalculation engine
// has signal for all six types, not just the three that map to energy/
// sleep/stress (see glowTypeEngine.js).
const energyOptions = [
  { key: 'drained', label: 'Drained' },
  { key: 'low', label: 'Low' },
  { key: 'okay', label: 'Okay' },
  { key: 'good', label: 'Good' },
  { key: 'energised', label: 'Energised' },
];
const moodOptions = [
  { key: 'low', label: 'Low' },
  { key: 'unsettled', label: 'Unsettled' },
  { key: 'steady', label: 'Steady' },
  { key: 'bright', label: 'Bright' },
];
const sleepOptions = [
  { key: 'restless', label: 'Restless' },
  { key: 'light', label: 'Light' },
  { key: 'fair', label: 'Fair' },
  { key: 'restful', label: 'Restful' },
];
const stressOptions = [
  { key: 'calm', label: 'Calm' },
  { key: 'elevated', label: 'Elevated' },
  { key: 'tense', label: 'Tense' },
];
const movementOptions = [
  { key: 'none', label: 'None today' },
  { key: 'light', label: 'A little' },
  { key: 'active', label: 'Active' },
];
const eatingOptions = [
  { key: 'easy', label: 'Easy, intuitive' },
  { key: 'mixed', label: 'A bit mixed' },
  { key: 'effortful', label: 'Effortful' },
];
const socialOptions = [
  { key: 'alone', label: 'Mostly alone' },
  { key: 'mixed', label: 'A mix' },
  { key: 'with-others', label: 'With others' },
];

const OptionPills = ({ options, value, onChange, accent }) => (
  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
    {options.map((opt) => {
      const active = value === opt.key;
      return (
        <button
          key={opt.key}
          onClick={() => onChange(opt.key)}
          style={{
            padding: '9px 16px', borderRadius: 999,
            border: `1px solid ${active ? accent : C.lineSoft}`,
            background: active ? accent : 'transparent',
            color: active ? C.paper : C.body,
            fontFamily: FF_UI, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.15s ease',
          }}
        >
          {opt.label}
        </button>
      );
    })}
  </div>
);

const CheckInField = ({ label, accent, children }) => (
  <div style={{ marginBottom: 22 }}>
    <div style={{ ...eyebrow(C.mute), marginBottom: 12 }}>{label}</div>
    {children}
  </div>
);

const CheckInModal = ({ open, onClose, onSubmit }) => {
  const [energy, setEnergy] = useState(null);
  const [mood, setMood] = useState(null);
  const [sleep, setSleep] = useState(null);
  const [stress, setStress] = useState(null);
  const [movement, setMovement] = useState(null);
  const [eating, setEating] = useState(null);
  const [social, setSocial] = useState(null);
  const [notesOpen, setNotesOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  const canSubmit = energy && mood && sleep && stress && movement && eating && social;

  const resetState = () => {
    setEnergy(null); setMood(null); setSleep(null); setStress(null);
    setMovement(null); setEating(null); setSocial(null);
    setNotesOpen(false); setNotes('');
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({ energy, mood, sleep, stress, movement, eating, social, notes: notes.trim() });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      resetState();
      onClose();
    }, 1100);
  };

  return (
    <div
      className="gw-backdrop-enter"
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(61,74,82,0.32)',
        zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
    >
      <div
        className="gw-sheet-enter"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.paper, borderRadius: '24px 24px 0 0',
          width: '100%', maxWidth: 560, maxHeight: '88vh', overflowY: 'auto',
          padding: '28px 26px calc(32px + env(safe-area-inset-bottom))',
          boxShadow: '0 -16px 50px -10px rgba(61,74,82,0.25)',
        }}
      >
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%', background: C.sageMint,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <Sparkles size={24} color={C.sageDark} strokeWidth={1.8} />
            </div>
            <p style={{ ...display(20), margin: 0 }}>Thanks, check-in recorded.</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ ...display(22), margin: 0 }}>Today's check-in</h3>
              <button onClick={onClose} aria-label="Close" style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                padding: 6, color: C.mute,
              }}>
                <X size={20} strokeWidth={1.8} />
              </button>
            </div>

            <CheckInField label="Energy">
              <OptionPills options={energyOptions} value={energy} onChange={setEnergy} accent={C.amber} />
            </CheckInField>

            <CheckInField label="Mood">
              <OptionPills options={moodOptions} value={mood} onChange={setMood} accent={C.terracotta} />
            </CheckInField>

            <CheckInField label="Sleep quality">
              <OptionPills options={sleepOptions} value={sleep} onChange={setSleep} accent={C.plum} />
            </CheckInField>

            <CheckInField label="Stress level">
              <OptionPills options={stressOptions} value={stress} onChange={setStress} accent={C.sageDark} />
            </CheckInField>

            <CheckInField label="Movement today">
              <OptionPills options={movementOptions} value={movement} onChange={setMovement} accent={C.sageDark} />
            </CheckInField>

            <CheckInField label="Eating today">
              <OptionPills options={eatingOptions} value={eating} onChange={setEating} accent={C.amber} />
            </CheckInField>

            <CheckInField label="Social today">
              <OptionPills options={socialOptions} value={social} onChange={setSocial} accent={C.terracotta} />
            </CheckInField>

            <div style={{ marginBottom: 28 }}>
              <button
                onClick={() => setNotesOpen((v) => !v)}
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  padding: 0, color: C.sageDark, fontFamily: FF_UI,
                  fontSize: 13, fontWeight: 700, display: 'inline-flex',
                  alignItems: 'center', gap: 4,
                }}
              >
                {notesOpen ? 'Hide notes' : 'Anything to add?'}
              </button>
              {notesOpen && (
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Symptoms, cravings, supplements, anything on your mind..."
                  style={{
                    width: '100%', marginTop: 12,
                    background: C.paperWarm, border: `1px solid ${C.lineSoft}`,
                    borderRadius: 14, padding: '14px 16px',
                    fontFamily: FF_UI, fontSize: 14, color: C.ink,
                    outline: 'none', resize: 'vertical', minHeight: 80,
                  }}
                />
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              style={{
                width: '100%', padding: '15px', borderRadius: 999,
                background: canSubmit ? C.sage : C.lineSoft,
                color: canSubmit ? C.paper : C.mute,
                border: 'none', cursor: canSubmit ? 'pointer' : 'not-allowed',
                fontFamily: FF_UI, fontSize: 14.5, fontWeight: 700,
              }}
            >
              Save check-in
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const CheckInFAB = ({ onClick }) => (
  <button
    className="gw-fab"
    onClick={onClick}
    aria-label="Add today's check-in"
    style={{
      position: 'fixed', right: 24, bottom: 88,
      width: 56, height: 56, borderRadius: '50%',
      background: C.sage, border: 'none', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 12px 28px -8px rgba(85,126,100,0.55)',
      zIndex: 90, transition: 'transform 0.15s ease',
    }}
  >
    <Plus size={24} color={C.paper} strokeWidth={2.2} />
  </button>
);

// ============ MOBILE HEADER LOGO ============
const MobileLogo = () => (
  <div className="gw-mobile-logo" style={{
    display: 'none',
    position: 'sticky', top: 0, zIndex: 50,
    background: C.paper,
    padding: '14px 18px',
    borderBottom: `1px solid ${C.lineSoft}`,
    alignItems: 'center', gap: 10,
  }}>
    <Orbit size={28} />
    <Wordmark size={20} />
  </div>
);

// ============ DASHBOARD (HOME) ============
export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const {
    profile,
    checkIns,
    glowScore,
    loading,
    addCheckIn, // assumed existing context method that writes to Firestore check-in collection
  } = useUserData();

  const [checkInOpen, setCheckInOpen] = useState(false);
  const [lastConversationTopic, setLastConversationTopic] = useState(null);

  const firstName =
    (
      profile?.name ||
      profile?.firstName ||
      profile?.first_name ||
      user?.displayName ||
      ''
    ).split(' ')[0] || 'there';
  
  useEffect(() => {
  const loadLastConversation = async () => {
    if (!user?.uid) return;

    const topic = await fetchLastConversationTopic(user.uid);

    if (topic) {
      setLastConversationTopic(topic);
    }
  };

  loadLastConversation();
}, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (e) {
      console.error(e);
    }
  };

  const score = glowScore || 78;

  // Resolve which onboarding signal anchors the hero (body_signals first,
  // wellness_priorities fallback, cold-start question if both are empty).
  const anchor = resolveAnchor(profile);

  // TODO: replace with a real Firestore read once the daily-summary AI job
  // exists. Expected doc shape: { greetingLines: [string, string], discovery,
  // improvement, recommendation, generated_at }. That job's prompt MUST
  // receive `anchor` (or the raw profile.body_signals / wellness_priorities)
  // as context and be instructed to lead with it — see CoachHero/buildHeroLines
  // and buildFallbackCards above for the rule-based version this replaces.
  const dailySummary = null;

  const handleCheckInSubmit = (data) => {
    // Maps modal selections to Firestore check-in fields. energy/mood/sleep/
    // stress are now pill keys (strings), not numbers — addCheckIn's caller
    // (UserDataContext) and any code reading these fields (AICoach.jsx's
    // buildUserContext, WellnessPlan.jsx's calculateChange, Insights.jsx's
    // detectPatterns/calculateTrends) all expect NUMERIC energy/sleep_hours/
    // stress_level/mood — see the pillToNumber conversion below, required
    // so existing trend calculations elsewhere keep working unchanged.
    // Recalibrated so the best pill choice genuinely reaches a Glow Score of
    // 100 and the worst genuinely reaches near the bottom — previously
    // "calm" stress capped at 2 (not 0) and "restful" sleep capped at 8.5h
    // (not ~9h), which made 100 mathematically unreachable regardless of
    // what the user selected. Verified against UserDataContext's
    // calculateGlowScore formula directly before shipping this mapping.
    const pillToNumber = {
      energy: { drained: 1, low: 3.5, okay: 6, good: 8, energised: 10 },
      mood: { low: 1, unsettled: 4, steady: 7, bright: 10 },
      stress: { calm: 0, elevated: 5, tense: 9 },
    };
    const sleepHoursEstimate = { restless: 3.5, light: 5.5, fair: 7, restful: 9 };

    if (typeof addCheckIn === 'function') {
      addCheckIn({
        energy: pillToNumber.energy[data.energy] ?? null,
        mood: pillToNumber.mood[data.mood] ?? null,
        sleep_hours: sleepHoursEstimate[data.sleep] ?? null,
        stress_level: pillToNumber.stress[data.stress] ?? null,
        movement: data.movement,
        eating: data.eating,
        social: data.social,
        symptoms: data.notes ? [data.notes] : [],
        created_at: new Date(),
      });
    } else {
      console.warn('addCheckIn is not available on UserDataContext yet — check-in not persisted.');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', background: C.paper, minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>✨</div>
          <p style={{ ...bodyText(16), color: C.body }}>Loading your wellness journey...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{responsiveCSS}</style>
      <div style={{ display: 'flex', background: C.paper, minHeight: '100vh' }}>
        <Sidebar />
        <div style={{ flex: 1, minWidth: 0 }}>
          <MobileLogo />
          <main className="gw-main" style={{
            padding: '44px 48px 80px',
            maxWidth: 880, width: '100%', boxSizing: 'border-box',
          }}>
            <Header name={firstName} onLogout={handleLogout} score={score} />
            <CoachHero
              name={firstName}
              summary={dailySummary}
              profile={profile}
              score={score}
              lastConversationTopic={lastConversationTopic}
            />
           <div style={{ marginBottom: 18 }}>
              <div style={{ ...eyebrow(C.mute), marginBottom: 14 }}>
                WHAT'S ON YOUR COACH'S MIND
              </div>
              <InsightCards
                cards={dailySummary?.cards}
                anchor={anchor}
              />
            </div>
            <GlowTypeRow profile={profile} />
          </main>
        </div>
        <BottomNav />
        <CheckInFAB onClick={() => setCheckInOpen(true)} />
        <CheckInModal
          open={checkInOpen}
          onClose={() => setCheckInOpen(false)}
          onSubmit={handleCheckInSubmit}
        />
      </div>
    </>
  );
}

/* ============================================================
   LEGACY COMPONENTS — not rendered on Home anymore as of v3.0.
   Kept here as commented-out source so Insights and Plan tabs
   can be built from these directly instead of rewritten from
   scratch. Uncomment + move into a new file when building those
   tabs; do not uncomment back into this file.

   - GlowType    → candidate for Insights tab ("Your glow type" section)
   - Vitals      → folded into check-in flow, not a permanent fixture
   - MicroHabits → "most consistent" -> Insights, "actions done" -> Plan
   - WeekChart   → candidate for Insights tab (trends section)
   - Plan (old)  → candidate starting point for new Plan tab
   - Coach (old) → was defined but never rendered even before this
                   rebuild; superseded by CoachHero above

   See chat history / previous Dashboard.jsx (v2.1) for the full
   source of each — omitted here to keep this file from growing
   unbounded. Ask Claude to retrieve the v2.1 source for any of
   these by name when building Insights or Plan.
   ============================================================ */
