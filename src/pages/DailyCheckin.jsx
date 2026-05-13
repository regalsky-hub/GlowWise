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
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '10px',
        marginBottom: '16px',
      }}
    >
      {[1,2,3,4,5,6,7,8,9,10].map(i => {
        const active = value === i;

        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i)}
            style={{
              height: '52px',
              borderRadius: '18px',
              border: active
                ? '1px solid rgba(107,158,127,0.22)'
                : '1px solid rgba(168,153,104,0.10)',
              cursor: 'pointer',
              fontFamily: "'Manrope', sans-serif",
              fontSize: '15px',
              fontWeight: active ? 700 : 600,
              transition: 'all 0.22s ease',
              background: active
                ? 'linear-gradient(135deg, rgba(107,158,127,0.16) 0%, rgba(237,226,236,0.40) 100%)'
                : 'rgba(255,255,255,0.72)',
              color: active ? '#557E64' : '#6D7680',
              boxShadow: active
                ? '0 10px 24px -14px rgba(107,158,127,0.28)'
                : 'none',
              backdropFilter: 'blur(10px)',
            }}
          >
            {i}
          </button>
        );
      })}
    </div>

    <div
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '2px',
    padding: '0 4px',
  }}
>
  <span
    style={{
      fontSize: '11px',
      color: '#A89968',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      fontWeight: 600,
    }}
  >
    {leftLabel}
  </span>

  <span
    style={{
      fontSize: '11px',
      color: '#A89968',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      fontWeight: 600,
    }}
  >
    {rightLabel}
  </span>
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
        <div
  className="fade-up"
  style={{
    position: 'relative',
    overflow: 'hidden',
    padding: '52px 42px',
    borderRadius: '32px',
    background:
      'linear-gradient(135deg, rgba(107,158,127,0.12) 0%, rgba(237,226,236,0.50) 100%)',
    border: '1px solid rgba(107,158,127,0.08)',
    marginBottom: '42px',
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
      top: '-120px',
      right: '-60px',
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
      Daily check-in
    </div>

    <h1
      className="display"
      style={{
        fontSize: 'clamp(36px, 5vw, 52px)',
        lineHeight: 1.05,
        color: '#3D4A52',
        marginBottom: '18px',
        maxWidth: '700px',
      }}
    >
      Your daily wellness{' '}
      <em style={{ fontStyle: 'italic', color: '#6B9E7F' }}>
        ritual
      </em>
      {' '}starts here.
    </h1>

    <p
      style={{
        fontSize: '16px',
        lineHeight: 1.8,
        color: '#5A6770',
        maxWidth: '620px',
      }}
    >
      A few gentle reflections to help GlowWise understand how your
      body, mind, and energy are responding today.
    </p>
  </div>
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
<div
  className="fade-up"
  style={{
    position: 'relative',
    overflow: 'hidden',
    background:
      'linear-gradient(135deg, rgba(250,243,220,0.72) 0%, rgba(255,255,255,0.92) 100%)',
    border: '1px solid rgba(168,153,104,0.10)',
    borderRadius: '28px',
    padding: '30px',
  }}
>
  <div
    style={{
      position: 'absolute',
      width: '180px',
      height: '180px',
      borderRadius: '50%',
      background: 'rgba(212,165,92,0.10)',
      filter: 'blur(55px)',
      top: '-60px',
      right: '-40px',
    }}
  />

  <div style={{ position: 'relative', zIndex: 2 }}>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '14px',
      }}
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'rgba(212,165,92,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Zap size={16} strokeWidth={1.8} style={{ color: '#A07E3D' }} />
      </div>

      <div
        className="eyebrow"
        style={{
          color: '#A07E3D',
        }}
      >
        Energy
      </div>
    </div>

    <h2
      className="display"
      style={{
        fontSize: '28px',
        color: '#3D4A52',
        marginBottom: '10px',
        lineHeight: 1.2,
      }}
    >
      How supported does your energy feel today?
    </h2>

    <p
      style={{
        fontSize: '14px',
        lineHeight: 1.7,
        color: '#5A6770',
        marginBottom: '26px',
        maxWidth: '520px',
      }}
    >
      Energy is often influenced by sleep, stress, nourishment, and recovery.
    </p>

    <Scale
      value={energy}
      onChange={setEnergy}
      leftLabel="Drained"
      rightLabel="Energised"
    />
  </div>
</div>

          {/* Sleep */}
<div
  className="fade-up"
  style={{
    position: 'relative',
    overflow: 'hidden',
    background:
      'linear-gradient(135deg, rgba(237,226,236,0.72) 0%, rgba(255,255,255,0.94) 100%)',
    border: '1px solid rgba(168,153,104,0.10)',
    borderRadius: '28px',
    padding: '30px',
  }}
