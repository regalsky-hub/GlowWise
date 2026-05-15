import React from 'react';
import { useUserData } from '../context/UserDataContext';
import AppLayout from './AppLayout';
import { Heart, Moon, Activity, Sparkles, TrendingUp, Droplet, Sun, Wind } from 'lucide-react';

export default function WellnessPlan() {
  const { profile } = useUserData();
  const userName = profile?.name?.split(' ')[0] || 'there';

  // Color palette
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

  // Style helpers
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

  // Wellness priorities data
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

  // Gentle daily actions
  const gentleActions = [
    {
      icon: Sun,
      action: 'Morning sunlight',
      description: 'A few minutes of natural light before 10am helps regulate your nervous system.',
      insight: '↑ Energy steadiness',
    },
    {
      icon: Droplet,
      action: 'Gentle hydration',
      description: 'Slower water intake throughout the day supports steadier energy.',
      insight: '↑ Mood stability',
    },
    {
      icon: Wind,
      action: 'Afternoon pause',
      description: 'A 5-minute slow breath before afternoon tasks helps prevent overwhelm.',
      insight: '↓ Stress response',
    },
    {
      icon: Moon,
      action: 'Evening wind-down',
      description: 'Dimming lights and slowing activity 1 hour before bed deepens sleep quality.',
      insight: '↑ Sleep depth',
    },
  ];

  // Pattern insights
  const insights = [
    {
      pattern: 'Stress correlation',
      observation: 'Your stress levels tend to rise after nights with less than 7 hours of sleep.',
      icon: TrendingUp,
    },
    {
      pattern: 'Energy rhythm',
      observation: 'Your energy appears most stable on days when you move gently in the morning.',
      icon: Activity,
    },
    {
      pattern: 'Emotional support',
      observation: 'Emotional balance noticeably improves on days with consistent meal timing.',
      icon: Heart,
    },
  ];

  return (
    <AppLayout>
      <style>{`
        .fade-up {
          animation: fu 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes fu {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
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
          .hero-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div style={{ background: C.paper, minHeight: '100vh', paddingBottom: 60 }}>
        {/* HERO REFLECTION */}
<div
  style={{
    position: 'relative',
    overflow: 'hidden',
    padding: '72px 52px',
    borderRadius: 36,
    background:
      'linear-gradient(135deg, rgba(107,158,127,0.12) 0%, rgba(237,226,236,0.48) 100%)',
    border: `1px solid ${C.lineSoft}`,
    marginBottom: 42,
  }}
>
  <div
    className="glow-effect"
    style={{
      width: 360,
      height: 360,
      background: 'rgba(107,158,127,0.08)',
      top: -140,
      right: -80,
    }}
  />

  <div style={{ position: 'relative', zIndex: 2 }}>
    <div style={{ ...eyebrow(C.sageDark), marginBottom: 18 }}>
      This week’s reflection
    </div>

    <h1
      style={{
        ...display(52),
        maxWidth: 760,
        lineHeight: 1.08,
        marginBottom: 24,
      }}
    >
      Your recovery appears{' '}
      <em style={{ color: C.sage, fontStyle: 'italic' }}>
        steadier
      </em>{' '}
      this week.
    </h1>

    <p
      style={{
        ...bodyText(17),
        maxWidth: 620,
        lineHeight: 1.8,
      }}
    >
      Your recent check-ins suggest calmer stress patterns,
      more stable emotional recovery, and improved sleep consistency.
    </p>
  </div>
</div>
        {/* Main Content */}
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            padding: '48px 40px',
          }}
        >
          {/* AI Wellness Summary */}
          <div
            className="fade-up"
            style={{
              position: 'relative',
              overflow: 'hidden',
              padding: '48px 40px',
              borderRadius: 32,
              background: `linear-gradient(135deg, rgba(237,244,239,0.8) 0%, rgba(250,248,245,0.95) 100%)`,
              border: `1px solid ${C.lineSoft}`,
              marginBottom: 48,
              boxShadow: '0 24px 60px -30px rgba(61,74,82,0.12)',
            }}
          >
            <div
              className="glow-effect"
              style={{
                width: 280,
                height: 280,
                background: 'rgba(107,158,127,0.08)',
                top: -80,
                right: -40,
              }}
            />

            <div style={{ position: 'relative', zIndex: 2 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${C.sage} 0%, ${C.sageDark} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: C.paper,
                    fontFamily: FF_DISPLAY,
                    fontSize: 20,
                    fontWeight: 500,
                  }}
                >
                  g
                </div>
                <div style={{ ...eyebrow(C.sageDark) }}>AI Wellness Reflection</div>
              </div>

              <h2
                style={{
                  ...display(32),
                  maxWidth: 720,
                  marginBottom: 18,
                  lineHeight: 1.2,
                }}
              >
                Your recent patterns suggest steadier recovery, especially in sleep and emotional balance.
              </h2>

              <p
                style={{
                  ...bodyText(16),
                  maxWidth: 700,
                  lineHeight: 1.8,
                  color: C.body,
                }}
              >
                Over the past week, your nervous system appears to be responding well to your consistent routines. Sleep quality has stabilised, and your mood patterns suggest better emotional support. However, your body still seems to benefit from deeper recovery windows — particularly in the evenings and on days when stress rises.
              </p>
            </div>
          </div>

          {/* CURRENT STATE SNAPSHOT */}
<div style={{ marginBottom: 48 }}>
  <div style={{ marginBottom: 22 }}>
    <div style={{ ...eyebrow(C.mute), marginBottom: 10 }}>
      Current state
    </div>

    <h2 style={{ ...display(30), margin: 0 }}>
      Your wellness snapshot
    </h2>
  </div>

  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 16,
    }}
  >
    {[
      {
        label: 'Sleep',
        value: 'Improving',
        note: 'More consistent this week',
      },
      {
        label: 'Stress',
        value: 'Stabilising',
        note: 'Calmer evenings detected',
      },
      {
        label: 'Mood',
        value: 'Supported',
        note: 'Emotional recovery stronger',
      },
      {
        label: 'Energy',
        value: 'Steady',
        note: 'Hydration patterns helping',
      },
    ].map((item) => (
      <div
        key={item.label}
        style={{
          padding: 22,
          borderRadius: 18,
          background: C.paper,
          border: `1px solid ${C.lineSoft}`,
        }}
      >
        <div style={{ ...eyebrow(C.mute), marginBottom: 10 }}>
          {item.label}
        </div>

        <div
          style={{
            fontFamily: FF_DISPLAY,
            fontSize: 24,
            color: C.ink,
            marginBottom: 8,
          }}
        >
          {item.value}
        </div>

        <div style={{ ...bodyText(13) }}>
          {item.note}
        </div>
      </div>
    ))}
  </div>
</div>

          {/* Wellness Priorities */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ marginBottom: 28 }}>
              <div style={{ ...eyebrow(C.mute), marginBottom: 12 }}>
                Your wellness focus
              </div>
              <h2
                style={{
                  ...display(32),
                  margin: 0,
                }}
              >
                Adaptive wellness priorities
              </h2>
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
                return (
                  <div
                    key={priority.id}
                    className="wellness-card fade-up"
                    style={{
                      position: 'relative',
                      overflow: 'hidden',
                      padding: 28,
                      borderRadius: 24,
                      background: priority.bg,
                      border: `1px solid ${C.lineSoft}`,
                      boxShadow: '0 12px 32px -20px rgba(61,74,82,0.10)',
                      animationDelay: `${idx * 0.1}s`,
                    }}
                  >
                    <div
                      className="glow-effect"
                      style={{
                        width: 160,
                        height: 160,
                        background: `rgba(107,158,127,0.08)`,
                        top: -60,
                        right: -40,
                      }}
                    />

                    <div style={{ position: 'relative', zIndex: 2 }}>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: '50%',
                          background: `rgba(${
                            priority.color === C.plum
                              ? '122, 92, 119'
                              : priority.color === C.sage
                              ? '107, 158, 127'
                              : priority.color === C.terracotta
                              ? '168, 90, 61'
                              : '160, 126, 61'
                          }, 0.15)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: 16,
                        }}
                      >
                        <Icon
                          size={20}
                          strokeWidth={1.8}
                          style={{ color: priority.accent }}
                        />
                      </div>

                      <h3
                        style={{
                          ...display(18),
                          marginBottom: 12,
                          fontWeight: 500,
                        }}
                      >
                        {priority.title}
                      </h3>

                      <p
                        style={{
                          ...bodyText(13.5),
                          marginBottom: 18,
                          lineHeight: 1.6,
                          color: C.body,
                          fontStyle: 'italic',
                        }}
                      >
                        {priority.insight}
                      </p>

                      {/* Mini progress ring */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                        }}
                      >
                        <svg
                          width="40"
                          height="40"
                          viewBox="0 0 40 40"
                          style={{ overflow: 'visible' }}
                        >
                          <circle
                            cx="20"
                            cy="20"
                            r="16"
                            fill="none"
                            stroke={`rgba(168, 153, 104, 0.15)`}
                            strokeWidth="2"
                          />
                          <circle
                            cx="20"
                            cy="20"
                            r="16"
                            fill="none"
                            stroke={priority.accent}
                            strokeWidth="2"
                            strokeDasharray={`${(priority.progress / 100) * 100.5} 100.5`}
                            className="progress-ring"
                            style={{
                              transition: 'stroke-dasharray 0.6s ease',
                            }}
                          />
                        </svg>
                        <div
                          style={{
                            fontFamily: FF_UI,
                            fontSize: 12,
                            fontWeight: 600,
                            color: priority.accent,
                          }}
                        >
                          {priority.progress}%
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

           // Wellness priorities data
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

  {/* WHAT GLOWWISE IS NOTICING */}
