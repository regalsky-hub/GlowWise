import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../context/UserDataContext';
import AppLayout from '../AppLayout';
import { ChevronRight, MessageCircle, Calendar, BarChart3, Settings, Heart, Moon, Activity, Z
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
? checkIns.slice(-7).map(c => ((c.energy || 5) + (10 - (c.stress_level || 5)) + (c.mood |
: [];
return (
<AppLayout>
<style>{`
.display { font-family: 'Fraunces', Georgia, serif; font-weight: 400; letter-spacing:
.eyebrow { font-family: 'Manrope', sans-serif; font-size: 11px; font-weight: 600; let
.fade-up { animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1
.delay-1 { animation-delay: 0.08s; } .delay-2 { animation-delay: 0.16s; } .delay-3 {
.card { background: #FAF8F5; border: 1px solid rgba(168, 153, 104, 0.15); border-radi
.card-hover { cursor: pointer; }
.card-hover:hover { border-color: #6B9E7F; transform: translateY(-2px); box-shadow: 0
.btn-primary { background: #6B9E7F; color: #FAF8F5; padding: 12px 24px; border: none;
.btn-primary:hover { background: #557E64; transform: translateY(-1px); box-shadow: 0
.btn-ghost { background: transparent; color: #557E64; padding: 10px 18px; border: 1px
.btn-ghost:hover { background: #6B9E7F; color: #FAF8F5; }
.priority-pill { display: inline-flex; align-items: center; gap: 8px; padding: .stat-mini { background: #FAF8F5; border: 1px solid rgba(168, 153, 104, 0.12); .insight-row { display: flex; align-items: center; gap: 14px; padding: 14px 0; .insight-row:last-child { border-bottom: none; }
.check-circle { width: 22px; height: 22px; border-radius: 50%; background: #EDF4EF; b
@media (max-width: 768px) { .container-inner { padding: 32px 18px !important; } }
`}</style>
10px 1
border
border
<div className="container-inner" style={{ maxWidth: '1080px', margin: '0 auto', padding
{/* Greeting */}
<section className="fade-up" style={{ marginBottom: '40px' }}>
<div className="eyebrow" style={{ marginBottom: '12px' }}>{getGreeting()}</div>
<h1 className="display" style={{ fontSize: 'clamp(36px, 5vw, 52px)', lineHeight: 1.
Hello, <em style={{ fontStyle: 'italic', color: '#6B9E7F' }}>{userName}.</em>
</h1>
<p style={{ fontSize: '17px', lineHeight: 1.6, color: '#5A6770', maxWidth: '560px'
{hasCheckedIn ? `You've checked in ${streak} ${streak === 1 ? 'day' : 'days'} so
</p>
</section>
{/* AI Coach Welcome */}
<section className="fade-up delay-1 card" style={{ marginBottom: '32px', padding: '28
<div style={{ position: 'absolute', top: '-40px', right: '-40px', fontFamily: "'Fra
<div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', position: 're
<div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#F
<div style={{ flex: 1 }}>
<div style={{ fontFamily: "'Manrope', sans-serif", fontSize: '11px', fontWeight
<p className="display" style={{ fontSize: '20px', lineHeight: 1.45, color: '#FA
{hasCheckedIn ? `"Welcome back, ${userName}. Let's see what today's check-in
</p>
<div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
<button onClick={() => navigate('/ai-coach')} style={{ background: '#FAF8F5',
<MessageCircle size={14} strokeWidth={2} />Open chat
</button>
<button onClick={() => navigate('/ai-coach')} style={{ background: 'transpare
</div>
</div>
</div>
</section>
{/* Snapshot or Check-in CTA */}
{hasCheckedIn ? (
<section className="fade-up delay-2" style={{ marginBottom: '32px' }}>
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'base
<div>
<div className="eyebrow" style={{ marginBottom: '6px' }}>Today</div>
<h2 className="display" style={{ fontSize: '24px', color: '#3D4A52' }}>Your s
</div>
<button onClick={() => navigate('/checkin')} className="btn-ghost">Update <Chev
</div>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140p
{[
{ icon: Zap, label: 'Energy', value: todayCheckIn.energy, suffix: '/10' },
{ icon: Moon, label: 'Sleep', value: todayCheckIn.sleep_hours, suffix: 'h' },
{ icon: Activity, label: 'Stress', value: todayCheckIn.stress_level, suffix:
{ icon: Heart, label: 'Mood', value: todayCheckIn.mood || 7, suffix: '/10' },
].map((s, i) => {
const Icon = s.icon;
return (
<div key={i} className="stat-mini">
<Icon size={20} strokeWidth={1.6} style={{ color: '#6B9E7F', marginBottom
<div className="display" style={{ fontSize: '28px', fontWeight: 500, colo
{s.value}<span style={{ fontSize: '14px', color: '#A89968' }}>{s.suffix
</div>
<div style={{ fontSize: '12px', color: '#5A6770', fontWeight: 500 }}>{s.l
</div>
);
})}
</div>
</section>
) : (
<section className="fade-up delay-2 card" style={{ marginBottom: '32px', padding: '
<div style={{ flex: 1, minWidth: '240px' }}>
<div className="eyebrow" style={{ marginBottom: '8px' }}>Daily check-in</div>
<h3 className="display" style={{ fontSize: '22px', color: '#3D4A52', marginBott
<p style={{ fontSize: '14px', lineHeight: 1.6, color: '#5A6770' }}>60 seconds.
</div>
<button onClick={() => navigate('/checkin')} className="btn-primary">Check </section>
in <Ch
)}
{/* Glow Score + Glow Type */}
<section className="fade-up delay-3" style={{ display: 'grid', gridTemplateColumns: '
{/* Glow Score - Terracotta */}
<div className="card" style={{ padding: '28px 32px', background: '#F5DDD0', border:
<div className="eyebrow" style={{ marginBottom: '20px', color: '#A85A3D' }}>Glow
<div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom:
<div className="display" style={{ fontSize: '64px', lineHeight: 1, color: '#A85
{hasCheckedIn ? glowScore : '—'}
</div>
<div>
<div style={{ fontSize: '13px', fontWeight: 600, color: '#8B4A30', marginBott
{hasCheckedIn ? getScoreLabel(glowScore) : 'No score yet'}
</div>
<div style={{ fontSize: '11px', color: '#C97B5C' }}>
{hasCheckedIn ? `Based on ${streak} check-${streak === 1 ? 'in' : 'ins'}` :
</div>
</div>
</div>
{hasCheckedIn && weekData.length >= 2 && (
<svg width="100%" height="40" viewBox="0 0 240 40" style={{ marginBottom: '12px
<polyline points={weekData.map((v, i) => `${i * (240 / Math.max(weekData.leng
{weekData.map((v, i) => (<circle key={i} cx={i * (240 / Math.max(weekData.len
</svg>
)}
</div>
<p style={{ fontSize: '12px', color: '#8B4A30', lineHeight: 1.5, opacity: 0.75 }}
{/* Glow Type - Plum */}
<div className="card" style={{ padding: '28px 32px', background: '#EDE2EC', border:
<div className="eyebrow" style={{ marginBottom: '12px', color: '#7A5C77' }}>Your
<h3 className="display" style={{ fontSize: '24px', lineHeight: 1.15, color: '#3D4
{glowType || 'Balanced Wellness Glow'}
</h3>
<p style={{ fontSize: '14px', lineHeight: 1.6, color: '#7A5C77', marginBottom: '2
<button onClick={() => navigate('/ai-coach')} style={{ background: 'none', Learn about your type <ChevronRight size={12} strokeWidth={2.5} />
</button>
</div>
</section>
border
{/* Insights preview */}
{streak > 0 && (
<section className="fade-up delay-4 card" style={{ padding: '28px 32px', marginBott
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'base
<div>
<div className="eyebrow" style={{ marginBottom: '6px' }}>This week</div>
<h2 className="display" style={{ fontSize: '24px', color: '#3D4A52', fontWeig
</div>
<button onClick={() => navigate('/insights')} className="btn-ghost"><BarChart3
</div>
{streak < 3 ? (
<div className="insight-row">
<div className="check-circle"><Sparkles size={11} strokeWidth={2} /></div>
<div style={{ flex: 1 }}>
<div style={{ fontSize: '14px', fontWeight: 600, color: '#3D4A52', marginBo
<div style={{ fontSize: '13px', color: '#5A6770', lineHeight: 1.5 }}>Patter
</div>
</div>
) : (
<div className="insight-row">
<div className="check-circle"><span style={{ fontSize: '10px' }}>↑</span></di
<div style={{ flex: 1 }}>
<div style={{ fontSize: '14px', fontWeight: 600, color: '#3D4A52', marginBo
<div style={{ fontSize: '13px', color: '#5A6770', lineHeight: 1.5 }}>You're
</div>
</div>
)}
<div className="insight-row">
<div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '
<Sparkles size={11} strokeWidth={2} />
</div>
<div style={{ flex: 1 }}>
<div style={{ fontSize: '14px', fontWeight: 600, color: '#3D4A52', marginBott
<div style={{ fontSize: '13px', color: '#5A6770', lineHeight: 1.5 }}>Consiste
</div>
</div>
</section>
)}
{/* Focus areas */}
{focusAreas.length > 0 && (
<section className="fade-up delay-5 card" style={{ padding: '28px 32px', marginBott
<div style={{ marginBottom: '20px' }}>
<div className="eyebrow" style={{ marginBottom: '6px' }}>Focus areas</div>
<h2 className="display" style={{ fontSize: '24px', color: '#3D4A52', fontWeight
</div>
<div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
{focusAreas.map((area, i) => (<span key={i} className="priority-pill">{area}</s
</div>
</section>
)}
{/* Today's actions */}
{immediateActions.length > 0 && (
<section className="fade-up delay-5 card" style={{ padding: '28px 32px', marginBott
<div style={{ marginBottom: '24px' }}>
<div className="eyebrow" style={{ marginBottom: '6px' }}>Recommended</div>
<h2 className="display" style={{ fontSize: '24px', color: '#3D4A52', fontWeight
</div>
<div>
{immediateActions.map((action, i) => (
<div key={i} className="insight-row" style={{ cursor: 'pointer' }}>
<div style={{ width: '22px', height: '22px', borderRadius: '50%', border: '
<div style={{ flex: 1, fontSize: '14px', color: '#3D4A52', fontWeight: 500
<ChevronRight size={16} strokeWidth={1.8} style={{ color: '#A89968' }} />
</div>
))}
</div>
</section>
)}
{/* Quick navigation - desktop */}
<section className="fade-up delay-5 desktop-only" style={{ display: 'grid', gridTempl
{[
{ icon: Calendar, label: 'Daily check-in', desc: '60-second snapshot', path: '/ch
{ icon: MessageCircle, label: 'AI Coach', desc: 'Ask anything', path: '/ai-coach'
{ icon: BarChart3, label: 'Insights', desc: 'See your patterns', path: '/insights
{ icon: Settings, label: 'Settings', desc: 'Profile & privacy', path: '/settings'
].map((item, i) => {
const Icon = item.icon;
return (
<button key={i} onClick={() => navigate(item.path)} className="card card-hover"
<Icon size={20} strokeWidth={1.6} style={{ color: '#6B9E7F', marginBottom: '1
<div style={{ fontSize: '14px', fontWeight: 600, color: '#3D4A52', marginBott
<div style={{ fontSize: '12px', color: '#A89968' }}>{item.desc}</div>
</button>
);
})}
</section>
</div>
</AppLayout>
);
}
