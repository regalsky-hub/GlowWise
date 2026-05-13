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
  const getWellnessFeedback = () => {
  if (stressLevel >= 8 && sleepHours <= 5) {
    return {
      title: 'Your nervous system may need gentler support today.',
      desc: 'Low sleep combined with high stress can increase fatigue, emotional sensitivity, and brain fog. Prioritise slower pacing and recovery where possible.',
    };
  }

  if (energy >= 8 && mood >= 8) {
    return {
      title: 'Your body seems more supported today.',
      desc: 'Higher energy and emotional steadiness often reflect improving recovery, rhythm, and resilience.',
    };
  }

  if (mood <= 4) {
    return {
      title: 'Your emotional wellbeing may need extra care today.',
      desc: 'Lower mood can sometimes reflect stress load, hormones, sleep disruption, or emotional exhaustion.',
    };
  }

  return {
    title: 'Your daily patterns are beginning to form.',
    desc: 'Small daily reflections help GlowWise understand what supports your wellbeing over time.',
  };
};

const insight = getWellnessFeedback();

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

.fade-up:hover {
  transform: translateY(-2px);
  transition: transform 0.3s ease;
}

@media (max-width: 768px) {
  .checkin-input {
    font-size: 16px;
  }
}

@media (max-width: 640px) {
  form {
    padding: 28px 18px !important;
  }
}
      `}</style>
      
  <form
  onSubmit={handleSubmit}
  style={{
    maxWidth: '720px',
    margin: '0 auto',
    padding: '40px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '28px',
  }}
>
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
  <div
    style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(61,74,82,0.42)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      backdropFilter: 'blur(10px)',
      padding: '24px',
    }}
  >
    <div
      className="fade-up"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background:
          'linear-gradient(135deg, rgba(107,158,127,0.10) 0%, rgba(237,226,236,0.48) 100%)',
        border: '1px solid rgba(168,153,104,0.10)',
        borderRadius: '34px',
        padding: '54px 42px',
        width: '100%',
        maxWidth: '520px',
        textAlign: 'center',
        boxShadow: '0 40px 90px -50px rgba(61,74,82,0.35)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          background: 'rgba(107,158,127,0.10)',
          filter: 'blur(70px)',
          top: '-120px',
          right: '-40px',
        }}
      />

      <div style={{ position: 'relative', zIndex: 2 }}>
        <div
          style={{
            width: '82px',
            height: '82px',
            borderRadius: '50%',
            background:
              'linear-gradient(135deg, #6B9E7F 0%, #557E64 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 28px',
            boxShadow: '0 18px 40px -18px rgba(85,126,100,0.45)',
          }}
        >
          <Check
            size={34}
            strokeWidth={2.5}
            style={{ color: '#FAF8F5' }}
          />
        </div>

        <div
          className="eyebrow"
          style={{
            marginBottom: '14px',
            color: '#557E64',
          }}
        >
          Check-in complete
        </div>

        <h2
          className="display"
          style={{
            fontSize: '38px',
            lineHeight: 1.1,
            color: '#3D4A52',
            marginBottom: '18px',
          }}
        >
          Your wellness story is becoming{' '}
          <em style={{ fontStyle: 'italic', color: '#6B9E7F' }}>
            clearer
          </em>
          .
        </h2>

        <p
          style={{
            fontSize: '15px',
            lineHeight: 1.8,
            color: '#5A6770',
            maxWidth: '360px',
            margin: '0 auto',
          }}
        >
          Small reflections build meaningful patterns over time.
          GlowWise is learning what helps you feel your best.
        </p>
      </div>
    </div>
  </div>
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
  leftLabel="Exhausted"
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
    
{/* AI Wellness Reflection */}
<div
  className="fade-up"
  style={{
    position: 'relative',
    overflow: 'hidden',
    padding: '34px 30px',
    borderRadius: '30px',
    background:
      'linear-gradient(135deg, rgba(107,158,127,0.10) 0%, rgba(237,226,236,0.46) 100%)',
    border: '1px solid rgba(168,153,104,0.10)',
  }}
>
  <div
    style={{
      position: 'absolute',
      width: '220px',
      height: '220px',
      borderRadius: '50%',
      background: 'rgba(107,158,127,0.08)',
      filter: 'blur(70px)',
      top: '-100px',
      right: '-40px',
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
      GlowWise insight
    </div>

    <h2
      className="display"
      style={{
        fontSize: '30px',
        lineHeight: 1.2,
        color: '#3D4A52',
        marginBottom: '14px',
        maxWidth: '620px',
      }}
    >
      {insight.title}
    </h2>

    <p
      style={{
        fontSize: '15px',
        lineHeight: 1.8,
        color: '#5A6770',
        maxWidth: '620px',
      }}
    >
      {insight.desc}
    </p>
  </div>
</div>
         {/* Reflection + Wellness Support */}
<div
  className="fade-up"
  style={{
    position: 'relative',
    overflow: 'hidden',
    padding: '34px 30px',
    borderRadius: '30px',
    background:
      'linear-gradient(135deg, rgba(107,158,127,0.08) 0%, rgba(237,226,236,0.38) 100%)',
    border: '1px solid rgba(168,153,104,0.10)',
  }}
>
  <div
    style={{
      position: 'absolute',
      width: '220px',
      height: '220px',
      borderRadius: '50%',
      background: 'rgba(107,158,127,0.08)',
      filter: 'blur(70px)',
      top: '-100px',
      right: '-40px',
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
        fontSize: '34px',
        lineHeight: 1.15,
        color: '#3D4A52',
        marginBottom: '14px',
        maxWidth: '620px',
      }}
    >
      What is your body trying to{' '}
      <em style={{ fontStyle: 'italic', color: '#6B9E7F' }}>
        communicate
      </em>{' '}
      today?
    </h2>

    <p
      style={{
        fontSize: '15px',
        lineHeight: 1.8,
        color: '#5A6770',
        maxWidth: '620px',
        marginBottom: '26px',
      }}
    >
      You can mention symptoms, emotions, cravings, supplements,
      medications, or anything else influencing how you feel.
    </p>

    <textarea
      value={symptoms}
      onChange={(e) => setSymptoms(e.target.value)}
      placeholder="e.g. brain fog, anxious thoughts, magnesium glycinate, iron tablets, cravings, headaches, low motivation..."
      className="checkin-input"
      style={{
        minHeight: '140px',
        borderRadius: '22px',
        background: 'rgba(250,248,245,0.85)',
        border: '1px solid rgba(168,153,104,0.12)',
        padding: '22px',
        fontSize: '15px',
        lineHeight: 1.7,
      }}
    />
  </div>
</div>

        <button
  type="submit"
  disabled={loading}
  style={{
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    background:
      'linear-gradient(135deg, #6B9E7F 0%, #557E64 100%)',
    color: '#FAF8F5',
    padding: '18px 24px',
    border: 'none',
    borderRadius: '999px',
    fontFamily: "'Manrope', sans-serif",
    fontSize: '15px',
    fontWeight: 600,
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    boxShadow: '0 18px 40px -18px rgba(85,126,100,0.45)',
    opacity: loading ? 0.7 : 1,
  }}
>
  <div
    style={{
      position: 'absolute',
      width: '200px',
      height: '200px',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.10)',
      filter: 'blur(50px)',
      top: '-120px',
      right: '-40px',
    }}
  />

  <span style={{ position: 'relative', zIndex: 2 }}>
    {loading
      ? 'Saving your check-in...'
      : 'Complete today’s check-in'}
  </span>

  {!loading && (
    <Check
      size={17}
      strokeWidth={2.2}
      style={{
        position: 'relative',
        zIndex: 2,
      }}
    />
  )}
</button>

<p
  style={{
    textAlign: 'center',
    fontSize: '12px',
    color: '#A89968',
  }}
>
  Takes about 60 seconds · Your data is private and encrypted
</p>

</form>
</AppLayout>
  );
}
