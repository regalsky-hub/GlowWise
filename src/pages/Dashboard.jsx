import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../context/UserDataContext';
import AppLayout from './AppLayout';
import { ChevronRight, MessageCircle, Calendar, BarChart3, Settings, Heart, Moon, Activity, Zap, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const { profile, glowScore, glowType, getTodayCheckIn, checkIns } = useUserData();
  const [todayCheckIn, setTodayCheckIn] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { setTodayCheckIn(getTodayCheckIn()); }, [getTodayCheckIn, checkIns]);

  const hasCheckedIn = !!todayCheckIn;
  const userName = profile?.name || 'there';
  const streak = checkIns?.length || 0;

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getScoreLabel = (s) => {
    if (s >= 80) return 'Thriving';
    if (s >= 65) return 'Steady';
    if (s >= 50) return 'Building';
    if (s >= 30) return 'Recovering';
    return 'Just starting';
  };

  const focusAreas = profile?.focusAreas || [];
  const immediateActions = profile?.immediateActions || [];
  const glowTypeDesc = profile?.glowTypeDescription || 'Your personalised wellness profile.';

  // Mock weekly trend until real data exists
  const weekData = checkIns && checkIns.length >= 2
    ? checkIns.slice(-7).map(c => ((c.energy || 5) + (10 - (c.stress_level || 5)) + (c.mood || 5)) / 3 * 10)
    : [];

  return (
    <AppLayout>
      <style>{`
        .display { font-family: 'Fraunces', Georgia, serif; font-weight: 400; letter-spacing: -0.02em; }
        .eyebrow { font-family: 'Manrope', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: #A89968; }
        .fade-up { animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .delay-1 { animation-delay: 0.08s; } .delay-2 { animation-delay: 0.16s; } .delay-3 { animation-delay: 0.24s; } .delay-4 { animation-delay: 0.32s; } .delay-5 { animation-delay: 0.40s; }
        .card { background: #FAF8F5; border: 1px solid rgba(168, 153, 104, 0.15); border-radius: 12px; transition: all 0.3s ease; }
        .card-hover { cursor: pointer; }
        .card-hover:hover { border-color: #6B9E7F; transform: translateY(-2px); box-shadow: 0 12px 32px -16px rgba(61, 74, 82, 0.15); }
        .btn-primary { background: #6B9E7F; color: #FAF8F5; padding: 12px 24px; border: none; border-radius: 100px; font-family: 'Manrope', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.3s ease; display: inline-flex; align-items: center; gap: 8px; }
        .btn-primary:hover { background: #557E64; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(107, 158, 127, 0.25); }
        .btn-ghost { background: transparent; color: #557E64; padding: 10px 18px; border: 1px solid #6B9E7F; border-radius: 100px; font-family: 'Manrope', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.3s ease; display: inline-flex; align-items: center; gap: 6px; }
        .btn-ghost:hover { background: #6B9E7F; color: #FAF8F5; }
        .priority-pill { display: inline-flex; align-items: center; gap: 8px; padding: 10px 16px; background: #EDF4EF; border: 1px solid rgba(107, 158, 127, 0.25); border-radius: 100px; font-size: 13px; font-weight: 500; color: #557E64; }
        .stat-mini { background: #FAF8F5; border: 1px solid rgba(168, 153, 104, 0.12); border-radius: 10px; padding: 18px 16px; text-align: center; }
        .insight-row { display: flex; align-items: center; gap: 14px; padding: 14px 0; border-bottom: 1px solid rgba(168, 153, 104, 0.12); }
        .insight-row:last-child { border-bottom: none; }
        .check-circle { width: 22px; height: 22px; border-radius: 50%; background: #EDF4EF; border: 1.5px solid #6B9E7F; display: flex; align-items: center; justify-content: center; color: #6B9E7F; flex-shrink: 0; font-size: 12px; font-weight: 600; }
        @media (max-width: 768px) { .container-inner { padding: 32px 18px !important; } }
      `}</style>

      <div className="container-inner" style={{ maxWidth: '1080px', margin: '0 auto', padding: '40px 32px' }}>

        {/* Greeting */}
        <section className="fade-up" style={{ marginBottom: '40px' }}>
          <div className="eyebrow" style={{ marginBottom: '12px' }}>{getGreeting()}</div>
          <h1 className="display" style={{ fontSize: 'clamp(36px, 5vw, 52px)', lineHeight: 1.05, color: '#3D4A52', marginBottom: '12px' }}>
            Hello, <em style={{ fontStyle: 'italic', color: '#6B9E7F' }}>{userName}.</em>
          </h1>
          <p style={{ fontSize: '17px', lineHeight: 1.6, color: '#5A6770', maxWidth: '560px' }}>
            {hasCheckedIn ? `You've checked in ${streak} ${streak === 1 ? 'day' : 'days'} so far. Here's how today is shaping up.` : `It's a new day. When you're ready, take 60 seconds to check in.`}
          </p>
        </section>

        {/* AI Coach Welcome */}
        <section className="fade-up delay-1 card" style={{ marginBottom: '32px', padding: '28px 32px', background: 'linear-gradient(135deg, #6B9E7F 0%, #557E64 100%)', border: 'none', color: '#FAF8F5', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', fontFamily: "'Fraunces', serif", fontSize: '200px', color: 'rgba(250, 248, 245, 0.06)', lineHeight: 1, pointerEvents: 'none' }}>g</div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', position: 'relative' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#FAF8F5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#557E64', fontFamily: "'Fraunces', serif", fontSize: '20px', fontWeight: 500, flexShrink: 0 }}>g</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: '11px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(250, 248, 245, 0.7)', marginBottom: '8px' }}>Your wellness coach</div>
              <p className="display" style={{ fontSize: '20px', lineHeight: 1.45, color: '#FAF8F5', fontStyle: 'italic', marginBottom: '18px', fontWeight: 400 }}>
                {hasCheckedIn ? `"Welcome back, ${userName}. Let's see what today's check-in tells us. Tap chat anytime."` : `"Welcome back, ${userName}. When you're ready, let's check in and see what today brings."`}
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button onClick={() => navigate('/ai-coach')} style={{ background: '#FAF8F5', color: '#557E64', border: 'none', padding: '10px 20px', borderRadius: '100px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <MessageCircle size={14} strokeWidth={2} />Open chat
                </button>
                <button onClick={() => navigate('/ai-coach')} style={{ background: 'transparent', color: '#FAF8F5', border: '1px solid rgba(250, 248, 245, 0.4)', padding: '10px 20px', borderRadius: '100px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>Ask a question</button>
              </div>
            </div>
          </div>
        </section>

        {/* Snapshot or Check-in CTA */}
        {hasCheckedIn ? (
          <section className="fade-up delay-2" style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
              <div>
                <div className="eyebrow" style={{ marginBottom: '6px' }}>Today</div>
                <h2 className="display" style={{ fontSize: '24px', color: '#3D4A52' }}>Your snapshot</h2>
              </div>
              <button onClick={() => navigate('/checkin')} className="btn-ghost">Update <ChevronRight size={14} strokeWidth={2} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
              {[
                { icon: Zap, label: 'Energy', value: todayCheckIn.energy, suffix: '/10' },
                { icon: Moon, label: 'Sleep', value: todayCheckIn.sleep_hours, suffix: 'h' },
                { icon: Activity, label: 'Stress', value: todayCheckIn.stress_level, suffix: '/10' },
                { icon: Heart, label: 'Mood', value: todayCheckIn.mood || 7, suffix: '/10' },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="stat-mini">
                    <Icon size={20} strokeWidth={1.6} style={{ color: '#6B9E7F', marginBottom: '8px' }} />
                    <div className="display" style={{ fontSize: '28px', fontWeight: 500, color: '#3D4A52', marginBottom: '4px' }}>
                      {s.value}<span style={{ fontSize: '14px', color: '#A89968' }}>{s.suffix}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#5A6770', fontWeight: 500 }}>{s.label}</div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : (
          <section className="fade-up delay-2 card" style={{ marginBottom: '32px', padding: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '240px' }}>
              <div className="eyebrow" style={{ marginBottom: '8px' }}>Daily check-in</div>
              <h3 className="display" style={{ fontSize: '22px', color: '#3D4A52', marginBottom: '8px', fontWeight: 500 }}>How are you feeling today?</h3>
              <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#5A6770' }}>60 seconds. Energy, sleep, stress, mood. The foundation of every insight.</p>
            </div>
            <button onClick={() => navigate('/checkin')} className="btn-primary">Check in <ChevronRight size={14} strokeWidth={2} /></button>
          </section>
        )}

        {/* Glow Score + Glow Type */}
        <section className="fade-up delay-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {/* Glow Score - Terracotta */}
          <div className="card" style={{ padding: '28px 32px', background: '#F5DDD0', border: '1px solid rgba(201, 123, 92, 0.25)' }}>
            <div className="eyebrow" style={{ marginBottom: '20px', color: '#A85A3D' }}>Glow Score</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '20px' }}>
              <div className="display" style={{ fontSize: '64px', lineHeight: 1, color: '#A85A3D', fontWeight: 400 }}>
                {hasCheckedIn ? glowScore : '—'}
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#8B4A30', marginBottom: '2px' }}>
                  {hasCheckedIn ? getScoreLabel(glowScore) : 'No score yet'}
                </div>
                <div style={{ fontSize: '11px', color: '#C97B5C' }}>
                  {hasCheckedIn ? `Based on ${streak} check-${streak === 1 ? 'in' : 'ins'}` : 'Check in to start'}
                </div>
              </div>
            </div>
            {hasCheckedIn && weekData.length >= 2 && (
              <svg width="100%" height="40" viewBox="0 0 240 40" style={{ marginBottom: '12px' }}>
                <polyline points={weekData.map((v, i) => `${i * (240 / Math.max(weekData.length - 1, 1)) + 4},${40 - (v - 30) * 0.5}`).join(' ')} fill="none" stroke="#C97B5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                {weekData.map((v, i) => (<circle key={i} cx={i * (240 / Math.max(weekData.length - 1, 1)) + 4} cy={40 - (v - 30) * 0.5} r={i === weekData.length - 1 ? 4 : 2.5} fill={i === weekData.length - 1 ? '#A85A3D' : '#C97B5C'} />))}
              </svg>
            )}
            <p style={{ fontSize: '12px', color: '#8B4A30', lineHeight: 1.5, opacity: 0.75 }}>Based on sleep, energy, stress, and mood across recent check-ins.</p>
          </div>

          {/* Glow Type - Plum */}
          <div className="card" style={{ padding: '28px 32px', background: '#EDE2EC', border: '1px solid rgba(155, 123, 150, 0.3)' }}>
            <div className="eyebrow" style={{ marginBottom: '12px', color: '#7A5C77' }}>Your Glow Type</div>
            <h3 className="display" style={{ fontSize: '24px', lineHeight: 1.15, color: '#3D4A52', fontWeight: 500, fontStyle: 'italic', marginBottom: '14px' }}>
              {glowType || 'Balanced Wellness Glow'}
            </h3>
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#7A5C77', marginBottom: '20px' }}>{glowTypeDesc}</p>
            <button onClick={() => navigate('/ai-coach')} style={{ background: 'none', border: 'none', color: '#7A5C77', fontSize: '13px', fontWeight: 600, cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center', gap: '4px', borderBottom: '1px solid #7A5C77', paddingBottom: '2px' }}>
              Learn about your type <ChevronRight size={12} strokeWidth={2.5} />
            </button>
          </div>
        </section>

        {/* Insights preview */}
        {streak > 0 && (
          <section className="fade-up delay-4 card" style={{ padding: '28px 32px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '24px' }}>
              <div>
                <div className="eyebrow" style={{ marginBottom: '6px' }}>This week</div>
                <h2 className="display" style={{ fontSize: '24px', color: '#3D4A52', fontWeight: 500 }}>What we're noticing</h2>
              </div>
              <button onClick={() => navigate('/insights')} className="btn-ghost"><BarChart3 size={14} strokeWidth={2} />Full insights</button>
            </div>
            {streak < 3 ? (
              <div className="insight-row">
                <div className="check-circle"><Sparkles size={11} strokeWidth={2} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#3D4A52', marginBottom: '2px' }}>Building your baseline</div>
                  <div style={{ fontSize: '13px', color: '#5A6770', lineHeight: 1.5 }}>Patterns become clearer after 5+ check-ins. You're {streak}/5 there.</div>
                </div>
              </div>
            ) : (
              <div className="insight-row">
                <div className="check-circle"><span style={{ fontSize: '10px' }}>↑</span></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#3D4A52', marginBottom: '2px' }}>Tracking is paying off</div>
                  <div style={{ fontSize: '13px', color: '#5A6770', lineHeight: 1.5 }}>You're building real data. Visit Insights to see your patterns.</div>
                </div>
              </div>
            )}
            <div className="insight-row">
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#F5E8D0', border: '1.5px solid #D4A55C', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A07E3D', flexShrink: 0 }}>
                <Sparkles size={11} strokeWidth={2} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#3D4A52', marginBottom: '2px' }}>{streak}-day check-in streak</div>
                <div style={{ fontSize: '13px', color: '#5A6770', lineHeight: 1.5 }}>Consistency is the foundation of personalised insight. Keep going.</div>
              </div>
            </div>
          </section>
        )}

        {/* Focus areas */}
        {focusAreas.length > 0 && (
          <section className="fade-up delay-5 card" style={{ padding: '28px 32px', marginBottom: '32px' }}>
            <div style={{ marginBottom: '20px' }}>
              <div className="eyebrow" style={{ marginBottom: '6px' }}>Focus areas</div>
              <h2 className="display" style={{ fontSize: '24px', color: '#3D4A52', fontWeight: 500 }}>What we're working on</h2>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {focusAreas.map((area, i) => (<span key={i} className="priority-pill">{area}</span>))}
            </div>
          </section>
        )}

        {/* Today's actions */}
        {immediateActions.length > 0 && (
          <section className="fade-up delay-5 card" style={{ padding: '28px 32px', marginBottom: '32px' }}>
            <div style={{ marginBottom: '24px' }}>
              <div className="eyebrow" style={{ marginBottom: '6px' }}>Recommended</div>
              <h2 className="display" style={{ fontSize: '24px', color: '#3D4A52', fontWeight: 500 }}>Small steps for today</h2>
            </div>
            <div>
              {immediateActions.map((action, i) => (
                <div key={i} className="insight-row" style={{ cursor: 'pointer' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: '1.5px solid rgba(107, 158, 127, 0.4)', flexShrink: 0 }}></div>
                  <div style={{ flex: 1, fontSize: '14px', color: '#3D4A52', fontWeight: 500 }}>{action}</div>
                  <ChevronRight size={16} strokeWidth={1.8} style={{ color: '#A89968' }} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Quick navigation - desktop */}
        <section className="fade-up delay-5 desktop-only" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          {[
            { icon: Calendar, label: 'Daily check-in', desc: '60-second snapshot', path: '/checkin' },
            { icon: MessageCircle, label: 'AI Coach', desc: 'Ask anything', path: '/ai-coach' },
            { icon: BarChart3, label: 'Insights', desc: 'See your patterns', path: '/insights' },
            { icon: Settings, label: 'Settings', desc: 'Profile & privacy', path: '/settings' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <button key={i} onClick={() => navigate(item.path)} className="card card-hover" style={{ padding: '20px', textAlign: 'left', cursor: 'pointer' }}>
                <Icon size={20} strokeWidth={1.6} style={{ color: '#6B9E7F', marginBottom: '12px' }} />
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#3D4A52', marginBottom: '4px' }}>{item.label}</div>
                <div style={{ fontSize: '12px', color: '#A89968' }}>{item.desc}</div>
              </button>
            );
          })}
        </section>
      </div>
    </AppLayout>
  );
}
