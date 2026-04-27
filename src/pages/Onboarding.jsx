import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../context/UserDataContext';
import { ChevronRight, ChevronLeft, Check, AlertCircle, Camera, Sparkles, Shield, X } from 'lucide-react';

const WELLNESS_TOPICS = [
  { id: 'hormones', label: 'Hormones & Metabolism', icon: '◐' },
  { id: 'fertility', label: 'Fertility', icon: '✦' },
  { id: 'weight', label: 'Weight & Body Composition', icon: '◑' },
  { id: 'energy', label: 'Energy & Fatigue', icon: '◎' },
  { id: 'sleep', label: 'Sleep & Recovery', icon: '☾' },
  { id: 'stress', label: 'Stress & Anxiety', icon: '◉' },
  { id: 'brain', label: 'Brain & Focus', icon: '◈' },
  { id: 'gut', label: 'Gut & Digestion', icon: '◍' },
  { id: 'skin', label: 'Skin & Acne', icon: '◇' },
  { id: 'hair', label: 'Hair & Scalp', icon: '✧' },
  { id: 'nutrition', label: 'Nutrition & Diet', icon: '◆' },
];

const DIET_TYPES = [
  { id: 'Balanced', label: 'Balanced', desc: 'A bit of everything' },
  { id: 'Plant-Based', label: 'Plant-based', desc: 'Vegetarian or vegan' },
  { id: 'Mediterranean', label: 'Mediterranean', desc: 'Veggies, fish, olive oil' },
  { id: 'Keto', label: 'Keto / low-carb', desc: 'High fat, low carb' },
  { id: 'Paleo', label: 'Paleo', desc: 'Whole foods, no grains' },
  { id: 'Other', label: 'Something else', desc: 'I\'ll tell my coach later' },
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
    energy_level: 7,
    // Stress
    stress_level: 5,
    stress_triggers: '',
    // Nutrition
    diet_type: 'Balanced',
    supplements: '',
    // Lifestyle
    exercise_per_week: 3,
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

  // ============================
  // Enhanced Glow Type calculation
  // Creates a richer personalisation profile
  // ============================
  const generatePersonalisedProfile = (formData) => {
    const priorities = formData.wellness_priorities;
    const stress = formData.stress_level;
    const sleep = formData.sleep_hours;
    const energy = formData.energy_level;
    const exercise = formData.exercise_per_week;
    const water = formData.water_intake;

    // Determine primary Glow Type (more nuanced than Haiku's version)
    let glowType = 'Balanced Wellness Glow';
    let glowTypeDescription = '';

    if (stress >= 8) {
      glowType = 'Stress-Driven Recovery';
      glowTypeDescription = 'Your stress is high enough that it\'s likely affecting other areas. We\'ll start by helping you build calm into your daily routine — the rest will follow.';
    } else if (sleep < 6) {
      glowType = 'Sleep Restoration Focus';
      glowTypeDescription = 'Sleep is foundational to everything else — energy, hormones, skin, brain. We\'ll prioritise rebuilding your sleep first.';
    } else if (energy <= 4) {
      glowType = 'Energy Rebuilding Path';
      glowTypeDescription = 'Low energy can have many causes — sleep, stress, nutrition, hormones. We\'ll work systematically to identify what\'s draining you.';
    } else if (priorities.includes('hormones') || priorities.includes('fertility')) {
      glowType = 'Hormonal Balance Journey';
      glowTypeDescription = 'Hormonal health affects everything from mood and skin to energy and metabolism. We\'ll track patterns connected to your lifestyle.';
    } else if (priorities.includes('weight')) {
      glowType = 'Body Composition Focus';
      glowTypeDescription = 'Sustainable changes come from understanding your patterns — sleep, stress, nutrition and movement. We\'ll help you spot what\'s actually moving the needle.';
    } else if (priorities.includes('hair')) {
      glowType = 'Hair Health Focus';
      glowTypeDescription = 'Hair health reflects internal health. We\'ll look at the underlying factors — stress, nutrition, hormones — that affect your hair.';
    } else if (priorities.includes('skin')) {
      glowType = 'Skin Clarity Path';
      glowTypeDescription = 'Skin issues often stem from inflammation, hormones, or gut health. We\'ll connect your daily patterns to what your skin is telling you.';
    } else if (priorities.includes('gut')) {
      glowType = 'Gut Health Reset';
      glowTypeDescription = 'Gut health influences mood, skin, energy, and immunity. We\'ll help you identify foods and habits that support your digestion.';
    } else if (priorities.includes('brain')) {
      glowType = 'Brain & Focus Boost';
      glowTypeDescription = 'Mental clarity depends on sleep, blood sugar, hydration, and stress. We\'ll work on the foundations that sharpen your thinking.';
    } else if (priorities.includes('nutrition')) {
      glowType = 'Nutrition Foundations';
      glowTypeDescription = 'Food affects everything — energy, mood, skin, sleep. We\'ll help you build eating patterns that work for your body and your goals.';
    } else {
      glowTypeDescription = 'You\'re in a good place overall. We\'ll help you spot patterns and fine-tune the areas that matter most to you.';
    }

    // Identify top 3 priority focus areas
    const focusAreas = priorities.length > 0
      ? priorities.map(id => WELLNESS_TOPICS.find(t => t.id === id)?.label).filter(Boolean)
      : ['Overall wellness'];

    // Generate immediate action recommendations
    const immediateActions = [];
    if (sleep < 7) immediateActions.push('Aim for 7+ hours of sleep');
    if (stress >= 7) immediateActions.push('Add a 5-minute calm break each day');
    if (water < 2) immediateActions.push('Increase water intake to 2L+ daily');
    if (exercise < 3) immediateActions.push('Add 2 short walks per week');
    if (immediateActions.length === 0) immediateActions.push('Stay consistent with daily check-ins');
    if (immediateActions.length < 3) immediateActions.push('Track patterns over the next 7 days');

    // Build the AI Coach context — this gets fed to OpenAI as part of the system prompt
    // so the AI actually uses this profile in conversations
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
      stressTriggers: formData.stress_triggers || 'Not specified',
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

      navigate('/dashboard');
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
                Let's get to know <em style={{ fontStyle: 'italic', color: '#6B9E7F' }}>each other.</em>
              </h1>
              <p style={{ fontSize: '17px', lineHeight: 1.65, color: '#5A6770', maxWidth: '480px', margin: '0 auto 40px' }}>
                The next 9 questions help your AI Coach understand you. Your answers shape every recommendation, every insight, every conversation. Take your time — this is the foundation of your personalised wellness profile.
              </p>

              <div className="info-box" style={{ textAlign: 'left', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <Shield size={18} strokeWidth={1.8} style={{ color: '#6B9E7F', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ fontWeight: 600 }}>Wellness, not medical advice.</strong> GlowWise gives lifestyle guidance based on your answers. It's not a substitute for a doctor — please always consult a qualified healthcare provider for medical concerns.
                  </div>
                </div>
              </div>

              <div className="info-box" style={{ textAlign: 'left', background: 'rgba(168, 153, 104, 0.08)', borderLeftColor: '#A89968', color: '#5A6770' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <Sparkles size={18} strokeWidth={1.8} style={{ color: '#A89968', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ fontWeight: 600, color: '#3D4A52' }}>Your data is yours.</strong> Encrypted, private, never shared. Delete any answer, message, or your whole account whenever you want.
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
                      {selected && <X size={14} strokeWidth={2} />}
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
                Sleep and energy affect almost every other wellness area. Give us your honest baseline.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px' }}>
                    <label className="eyebrow">Sleep per night</label>
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
                    <label className="eyebrow">Energy level today</label>
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
                    <span>Drained</span>
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
                How are <em style={{ fontStyle: 'italic', color: '#6B9E7F' }}>stress levels</em> right now?
              </h2>
              <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#5A6770', marginBottom: '40px' }}>
                Stress affects sleep, skin, hormones, and energy. Knowing your baseline helps us spot what's connected.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px' }}>
                    <label className="eyebrow">Current stress</label>
                    <span className="display" style={{ fontSize: '24px', color: '#6B9E7F' }}>
                      {data.stress_level}<span style={{ fontSize: '14px', color: '#A89968' }}>/10</span>
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
                  <label className="eyebrow" style={{ display: 'block', marginBottom: '10px' }}>What triggers it? (optional)</label>
                  <textarea
                    value={data.stress_triggers}
                    onChange={(e) => setData(prev => ({ ...prev, stress_triggers: e.target.value }))}
                    placeholder="e.g. Work deadlines, relationship dynamics, financial pressure, health worries..."
                    className="onboarding-textarea"
                    style={{ minHeight: '90px' }}
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
                A few quick details about how you eat, move, and hydrate.
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
                    <label className="eyebrow">Exercise per week</label>
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
                These are all optional — but the more we know, the more personalised your guidance becomes.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div>
                  <label className="eyebrow" style={{ display: 'block', marginBottom: '10px' }}>Diagnoses or conditions (optional)</label>
                  <textarea
                    value={data.health_context}
                    onChange={(e) => setData(prev => ({ ...prev, health_context: e.target.value }))}
                    placeholder="e.g. PCOS, thyroid condition, IBS, anxiety..."
                    className="onboarding-textarea"
                    style={{ minHeight: '80px' }}
                  />
                </div>

                <div>
                  <label className="eyebrow" style={{ display: 'block', marginBottom: '10px' }}>Current medications (optional)</label>
                  <textarea
                    value={data.medications}
                    onChange={(e) => setData(prev => ({ ...prev, medications: e.target.value }))}
                    placeholder="e.g. Birth control, thyroid medication..."
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

                <div>
                  <label className="eyebrow" style={{ display: 'block', marginBottom: '10px' }}>Baseline photo (optional)</label>
                  <p style={{ fontSize: '13px', color: '#5A6770', marginBottom: '14px', lineHeight: 1.5 }}>
                    A starting photo helps you track visual progress later — skin, hair, posture. Stays private and encrypted.
                  </p>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    padding: '20px',
                    border: '2px dashed rgba(168, 153, 104, 0.4)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: data.photo_uploaded ? 'rgba(212, 232, 221, 0.4)' : 'transparent',
                  }}>
                    <Camera size={20} strokeWidth={1.5} style={{ color: data.photo_uploaded ? '#6B9E7F' : '#A89968' }} />
                    <span style={{ fontSize: '14px', color: data.photo_uploaded ? '#557E64' : '#5A6770', fontWeight: 500 }}>
                      {data.photo_uploaded ? 'Photo selected ✓' : 'Choose a photo'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
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
