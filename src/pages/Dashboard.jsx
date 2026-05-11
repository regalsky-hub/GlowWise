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
  const wellnessPlan = [
  {
    title: 'Sleep Support',
    habit: 'Consistent bedtime',
    progress: 'Gentle progress',
    bg: '#EDE2EC',
    border: 'rgba(155, 123, 150, 0.16)',
    accent: '#7A5C77',
  },
  {
    title: 'Stress Recovery',
    habit: 'Daily breathing',
    progress: 'Building consistency',
    bg: '#EDF4EF',
    border: 'rgba(107, 158, 127, 0.16)',
    accent: '#557E64',
  },
];

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
        .card {
  background: #FAF8F5;
  border: 1px solid rgba(168, 153, 104, 0.08);
  border-radius: 12px;
  transition: all 0.3s ease;
  boxShadow: '0 10px 40px -32px rgba(61, 74, 82, 0.18)',
}
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

      <div className="container-inner" style={{ maxWidth: '1080px', margin: '0 auto', padding: '56px 32px 80px' }}>

        {/* Greeting */}
        <section className="fade-up" style={{ marginBottom: '40px' }}>
          <div className="eyebrow" style={{ marginBottom: '12px' }}>{getGreeting()}</div>
          <h1 className="display" style={{ fontSize: 'clamp(36px, 5vw, 52px)', lineHeight: 1.05, color: '#3D4A52', marginBottom: '12px' }}>
            Hello, <em style={{ fontStyle: 'italic', color: '#6B9E7F' }}>{userName}.</em>
          </h1>
          <p style={{ fontSize: '17px', lineHeight: 1.6, color: '#5A6770', maxWidth: '560px' }}>
            {hasCheckedIn ? `You've checked in ${streak} ${streak === 1 ? 'time' : 'times'} this week. Here's how today's shaping up.` : `When you're ready, take a minute to check in. The more you share, the sharper your insights become.`}
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
                {(() => {
                  if (streak === 0 && !hasCheckedIn) {
                    return `"Welcome, ${userName}. I'm here whenever you need me. Ready when you are."`;
                  }
                  if (hasCheckedIn) {
                    const messages = [
                      `"Thanks for checking in, ${userName}. Your insights are taking shape — let me know if anything's on your mind."`,
                      `"Good to hear from you, ${userName}. Every check-in helps me understand you better."`,
                      `"Today's snapshot is in, ${userName}. Tap chat anytime — I'm right here."`,
                    ];
                    return messages[streak % messages.length];
                  }
                  if (streak >= 5) {
                    return `"Welcome back, ${userName}. ${streak} check-ins in — you're building something real. Ready for today's?"`;
                  }
                  return `"Welcome back, ${userName}. Ready when you are — let's see how today is feeling."`;
                })()}
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
              {(() => {
                const energy = todayCheckIn.energy;
                const sleep = todayCheckIn.sleep_hours;
                const stress = todayCheckIn.stress_level;
                const mood = todayCheckIn.mood || 7;

                const energyLabel = energy <= 3 ? 'Low' : energy <= 5 ? 'Building' : energy <= 7 ? 'Steady' : energy <= 9 ? 'Energised' : 'Vibrant';
                const sleepLabel = sleep < 5 ? 'Restless' : sleep < 6 ? 'Light' : sleep < 7 ? 'Fair' : sleep < 9 ? 'Restful' : 'Deep';
                const stressLabel = stress <= 3 ? 'Calm' : stress <= 5 ? 'Manageable' : stress <= 7 ? 'Elevated' : stress <= 9 ? 'Pressured' : 'Overwhelmed';
                const moodLabel = mood <= 3 ? 'Low' : mood <= 5 ? 'Mixed' : mood <= 7 ? 'Balanced' : mood <= 9 ? 'Bright' : 'Radiant';

                return [
                  { icon: Zap, label: 'Energy', value: energy, suffix: '/10', emotional: energyLabel, bg: '#FAF3DC', border: 'rgba(212, 165, 92, 0.2)', accent: '#A07E3D', text: '#8B6A30' },
                  { icon: Moon, label: 'Sleep', value: sleep, suffix: 'h', emotional: sleepLabel, bg: '#EDE2EC', border: 'rgba(155, 123, 150, 0.2)', accent: '#7A5C77', text: '#5D4459' },
                  { icon: Activity, label: 'Stress', value: stress, suffix: '/10', emotional: stressLabel, bg: '#F5DDD0', border: 'rgba(201, 123, 92, 0.2)', accent: '#A85A3D', text: '#8B4A30' },
                  { icon: Heart, label: 'Mood', value: mood, suffix: '/10', emotional: moodLabel, bg: '#D4E8DD', border: 'rgba(107, 158, 127, 0.2)', accent: '#557E64', text: '#3D5E48' },
                ].map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <div key={i} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: '12px', padding: '18px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                        <Icon size={14} strokeWidth={1.8} style={{ color: s.accent }} />
                        <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: s.accent }}>{s.label}</span>
                      </div>
                      <div className="display" style={{ fontSize: '28px', fontWeight: 400, color: s.text, lineHeight: 1, marginBottom: '6px' }}>
                        {s.value}<span style={{ fontSize: '13px', color: s.accent, marginLeft: '2px' }}>{s.suffix}</span>
                      </div>
                      <div className="display" style={{ fontStyle: 'italic', fontSize: '14px', color: s.accent }}>{s.emotional}</div>
                    </div>
                  );
                });
              })()}
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
{/* Today's Focus Hero */}
{hasCheckedIn && (
  <section className="fade-up delay-3" style={{ marginBottom: '40px' }}>
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '40px 36px',
        borderRadius: '32px',
        background:
          'linear-gradient(135deg, rgba(107,158,127,0.16) 0%, rgba(237,226,236,0.45) 100%)',
        border: '1px solid rgba(107,158,127,0.12)',
        boxShadow: '0 20px 60px -30px rgba(61,74,82,0.18)',
      }}
    >

      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          background: 'rgba(107,158,127,0.10)',
          filter: 'blur(60px)',
          top: '-120px',
          right: '-80px',
        }}
      />

      <div style={{ position: 'relative', zIndex: 2 }}>
        <div
          className="eyebrow"
          style={{
            marginBottom: '14px',
            color: '#557E64',
          }}
        >
          Today’s Focus
        </div>

        <h2
          className="display"
          style={{
            fontSize: 'clamp(30px, 4vw, 42px)',
            lineHeight: 1.08,
            color: '#3D4A52',
            marginBottom: '18px',
            maxWidth: '700px',
            fontWeight: 400,
          }}
        >
          {(() => {
            const energy = todayCheckIn.energy || 5;
            const sleep = todayCheckIn.sleep_hours || 7;
            const stress = todayCheckIn.stress_level || 5;

            if (stress >= 7)
              return 'Slow down your nervous system today.';

            if (sleep < 6)
              return 'Your body may need deeper recovery today.';

            if (energy <= 4)
              return 'Gentle support and softer pacing may help today.';

            if (stress <= 3 && energy >= 7)
              return 'You seem more balanced today, protect that feeling.';

            return 'Small supportive steps matter more than perfection.';
          })()}
        </h2>

        <p
          style={{
            fontSize: '17px',
            lineHeight: 1.7,
            color: '#5A6770',
            maxWidth: '620px',
            marginBottom: '28px',
          }}
        >
          {(() => {
            const stress = todayCheckIn.stress_level || 5;
            const sleep = todayCheckIn.sleep_hours || 7;

            if (stress >= 7)
              return 'A calmer pace, deeper breathing, and less overstimulation may help you feel more grounded.';

            if (sleep < 6)
              return 'Hydration, slower movement, and earlier rest tonight could support recovery.';

            return 'GlowWise is here to support your wellbeing gently and consistently, one day at a time.';
          })()}
        </p>

        <button className="btn-primary">
          Open wellness support
        </button>
      </div>
    </div>
  </section>
)}

        {/* Glow Score + Glow Type */}
        <section className="fade-up delay-3" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '20px', marginBottom: '32px' }}>
          {/* Glow Score - Terracotta */}