<div style={{ marginBottom: 56 }}>
  <div style={{ marginBottom: 22 }}>
    <div style={{ ...eyebrow(C.sageDark), marginBottom: 10 }}>
      What GlowWise is noticing
    </div>

    <h2 style={{ ...display(32), margin: 0 }}>
      Your patterns & rhythms
    </h2>
  </div>

  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
    }}
  >
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
        <p
          style={{
            ...bodyText(15),
            lineHeight: 1.8,
            margin: 0,
            color: C.body,
          }}
        >
          {text}
        </p>
      </div>
    ))}
  </div>
</div>

  // Gentle daily actions
  const gentleActions = [
    {
      icon: Sun,
      action: 'Morning sunlight',
      description: 'A few minutes of natural light before 10am helps regulate your nervous system.',
      insight: '↑ Energy steadiness',
    },

          {/* Gentle Daily Actions */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ marginBottom: 28 }}>
              <div style={{ ...eyebrow(C.mute), marginBottom: 12 }}>
                Daily gentle guidance
              </div>
              <h2
                style={{
                  ...display(32),
                  margin: 0,
                }}
              >
                Soft actions to support yourself
              </h2>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 18,
              }}
            >
              {gentleActions.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <div
                    key={idx}
                    className="fade-up"
                    style={{
                      position: 'relative',
                      overflow: 'hidden',
                      padding: 28,
                      borderRadius: 20,
                      background: C.paper,
                      border: `1px solid ${C.lineSoft}`,
                      boxShadow: '0 8px 24px -16px rgba(61,74,82,0.08)',
                      animationDelay: `${idx * 0.12}s`,
                    }}
                  >
                    <div
                      className="glow-effect"
                      style={{
                        width: 140,
                        height: 140,
                        background: 'rgba(107,158,127,0.06)',
                        top: -50,
                        right: -30,
                      }}
                    />

                    <div style={{ position: 'relative', zIndex: 2 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          marginBottom: 14,
                        }}
                      >
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            background: 'rgba(107,158,127,0.12)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Icon
                            size={18}
                            strokeWidth={1.8}
                            style={{ color: C.sage }}
                          />
                        </div>
                        <h3
                          style={{
                            ...bodyText(14),
                            fontWeight: 600,
                            margin: 0,
                          }}
                        >
                          {action.action}
                        </h3>
                      </div>

                      <p
                        style={{
                          ...bodyText(13.5),
                          marginBottom: 14,
                          lineHeight: 1.7,
                          color: C.body,
                        }}
                      >
                        {action.description}
                      </p>

                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '6px 12px',
                          borderRadius: 100,
                          background: 'rgba(107,158,127,0.10)',
                          fontFamily: FF_UI,
                          fontSize: 11.5,
                          fontWeight: 600,
                          color: C.sageDark,
                        }}
                      >
                        {action.insight}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pattern Insights */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ marginBottom: 28 }}>
              <div style={{ ...eyebrow(C.mute), marginBottom: 12 }}>
                Wellness observations
              </div>
              <h2
                style={{
                  ...display(32),
                  margin: 0,
                }}
              >
                What your patterns reveal
              </h2>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              {insights.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="fade-up"
                    style={{
                      position: 'relative',
                      overflow: 'hidden',
                      padding: 28,
                      borderRadius: 22,
                      background: C.paper,
                      border: `1px solid ${C.lineSoft}`,
                      boxShadow: '0 8px 20px -16px rgba(61,74,82,0.06)',
                      display: 'flex',
                      gap: 20,
                      alignItems: 'flex-start',
                      animationDelay: `${idx * 0.12}s`,
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: 'rgba(107,158,127,0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon
                        size={20}
                        strokeWidth={1.8}
                        style={{ color: C.sage }}
                      />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          ...eyebrow(C.sage),
                          marginBottom: 8,
                        }}
                      >
                        {item.pattern}
                      </div>
                      <p
                        style={{
                          ...bodyText(15),
                          lineHeight: 1.7,
                          margin: 0,
                          color: C.body,
                        }}
                      >
                        {item.observation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weekly Reflection */}
          <div
            className="fade-up"
            style={{
              position: 'relative',
              overflow: 'hidden',
              padding: 48,
              borderRadius: 32,
              background: `linear-gradient(135deg, rgba(107,158,127,0.08) 0%, rgba(237,226,236,0.38) 100%)`,
              border: `1px solid ${C.lineSoft}`,
              textAlign: 'center',
            }}
          >
            <div
              className="glow-effect"
              style={{
                width: 320,
                height: 320,
                background: 'rgba(107,158,127,0.08)',
                top: -100,
                right: -60,
              }}
            />

            <div style={{ position: 'relative', zIndex: 2 }}>
              <div
                style={{
                  ...eyebrow(C.sageDark),
                  marginBottom: 18,
                  letterSpacing: '0.12em',
                }}
              >
                Weekly reflection
              </div>

              <h2
                style={{
                  ...display(36),
                  maxWidth: 800,
                  margin: '0 auto 20px',
                  lineHeight: 1.2,
                }}
              >
                This week, your body seemed more{' '}
                <em style={{ fontStyle: 'italic', color: C.sage }}>
                  emotionally supported.
                </em>
              </h2>

              <p
                style={{
                  ...bodyText(16),
                  maxWidth: 680,
                  margin: '0 auto',
                  lineHeight: 1.8,
                  color: C.body,
                }}
              >
                Your check-ins show steadier emotional patterns and improved sleep consistency. This suggests your current routines are supporting your nervous system well. As you continue these gentle practices, notice how your energy and mood respond — your body's feedback is the most honest measure of what helps.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
