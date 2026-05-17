import React, { useState, useEffect } from 'react';
import { useUserData } from '../context/UserDataContext';
import AppLayout from './AppLayout';
import {
  TrendingUp, TrendingDown, Sparkles, Zap, Moon, Heart, Waves, Quote,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

/* ============================================================
   GlowWise · Insights — polished
   Same fonts (Fraunces + Manrope), same palette.
   Improvements: editorial rhythm, sparklines, period toggle,
   custom tooltip, progress rings, watermark 'g', staggered fade-ups.
   ============================================================ */

// ─────────── tokens ───────────
const C = {
  paper: '#FAF8F5', paperWarm: '#F3EFE8',
  ink: '#3D4A52', body: '#5A6770', mute: '#A89968',
  sage: '#6B9E7F', sageDark: '#557E64', sageMint: '#EDF4EF',
  terracotta: '#A85A3D', terracottaMid: '#C97B5C', terracottaBg: '#F5DDD0',
  plum: '#7A5C77', plumBg: '#EDE2EC',
  amber: '#A07E3D', amberBg: '#FAF3DC',
  line: 'rgba(168,153,104,0.16)', lineSoft: 'rgba(168,153,104,0.10)',
};

const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' });

const todayLong = () =>
  new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

// Italic 'g' editorial watermark — ties back to the Orbit logo
const Watermark = ({ size = 220, color = 'rgba(85,126,100,0.06)', style }) => (
  <span aria-hidden style={{
    position: 'absolute',
    fontFamily: "'Fraunces', Georgia, serif",
    fontStyle: 'italic', fontWeight: 400,
    fontSize: size, color, lineHeight: 1,
    pointerEvents: 'none', userSelect: 'none',
    ...style,
  }}>g</span>
);

// Period chips
const Chip = ({ active, children, onClick }) => (
  <button onClick={onClick} style={{
    padding: '7px 14px', borderRadius: 999,
    border: `1px solid ${active ? C.sage : 'transparent'}`,
    background: active ? C.sageMint : 'transparent',
    color: active ? C.sageDark : C.body,
    fontFamily: "'Manrope', sans-serif",
    fontSize: 12, fontWeight: 600, letterSpacing: '0.04em',
    cursor: 'pointer', transition: 'all 0.2s ease',
  }}>{children}</button>
);

// Custom chart tooltip
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: C.paper, border: `1px solid ${C.line}`,
      borderRadius: 14, padding: '14px 16px',
      boxShadow: '0 12px 36px -18px rgba(61,74,82,0.28)',
      fontFamily: "'Manrope', sans-serif", minWidth: 160,
    }}>
      <div style={{
        fontSize: 10, fontWeight: 700, letterSpacing: '0.16em',
        textTransform: 'uppercase', color: C.mute, marginBottom: 10,
      }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 18, padding: '4px 0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
            <span style={{ fontSize: 12, color: C.body, textTransform: 'capitalize' }}>{p.dataKey}</span>
          </div>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: 15, color: C.ink }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

// ─────────── VITAL (today snapshot) ───────────
const Vital = ({ Icon, label, value, suffix, mood, bg, accent, text }) => (
  <div style={{
    background: bg, border: `1px solid ${C.lineSoft}`,
    borderRadius: 16, padding: '22px 20px 24px',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, color: accent }}>
      <Icon size={14} strokeWidth={1.6} />
      <span style={{
        fontFamily: "'Manrope', sans-serif", fontSize: 10, fontWeight: 700,
        letterSpacing: '0.18em', textTransform: 'uppercase', color: accent,
      }}>{label}</span>
    </div>
    <div style={{
      fontFamily: "'Fraunces', serif", fontWeight: 400, fontSize: 34,
      color: text, marginBottom: 8, letterSpacing: '-0.02em', lineHeight: 1,
    }}>
      {value}<span style={{ fontSize: 13, color: accent, marginLeft: 3 }}>{suffix}</span>
    </div>
    <div style={{
      fontFamily: "'Fraunces', serif", fontStyle: 'italic',
      fontSize: 14, color: accent,
    }}>{mood}</div>
  </div>
);