<div
  className="card"
  style={{
    padding: '28px 32px',
    background: '#F5DDD0',
    border: '1px solid rgba(201, 123, 92, 0.25)',
    borderRadius: '28px',
    boxShadow: '0 18px 50px -28px rgba(168,90,61,0.25)',
  }}
>
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
<div
  className="card"
  style={{
    padding: '28px 32px',
    background: '#EDE2EC',
    border: '1px solid rgba(155, 123, 150, 0.3)',
    borderRadius: '28px',
    boxShadow: '0 18px 50px -28px rgba(122,92,119,0.22)',
  }}
>
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
{/* Wellness Plan */}
<section className="fade-up delay-4 card" style={{ padding: '28px 32px', marginBottom: '32px' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '24px' }}>
    <div>
      <div className="eyebrow" style={{ marginBottom: '6px' }}>Your plan</div>
      <h2 className="display" style={{ fontSize: '24px', color: '#3D4A52', fontWeight: 500 }}>
        Your wellness plan
      </h2>
    </div>

    <button className="btn-ghost">
      Edit
    </button>
  </div>

  <div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '16px'
}}>
    {wellnessPlan.map((item, i) => (
      <div
        key={i}
        style={{
          background: item.bg,
          border: `1px solid ${item.border}`,
          borderRadius: '24px',
          boxShadow: '0 18px 50px -28px rgba(122,92,119,0.22)',
          padding: '20px',
        }}
      >
        <div style={{
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: item.accent,
          marginBottom: '10px'
        }}>
          {item.title}
        </div>

        <div
          className="display"
          style={{
            fontSize: '20px',
            color: '#3D4A52',
            marginBottom: '18px',
            lineHeight: 1.3,
          }}
        >
          {item.habit}
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{
            fontSize: '12px',
            color: item.accent,
            fontWeight: 600,
          }}>
            {item.progress}
          </div>
        </div>
      </div>
    ))}
  </div>
