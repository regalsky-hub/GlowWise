import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../context/UserDataContext';
import AppLayout from './AppLayout';
import { MessageCircle } from 'lucide-react';

// ============ PALETTE ============
const C = {
  paper: '#FAF8F5',
  ink: '#3D4A52',
  body: '#5A6770',
  mute: '#A89968',
  sage: '#6B9E7F',
  sageDark: '#557E64',
  sageMint: '#EDF4EF',
  plum: '#7A5C77',
  plumBg: '#EDE2EC',
  amber: '#A07E3D',
  amberBg: '#FAF3DC',
  terracotta: '#A85A3D',
  lineSoft: 'rgba(168, 153, 104, 0.10)',
  line: 'rgba(168, 153, 104, 0.16)',
};

const FF_DISPLAY = "'Fraunces', Georgia, serif";
const FF_UI = "'Manrope', system-ui, sans-serif";

const eyebrow = (color = C.mute) => ({
  fontFamily: FF_UI, fontSize: 11, fontWeight: 600,
  letterSpacing: '0.18em', textTransform: 'uppercase', color, lineHeight: 1,
});
const display = (size = 28) => ({
  fontFamily: FF_DISPLAY, fontWeight: 400, fontSize: size,
  lineHeight: 1.1, letterSpacing: '-0.02em', color: C.ink,
});
const bodyText = (size = 14) => ({
  fontFamily: FF_UI, fontSize: size, lineHeight: 1.6, color: C.body,
});

// ============ FOCUS MAP (unchanged from previous version — still rule-based) ============
// TODO: replace with real AI-generated focus once the daily-summary job exists.
// Same caveat as Dashboard.jsx / AICoach.jsx — this is honest placeholder logic,
// not true personalization beyond which onboarding priority it matches.
const FOCUS_MAP = {
  'Sleep & Recovery':  { area: 'Improve Sleep & Recovery',      why: "I've noticed your energy and mood both track closely with how consistent your sleep timing is — this week we're protecting that.", target: 'Lights out by 10:45pm, 5 of 7 days', accent: C.plum, bg: C.plumBg },
  'Stress & Anxiety':  { area: 'Calm Your Stress Response',     why: "Stress has been the most active signal in your recent check-ins. Small daily recovery habits should help it settle.", target: '5-minute breathing break, 5 of 7 days', accent: C.sageDark, bg: C.sageMint },
  'Energy & Fatigue':  { area: 'Improve Afternoon Energy',      why: "Your energy dips hardest in the afternoon, and it tracks closely with hydration and sleep the night before.", target: 'Hydration before midday, 5 of 7 days', accent: C.amber, bg: C.amberBg },
  'Hormonal Balance':  { area: 'Support Hormonal Balance',      why: "Hormonal balance is most influenced by consistency — sleep, stress, and nutrition timing all play a part.", target: 'Consistent meal timing, 5 of 7 days', accent: C.plum, bg: C.plumBg },
  'Hair & Scalp':      { area: 'Hair Health from the Inside',   why: "Hair reflects internal health more than topical care. We're focusing on the habits that support it from within.", target: 'Protein-rich breakfast, 5 of 7 days', accent: C.sageDark, bg: C.sageMint },
  'Skin & Acne':       { area: 'Support Skin Clarity',          why: "Skin changes often trace back to stress and gut health. We're starting with the habits most likely to help.", target: 'Stress check-in, 5 of 7 days', accent: C.terracotta, bg: C.amberBg },
  'Brain & Focus':     { area: 'Sharpen Focus & Clarity',       why: "Mental clarity depends heavily on sleep quality and hydration — both are within reach this week.", target: 'Hydration before midday, 5 of 7 days', accent: C.sageDark, bg: C.sageMint },
  'Gut & Digestion':   { area: 'Support Gut Health',            why: "Gut health influences mood, energy, and skin. Small consistent changes compound quickly here.", target: 'Slow, mindful lunch, 5 of 7 days', accent: C.amber, bg: C.amberBg },
};

const DEFAULT_FOCUS = {
  area: 'Improve Sleep & Recovery',
  why: 'Sleep is foundational to everything else — energy, hormones, mood, and focus all improve when sleep does.',
  target: 'Lights out by 10:45pm, 5 of 7 days',
  accent: C.plum,
  bg: C.plumBg,
};

const getCurrentFocus = (profile) => {
  const priorities = profile?.focusAreas || profile?.wellness_priorities || [];
  const top = priorities[0] || '';
  return FOCUS_MAP[top] || DEFAULT_FOCUS;
};

