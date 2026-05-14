import React from 'react';
import { useUserData } from '../context/UserDataContext';
import AppLayout from './AppLayout';
import { Heart, Zap, Moon, TrendingUp, BookOpen, Lightbulb } from 'lucide-react';

export default function GlowType() {
  const { profile, analyzeEnergyTrend, analyzeSleepTrend, analyzeStressTrend, analyzeMoodTrend, loading } = useUserData();

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
      description: 'You thrive on routine and small, consistent rituals. Big swings drain you — gentle daily care compounds beautifully.',
      icon: '🌱',
      color: C.sage,
      bg: C.sageMint,
      characteristics: ['Sleep-led', 'Consistency', 'Soft mornings', 'Predictable rhythms'],
      support: [
        {
          title: 'Create non-negotiable routines',
          description: 'Your nervous system loves predictability. Set consistent bed/wake times, meal times, and movement windows.',
        },
        {
          title: 'Gentle layering over intensity',
          description: 'Small daily practices (5 min breathing, 10 min walks) compound more than occasional intense efforts.',
        },
        {
          title: 'Sleep is your anchor',
          description: 'Prioritize sleep quality above all — it stabilises everything else for your type.',
        },
        {
          title: 'Soft transitions matter',
          description: 'Abrupt changes stress you. Build in buffer time between activities and ease into your day.',
        },
      ],
      insights: [
        'Your energy is most stable when sleep is consistent',
        'You show steady mood improvement with predictable routines',
        'Stress peaks during unpredictable or high-change periods',
      ],
      resources: [
        { title: 'Sleep consistency guide', icon: Moon },
        { title: 'Building sustainable morning rituals', icon: Lightbulb },
        { title: 'Nervous system stability through routine', icon: TrendingUp },
      ],
    },
    'The Energy Optimizer': {
      description: 'You need variety and stimulation to thrive. Monotony drains you — diverse movement, novelty, and change energise deeply.',
      icon: '⚡',
      color: C.amber,
      bg: C.amberBg,
      characteristics: ['Movement-varied', 'Novel stimulation', 'Dynamic energy', 'Exploration-driven'],
      support: [
        {
          title: 'Mix movement modalities',
          description: 'Rotate between strength, cardio, flexibility, and dance. Monotonous routines drain your energy.',
        },
        {
          title: 'Embrace novelty',
          description: 'Try new activities, change your routes, vary your environment. Your nervous system craves new input.',
        },
        {
          title: 'Schedule recovery strategically',
          description: 'High energy needs intentional rest. Build in restorative days between intense periods.',
        },
        {
          title: 'Social movement amplifies',
          description: 'Group activities, classes, or outdoor movement with others boost your energy exponentially.',
        },
      ],
      insights: [
        'Your energy peaks when activities are varied and new',
        'Stress decreases with higher movement frequency and diversity',
        'Mood is brightest on days with novelty and exploration',
      ],
      resources: [
        { title: 'Movement variety guide', icon: Zap },
        { title: 'Building stimulation into routines', icon: Lightbulb },
        { title: 'Recovery for high-energy types', icon: Heart },
      ],
    },
    'The Sensitive Nurturer': {
      description: 'You need deep calm and gentle transitions. You feel everything acutely — your superpower is intuition, your need is protection.',
      icon: '🌿',
      color: C.plum,
      bg: C.plumBg,
      characteristics: ['Deeply intuitive', 'Needs calm', 'Sensitive to environment', 'Gentle pace'],
      support: [
        {
          title: 'Protect your nervous system',
          description: 'Limit overstimulation: manage screen time, choose quiet spaces, curate your social circle.',
        },
        {
          title: 'Honour your processing time',
          description: 'You need longer to process emotions and experiences. Build in solitude and reflection time.',
        },
        {
          title: 'Environmental design matters',
          description: 'Soft lighting, natural textures, minimal clutter, calming scents — your space affects your wellbeing deeply.',
        },
        {
          title: 'Nourish with intention',
          description: 'Quality over quantity. Fewer, more meaningful activities. Deep friendships over broad networks.',
        },
      ],
      insights: [
        'Your stress is triggered by overstimulation and harsh environments',
        'Sleep quality improves dramatically with calm evening routines',
        'Emotional balance comes from adequate alone time',
      ],
      resources: [
        { title: 'Creating a calm nervous system', icon: Moon },
        { title: 'Boundary-setting for sensitive types', icon: Lightbulb },
        { title: 'Intuition as a wellness tool', icon: Heart },
      ],
    },
    'The Resilient Achiever': {
      description: "You are driven and goal-oriented, with deep reserves of energy. Your challenge: remembering recovery is not laziness, it is fuel.",
      icon: '🔥',
      color: C.terracotta,
      bg: C.terracottaBg,
      characteristics: ['Goal-driven', 'High capacity', 'Recovery-blind', 'Ambitious'],
      support: [
        {
          title: 'Schedule recovery like meetings',
          description: 'Your drive can override rest signals. Block recovery time as non-negotiable appointments.',
        },
        {
          title: 'Track recovery metrics',
          description: 'Monitor sleep, mood, and stress. Often you will notice performance drops before you feel tired.',
        },
        {
          title: 'Build in deload weeks',
          description: 'Every 4-6 weeks, intentionally reduce intensity. Your body needs periodic deep recovery.',
        },
        {
          title: 'Reframe rest as performance',
          description: 'Recovery amplifies next-cycle performance. Rest is productive, not indulgent.',
        },
      ],
      insights: [
        'Your stress builds gradually — you\'re often unaware until collapse',
        'Sleep quality directly impacts your next-cycle performance',
        'Recovery weeks prevent burnout and maintain long-term capacity',
      ],
      resources: [
        { title: 'Strategic recovery for achievers', icon: TrendingUp },
        { title: 'Recognising burnout signals', icon: Lightbulb },
        { title: 'Building sustainable ambition', icon: Heart },
      ],
    },
    'The Intuitive Healer': {
      description: "You are deeply body-aware and trust your inner knowing. Your gift: tuning into subtle signals. Your practice: trusting without overthinking.",
      icon: '💫',
      color: C.sage,
      bg: C.sageMint,
      characteristics: ['Body-aware', 'Intuitive', 'Flexible approach', 'Inner-directed'],
      support: [
        {
          title: 'Trust your body signals',
          description: 'You sense what you need before data confirms it. Follow your intuition — it\'s usually right.',
        },
        {
          title: 'Embrace flexibility',
          description: 'Rigid plans don\'t suit you. Build frameworks, not rules. Let your wellness adapt daily.',
        },
        {
          title: 'Movement as conversation',
          description: 'Move what needs moving. Sometimes intense, sometimes gentle — listen to what your body requests.',
        },
        {
          title: 'Integrate mind-body practices',
          description: 'Yoga, tai chi, somatic work, breathwork — these amplify your natural intuitive abilities.',
        },
      ],
      insights: [
        'Your wellness thrives with intuitive, flexible approaches',
        'You often sense patterns before they\'re measurable',
        'Body-aware practices deepen your natural gifts',
      ],
      resources: [
        { title: 'Somatic awareness practices', icon: Heart },
        { title: 'Flexible wellness frameworks', icon: Lightbulb },
        { title: 'Trusting your body intelligence', icon: Moon },
      ],
    },
    'The Social Butterfly': {
      description: "You are energised by connection and community. Isolation depletes you — movement with others is your natural medicine.",
      icon: '🦋',
      color: C.amber,
      bg: C.amberBg,
      characteristics: ['Community-driven', 'Socially energised', 'Movement-based', 'Connection-seeking'],
      support: [
        {
          title: 'Prioritise group movement',
          description: 'Classes, group hikes, sports, partner yoga — you thrive with movement + community.',
        },
        {
          title: 'Build accountability circles',
          description: 'Commit with friends. Your motivation soars with social accountability and shared goals.',
        },
        {
          title: 'Solo rest is harder for you',
          description: 'Create restorative social time: gentle group yoga, friend coffee, community wellness events.',
        },
        {
          title: 'Cultivate meaningful connection',
          description: 'Not all social time is equal. Deep friendships and quality community matter most.',
        },
      ],
      insights: [
        'Your energy is highest on days with social movement or connection',
        'Isolation triggers mood decline and low energy',
        'Community accountability boosts consistency dramatically',
      ],
      resources: [
        { title: 'Finding your wellness community', icon: Heart },
        { title: 'Group-based wellness practices', icon: Zap },
        { title: 'Social accountability for consistency', icon: TrendingUp },
      ],
    },
  };

  const userGlowType = profile?.glowType || 'The Steady Bloomer';
  const glowTypeData = glowTypes[userGlowType] || glowTypes['The Steady Bloomer'];

  // Get trend data
  const sleepTrend = analyzeSleepTrend();
  const energyTrend = analyzeEnergyTrend();
  const stressTrend = analyzeStressTrend();

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
            <h1
              style={{
                ...display(56),
                margin: '0 0 12px 0',
                maxWidth: 700,
              }}
            >
              {glowTypeData.icon} You are{' '}
              <em style={{ fontStyle: 'italic', color: glowTypeData.color }}>
                {userGlowType}
              </em>
            </h1>
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
              <h2 style={{ ...display(32), margin: 0 }}>How we detected your type</h2>
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
