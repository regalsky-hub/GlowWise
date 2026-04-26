import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../context/UserDataContext';
import AppLayout from './AppLayout';
import { Check, Zap, Moon, Activity, Heart, Sparkles } from 'lucide-react';

export default function DailyCheckin() {
  const [energy, setEnergy] = useState(7);
  const [sleepHours, setSleepHours] = useState(7);
  const [stressLevel, setStressLevel] = useState(5);
  const [mood, setMood] = useState(7);
  const [symptoms, setSymptoms] = useState('');
  const [supplementTaken, setSupplementTaken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { addCheckIn, getTodayCheckIn } = useUserData();
  const navigate = useNavigate();

  useEffect(() => {
    const today = getTodayCheckIn();
    if (today) {
      setEnergy(today.energy || 7);
      setSleepHours(today.sleep_hours || 7);
      setStressLevel(today.stress_level || 5);
      setMood(today.mood || 7);
      setSymptoms(today.symptoms?.join(', ') || '');
      setSupplementTaken(today.supplement_taken || false);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await addCheckIn({
        energy, sleep_hours: sleepHours, stress_level: stressLevel, mood,
        symptoms: symptoms ? symptoms.split(',').map(s => s.trim()) : [],
        supplement_taken: supplementTaken,
      });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError('Could not save: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const Scale = ({ value, onChange, leftLabel, rightLabel }) => (
    <div>
      <div style={{ display: 'flex', gap: '6px', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap' }}>
        {[1,2,3,4,5,6,7,8,9,10].map(i => (
          <button key={i} type="button" onClick={() => onChange(i)} style={{
            width: '38px', height: '38px', borderRadius: '50%',
            border: 'none', cursor: 'pointer', fontFamily: "'Manrope', sans-serif",
            fontSize: '14px', fontWeight: 600, transition: 'all 0.2s',
            background: value === i ? '#6B9E7F' : '#EDF4EF',
            color: value === i ? '#FAF8F5' : '#557E64',
            boxShadow: value === i ? '0 4px 12px rgba(107, 158, 127, 0.3)' : 'none',
          }}>{i}</button>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#A89968', letterSpacing: '0.05em' }}>
        <span>{leftLabel}</span><span>{rightLabel}</span>
      </div>
    </div>
  );

  return (
    <AppLayout>
      <style>{`
        .display { font-family: 'Fraunces', Georgia, serif; font-weight: 400; letter-spacing: -0.02em; }
        .eyebrow { font-family: 'Manrope', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: #A89968; }
        .fade-up { animation: fu 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
        @keyframes fu { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .checkin-input { width: 100%; background: #FAF8F5; border: 1px solid rgba(168, 153, 104, 0.25); border-radius: 8px; padding: 14px 16px; font-family: 'Manrope', sans-serif; font-size: 15px; color: #3D4A52; outline: none; resize: vertical; min-height: 90px; }
        .checkin-input:focus { border-color: #6B9E7F; box-shadow: 0 0 0 3px rgba(107, 158, 127, 0.1); }
        .slider { -webkit-appearance: none; width: 100%; height: 4px; background: rgba(168, 153, 104, 0.2); border-radius: 100px; outline: none; cursor: pointer; }
        .slider::-webkit-slider-thumb { -webkit-appearance: none; width: 24px; height: 24px; background: #6B9E7F; border-radius: 50%; cursor: pointer; border: 4px solid #FAF8F5; box-shadow: 0 2px 8px rgba(107, 158, 127, 0.3); }
        .btn-primary { width: 100%; background: #6B9E7F; color: #FAF8F5; padding: 16px; border: none; border-radius: 100px; font-family: 'Manrope', sans-serif; font-size: 15px; font-weight: 500; cursor: pointer; transition: all 0.3s; display: inline-flex; align-items: center; justify-content: center; gap: 8px; }
        .btn-primary:hover:not(:disabled) { background: #557E64; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(107, 158, 127, 0.25); }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .field-icon { color: #6B9E7F; flex-shrink: 0; }
      `}</style>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 24px' }}>
        <div className="fade-up" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div className="eyebrow" style={{ marginBottom: '12px' }}>Daily check-in</div>
          <h1 className="display" style={{ fontSize: 'clamp(32px, 5vw, 44px)', lineHeight: 1.1, color: '#3D4A52', marginBottom: '12px' }}>
            How are you <em style={{ fontStyle: 'italic', color: '#6B9E7F' }}>feeling today?</em>
          </h1>
          <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#5A6770' }}>
            60 seconds. Honest answers build the most accurate insights.
          </p>
        </div>

        {success && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(61, 74, 82, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)' }}>
            <div className="fade-up" style={{ background: '#FAF8F5', borderRadius: '16px', padding: '40px', textAlign: 'center', maxWidth: '360px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#6B9E7F', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Check size={32} strokeWidth={2.5} style={{ color: '#FAF8F5' }} />
              </div>
              <h2 className="display" style={{ fontSize: '24px', color: '#3D4A52', marginBottom: '8px' }}>Logged.</h2>
              <p style={{ fontSize: '14px', color: '#5A6770' }}>You're building real awareness. See you tomorrow.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
          {error && (
            <div style={{ background: 'rgba(204, 68, 68, 0.08)', borderLeft: '3px solid #CC4444', borderRadius: '4px', padding: '12px 16px', fontSize: '13px', color: '#CC4444' }}>{error}</div>
          )}

          {/* Energy */}
          <div className="fade-up">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Zap size={18} strokeWidth={1.6} className="field-icon" />
              <label className="display" style={{ fontSize: '20px', color: '#3D4A52', fontWeight: 500 }}>How's your energy?</label>
            </div>
            <Scale value={energy} onChange={setEnergy} leftLabel="Drained" rightLabel="Energised" />
          </div>

          {/* Sleep */}
          <div className="fade-up">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Moon size={18} strokeWidth={1.6} className="field-icon" />
              <label className="display" style={{ fontSize: '20px', color: '#3D4A52', fontWeight: 500 }}>Hours of sleep last night</label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <input type="range" min="3" max="12" value={sleepHours} onChange={(e) => setSleepHours(Number(e.target.value))} className="slider" />
              <span className="display" style={{ fontSize: '28px', color: '#6B9E7F', minWidth: '60px', textAlign: 'right' }}>{sleepHours}h</span>
            </div>
            <p style={{ fontSize: '12px', color: '#A89968', marginTop: '10px' }}>Most adults feel best with 7–9 hours.</p>
          </div>

          {/* Stress */}
          <div className="fade-up">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Activity size={18} strokeWidth={1.6} className="field-icon" />
              <label className="display" style={{ fontSize: '20px', color: '#3D4A52', fontWeight: 500 }}>Stress level</label>
            </div>
            <Scale value={stressLevel} onChange={setStressLevel} leftLabel="Calm" rightLabel="Overwhelmed" />
          </div>

          {/* Mood */}
          <div className="fade-up">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Heart size={18} strokeWidth={1.6} className="field-icon" />
              <label className="display" style={{ fontSize: '20px', color: '#3D4A52', fontWeight: 500 }}>Overall mood</label>
            </div>
            <Scale value={mood} onChange={setMood} leftLabel="Low" rightLabel="Great" />
          </div>

          {/* Symptoms */}
          <div className="fade-up">
            <label className="eyebrow" style={{ display: 'block', marginBottom: '10px' }}>Anything you're noticing? (optional)</label>
            <textarea value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder="e.g. headache, bloating, fatigue, breakouts..." className="checkin-input" />
          </div>

          {/* Supplements */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '16px 18px', background: '#FAF8F5', border: '1px solid rgba(168, 153, 104, 0.25)', borderRadius: '8px' }}>
            <input type="checkbox" checked={supplementTaken} onChange={(e) => setSupplementTaken(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#6B9E7F', cursor: 'pointer' }} />
            <span style={{ fontSize: '15px', color: '#3D4A52', fontWeight: 500 }}>Took supplements today</span>
          </label>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Saving...' : (<>Save check-in <Check size={16} strokeWidth={2} /></>)}
          </button>

          <p style={{ textAlign: 'center', fontSize: '12px', color: '#A89968' }}>Takes about 60 seconds · Your data is private and encrypted</p>
        </form>
      </div>
    </AppLayout>
  );
}