// ============ TODAY'S ACTIONS (static template — same caveat as above) ============
const ACTION_TEMPLATE = {
  morning: [
    { id: 'm1', text: 'Drink 500ml water before 10am' },
    { id: 'm2', text: 'Protein with your first meal' },
  ],
  afternoon: [
    { id: 'a1', text: '15-minute walk after lunch' },
    { id: 'a2', text: 'No caffeine after 2pm' },
  ],
  evening: [
    { id: 'e1', text: 'Lights out by 10:45pm' },
    { id: 'e2', text: 'No screens 30 minutes before bed' },
  ],
};

const getTodayKey = () => {
  const now = new Date();
  return `plan_day_${now.toISOString().split('T')[0]}`;
};

// ============ "SINCE YOU STARTED" — real calculation from check-ins ============
// Mirrors AICoach.jsx's trendFor() — splits available check-ins into an older
// half and a newer half, compares averages. Requires at least 4 check-ins to
// say anything; below that, returns null so the UI can show an honest
// "still gathering data" state instead of a misleading number from 1-2 points.
const calculateChange = (checkIns, field, { asPercent = false, higherIsBetter = true } = {}) => {
  const recent = (checkIns || []).slice(0, 30); // cap window so very old data doesn't dominate
  if (recent.length < 4) return null;

  const mid = Math.floor(recent.length / 2);
  const toNums = (arr) => arr.map((c) => parseFloat(c[field])).filter((v) => !isNaN(v));
  const newer = toNums(recent.slice(0, mid));
  const older = toNums(recent.slice(mid));
  if (!newer.length || !older.length) return null;

  const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
  const newerMean = mean(newer);
  const olderMean = mean(older);
  const diff = newerMean - olderMean;

  if (asPercent) {
    if (olderMean === 0) return null;
    const pct = (diff / olderMean) * 100;
    const rounded = Math.round(pct);
    if (rounded === 0) return null; // not enough movement to claim a change
    const sign = rounded > 0 ? '+' : '−';
    return `${sign}${Math.abs(rounded)}%`;
  } else {
    const rounded = Math.round(diff * 10) / 10;
    if (rounded === 0) return null;
    const sign = rounded > 0 ? '+' : '−';
    return `${sign}${Math.abs(rounded)}`;
  }
};

// sleep_hours: higher = more consistent isn't quite right for "consistency" —
// true consistency would need standard deviation, not just average. Using
// average sleep_hours change as an honest proxy for now; a real "consistency"
// metric (variance-based) is follow-up work, not built here.
const buildSinceYouStarted = (checkIns) => {
  const sleep = calculateChange(checkIns, 'sleep_hours', { asPercent: false, higherIsBetter: true });
  const energy = calculateChange(checkIns, 'energy', { asPercent: false, higherIsBetter: true });
  const stress = calculateChange(checkIns, 'stress_level', { asPercent: true, higherIsBetter: false });

  const tiles = [
    { label: 'Average sleep', value: sleep, suffix: 'h', accent: C.plum, bg: C.plumBg },
    { label: 'Average energy', value: energy, suffix: ' pts', accent: C.amber, bg: C.amberBg },
    { label: 'Stress levels', value: stress, suffix: '', accent: C.sageDark, bg: C.sageMint },
  ];

  return tiles;
};

// ============ "WHAT I'M NOTICING" — rule-based observation, not AI-generated yet ============
const buildWhatImNoticing = (checkIns) => {
  if (!checkIns || checkIns.length < 4) {
    return "I don't have enough check-ins yet to spot a real pattern — a few more and I'll start noticing what's actually connected for you.";
  }
  const energyTrend = calculateChange(checkIns, 'energy', { higherIsBetter: true });
  const sleepTrend = calculateChange(checkIns, 'sleep_hours', { higherIsBetter: true });

  if (energyTrend && energyTrend.startsWith('+') && sleepTrend && sleepTrend.startsWith('+')) {
    return 'Your energy is climbing alongside your sleep — that link looks real, not coincidental. Keep protecting your bedtime and this should keep compounding.';
  }
  if (energyTrend && energyTrend.startsWith('−')) {
    return "Your energy has dipped recently. It's worth talking through whether sleep, stress, or something else is driving it.";
  }
  return "Your check-ins are looking fairly steady right now. That's a good foundation to build the next habit on.";
};

// ============ COMPONENTS ============
const PlanIntro = ({ name }) => (
  <div style={{ marginBottom: 28 }}>
    <h1 style={{ ...display(38), margin: 0, marginBottom: 10 }}>
      Your <em style={{ fontStyle: 'italic', color: C.sage }}>wellness plan</em>.
    </h1>
    <p style={{ ...bodyText(15), margin: 0, maxWidth: 480 }}>
      Created by your AI coach, built around your check-ins, patterns, and what's actually working for you.
    </p>
  </div>
);

