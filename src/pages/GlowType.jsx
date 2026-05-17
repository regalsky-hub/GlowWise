import React from 'react';
import AppLayout from './AppLayout';
import { Heart, Zap, Moon, TrendingUp, BookOpen, Lightbulb } from 'lucide-react';

export default function GlowTypesOverview() {
  // Color palette
  const C = {
    paper: '#FAF8F5',
    ink: '#3D4A52',
    body: '#5A6770',
    mute: '#A89968',
    sage: '#6B9E7F',
    sageMint: '#EDF4EF',
    plum: '#7A5C77',
    plumBg: '#EDE2EC',
    terracotta: '#A85A3D',
    terracottaBg: '#F5DDD0',
    amber: '#A07E3D',
    amberBg: '#FAF3DC',
    lineSoft: 'rgba(168, 153, 104, 0.10)',
  };

  const FF_DISPLAY = "'Fraunces', Georgia, serif";
  const FF_UI = "'Manrope', system-ui, sans-serif";

  const eyebrow = (color = C.mute) => ({
    fontFamily: FF_UI,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color,
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

  // All Glow Types
  const glowTypes = [
    {
      name: 'The Steady Bloomer',
      icon: Moon,
      color: C.sage,
      bg: C.sageMint,
      shortDescription: 'Thrives on routine and consistency. Small daily rituals compound beautifully.',
      fullDescription: 'People with this pattern thrive on routine and small, consistent rituals. Big swings typically drain them — gentle daily care compounds beautifully. Sleep-led, predictable, and stabilised by consistency.',
    },
    {
      name: 'The Energy Optimizer',
      icon: Zap,
      color: C.amber,
      bg: C.amberBg,
      shortDescription: 'Needs variety and stimulation to thrive. Monotony drains energy quickly.',
      fullDescription: 'People with this pattern need variety and stimulation to thrive. Monotony typically drains them — diverse movement, novelty, and change energise deeply. Dynamic, exploratory, and driven by new input.',
    },
    {
      name: 'The Sensitive Nurturer',
      icon: Heart,
      color: C.plum,
      bg: C.plumBg,
      shortDescription: 'Needs deep calm and protection. Feels acutely — sensitivity is an asset.',
      fullDescription: 'People with this pattern need deep calm and gentle transitions. They feel acutely — the skill is learning to protect that sensitivity as an asset. Intuitive, environment-aware, and grounded in quality over quantity.',
    },
    {
      name: 'The Resilient Achiever',
      icon: TrendingUp,
      color: C.terracotta,
      bg: C.terracottaBg,
      shortDescription: 'Driven and goal-oriented with deep reserves. Recovery is fuel, not laziness.',
      fullDescription: 'People with this pattern are driven and goal-oriented with deep reserves of energy. The key insight: recovery is fuel, not laziness. Ambitious, capable, and prone to override rest signals.',
    },
    {
      name: 'The Intuitive Explorer',
      icon: Lightbulb,
      color: C.sage,
      bg: C.sageMint,
      shortDescription: 'Deeply body-aware and trusting of inner knowing. Acts without overthinking.',
      fullDescription: 'People with this pattern are deeply body-aware and trust their inner knowing. The skill: tuning into subtle signals and acting without overthinking. Flexible, intuitive, and naturally aligned with their needs.',
    },
    {
      name: 'The Community Connector',
      icon: BookOpen,
      color: C.amber,
      bg: C.amberBg,
      shortDescription: 'Energised by connection and community. Movement with others is natural medicine.',
      fullDescription: 'People with this pattern are energised by connection and community. Isolation typically depletes them — movement and interaction with others is their natural medicine. Social, accountable, and thriving in groups.',
    },
  ];

  return (
    <AppLayout>
      <style>{`
        .fade-up { animation: fu 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
        @keyframes fu { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .glow-effect {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          pointer-events: none;
        }
      `}</style>

      <div style={{ background: C.paper, minHeight: '100vh', paddingBottom: 80 }}>
        {/* Hero Section */}
        <div
          className="fade-up"
          style={{
            position: 'relative',
            overflow: 'hidden',
            padding: '64px 48px',
            background: `linear-gradient(135deg, ${C.sageMint} 0%, rgba(250,248,245,0.95) 100%)`,
            border: `1px solid ${C.lineSoft}`,
            borderTop: 'none',
          }}
        >
          <div
            className="glow-effect"
            style={{
              width: 360,
              height: 360,
              background: `rgba(107,158,127,0.08)`,
              top: -120,
              right: -60,
            }}
          />

          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ ...eyebrow(C.sage), marginBottom: 16 }}>
              Understanding your wellness
            </div>
            <h1
              style={{
                ...display(56),
                margin: '0 0 16px 0',
                maxWidth: 700,
              }}
            >
              What are Glow Types?
            </h1>
            <p
              style={{
                ...bodyText(16),
                maxWidth: 700,
                color: C.body,
                lineHeight: 1.8,
              }}
            >
              Everyone has a natural rhythm and pattern for thriving. Glow Types map how you naturally function — your energy needs, your pace, what depletes you, and what compounds beautifully. There's no "best" type. There's only what works for your unique body and life.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 40px' }}>
          {/* Framework Explanation */}
          <div style={{ marginBottom: 64 }}>
            <div style={{ marginBottom: 32 }}>
              <div style={{ ...eyebrow(C.mute), marginBottom: 8 }}>How it works</div>
              <h2 style={{ ...display(36), margin: 0 }}>Six patterns of thriving</h2>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: 24,
                marginBottom: 48,
              }}
            >
              <div
                className="fade-up"
                style={{
                  padding: '32px',
                  borderRadius: 20,
                  background: C.paper,
                  border: `1px solid ${C.lineSoft}`,
                  boxShadow: '0 8px 24px -16px rgba(61,74,82,0.08)',
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: C.sageMint,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                  }}
                >
                  <Moon size={24} color={C.sage} strokeWidth={1.5} />
                </div>
                <h3 style={{ ...display(18), margin: '0 0 12px 0', fontWeight: 500 }}>
                  Personalised to you
                </h3>
                <p style={{ ...bodyText(14), margin: 0, lineHeight: 1.7 }}>
                  Your type emerges from your check-in patterns — sleep, energy, mood, movement. Real data about how you actually function, not guesses.
                </p>
              </div>

              <div
                className="fade-up"
                style={{
                  padding: '32px',
                  borderRadius: 20,
                  background: C.paper,
                  border: `1px solid ${C.lineSoft}`,
                  boxShadow: '0 8px 24px -16px rgba(61,74,82,0.08)',
                  animationDelay: '0.08s',
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: C.amberBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                  }}
                >
                  <Zap size={24} color={C.amber} strokeWidth={1.5} />
                </div>
                <h3 style={{ ...display(18), margin: '0 0 12px 0', fontWeight: 500 }}>
                  Actionable insights
                </h3>
                <p style={{ ...bodyText(14), margin: 0, lineHeight: 1.7 }}>
                  Once you have your type, you get specific practices tailored to how you naturally thrive — not generic wellness advice.
                </p>
              </div>

              <div
                className="fade-up"
                style={{
                  padding: '32px',
                  borderRadius: 20,
                  background: C.paper,
                  border: `1px solid ${C.lineSoft}`,
                  boxShadow: '0 8px 24px -16px rgba(61,74,82,0.08)',
                  animationDelay: '0.16s',
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: C.plumBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                  }}
                >
                  <Heart size={24} color={C.plum} strokeWidth={1.5} />
                </div>
                <h3 style={{ ...display(18), margin: '0 0 12px 0', fontWeight: 500 }}>
                  Honest framing
                </h3>
                <p style={{ ...bodyText(14), margin: 0, lineHeight: 1.7 }}>
                  No mystical language. No hierarchies. Just patterns about how people with your profile typically experience wellness.
                </p>
              </div>
            </div>
          </div>

          {/* All Types Grid */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ marginBottom: 32 }}>
              <div style={{ ...eyebrow(C.mute), marginBottom: 8 }}>The six types</div>
              <h2 style={{ ...display(36), margin: 0 }}>Find yourself in these patterns</h2>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                gap: 24,
              }}
            >
              {glowTypes.map((type, i) => {
                const Icon = type.icon;
                return (
                  <div
                    key={i}
                    className="fade-up"
                    style={{
                      position: 'relative',
                      overflow: 'hidden',
                      padding: '32px',
                      borderRadius: 24,
                      background: type.bg,
                      border: `1px solid ${C.lineSoft}`,
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      cursor: 'pointer',
                      animationDelay: `${i * 0.06}s`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.boxShadow = '0 16px 32px rgba(61,74,82,0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* Icon */}
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        background: C.paper,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 16,
                      }}
                    >
                      <Icon size={28} color={type.color} strokeWidth={1.5} />
                    </div>

                    {/* Type Name */}
                    <h3
                      style={{
                        ...display(20),
                        margin: '0 0 12px 0',
                        color: type.color,
                        fontWeight: 500,
                      }}
                    >
                      {type.name}
                    </h3>

                    {/* Short Description */}
                    <p
                      style={{
                        ...bodyText(14),
                        margin: '0 0 16px 0',
                        lineHeight: 1.7,
                        color: C.body,
                        fontWeight: 500,
                      }}
                    >
                      {type.shortDescription}
                    </p>

                    {/* Full Description */}
                    <p
                      style={{
                        ...bodyText(13),
                        margin: 0,
                        lineHeight: 1.7,
                        color: C.body,
                      }}
                    >
                      {type.fullDescription}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA Section */}
          <div
            className="fade-up"
            style={{
              marginTop: 64,
              padding: '48px',
              borderRadius: 28,
              background: `linear-gradient(135deg, ${C.sageMint} 0%, rgba(250,248,245,0.95) 100%)`,
              border: `1px solid ${C.lineSoft}`,
              textAlign: 'center',
            }}
          >
            <h2
              style={{
                ...display(32),
                margin: '0 0 16px 0',
              }}
            >
              Which one feels like home?
            </h2>
            <p
              style={{
                ...bodyText(15),
                margin: '0 0 32px 0',
                color: C.body,
                maxWidth: 600,
              }}
            >
              Answer a few check-in questions, and we'll identify your type. The more data you share, the more accurate and useful your insights become.
            </p>
            <button
              style={{
                padding: '14px 32px',
                borderRadius: 12,
                background: C.sage,
                color: C.paper,
                border: 'none',
                fontFamily: FF_UI,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = C.sageDark;
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = C.sage;
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Start your first check-in
            </button>
          </div>

          {/* Footer Info */}
          <div
            style={{
              marginTop: 48,
              padding: '24px',
              textAlign: 'center',
              borderTop: `1px solid ${C.lineSoft}`,
            }}
          >
            <p style={{ ...bodyText(12), color: C.mute, margin: 0 }}>
              You'll need about 5 check-ins before your type is clear. After that, your type may shift slightly as you provide more data — that's normal and helpful.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