// ─────────── METRIC (weekly trend with sparkline) ───────────
const Metric = ({ label, value, isStress, series = [] }) => {
  const positive = (value > 0 && !isStress) || (value < 0 && isStress);
  const neutral = Math.abs(value) < 1;

  const cfg = neutral
    ? { tone: 'Building baseline', bg: C.paper, accent: C.mute, glow: 'rgba(168,153,104,0.10)' }
    : positive
      ? { tone: 'Improving', bg: C.sageMint, accent: C.sageDark, glow: 'rgba(107,158,127,0.18)' }
      : { tone: 'Needs support', bg: C.paper, accent: C.terracotta, glow: 'rgba(201,123,92,0.12)' };

  // sparkline geometry
  const sw = 110, sh = 36;
  const vals = series.length ? series : [0,0,0,0,0,0,0];
  const min = Math.min(...vals), max = Math.max(...vals);
  const range = max - min || 1;
  const pts = vals.map((v, i) => [
    (i / (vals.length - 1)) * sw,
    sh - ((v - min) / range) * sh,
  ]);
  const path = pts.map(([x, y], i) => `${i ? 'L' : 'M'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const area = `${path} L ${sw} ${sh} L 0 ${sh} Z`;
  const last = pts[pts.length - 1];

  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      background: cfg.bg, border: `1px solid ${C.lineSoft}`,
      borderRadius: 20, padding: 24,
    }}>
      <div style={{
        position: 'absolute', width: 140, height: 140, borderRadius: '50%',
        background: cfg.glow, filter: 'blur(45px)',
        top: -40, right: -30,
      }}/>
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{
          fontFamily: "'Manrope', sans-serif", fontSize: 10, fontWeight: 700,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: C.mute, marginBottom: 18,
        }}>{label}</div>

        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          gap: 12, marginBottom: 14,
        }}>
          <div style={{
            fontFamily: "'Fraunces', serif", fontSize: 36, lineHeight: 1,
            letterSpacing: '-0.02em', color: cfg.accent,
          }}>
            {value > 0 ? '+' : ''}{Math.abs(value).toFixed(0)}<span style={{ fontSize: 18, marginLeft: 2 }}>%</span>
          </div>
          <svg width={sw} height={sh} viewBox={`0 0 ${sw} ${sh}`} style={{ flexShrink: 0, opacity: 0.9 }}>
            <defs>
              <linearGradient id={`sp-${label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={cfg.accent} stopOpacity="0.28"/>
                <stop offset="100%" stopColor={cfg.accent} stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d={area} fill={`url(#sp-${label})`}/>
            <path d={path} fill="none" stroke={cfg.accent} strokeWidth="1.6"
              strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx={last[0]} cy={last[1]} r="2.5" fill={cfg.accent}/>
          </svg>
        </div>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '6px 12px', borderRadius: 999,
          background: 'rgba(255,255,255,0.55)',
          fontSize: 11.5, fontWeight: 600, color: cfg.accent,
          fontFamily: "'Manrope', sans-serif",
        }}>
          {neutral ? <Sparkles size={12} strokeWidth={2}/>
            : positive ? <TrendingUp size={12} strokeWidth={2}/>
            : <TrendingDown size={12} strokeWidth={2}/>}
          {cfg.tone}
        </div>
      </div>
    </div>
  );
};