>
  <div
    style={{
      position: 'absolute',
      width: '180px',
      height: '180px',
      borderRadius: '50%',
      background: 'rgba(122,92,119,0.10)',
      filter: 'blur(55px)',
      top: '-60px',
      right: '-40px',
    }}
  />

  <div style={{ position: 'relative', zIndex: 2 }}>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '14px',
      }}
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'rgba(122,92,119,0.10)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Moon size={16} strokeWidth={1.8} style={{ color: '#7A5C77' }} />
      </div>

      <div
        className="eyebrow"
        style={{
          color: '#7A5C77',
        }}
      >
        Sleep
      </div>
    </div>

    <h2
      className="display"
      style={{
        fontSize: '28px',
        color: '#3D4A52',
        marginBottom: '10px',
        lineHeight: 1.2,
      }}
    >
      How much sleep did your body get last night?
    </h2>

    <p
      style={{
        fontSize: '14px',
        lineHeight: 1.7,
        color: '#5A6770',
        marginBottom: '28px',
        maxWidth: '520px',
      }}
    >
      Sleep quality often shapes energy, recovery, mood, and stress resilience.
    </p>

    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '22px',
      }}
    >
      <input
        type="range"
        min="3"
        max="12"
        value={sleepHours}
        onChange={(e) => setSleepHours(Number(e.target.value))}
        className="slider"
      />

      <div
        className="display"
        style={{
          fontSize: '34px',
          color: '#7A5C77',
          minWidth: '72px',
          textAlign: 'right',
        }}
      >
        {sleepHours}h
      </div>
    </div>

    <p
      style={{
        fontSize: '12px',
        color: '#A89968',
        marginTop: '16px',
        letterSpacing: '0.04em',
      }}
    >
      Most adults feel best with around 7–9 hours of sleep.
    </p>
  </div>
</div>

          {/* Stress */}
<div
  className="fade-up"
  style={{
    position: 'relative',
    overflow: 'hidden',
    background:
      'linear-gradient(135deg, rgba(237,244,239,0.72) 0%, rgba(255,255,255,0.94) 100%)',
    border: '1px solid rgba(168,153,104,0.10)',
    borderRadius: '28px',
    padding: '30px',
  }}
>
  <div
    style={{
      position: 'absolute',
      width: '180px',
      height: '180px',
      borderRadius: '50%',
      background: 'rgba(107,158,127,0.10)',
      filter: 'blur(55px)',
      top: '-60px',
      right: '-40px',
    }}
  />

  <div style={{ position: 'relative', zIndex: 2 }}>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '14px',
      }}
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'rgba(107,158,127,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Activity size={16} strokeWidth={1.8} style={{ color: '#557E64' }} />
      </div>

      <div
        className="eyebrow"
        style={{
          color: '#557E64',
        }}
      >
        Stress
      </div>
    </div>

    <h2
      className="display"
      style={{
        fontSize: '28px',
        color: '#3D4A52',
        marginBottom: '10px',
        lineHeight: 1.2,
      }}
    >
      How overwhelmed does your nervous system feel today?
    </h2>

    <p
      style={{
        fontSize: '14px',
        lineHeight: 1.7,
        color: '#5A6770',
        marginBottom: '26px',
        maxWidth: '540px',
      }}
    >
      Stress affects recovery, focus, digestion, sleep, and emotional balance.
    </p>

    <Scale
      value={stressLevel}
      onChange={setStressLevel}
      leftLabel="Calm"
      rightLabel="Overwhelmed"
    />
  </div>
</div>

          {/* Mood */}
<div
  className="fade-up"
  style={{
    position: 'relative',
    overflow: 'hidden',
    background:
      'linear-gradient(135deg, rgba(245,221,208,0.72) 0%, rgba(255,255,255,0.94) 100%)',
    border: '1px solid rgba(168,153,104,0.10)',
    borderRadius: '28px',
    padding: '30px',
  }}
>
  <div
    style={{
      position: 'absolute',
      width: '180px',
      height: '180px',
      borderRadius: '50%',
      background: 'rgba(201,123,92,0.10)',
      filter: 'blur(55px)',
      top: '-60px',
      right: '-40px',
    }}
  />

  <div style={{ position: 'relative', zIndex: 2 }}>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '14px',
      }}
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'rgba(201,123,92,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Heart size={16} strokeWidth={1.8} style={{ color: '#A85A3D' }} />
      </div>

      <div
        className="eyebrow"
        style={{
          color: '#A85A3D',
        }}
      >
        Mood
      </div>
    </div>

    <h2
      className="display"
      style={{
        fontSize: '28px',
        color: '#3D4A52',
        marginBottom: '10px',
        lineHeight: 1.2,
      }}
    >
      Emotionally, how does today feel so far?
    </h2>

    <p
      style={{
        fontSize: '14px',
        lineHeight: 1.7,
        color: '#5A6770',
        marginBottom: '26px',
        maxWidth: '540px',
      }}
    >
      Mood can reflect recovery, hormones, stress, sleep quality, and emotional wellbeing.
    </p>

    <Scale
      value={mood}
      onChange={setMood}
      leftLabel="Low"
      rightLabel="Bright"
    />
  </div>
</div>

          {/* Reflection */}
