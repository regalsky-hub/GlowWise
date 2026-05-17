// src/pages/Dashboard.jsx — GlowWise dashboard (v2.1 responsive)
// WITH LINKS TO /insights on: vitals cards, glow trend, explore patterns
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserData } from '../context/UserDataContext';
import { useNavigate } from 'react-router-dom';
import {
  Sun, Moon, Zap, Heart, Waves, MessageCircle,
  Calendar, BarChart3, User, ChevronRight,
  Plus, Bell, LogOut,
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
    .gw-hero-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
    .gw-hero-pad { padding: 36px 28px !important; }
    .gw-hero-title { font-size: 32px !important; }
    .gw-score-ring { width: 180px !important; height: 180px !important; }
    .gw-score-text { font-size: 40px !important; }
    .gw-header-h1 { font-size: 36px !important; }
    .gw-twocol { grid-template-columns: 1fr !important; }
    .gw-vitals { grid-template-columns: repeat(2, 1fr) !important; }
    .gw-plan-grid { grid-template-columns: 1fr !important; }
    .gw-main { padding: 32px 24px 100px !important; }
  }
  @media (max-width: 768px) {
    .gw-sidebar { display: none !important; }
    .gw-bottomnav { display: flex !important; }
    .gw-main { padding: 24px 18px 100px !important; }
    .gw-header { flex-direction: column !important; align-items: flex-start !important; }
    .gw-header-actions { width: 100% !important; }
    
    .gw-logout-btn { display: inline-flex !important; }
    
    .gw-hero-pad { padding: 28px 22px !important; }
    .gw-hero-title { font-size: 26px !important; }
    .gw-header-h1 { font-size: 30px !important; }
    .gw-card-pad { padding: 22px !important; }
    .gw-vitals { gap: 10px !important; }
  }
  @media (max-width: 480px) {
    .gw-hero-title { font-size: 23px !important; }
    .gw-header-h1 { font-size: 26px !important; }
    .gw-score-ring { width: 160px !important; height: 160px !important; }
    .gw-score-text { font-size: 40px !important; }
  }
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

// ============ NAV ITEMS DATA ============
const navItems = [
  { Icon: Sun,           label: 'Dashboard',      to: '/dashboard' },
  { Icon: Calendar,      label: 'Check-in',       to: '/checkin' },
  { Icon: MessageCircle, label: 'Wellness Coach', to: '/ai-coach' },
  { Icon: BarChart3,     label: 'Insights',       to: '/insights' },
  { Icon: User,          label: 'Profile',        to: '/settings' },
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
    <div style={{
  display: 'flex', alignItems: 'center', gap: 12,
  padding: '0 8px 28px',
}}>
  <Orbit size={38} />
  <Wordmark size={26} />
</div>
    {navItems.map((item) => (
      <NavItem key={item.to} {...item} />
    ))}
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
      <span style={{
        fontFamily: FF_UI, fontSize: 10, fontWeight: active ? 700 : 500,
        letterSpacing: '0.02em',
      }}>{label}</span>
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
    {navItems.map((item) => {
      const shortLabel = item.label === 'Wellness Coach' ? 'Coach' : item.label;
      return <BottomNavItem key={item.to} {...item} label={shortLabel} />;
    })}
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

// ============ HEADER ============
const Header = ({ name, onLogout }) => {
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
      marginBottom: 36, flexWrap: 'wrap', gap: 16,
    }}>
      <div>
        <div style={{ ...eyebrow(C.mute), marginBottom: 12 }}>{weekday} · {monthDay}</div>
        <h1 className="gw-header-h1" style={{ ...display(48), margin: 0 }}>
          {greeting},{' '}
          <em style={{ fontStyle: 'italic', color: C.sage }}>{name}.</em>
        </h1>
      </div>
      <div className="gw-header-actions" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button style={{ ...btnGhost, padding: '10px 12px' }} aria-label="Notifications">
          <Bell size={16} strokeWidth={1.6} />
        </button>
     <button
  onClick={onLogout}
  style={{
    padding: '10px 12px',
    borderRadius: 100,
    background: 'transparent',
    border: `1px solid ${C.lineSoft}`,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}
  aria-label="Log out"
>
  <LogOut size={16} strokeWidth={1.6} color={C.mute} />
</button>
        <Link to="/checkin" style={btnPrimary}>
          <Plus size={14} strokeWidth={2} /> New check-in
        </Link>
      </div>
    </div>
  );
};