// ─────────── MAIN ───────────
export default function Insights() {
  const { checkIns, getTodayCheckIn } = useUserData();
  const [chartData, setChartData] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [trends, setTrends] = useState({});
  const [sparklines, setSparklines] = useState({ energy: [], sleep: [], stress: [], mood: [] });
  const [period, setPeriod] = useState(14);

  useEffect(() => {
    if (checkIns?.length > 0) processCheckIns();
  }, [checkIns, period]);

  const processCheckIns = () => {
    const sorted = [...checkIns]
      .sort((a, b) => new Date(a.date || a.created_at) - new Date(b.date || b.created_at))
      .slice(-period);

    const formatted = sorted.map(c => ({
      date: fmtDate(c.date || c.created_at),
      energy: c.energy || 0,
      sleep: c.sleep_hours || 0,
      stress: c.stress_level || 0,
      mood: c.mood || 0,
    }));
    setChartData(formatted);

    const last7 = sorted.slice(-7);
    setSparklines({
      energy: last7.map(c => c.energy || 0),
      sleep: last7.map(c => c.sleep_hours || 0),
      stress: last7.map(c => c.stress_level || 0),
      mood: last7.map(c => c.mood || 0),
    });

    detectPatterns(sorted);
    calculateTrends(sorted);
  };

  const detectPatterns = (data) => {
    const p = [];
    if (data.length >= 3) {
      const avgSleep = data.reduce((s, c) => s + (c.sleep_hours || 0), 0) / data.length;
      const avgEnergy = data.reduce((s, c) => s + (c.energy || 0), 0) / data.length;
      const avgStress = data.reduce((s, c) => s + (c.stress_level || 0), 0) / data.length;

      if (avgSleep < 7 && avgEnergy < 6) {
        p.push({
          title: 'Your energy may respond well to deeper rest',
          desc: 'Your recent check-ins suggest lighter sleep could be affecting how steady your energy feels throughout the day.',
          tone: 'neutral',
        });
      }
      if (avgStress > 7 && avgSleep < 8) {
        p.push({
          title: 'Your nervous system may be asking for slower recovery',
          desc: 'Stress levels have been slightly elevated lately, which can sometimes make rest feel less restorative.',
          tone: 'warning',
        });
      }
      if (data.length >= 7) {
        const last7 = data.slice(-7);
        const first7 = data.slice(0, 7);
        const lastEnergy = last7.reduce((s, c) => s + (c.energy || 0), 0) / 7;
        const firstEnergy = first7.reduce((s, c) => s + (c.energy || 0), 0) / 7;
        if (lastEnergy > firstEnergy + 0.5) {
          p.push({
            title: 'Your rhythm seems steadier this week',
            desc: 'Recent check-ins suggest your energy has been feeling more supported and consistent lately.',
            tone: 'positive',
          });
        }
      }
    }
    if (p.length === 0) {
      p.push({
        title: 'Your patterns are beginning to take shape',
        desc: 'The more you check in, the more GlowWise can gently understand your wellbeing rhythms over time.',
        tone: 'neutral',
      });
    }
    setPatterns(p);
  };

  const calculateTrends = (data) => {
    if (data.length < 2) return;
    const recent = data.slice(-7);
    const earlier = data.slice(0, data.length - 7).slice(-7);
    const trend = (key) => {
      if (earlier.length === 0) return 0;
      const ra = recent.reduce((s, c) => s + (c[key] || 0), 0) / recent.length;
      const ea = earlier.reduce((s, c) => s + (c[key] || 0), 0) / earlier.length;
      return ((ra - ea) / (ea || 1)) * 100;
    };
    setTrends({
      energy: trend('energy'),
      sleep: trend('sleep_hours'),
      stress: trend('stress_level'),
      mood: trend('mood'),
    });
  };

  const todayCheckIn = getTodayCheckIn?.();
  const today = {
    energy: todayCheckIn?.energy ?? 7,
    sleep: todayCheckIn?.sleep_hours ?? 7.2,
    stress: todayCheckIn?.stress_level ?? 4,
    mood: todayCheckIn?.mood ?? 8,
  };

  const LINES = [
    ['Energy', 'energy', C.amber],
    ['Sleep',  'sleep',  C.plum],
    ['Stress', 'stress', C.sage],
    ['Mood',   'mood',   C.terracottaMid],
  ];

  return (
    <AppLayout>
      <style>{`
        .display { font-family: 'Fraunces', Georgia, serif; font-weight: 400; letter-spacing: -0.02em; }
        .eyebrow { font-family: 'Manrope', sans-serif; font-size: 11px; font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase; color: ${C.mute}; }
        .fade-up { animation: fu 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .fade-up.d1 { animation-delay: 0.05s; }
        .fade-up.d2 { animation-delay: 0.12s; }
        .fade-up.d3 { animation-delay: 0.20s; }
        .fade-up.d4 { animation-delay: 0.28s; }
        .fade-up.d5 { animation-delay: 0.36s; }
        @keyframes fu { from { opacity: 0; transform: translateY(14px); }
                          to { opacity: 1; transform: translateY(0); } }
        .hover-lift { transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s ease; }
        .hover-lift:hover { transform: translateY(-3px); box-shadow: 0 22px 50px -32px rgba(61,74,82,0.30); }
        .divider { height: 1px; background: linear-gradient(to right, transparent, ${C.line}, transparent);
          margin: 0 auto; width: 80px; }
        .legend-item { display: inline-flex; align-items: center; gap: 8px;
          font-family: 'Manrope', sans-serif; font-size: 12px; color: ${C.body};
          font-weight: 500; padding: 6px 10px; border-radius: 999px; }
        .dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
      `}</style>

      <div style={{ maxWidth: 980, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* ─── HERO ─── */}
        <section className="fade-up" style={{
          position: 'relative', overflow: 'hidden',
          marginBottom: 56, padding: '52px 44px',
          borderRadius: 32,
          background: `linear-gradient(135deg, rgba(107,158,127,0.14) 0%, rgba(237,226,236,0.55) 60%, rgba(245,221,208,0.40) 100%)`,
          border: `1px solid rgba(107,158,127,0.10)`,
        }}>
          <div style={{
            position: 'absolute', width: 340, height: 340, borderRadius: '50%',
            background: 'rgba(107,158,127,0.10)', filter: 'blur(80px)',
            top: -140, right: -90,
          }}/>
          <Watermark size={320} style={{ bottom: -90, left: -10 }}/>

          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%', background: C.terracottaMid,
                boxShadow: `0 0 0 4px rgba(201,123,92,0.18)`,
              }}/>
              <div className="eyebrow" style={{ color: C.sageDark }}>
                Your insights · {todayLong()}
              </div>
            </div>

            <h1 className="display" style={{
              fontSize: 'clamp(38px, 5vw, 56px)', lineHeight: 1.05,
              color: C.ink, marginBottom: 22, maxWidth: 740, letterSpacing: '-0.025em',
              margin: '0 0 22px',
            }}>
              Understanding your{' '}
              <em style={{ fontStyle: 'italic', color: C.sage }}>wellness rhythms</em>{' '}
              over time.
            </h1>

            <p style={{
              fontSize: 17, lineHeight: 1.75, color: C.body,
              maxWidth: 640, margin: 0,
              fontFamily: "'Manrope', sans-serif",
            }}>
              Small shifts become clearer with consistency. These insights gently reveal what
              may be supporting your energy, mood, stress and recovery — so you can lean into
              what's working.
            </p>
          </div>
        </section>

        {/* ─── TODAY SNAPSHOT ─── */}
        <section className="fade-up d1" style={{ marginBottom: 48 }}>
          <div style={{ marginBottom: 18 }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>This morning</div>
            <h2 className="display" style={{ fontSize: 26, color: C.ink, fontWeight: 500, margin: 0 }}>
              Your snapshot
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14 }}>
            <Vital Icon={Zap}   label="Energy" value={today.energy} suffix="/10" mood="Steady"  bg={C.amberBg}      accent={C.amber}      text="#8B6A30"/>
            <Vital Icon={Moon}  label="Sleep"  value={today.sleep}  suffix="h"   mood="Restful" bg={C.plumBg}       accent={C.plum}       text="#5D4459"/>
            <Vital Icon={Waves} label="Stress" value={today.stress} suffix="/10" mood="Calm"    bg={C.sageMint}     accent={C.sageDark}   text="#3D5E48"/>
            <Vital Icon={Heart} label="Mood"   value={today.mood}   suffix="/10" mood="Bright"  bg={C.terracottaBg} accent={C.terracotta} text="#8B4A30"/>
          </div>
        </section>

        {/* ─── WEEKLY TRENDS ─── */}
        {Object.keys(trends).length > 0 && (
          <section className="fade-up d2" style={{ marginBottom: 48 }}>
            <div style={{ marginBottom: 18 }}>
              <div className="eyebrow" style={{ marginBottom: 8 }}>This week vs. last</div>
              <h2 className="display" style={{ fontSize: 26, color: C.ink, fontWeight: 500, margin: 0 }}>
                Weekly trends
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
              <Metric label="Energy" value={trends.energy} series={sparklines.energy}/>
              <Metric label="Sleep"  value={trends.sleep}  series={sparklines.sleep}/>
              <Metric label="Stress" value={trends.stress} series={sparklines.stress} isStress/>
              <Metric label="Mood"   value={trends.mood}   series={sparklines.mood}/>
            </div>
          </section>
        )}

        {/* ─── SIGNALS CHART ─── */}
        {chartData.length > 0 && (
          <section className="fade-up d3" style={{ marginBottom: 48 }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'flex-end', gap: 16, marginBottom: 20, flexWrap: 'wrap',
            }}>
              <div>
                <div className="eyebrow" style={{ marginBottom: 8 }}>Patterns in motion</div>
                <h2 className="display" style={{ fontSize: 26, color: C.ink, fontWeight: 500, margin: 0 }}>
                  Wellness signals over time
                </h2>
              </div>
              <div style={{
                display: 'flex', gap: 4, padding: 4,
                background: C.paper, borderRadius: 999,
                border: `1px solid ${C.lineSoft}`,
              }}>
                <Chip active={period === 7}  onClick={() => setPeriod(7)}>7 days</Chip>
                <Chip active={period === 14} onClick={() => setPeriod(14)}>14 days</Chip>
                <Chip active={period === 30} onClick={() => setPeriod(30)}>30 days</Chip>
              </div>
            </div>

            <div className="hover-lift" style={{
              position: 'relative', overflow: 'hidden',
              background: C.paper, border: `1px solid ${C.lineSoft}`,
              borderRadius: 24, padding: '32px 28px 24px',
              boxShadow: '0 10px 30px -22px rgba(61,74,82,0.18)',
            }}>
              <Watermark size={280} color="rgba(168,153,104,0.04)" style={{ top: -60, right: -40 }}/>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -16, bottom: 0 }}>
                  <defs>
                    {LINES.map(([, key, color]) => (
                      <linearGradient key={key} id={`area-${key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.14"/>
                        <stop offset="100%" stopColor={color} stopOpacity="0"/>
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="2 6" stroke="rgba(168,153,104,0.18)" vertical={false}/>
                  <XAxis dataKey="date" stroke={C.mute}
                    tickLine={false} axisLine={false}
                    style={{ fontSize: 11, fontFamily: 'Manrope', fontWeight: 500 }}/>
                  <YAxis stroke={C.mute} domain={[0, 10]}
                    tickLine={false} axisLine={false}
                    style={{ fontSize: 11, fontFamily: 'Manrope', fontWeight: 500 }}/>
                  <Tooltip content={<ChartTooltip/>} cursor={{ stroke: C.line, strokeWidth: 1 }}/>
                  {LINES.map(([, key, color]) => (
                    <Line key={key} type="monotone" dataKey={key}
                      stroke={color} strokeWidth={2.4} dot={false}
                      activeDot={{ r: 5, fill: color, stroke: C.paper, strokeWidth: 2 }}/>
                  ))}
                </LineChart>
              </ResponsiveContainer>

              <div style={{
                display: 'flex', justifyContent: 'center', gap: 6,
                marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.lineSoft}`,
                flexWrap: 'wrap',
              }}>
                {LINES.map(([label, , color]) => (
                  <div key={label} className="legend-item">
                    <span className="dot" style={{ background: color }}/>
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── PATTERNS ─── */}
        <section className="fade-up d4" style={{ marginBottom: 48 }}>
          <div style={{ marginBottom: 18 }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>Patterns emerging</div>
            <h2 className="display" style={{ fontSize: 26, color: C.ink, fontWeight: 500, margin: 0 }}>
              What your check-ins may be revealing
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {patterns.map((p, i) => {
              const palette = p.tone === 'positive'
                ? { bg: C.sageMint,    accent: C.sageDark,    glow: 'rgba(107,158,127,0.14)' }
                : p.tone === 'warning'
                  ? { bg: C.terracottaBg, accent: C.terracotta, glow: 'rgba(201,123,92,0.12)' }
                  : { bg: C.paperWarm,  accent: C.mute,        glow: 'rgba(168,153,104,0.10)' };

              return (
                <div key={i} className="hover-lift" style={{
                  position: 'relative', overflow: 'hidden',
                  background: palette.bg, border: `1px solid ${C.lineSoft}`,
                  borderRadius: 22, padding: '30px 32px',
                }}>
                  <div style={{
                    position: 'absolute', width: 180, height: 180, borderRadius: '50%',
                    background: palette.glow, filter: 'blur(55px)',
                    top: -60, right: -40,
                  }}/>
                  <Watermark size={140}
                    color={p.tone === 'positive' ? 'rgba(85,126,100,0.05)'
                         : p.tone === 'warning'  ? 'rgba(168,90,61,0.05)'
                                                 : 'rgba(168,153,104,0.05)'}
                    style={{ bottom: -50, right: 24 }}/>

                  <div style={{ position: 'relative', zIndex: 2,
                    display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                    <Quote size={22} strokeWidth={1.6}
                      style={{ color: palette.accent, flexShrink: 0, marginTop: 6, opacity: 0.7 }}/>
                    <div>
                      <h3 className="display" style={{
                        fontSize: 22, color: C.ink, fontWeight: 500,
                        marginBottom: 10, lineHeight: 1.3, letterSpacing: '-0.015em', margin: '0 0 10px',
                      }}>{p.title}</h3>
                      <p style={{
                        fontFamily: "'Manrope', sans-serif", fontSize: 14.5,
                        color: C.body, lineHeight: 1.75, maxWidth: 640, margin: 0,
                      }}>{p.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── WELLNESS PLAN ─── */}
        <section className="fade-up d5" style={{ marginBottom: 48 }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'baseline', marginBottom: 20, gap: 12, flexWrap: 'wrap',
          }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 8 }}>Your support plan</div>
              <h2 className="display" style={{ fontSize: 26, color: C.ink, fontWeight: 500, margin: 0 }}>
                Your wellness plan
              </h2>
            </div>
            <button style={{
              background: 'transparent', border: `1px solid ${C.sage}`,
              color: C.sageDark, padding: '9px 18px', borderRadius: 999,
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              fontFamily: "'Manrope', sans-serif", letterSpacing: '0.04em',
            }}>Adjust plan</button>
          </div>

          <div style={{ display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {[
              { eyebrow: 'Sleep Support',    title: 'Consistent bedtime by 10:30pm', note: 'Building consistency', progress: 0.45, bg: C.plumBg,       accent: C.plum },
              { eyebrow: 'Stress Recovery',  title: '10 minute nervous system reset', note: 'Steady progress',     progress: 0.70, bg: C.sageMint,     accent: C.sageDark },
              { eyebrow: 'Movement Rhythm',  title: 'Walk after lunch most days',     note: '5 / 7 days this week', progress: 5/7,  bg: C.terracottaBg, accent: C.terracotta },
            ].map((item, i) => (
              <div key={i} className="hover-lift" style={{
                position: 'relative', overflow: 'hidden',
                background: item.bg, border: `1px solid ${C.lineSoft}`,
                borderRadius: 22, padding: '26px 26px 22px',
              }}>
                <div style={{
                  position: 'absolute', width: 140, height: 140, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.20)', filter: 'blur(45px)',
                  top: -50, right: -30,
                }}/>

                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: 14,
                  }}>
                    <div className="eyebrow" style={{ color: item.accent, fontSize: 10 }}>
                      {item.eyebrow}
                    </div>
                    {/* progress ring */}
                    <svg width="32" height="32" viewBox="0 0 32 32" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="16" cy="16" r="13" fill="none"
                        stroke="rgba(255,255,255,0.5)" strokeWidth="2.5"/>
                      <circle cx="16" cy="16" r="13" fill="none"
                        stroke={item.accent} strokeWidth="2.5" strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 13 * item.progress} ${2 * Math.PI * 13}`}/>
                    </svg>
                  </div>

                  <h3 className="display" style={{
                    fontSize: 21, color: C.ink, lineHeight: 1.3,
                    marginBottom: 16, fontWeight: 500, letterSpacing: '-0.012em',
                    margin: '0 0 16px',
                  }}>{item.title}</h3>

                  <div style={{
                    fontFamily: "'Manrope', sans-serif", fontSize: 12.5,
                    color: item.accent, fontWeight: 600,
                  }}>{item.note}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="divider" style={{ margin: '0 auto 40px' }}/>

        {/* ─── WEEKLY REFLECTION ─── */}
        <section className="fade-up">
          <div style={{
            position: 'relative', overflow: 'hidden',
            padding: '52px 48px', borderRadius: 32,
            background: `linear-gradient(135deg, rgba(107,158,127,0.12) 0%, rgba(237,226,236,0.45) 100%)`,
            border: `1px solid rgba(107,158,127,0.10)`,
          }}>
            <div style={{
              position: 'absolute', width: 280, height: 280, borderRadius: '50%',
              background: 'rgba(107,158,127,0.10)', filter: 'blur(70px)',
              top: -100, right: -60,
            }}/>
            <Watermark size={360} style={{ bottom: -130, right: -20 }}/>

            <div style={{
              position: 'relative', zIndex: 2, textAlign: 'center',
              maxWidth: 680, margin: '0 auto',
            }}>
              <div className="eyebrow" style={{ color: C.sageDark, marginBottom: 18 }}>
                Weekly reflection
              </div>

              <h2 className="display" style={{
                fontSize: 'clamp(26px, 3.4vw, 34px)', color: C.ink,
                lineHeight: 1.25, marginBottom: 24, letterSpacing: '-0.02em',
                fontWeight: 400, margin: '0 0 24px',
              }}>
                Your recent check-ins suggest a more{' '}
                <em style={{ fontStyle: 'italic', color: C.sage }}>balanced rhythm</em>{' '}
                than last week.
              </h2>

              <p style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: 15, lineHeight: 1.85, color: C.body,
                maxWidth: 580, margin: '0 auto 28px',
              }}>
                Slower mornings, steadier sleep and reduced stress may be helping your energy
                feel more supported lately. Small consistent habits are beginning to compound,
                gently, over time.
              </p>

              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '6px 14px', borderRadius: 999,
                background: 'rgba(255,255,255,0.55)',
                border: `1px solid ${C.lineSoft}`,
              }}>
                <span style={{
                  fontFamily: "'Fraunces', serif", fontStyle: 'italic',
                  fontSize: 18, color: C.sageDark,
                }}>—</span>
                <span style={{
                  fontFamily: "'Manrope', sans-serif", fontSize: 11.5,
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: C.sageDark, fontWeight: 700,
                }}>From your coach</span>
              </div>
            </div>
          </div>
        </section>

      </div>
    </AppLayout>
  );
}