<div
  className="fade-up"
  style={{
    position: 'relative',
    overflow: 'hidden',
    background:
      'linear-gradient(135deg, rgba(250,248,245,0.95) 0%, rgba(237,226,236,0.34) 100%)',
    border: '1px solid rgba(168,153,104,0.10)',
    borderRadius: '28px',
    padding: '30px',
  }}
>
  <div
    style={{
      position: 'absolute',
      width: '200px',
      height: '200px',
      borderRadius: '50%',
      background: 'rgba(168,153,104,0.06)',
      filter: 'blur(60px)',
      top: '-70px',
      right: '-30px',
    }}
  />

  <div style={{ position: 'relative', zIndex: 2 }}>
    <div
      className="eyebrow"
      style={{
        marginBottom: '14px',
        color: '#A89968',
      }}
    >
      Reflection
    </div>

    <h2
      className="display"
      style={{
        fontSize: '28px',
        color: '#3D4A52',
        marginBottom: '10px',
        lineHeight: 1.2,
      }}
    >
      Anything your body is trying to tell you today?
    </h2>

    <p
      style={{
        fontSize: '14px',
        lineHeight: 1.7,
        color: '#5A6770',
        marginBottom: '24px',
        maxWidth: '560px',
      }}
    >
      Small observations often reveal the most meaningful wellness patterns over time.
    </p>

    <textarea
      value={symptoms}
      onChange={(e) => setSymptoms(e.target.value)}
      placeholder="e.g. headache, bloating, low motivation, cravings, brain fog..."
      className="checkin-input"
      style={{
        minHeight: '130px',
        borderRadius: '20px',
        background: 'rgba(255,255,255,0.72)',
        border: '1px solid rgba(168,153,104,0.12)',
        padding: '18px 18px',
        lineHeight: 1.7,
      }}
    />
  </div>
</div>

          {/* Supplements */}
<label
  className="fade-up"
  style={{
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '20px',
    cursor: 'pointer',
    padding: '28px 30px',
    background:
      supplementTaken
        ? 'linear-gradient(135deg, rgba(107,158,127,0.14) 0%, rgba(237,244,239,0.72) 100%)'
        : 'linear-gradient(135deg, rgba(250,248,245,0.96) 0%, rgba(237,226,236,0.20) 100%)',
    border: supplementTaken
      ? '1px solid rgba(107,158,127,0.18)'
      : '1px solid rgba(168,153,104,0.10)',
    borderRadius: '28px',
    transition: 'all 0.25s ease',
  }}
>
  <div
    style={{
      position: 'absolute',
      width: '180px',
      height: '180px',
      borderRadius: '50%',
      background: 'rgba(107,158,127,0.08)',
      filter: 'blur(60px)',
      top: '-70px',
      right: '-30px',
    }}
  />

  <div style={{ position: 'relative', zIndex: 2 }}>
    <div
      className="eyebrow"
      style={{
        marginBottom: '12px',
        color: supplementTaken ? '#557E64' : '#A89968',
      }}
    >
      Wellness support
    </div>

    <h2
      className="display"
      style={{
        fontSize: '26px',
        color: '#3D4A52',
        marginBottom: '8px',
        lineHeight: 1.2,
      }}
    >
      Did anything support your wellbeing today?
    </h2>

    <p
      style={{
        fontSize: '14px',
        lineHeight: 1.7,
        color: '#5A6770',
        maxWidth: '520px',
      }}
    >
      GlowWise uses lifestyle patterns and wellness habits to better understand what may be influencing how you feel over time.
    </p>
  </div>

  <div
    style={{
      position: 'relative',
      zIndex: 2,
      flexShrink: 0,
    }}
  >
    <div
      style={{
        width: '68px',
        height: '38px',
        borderRadius: '999px',
        background: supplementTaken
          ? '#6B9E7F'
          : 'rgba(168,153,104,0.18)',
        padding: '4px',
        transition: 'all 0.25s ease',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          background: '#FAF8F5',
          transform: supplementTaken
            ? 'translateX(30px)'
            : 'translateX(0px)',
          transition: 'all 0.25s ease',
          boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
        }}
      />
    </div>

    <input
      type="checkbox"
      checked={supplementTaken}
      onChange={(e) => setSupplementTaken(e.target.checked)}
      style={{
        position: 'absolute',
        opacity: 0,
        pointerEvents: 'none',
      }}
    />
  </div>
  <div
  style={{
    position: 'relative',
    zIndex: 2,
    width: '100%',
    marginTop: '24px',
  }}
>
  <div
    className="eyebrow"
    style={{
      marginBottom: '10px',
      color: '#A89968',
    }}
  >
    Optional
  </div>

  <input
    type="text"
    placeholder="e.g. magnesium, collagen, green tea, electrolytes..."
    style={{
      width: '100%',
      background: 'rgba(255,255,255,0.78)',
      border: '1px solid rgba(168,153,104,0.12)',
      borderRadius: '18px',
      padding: '16px 18px',
      fontSize: '14px',
      color: '#3D4A52',
      outline: 'none',
      fontFamily: "'Manrope', sans-serif",
      boxSizing: 'border-box',
    }}
  />
</div>
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
