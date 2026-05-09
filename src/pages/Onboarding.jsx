import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserData } from '../context/UserDataContext';
import { ChevronLeft, ChevronRight, Check, AlertCircle } from 'lucide-react';

// 11 wellness priorities (locked, gender-neutral)
const WELLNESS_PRIORITIES = [
  { id: 'hormonal', label: 'Hormonal Balance' },
  { id: 'fertility', label: 'Fertility Support' },
  { id: 'body-comp', label: 'Body Composition' },
  { id: 'energy', label: 'Energy & Fatigue' },
  { id: 'sleep', label: 'Sleep & Recovery' },
  { id: 'stress', label: 'Stress & Anxiety' },
  { id: 'brain', label: 'Brain & Focus' },
  { id: 'gut', label: 'Gut & Digestion' },
  { id: 'skin', label: 'Skin & Acne' },
  { id: 'hair', label: 'Hair & Scalp Wellness' },
  { id: 'nutrition', label: 'Nutrition & Eating Habits' },
];

const STRESS_TRIGGERS = [
  'Work pressure or deadlines',
  'Feeling mentally overloaded',
  'Sleep difficulties',
  'Relationship tension',
  'Financial concerns',
  'Health worries',
  'Caregiver or parenting demands',
  'Shift work or irregular hours',
  'Lack of time',
];

const EATING_STYLES = [
  'Mostly home-cooked, varied meals',
  'A mix of home cooking and convenience foods',
  'Often eat takeaways or restaurant meals',
  'Mostly on-the-go or processed foods',
  'Following a specific approach (vegan, vegetarian, keto, Mediterranean, etc.)',
  "Other / I'll tell my coach later",
];

const SUPPLEMENTS = [
  'Vitamin D', 'Vitamin B12', 'Iron', 'Magnesium',
  'Omega-3', 'Multivitamin', 'Probiotic', 'Collagen',
];

const calculateGlowType = (priorities) => {
  if (!priorities || priorities.length === 0) {
    return {
      type: 'Balanced Wellness Glow',
      description: "You're tuning into your body's natural rhythms — a path of patience and self-attention.",
    };
  }
  const primary = priorities[0];
  const map = {
    'hormonal': { type: 'Hormonal Balance Journey', description: "You're tuning into your body's natural rhythms — a path of patience and self-attention." },
    'fertility': { type: 'Fertility & Cycle Focus', description: 'A journey of nurturing balance and listening closely to your body.' },
    'body-comp': { type: 'Body Composition Focus', description: 'Strength, vitality, and feeling at home in your body.' },
    'energy': { type: 'Energy Rebuilding Path', description: 'Restoring your reserves through gentle, sustainable habits.' },
    'sleep': { type: 'Sleep Restoration Focus', description: 'Healing through deeper rest and consistent rhythms.' },
    'stress': { type: 'Stress-Driven Recovery', description: 'Finding calm through small, supportive shifts each day.' },
    'brain': { type: 'Brain & Focus Boost', description: 'Sharpening clarity through balanced energy and rest.' },
    'gut': { type: 'Gut Health Reset', description: 'Healing from the inside out — your foundation matters most.' },
    'skin': { type: 'Skin Clarity Path', description: 'Glowing skin starts with what supports you internally.' },
    'hair': { type: 'Hair Health Focus', description: 'Nourishing growth through nutrition, calm, and care.' },
    'nutrition': { type: 'Nutrition Foundations', description: 'Building wellness through what nourishes you most.' },
  };
  return map[primary] || map['hormonal'];
};

