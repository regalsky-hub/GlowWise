import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserData } from '../context/UserDataContext';
import { useAuth } from '../context/AuthContext';
import AppLayout from './AppLayout';
import { LogOut } from 'lucide-react';

export default function Dashboard() {
  const { profile, checkIns, loading } = useUserData();
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

  // Get today's check-in
  const today = checkIns && checkIns.length > 0 ? checkIns[0] : null;

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
              Check in to update your wellness picture.
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
          >
            <LogOut size={14} strokeWidth={2} /> Log out
          </button>
        </div>

        {/* Main Content */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 40px' }}>
          {/* Today's Check-in */}
          {today && (
            <div
              className="fade-up"
              style={{
                padding: '32px 36px',
                borderRadius: 24,
                background: `linear-gradient(135deg, rgba(107,158,127,0.10) 0%, rgba(237,244,239,0.6) 100%)`,
                border: `1px solid ${C.lineSoft}`,
                marginBottom: 36,
                boxShadow: '0 16px 48px -24px rgba(61,74,82,0.08)',
              }}
            >
              <div style={{ ...eyebrow(C.sageDark), marginBottom: 16 }}>Today's check-in</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 16, marginBottom: 20 }}>
                <div>
                  <div style={{ ...bodyText(12), color: C.mute, marginBottom: 4 }}>Energy</div>
                  <div style={{ ...display(24), color: C.amber }}>{today.energy}/10</div>
                </div>
                <div>
                  <div style={{ ...bodyText(12), color: C.mute, marginBottom: 4 }}>Sleep</div>
                  <div style={{ ...display(24), color: C.plum }}>{today.sleep}h</div>
                </div>
                <div>
                  <div style={{ ...bodyText(12), color: C.mute, marginBottom: 4 }}>Stress</div>
                  <div style={{ ...display(24), color: C.sage }}>{10 - today.stress}/10</div>
                </div>
                <div>
                  <div style={{ ...bodyText(12), color: C.mute, marginBottom: 4 }}>Mood</div>
                  <div style={{ ...display(24), color: C.terracotta }}>{today.mood}/10</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
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
                  }}
                >
                  Open coach
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
                  }}
                >
                  See full plan
                </Link>
              </div>
            </div>
          )}

          {/* Insights CTA */}
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
              <div style={{ ...eyebrow(C.sage), marginBottom: 6 }}>View patterns</div>
              <h3 style={{ ...display(18), margin: 0, fontWeight: 500 }}>Your wellness insights</h3>
            </div>
            <Link
              to="/insights"
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
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
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

          {/* Glow Type CTA */}
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
            <div style={{ ...eyebrow(C.mute), marginBottom: 12 }}>Discover yourself</div>
            <h2 style={{ ...display(28), margin: '0 0 12px 0' }}>Your glow type</h2>
            <p style={{ ...bodyText(15), color: C.body, margin: '0 0 20px 0' }}>
              Understand your wellness archetype and how you naturally thrive.
            </p>
            <Link
              to="/glow-type"
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
              }}
            >
              Learn your type
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
