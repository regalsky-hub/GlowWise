import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../context/UserDataContext';
import { ChevronRight, ChevronLeft, Check, AlertCircle, Camera, Sparkles, Shield, X } from 'lucide-react';

const WELLNESS_TOPICS = [
  { id: 'hormones', label: 'Hormonal Balance', icon: '◐' },
  { id: 'fertility', label: 'Fertility Wellness', icon: '✦' },
  { id: 'weight', label: 'Body & Weight', icon: '◑' },
  { id: 'energy', label: 'Energy & Fatigue', icon: '◎' },
  { id: 'sleep', label: 'Sleep & Recovery', icon: '☾' },
  { id: 'stress', label: 'Stress & Anxiety', icon: '◉' },
  { id: 'brain', label: 'Brain & Focus', icon: '◈' },
  { id: 'gut', label: 'Gut & Digestion', icon: '◍' },
  { id: 'skin', label: 'Skin & Acne', icon: '◇' },
  { id: 'hair', label: 'Hair & Scalp', icon: '✧' },
  { id: 'nutrition', label: 'Nutrition & Eating Habits', icon: '◆' },
];

const DIET_TYPES = [
  { id: 'home-cooked', label: 'Mostly home-cooked', desc: 'Varied, balanced meals at home' },
  { id: 'mixed', label: 'A mix', desc: 'Home cooking + convenience foods' },
  { id: 'takeaways', label: 'Often eat out', desc: 'Takeaways or restaurant meals' },
  { id: 'on-the-go', label: 'On-the-go', desc: 'Mostly processed or quick foods' },
  { id: 'specific', label: 'A specific approach', desc: 'Vegan, vegetarian, keto, Mediterranean, etc.' },
  { id: 'other', label: 'Other', desc: "I'll tell my coach later" },
];

