import React, { useState, useEffect } from 'react';
import { useUserData } from '../context/UserDataContext';
import AppLayout from './AppLayout';
import { TrendingUp, TrendingDown, Sparkles, Droplet, Activity, Salad } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Insights() {
  const { checkIns } = useUserData();
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
        p.push({ title: 'Sleep is affecting your energy', desc: `You're averaging ${avgSleep.toFixed(1)}h of sleep and ${avgEnergy.toFixed(1)}/10 energy. Adding 30 minutes could lift energy by 1–2 points.`, tone: 'warning' });
      }
      if (avgStress > 7 && avgSleep < 8) {
        p.push({ title: 'High stress is disrupting sleep', desc: `Stress at ${avgStress.toFixed(1)}/10 is likely affecting sleep quality. A 5-minute breathing routine before bed often helps.`, tone: 'warning' });
      }
      if (data.length >= 7) {
        const last7 = data.slice(-7);
        const first7 = data.slice(0, 7);
        const lastEnergy = last7.reduce((s, c) => s + (c.energy || 0), 0) / 7;
        const firstEnergy = first7.reduce((s, c) => s + (c.energy || 0), 0) / 7;
        if (lastEnergy > firstEnergy + 0.5) {
          p.push({ title: 'Energy is improving', desc: `You're up ${(lastEnergy - firstEnergy).toFixed(1)} points this week. Whatever you're doing — keep going.`, tone: 'positive' });
        }
      }
    }
    if (p.length === 0) {
      p.push({ title: 'Building your baseline', desc: 'Patterns become clearer after 5+ check-ins. Stay consistent and insights will follow.', tone: 'neutral' });
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

  const Metric = ({ label, value, isStress }) => {
    const isPositive = (value > 0 && !isStress) || (value < 0 && isStress);
    const color = isPositive ? '#6B9E7F' : '#CC4444';
    return (
      <div style={{ background: '#FAF8F5', border: '1px solid rgba(168, 153, 104, 0.15)', borderRadius: '10px', padding: '18px' }}>
        <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: '11px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#A89968', marginBottom: '10px' }}>{label}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: '24px', fontWeight: 500, color }}>{value > 0 ? '+' : ''}{Math.abs(value).toFixed(1)}%</span>
          {isPositive ? <TrendingUp size={16} strokeWidth={2} style={{ color }} /> : <TrendingDown size={16} strokeWidth={2} style={{ color }} />}
        </div>
      </div>
    );
  };

  const Chart = ({ title, dataKey, stroke, domain }) => (
    <div style={{ background: '#FAF8F5', border: '1px solid rgba(168, 153, 104, 0.15)', borderRadius: '12px', padding: '24px' }}>
      <h3 className="display" style={{ fontSize: '18px', color: '#3D4A52', fontWeight: 500, marginBottom: '16px' }}>{title}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 153, 104, 0.15)" />
          <XAxis dataKey="date" stroke="#A89968" style={{ fontSize: '11px', fontFamily: 'Manrope' }} />
          <YAxis stroke="#A89968" style={{ fontSize: '11px', fontFamily: 'Manrope' }} domain={domain} />
          <Tooltip contentStyle={{ backgroundColor: '#FAF8F5', border: '1px solid rgba(168, 153, 104, 0.3)', borderRadius: '8px', fontFamily: 'Manrope' }} />
          <Line type="monotone" dataKey={dataKey} stroke={stroke} strokeWidth={2} dot={{ fill: stroke, r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <AppLayout>
      <style>{`
        .display { font-family: 'Fraunces', Georgia, serif; font-weight: 400; letter-spacing: -0.02em; }
        .eyebrow { font-family: 'Manrope', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: #A89968; }
        .fade-up { animation: fu 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
        @keyframes fu { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 24px' }}>
        <div className="fade-up" style={{ marginBottom: '40px' }}>
          <div className="eyebrow" style={{ marginBottom: '12px' }}>Your insights</div>
          <h1 className="display" style={{ fontSize: 'clamp(32px, 5vw, 44px)', lineHeight: 1.1, color: '#3D4A52' }}>
            What we're <em style={{ fontStyle: 'italic', color: '#6B9E7F' }}>noticing.</em>
          </h1>
        </div>

        {Object.keys(trends).length > 0 && (
          <section className="fade-up" style={{ marginBottom: '40px' }}>
            <h2 className="display" style={{ fontSize: '22px', color: '#3D4A52', fontWeight: 500, marginBottom: '16px' }}>Weekly trends</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
              <Metric label="Energy" value={trends.energy} />
              <Metric label="Sleep" value={trends.sleep} />
              <Metric label="Stress" value={trends.stress} isStress />
              <Metric label="Mood" value={trends.mood} />
            </div>
          </section>
        )}

        {chartData.length > 0 && (
          <section className="fade-up" style={{ marginBottom: '40px' }}>
            <h2 className="display" style={{ fontSize: '22px', color: '#3D4A52', fontWeight: 500, marginBottom: '16px' }}>Wellness signals over time</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Chart title="Energy" dataKey="energy" stroke="#6B9E7F" domain={[0, 10]} />
              <Chart title="Sleep hours" dataKey="sleep" stroke="#A89968" domain={[0, 12]} />
              <Chart title="Stress" dataKey="stress" stroke="#C97B5C" domain={[0, 10]} />
              <Chart title="Mood" dataKey="mood" stroke="#9B7B96" domain={[0, 10]} />
            </div>
          </section>
        )}

        <section className="fade-up" style={{ marginBottom: '40px' }}>
          <h2 className="display" style={{ fontSize: '22px', color: '#3D4A52', fontWeight: 500, marginBottom: '16px' }}>Patterns</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {patterns.map((p, i) => {
              const colors = {
                positive: { bg: '#EDF4EF', border: '#6B9E7F', text: '#557E64' },
                warning: { bg: '#F5DDD0', border: '#C97B5C', text: '#A85A3D' },
                neutral: { bg: '#FAF8F5', border: '#A89968', text: '#5A6770' },
              };
              const c = colors[p.tone] || colors.neutral;
              return (
                <div key={i} style={{ background: c.bg, borderLeft: `3px solid ${c.border}`, borderRadius: '8px', padding: '18px 22px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <Sparkles size={18} strokeWidth={1.8} style={{ color: c.border, flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <h3 className="display" style={{ fontSize: '17px', color: '#3D4A52', fontWeight: 500, marginBottom: '6px' }}>{p.title}</h3>
                      <p style={{ fontSize: '14px', color: c.text, lineHeight: 1.55 }}>{p.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="fade-up">
          <h2 className="display" style={{ fontSize: '22px', color: '#3D4A52', fontWeight: 500, marginBottom: '16px' }}>Recommendations</h2>
          <div style={{ background: '#FAF8F5', border: '1px solid rgba(168, 153, 104, 0.15)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { icon: Droplet, title: 'Stay hydrated', desc: 'Aim for 2–3L of water daily. Dehydration often shows up as fatigue first.' },
              { icon: Activity, title: 'Manage stress', desc: 'Try a 5-minute breathing exercise daily. Consistency matters more than length.' },
              { icon: Salad, title: 'Nutrition support', desc: 'Add protein and iron-rich foods to support energy and overall wellness.' },
            ].map((r, i) => {
              const Icon = r.icon;
              return (
                <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <Icon size={20} strokeWidth={1.6} style={{ color: '#6B9E7F', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h3 className="display" style={{ fontSize: '16px', color: '#3D4A52', fontWeight: 500, marginBottom: '4px' }}>{r.title}</h3>
                    <p style={{ fontSize: '13px', color: '#5A6770', lineHeight: 1.55 }}>{r.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
