import React from 'react';
import { useUserData } from '../context/UserDataContext';
import AppLayout from './AppLayout';
import { Heart, Moon, Sparkles, Wind } from 'lucide-react';

export default function WellnessPlan() {
  const { profile } = useUserData();
  const userName = profile?.name?.split(' ')[0] || 'there';

  // ─── Color palette ───────────────────────────────────────────────────────────
  const C = {
    paper: '#FAF8F5',
    ink: '#3D4A52',
    body: '#5A6770',
    mute: '#A89968',
    sage: '#6B9E7F',
    sageDark: '#557E64',
    sageMint: '#EDF4EF',
    sageBg: '#D4E8DD',
    plum: '#7A5C77',
    plumBg: '#EDE2EC',
    terracotta: '#A85A3D',
    terracottaMid: '#C97B5C',
    terracottaBg: '#F5DDD0',
    amber: '#A07E3D',
    amberMid: '#D4A55C',
    amberBg: '#FAF3DC',
    line: 'rgba(168, 153, 104, 0.16)',
    lineSoft: 'rgba(168, 153, 104, 0.10)',
  };

  const FF_DISPLAY = "'Fraunces', Georgia, serif";
  const FF_UI = "'Manrope', system-ui, sans-serif";

  // ─── Style helpers ────────────────────────────────────────────────────────────
  const eyebrow = (color = C.mute) => ({
    fontFamily: FF_UI,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color,
    lineHeight: 1,
  });

  const display = (size = 28) => ({
    fontFamily: FF_DISPLAY,
    fontWeight: 400,
    fontSize: size,
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
    color: C.ink,
  });

  const bodyText = (size = 14) => ({
    fontFamily: FF_UI,
    fontSize: size,
    lineHeight: 1.6,
    color: C.body,
  });

  // ─── Data ─────────────────────────────────────────────────────────────────────
  const priorities = [
    {
      id: 'sleep',
      title: 'Sleep Recovery',
      insight: 'Your nervous system is responding well to consistent bedtimes.',
      icon: Moon,
      color: C.plum,
      bg: C.plumBg,
      accent: '#7A5C77',
      progress: 72,
    },
    {
      id: 'nervous',
      title: 'Nervous System Support',
      insight: 'Stress levels have been gradually stabilising this week.',
      icon: Wind,
      color: C.sage,
      bg: C.sageMint,
      accent: C.sageDark,
      progress: 65,
    },
    {
      id: 'emotional',
      title: 'Emotional Balance',
      insight: 'Your mood appears more supported on days with morning movement.',
      icon: Heart,
      color: C.terracotta,
      bg: C.terracottaBg,
      accent: C.terracotta,
      progress: 78,
    },
    {
      id: 'energy',
      title: 'Energy Stability',
      insight: 'Energy steadiness correlates with your hydration patterns.',
      icon: Sparkles,
      color: C.amber,
      bg: C.amberBg,
      accent: C.amber,
      progress: 68,
    },
  ];





  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <AppLayout>
      <style>{`
        .fade-up {
          animation: fu 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes fu {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .glow-effect {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          pointer-events: none;
        }
        .progress-ring {
          transform: rotate(-90deg);
          transform-origin: 50% 50%;
        }
        .wellness-card {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .wellness-card:hover {
          transform: translateY(-4px);
        }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ background: C.paper, minHeight: '100vh', paddingBottom: 60 }}>

        {/* ── 1. HERO REFLECTION ──────────────────────────────────────────────── */}
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            padding: '72px 52px',
            borderRadius: 36,
            background: 'linear-gradient(135deg, rgba(107,158,127,0.12) 0%, rgba(237,226,236,0.48) 100%)',
            border: `1px solid ${C.lineSoft}`,
            marginBottom: 42,
          }}
        >
          <div
            className="glow-effect"
            style={{ width: 360, height: 360, background: 'rgba(107,158,127,0.08)', top: -140, right: -80 }}
          />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ ...eyebrow(C.sageDark), marginBottom: 18 }}>
              This week's reflection
            </div>
            <h1 style={{ ...display(52), maxWidth: 760, lineHeight: 1.08, marginBottom: 24 }}>
              Your recovery appears{' '}
              <em style={{ color: C.sage, fontStyle: 'italic' }}>steadier</em>{' '}
              this week.
            </h1>
            <p style={{ ...bodyText(17), maxWidth: 620, lineHeight: 1.8 }}>
              Your recent check-ins suggest calmer stress patterns, more stable emotional recovery,
              and improved sleep consistency.
            </p>
          </div>
        </div>

        {/* ── MAIN CONTENT CONTAINER ──────────────────────────────────────────── */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 40px' }}>

          {/* ── Wellness Priorities ─────────────────────────────────────────────── */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ marginBottom: 28 }}>
              <div style={{ ...eyebrow(C.mute), marginBottom: 12 }}>Your wellness focus</div>
              <h2 style={{ ...display(32), margin: 0 }}>Adaptive wellness priorities</h2>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 20,
              }}
            >
              {priorities.map((priority, idx) => {
                const Icon = priority.icon;
                const rgba =
                  priority.color === C.plum        ? '122,92,119' :
                  priority.color === C.sage        ? '107,158,127' :
                  priority.color === C.terracotta  ? '168,90,61' :
                                                     '160,126,61';
                return (
                  <div
                    key={priority.id}
                    className="wellness-card fade-up"
                    style={{
                      position: 'relative', overflow: 'hidden',
                      padding: 28, borderRadius: 24,
                      background: priority.bg,
                      border: `1px solid ${C.lineSoft}`,
                      boxShadow: '0 12px 32px -20px rgba(61,74,82,0.10)',
                      animationDelay: `${idx * 0.1}s`,
                    }}
                  >
                    <div
                      className="glow-effect"
                      style={{ width: 160, height: 160, background: 'rgba(107,158,127,0.08)', top: -60, right: -40 }}
                    />
                    <div style={{ position: 'relative', zIndex: 2 }}>
                      <div
                        style={{
                          width: 44, height: 44, borderRadius: '50%',
                          background: `rgba(${rgba}, 0.15)`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          marginBottom: 16,
                        }}
                      >
                        <Icon size={20} strokeWidth={1.8} style={{ color: priority.accent }} />
                      </div>
                      <h3 style={{ ...display(18), marginBottom: 12, fontWeight: 500 }}>
                        {priority.title}
                      </h3>
                      <p style={{ ...bodyText(13.5), marginBottom: 18, lineHeight: 1.6, color: C.body, fontStyle: 'italic' }}>
                        {priority.insight}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <svg width="40" height="40" viewBox="0 0 40 40" style={{ overflow: 'visible' }}>
                          <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(168,153,104,0.15)" strokeWidth="2" />
                          <circle
                            cx="20" cy="20" r="16" fill="none"
                            stroke={priority.accent} strokeWidth="2"
                            strokeDasharray={`${(priority.progress / 100) * 100.5} 100.5`}
                            className="progress-ring"
                            style={{ transition: 'stroke-dasharray 0.6s ease' }}
                          />
                        </svg>
                        <div style={{ fontFamily: FF_UI, fontSize: 12, fontWeight: 600, color: priority.accent }}>
                          {priority.progress}%
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── 3. WHAT GLOWWISE IS NOTICING ───────────────────────────────────── */}
          <div style={{ marginBottom: 56 }}>
            <div style={{ marginBottom: 22 }}>
              <div style={{ ...eyebrow(C.sageDark), marginBottom: 10 }}>What GlowWise is noticing</div>
              <h2 style={{ ...display(32), margin: 0 }}>Your patterns & rhythms</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                'Your calmer days appear linked to more consistent sleep timing.',
                'Emotional steadiness seems stronger after slower mornings.',
                'Stress patterns rise faster on evenings with overstimulation.',
              ].map((text, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '22px 24px',
                    borderRadius: 18,
                    background: C.paper,
                    border: `1px solid ${C.lineSoft}`,
                    boxShadow: '0 6px 20px -16px rgba(61,74,82,0.06)',
                  }}
                >
                  <p style={{ ...bodyText(15), lineHeight: 1.8, margin: 0, color: C.body }}>
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>





        </div>{/* end main content container */}
      </div>
    </AppLayout>
  );
}