const GENDER_OPTIONS = [
  { id: 'female', label: 'Female' },
  { id: 'male', label: 'Male' },
  { id: 'non-binary', label: 'Non-binary' },
  { id: 'prefer-not', label: 'Prefer not to say' },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const { updateProfile, addCheckIn } = useUserData();
  const navigate = useNavigate();

  const [data, setData] = useState({
    // Personal
    name: '',
    age: '',
    gender: '',
    // Priorities
    wellness_priorities: [],
    // Body signals
    body_signals: '',
    // Sleep & energy
    sleep_hours: 7,
    sleep_quality: 5,
    energy_level: 7,
    // Stress
    stress_level: 5,
    stress_trigger_list: [],
    stress_triggers: '',
    // Nutrition
    diet_type: 'Balanced',
    supplements: '',
    // Lifestyle
    exercise_per_week: 3,
    exercise_social: '',
    water_intake: 2,
    // Health context
    health_context: '',
    medications: '',
    // Preferences
    notification_frequency: 'daily',
    photo_uploaded: false,
  });

  useEffect(() => {
    // Inject Google Fonts once on mount
    if (!document.getElementById('glowwise-fonts')) {
      const link = document.createElement('link');
      link.id = 'glowwise-fonts';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Manrope:wght@300;400;500;600;700&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  // Reset error and scroll to top when step changes
  useEffect(() => {
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const totalSteps = 9;

  const toggleWellnessPriority = (topicId) => {
    setData(prev => {
      const has = prev.wellness_priorities.includes(topicId);
      if (has) {
        return { ...prev, wellness_priorities: prev.wellness_priorities.filter(p => p !== topicId) };
      }
      // Cap at 3 picks
      if (prev.wellness_priorities.length >= 3) return prev;
      return { ...prev, wellness_priorities: [...prev.wellness_priorities, topicId] };
    });
  };

  // ============================================================
  // Glow Type — scoring engine
  // Every type accumulates points from the onboarding profile.
  // Highest score wins. All six types are reachable.
  // Ties are broken by the TYPE_PRIORITY order below.
  // This is the STARTING type — it re-evaluates after 5+ check-ins.
  // ============================================================
  const generatePersonalisedProfile = (formData) => {
    const priorities = formData.wellness_priorities || [];
    const triggers = formData.stress_trigger_list || [];
    const stress = formData.stress_level;
    const sleep = formData.sleep_hours;
    const energy = formData.energy_level;
    const exercise = formData.exercise_per_week;
    const water = formData.water_intake;
    const social = formData.exercise_social;
    const diet = formData.diet_type;

    // Score each type
    const scores = {
      bloomer: 0,
      optimizer: 0,
      nurturer: 0,
      achiever: 0,
      explorer: 0,
      connector: 0,
    };

    // The Steady Bloomer — rhythm and consistency
    if (priorities.includes('hormones')) scores.bloomer += 3;
    if (priorities.includes('fertility')) scores.bloomer += 3;
    if (priorities.includes('hair')) scores.bloomer += 3;
    if (priorities.includes('sleep')) scores.bloomer += 2;
    if (sleep < 6) scores.bloomer += 3;

    // The Energy Optimizer — variety and novelty
    if (priorities.includes('energy')) scores.optimizer += 3;
    if (priorities.includes('brain')) scores.optimizer += 3;
    if (energy >= 7) scores.optimizer += 2;

    // The Sensitive Nurturer — sensitivity and calm
    if (priorities.includes('skin')) scores.nurturer += 3;
    if (priorities.includes('stress')) scores.nurturer += 2;
    if (stress >= 8) scores.nurturer += 3;
    if (triggers.includes('Relationships')) scores.nurturer += 2;
    if (triggers.includes('Caregiver demands')) scores.nurturer += 2;
    if (triggers.includes('Mentally overloaded')) scores.nurturer += 2;

    // The Resilient Achiever — big goals, deep reserves
    if (priorities.includes('weight')) scores.achiever += 3;
    if (exercise >= 5) scores.achiever += 3;
    if (triggers.includes('Work pressure')) scores.achiever += 2;
    if (energy <= 4) scores.achiever += 2;

    // The Intuitive Explorer — body-led, dislikes rigid plans
    if (priorities.includes('gut')) scores.explorer += 3;
    if (priorities.includes('nutrition')) scores.explorer += 3;
    if (diet === 'specific') scores.explorer += 2;

    // The Community Connector — blooms with others
    if (social === 'with-others') scores.connector += 3;
    if (triggers.includes('Working or living in isolation')) scores.connector += 3;
    if (triggers.includes('Loneliness')) scores.connector += 3;

    // Pick the winner — ties broken by this order
    const TYPE_PRIORITY = ['nurturer', 'achiever', 'connector', 'explorer', 'optimizer', 'bloomer'];
    let winner = 'bloomer';
    let best = -1;
    for (const id of TYPE_PRIORITY) {
      if (scores[id] > best) { best = scores[id]; winner = id; }
    }
    // If nothing scored at all, fall back to Steady Bloomer
    if (best === 0) winner = 'bloomer';

    const TYPE_LIBRARY = {
      bloomer: {
        name: 'The Steady Bloomer',
        description: 'Routine is your soil. Small daily rituals — consistent sleep, calm mornings, repeated habits — compound into a deep, quiet bloom. Rhythm unlocks your energy, mood and focus more than anything else.',
      },
      optimizer: {
        name: 'The Energy Optimizer',
        description: 'You thrive on variety and novelty — monotony dims you. Fresh movement, new routines and avoiding repetitive days keep your energy and mental clarity sharp.',
      },
      nurturer: {
        name: 'The Sensitive Nurturer',
        description: 'You feel deeply, and your nervous system needs protecting. Calm routines, soft transitions and quiet recovery time are your highest-leverage habits.',
      },
      achiever: {
        name: 'The Resilient Achiever',
        description: 'You have deep reserves and big goals — and a habit of overriding rest. Building recovery into your routine unlocks sustained energy without the crash.',
      },
      explorer: {
        name: 'The Intuitive Explorer',
        description: 'You thrive when wellness feels body-led rather than rule-driven. Learning to listen to your own signals around food, rest and movement is your superpower.',
      },
      connector: {
        name: 'The Community Connector',
        description: 'You bloom in the company of others — shared movement, accountability and connection energise you. Building wellness around people, not solitude, is what makes it stick.',
      },
    };

    const glowType = TYPE_LIBRARY[winner].name;
    const glowTypeDescription = TYPE_LIBRARY[winner].description;

    // Top focus areas from selected priorities
    const focusAreas = priorities.length > 0
      ? priorities.map(id => WELLNESS_TOPICS.find(t => t.id === id)?.label).filter(Boolean)
      : ['Overall wellness'];

    // Immediate wellness actions — real actions, never meta-actions
    const immediateActions = [];
    if (sleep < 7) immediateActions.push('Aim for 7+ hours of sleep tonight');
    if (stress >= 7) immediateActions.push('Take one 5-minute calm break today');
    if (water < 2) immediateActions.push('Drink a glass of water before each meal');
    if (exercise < 3) immediateActions.push('Add a 10-minute walk to your day');
    if (immediateActions.length === 0) immediateActions.push('Step outside for 10 minutes of daylight');
    if (immediateActions.length < 3) immediateActions.push('Eat a protein-rich breakfast tomorrow');

    // AI Coach context — fed to OpenAI as part of the system prompt
    const aiContext = {
      name: formData.name || 'there',
      age: formData.age,
      gender: formData.gender,
      glowType,
      focusAreas,
      currentBaseline: {
        sleep: `${formData.sleep_hours}h average`,
        stress: `${formData.stress_level}/10`,
        energy: `${formData.energy_level}/10`,
        exercise: `${formData.exercise_per_week} days/week`,
        diet: formData.diet_type,
      },
      bodySignals: formData.body_signals || 'None reported',
      stressTriggers: (formData.stress_trigger_list || []).join(', ') || 'Not specified',
      supplements: formData.supplements || 'None reported',
      healthContext: formData.health_context || 'None disclosed',
      medications: formData.medications || 'None disclosed',
    };

    return { glowType, glowTypeDescription, focusAreas, immediateActions, aiContext };
  };

  const handleNext = () => {
    setError('');

    // Validation per step
    if (step === 1) {
      if (!data.name.trim()) { setError('Please tell us your name'); return; }
      if (!data.age || isNaN(data.age) || data.age < 18 || data.age > 120) {
        setError('Please enter a valid age (18 or over)'); return;
      }
    }
    if (step === 2 && !data.gender) {
      setError('Please pick one — or "Prefer not to say"'); return;
    }
    if (step === 3 && data.wellness_priorities.length === 0) {
      setError('Pick at least one — up to 3'); return;
    }

    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    setError('');
    setStep(Math.max(0, step - 1));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Photo must be under 10MB');
        return;
      }
      setData(prev => ({ ...prev, photo_uploaded: true }));
    }
  };

  const completeOnboarding = async () => {
    setSaving(true);
    setError('');
    try {
      const profile = generatePersonalisedProfile(data);

      await updateProfile({
        ...data,
        glowType: profile.glowType,
        glowTypeDescription: profile.glowTypeDescription,
        focusAreas: profile.focusAreas,
        immediateActions: profile.immediateActions,
        aiContext: profile.aiContext,
        onboarding_completed: true,
        onboarding_completed_at: new Date(),
      });

      await addCheckIn({
  energy: data.energy_level,
  sleep_hours: data.sleep_hours,
  stress_level: data.stress_level,
  mood: 7,
  symptoms: data.body_signals ? [data.body_signals] : [],
  supplement_taken: false,
});

const selectedPlan = localStorage.getItem('selectedPlan');
localStorage.removeItem('selectedPlan');

if (selectedPlan === 'paid') {
  const res = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  const checkoutData = await res.json();
  if (checkoutData.url) {
    window.location.href = checkoutData.url;
  } else {
    navigate('/dashboard');
  }
} else {
  navigate('/dashboard');
}
    } catch (err) {
      console.error('Onboarding save error:', err);
      // Still navigate so user isn't stuck — data should mostly be saved
      navigate('/dashboard');
    } finally {
      setSaving(false);
    }
  };

  // Step titles for the progress label
  const stepLabels = [
    'Welcome', 'About you', 'Identity', 'Priorities',
    'How you feel', 'Sleep & energy', 'Stress', 'Lifestyle',
    'Almost there'
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F5F3F0',
      fontFamily: "'Manrope', system-ui, sans-serif",
      color: '#3D4A52',
      position: 'relative',
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .display { font-family: 'Fraunces', Georgia, serif; font-weight: 400; letter-spacing: -0.02em; }
        .body-text { font-family: 'Manrope', sans-serif; }

        .eyebrow {
          font-family: 'Manrope', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #A89968;
        }

        .grain::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.6'/%3E%3C/svg%3E");
          opacity: 0.04;
          pointer-events: none;
          z-index: 1;
        }

        .step-fade { animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

        .onboarding-input {
          width: 100%;
          background: #FAF8F5;
          border: 1px solid rgba(168, 153, 104, 0.25);
          border-radius: 8px;
          padding: 16px 18px;
          font-family: 'Manrope', sans-serif;
          font-size: 15px;
          color: #3D4A52;
          transition: all 0.2s;
          outline: none;
        }
        .onboarding-input:focus { border-color: #6B9E7F; box-shadow: 0 0 0 3px rgba(107, 158, 127, 0.1); }
        .onboarding-input::placeholder { color: #A89968; opacity: 0.7; }

        .onboarding-textarea {
          width: 100%;
          background: #FAF8F5;
          border: 1px solid rgba(168, 153, 104, 0.25);
          border-radius: 8px;
          padding: 16px 18px;
          font-family: 'Manrope', sans-serif;
          font-size: 15px;
          color: #3D4A52;
          transition: all 0.2s;
          outline: none;
          resize: vertical;
          min-height: 110px;
          line-height: 1.55;
        }
        .onboarding-textarea:focus { border-color: #6B9E7F; box-shadow: 0 0 0 3px rgba(107, 158, 127, 0.1); }

        .choice-card {
          width: 100%;
          background: #FAF8F5;
          border: 1px solid rgba(168, 153, 104, 0.25);
          border-radius: 8px;
          padding: 16px 18px;
          font-family: 'Manrope', sans-serif;
          font-size: 15px;
          font-weight: 500;
          color: #3D4A52;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .choice-card:hover { border-color: #6B9E7F; }
        .choice-card.selected { background: #EDF4EF; border-color: #6B9E7F; color: #557E64; }
        .choice-card.selected .choice-icon { color: #6B9E7F; }
        .choice-card.disabled { opacity: 0.4; cursor: not-allowed; }
        .choice-card.disabled:hover { border-color: rgba(168, 153, 104, 0.25); }

        .priority-chip {
          background: #FAF8F5;
          border: 1px solid rgba(168, 153, 104, 0.25);
          border-radius: 100px;
          padding: 12px 18px;
          font-family: 'Manrope', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #3D4A52;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .priority-chip:hover { border-color: #6B9E7F; }
        .priority-chip.selected { background: #6B9E7F; border-color: #6B9E7F; color: #FAF8F5; }
        .priority-chip.disabled { opacity: 0.4; cursor: not-allowed; }
        .priority-chip-icon {
          font-family: 'Fraunces', serif;
          font-size: 16px;
        }

        .slider-track {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 4px;
          background: rgba(168, 153, 104, 0.2);
          border-radius: 100px;
          outline: none;
          cursor: pointer;
        }
        .slider-track::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          background: #6B9E7F;
          border-radius: 50%;
          cursor: pointer;
          border: 4px solid #FAF8F5;
          box-shadow: 0 2px 8px rgba(107, 158, 127, 0.3);
          transition: transform 0.15s;
        }
        .slider-track::-webkit-slider-thumb:hover { transform: scale(1.1); }
        .slider-track::-moz-range-thumb {
          width: 24px;
          height: 24px;
          background: #6B9E7F;
          border-radius: 50%;
          cursor: pointer;
          border: 4px solid #FAF8F5;
          box-shadow: 0 2px 8px rgba(107, 158, 127, 0.3);
        }

        .btn-primary {
          background: #6B9E7F;
          color: #FAF8F5;
          padding: 14px 28px;
          border: none;
          border-radius: 100px;
          font-family: 'Manrope', sans-serif;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .btn-primary:hover:not(:disabled) { background: #557E64; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(107, 158, 127, 0.25); }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

        .btn-ghost {
          background: transparent;
          color: #5A6770;
          padding: 14px 24px;
          border: 1px solid rgba(168, 153, 104, 0.3);
          border-radius: 100px;
          font-family: 'Manrope', sans-serif;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .btn-ghost:hover:not(:disabled) { color: #3D4A52; border-color: #3D4A52; }
        .btn-ghost:disabled { opacity: 0.3; cursor: not-allowed; }

        .btn-skip {
          background: transparent;
          color: #A89968;
          padding: 12px 18px;
          border: none;
          font-family: 'Manrope', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          text-decoration: underline;
          text-decoration-color: rgba(168, 153, 104, 0.4);
          text-underline-offset: 4px;
        }
        .btn-skip:hover { color: #6B9E7F; text-decoration-color: #6B9E7F; }

        .progress-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(168, 153, 104, 0.3);
          transition: all 0.3s;
        }
        .progress-dot.active { background: #6B9E7F; width: 24px; border-radius: 100px; }
        .progress-dot.complete { background: #6B9E7F; }

        .info-box {
          background: rgba(212, 232, 221, 0.5);
          border-left: 3px solid #6B9E7F;
          border-radius: 4px;
          padding: 16px 18px;
          font-size: 13px;
          line-height: 1.6;
          color: #557E64;
        }

        .error-box {
          background: rgba(204, 68, 68, 0.08);
          border-left: 3px solid #CC4444;
          border-radius: 4px;
          padding: 12px 16px;
          font-size: 13px;
          color: #CC4444;
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        @media (max-width: 640px) {
          .container { padding: 0 20px !important; }
        }
      `}</style>

      <div className="grain"></div>

      {/* Top bar with brand + progress */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: 'rgba(245, 243, 240, 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(168, 153, 104, 0.15)',
        padding: '18px 0',
      }}>
        <div className="container" style={{ maxWidth: '720px', margin: '0 auto', padding: '0 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '24px', height: '24px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6B9E7F 0%, #A89968 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#FAF8F5',
                fontFamily: "'Fraunces', serif",
                fontSize: '12px',
              }}>g</div>
              <span className="display" style={{ fontSize: '17px', fontWeight: 500, color: '#3D4A52' }}>GlowWise</span>
            </div>
            <span className="eyebrow" style={{ fontSize: '10px' }}>
              Step {step + 1} of {totalSteps}
            </span>
          </div>

          {/* Progress dots */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center' }}>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`progress-dot ${i === step ? 'active' : i < step ? 'complete' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="container" style={{ maxWidth: '640px', margin: '0 auto', padding: '60px 32px 40px', position: 'relative', zIndex: 2 }}>
        <div className="step-fade" key={step}>

          {/* STEP 0 — WELCOME */}
          {step === 0 && (
            <div style={{ textAlign: 'center' }}>
              <div className="eyebrow" style={{ marginBottom: '24px' }}>Welcome</div>
              <h1 className="display" style={{ fontSize: 'clamp(36px, 6vw, 56px)', lineHeight: 1.1, marginBottom: '24px', color: '#3D4A52' }}>
                Let's get to know <em style={{ fontStyle: 'italic', color: '#6B9E7F' }}>you a little better.</em>
              </h1>
              <p style={{ fontSize: '17px', lineHeight: 1.65, color: '#5A6770', maxWidth: '480px', margin: '0 auto 40px' }}>
                These next few questions help GlowWise personalise your experience — from wellness insights to daily guidance and recommendations. There are no right or wrong answers. Just answer honestly, based on how you actually feel.
              </p>

              <div className="info-box" style={{ textAlign: 'left', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <Shield size={18} strokeWidth={1.8} style={{ color: '#6B9E7F', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ fontWeight: 600 }}>Wellness, not medical advice.</strong> GlowWise provides wellness guidance based on your responses. It's not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical concerns.
                  </div>
                </div>
              </div>

              <div className="info-box" style={{ textAlign: 'left', background: 'rgba(168, 153, 104, 0.08)', borderLeftColor: '#A89968', color: '#5A6770' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <Sparkles size={18} strokeWidth={1.8} style={{ color: '#A89968', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ fontWeight: 600, color: '#3D4A52' }}>Your data stays private.</strong> Encrypted, and under your control. You can edit or delete your answers, messages, or account anytime.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 1 — NAME & AGE */}
          {step === 1 && (
            <div>
              <div className="eyebrow" style={{ marginBottom: '20px' }}>About you</div>
              <h2 className="display" style={{ fontSize: 'clamp(28px, 4.5vw, 42px)', lineHeight: 1.15, marginBottom: '14px', color: '#3D4A52' }}>
                What should we <em style={{ fontStyle: 'italic', color: '#6B9E7F' }}>call you?</em>
              </h2>
              <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#5A6770', marginBottom: '36px' }}>
                Just a first name is fine — your coach will use this in conversations.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label className="eyebrow" style={{ display: 'block', marginBottom: '10px' }}>Your name</label>
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Sarah"
                    className="onboarding-input"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="eyebrow" style={{ display: 'block', marginBottom: '10px' }}>Your age</label>
                  <input
                    type="number"
                    value={data.age}
                    onChange={(e) => setData(prev => ({ ...prev, age: e.target.value }))}
                    placeholder="e.g. 32"
                    min="18"
                    max="120"
                    className="onboarding-input"
                  />
                  <p style={{ fontSize: '12px', color: '#A89968', marginTop: '8px' }}>You must be 18 or older to use GlowWise.</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 — GENDER */}
          {step === 2 && (
            <div>
              <div className="eyebrow" style={{ marginBottom: '20px' }}>Identity</div>
              <h2 className="display" style={{ fontSize: 'clamp(28px, 4.5vw, 42px)', lineHeight: 1.15, marginBottom: '14px', color: '#3D4A52' }}>
                How do you <em style={{ fontStyle: 'italic', color: '#6B9E7F' }}>identify?</em>
              </h2>
              <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#5A6770', marginBottom: '36px' }}>
                This helps your coach give relevant guidance — for example, on hormones or nutrition. There are no wrong answers.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {GENDER_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setData(prev => ({ ...prev, gender: opt.id }))}
                    className={`choice-card ${data.gender === opt.id ? 'selected' : ''}`}
                  >
                    <span>{opt.label}</span>
                    {data.gender === opt.id && <Check size={18} strokeWidth={2} style={{ color: '#6B9E7F' }} />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3 — WELLNESS PRIORITIES */}
          {step === 3 && (
            <div>
              <div className="eyebrow" style={{ marginBottom: '20px' }}>Priorities</div>
              <h2 className="display" style={{ fontSize: 'clamp(28px, 4.5vw, 42px)', lineHeight: 1.15, marginBottom: '14px', color: '#3D4A52' }}>
                What matters <em style={{ fontStyle: 'italic', color: '#6B9E7F' }}>most</em> to you?
              </h2>
              <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#5A6770', marginBottom: '14px' }}>
                Pick up to 3 areas your coach should focus on. You can change these anytime.
              </p>
              <p style={{ fontSize: '13px', color: '#A89968', marginBottom: '32px' }}>
                {data.wellness_priorities.length} of 3 selected
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {WELLNESS_TOPICS.map(topic => {
                  const selected = data.wellness_priorities.includes(topic.id);
                  const disabled = !selected && data.wellness_priorities.length >= 3;
                  return (
                    <button
                      key={topic.id}
                      onClick={() => !disabled && toggleWellnessPriority(topic.id)}
                      className={`priority-chip ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
                    >
                      <span className="priority-chip-icon">{topic.icon}</span>
                      {topic.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4 — BODY SIGNALS */}
          {step === 4 && (
            <div>
              <div className="eyebrow" style={{ marginBottom: '20px' }}>How you feel</div>
              <h2 className="display" style={{ fontSize: 'clamp(28px, 4.5vw, 42px)', lineHeight: 1.15, marginBottom: '14px', color: '#3D4A52' }}>
                What's your body <em style={{ fontStyle: 'italic', color: '#6B9E7F' }}>telling you?</em>
              </h2>
              <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#5A6770', marginBottom: '36px' }}>
                Anything you're noticing right now — symptoms, patterns, concerns. The more honest, the better your coach can help. Skip if you'd rather not share yet.
              </p>

              <textarea
                value={data.body_signals}
                onChange={(e) => setData(prev => ({ ...prev, body_signals: e.target.value }))}
                placeholder="e.g. Tired by 3pm most days, breakouts on my chin around my period, brain fog after lunch..."
                className="onboarding-textarea"
              />

              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button onClick={handleNext} className="btn-skip">Skip for now</button>
              </div>
            </div>
          )}

          {/* STEP 5 — SLEEP & ENERGY */}
          {step === 5 && (
            <div>
              <div className="eyebrow" style={{ marginBottom: '20px' }}>Sleep &amp; energy</div>
              <h2 className="display" style={{ fontSize: 'clamp(28px, 4.5vw, 42px)', lineHeight: 1.15, marginBottom: '14px', color: '#3D4A52' }}>
                The <em style={{ fontStyle: 'italic', color: '#6B9E7F' }}>foundation</em> of everything.
              </h2>
              <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#5A6770', marginBottom: '40px' }}>
                Sleep and energy shape how you feel physically, mentally, and emotionally — every day.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px' }}>
                    <label className="eyebrow">On average, how many hours of sleep are you getting?</label>
                    <span className="display" style={{ fontSize: '24px', color: '#6B9E7F' }}>
                      {data.sleep_hours}h
                    </span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="12"
                    value={data.sleep_hours}
                    onChange={(e) => setData(prev => ({ ...prev, sleep_hours: Number(e.target.value) }))}
                    className="slider-track"
                  />
               <p style={{ fontSize: '12px', color: '#A89968', marginTop: '10px' }}>
                    Most adults feel best with 7–9 hours.
                  </p>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px' }}>
                    <label className="eyebrow">How restful is your sleep, typically?</label>
                    <span className="display" style={{ fontSize: '24px', color: '#6B9E7F', fontStyle: 'italic' }}>
                      {data.sleep_quality <= 3 ? 'Restless' : data.sleep_quality <= 5 ? 'Mixed' : data.sleep_quality <= 7 ? 'Fair' : 'Restful'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={data.sleep_quality || 5}
                    onChange={(e) => setData(prev => ({ ...prev, sleep_quality: Number(e.target.value) }))}
                    className="slider-track"
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#A89968', marginTop: '8px' }}>
                    <span>Restless</span>
                    <span>Restful</span>
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px' }}>
                    <label className="eyebrow">How's your energy on a typical day?</label>
                    <span className="display" style={{ fontSize: '24px', color: '#6B9E7F' }}>
                      {data.energy_level}<span style={{ fontSize: '14px', color: '#A89968' }}>/10</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={data.energy_level}
                    onChange={(e) => setData(prev => ({ ...prev, energy_level: Number(e.target.value) }))}
                    className="slider-track"
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#A89968', marginTop: '8px' }}>
                    <span>Exhausted</span>
                    <span>Energised</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6 — STRESS */}
          {step === 6 && (
            <div>
              <div className="eyebrow" style={{ marginBottom: '20px' }}>Stress</div>
              <h2 className="display" style={{ fontSize: 'clamp(28px, 4.5vw, 42px)', lineHeight: 1.15, marginBottom: '14px', color: '#3D4A52' }}>
                How have <em style={{ fontStyle: 'italic', color: '#6B9E7F' }}>things felt</em> lately?
              </h2>
              <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#5A6770', marginBottom: '40px' }}>
                Stress quietly shapes sleep, focus, energy, mood, and recovery — even when we don't notice it.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px' }}>
                    <label className="eyebrow">Current stress level</label>
<span className="display" style={{ fontSize: '24px', color: '#6B9E7F', fontStyle: 'italic' }}>
  {data.stress_level <= 3 ? 'Calm' : data.stress_level <= 5 ? 'Manageable' : data.stress_level <= 7 ? 'Elevated' : data.stress_level <= 9 ? 'Pressured' : 'Overwhelmed'}
</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={data.stress_level}
                    onChange={(e) => setData(prev => ({ ...prev, stress_level: Number(e.target.value) }))}
                    className="slider-track"
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#A89968', marginTop: '8px' }}>
                    <span>Calm</span>
                    <span>Overwhelmed</span>
                  </div>
                </div>

                <div>
  <label className="eyebrow" style={{ display: 'block', marginBottom: '10px' }}>What tends to trigger your stress? (optional)</label>
  <p style={{ fontSize: '12px', color: '#A89968', marginBottom: '14px', fontStyle: 'italic' }}>
    Tap any that apply.
  </p>
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
    {[
      'Work pressure',
      'Mentally overloaded',
      'Sleep difficulties',
      'Relationships',
      'Financial concerns',
      'Health worries',
      'Caregiver demands',
      'Shift work',
      'Lack of time',
      'Working or living in isolation',
      'Loneliness',
    ].map(trigger => {
      const triggers = data.stress_trigger_list || [];
      const selected = triggers.includes(trigger);
      return (
        <span
          key={trigger}
          onClick={() => {
            const current = data.stress_trigger_list || [];
            const updated = current.includes(trigger)
              ? current.filter(t => t !== trigger)
              : [...current, trigger];
            setData(prev => ({ ...prev, stress_trigger_list: updated }));
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            border: selected ? '1.5px solid #6B9E7F' : '1px solid rgba(168, 153, 104, 0.3)',
            borderRadius: '100px',
            background: selected ? '#EDF4EF' : '#FAF8F5',
            cursor: 'pointer',
            fontSize: '13px',
            color: '#3D4A52',
            fontWeight: selected ? 600 : 400,
            transition: 'all 0.2s',
          }}
        >
          {trigger}
        </span>
      );
    })}
  </div>
  <textarea
                    value={data.stress_triggers}
                    onChange={(e) => setData(prev => ({ ...prev, stress_triggers: e.target.value }))}
                    placeholder="Anything else you'd like to share? (optional)"
                    className="onboarding-textarea"
                    style={{ minHeight: '60px' }}
                  />
                </div>
              </div>
            </div>
          )}
          {/* STEP 7 — LIFESTYLE (DIET + EXERCISE + WATER) */}
          {step === 7 && (
            <div>
              <div className="eyebrow" style={{ marginBottom: '20px' }}>Lifestyle</div>
              <h2 className="display" style={{ fontSize: 'clamp(28px, 4.5vw, 42px)', lineHeight: 1.15, marginBottom: '14px', color: '#3D4A52' }}>
                Your <em style={{ fontStyle: 'italic', color: '#6B9E7F' }}>daily rhythm.</em>
              </h2>
              <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#5A6770', marginBottom: '40px' }}>
                Small daily habits shape your energy, focus, stress, and recovery — often more than we realise.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
                <div>
                  <label className="eyebrow" style={{ display: 'block', marginBottom: '14px' }}>How would you describe your diet?</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {DIET_TYPES.map(diet => (
                      <button
                        key={diet.id}
                        onClick={() => setData(prev => ({ ...prev, diet_type: diet.id }))}
                        className={`choice-card ${data.diet_type === diet.id ? 'selected' : ''}`}
                      >
                        <div>
                          <div style={{ fontWeight: 600 }}>{diet.label}</div>
                          <div style={{ fontSize: '12px', color: '#A89968', marginTop: '2px', fontWeight: 400 }}>{diet.desc}</div>
                        </div>
                        {data.diet_type === diet.id && <Check size={18} strokeWidth={2} style={{ color: '#6B9E7F' }} />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px' }}>
                    <label className="eyebrow">How many days a week do you exercise?</label>
                    <span className="display" style={{ fontSize: '24px', color: '#6B9E7F' }}>
                      {data.exercise_per_week}<span style={{ fontSize: '14px', color: '#A89968' }}> {data.exercise_per_week === 1 ? 'day' : 'days'}</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="7"
                    value={data.exercise_per_week}
                    onChange={(e) => setData(prev => ({ ...prev, exercise_per_week: Number(e.target.value) }))}
                    className="slider-track"
                  />
                  <p style={{ fontSize: '12px', color: '#A89968', marginTop: '10px' }}>
                    Counts walking, dancing, gym, sports, yoga, swimming, cycling — anything that gets you moving.
                  </p>
                </div>
                <div>
                  <label className="eyebrow" style={{ display: 'block', marginBottom: '14px' }}>When you move, do you prefer company? (optional)</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      { id: 'alone', label: 'On my own', desc: 'I prefer solo movement and quiet focus' },
                      { id: 'with-others', label: 'With others', desc: 'Classes, friends, shared activity energise me' },
                      { id: 'mix', label: 'A mix of both', desc: 'Depends on the day and my mood' },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setData(prev => ({ ...prev, exercise_social: opt.id }))}
                        className={`choice-card ${data.exercise_social === opt.id ? 'selected' : ''}`}
                      >
                        <div>
                          <div style={{ fontWeight: 600 }}>{opt.label}</div>
                          <div style={{ fontSize: '12px', color: '#A89968', marginTop: '2px', fontWeight: 400 }}>{opt.desc}</div>
                        </div>
                        {data.exercise_social === opt.id && <Check size={18} strokeWidth={2} style={{ color: '#6B9E7F' }} />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px' }}>
                    <label className="eyebrow">Water per day</label>
                    <span className="display" style={{ fontSize: '24px', color: '#6B9E7F' }}>
                      {data.water_intake}<span style={{ fontSize: '14px', color: '#A89968' }}>L</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="4"
                    step="0.5"
                    value={data.water_intake}
                    onChange={(e) => setData(prev => ({ ...prev, water_intake: Number(e.target.value) }))}
                    className="slider-track"
                  />
                  <p style={{ fontSize: '12px', color: '#A89968', marginTop: '10px' }}>Most adults need 2–3 litres a day.</p>
                </div>

                <div>
                  <label className="eyebrow" style={{ display: 'block', marginBottom: '10px' }}>Supplements you take (optional)</label>
                  <textarea
                    value={data.supplements}
                    onChange={(e) => setData(prev => ({ ...prev, supplements: e.target.value }))}
                    placeholder="e.g. Vitamin D, magnesium, omega-3, probiotic..."
                    className="onboarding-textarea"
                    style={{ minHeight: '80px' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 8 — ALMOST THERE — HEALTH CONTEXT, NOTIFICATIONS, PHOTO */}
          {step === 8 && (
            <div>
              <div className="eyebrow" style={{ marginBottom: '20px' }}>Almost there</div>
              <h2 className="display" style={{ fontSize: 'clamp(28px, 4.5vw, 42px)', lineHeight: 1.15, marginBottom: '14px', color: '#3D4A52' }}>
                A few <em style={{ fontStyle: 'italic', color: '#6B9E7F' }}>final details.</em>
              </h2>
              <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#5A6770', marginBottom: '40px' }}>
                These are completely optional — they help GlowWise personalise your wellness insights more thoughtfully.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div>
              <label className="eyebrow" style={{ display: 'block', marginBottom: '10px' }}>Health considerations (optional)</label>
                  <p style={{ fontSize: '12px', color: '#A89968', marginBottom: '10px', fontStyle: 'italic' }}>
                    Anything GlowWise should be aware of?
                  </p>
                  <textarea
                    value={data.health_context}
                    onChange={(e) => setData(prev => ({ ...prev, health_context: e.target.value }))}
                    placeholder="e.g. IBS, thyroid issues, anxiety, hormonal changes, chronic fatigue..."
                    className="onboarding-textarea"
                    style={{ minHeight: '80px' }}
                  />
                </div>

                <div>
                  <label className="eyebrow" style={{ display: 'block', marginBottom: '10px' }}>Current medications or treatments (optional)</label>
                  <textarea
                    value={data.medications}
                    onChange={(e) => setData(prev => ({ ...prev, medications: e.target.value }))}
                    placeholder="e.g. Thyroid medication, antidepressants, blood pressure, birth control..."
                    className="onboarding-textarea"
                    style={{ minHeight: '80px' }}
                  />
                </div>

                <div>
                  <label className="eyebrow" style={{ display: 'block', marginBottom: '14px' }}>How often should we check in?</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      { id: 'daily', label: 'Daily reminders', desc: 'A gentle nudge each morning' },
                      { id: 'weekly', label: 'Weekly summary', desc: 'A digest every Sunday' },
                      { id: 'never', label: 'No reminders', desc: 'I\'ll come back when I want to' },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setData(prev => ({ ...prev, notification_frequency: opt.id }))}
                        className={`choice-card ${data.notification_frequency === opt.id ? 'selected' : ''}`}
                      >
                        <div>
                          <div style={{ fontWeight: 600 }}>{opt.label}</div>
                          <div style={{ fontSize: '12px', color: '#A89968', marginTop: '2px', fontWeight: 400 }}>{opt.desc}</div>
                        </div>
                        {data.notification_frequency === opt.id && <Check size={18} strokeWidth={2} style={{ color: '#6B9E7F' }} />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="info-box">
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <Sparkles size={16} strokeWidth={1.8} style={{ color: '#6B9E7F', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      Once you finish, your coach will build a personalised wellness profile and suggest your first actions for today.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="error-box" style={{ marginTop: '24px' }}>
              <AlertCircle size={16} strokeWidth={2} style={{ flexShrink: 0, marginTop: '1px' }} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div style={{
          marginTop: '48px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
        }}>
          <button
            onClick={handleBack}
            disabled={step === 0}
            className="btn-ghost"
          >
            <ChevronLeft size={16} strokeWidth={2} />
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={saving}
            className="btn-primary"
          >
            {saving ? (
              'Saving your profile...'
            ) : step === totalSteps - 1 ? (
              <>Build my profile <Sparkles size={16} strokeWidth={2} /></>
            ) : step === 0 ? (
              <>Let's begin <ChevronRight size={16} strokeWidth={2} /></>
            ) : (
              <>Continue <ChevronRight size={16} strokeWidth={2} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