const FocusHero = ({ focus, completedCount, totalActions }) => {
  const pct = totalActions > 0 ? Math.round((completedCount / totalActions) * 100) : 0;
  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      padding: '40px 44px',
      borderRadius: 24,
      background: 'linear-gradient(135deg, rgba(107,158,127,0.20) 0%, rgba(237,226,236,0.55) 100%)',
      border: `1px solid rgba(107,158,127,0.12)`,
      marginBottom: 24,
    }}>
      <div style={{
        position: 'absolute', width: 280, height: 280, borderRadius: '50%',
        background: 'rgba(107,158,127,0.14)', filter: 'blur(70px)',
        top: -110, right: -90,
      }} />
      <div style={{ position: 'relative', zIndex: 2, maxWidth: 600 }}>
        <div style={{ ...eyebrow(C.sageDark), marginBottom: 14 }}>Current focus</div>
        <h2 style={{ ...display(34), margin: 0, marginBottom: 14, lineHeight: 1.15 }}>
          {focus.area}
        </h2>
        <p style={{ ...bodyText(15), margin: 0, marginBottom: 22, maxWidth: 520 }}>
          {focus.why}
        </p>
        <div style={{ maxWidth: 340 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontFamily: FF_UI, fontSize: 12.5, fontWeight: 600, color: C.sageDark }}>
              {focus.target}
            </span>
            <span style={{ fontFamily: FF_UI, fontSize: 12.5, fontWeight: 700, color: C.sageDark }}>
              {completedCount}/{totalActions} today
            </span>
          </div>
          <div style={{ height: 8, borderRadius: 100, background: 'rgba(107,158,127,0.16)' }}>
            <div style={{
              height: '100%', borderRadius: 100,
              background: `linear-gradient(90deg, ${C.sage}, ${C.sageDark})`,
              width: `${pct}%`,
              transition: 'width 0.4s ease',
              minWidth: completedCount > 0 ? 10 : 0,
            }} />
          </div>
        </div>
      </div>
    </div>
  );
};

const ActionItem = ({ action, onToggle, accent, done }) => (
  <div
    className="action-row"
    onClick={() => onToggle(action.id)}
    style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 4px', cursor: 'pointer',
    }}
  >
    <div style={{
      width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
      border: `2px solid ${done ? accent : C.line}`,
      background: done ? accent : 'transparent',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'all 0.15s ease',
    }}>
      {done && <span style={{ color: C.paper, fontSize: 11, fontWeight: 700 }}>✓</span>}
    </div>
    <span style={{
      fontFamily: FF_UI, fontSize: 14.5, color: C.ink,
      textDecoration: done ? 'line-through' : 'none',
      opacity: done ? 0.45 : 1,
      transition: 'opacity 0.2s ease',
    }}>
      {action.text}
    </span>
  </div>
);

const ActionBlock = ({ label, accent, bg, actions, completed, onToggle }) => (
  <div style={{
    background: bg, borderRadius: 16, padding: '20px 22px',
    border: `1px solid ${C.lineSoft}`,
  }}>
    <div style={{ ...eyebrow(accent), marginBottom: 6, fontSize: 10 }}>{label}</div>
    <div>
      {actions.map((a) => (
        <ActionItem key={a.id} action={a} done={!!completed[a.id]} onToggle={onToggle} accent={accent} />
      ))}
    </div>
  </div>
);

const TodaysActions = ({ completed, onToggle }) => (
  <div style={{ marginBottom: 28 }}>
    <div style={{ marginBottom: 16 }}>
      <div style={{ ...eyebrow(C.mute), marginBottom: 6 }}>Today</div>
      <h2 style={{ ...display(24), margin: 0 }}>Your actions</h2>
    </div>
    <div className="plan-actions-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
      <ActionBlock label="Morning" accent={C.amber} bg={C.amberBg} actions={ACTION_TEMPLATE.morning} completed={completed} onToggle={onToggle} />
      <ActionBlock label="Afternoon" accent={C.sageDark} bg={C.sageMint} actions={ACTION_TEMPLATE.afternoon} completed={completed} onToggle={onToggle} />
      <ActionBlock label="Evening" accent={C.plum} bg={C.plumBg} actions={ACTION_TEMPLATE.evening} completed={completed} onToggle={onToggle} />
    </div>
  </div>
);