</section>
      
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
{/* Coming Soon */}
<section
  className="fade-up delay-5 card"
  style={{
    padding: '28px 32px',
    marginBottom: '32px',
    background: 'linear-gradient(135deg, #FAF8F5 0%, #F3EFE8 100%)',
  }}
>
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap',
  }}>
    <div style={{ flex: 1, minWidth: '240px' }}>
      <div className="eyebrow" style={{ marginBottom: '8px' }}>
        Coming soon
      </div>

      <h2
        className="display"
        style={{
          fontSize: '24px',
          color: '#3D4A52',
          marginBottom: '10px',
          fontWeight: 500,
        }}
      >
        Visual wellness tracking
      </h2>

      <p style={{
        fontSize: '14px',
        lineHeight: 1.6,
        color: '#5A6770',
        maxWidth: '520px',
      }}>
        Privately track gradual changes in skin, hair, posture, and overall glow with secure progress photos.
      </p>
    </div>

    <button className="btn-primary">
      Notify me
    </button>
  </div>
</section>
        {/* Quick navigation - desktop */}
        <section className="fade-up delay-5 desktop-only" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          {[
            { icon: Calendar, label: 'Daily check-in', desc: '60-second snapshot', path: '/checkin' },
            { icon: MessageCircle, label: 'AI Coach', desc: 'Ask anything', path: '/ai-coach' },
            { icon: BarChart3, label: 'Insights', desc: 'See your patterns', path: '/insights' },
            { icon: Settings, label: 'Profile', desc: 'Settings & privacy', path: '/settings' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <button key={i} onClick={() => navigate(item.path)} className="card card-hover" style={{ padding: '20px', textAlign: 'left', cursor: 'pointer' }}>
                <Icon size={20} strokeWidth={1.6} style={{ color: '#6B9E7F', marginBottom: '12px' }} />
                <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: '20px', fontWeight: 500, color: '#3D4A52', marginBottom: '4px', letterSpacing: '-0.01em' }}>{item.label}</div>
                <div style={{ fontSize: '12px', color: '#A89968' }}>{item.desc}</div>
              </button>
            );
          })}
        </section>
      </div>
    </AppLayout>
  );
}
