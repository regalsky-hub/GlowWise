import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../context/UserDataContext';
import { ChevronRight, ChevronLeft, CheckCircle, AlertCircle, Camera } from 'lucide-react';

const WELLNESS_TOPICS = [
  'Hormones & Cycle',
  'Fertility & Conception',
  'Hair & Scalp Health',
  'Skin & Acne',
  'Brain & Focus',
  'Sleep & Rest',
  'Stress & Anxiety',
  'Energy & Fatigue',
  'Gut & Digestion',
  'Nutrition & Food',
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    wellness_priorities: [],
    body_signals: '',
    sleep_hours: 7,
    energy_level: 7,
    stress_level: 5,
    stress_triggers: '',
    diet_type: 'Balanced',
    supplements: '',
    exercise_per_week: 3,
    water_intake: 2,
    health_context: '',
    medications: '',
    notification_frequency: 'daily',
    photo_uploaded: false,
  });
  const [error, setError] = useState('');
  const { updateProfile, addCheckIn } = useUserData();
  const navigate = useNavigate();

  const steps = [
    { title: 'Welcome', icon: '👋' },
    { title: 'Wellness Priorities', icon: '⭐' },
    { title: 'Body Signals', icon: '🔍' },
    { title: 'Sleep & Energy', icon: '😴' },
    { title: 'Stress & Mood', icon: '🧘' },
    { title: 'Nutrition', icon: '🥗' },
    { title: 'Lifestyle', icon: '🏃' },
    { title: 'Health Context', icon: '📋' },
    { title: 'Get Started', icon: '🚀' },
  ];

  const toggleWellnessPriority = (priority) => {
    setData(prev => {
      const priorities = prev.wellness_priorities.includes(priority)
        ? prev.wellness_priorities.filter(p => p !== priority)
        : [...prev.wellness_priorities, priority].slice(0, 3);
      return { ...prev, wellness_priorities: priorities };
    });
  };

  const handleNext = () => {
    console.log("CLICKED NEXT/START, step =", step);

    setError('');

    if (step === 1 && data.wellness_priorities.length === 0) {
      setError('Please select at least one wellness priority');
      return;
    }

    if (step < steps.length - 1) {
      console.log("Going to next step");
      setStep(step + 1);
    } else {
      console.log("FINAL STEP → running onboarding");
      completeOnboarding();
    }
  };

  const completeOnboarding = async () => {
    try {
      console.log("STARTING ONBOARDING SAVE");

      const glowType = determineGlowType(data);

      console.log("Glow Type:", glowType);

      // Save profile
      await updateProfile({
        ...data,
        glowType,
        onboarding_completed: true,
        onboarding_completed_at: new Date(),
      });

      console.log("Profile saved");

      // Save check-in
      await addCheckIn({
        energy: data.energy_level,
        sleep_hours: data.sleep_hours,
        stress_level: data.stress_level,
        mood: 7,
        symptoms: data.body_signals ? [data.body_signals] : [],
        supplement_taken: false,
      });

      console.log("Check-in saved");

      // THEN navigate
      navigate('/dashboard');

    } catch (error) {
      console.error("ONBOARDING ERROR:", error);

      // IMPORTANT: still allow navigation so user is not stuck
      navigate('/dashboard');
    }
  };

  const determineGlowType = (formData) => {
    const priorities = formData.wellness_priorities.join(" ").toLowerCase();
    const stress = formData.stress_level;
    const sleep = formData.sleep_hours;

    if (stress > 7) return 'Stress-Driven Glow';
    if (sleep < 6) return 'Low Energy Recovery Glow';
    if (priorities.includes('hormones') || priorities.includes('cycle')) return 'Hormonal Balance Glow';
    if (priorities.includes('hair')) return 'Hair Health Focus';
    if (priorities.includes('skin')) return 'Skin Clarity Glow';
    if (priorities.includes('gut')) return 'Gut Health Reset Glow';
    
    return 'Balanced Wellness Glow';
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Photo must be less than 10MB');
        return;
      }
      setData(prev => ({ ...prev, photo_uploaded: true }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-glow-cream to-glow-sage-light">
      {/* Progress Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-glow-sage-light">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-poppins font-600 text-glow-slate">Welcome to GlowWise</h1>
            <span className="font-inter text-sm text-glow-charcoal">{step + 1} of {steps.length}</span>
          </div>
          <div className="w-full h-1 bg-glow-sage-light rounded-full overflow-hidden">
            <div
              className="h-full bg-glow-sage transition-all duration-300"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-card p-8 mb-6">
          {/* Step 0: Welcome */}
          {step === 0 && (
            <div className="space-y-6 animate-slideUp">
              <div className="text-center space-y-3">
                <div className="text-5xl mb-3">👋</div>
                <h2 className="font-poppins font-700 text-h2 text-glow-slate">Welcome to GlowWise</h2>
                <p className="font-inter text-glow-charcoal">
                  Let's set up your wellness profile so we can personalize your experience
                </p>
              </div>

              {/* Critical Disclaimer */}
              <div className="bg-glow-sage-light border-l-4 border-glow-sage rounded p-4 space-y-3">
                <div className="flex gap-3 items-start">
                  <AlertCircle className="w-5 h-5 text-glow-sage flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-poppins font-600 text-glow-slate text-sm mb-1">Important: Non-Medical Guidance</h3>
                    <p className="font-inter text-sm text-glow-charcoal leading-relaxed">
                      GlowWise provides wellness guidance based on your self-reported data. 
                      It is NOT a substitute for professional medical advice, diagnosis, or treatment.
                    </p>
                    <p className="font-inter text-sm text-glow-charcoal leading-relaxed mt-2">
                      Always consult a qualified healthcare provider for medical concerns. 
                      GlowWise does not diagnose, treat, cure, or prevent any disease.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-glow-blue-soft bg-opacity-30 border border-glow-blue-soft rounded-card p-4">
                <p className="font-inter text-sm text-glow-slate">
                  <strong>Your Privacy:</strong> Your health data is encrypted and private. You can delete messages, photos, and your account anytime.
                </p>
              </div>
            </div>
          )}

          {/* Step 1: Wellness Priorities */}
          {step === 1 && (
            <div className="space-y-6 animate-slideUp">
              <div className="space-y-2">
                <h2 className="font-poppins font-700 text-h3 text-glow-slate">What wellness topics matter to you?</h2>
                <p className="font-inter text-glow-charcoal">
                  Select up to 3 areas. You can change these anytime.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {WELLNESS_TOPICS.map(topic => (
                  <button
                    key={topic}
                    onClick={() => toggleWellnessPriority(topic)}
                    className={`p-3 rounded-card border-2 font-inter font-500 text-sm transition ${
                      data.wellness_priorities.includes(topic)
                        ? 'border-glow-sage bg-glow-sage-light text-glow-sage'
                        : 'border-glow-sage-light text-glow-slate hover:border-glow-sage'
                    }`}
                  >
                    {data.wellness_priorities.includes(topic) && <CheckCircle className="w-4 h-4 inline mr-1" />}
                    {topic}
                  </button>
                ))}
              </div>

              {error && (
                <div className="flex gap-2 items-start p-3 bg-red-50 border border-glow-error rounded-card">
                  <AlertCircle className="w-4 h-4 text-glow-error flex-shrink-0 mt-0.5" />
                  <p className="font-inter text-sm text-glow-error">{error}</p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Body Signals */}
          {step === 2 && (
            <div className="space-y-6 animate-slideUp">
              <div className="space-y-2">
                <h2 className="font-poppins font-700 text-h3 text-glow-slate">Describe your current state</h2>
                <p className="font-inter text-glow-charcoal">
                  What symptoms or concerns are you experiencing right now?
                </p>
              </div>

              <textarea
                value={data.body_signals}
                onChange={(e) => setData(prev => ({ ...prev, body_signals: e.target.value }))}
                placeholder="e.g., Fatigue, brain fog, irregular periods, skin breakouts..."
                className="w-full h-32 font-inter text-body border border-glow-sage-light rounded-card p-4 focus:border-glow-sage focus:outline-none resize-none"
              />

              <p className="font-inter text-xs text-glow-charcoal">
                This helps us personalize your AI Coach's guidance
              </p>
            </div>
          )}

          {/* Step 3: Sleep & Energy */}
          {step === 3 && (
            <div className="space-y-6 animate-slideUp">
              <div className="space-y-2">
                <h2 className="font-poppins font-700 text-h3 text-glow-slate">Sleep & Energy</h2>
                <p className="font-inter text-glow-charcoal">
                  These are foundational for wellness
                </p>
              </div>

              <div>
                <label className="block font-inter font-500 text-glow-slate mb-2">
                  Sleep per night: <span className="text-glow-sage font-700">{data.sleep_hours}h</span>
                </label>
                <input
                  type="range"
                  min="3"
                  max="12"
                  value={data.sleep_hours}
                  onChange={(e) => setData(prev => ({ ...prev, sleep_hours: Number(e.target.value) }))}
                  className="w-full"
                />
                <p className="font-inter text-xs text-glow-charcoal mt-1">Optimal is 7-9 hours</p>
              </div>

              <div>
                <label className="block font-inter font-500 text-glow-slate mb-2">
                  Energy level: <span className="text-glow-sage font-700">{data.energy_level}/10</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={data.energy_level}
                  onChange={(e) => setData(prev => ({ ...prev, energy_level: Number(e.target.value) }))}
                  className="w-full"
                />
              </div>
            </div>
          )}

          {/* Step 4: Stress & Mood */}
          {step === 4 && (
            <div className="space-y-6 animate-slideUp">
              <div className="space-y-2">
                <h2 className="font-poppins font-700 text-h3 text-glow-slate">Stress & Mood</h2>
                <p className="font-inter text-glow-charcoal">
                  These deeply affect your wellness
                </p>
              </div>

              <div>
                <label className="block font-inter font-500 text-glow-slate mb-2">
                  Current stress level: <span className="text-glow-sage font-700">{data.stress_level}/10</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={data.stress_level}
                  onChange={(e) => setData(prev => ({ ...prev, stress_level: Number(e.target.value) }))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block font-inter font-500 text-glow-slate mb-2">
                  What triggers your stress? (optional)
                </label>
                <textarea
                  value={data.stress_triggers}
                  onChange={(e) => setData(prev => ({ ...prev, stress_triggers: e.target.value }))}
                  placeholder="e.g., Work deadlines, relationship issues, health anxiety..."
                  className="w-full h-24 font-inter text-body border border-glow-sage-light rounded-card p-3 focus:border-glow-sage focus:outline-none resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 5: Nutrition */}
          {step === 5 && (
            <div className="space-y-6 animate-slideUp">
              <div className="space-y-2">
                <h2 className="font-poppins font-700 text-h3 text-glow-slate">Nutrition</h2>
                <p className="font-inter text-glow-charcoal">
                  What's your eating style?
                </p>
              </div>

              <div>
                <label className="block font-inter font-500 text-glow-slate mb-3">Diet Type</label>
                <div className="space-y-2">
                  {['Balanced', 'Plant-Based', 'Keto', 'Paleo', 'Mediterranean', 'Other'].map(diet => (
                    <button
                      key={diet}
                      onClick={() => setData(prev => ({ ...prev, diet_type: diet }))}
                      className={`w-full p-3 rounded-card border-2 font-inter font-500 text-left transition ${
                        data.diet_type === diet
                          ? 'border-glow-sage bg-glow-sage-light text-glow-sage'
                          : 'border-glow-sage-light text-glow-slate hover:border-glow-sage'
                      }`}
                    >
                      {diet}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-inter font-500 text-glow-slate mb-2">
                  Supplements you're taking (optional)
                </label>
                <textarea
                  value={data.supplements}
                  onChange={(e) => setData(prev => ({ ...prev, supplements: e.target.value }))}
                  placeholder="e.g., Vitamin D, Iron, Multivitamin, Probiotics..."
                  className="w-full h-24 font-inter text-body border border-glow-sage-light rounded-card p-3 focus:border-glow-sage focus:outline-none resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 6: Lifestyle */}
          {step === 6 && (
            <div className="space-y-6 animate-slideUp">
              <div className="space-y-2">
                <h2 className="font-poppins font-700 text-h3 text-glow-slate">Lifestyle Habits</h2>
                <p className="font-inter text-glow-charcoal">
                  Movement and hydration matter
                </p>
              </div>

              <div>
                <label className="block font-inter font-500 text-glow-slate mb-2">
                  Exercise per week: <span className="text-glow-sage font-700">{data.exercise_per_week} days</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="7"
                  value={data.exercise_per_week}
                  onChange={(e) => setData(prev => ({ ...prev, exercise_per_week: Number(e.target.value) }))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block font-inter font-500 text-glow-slate mb-2">
                  Water per day: <span className="text-glow-sage font-700">{data.water_intake}L</span>
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="4"
                  step="0.5"
                  value={data.water_intake}
                  onChange={(e) => setData(prev => ({ ...prev, water_intake: Number(e.target.value) }))}
                  className="w-full"
                />
                <p className="font-inter text-xs text-glow-charcoal mt-1">Most people need 2-3L daily</p>
              </div>
            </div>
          )}

          {/* Step 7: Health Context */}
          {step === 7 && (
            <div className="space-y-6 animate-slideUp">
              <div className="space-y-2">
                <h2 className="font-poppins font-700 text-h3 text-glow-slate">Health Context</h2>
                <p className="font-inter text-glow-charcoal">
                  Help us understand your medical background (optional)
                </p>
              </div>

              <div>
                <label className="block font-inter font-500 text-glow-slate mb-2">
                  Any diagnoses or conditions? (optional)
                </label>
                <textarea
                  value={data.health_context}
                  onChange={(e) => setData(prev => ({ ...prev, health_context: e.target.value }))}
                  placeholder="e.g., PCOS, Thyroid issues, Anxiety, Autoimmune..."
                  className="w-full h-20 font-inter text-body border border-glow-sage-light rounded-card p-3 focus:border-glow-sage focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block font-inter font-500 text-glow-slate mb-2">
                  Current medications? (optional)
                </label>
                <textarea
                  value={data.medications}
                  onChange={(e) => setData(prev => ({ ...prev, medications: e.target.value }))}
                  placeholder="e.g., Birth control, Thyroid medication..."
                  className="w-full h-20 font-inter text-body border border-glow-sage-light rounded-card p-3 focus:border-glow-sage focus:outline-none resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 8: Get Started */}
          {step === 8 && (
            <div className="space-y-6 animate-slideUp">
              <div className="space-y-2">
                <h2 className="font-poppins font-700 text-h3 text-glow-slate">Almost There!</h2>
                <p className="font-inter text-glow-charcoal">
                  One more step before we calculate your Glow Type
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block font-inter font-500 text-glow-slate mb-2">
                    Notification Frequency
                  </label>
                  <div className="space-y-2">
                    {['daily', 'weekly', 'never'].map(freq => (
                      <button
                        key={freq}
                        onClick={() => setData(prev => ({ ...prev, notification_frequency: freq }))}
                        className={`w-full p-3 rounded-card border-2 font-inter font-500 text-left transition capitalize ${
                          data.notification_frequency === freq
                            ? 'border-glow-sage bg-glow-sage-light text-glow-sage'
                            : 'border-glow-sage-light text-glow-slate hover:border-glow-sage'
                        }`}
                      >
                        {freq === 'daily' && '📬 Daily check-in reminders'}
                        {freq === 'weekly' && '📅 Weekly wellness summary'}
                        {freq === 'never' && '🔕 No notifications'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-inter font-500 text-glow-slate mb-2">
                    Upload a baseline photo (optional)
                  </label>
                  <label className="flex items-center gap-2 p-4 border-2 border-dashed border-glow-sage-light rounded-card cursor-pointer hover:border-glow-sage transition">
                    <Camera className="w-5 h-5 text-glow-sage" />
                    <span className="font-inter font-500 text-glow-slate">
                      {data.photo_uploaded ? 'Photo selected ✓' : 'Select a photo'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="bg-glow-sage-light border border-glow-sage border-opacity-30 rounded-card p-4">
                <p className="font-inter text-sm text-glow-slate">
                  Your wellness data is encrypted and private. You can delete your account anytime.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3 justify-between" onClick={(e) => console.log('DIV CLICKED', e)}>
          <button
            onClick={() => {
              console.log('BACK BUTTON CLICKED');
              setStep(Math.max(0, step - 1));
            }}
            disabled={step === 0}
            className="flex items-center gap-2 px-4 py-2 border-2 border-glow-sage text-glow-sage rounded-card font-inter font-500 hover:bg-glow-sage-light disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <button
            type="button"
            onClick={() => {
              console.log('START/NEXT BUTTON CLICKED - step:', step, 'stepsLength:', steps.length);
              handleNext();
            }}
            className="flex items-center gap-2 px-6 py-2 bg-glow-sage text-white rounded-card font-inter font-600 hover:bg-opacity-90 transition ml-auto cursor-pointer"
          >
            {step === steps.length - 1 ? 'Start' : 'Next'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
