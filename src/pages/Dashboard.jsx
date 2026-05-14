import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserData } from '../context/UserDataContext';
import { useAuth } from '../context/AuthContext';
import AppLayout from './AppLayout';
import { LogOut } from 'lucide-react';

export default function Dashboard() {
  const {
    profile,
    getTodayCheckIn,
    calculateGlowScore,
    generateDailyFocus,
    analyzeEnergyTrend,
    analyzeSleepTrend,
    analyzeStressTrend,
    analyzeMoodTrend,
    loading,
  } = useUserData();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div style={{ padding: '40px', textAlign: 'center', color: '#A89968' }}>
          Loading your wellness...
        </div>
      </AppLayout>
    );
  }

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

  const today = getTodayCheckIn();
  const glowScore = calculateGlowScore();
  const dailyFocus = generateDailyFocus();
  const energyTrend = analyzeEnergyTrend();
  const sleepTrend = analyzeSleepTrend();
  const stressTrend = analyzeStressTrend();
  const moodTrend = analyzeMoodTrend();

  const vitalCards = [
    {
      title: 'Energy',
      value: today?.energy || '-',
      status: energyTrend.status,
      color: C.amber,
      bg: C.amberBg,
      icon: '⚡',
      href: '/insights',
    },
    {
      title: 'Sleep',
      value: today?.sleep || '-',
      unit: today?.sleep ? 'h' : '',
      status: sleepTrend.status,
      color: C.plum,
      bg: C.plumBg,
      icon: '🌙',
      href: '/insights',
    },
    {
      title: 'Stress',
      value: stressTrend.average || '-',
      status: stressTrend.status,
      color: C.sage,
      bg: C.sageMint,
      icon: '🌬️',
      href: '/insights',
    },
    {
      title: 'Mood',
      value: today?.mood || '-',
      status: moodTrend.status,
      color: C.terracotta,
      bg: C.terracottaBg,
      icon: '✨',
      href: '/insights',
    },
  ];

  const planItems = [
    {
      eyebrow: 'Sleep Support',
      title: 'Consistent bedtime by 10:30pm',
      note: '4 / 7 this week',
      bg: C.plumBg,
      accent: C.plum,
    },
    {
      eyebrow: 'Stress Recovery',
      title: '10 min slow breathing',
      note: 'Building consistency',
      bg: C.sageMint,
      accent: C.sage,
    },
    {
      eyebrow: 'Daily Movement',
      title: 'Walk after lunch',
      note: '5 / 7 this week',
      bg: C.terracottaBg,
      accent: C.terracotta,
    },
  ];

  return (
    <AppLayout>
      <style>{`
        .fade-up { animation: fu 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
        @keyframes fu { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .glow-card { transition: all 0.2s ease; }
        .glow-card:hover { transform: translateY(-4px); }
        .mobile-logout-btn { display: none; }
        @media (max-width: 768px) {
          .mobile-logout-btn { display: flex; }
        }
      `}</style>

      <div style={{ background: C.paper, minHeight: '100vh', paddingBottom: 80 }}>
        {/* Hero */}
        <div
          className="fade-up"
          style={{
            padding: '40px 40px 32px',
            background: `linear-gradient(135deg, rgba(107,158,127,0.10) 0%, rgba(237,226,236,0.35) 100%)`,
            border: `1px solid ${C.lineSoft}`,
            borderTop: 'none',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 20,
          }}
        >
          <div>
            <div style={{ ...eyebrow(C.sageDark), marginBottom: 12 }}>Welcome back</div>
            <h1 style={{ ...display(42), margin: '0 0 12px 0' }}>
              {profile?.name?.split(' ')[0] || 'there'}.
            </h1>
            <p style={{ ...bodyText(15), color: C.body, margin: 0 }}>
              {glowScore ? `Your glow is at ${glowScore}. ` : ''}Check in to update your wellness picture.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="mobile-logout-btn"
            style={{
              padding: '10px 14px',
              borderRadius: 100,
              background: 'transparent',
              border: `1px solid ${C.lineSoft}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: FF_UI,
              fontSize: 12,
              fontWeight: 500,
              color: C.mute,
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = C.sage;
              e.currentTarget.style.color = C.sage;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = C.lineSoft;
              e.currentTarget.style.color = C.mute;
            }}
          >
            <LogOut size={14} strokeWidth={2} /> Log out
          </button>
        </div>

        {/* Main Content */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 40px' }}>
          {/* Daily Focus */}
          {dailyFocus && (
            <div
              className="fade-up glow-card"
              style={{
                position: 'relative',
                overflow: 'hidden',
                padding: '32px 36px',
                borderRadius: 24,
                background: `linear-gradient(135deg, rgba(107,158,127,0.10) 0%, rgba(237,244,239,0.6) 100%)`,
                border: `1px solid ${C.lineSoft}`,
                marginBottom: 36,
                boxShadow: '0 16px 48px -24px rgba(61,74,82,0.08)',
              }}
            >
              <div style={{ ...eyebrow(C.sageDark), marginBottom: 16 }}>Today's focus</div>
              <h2 style={{ ...display(32), margin: '0 0 8px 0' }}>
                {dailyFocus.title} <em style={{ fontStyle: 'italic', color: C.sage }}>{dailyFocus.subtitle}</em>
              </h2>
              <p style={{ ...bodyText(16), margin: '0 0 20px 0', color: C.body }}>
                {dailyFocus.guidance}
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link
                  to="/ai-coach"
                  style={{
                    padding: '12px 24px',
                    borderRadius: 100,
                    background: C.sage,
                    color: C.paper,
                    border: 'none',
                    fontFamily: FF_UI,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  Open coach →
                </Link>
                <Link
                  to="/wellness-plan"
                  style={{
                    padding: '12px 24px',
                    borderRadius: 100,
                    background: 'transparent',
                    color: C.sage,
                    border: `1px solid ${C.sage}`,
                    fontFamily: FF_UI,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(107,158,127,0.10)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  See full plan
                </Link>
              </div>
            </div>
          )}

          {/* Vital Snapshot */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ ...eyebrow(C.mute), marginBottom: 8 }}>This morning</div>
              <h2 style={{ ...display(28), margin: 0 }}>Your snapshot</h2>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: 16,
              }}
            >
              {vitalCards.map((card, i) => (
                <Link key={i} to={card.href} style={{ textDecoration: 'none' }}>
                  <div
                    className="fade-up glow-card"
                    style={{
                      padding: '24px',
                      borderRadius: 18,
                      background: card.bg,
                      border: `1px solid ${C.lineSoft}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      animationDelay: `${i * 0.08}s`,
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
                    <div style={{ ...eyebrow(card.color), marginBottom: 12, fontSize: 10 }}>
                      {card.icon} {card.title}
                    </div>
                    <div style={{ ...display(32), margin: '0 0 8px 0', color: card.color }}>
                      {card.value}
                      {card.unit && <span style={{ fontSize: 18 }}>{card.unit}</span>}
                    </div>
                    <div style={{ ...bodyText(13), color: C.body, fontStyle: 'italic' }}>
                      {card.status}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Wellness Coach CTA */}
          <div
            className="fade-up"
            style={{
              padding: '28px 32px',
              borderRadius: 20,
              background: `linear-gradient(135deg, rgba(107,158,127,0.08) 0%, rgba(250,248,245,0.95) 100%)`,
              border: `1px solid ${C.lineSoft}`,
              marginBottom: 40,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ ...eyebrow(C.sage), marginBottom: 6 }}>Anytime support</div>
              <h3 style={{ ...display(18), margin: 0, fontWeight: 500 }}>Ask your wellness coach</h3>
              <p style={{ ...bodyText(13), color: C.body, margin: '4px 0 0 0' }}>
                Questions about patterns, habits, or how to feel better
              </p>
            </div>
            <Link
              to="/ai-coach"
              style={{
                padding: '12px 24px',
                borderRadius: 100,
                background: C.sage,
                color: C.paper,
                border: 'none',
                fontFamily: FF_UI,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              Explore →
            </Link>
          </div>

          {/* Wellness Plan */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ ...eyebrow(C.mute), marginBottom: 8 }}>Your plan</div>
              <h2 style={{ ...display(28), margin: 0 }}>Your wellness plan</h2>
            </div>

            <Link to="/wellness-plan" style={{ textDecoration: 'none' }}>
              <div
                className="glow-card"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 14,
                  cursor: 'pointer',
                }}
              >
                {planItems.map((p, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '20px 20px 22px',
                      borderRadius: 14,
                      background: p.bg,
                      border: `1px solid ${C.lineSoft}`,
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(61,74,82,0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ ...eyebrow(p.accent), marginBottom: 12, fontSize: 10 }}>
                      {p.eyebrow}
                    </div>
                    <div
                      style={{
                        fontFamily: FF_DISPLAY,
                        fontSize: 19,
                        color: C.ink,
                        lineHeight: 1.3,
                        marginBottom: 16,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {p.title}
                    </div>
                    <div style={{ fontFamily: FF_UI, fontSize: 12, color: p.accent, fontWeight: 600 }}>
                      {p.note}
                    </div>
                  </div>
                ))}
              </div>
            </Link>
          </div>

          {/* Glow Score */}
          {glowScore && (
            <div
              className="fade-up"
              style={{
                padding: '32px',
                borderRadius: 22,
                background: C.paper,
                border: `1px solid ${C.lineSoft}`,
                textAlign: 'center',
              }}
            >
              <div style={{ ...eyebrow(C.mute), marginBottom: 20 }}>Glow Score</div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24 }}>
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="#f0f0f0" strokeWidth="8" />
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke={C.sage}
                    strokeWidth="8"
                    strokeDasharray={`${(glowScore / 100) * 339.3} 339.3`}
                    style={{
                      transform: 'rotate(-90deg)',
                      transformOrigin: '60px 60px',
                      transition: 'stroke-dasharray 0.6s ease',
                    }}
                  />
                </svg>
                <div>
                  <div style={{ ...display(48), margin: 0, color: C.sage }}>
                    {glowScore}
                  </div>
                  <div style={{ ...eyebrow(C.mute), marginTop: 8 }}>
                    {glowScore >= 70 ? 'Thriving' : glowScore >= 50 ? 'Balanced' : 'Recovering'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
