import React, { useState, useEffect } from 'react';
import { useUserData } from '../context/UserDataContext';
import AppLayout from './AppLayout';
import { TrendingUp, TrendingDown, Sparkles, Droplet, Activity, Salad, Zap, Moon, Heart, Waves } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Insights() {
  const { checkIns, getTodayCheckIn } = useUserData();
  const [chartData, setChartData] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [trends, setTrends] = useState({});

  useEffect(() => {
    if (checkIns?.length > 0) processCheckIns();
  }, [checkIns]);

  const processCheckIns = () => {
    const sorted = [...checkIns].sort((a, b) => new Date(a.date || a.created_at) - new Date(b.date || b.created_at)).slice(-14);
    const formatted = sorted.map(c => ({
      date: new Date(c.date || c.created_at).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' }),
      energy: c.energy || 0, sleep: c.sleep_hours || 0, stress: c.stress_level || 0, mood: c.mood || 0,
    }));
    setChartData(formatted);
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
          desc: `Your recent check-ins suggest that lighter sleep could be affecting how steady your energy feels throughout the day.`,
          tone: 'neutral'
        });
      }

      if (avgStress > 7 && avgSleep < 8) {
        p.push({
          title: 'Your nervous system may be asking for slower recovery',
          desc: `Stress levels have been slightly elevated lately, which can sometimes make rest feel less restorative.`,
          tone: 'neutral'
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
            desc: `Recent check-ins suggest your energy has been feeling more supported and consistent lately.`,
            tone: 'positive'
          });
        }
      }
    }

    if (p.length === 0) {
      p.push({ title: 'Your patterns are beginning to take shape', desc: 'The more you check in, the more GlowWise can gently understand your wellbeing rhythms over time.', tone: 'neutral' });
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
    setTrends({ energy: trend('energy'), sleep: trend('sleep_hours'), stress: trend('stress_level'), mood: trend('mood') });
  };

  // ============ VITAL CARD COMPONENT ============
  const Vital = ({ Icon, label, value, suffix, mood, bg, accent, text }) => (
    <div style={{
      background: bg,
      border: '1px solid rgba(168, 153, 104, 0.10)',
      borderRadius: 14,
      padding: '20px 20px 22px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, color: accent }}>
        <Icon size={14} strokeWidth={1.6} />
        <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: accent }}>
          {label}
        </span>
      </div>
      <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 400, fontSize: 32, color: text, marginBottom: 6, letterSpacing: '-0.02em' }}>
        {value}
        <span style={{ fontSize: 13, color: accent, marginLeft: 3 }}>{suffix}</span>
      </div>
      <div style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontSize: 14, color: accent }}>
        {mood}
      </div>
    </div>
  );

  // ============ METRIC CARD COMPONENT ============
  const Metric = ({ label, value, isStress }) => {
    const positive = (value > 0 && !isStress) || (value < 0 && isStress);
    const isNeutral = Math.abs(value) < 1;

    const config = isNeutral
      ? {
          tone: 'Building baseline',
          bg: '#FAF8F5',
          accent: '#A89968',
          glow: 'rgba(168,153,104,0.10)',
        }
      : positive
        ? {
            tone: 'Improving',
            bg: '#EDF4EF',
            accent: '#557E64',
            glow: 'rgba(107,158,127,0.18)',
          }
        : {
            tone: 'Needs support',
            bg: '#FAF8F5',
            accent: '#A85A3D',
            glow: 'rgba(201,123,92,0.12)',
          };

    return (
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: config.bg,
          border: '1px solid rgba(168,153,104,0.10)',
          borderRadius: '18px',
          padding: '24px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: config.glow,
            filter: 'blur(40px)',
            top: '-40px',
            right: '-30px',
          }}
        />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#A89968',
              marginBottom: '16px',
            }}
          >
            {label}
          </div>
          <div
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: '34px',
              color: config.accent,
              marginBottom: '10px',
              lineHeight: 1,
            }}
          >
            {value > 0 ? '+' : ''}
            {Math.abs(value).toFixed(0)}%
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '999px',
              background: 'rgba(255,255,255,0.55)',
              fontSize: '12px',
              fontWeight: 600,
              color: config.accent,
            }}
          >
            {isNeutral ? (
              <Sparkles size={13} strokeWidth={2} />
            ) : positive ? (
              <TrendingUp size={13} strokeWidth={2} />
            ) : (
              <TrendingDown size={13} strokeWidth={2} />
            )}
            {config.tone}
          </div>
        </div>
      </div>
    );
  };

  // Get today's check-in
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

  return (
    <AppLayout>
      <style>{`
        .display { font-family: 'Fraunces', Georgia, serif; font-weight: 400; letter-spacing: -0.02em; }
        .eyebrow { font-family: 'Manrope', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: #A89968; }
        .fade-up { animation: fu 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
        @keyframes fu { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Hero Section */}
        <section
          className="fade-up"
          style={{
            marginBottom: '48px',
            padding: '42px 38px',
            borderRadius: '28px',
            background: 'linear-gradient(135deg, rgba(107,158,127,0.12) 0%, rgba(237,226,236,0.50) 100%)',
            border: '1px solid rgba(107,158,127,0.08)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '260px',
              height: '260px',
              borderRadius: '50%',
              background: 'rgba(107,158,127,0.10)',
              filter: 'blur(70px)',
              top: '-100px',
              right: '-60px',
            }}
          />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div className="eyebrow" style={{ marginBottom: '14px', color: '#557E64' }}>
              Your insights
            </div>
            <h1
              className="display"
              style={{
                fontSize: 'clamp(36px, 5vw, 52px)',
                lineHeight: 1.06,
                color: '#3D4A52',
                marginBottom: '18px',
                maxWidth: '720px',
              }}
            >
              Understanding your{' '}
              <em style={{ fontStyle: 'italic', color: '#6B9E7F' }}>wellness rhythms</em>
              {' '}over time.
            </h1>
            <p style={{ fontSize: '16px', lineHeight: 1.75, color: '#5A6770', maxWidth: '620px' }}>
              Small shifts become clearer with consistency. Your insights help reveal what may support your energy, mood, stress, and recovery most gently.
            </p>
          </div>
        </section>

        {/* NEW: YOUR SNAPSHOT SECTION */}
        <section className="fade-up" style={{ marginBottom: '40px' }}>
          <div style={{ marginBottom: '18px' }}>
            <div className="eyebrow" style={{ marginBottom: '6px' }}>This morning</div>
            <h2 className="display" style={{ fontSize: '26px', color: '#3D4A52', margin: 0 }}>
              Your snapshot
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 14 }}>
            <Vital Icon={Zap} label="Energy" value={today.energy} suffix="/10" mood="Steady" bg="#FAF3DC" accent="#A07E3D" text="#8B6A30" />
            <Vital Icon={Moon} label="Sleep" value={today.sleep} suffix="h" mood="Restful" bg="#EDE2EC" accent="#7A5C77" text="#5D4459" />
            <Vital Icon={Waves} label="Stress" value={today.stress} suffix="/10" mood="Calm" bg="#EDF4EF" accent="#557E64" text="#3D5E48" />
            <Vital Icon={Heart} label="Mood" value={today.mood} suffix="/10" mood="Bright" bg="#F5DDD0" accent="#A85A3D" text="#8B4A30" />
          </div>
        </section>

        {/* Weekly Trends */}
        {Object.keys(trends).length > 0 && (
          <section className="fade-up" style={{ marginBottom: '40px' }}>
            <h2 className="display" style={{ fontSize: '22px', color: '#3D4A52', fontWeight: 500, marginBottom: '16px' }}>
              Weekly trends
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
              <Metric label="Energy" value={trends.energy} />
              <Metric label="Sleep" value={trends.sleep} />
              <Metric label="Stress" value={trends.stress} isStress />
              <Metric label="Mood" value={trends.mood} />
            </div>
          </section>
        )}

        {/* Wellness Signals Chart */}
        {chartData.length > 0 && (
          <section className="fade-up" style={{ marginBottom: '40px' }}>
            <h2 className="display" style={{ fontSize: '22px', color: '#3D4A52', fontWeight: 500, marginBottom: '16px' }}>
              Wellness signals over time
            </h2>
            <div style={{ background: '#FAF8F5', border: '1px solid rgba(168, 153, 104, 0.12)', borderRadius: '18px', padding: '28px' }}>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(168,153,104,0.08)" vertical={false} />
                  <XAxis dataKey="date" stroke="#A89968" style={{ fontSize: '11px', fontFamily: 'Manrope' }} />
                  <YAxis stroke="#A89968" style={{ fontSize: '11px', fontFamily: 'Manrope' }} domain={[0, 10]} />
                  <Tooltip contentStyle={{ backgroundColor: '#FAF8F5', border: '1px solid rgba(168,153,104,0.18)', borderRadius: '12px', fontFamily: 'Manrope' }} />
                  <Line type="monotone" dataKey="energy" stroke="#A07E3D" strokeWidth={2.2} dot={false} />
                  <Line type="monotone" dataKey="sleep" stroke="#7A5C77" strokeWidth={2.2} dot={false} />
                  <Line type="monotone" dataKey="stress" stroke="#6B9E7F" strokeWidth={2.2} dot={false} />
                  <Line type="monotone" dataKey="mood" stroke="#C97B5C" strokeWidth={2.2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', marginTop: '18px' }}>
                {[
                  ['Energy', '#A07E3D'],
                  ['Sleep', '#7A5C77'],
                  ['Stress', '#6B9E7F'],
                  ['Mood', '#C97B5C'],
                ].map(([label, color]) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#5A6770', fontWeight: 500 }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color }} />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Patterns Emerging */}
        <section className="fade-up" style={{ marginBottom: '48px' }}>
          <div style={{ marginBottom: '18px' }}>
            <div className="eyebrow" style={{ marginBottom: '8px' }}>Patterns emerging</div>
            <h2 className="display" style={{ fontSize: '26px', color: '#3D4A52', fontWeight: 500 }}>
              What your check-ins may be revealing
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {patterns.map((p, i) => (
              <div
                key={i}
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  background: p.tone === 'positive' ? '#EDF4EF' : p.tone === 'warning' ? '#F5DDD0' : '#FAF8F5',
                  border: '1px solid rgba(168,153,104,0.10)',
                  borderRadius: '22px',
                  padding: '28px',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    width: '160px',
                    height: '160px',
                    borderRadius: '50%',
                    background:
                      p.tone === 'positive'
                        ? 'rgba(107,158,127,0.12)'
                        : p.tone === 'warning'
                          ? 'rgba(201,123,92,0.10)'
                          : 'rgba(168,153,104,0.08)',
                    filter: 'blur(50px)',
                    top: '-50px',
                    right: '-30px',
                  }}
                />
                <div style={{ position: 'relative', zIndex: 2, display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background:
                        p.tone === 'positive'
                          ? 'rgba(107,158,127,0.14)'
                          : p.tone === 'warning'
                            ? 'rgba(201,123,92,0.14)'
                            : 'rgba(168,153,104,0.10)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontFamily: "'Fraunces', serif",
                      fontSize: '22px',
                      fontStyle: 'italic',
                      lineHeight: 1,
                      color: p.tone === 'positive' ? '#557E64' : p.tone === 'warning' ? '#A85A3D' : '#A89968',
                    }}
                  >
                    "
                  </div>
                  <div>
                    <h3 className="display" style={{ fontSize: '22px', color: '#3D4A52', fontWeight: 500, marginBottom: '10px', lineHeight: 1.25 }}>
                      {p.title}
                    </h3>
                    <p style={{ fontSize: '15px', color: '#5A6770', lineHeight: 1.75, maxWidth: '620px' }}>
                      {p.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Weekly Reflection */}
        <section className="fade-up" style={{ marginBottom: '48px' }}>
          <div
            style={{
              position: 'relative',
              overflow: 'hidden',
              padding: '36px 34px',
              borderRadius: '28px',
              background: 'linear-gradient(135deg, rgba(107,158,127,0.10) 0%, rgba(237,226,236,0.42) 100%)',
              border: '1px solid rgba(107,158,127,0.08)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '220px',
                height: '220px',
                borderRadius: '50%',
                background: 'rgba(107,158,127,0.10)',
                filter: 'blur(60px)',
                top: '-80px',
                right: '-40px',
              }}
            />
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div className="eyebrow" style={{ marginBottom: '12px', color: '#557E64' }}>
                Weekly reflection
              </div>
              <h2
                className="display"
                style={{
                  fontSize: '30px',
                  color: '#3D4A52',
                  lineHeight: 1.2,
                  marginBottom: '18px',
                  maxWidth: '700px',
                }}
              >
                Your recent check-ins suggest a more{' '}
                <em style={{ fontStyle: 'italic', color: '#6B9E7F' }}>balanced rhythm</em>
                {' '}than last week.
              </h2>
              <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#5A6770', maxWidth: '620px' }}>
                Slower mornings, steadier sleep, and reduced stress levels may be helping your energy feel more supported lately. Small consistent habits are beginning to compound gently over time.
              </p>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
