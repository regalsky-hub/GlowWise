import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../context/UserDataContext';
import { ChevronLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Insights() {
  const { checkIns } = useUserData();
  const [chartData, setChartData] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [trends, setTrends] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (checkIns.length > 0) {
      processCheckIns();
    }
  }, [checkIns]);

  const processCheckIns = () => {
    // Sort by date
    const sorted = [...checkIns].sort((a, b) => {
      return new Date(a.date || a.created_at) - new Date(b.date || b.created_at);
    }).slice(-14); // Last 14 days

    // Format for chart
    const formatted = sorted.map(checkin => ({
      date: new Date(checkin.date || checkin.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      energy: checkin.energy || 0,
      sleep: checkin.sleep_hours || 0,
      stress: checkin.stress_level || 0,
      mood: checkin.mood || 0,
    }));

    setChartData(formatted);

    // Detect patterns
    detectPatterns(sorted);
    calculateTrends(sorted);
  };

  const detectPatterns = (checkInData) => {
    const patterns = [];

    if (checkInData.length >= 3) {
      // Sleep vs Energy correlation
      const avgSleep = checkInData.reduce((sum, c) => sum + (c.sleep_hours || 0), 0) / checkInData.length;
      const avgEnergy = checkInData.reduce((sum, c) => sum + (c.energy || 0), 0) / checkInData.length;

      if (avgSleep < 7 && avgEnergy < 6) {
        patterns.push({
          icon: '😴',
          title: 'Sleep & Energy Connection',
          description: `Your energy is ${avgEnergy.toFixed(1)}/10, but you're averaging only ${avgSleep.toFixed(1)}h of sleep. Try increasing sleep by 30 minutes—this could boost energy by 1-2 points.`,
          severity: 'high',
        });
      }

      // Stress vs Sleep
      const avgStress = checkInData.reduce((sum, c) => sum + (c.stress_level || 0), 0) / checkInData.length;
      if (avgStress > 7 && avgSleep < 8) {
        patterns.push({
          icon: '🧘',
          title: 'Stress Affecting Sleep',
          description: `High stress (${avgStress.toFixed(1)}/10) often disrupts sleep quality. A 5-minute breathing exercise before bed could help.`,
          severity: 'medium',
        });
      }

      // Energy improvements
      if (checkInData.length >= 7) {
        const last7 = checkInData.slice(-7);
        const first7 = checkInData.slice(0, 7);
        const lastAvgEnergy = last7.reduce((sum, c) => sum + (c.energy || 0), 0) / 7;
        const firstAvgEnergy = first7.reduce((sum, c) => sum + (c.energy || 0), 0) / 7;
        
        if (lastAvgEnergy > firstAvgEnergy + 0.5) {
          patterns.push({
            icon: '⚡',
            title: 'Energy Improving!',
            description: `Your energy has improved by ${(lastAvgEnergy - firstAvgEnergy).toFixed(1)} points this week. Keep maintaining your current habits!`,
            severity: 'positive',
          });
        }
      }
    }

    // Default pattern
    if (patterns.length === 0) {
      patterns.push({
        icon: '📊',
        title: 'More Data Needed',
        description: 'Complete more check-ins (at least 3-5 over a few days) to unlock pattern insights.',
        severity: 'neutral',
      });
    }

    setPatterns(patterns);
  };

  const calculateTrends = (checkInData) => {
    if (checkInData.length < 2) return;

    const recent = checkInData.slice(-7);
    const earlier = checkInData.slice(0, checkInData.length - 7).slice(-7);

    const getTrend = (key) => {
      if (earlier.length === 0) return 0;
      const recentAvg = recent.reduce((sum, c) => sum + (c[key] || 0), 0) / recent.length;
      const earlierAvg = earlier.reduce((sum, c) => sum + (c[key] || 0), 0) / earlier.length;
      return ((recentAvg - earlierAvg) / earlierAvg) * 100;
    };

    setTrends({
      energy: getTrend('energy'),
      sleep: getTrend('sleep_hours'),
      stress: getTrend('stress_level'),
      mood: getTrend('mood'),
    });
  };

  const Metric = ({ label, trend, icon }) => {
    const isPositive = (trend > 0 && label !== 'stress') || (trend < 0 && label === 'stress');
    const trendColor = isPositive ? 'text-glow-success' : 'text-glow-error';

    return (
      <div className="bg-white rounded-card p-4 border border-glow-sage-light">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-inter text-xs text-glow-charcoal mb-1">{label}</p>
            <div className="flex items-center gap-2">
              <span className={`font-poppins font-700 text-lg ${trendColor}`}>
                {trend > 0 ? '+' : ''}{Math.abs(trend).toFixed(1)}%
              </span>
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-glow-success" />
              ) : (
                <TrendingDown className="w-4 h-4 text-glow-error" />
              )}
            </div>
          </div>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-glow-cream pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-glow-sage-light">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-glow-sage-light rounded-card transition"
          >
            <ChevronLeft className="w-5 h-5 text-glow-slate" />
          </button>
          <h1 className="font-poppins font-700 text-glow-slate">Your Insights</h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Trends */}
        {Object.keys(trends).length > 0 && (
          <div className="space-y-4">
            <h2 className="font-poppins font-700 text-glow-slate">Weekly Trends</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <Metric label="Energy" trend={trends.energy} icon="⚡" />
              <Metric label="Sleep" trend={trends.sleep} icon="😴" />
              <Metric label="Stress" trend={trends.stress} icon="🧘" />
              <Metric label="Mood" trend={trends.mood} icon="😊" />
            </div>
          </div>
        )}

        {/* Charts */}
        {chartData.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-poppins font-700 text-glow-slate">Wellness Signals Over Time</h2>

            {/* Energy Chart */}
            <div className="bg-white rounded-lg shadow-card p-6 border border-glow-sage-light">
              <h3 className="font-poppins font-600 text-glow-slate mb-4">Energy Levels</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D4E8DD" />
                  <XAxis dataKey="date" stroke="#3D4A52" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#3D4A52" style={{ fontSize: '12px' }} domain={[0, 10]} />
                  <Tooltip contentStyle={{ backgroundColor: '#F5F3F0', border: 'none', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="energy" stroke="#6B9E7F" strokeWidth={2} dot={{ fill: '#6B9E7F' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Sleep Chart */}
            <div className="bg-white rounded-lg shadow-card p-6 border border-glow-sage-light">
              <h3 className="font-poppins font-600 text-glow-slate mb-4">Sleep Hours</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D4E8DD" />
                  <XAxis dataKey="date" stroke="#3D4A52" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#3D4A52" style={{ fontSize: '12px' }} domain={[0, 12]} />
                  <Tooltip contentStyle={{ backgroundColor: '#F5F3F0', border: 'none', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="sleep" stroke="#A89968" strokeWidth={2} dot={{ fill: '#A89968' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Stress Chart */}
            <div className="bg-white rounded-lg shadow-card p-6 border border-glow-sage-light">
              <h3 className="font-poppins font-600 text-glow-slate mb-4">Stress Levels</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D4E8DD" />
                  <XAxis dataKey="date" stroke="#3D4A52" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#3D4A52" style={{ fontSize: '12px' }} domain={[0, 10]} />
                  <Tooltip contentStyle={{ backgroundColor: '#F5F3F0', border: 'none', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="stress" stroke="#EF4444" strokeWidth={2} dot={{ fill: '#EF4444' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Pattern Detection */}
        <div className="space-y-4">
          <h2 className="font-poppins font-700 text-glow-slate">Patterns & Insights</h2>
          <div className="space-y-3">
            {patterns.map((pattern, i) => (
              <div
                key={i}
                className={`rounded-lg p-6 border-l-4 ${
                  pattern.severity === 'high'
                    ? 'bg-red-50 border-l-glow-error'
                    : pattern.severity === 'medium'
                    ? 'bg-yellow-50 border-l-glow-warning'
                    : pattern.severity === 'positive'
                    ? 'bg-green-50 border-l-glow-success'
                    : 'bg-glow-sage-light border-l-glow-sage'
                }`}
              >
                <div className="flex gap-3">
                  <span className="text-2xl">{pattern.icon}</span>
                  <div>
                    <h3 className="font-poppins font-600 text-glow-slate mb-1">{pattern.title}</h3>
                    <p className="font-inter text-sm text-glow-charcoal">{pattern.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-4">
          <h2 className="font-poppins font-700 text-glow-slate">Personalized Recommendations</h2>
          <div className="bg-white rounded-lg shadow-card p-6 border border-glow-sage-light space-y-4">
            <div className="space-y-3">
              <div className="flex gap-3">
                <span className="text-xl">💧</span>
                <div>
                  <h3 className="font-poppins font-600 text-glow-slate">Stay Hydrated</h3>
                  <p className="font-inter text-sm text-glow-charcoal">Aim for 2-3L of water daily. Dehydration often masquerades as fatigue.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-xl">🧘‍♀️</span>
                <div>
                  <h3 className="font-poppins font-600 text-glow-slate">Stress Management</h3>
                  <p className="font-inter text-sm text-glow-charcoal">Try a 5-minute breathing exercise daily. Consistency matters more than duration.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-xl">🥗</span>
                <div>
                  <h3 className="font-poppins font-600 text-glow-slate">Nutrition Support</h3>
                  <p className="font-inter text-sm text-glow-charcoal">Add more protein and iron-rich foods to support energy and overall wellness.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
