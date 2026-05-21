import React, { useState, useEffect } from 'react';
import { useUserData } from '../context/UserDataContext';
import AppLayout from './AppLayout';
import { Moon, CheckCircle, Circle, ChevronRight } from 'lucide-react';

export default function WellnessPlan() {
  const { profile } = useUserData();
  const userName = profile?.name?.split(' ')[0] || 'there';

  // ─── Week range label ─────────────────────────────────────────────────────────
  const getWeekRange = () => {
    const now = new Date();
    const day = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((day + 6) % 7));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const fmt = (d) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    return `${fmt(monday)} – ${fmt(sunday)}`;
  };

  // ─── Action completion state ──────────────────────────────────────────────────
  const [completed, setCompleted] = useState({});
const { updateProfile } = useUserData();

const getWeekKey = () => {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7));
  return `week_${monday.toISOString().split('T')[0]}`;
};

useEffect(() => {
  const weekKey = getWeekKey();
  const saved = profile?.[weekKey] || {};
  setCompleted(saved);
}, [profile]);

const toggle = async (key) => {
  const updated = { ...completed, [key]: !completed[key] };
  setCompleted(updated);
  const weekKey = getWeekKey();
  await updateProfile({ [weekKey]: updated });
};

  // ─── Color palette ────────────────────────────────────────────────────────────
  const C = {
    paper: '#FAF8F5',
    ink: '#3D4A52',
    body: '#5A6770',
    mute: '#A89968',
    sage: '#6B9E7F',
    sageDark: '#557E64',
    plumBg: '#EDE2EC',
    lineSoft: 'rgba(168, 153, 104, 0.10)',
    lineStrong: 'rgba(168, 153, 104, 0.22)',
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

  // ─── Plan data ────────────────────────────────────────────────────────────────
  const getWeekFocus = () => {
    const priorities = profile?.focusAreas || profile?.wellness_priorities || [];
    const top = priorities[0] || '';

    const focusMap = {
      'Sleep & Recovery':        { area: 'Sleep & Nervous System Recovery',    goal: 'Establish a consistent wind-down routine that supports deeper sleep and calmer mornings.',         why: 'Sleep is foundational — improving it will have the biggest knock-on effect on your energy, mood, and stress.',          accent: '#7A5C77', bg: C.plumBg },
      'Stress & Anxiety':        { area: 'Stress & Nervous System Support',    goal: 'Build small daily habits that calm your nervous system and reduce stress accumulation.',           why: 'Sustained stress affects sleep, focus, hormones, and recovery. Addressing it first unlocks everything else.',           accent: '#557E64', bg: '#EDF4EF' },
      'Energy & Fatigue':        { area: 'Energy & Recovery',                  goal: 'Identify and remove the main drains on your daily energy through consistent habits.',             why: 'Low energy often reflects sleep debt, blood sugar instability, or stress — we will work through each systematically.',   accent: '#A07E3D', bg: '#FAF3DC' },
      'Hormonal Balance':        { area: 'Hormonal Balance & Rhythm',          goal: 'Support your hormonal health through consistent sleep, stress management, and nutrition timing.', why: 'Hormones affect everything from mood and skin to energy and metabolism. Consistency is the most powerful lever.',        accent: '#7A5C77', bg: C.plumBg },
      'Hair & Scalp':            { area: 'Hair Health from the Inside Out',    goal: 'Focus on the internal factors — stress, nutrition, and sleep — that most affect hair health.',    why: 'Hair reflects internal health. Addressing root causes creates lasting change rather than surface fixes.',                accent: '#557E64', bg: '#EDF4EF' },
      'Skin & Acne':             { area: 'Skin Clarity & Gut Connection',      goal: 'Support skin health through reducing inflammation, balancing stress, and improving gut health.',  why: 'Skin issues often reflect internal imbalances. Addressing these first creates clearer, more consistent results.',        accent: '#A85A3D', bg: '#F5DDD0' },
      'Brain & Focus':           { area: 'Brain Health & Mental Clarity',      goal: 'Sharpen focus and reduce brain fog through sleep consistency, hydration, and stress reduction.',  why: 'Mental clarity depends on sleep quality, blood sugar stability, and nervous system recovery — all improvable.',           accent: '#557E64', bg: '#EDF4EF' },
      'Gut & Digestion':         { area: 'Gut Health & Digestive Rhythm',      goal: 'Build eating and lifestyle habits that support a calmer, more consistent digestive system.',      why: 'Gut health influences mood, immunity, skin, and energy. Small consistent changes compound quickly.',                    accent: '#A07E3D', bg: '#FAF3DC' },
    };

    return focusMap[top] || {
      area: 'Sleep & Nervous System Recovery',
      goal: 'Establish a consistent wind-down routine that supports deeper sleep and calmer mornings.',
      why: 'Sleep is foundational to everything else — energy, hormones, mood, and focus all improve when sleep does.',
      accent: '#7A5C77',
      bg: C.plumBg,
    };
  };

  const weekFocus = getWeekFocus();

  const actionPlan = [
    {
      day: 'Monday',
      label: 'Day 1',
      actions: [
        { id: 'mon-1', text: 'No screens 45 minutes before bed', impact: 'Sleep quality' },
        { id: 'mon-2', text: 'Drink 2 glasses of water before 10am', impact: 'Energy' },
      ],
    },
    {
      day: 'Wednesday',
      label: 'Day 2',
      actions: [
        { id: 'wed-1', text: '5-minute slow breathing after lunch', impact: 'Stress response' },
        { id: 'wed-2', text: 'In bed by your usual time, no exceptions', impact: 'Sleep rhythm' },
      ],
    },
    {
      day: 'Friday',
      label: 'Day 3',
      actions: [
        { id: 'fri-1', text: 'Gentle movement for 10 minutes in the morning', impact: 'Mood stability' },
        { id: 'fri-2', text: 'Reflect: what felt calmer this week?', impact: 'Emotional awareness' },
      ],
    },
  ];

  const patterns = [
    'Your calmer days appear linked to more consistent sleep timing.',
    'Emotional steadiness seems stronger after slower mornings.',
    'Stress patterns rise faster on evenings with overstimulation.',
  ];

  const totalActions = actionPlan.flatMap((d) => d.actions).length;
  const completedCount = Object.values(completed).filter(Boolean).length;
  const progressPct = Math.round((completedCount / totalActions) * 100);

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <AppLayout>
      <style>{`
        .fade-up { animation: fu 0.6s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes fu {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .glow-orb {
          position:absolute; border-radius:50%;
          filter:blur(72px); pointer-events:none;
        }
        .action-row { cursor:pointer; transition: opacity 0.2s; }
        .action-row:hover { opacity: 0.75; }
        @media (max-width: 780px) {
          .plan-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ background: C.paper, minHeight: '100vh', paddingBottom: 80 }}>

        {/* ── 1. HERO ──────────────────────────────────────────────────────────── */}
        <div style={{
          position: 'relative', overflow: 'hidden',
          padding: '68px 52px 60px',
          background: 'linear-gradient(135deg, rgba(107,158,127,0.12) 0%, rgba(237,226,236,0.46) 100%)',
          border: `1px solid ${C.lineSoft}`,
          borderRadius: 36, marginBottom: 40,
        }}>
          <div className="glow-orb" style={{ width: 420, height: 420, background: 'rgba(107,158,127,0.07)', top: -160, right: -100 }} />
          <div style={{ position: 'relative', zIndex: 2 }}>

            {/* Label row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
              <div style={{ ...eyebrow(C.sageDark) }}>Your Wellness Plan</div>
              <div style={{
                fontFamily: FF_UI, fontSize: 11, fontWeight: 600, color: C.sageDark,
                background: 'rgba(107,158,127,0.12)', padding: '5px 14px',
                borderRadius: 100, letterSpacing: '0.05em',
              }}>
                Week of {getWeekRange()}
              </div>
            </div>

            <h1 style={{ ...display(50), maxWidth: 800, lineHeight: 1.08, marginBottom: 18 }}>
              {userName}, this week we're focusing on{' '}
              <em style={{ color: C.sage, fontStyle: 'italic' }}>rest and recovery.</em>
            </h1>

            <p style={{ ...bodyText(17), maxWidth: 620, lineHeight: 1.82, marginBottom: 36 }}>
              Your plan is built around one clear priority this week — protecting your sleep and
              calming your nervous system. Three focused days, six simple actions.
            </p>

            {/* Progress bar */}
            <div style={{ maxWidth: 360 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ fontFamily: FF_UI, fontSize: 12, fontWeight: 600, color: C.sageDark }}>
                  Weekly progress
                </div>
                <div style={{ fontFamily: FF_UI, fontSize: 12, fontWeight: 600, color: C.sageDark }}>
                  {completedCount} of {totalActions} actions done
                </div>
              </div>
              <div style={{ height: 7, borderRadius: 100, background: 'rgba(107,158,127,0.14)' }}>
                <div style={{
                  height: '100%', borderRadius: 100,
                  background: `linear-gradient(90deg, ${C.sage}, ${C.sageDark})`,
                  width: `${progressPct || 0}%`,
                  transition: 'width 0.5s cubic-bezier(0.16,1,0.3,1)',
                  minWidth: completedCount > 0 ? 12 : 0,
                }} />
              </div>
            </div>

          </div>
        </div>

        {/* ── MAIN CONTENT ─────────────────────────────────────────────────────── */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 40px' }}>

          {/* ── 2. THIS WEEK'S FOCUS ──────────────────────────────────────────── */}
          <div style={{ marginBottom: 44 }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ ...eyebrow(C.mute), marginBottom: 10 }}>This week's focus</div>
              <h2 style={{ ...display(32), margin: 0 }}>One priority, done well</h2>
            </div>

            <div style={{
              display: 'flex', gap: 28, alignItems: 'flex-start',
              padding: '32px 36px', borderRadius: 28,
              background: weekFocus.bg, border: `1px solid ${C.lineSoft}`,
              boxShadow: '0 12px 40px -20px rgba(61,74,82,0.10)',
            }}>
              <div style={{
                width: 54, height: 54, borderRadius: '50%', flexShrink: 0,
                background: 'rgba(122,92,119,0.14)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Moon size={24} strokeWidth={1.6} style={{ color: weekFocus.accent }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FF_DISPLAY, fontSize: 22, color: C.ink, marginBottom: 10, lineHeight: 1.2 }}>
                  {weekFocus.area}
                </div>
                <p style={{ ...bodyText(15), lineHeight: 1.8, marginBottom: 12, fontWeight: 500, color: C.ink }}>
                  {weekFocus.goal}
                </p>
                <p style={{ ...bodyText(14), lineHeight: 1.8, margin: 0 }}>
                  {weekFocus.why}
                </p>
              </div>
            </div>
          </div>

          {/* ── 3. 3-DAY ACTION PLAN ─────────────────────────────────────────── */}
          <div style={{ marginBottom: 44 }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ ...eyebrow(C.mute), marginBottom: 10 }}>Your action plan</div>
              <h2 style={{ ...display(32), margin: 0 }}>3 days · 6 actions</h2>
            </div>

            <div
              className="plan-grid"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}
            >
              {actionPlan.map((day, dIdx) => {
                const dayDone = day.actions.filter((a) => completed[a.id]).length;
                return (
                  <div
                    key={day.day}
                    className="fade-up"
                    style={{
                      padding: '26px 24px', borderRadius: 24,
                      background: C.paper, border: `1px solid ${C.lineSoft}`,
                      boxShadow: '0 8px 24px -16px rgba(61,74,82,0.08)',
                      animationDelay: `${dIdx * 0.1}s`,
                    }}
                  >
                    {/* Day header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                      <div>
                        <div style={{ ...eyebrow(C.mute), marginBottom: 6 }}>{day.label}</div>
                        <div style={{ fontFamily: FF_DISPLAY, fontSize: 21, color: C.ink }}>{day.day}</div>
                      </div>
                      <div style={{
                        width: 34, height: 34, borderRadius: '50%',
                        background: dayDone === day.actions.length
                          ? 'rgba(107,158,127,0.18)'
                          : 'rgba(107,158,127,0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: FF_UI, fontSize: 12, fontWeight: 700,
                        color: dayDone === day.actions.length ? C.sageDark : C.mute,
                        transition: 'all 0.3s ease',
                      }}>
                        {dayDone}/{day.actions.length}
                      </div>
                    </div>

                    <div style={{ height: 1, background: C.lineSoft, marginBottom: 18 }} />

                    {/* Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {day.actions.map((action) => (
                        <div
                          key={action.id}
                          className="action-row"
                          onClick={() => toggle(action.id)}
                          style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}
                        >
                          <div style={{ flexShrink: 0, marginTop: 2 }}>
                            {completed[action.id]
                              ? <CheckCircle size={18} strokeWidth={2} style={{ color: C.sage }} />
                              : <Circle size={18} strokeWidth={1.5} style={{ color: C.lineStrong }} />
                            }
                          </div>
                          <div>
                            <div style={{
                              fontFamily: FF_UI, fontSize: 14, fontWeight: 500,
                              color: C.ink, lineHeight: 1.5,
                              textDecoration: completed[action.id] ? 'line-through' : 'none',
                              opacity: completed[action.id] ? 0.45 : 1,
                              transition: 'opacity 0.2s',
                            }}>
                              {action.text}
                            </div>
                            <div style={{
                              fontFamily: FF_UI, fontSize: 11.5, marginTop: 5,
                              fontWeight: 600, color: C.sage, letterSpacing: '0.04em',
                            }}>
                              ↑ {action.impact}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── 4. WHAT GLOWWISE IS WATCHING ─────────────────────────────────── */}
          <div style={{ marginBottom: 44 }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ ...eyebrow(C.sageDark), marginBottom: 10 }}>What GlowWise is watching</div>
              <h2 style={{ ...display(32), margin: 0 }}>Your patterns this week</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {patterns.map((text, idx) => (
                <div
                  key={idx}
                  className="fade-up"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: '20px 24px', borderRadius: 18,
                    background: C.paper, border: `1px solid ${C.lineSoft}`,
                    animationDelay: `${idx * 0.08}s`,
                  }}
                >
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.sage, flexShrink: 0 }} />
                  <p style={{ ...bodyText(15), lineHeight: 1.75, margin: 0, flex: 1 }}>{text}</p>
                  <ChevronRight size={15} strokeWidth={1.5} style={{ color: C.mute, flexShrink: 0 }} />
                </div>
              ))}
            </div>
          </div>

          {/* ── 5. WEEKLY INTENTION ──────────────────────────────────────────── */}
          <div
            className="fade-up"
            style={{
              padding: '56px 48px', borderRadius: 32, textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(107,158,127,0.08) 0%, rgba(237,226,236,0.36) 100%)',
              border: `1px solid ${C.lineSoft}`,
              position: 'relative', overflow: 'hidden',
            }}
          >
            <div className="glow-orb" style={{ width: 300, height: 300, background: 'rgba(107,158,127,0.07)', top: -100, right: -60 }} />
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ ...eyebrow(C.sageDark), marginBottom: 18 }}>This week's intention</div>
              <h2 style={{ ...display(38), maxWidth: 680, margin: '0 auto 18px', lineHeight: 1.18 }}>
                Protect your evenings.{' '}
                <em style={{ color: C.sage, fontStyle: 'italic' }}>
                  Your mornings will thank you.
                </em>
              </h2>
              <p style={{ ...bodyText(16), maxWidth: 540, margin: '0 auto', lineHeight: 1.85 }}>
                Small consistent actions this week build the foundation for steadier energy,
                calmer stress, and more supported sleep — not just now, but beyond.
              </p>
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