const WhatImNoticing = ({ text, onDiscuss }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', gap: 14,
    padding: '24px 26px', borderRadius: 18, marginBottom: 28,
    background: 'linear-gradient(135deg, #6B9E7F 0%, #557E64 100%)',
  }}>
    <div style={{
      fontFamily: FF_UI, fontSize: 10, fontWeight: 600, letterSpacing: '0.18em',
      textTransform: 'uppercase', color: 'rgba(250,248,245,0.76)',
    }}>
      What I'm noticing
    </div>
    <p style={{
      fontFamily: FF_DISPLAY, fontSize: 19, lineHeight: 1.5,
      color: C.paper, margin: 0, maxWidth: 560, letterSpacing: '-0.01em',
    }}>
      {text}
    </p>
    <button onClick={onDiscuss} style={{
      alignSelf: 'flex-start', marginTop: 4,
      background: C.paper, color: C.sageDark, border: 'none',
      padding: '10px 20px', borderRadius: 999,
      fontFamily: FF_UI, fontSize: 13, fontWeight: 700,
      cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
    }}>
      <MessageCircle size={14} strokeWidth={2} />
      Discuss with coach
    </button>
  </div>
);

const SinceYouStarted = ({ tiles, hasEnoughData }) => (
  <div style={{ marginBottom: 8 }}>
    <div style={{ marginBottom: 16 }}>
      <div style={{ ...eyebrow(C.mute), marginBottom: 6 }}>Since you started</div>
      <h2 style={{ ...display(24), margin: 0 }}>What's changed</h2>
    </div>
    {!hasEnoughData ? (
      <div style={{
        padding: '20px 22px', borderRadius: 16,
        background: C.paper, border: `1px solid ${C.lineSoft}`,
      }}>
        <p style={{ ...bodyText(14), margin: 0 }}>
          A few more check-ins and I'll be able to show you what's actually changing.
        </p>
      </div>
    ) : (
      <div className="plan-since-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {tiles.map((s) => (
          <div key={s.label} style={{
            background: s.bg, borderRadius: 16, padding: '20px 22px',
            border: `1px solid ${C.lineSoft}`,
          }}>
            <div style={{ ...eyebrow(s.accent), marginBottom: 10, fontSize: 10 }}>{s.label}</div>
            {s.value ? (
              <div style={{ ...display(30), color: s.accent }}>{s.value}{s.suffix || ''}</div>
            ) : (
              <div style={{ fontFamily: FF_UI, fontSize: 14, color: C.mute, fontStyle: 'italic' }}>Steady so far</div>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);

// ============ PAGE ============
export default function WellnessPlan() {
  const { profile, checkIns, updateProfile } = useUserData();
  const navigate = useNavigate();
  const userName = profile?.name?.split(' ')[0] || 'there';

  const [completed, setCompleted] = useState({});

  const todayKey = getTodayKey();

  useEffect(() => {
    const saved = profile?.[todayKey] || {};
    setCompleted(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const toggle = async (id) => {
    const updated = { ...completed, [id]: !completed[id] };
    setCompleted(updated);
    await updateProfile({ [todayKey]: updated });
  };

  const focus = getCurrentFocus(profile);
  const allActions = [...ACTION_TEMPLATE.morning, ...ACTION_TEMPLATE.afternoon, ...ACTION_TEMPLATE.evening];
  const completedCount = allActions.filter((a) => completed[a.id]).length;

  const sinceYouStartedTiles = buildSinceYouStarted(checkIns);
  const hasEnoughData = (checkIns || []).length >= 4;
  const noticingText = buildWhatImNoticing(checkIns);

  const handleDiscuss = () => {
    // Matches the { id, type, title, summary, coach_context } shape
    // Dashboard.jsx's insight cards now send — AICoach.jsx checks for
    // BOTH location.state.fromCard AND location.state.card before firing
    // the auto-send; sending only `text` (the old shape) silently fails
    // that check and the user lands on the blank welcome screen instead.
    navigate('/ai-coach', {
      state: {
        fromCard: 'recommendation',
        card: {
          id: 'plan_noticing_001',
          type: 'recommendation',
          title: "What I'm noticing",
          summary: noticingText,
          coach_context: `This is something the coach noticed while reviewing the user's Plan page — their current focus area and recent check-in patterns. Explain the reasoning behind it and ask a clarifying question before suggesting next steps.`,
        },
      },
    });
  };

  return (
    <AppLayout>
      <style>{`
        .action-row { transition: opacity 0.2s; }
        .action-row:hover { opacity: 0.75; }
        @media (max-width: 780px) {
          .plan-actions-grid { grid-template-columns: 1fr !important; }
          .plan-since-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ background: C.paper, minHeight: '100vh', fontFamily: FF_UI, color: C.ink }}>
        <div style={{ maxWidth: 820, margin: '0 auto', padding: '0 8px' }}>
          <PlanIntro name={userName} />
          <FocusHero focus={focus} completedCount={completedCount} totalActions={allActions.length} />
          <TodaysActions completed={completed} onToggle={toggle} />
          <WhatImNoticing text={noticingText} onDiscuss={handleDiscuss} />
          <SinceYouStarted tiles={sinceYouStartedTiles} hasEnoughData={hasEnoughData} />
        </div>
      </div>
    </AppLayout>
  );
}