const Onboarding = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { updateProfile } = useUserData();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [gender, setGender] = useState('');
  const [priorities, setPriorities] = useState([]);
  const [concerns, setConcerns] = useState('');
  const [sleepHours, setSleepHours] = useState(7);
  const [sleepQuality, setSleepQuality] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [stress, setStress] = useState(5);
  const [stressTriggers, setStressTriggers] = useState([]);
  const [stressOther, setStressOther] = useState('');
  const [eatingStyle, setEatingStyle] = useState('');
  const [exerciseDays, setExerciseDays] = useState(3);
  const [waterLitres, setWaterLitres] = useState(2);
  const [supplements, setSupplements] = useState([]);
  const [healthConsiderations, setHealthConsiderations] = useState('');
  const [medications, setMedications] = useState('');
  const [reminders, setReminders] = useState('daily');

  const totalSteps = 9;
  const progress = (step / totalSteps) * 100;

  const togglePriority = (id) => {
    if (priorities.includes(id)) setPriorities(priorities.filter(p => p !== id));
    else if (priorities.length < 3) setPriorities([...priorities, id]);
  };
  const toggleTrigger = (t) => {
    if (stressTriggers.includes(t)) setStressTriggers(stressTriggers.filter(x => x !== t));
    else setStressTriggers([...stressTriggers, t]);
  };
  const toggleSupplement = (s) => {
    if (supplements.includes(s)) setSupplements(supplements.filter(x => x !== s));
    else setSupplements([...supplements, s]);
  };

  const handleNext = () => { if (step < totalSteps) { setStep(step + 1); window.scrollTo(0, 0); } };
  const handleBack = () => { if (step > 1) { setStep(step - 1); window.scrollTo(0, 0); } };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const glowType = calculateGlowType(priorities);
      const focusAreas = priorities.map(id =>
        WELLNESS_PRIORITIES.find(p => p.id === id)?.label
      ).filter(Boolean);

      await updateProfile({
        name, ageRange, gender, priorities, focusAreas,
        glowType: glowType.type,
        glowTypeDescription: glowType.description,
        concerns, sleepHours, sleepQuality, energy, stress,
        stressTriggers, stressOther, eatingStyle, exerciseDays,
        waterLitres, supplements, healthConsiderations,
        medications, reminders, onboardingComplete: true,
        aiContext: {
          name, glowType: glowType.type, focusAreas,
          baselineSleep: sleepHours, baselineEnergy: energy,
          baselineStress: stress, eatingStyle,
        },
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Onboarding save error:', err);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    minHeight: '100vh', background: '#F5F3F0',
    fontFamily: "'Manrope', sans-serif", color: '#3D4A52', position: 'relative',
  };
  const grainStyle = {
    position: 'fixed', inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E")`,
    opacity: 0.04, pointerEvents: 'none', zIndex: 0,
  };
  const innerStyle = { position: 'relative', zIndex: 1, maxWidth: '640px', margin: '0 auto', padding: '40px 24px 120px' };
  const progressBarStyle = { height: '3px', background: 'rgba(168, 153, 104, 0.15)', borderRadius: '100px', marginBottom: '40px', overflow: 'hidden' };
  const progressFillStyle = { height: '100%', background: '#6B9E7F', width: `${progress}%`, transition: 'width 0.3s ease' };
  const stepLabelStyle = { fontSize: '11px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#A89968', marginBottom: '16px' };
  const titleStyle = { fontFamily: "'Fraunces', serif", fontSize: 'clamp(32px, 5vw, 44px)', fontWeight: 400, color: '#3D4A52', lineHeight: 1.1, marginBottom: '12px', letterSpacing: '-0.5px' };
  const italicSage = { fontStyle: 'italic', color: '#6B9E7F' };
  const subtitleStyle = { fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontSize: '20px', color: '#6B9E7F', marginBottom: '24px', fontWeight: 400 };
  const paragraphStyle = { fontSize: '16px', lineHeight: 1.6, color: '#5A6770', marginBottom: '20px' };
  const labelStyle = { fontSize: '14px', fontWeight: 600, color: '#3D4A52', marginBottom: '10px', display: 'block' };
  const helperStyle = { fontSize: '13px', color: '#A89968', marginTop: '6px', fontStyle: 'italic' };
  const inputStyle = { width: '100%', padding: '14px 18px', fontSize: '16px', fontFamily: "'Manrope', sans-serif", border: '1px solid rgba(168, 153, 104, 0.3)', borderRadius: '8px', background: '#FAF8F5', color: '#3D4A52', outline: 'none' };
  const textareaStyle = { ...inputStyle, minHeight: '100px', resize: 'vertical' };
  const radioCardStyle = (selected) => ({
    padding: '14px 18px',
    border: selected ? '2px solid #6B9E7F' : '1px solid rgba(168, 153, 104, 0.25)',
    borderRadius: '10px',
    background: selected ? '#EDF4EF' : '#FAF8F5',
    cursor: 'pointer', transition: 'all 0.2s',
    fontSize: '15px', color: '#3D4A52', marginBottom: '8px',
    fontWeight: selected ? 600 : 400,
  });
  const checkboxCardStyle = (selected) => ({
    padding: '12px 16px',
    border: selected ? '2px solid #6B9E7F' : '1px solid rgba(168, 153, 104, 0.25)',
    borderRadius: '10px',
    background: selected ? '#EDF4EF' : '#FAF8F5',
    cursor: 'pointer', transition: 'all 0.2s',
    fontSize: '14px', color: '#3D4A52', marginBottom: '8px',
    display: 'flex', alignItems: 'center', gap: '10px',
  });
  const priorityCardStyle = (selected, disabled) => ({
    padding: '14px 18px',
    border: selected ? '2px solid #6B9E7F' : '1px solid rgba(168, 153, 104, 0.25)',
    borderRadius: '10px',
    background: selected ? '#EDF4EF' : disabled ? '#F5F3F0' : '#FAF8F5',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
    fontSize: '15px',
    color: disabled ? '#A89968' : '#3D4A52',
    fontWeight: selected ? 600 : 400,
    opacity: disabled ? 0.5 : 1,
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '8px',
  });
  const sliderContainerStyle = { marginBottom: '24px' };
  const sliderStyle = { width: '100%', height: '6px', borderRadius: '3px', background: 'rgba(168, 153, 104, 0.2)', outline: 'none', appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer' };
  const sliderLabelsStyle = { display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#A89968', marginTop: '8px' };
  const sliderValueStyle = { fontFamily: "'Fraunces', serif", fontSize: '32px', fontWeight: 400, color: '#6B9E7F', textAlign: 'center', marginBottom: '12px', lineHeight: 1 };
  const navButtonsStyle = { display: 'flex', gap: '12px', marginTop: '40px' };
  const buttonPrimaryStyle = { flex: 1, padding: '16px 32px', fontSize: '16px', fontWeight: 600, fontFamily: "'Manrope', sans-serif", background: '#6B9E7F', color: '#FAF8F5', border: 'none', borderRadius: '100px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' };
  const buttonSecondaryStyle = { padding: '16px 32px', fontSize: '16px', fontWeight: 500, fontFamily: "'Manrope', sans-serif", background: 'transparent', color: '#3D4A52', border: '1.5px solid #3D4A52', borderRadius: '100px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' };
  const disclaimerCardStyle = { background: '#FAF8F5', border: '1px solid rgba(168, 153, 104, 0.18)', borderRadius: '12px', padding: '20px 22px', marginBottom: '14px' };
  const disclaimerTitleStyle = { fontFamily: "'Fraunces', serif", fontSize: '15px', fontWeight: 500, color: '#3D4A52', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' };
  const disclaimerTextStyle = { fontSize: '13px', lineHeight: 1.6, color: '#5A6770' };
  const supplementChipStyle = (selected) => ({
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    padding: '8px 14px',
    border: selected ? '1.5px solid #6B9E7F' : '1px solid rgba(168, 153, 104, 0.3)',
    borderRadius: '100px',
    background: selected ? '#EDF4EF' : '#FAF8F5',
    cursor: 'pointer', fontSize: '13px',
    color: '#3D4A52', fontWeight: selected ? 600 : 400,
    marginRight: '6px', marginBottom: '8px',
  });

  const sleepQualityLabel = sleepQuality <= 3 ? 'Restless' : sleepQuality <= 5 ? 'Mixed' : sleepQuality <= 7 ? 'Fair' : 'Restful';
  const energyLabel = energy <= 3 ? 'Low' : energy <= 5 ? 'Building' : energy <= 7 ? 'Steady' : energy <= 9 ? 'Energised' : 'Vibrant';
  const stressLabel = stress <= 3 ? 'Calm' : stress <= 5 ? 'Manageable' : stress <= 7 ? 'Elevated' : stress <= 9 ? 'Pressured' : 'Overwhelmed';

  return (
    <div style={containerStyle}>
      <div style={grainStyle}></div>
      <div style={innerStyle}>

        <div style={progressBarStyle}><div style={progressFillStyle}></div></div>
        <div style={stepLabelStyle}>Step {step} of {totalSteps}</div>

        {step === 1 && (
          <>
            <h1 style={titleStyle}>Welcome.</h1>
            <p style={subtitleStyle}>Let's get to know you a little better.</p>
            <p style={paragraphStyle}>These next few questions help GlowWise personalise your experience — from wellness insights to daily guidance and recommendations.</p>
            <p style={paragraphStyle}>There are no right or wrong answers. Just answer honestly, based on how you actually feel.</p>
            <div style={{ marginTop: '32px' }}>
              <div style={disclaimerCardStyle}>
                <div style={disclaimerTitleStyle}><AlertCircle size={16} strokeWidth={1.8} color="#A89968" />Wellness, not medical advice</div>
                <p style={disclaimerTextStyle}>GlowWise provides wellness guidance based on your responses. It's not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical concerns.</p>
              </div>
              <div style={disclaimerCardStyle}>
                <div style={disclaimerTitleStyle}><Check size={16} strokeWidth={2} color="#6B9E7F" />Your privacy matters</div>
                <p style={disclaimerTextStyle}>Your data stays private, encrypted, and under your control. You can edit or delete your answers, messages, or account anytime.</p>
              </div>
            </div>
            <div style={navButtonsStyle}>
              <button style={buttonSecondaryStyle} onClick={() => navigate('/dashboard')}><ChevronLeft size={18} /> Back</button>
              <button style={buttonPrimaryStyle} onClick={handleNext}>Let's begin <ChevronRight size={18} /></button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 style={titleStyle}>Basic profile.</h1>
            <p style={subtitleStyle}>Just the essentials.</p>
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>What's your name?</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your first name" style={inputStyle} />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Your age range</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {['18-24', '25-34', '35-44', '45-54', '55-64', '65+'].map(range => (
                  <div key={range} style={radioCardStyle(ageRange === range)} onClick={() => setAgeRange(range)}>{range}</div>
                ))}
              </div>
            </div>
            <div style={navButtonsStyle}>
              <button style={buttonSecondaryStyle} onClick={handleBack}><ChevronLeft size={18} /> Back</button>
              <button style={{ ...buttonPrimaryStyle, opacity: (!name || !ageRange) ? 0.5 : 1 }} onClick={handleNext} disabled={!name || !ageRange}>Continue <ChevronRight size={18} /></button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h1 style={titleStyle}>How do you identify?</h1>
            <p style={subtitleStyle}>This helps your coach personalise guidance.</p>
            <p style={paragraphStyle}>For example, hormones, fertility, and nutrition support vary depending on how you identify. There are no wrong answers.</p>
            <div style={{ marginTop: '24px' }}>
              {['Female', 'Male', 'Non-binary', 'Prefer not to say'].map(opt => (
                <div key={opt} style={radioCardStyle(gender === opt)} onClick={() => setGender(opt)}>{opt}</div>
              ))}
            </div>
            <div style={navButtonsStyle}>
              <button style={buttonSecondaryStyle} onClick={handleBack}><ChevronLeft size={18} /> Back</button>
              <button style={{ ...buttonPrimaryStyle, opacity: !gender ? 0.5 : 1 }} onClick={handleNext} disabled={!gender}>Continue <ChevronRight size={18} /></button>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h1 style={titleStyle}>What matters <em style={italicSage}>most</em> to you?</h1>
            <p style={subtitleStyle}>Pick up to 3 areas your coach should focus on.</p>
            <p style={paragraphStyle}>You can change these anytime.<span style={{ color: '#6B9E7F', fontWeight: 600, marginLeft: '8px' }}>{priorities.length} of 3 selected</span></p>
            <div style={{ marginTop: '20px' }}>
              {WELLNESS_PRIORITIES.map(priority => {
                const selected = priorities.includes(priority.id);
                const disabled = !selected && priorities.length >= 3;
                return (
                  <div key={priority.id} style={priorityCardStyle(selected, disabled)} onClick={() => !disabled && togglePriority(priority.id)}>
                    <span>{priority.label}</span>
                    {selected && <Check size={16} strokeWidth={2.5} color="#6B9E7F" />}
                  </div>
                );
              })}
            </div>
            <div style={navButtonsStyle}>
              <button style={buttonSecondaryStyle} onClick={handleBack}><ChevronLeft size={18} /> Back</button>
              <button style={{ ...buttonPrimaryStyle, opacity: priorities.length === 0 ? 0.5 : 1 }} onClick={handleNext} disabled={priorities.length === 0}>Continue <ChevronRight size={18} /></button>
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <h1 style={titleStyle}>Anything you'd like your coach to know?</h1>
            <p style={subtitleStyle}>Optional — but helpful context.</p>
            <p style={paragraphStyle}>What's been on your mind lately, or what would you most like guidance on? Free-text — your coach will use this to tailor your first conversations.</p>
            <textarea value={concerns} onChange={(e) => setConcerns(e.target.value)} placeholder="e.g. Hair shedding more than usual, low energy in the afternoons, trouble winding down at night..." style={textareaStyle} />
            <div style={navButtonsStyle}>
              <button style={buttonSecondaryStyle} onClick={handleBack}><ChevronLeft size={18} /> Back</button>
              <button style={buttonPrimaryStyle} onClick={handleNext}>Continue <ChevronRight size={18} /></button>
            </div>
          </>
        )}

        {step === 6 && (
          <>
            <h1 style={titleStyle}>Sleep & energy.</h1>
            <p style={subtitleStyle}>The foundation of everything.</p>
            <p style={paragraphStyle}>Sleep and energy shape how you feel — physically, mentally, and emotionally — every day.</p>

            <div style={sliderContainerStyle}>
              <label style={labelStyle}>On average, how many hours of sleep are you getting?</label>
              <div style={sliderValueStyle}>{sleepHours}h</div>
              <input type="range" min="4" max="12" step="0.5" value={sleepHours} onChange={(e) => setSleepHours(parseFloat(e.target.value))} style={sliderStyle} />
              <div style={sliderLabelsStyle}><span>4h</span><span>12h</span></div>
              <div style={helperStyle}>Most adults feel best with 7–9 hours.</div>
            </div>

            <div style={sliderContainerStyle}>
              <label style={labelStyle}>How restful is your sleep, typically?</label>
              <div style={sliderValueStyle}>{sleepQualityLabel}</div>
              <input type="range" min="1" max="10" value={sleepQuality} onChange={(e) => setSleepQuality(parseInt(e.target.value))} style={sliderStyle} />
              <div style={sliderLabelsStyle}><span>Restless</span><span>Restful</span></div>
            </div>

            <div style={sliderContainerStyle}>
              <label style={labelStyle}>How's your energy on a typical day?</label>
              <div style={sliderValueStyle}>{energyLabel}</div>
              <input type="range" min="1" max="10" value={energy} onChange={(e) => setEnergy(parseInt(e.target.value))} style={sliderStyle} />
              <div style={sliderLabelsStyle}><span>Exhausted</span><span>Energised</span></div>
            </div>

            <div style={navButtonsStyle}>
              <button style={buttonSecondaryStyle} onClick={handleBack}><ChevronLeft size={18} /> Back</button>
              <button style={buttonPrimaryStyle} onClick={handleNext}>Continue <ChevronRight size={18} /></button>
            </div>
          </>
        )}

        {step === 7 && (
          <>
            <h1 style={titleStyle}>Stress.</h1>
            <p style={subtitleStyle}>How have things felt lately?</p>
            <p style={paragraphStyle}>Stress quietly shapes sleep, focus, energy, mood, and recovery — even when we don't notice it.</p>

            <div style={sliderContainerStyle}>
              <label style={labelStyle}>Current stress level</label>
              <div style={sliderValueStyle}>{stressLabel}</div>
              <input type="range" min="1" max="10" value={stress} onChange={(e) => setStress(parseInt(e.target.value))} style={sliderStyle} />
              <div style={sliderLabelsStyle}><span>Calm</span><span>Overwhelmed</span></div>
            </div>

            <div style={{ marginTop: '32px' }}>
              <label style={labelStyle}>What tends to trigger your stress? (optional)</label>
              <p style={{ ...helperStyle, marginBottom: '14px', marginTop: 0 }}>Select all that apply.</p>
              {STRESS_TRIGGERS.map(trigger => {
                const selected = stressTriggers.includes(trigger);
                return (
                  <div key={trigger} style={checkboxCardStyle(selected)} onClick={() => toggleTrigger(trigger)}>
                    <div style={{ width: '18px', height: '18px', border: selected ? 'none' : '1.5px solid #A89968', borderRadius: '4px', background: selected ? '#6B9E7F' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {selected && <Check size={12} strokeWidth={3} color="#FAF8F5" />}
                    </div>
                    {trigger}
                  </div>
                );
              })}
              <div style={{ marginTop: '12px' }}>
                <input type="text" value={stressOther} onChange={(e) => setStressOther(e.target.value)} placeholder="Other (optional)" style={inputStyle} />
              </div>
            </div>

            <div style={navButtonsStyle}>
              <button style={buttonSecondaryStyle} onClick={handleBack}><ChevronLeft size={18} /> Back</button>
              <button style={buttonPrimaryStyle} onClick={handleNext}>Continue <ChevronRight size={18} /></button>
            </div>
          </>
        )}

        {step === 8 && (
          <>
            <h1 style={titleStyle}>Your daily rhythm.</h1>
            <p style={subtitleStyle}>Small habits, big impact.</p>
            <p style={paragraphStyle}>Small daily habits shape your energy, focus, stress, and recovery — often more than we realise.</p>

            <div style={{ marginBottom: '32px' }}>
              <label style={labelStyle}>What best describes how you eat?</label>
              {EATING_STYLES.map(style => (
                <div key={style} style={radioCardStyle(eatingStyle === style)} onClick={() => setEatingStyle(style)}>{style}</div>
              ))}
            </div>

            <div style={sliderContainerStyle}>
              <label style={labelStyle}>How many days a week do you exercise?</label>
              <div style={sliderValueStyle}>{exerciseDays} days</div>
              <input type="range" min="0" max="7" value={exerciseDays} onChange={(e) => setExerciseDays(parseInt(e.target.value))} style={sliderStyle} />
              <div style={sliderLabelsStyle}><span>0</span><span>7</span></div>
              <div style={helperStyle}>Counts walking, dancing, gym, sports, yoga, swimming, cycling — anything that gets you moving.</div>
            </div>

            <div style={sliderContainerStyle}>
              <label style={labelStyle}>Roughly how much water do you drink daily?</label>
              <div style={sliderValueStyle}>{waterLitres}L</div>
              <input type="range" min="0" max="4" step="0.5" value={waterLitres} onChange={(e) => setWaterLitres(parseFloat(e.target.value))} style={sliderStyle} />
              <div style={sliderLabelsStyle}><span>0L</span><span>4L</span></div>
              <div style={helperStyle}>Most adults feel best with 2–3 litres a day.</div>
            </div>

            <div style={{ marginTop: '32px' }}>
              <label style={labelStyle}>Supplements you take (optional)</label>
              <p style={{ ...helperStyle, marginBottom: '14px', marginTop: 0 }}>Tap any that apply.</p>
              <div>
                {SUPPLEMENTS.map(sup => {
                  const selected = supplements.includes(sup);
                  return (
                    <span key={sup} style={supplementChipStyle(selected)} onClick={() => toggleSupplement(sup)}>
                      {selected && <Check size={12} strokeWidth={2.5} color="#6B9E7F" />}
                      {sup}
                    </span>
                  );
                })}
              </div>
            </div>

            <div style={navButtonsStyle}>
              <button style={buttonSecondaryStyle} onClick={handleBack}><ChevronLeft size={18} /> Back</button>
              <button style={{ ...buttonPrimaryStyle, opacity: !eatingStyle ? 0.5 : 1 }} onClick={handleNext} disabled={!eatingStyle}>Continue <ChevronRight size={18} /></button>
            </div>
          </>
        )}

        {step === 9 && (
          <>
            <h1 style={titleStyle}>Almost there.</h1>
            <p style={subtitleStyle}>A few final details.</p>
            <p style={paragraphStyle}>These are completely optional — they help GlowWise personalise your wellness insights more thoughtfully.</p>

            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Health considerations (optional)</label>
              <p style={{ ...helperStyle, marginBottom: '8px', marginTop: 0 }}>Anything GlowWise should be aware of? E.g. PCOS, IBS, thyroid issues, anxiety, hormonal changes.</p>
              <textarea value={healthConsiderations} onChange={(e) => setHealthConsiderations(e.target.value)} placeholder="Optional" style={{ ...textareaStyle, minHeight: '70px' }} />
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={labelStyle}>Current medications or treatments (optional)</label>
              <p style={{ ...helperStyle, marginBottom: '8px', marginTop: 0 }}>E.g. birth control, thyroid medication, antidepressants.</p>
              <textarea value={medications} onChange={(e) => setMedications(e.target.value)} placeholder="Optional" style={{ ...textareaStyle, minHeight: '70px' }} />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>How would you like GlowWise to support you?</label>
              <div style={radioCardStyle(reminders === 'daily')} onClick={() => setReminders('daily')}>
                <strong style={{ display: 'block', marginBottom: '4px', fontSize: '15px' }}>Daily check-ins</strong>
                <span style={{ fontSize: '13px', color: '#5A6770' }}>A gentle wellness nudge each morning</span>
              </div>
              <div style={radioCardStyle(reminders === 'weekly')} onClick={() => setReminders('weekly')}>
                <strong style={{ display: 'block', marginBottom: '4px', fontSize: '15px' }}>Weekly reflections</strong>
                <span style={{ fontSize: '13px', color: '#5A6770' }}>A summary of your patterns every Sunday</span>
              </div>
              <div style={radioCardStyle(reminders === 'none')} onClick={() => setReminders('none')}>
                <strong style={{ display: 'block', marginBottom: '4px', fontSize: '15px' }}>No reminders</strong>
                <span style={{ fontSize: '13px', color: '#5A6770' }}>I'll check in when I need support</span>
              </div>
            </div>

            <div style={{ background: '#EDF4EF', borderLeft: '3px solid #6B9E7F', padding: '16px 20px', borderRadius: '6px 12px 12px 6px', marginTop: '32px', marginBottom: '8px' }}>
              <p style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontSize: '15px', color: '#3D4A52', lineHeight: 1.5, margin: 0 }}>GlowWise will now create your personalised wellness profile, along with your first insights and gentle recommendations to help you get started.</p>
            </div>

            <div style={navButtonsStyle}>
              <button style={buttonSecondaryStyle} onClick={handleBack} disabled={loading}><ChevronLeft size={18} /> Back</button>
              <button style={{ ...buttonPrimaryStyle, opacity: loading ? 0.6 : 1 }} onClick={handleComplete} disabled={loading}>{loading ? 'Building your profile...' : 'Build my profile'} <ChevronRight size={18} /></button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default Onboarding;
