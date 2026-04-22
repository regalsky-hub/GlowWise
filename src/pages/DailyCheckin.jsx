import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../context/UserDataContext';
import { ChevronLeft, Check } from 'lucide-react';

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
        energy,
        sleep_hours: sleepHours,
        stress_level: stressLevel,
        mood,
        symptoms: symptoms ? symptoms.split(',').map(s => s.trim()) : [],
        supplement_taken: supplementTaken,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError('Failed to save check-in: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-glow-cream to-glow-sage-light pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-glow-sage-light">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-glow-sage-light rounded-card transition"
          >
            <ChevronLeft className="w-5 h-5 text-glow-slate" />
          </button>
          <h1 className="font-poppins font-700 text-glow-slate">Daily Check-In</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-card p-8 space-y-8">
          {success && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-white rounded-lg p-8 text-center space-y-4 max-w-sm">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-glow-success flex items-center justify-center">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h2 className="font-poppins font-700 text-glow-slate text-lg">Check-In Complete!</h2>
                <p className="font-inter text-glow-charcoal">
                  You're building great awareness of your wellness patterns.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-glow-error rounded-card">
              <p className="font-inter text-sm text-glow-error">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Energy Level */}
            <div className="space-y-3">
              <label className="block">
                <span className="font-poppins font-600 text-glow-slate block mb-2">
                  How's your energy? ⚡
                </span>
                <div className="flex gap-2 justify-center mb-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setEnergy(i)}
                      className={`w-10 h-10 rounded-full font-inter font-600 transition ${
                        energy === i
                          ? 'bg-glow-sage text-white shadow-card'
                          : 'bg-glow-sage-light text-glow-sage hover:bg-opacity-70'
                      }`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </label>
              <div className="flex gap-8 text-center text-xs text-glow-charcoal">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
            </div>

            {/* Sleep Hours */}
            <div className="space-y-3">
              <label className="block">
                <span className="font-poppins font-600 text-glow-slate mb-3 block">
                  Hours of sleep last night 😴
                </span>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="3"
                    max="12"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(Number(e.target.value))}
                    className="flex-1 h-2 bg-glow-sage-light rounded-full appearance-none cursor-pointer"
                  />
                  <span className="font-poppins font-700 text-glow-sage text-lg min-w-fit">
                    {sleepHours}h
                  </span>
                </div>
              </label>
              <p className="font-inter text-xs text-glow-charcoal">
                Optimal is 7-9 hours for most people
              </p>
            </div>

            {/* Stress Level */}
            <div className="space-y-3">
              <label className="block">
                <span className="font-poppins font-600 text-glow-slate block mb-2">
                  Stress level 🧘
                </span>
                <div className="flex gap-2 justify-center mb-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setStressLevel(i)}
                      className={`w-10 h-10 rounded-full font-inter font-600 transition ${
                        stressLevel === i
                          ? 'bg-glow-sage text-white shadow-card'
                          : 'bg-glow-sage-light text-glow-sage hover:bg-opacity-70'
                      }`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </label>
              <div className="flex gap-8 text-center text-xs text-glow-charcoal">
                <span>Calm</span>
                <span>Moderate</span>
                <span>High</span>
              </div>
            </div>

            {/* Mood */}
            <div className="space-y-3">
              <label className="block">
                <span className="font-poppins font-600 text-glow-slate block mb-2">
                  Overall mood 😊
                </span>
                <div className="flex gap-2 justify-center mb-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setMood(i)}
                      className={`w-10 h-10 rounded-full font-inter font-600 transition ${
                        mood === i
                          ? 'bg-glow-sage text-white shadow-card'
                          : 'bg-glow-sage-light text-glow-sage hover:bg-opacity-70'
                      }`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </label>
              <div className="flex gap-8 text-center text-xs text-glow-charcoal">
                <span>Poor</span>
                <span>OK</span>
                <span>Great</span>
              </div>
            </div>

            {/* Symptoms */}
            <div className="space-y-3">
              <label className="block">
                <span className="font-poppins font-600 text-glow-slate mb-2 block">
                  Any symptoms today? (optional) 🔍
                </span>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g., Headache, bloating, fatigue, skin breakouts..."
                  className="w-full h-20 font-inter text-body border border-glow-sage-light rounded-card p-3 focus:border-glow-sage focus:outline-none resize-none"
                />
              </label>
            </div>

            {/* Supplement */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={supplementTaken}
                  onChange={(e) => setSupplementTaken(e.target.checked)}
                  className="w-5 h-5 rounded border-glow-sage-light accent-glow-sage"
                />
                <span className="font-poppins font-600 text-glow-slate">
                  Took supplements today 💊
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-glow-sage text-white rounded-card font-inter font-600 hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 mt-8"
            >
              {loading ? 'Saving...' : 'Save Check-In'}
              {!loading && <Check className="w-4 h-4" />}
            </button>
          </form>

          <p className="text-center font-inter text-xs text-glow-charcoal">
            Takes about 2 minutes · Your data is private and encrypted
          </p>
        </div>
      </div>
    </div>
  );
}
