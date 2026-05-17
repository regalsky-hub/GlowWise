import React from 'react';
import { useUserData } from '../context/UserDataContext';
import AppLayout from './AppLayout';
import { Heart, Zap, Moon, TrendingUp, BookOpen, Lightbulb } from 'lucide-react';

export default function GlowType() {
  const { profile, loading } = useUserData();

  if (loading) {
    return (
      <AppLayout>
        <div style={{ padding: '40px', textAlign: 'center', color: '#A89968' }}>
          Loading your glow type...
        </div>
      </AppLayout>
    );
  }

  // Color palette
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

  // Glow Type Data
  const glowTypes = {
    'The Steady Bloomer': {
      description: 'People with this pattern thrive on routine and small, consistent rituals. Big swings typically drain them — gentle daily care compounds beautifully.',
      icon: Moon,
      color: C.sage,
      bg: C.sageMint,
      characteristics: ['Sleep-led', 'Consistency', 'Soft mornings', 'Predictable rhythms'],
      support: [
        {
          title: 'Create non-negotiable routines',
          description: 'A stable nervous system thrives on predictability. Consistent bed/wake times, meals, and movement windows reduce decision fatigue.',
        },
        {
          title: 'Gentle layering over intensity',
          description: 'Small daily practices (5 min breathing, 10 min walks) compound more than occasional intense efforts. Consistency beats occasional extremes.',
        },
        {
          title: 'Sleep is your anchor',
          description: 'Quality sleep stabilises everything else. Protect sleep above flashy wellness trends — it\'s your foundation.',
        },
        {
          title: 'Soft transitions matter',
          description: 'Abrupt changes create stress. Build buffer time between activities and ease into your day rather than jolting awake.',
        },
      ],
      insights: [
        'Energy stabilises most when sleep is consistent',
        'Steady mood improvement emerges with predictable routines over weeks, not days',
        'Stress peaks noticeably during unpredictable or high-change periods',
      ],
      resources: [
        { title: 'Sleep consistency guide', icon: Moon },
        { title: 'Building sustainable morning rituals', icon: Lightbulb },
        { title: 'Nervous system stability through routine', icon: TrendingUp },
      ],
    },
    'The Energy Optimizer': {
      description: 'People with this pattern need variety and stimulation to thrive. Monotony typically drains them — diverse movement, novelty, and change energise deeply.',
      icon: Zap,
      color: C.amber,
      bg: C.amberBg,
      characteristics: ['Movement-varied', 'Novel stimulation', 'Dynamic energy', 'Exploration-driven'],
      support: [
        {
          title: 'Mix movement modalities',
          description: 'Rotate between strength, cardio, flexibility, and dance. Monotonous routines deplete energy quickly for this pattern.',
        },
        {
          title: 'Embrace novelty',
          description: 'Try new activities, change routes, vary environments. A nervous system that craves input needs consistent new stimulus.',
        },
        {
          title: 'Schedule recovery strategically',
          description: 'High energy output requires intentional rest. Build restorative days between intense periods to prevent depletion.',
        },
        {
          title: 'Social movement amplifies',
          description: 'Group activities, classes, and outdoor movement with others create multiplicative energy gains.',
        },
      ],
      insights: [
        'Energy peaks noticeably when activities are varied and novel',
        'Stress levels decrease with higher movement frequency and diversity',
        'Mood is brightest on days featuring both novelty and exploration',
      ],
      resources: [
        { title: 'Movement variety guide', icon: Zap },
        { title: 'Building stimulation into routines', icon: Lightbulb },
        { title: 'Recovery for high-energy types', icon: Heart },
      ],
    },
    'The Sensitive Nurturer': {
      description: 'People with this pattern need deep calm and gentle transitions. They feel acutely — the skill is learning to protect that sensitivity as an asset.',
      icon: Heart,
      color: C.plum,
      bg: C.plumBg,
      characteristics: ['Deeply intuitive', 'Needs calm', 'Sensitive to environment', 'Gentle pace'],
      support: [
        {
          title: 'Protect your nervous system',
          description: 'Manage overstimulation strategically: limit screen time, seek quiet spaces, curate your social circle with intention.',
        },
        {
          title: 'Honour your processing time',
          description: 'Processing emotions and experiences takes longer for this pattern. Build in solitude and reflection time without guilt.',
        },
        {
          title: 'Environmental design matters deeply',
          description: 'Soft lighting, natural textures, minimal clutter, and calming scents directly affect wellbeing. Environment is medicine.',
        },
        {
          title: 'Quality over quantity always',
          description: 'Fewer, more meaningful activities sustain you. Deep friendships matter more than broad networks.',
        },
      ],
      insights: [
        'Stress is triggered by overstimulation and harsh environmental inputs',
        'Sleep quality improves dramatically with calm, intentional evening routines',
        'Emotional balance emerges from adequate alone time, not social pushes',
      ],
      resources: [
        { title: 'Creating a calm nervous system', icon: Moon },
        { title: 'Boundary-setting for sensitive types', icon: Lightbulb },
        { title: 'Intuition as a wellness tool', icon: Heart },
      ],
    },
    'The Resilient Achiever': {
      description: "People with this pattern are driven and goal-oriented with deep reserves of energy. The key insight: recovery is fuel, not laziness.",
      icon: TrendingUp,
      color: C.terracotta,
      bg: C.terracottaBg,
      characteristics: ['Goal-driven', 'High capacity', 'Recovery-blind', 'Ambitious'],
      support: [
        {
          title: 'Schedule recovery like meetings',
          description: 'Drive often overrides rest signals. Block recovery time as non-negotiable calendar commitments to protect it.',
        },
        {
          title: 'Track recovery metrics',
          description: 'Monitor sleep, mood, and stress data. Performance often drops before this pattern consciously feels tired.',
        },
        {
          title: 'Build in deload weeks',
          description: 'Every 4–6 weeks, intentionally reduce intensity. Bodies need periodic deep recovery to maintain long-term capacity.',
        },
        {
          title: 'Reframe rest as performance',
          description: 'Recovery amplifies next-cycle output. Rest is productive, not indulgent — it compounds your long-term results.',
        },
      ],
      insights: [
        'Stress accumulates gradually — often undetectable until a threshold is crossed',
        'Sleep quality directly predicts next-cycle performance and decision-making',
        'Recovery weeks prevent burnout and maintain capacity over years, not just weeks',
      ],
      resources: [
        { title: 'Strategic recovery for achievers', icon: TrendingUp },
        { title: 'Recognising burnout signals early', icon: Lightbulb },
        { title: 'Building sustainable ambition', icon: Heart },
      ],
    },
    'The Intuitive Explorer': {
      description: "People with this pattern are deeply body-aware and trust their inner knowing. The skill: tuning into subtle signals and acting without overthinking.",
      icon: Lightbulb,
      color: C.sage,
      bg: C.sageMint,
      characteristics: ['Body-aware', 'Intuitive', 'Flexible approach', 'Inner-directed'],
      support: [
        {
          title: 'Trust your body signals',
          description: 'This pattern senses what\'s needed before data confirms it. Following intuition typically leads to better choices.',
        },
        {
          title: 'Embrace flexibility',
          description: 'Rigid plans restrict this pattern. Build frameworks, not rules. Let wellness adapt daily based on what\'s genuinely needed.',
        },
        {
          title: 'Movement as conversation',
          description: 'Move what needs moving. Sometimes intense, sometimes gentle — honour what your body actually requests each day.',
        },
        {
          title: 'Integrate mind-body practices',
          description: 'Yoga, tai chi, somatic work, and breathwork naturally amplify the intuitive abilities this pattern possesses.',
        },
      ],
      insights: [
        'Wellness thrives with intuitive, flexible approaches rather than rigid protocols',
        'This pattern often senses patterns before they become measurable in data',
        'Body-aware practices deepen existing natural intuitive abilities',
      ],
      resources: [
        { title: 'Somatic awareness practices', icon: Heart },
        { title: 'Flexible wellness frameworks', icon: Lightbulb },
        { title: 'Trusting your body intelligence', icon: Moon },
      ],
    },
    'The Community Connector': {
      description: "People with this pattern are energised by connection and community. Isolation typically depletes them — movement and interaction with others is their natural medicine.",
      icon: BookOpen,
      color: C.amber,
      bg: C.amberBg,
      characteristics: ['Community-driven', 'Socially energised', 'Movement-based', 'Connection-seeking'],
      support: [
        {
          title: 'Prioritise group movement',
          description: 'Classes, group hikes, sports, partner yoga — this pattern thrives when movement combines with community.',
        },
        {
          title: 'Build accountability circles',
          description: 'Commitment with friends boosts motivation exponentially. Social accountability creates consistency for this pattern.',
        },
        {
          title: 'Make rest restorative and social',
          description: 'Solo rest can feel depleting. Create restorative social time: gentle group yoga, friend coffee, community events.',
        },
        {
          title: 'Cultivate meaningful connection',
          description: 'Not all social time is equal. Deep friendships and quality community impact wellbeing far more than casual connection.',
        },
      ],
      insights: [
        'Energy peaks noticeably on days with social movement or meaningful connection',
        'Isolation triggers rapid mood decline and low energy for this pattern',
        'Community accountability dramatically boosts consistency and follow-through',
      ],
      resources: [
        { title: 'Finding your wellness community', icon: Heart },
        { title: 'Group-based wellness practices', icon: Zap },
        { title: 'Social accountability for consistency', icon: TrendingUp },
      ],
    },
  };

  // Check if type is forming (< 5 check-ins)
  const checkInCount = profile?.checkIns?.length || 0;
  const isTypeForming = checkInCount < 5;

  const userGlowType = profile?.glowType || 'The Steady Bloomer';
  const glowTypeData = glowTypes[userGlowType] || glowTypes['The Steady Bloomer'];
  const TypeIcon = glowTypeData.icon;

  if (isTypeForming) {
    return (
      <AppLayout>
        <div style={{ background: C.paper, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
          <style>{`
            .fade-up { animation: fu 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
            @keyframes fu { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
          `}</style>
          <div
            className="fade-up"
            style={{
              maxWidth: 500,
              textAlign: 'center',
              padding: '60px 40px',
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: C.sageMint,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 32px',
              }}
            >
              <Moon size={40} color={C.sage} strokeWidth={1.5} />
            </div>
            <h1 style={{ ...display(32), margin: '0 0 16px 0' }}>
              Your type is forming
            </h1>
            <p style={{ ...bodyText(16), color: C.body, margin: '0 0 24px 0' }}>
              We're learning how you naturally thrive. After a few more check-ins, we'll understand your patterns and show you a type tailored to how your body actually works.
            </p>
            <p style={{ ...bodyText(14), color: C.mute, margin: 0 }}>
              You've completed {checkInCount} check-in{checkInCount !== 1 ? 's' : ''}. A few more will give us a clear picture.
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

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
            background: `linear-gradient(135deg, ${glowTypeData.bg} 0%, rgba(250,248,245,0.95) 100%)`,
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
            <div style={{ ...eyebrow(glowTypeData.color), marginBottom: 16 }}>
              Your wellness archetype
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                marginBottom: 12,
              }}
            >
              <TypeIcon size={48} color={glowTypeData.color} strokeWidth={1.5} />
              <h1
                style={{
                  ...display(56),
                  margin: 0,
                  maxWidth: 700,
                }}
              >
                You are{' '}
                <em style={{ fontStyle: 'italic', color: glowTypeData.color }}>
                  {userGlowType}
                </em>
              </h1>
            </div>
            <p
              style={{
                ...bodyText(16),
                maxWidth: 700,
                color: C.body,
              }}
            >
              {glowTypeData.description}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 40px' }}>
          {/* Key Characteristics */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ ...eyebrow(C.mute), marginBottom: 8 }}>What defines you</div>
              <h2 style={{ ...display(32), margin: 0 }}>Key characteristics</h2>
            </div>

            <div
              style={{
                display: 'flex',
                gap: 12,
                flexWrap: 'wrap',
              }}
            >
              {glowTypeData.characteristics.map((char, i) => (
                <div
                  key={i}
                  className="fade-up"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '10px 16px',
                    borderRadius: 100,
                    background: glowTypeData.bg,
                    border: `1px solid ${C.lineSoft}`,
                    fontFamily: FF_UI,
                    fontSize: 13,
                    fontWeight: 600,
                    color: glowTypeData.color,
                    animationDelay: `${i * 0.08}s`,
                  }}
                >
                  {char}
                </div>
              ))}
            </div>
          </div>

          {/* How to Support This Type */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ ...eyebrow(C.mute), marginBottom: 8 }}>Your practice</div>
              <h2 style={{ ...display(32), margin: 0 }}>How to support your type</h2>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 20,
              }}
            >
              {glowTypeData.support.map((item, i) => (
                <div
                  key={i}
                  className="fade-up"
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    padding: '28px',
                    borderRadius: 20,
                    background: C.paper,
                    border: `1px solid ${C.lineSoft}`,
                    boxShadow: '0 8px 24px -16px rgba(61,74,82,0.08)',
                    animationDelay: `${i * 0.1}s`,
                  }}
                >
                  <h3
                    style={{
                      ...display(18),
                      marginBottom: 12,
                      fontWeight: 500,
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      ...bodyText(14),
                      margin: 0,
                      lineHeight: 1.7,
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Pattern Insights */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ ...eyebrow(C.mute), marginBottom: 8 }}>Your data</div>
              <h2 style={{ ...display(32), margin: 0 }}>What this type typically experiences</h2>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 16,
              }}
            >
              {glowTypeData.insights.map((insight, i) => (
                <div
                  key={i}
                  className="fade-up"
                  style={{
                    padding: '24px',
                    borderRadius: 18,
                    background: glowTypeData.bg,
                    border: `1px solid ${C.lineSoft}`,
                    animationDelay: `${i * 0.08}s`,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 12,
                    }}
                  >
                    <TrendingUp size={16} style={{ color: glowTypeData.color }} strokeWidth={2} />
                    <div style={{ ...eyebrow(glowTypeData.color) }}>Pattern</div>
                  </div>
                  <p
                    style={{
                      ...bodyText(14),
                      margin: 0,
                      lineHeight: 1.6,
                      color: C.body,
                    }}
                  >
                    {insight}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div className="fade-up">
            <div style={{ marginBottom: 24 }}>
              <div style={{ ...eyebrow(C.mute), marginBottom: 8 }}>Learn more</div>
              <h2 style={{ ...display(32), margin: 0 }}>Resources for your type</h2>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 16,
              }}
            >
              {glowTypeData.resources.map((resource, i) => {
                const Icon = resource.icon;
                return (
                  <div
                    key={i}
                    style={{
                      position: 'relative',
                      overflow: 'hidden',
                      padding: '24px',
                      borderRadius: 18,
                      background: C.paper,
                      border: `1px solid ${C.lineSoft}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(61,74,82,0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        marginBottom: 12,
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          background: glowTypeData.bg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon size={18} strokeWidth={1.8} style={{ color: glowTypeData.color }} />
                      </div>
                      <div
                        style={{
                          ...bodyText(13),
                          fontWeight: 600,
                          color: C.ink,
                        }}
                      >
                        {resource.title}
                      </div>
                    </div>
                    <p
                      style={{
                        ...bodyText(12),
                        color: C.body,
                        margin: 0,
                      }}
                    >
                      Personalised guidance for your type
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer CTA */}
          <div
            className="fade-up"
            style={{
              marginTop: 48,
              padding: '36px',
              borderRadius: 24,
              background: `linear-gradient(135deg, ${glowTypeData.bg} 0%, rgba(250,248,245,0.95) 100%)`,
              border: `1px solid ${C.lineSoft}`,
              textAlign: 'center',
            }}
          >
            <h2
              style={{
                ...display(28),
                margin: '0 0 12px 0',
              }}
            >
              Live into your type.
            </h2>
            <p
              style={{
                ...bodyText(15),
                margin: 0,
                color: C.body,
              }}
            >
              The more you understand how you naturally thrive, the easier wellness becomes. Use these insights to build practices that feel like home, not homework.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