// ============ HERO FOCUS ============
const HeroFocus = ({ score = 78 }) => (
  <div className="gw-hero-pad" style={{
    position: 'relative', overflow: 'hidden',
    padding: '52px 48px',
    borderRadius: 28,
    background: 'linear-gradient(135deg, rgba(107,158,127,0.18) 0%, rgba(237,226,236,0.55) 100%)',
    border: '1px solid rgba(107,158,127,0.10)',
    boxShadow: '0 24px 60px -36px rgba(61,74,82,0.22)',
    marginBottom: 28,
  }}>
    <div style={{
      position: 'absolute', width: 320, height: 320, borderRadius: '50%',
      background: 'rgba(107,158,127,0.12)', filter: 'blur(70px)',
      top: -120, right: -80,
    }} />
    <div className="gw-hero-grid" style={{
      position: 'relative', display: 'grid',
      gridTemplateColumns: '1.5fr 1fr', gap: 40, alignItems: 'center',
    }}>
      <div>
        <div style={{ ...eyebrow(C.sageDark), marginBottom: 16 }}>Today's focus</div>
        <h2 className="gw-hero-title" style={{ ...display(44), margin: 0, marginBottom: 22, maxWidth: 540 }}>
          A balanced day.{' '}
          <em style={{ fontStyle: 'italic', color: C.sage }}>Protect that feeling</em>
          {' '}with gentle movement and a slow lunch.
        </h2>
        <p style={{ ...bodyText(16), maxWidth: 480, marginBottom: 28 }}>
          Your stress is low and energy is steady — a good day for the harder
          task you've been putting off. Hydrate before 11am.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link to="/ai-coach" style={btnPrimary}>
            Open coach <ChevronRight size={12} strokeWidth={2} />
          </Link>
        </div>
      </div>

      {/* Glow Score ring */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="gw-score-ring" style={{ position: 'relative', width: 220, height: 220 }}>
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
            <div style={{ fontFamily: FF_UI, fontSize: 12, color: C.sageDark, fontWeight: 600 }}>
              Thriving
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ============ VITALS ============
const Vital = ({ Icon, label, value, suffix, mood, bg, accent, text }) => (
  <Link to="/insights" style={{ textDecoration: 'none' }}>
    <div style={{
      background: bg,
      border: `1px solid ${C.lineSoft}`,
      borderRadius: 14,
      padding: '20px 20px 22px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 8px 24px rgba(61,74,82,0.12)';
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.transform = 'translateY(0)';
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, color: accent }}>
        <Icon size={14} strokeWidth={1.6} />
        <span style={{ ...eyebrow(accent), fontSize: 10 }}>{label}</span>
      </div>
      <div style={{ ...display(32), color: text, marginBottom: 6 }}>
        {value}
        <span style={{ fontSize: 13, color: accent, marginLeft: 3 }}>{suffix}</span>
      </div>
      <div style={{ fontFamily: FF_DISPLAY, fontStyle: 'italic', fontSize: 14, color: accent }}>
        {mood}
      </div>
    </div>
  </Link>
);

const Vitals = ({ today }) => (
  <div style={{ marginBottom: 28 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18, gap: 12 }}>
      <div>
        <div style={{ ...eyebrow(C.mute), marginBottom: 6 }}>This morning</div>
        <h3 style={{ ...display(26), margin: 0 }}>Your snapshot</h3>
      </div>
    </div>
    <div className="gw-vitals" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
      <Vital Icon={Zap}   label="Energy" value={today.energy} suffix="/10" mood="Steady"  bg={C.amberBg}      accent={C.amber}      text="#8B6A30" />
      <Vital Icon={Moon}  label="Sleep"  value={today.sleep}  suffix="h"    mood="Restful" bg={C.plumBg}       accent={C.plum}       text="#5D4459" />
      <Vital Icon={Waves} label="Stress" value={today.stress} suffix="/10" mood="Calm"    bg={C.sageMint}     accent={C.sageDark}   text="#3D5E48" />
      <Vital Icon={Heart} label="Mood"   value={today.mood}   suffix="/10" mood="Bright"  bg={C.terracottaBg} accent={C.terracotta} text="#8B4A30" />
    </div>
  </div>
);

// ============ WEEK CHART ============
const WeekChart = ({ scores = [62, 70, 65, 74, 71, 76, 78] }) => {
  const max = Math.max(...scores);
  const min = Math.min(...scores);
  const range = max - min || 1;
  const w = 460, h = 160, pad = 24;
  const pts = scores.map((v, i) => {
    const x = pad + (i / (scores.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return [x, y];
  });
  const path = pts.map(([x, y], i) => `${i ? 'L' : 'M'} ${x} ${y}`).join(' ');
  const area = `${path} L ${pts[pts.length - 1][0]} ${h - pad} L ${pts[0][0]} ${h - pad} Z`;
  const days = ['W', 'T', 'F', 'S', 'S', 'M', 'T'];
  const delta = scores[scores.length - 1] - scores[0];

  return (
    <Link to="/insights" style={{ textDecoration: 'none' }}>
      <Card style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 12px 32px rgba(61,74,82,0.16)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 1px 0 rgba(0,0,0,0.02), 0 10px 30px -24px rgba(61,74,82,0.18)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8, gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div style={{ ...eyebrow(C.mute), marginBottom: 6 }}>Last 7 days</div>
            <h3 style={{ ...display(22), margin: 0 }}>Your glow trend</h3>
          </div>
          <div style={{ fontFamily: FF_UI, fontSize: 12, color: C.sageDark, fontWeight: 600 }}>
            {delta >= 0 ? '↑' : '↓'} {delta >= 0 ? '+' : ''}{delta} from last week
          </div>
        </div>
        <p style={{ ...bodyText(12.5), marginBottom: 18, marginTop: 4, maxWidth: 360 }}>
          How your overall wellbeing is trending — so daily ups and downs don't
          cloud the bigger picture.
        </p>
        <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
          <defs>
            <linearGradient id="gloGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.sage} stopOpacity="0.22" />
              <stop offset="100%" stopColor={C.sage} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill="url(#gloGrad)" />
          <path d={path} fill="none" stroke={C.sageDark} strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
          {pts.map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={i === pts.length - 1 ? 5 : 3}
                fill={i === pts.length - 1 ? C.terracotta : C.sageDark} />
              <text x={x} y={h - 6} textAnchor="middle" fontSize="10"
                fill={C.mute} fontFamily={FF_UI} fontWeight="600">
                {days[i]}
              </text>
            </g>
          ))}
        </svg>
      </Card>
    </Link>
  );
};

// ============ COACH ============
const Coach = ({ name }) => (
  <div
    className="gw-card-pad"
    style={{
      padding: '34px 34px',
      borderRadius: 20,
      background:
        'linear-gradient(135deg, #6B9E7F 0%, #5B8D70 100%)',
      color: C.paper,
      position: 'relative',
      overflow: 'hidden',
      boxShadow:
        '0 24px 60px -30px rgba(85,126,100,0.45)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '100%',
    }}
  >
    {/* Ambient Glow */}
    <div
      style={{
        position: 'absolute',
        width: 260,
        height: 260,
        borderRadius: '50%',
        background:
          'rgba(250,248,245,0.06)',
        filter: 'blur(60px)',
        top: -120,
        right: -100,
      }}
    />
    {/* Decorative G */}
    <div
      style={{
        position: 'absolute',
        top: -30,
        right: -20,
        fontFamily: FF_DISPLAY,
        fontStyle: 'italic',
        fontSize: 220,
        color: 'rgba(250,248,245,0.05)',
        lineHeight: 1,
        pointerEvents: 'none',
      }}
    >
      g
    </div>
    <div style={{ position: 'relative', zIndex: 2 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 18,
        }}
      >
        <Orbit
          size={26}
          color={C.paper}
          tail="#C0DAC8"
          accent={C.terracottaMid}
        />
        <div
          style={{
            fontFamily: FF_UI, fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(250,248,245,0.76)',
          }}
        >
          Today's observation
        </div>
      </div>
      <p
        style={{
          fontFamily: FF_DISPLAY,
          fontSize: 30,
          lineHeight: 1.22,
          letterSpacing: '-0.03em',
          color: C.paper,
          margin: 0,
          marginBottom: 18,
          maxWidth: 520,
        }}
      >
        Your recent patterns suggest steadier recovery this week,
        especially around sleep consistency and emotional balance.
      </p>
      <p
        style={{
          fontFamily: FF_UI,
          fontSize: 14.5,
          lineHeight: 1.75,
          color: 'rgba(250,248,245,0.82)',
          margin: 0,
          marginBottom: 28,
          maxWidth: 500,
        }}
      >
        GlowWise has noticed calmer stress signals, more stable energy,
        and improved evening recovery rhythms over the past few days.
      </p>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <Link
          to="/ai-coach"
          style={{
            background: C.paper,
            color: C.sageDark,
            border: 'none',
            padding: '11px 20px',
            borderRadius: 999,
            fontFamily: FF_UI,
            fontSize: 13,
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            textDecoration: 'none',
          }}
        >
          <MessageCircle size={14} strokeWidth={1.6} />
          Reflect with coach
        </Link>
        <Link
          to="/insights"
          style={{
            background: 'transparent',
            color: 'rgba(250,248,245,0.92)',
            border: '1px solid rgba(250,248,245,0.22)',
            padding: '11px 18px',
            borderRadius: 999,
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
          Explore patterns <ChevronRight size={12} strokeWidth={2} />
        </Link>
      </div>
    </div>
  </div>
);

// ============ GLOW TYPE ============
const GlowType = () => {
  const navigate = useNavigate();
  
  return (
    <div
      className="gw-card-pad"
      onClick={() => navigate('/glow-type')}
      style={{
  padding: '36px 34px 40px',
  minHeight: 340,
  borderRadius: 16,
  background:
    'linear-gradient(135deg, rgba(107,158,127,0.10) 0%, rgba(237,226,236,0.48) 100%)',
  border: '1px solid rgba(107,158,127,0.08)',
  boxShadow: '0 24px 60px -36px rgba(61,74,82,0.16)',
  position: 'relative',
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
}}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(61,74,82,0.16)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 24px 60px -36px rgba(61,74,82,0.16)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{
        position: 'absolute',
        width: '220px',
        height: '220px',
        borderRadius: '50%',
        background: 'rgba(107,158,127,0.10)',
        filter: 'blur(60px)',
        top: '-80px',
        right: '-40px',
      }} />
      <div style={{ ...eyebrow(C.sageDark), marginBottom: 12, position: 'relative', zIndex: 2 }}>
        Your glow type
      </div>
      <h3 style={{
  ...display(34),
  margin: 0,
  marginBottom: 14,
  lineHeight: 1.05,
  fontStyle: 'italic',
  fontWeight: 500,
  position: 'relative',
  zIndex: 2
}}>
        The Steady Bloomer
      </h3>
      <p style={{ ...bodyText(14), color: C.body, marginBottom: 22, position: 'relative', zIndex: 2 }}>
        You thrive on routine and small, consistent rituals. Big swings drain you — gentle daily care compounds beautifully.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 22, position: 'relative', zIndex: 2 }}>
        {['Sleep-led', 'Consistency', 'Soft mornings'].map((t) => (
          <span key={t} style={{ padding: '5px 12px', borderRadius: 999, background: 'rgba(107,158,127,0.12)', color: C.sageDark, fontSize: 11.5, fontWeight: 600, fontFamily: FF_UI }}>
            {t}
          </span>
        ))}
      </div>
      <div style={{ color: C.sageDark, fontFamily: FF_UI, fontSize: 13, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4, borderBottom: `1px solid ${C.sageDark}`, paddingBottom: 2, position: 'relative', zIndex: 2 }}>
        Learn about your type <ChevronRight size={11} strokeWidth={2} />
      </div>
    </div>
  );
};

// ============ PLAN ============
const planItems = [
  { eyebrow: 'Sleep Support',   title: 'Consistent bedtime by 10:30pm', note: '4 / 7 this week',     accent: C.plum,       bg: C.plumBg },
  { eyebrow: 'Stress Recovery', title: '10 min slow breathing',          note: 'Building consistency', accent: C.sageDark,   bg: C.sageMint },
  { eyebrow: 'Daily Movement',  title: 'Walk after lunch',               note: '5 / 7 this week',     accent: C.terracotta, bg: C.terracottaBg },
];

const Plan = () => (
  <Card>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20, gap: 12, flexWrap: 'wrap' }}>
      <div>
        <div style={{ ...eyebrow(C.mute), marginBottom: 6 }}>Your plan</div>
        <h3 style={{ ...display(24), margin: 0 }}>Your wellness plan</h3>
      </div>
    </div>
    <Link to="/wellness-plan" style={{ textDecoration: 'none' }}>
      <div className="gw-plan-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, cursor: 'pointer' }}>
        {planItems.map((p, i) => (
          <div key={i} style={{
            padding: '20px 20px 22px', borderRadius: 14,
            background: p.bg, border: `1px solid ${C.lineSoft}`,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(61,74,82,0.12)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            <div style={{ ...eyebrow(p.accent), marginBottom: 12, fontSize: 10 }}>{p.eyebrow}</div>
            <div style={{
              fontFamily: FF_DISPLAY, fontSize: 19,
              color: C.ink, lineHeight: 1.3, marginBottom: 16,
              letterSpacing: '-0.01em',
            }}>
              {p.title}
            </div>
            <div style={{ fontFamily: FF_UI, fontSize: 12, color: p.accent, fontWeight: 600 }}>
              {p.note}
            </div>
          </div>
        ))}
      </div>
    </Link>
  </Card>
);

// ============ MOBILE HEADER LOGO ============
const MobileLogo = () => (
  <div className="gw-bottomnav" style={{
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

// ============ DASHBOARD ============
export default function Dashboard() {
  const { user } = useAuth();
  const { profile, checkIns, glowScore, loading, getTodayCheckIn } = useUserData();

  const firstName =
    (profile?.name || profile?.firstName || profile?.first_name ||
     user?.displayName || '').split(' ')[0] || 'there';

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

  const todayCheckIn = getTodayCheckIn();
  const today = todayCheckIn ? {
    energy: todayCheckIn.energy || 7,
    sleep: todayCheckIn.sleep_hours || 7.2,
    stress: todayCheckIn.stress_level || 4,
    mood: todayCheckIn.mood || 8,
  } : {
    energy: 7,
    sleep: 7.2,
    stress: 4,
    mood: 8,
  };

  const score = glowScore || 78;

  const weekScores = checkIns
    .slice(0, 7)
    .reverse()
    .map(c => {
      const energy = c.energy || 0;
      const sleep = (c.sleep_hours || 0) / 9 * 10;
      const stress = 10 - (c.stress_level || 0);
      const mood = c.mood || 0;
      return Math.round((energy + sleep + stress + mood) / 4);
    })
    .reverse();

  const displayWeekScores = weekScores.length > 0 ? weekScores : [62, 70, 65, 74, 71, 76, 78];

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
            maxWidth: 1280, width: '100%', boxSizing: 'border-box',
          }}>
            <Header name={firstName} onLogout={handleLogout} />
            <HeroFocus score={score} />
            <Vitals today={today} />
            <div
              className="gw-twocol"
              style={{
                display: 'grid',
                gridTemplateColumns: '1.15fr 1fr',
                gap: 20,
                marginBottom: 28,
                alignItems: 'stretch',
              }}
            >
              <WeekChart scores={displayWeekScores} />
              <Coach name={firstName} />
            </div>
            <div className="gw-twocol" style={{
              display: 'grid', gridTemplateColumns: '1fr 1.4fr',
              gap: 20, marginBottom: 28,
            }}>
              <GlowType />
              <Plan />
            </div>
            <Actions />
          </main>
        </div>
        <BottomNav />
      </div>
    </>
  );
}
