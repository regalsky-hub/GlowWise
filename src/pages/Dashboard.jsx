import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserData } from '../context/UserDataContext';
import { MessageCircle, Calendar, Zap, LogOut, Settings, Heart, TrendingUp, Check } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { profile, glowScore, glowType, getTodayCheckIn } = useUserData();
  const [todayCheckIn, setTodayCheckIn] = useState(null);
  const [todayActions, setTodayActions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setTodayCheckIn(getTodayCheckIn());
  }, []);

  useEffect(() => {
    // Generate today's actions based on profile and latest check-in
    const actions = generateTodayActions();
    setTodayActions(actions);
  }, [profile, todayCheckIn]);

  const generateTodayActions = () => {
    const actions = [];
    
    if (todayCheckIn) {
      if (todayCheckIn.sleep_hours < 7) {
        actions.push({
          title: 'Improve Sleep Tonight',
          description: 'You\'re getting less than optimal sleep. Try going to bed 30 minutes earlier.',
          icon: '😴',
          category: 'sleep',
        });
      }
      
      if (todayCheckIn.stress_level > 7) {
        actions.push({
          title: '5-Minute Stress Relief',
          description: 'Your stress is elevated. Try a quick breathing exercise or walk.',
          icon: '🧘',
          category: 'stress',
        });
      }

      if (todayCheckIn.energy < 5) {
        actions.push({
          title: 'Boost Energy',
          description: 'Consider hydration, protein-rich snack, or short movement break.',
          icon: '⚡',
          category: 'energy',
        });
      }
    }

    // Default action if no check-in yet
    if (actions.length === 0) {
      actions.push({
        title: 'Complete Today\'s Check-In',
        description: 'Quick daily wellness snapshot (2 minutes)',
        icon: '✓',
        category: 'checkin',
      });
    }

    return actions.slice(0, 3);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const getGlowScoreColor = (score) => {
    if (score >= 75) return 'text-glow-success';
    if (score >= 50) return 'text-glow-sage';
    return 'text-glow-warning';
  };

  return (
    <div className="min-h-screen bg-glow-cream">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-glow-sage-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-glow-sage flex items-center justify-center">
              <span className="text-lg">✨</span>
            </div>
            <h1 className="font-poppins font-700 text-glow-slate">GlowWise</h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-inter text-sm text-glow-charcoal">
              {user?.email}
            </span>
            <button
              onClick={() => navigate('/settings')}
              className="p-2 hover:bg-glow-sage-light rounded-card transition"
              title="Settings"
            >
              <Settings className="w-5 h-5 text-glow-sage" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-red-50 rounded-card transition"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-glow-error" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Glow Score & Type */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Glow Score */}
          <div className="bg-gradient-to-br from-glow-sage to-glow-sage-light rounded-lg shadow-card p-8 text-white">
            <p className="font-inter text-sm text-white text-opacity-80 mb-2">Your Glow Score</p>
            <div className="flex items-end gap-4 mb-4">
              <div className={`text-6xl font-poppins font-700 ${getGlowScoreColor(glowScore)} text-glow-sage`}>
                {glowScore}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1 mb-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-inter text-sm">
                    {glowScore > 50 ? '+3 today' : '-2 today'}
                  </span>
                </div>
              </div>
            </div>
            <p className="font-inter text-sm text-white text-opacity-80">
              Based on sleep, energy, stress, and consistency
            </p>
          </div>

          {/* Glow Type */}
          <div className="bg-white rounded-lg shadow-card p-8 border border-glow-sage-light">
            <p className="font-inter text-sm text-glow-charcoal mb-2">Your Glow Type</p>
            <h3 className="font-poppins font-700 text-h3 text-glow-slate mb-3">
              {glowType || 'Balanced Wellness Glow'}
            </h3>
            <p className="font-inter text-sm text-glow-charcoal mb-4">
              Based on your wellness priorities and current state, this is where your body needs the most support.
            </p>
            <button className="text-glow-sage font-inter font-600 text-sm hover:underline">
              Learn more about your type →
            </button>
          </div>
        </div>

        {/* Today's Focus Section */}
        <div className="bg-white rounded-lg shadow-card p-8 border border-glow-sage-light">
          <h2 className="font-poppins font-700 text-h3 text-glow-slate mb-6">Today's Focus</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {todayActions.map((action, i) => (
              <div
                key={i}
                className="bg-glow-cream rounded-card p-6 border border-glow-sage-light hover:shadow-card transition group cursor-pointer"
                onClick={() => {
                  if (action.category === 'checkin') navigate('/checkin');
                  else if (action.category === 'stress') navigate('/ai-coach');
                }}
              >
                <div className="text-3xl mb-3">{action.icon}</div>
                <h3 className="font-poppins font-600 text-glow-slate mb-2">{action.title}</h3>
                <p className="font-inter text-sm text-glow-charcoal">{action.description}</p>
                <div className="mt-4 flex items-center gap-2 text-glow-sage font-inter font-500 text-sm">
                  Get started <span className="group-hover:translate-x-1 transition">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          {todayCheckIn ? (
            <>
              <div className="bg-white rounded-card p-4 border border-glow-sage-light">
                <p className="font-inter text-xs text-glow-charcoal mb-2">Energy</p>
                <p className="font-poppins font-700 text-2xl text-glow-sage">{todayCheckIn.energy}/10</p>
              </div>
              <div className="bg-white rounded-card p-4 border border-glow-sage-light">
                <p className="font-inter text-xs text-glow-charcoal mb-2">Sleep</p>
                <p className="font-poppins font-700 text-2xl text-glow-sage">{todayCheckIn.sleep_hours}h</p>
              </div>
              <div className="bg-white rounded-card p-4 border border-glow-sage-light">
                <p className="font-inter text-xs text-glow-charcoal mb-2">Stress</p>
                <p className="font-poppins font-700 text-2xl text-glow-sage">{todayCheckIn.stress_level}/10</p>
              </div>
              <div className="bg-white rounded-card p-4 border border-glow-sage-light">
                <p className="font-inter text-xs text-glow-charcoal mb-2">Mood</p>
                <p className="font-poppins font-700 text-2xl text-glow-sage">{todayCheckIn.mood || 7}/10</p>
              </div>
            </>
          ) : (
            <div className="md:col-span-4 bg-glow-sage-light rounded-card p-6 border border-glow-sage text-center">
              <p className="font-inter text-glow-slate">
                Complete your first daily check-in to see your wellness snapshot
              </p>
              <button
                onClick={() => navigate('/checkin')}
                className="mt-3 px-6 py-2 bg-glow-sage text-white rounded-card font-inter font-500 hover:bg-opacity-90 transition"
              >
                Start Check-In
              </button>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/ai-coach')}
            className="bg-white border-2 border-glow-sage rounded-lg p-6 hover:shadow-card transition text-left group"
          >
            <div className="flex items-center justify-between mb-2">
              <MessageCircle className="w-6 h-6 text-glow-sage" />
              <span className="text-sm text-glow-sage group-hover:translate-x-1 transition">→</span>
            </div>
            <h3 className="font-poppins font-700 text-glow-slate mb-1">AI Coach</h3>
            <p className="font-inter text-sm text-glow-charcoal">
              Ask your personalized wellness companion
            </p>
          </button>

          <button
            onClick={() => navigate('/insights')}
            className="bg-white border-2 border-glow-sage rounded-lg p-6 hover:shadow-card transition text-left group"
          >
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-6 h-6 text-glow-sage" />
              <span className="text-sm text-glow-sage group-hover:translate-x-1 transition">→</span>
            </div>
            <h3 className="font-poppins font-700 text-glow-slate mb-1">Insights</h3>
            <p className="font-inter text-sm text-glow-charcoal">
              Discover patterns in your wellness
            </p>
          </button>
        </div>

        {/* Wellness Priorities */}
        {profile?.wellness_priorities?.length > 0 && (
          <div className="bg-white rounded-lg shadow-card p-6 border border-glow-sage-light">
            <h3 className="font-poppins font-700 text-glow-slate mb-4">Your Wellness Priorities</h3>
            <div className="flex flex-wrap gap-2">
              {profile.wellness_priorities.map((priority, i) => (
                <span
                  key={i}
                  className="px-4 py-2 bg-glow-sage-light border border-glow-sage text-glow-slate rounded-full font-inter font-500 text-sm"
                >
                  {priority}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-glow-sage-light md:hidden">
        <div className="grid grid-cols-5 gap-2 p-2">
          {[
            { icon: Heart, label: 'Home', path: '/dashboard', active: true },
            { icon: Calendar, label: 'Check-in', path: '/checkin' },
            { icon: MessageCircle, label: 'Coach', path: '/ai-coach' },
            { icon: TrendingUp, label: 'Insights', path: '/insights' },
            { icon: Settings, label: 'Settings', path: '/settings' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={i}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 p-2 rounded-card transition ${
                  item.active ? 'text-glow-sage' : 'text-glow-charcoal hover:text-glow-sage'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-inter text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile spacing for bottom nav */}
      <div className="h-24 md:h-0" />
    </div>
  );
}
