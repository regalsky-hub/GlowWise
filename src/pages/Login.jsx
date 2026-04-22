import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-glow-cream to-glow-sage-light flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-glow-sage mb-3">
            <span className="text-2xl">✨</span>
          </div>
          <h1 className="font-poppins font-700 text-glow-slate text-2xl">GlowWise</h1>
          <p className="font-inter text-glow-charcoal text-sm mt-2">Welcome back</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-card p-6 mb-4">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="flex gap-3 items-start p-4 bg-red-50 border border-glow-error rounded-card">
                <AlertCircle className="w-5 h-5 text-glow-error flex-shrink-0 mt-0.5" />
                <p className="font-inter text-sm text-glow-error">{error}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block font-inter text-sm font-500 text-glow-slate mb-2">Email</label>
              <div className="flex items-center gap-2 border border-glow-sage-light rounded-card px-3 py-2 focus-within:border-glow-sage focus-within:bg-glow-sage-light focus-within:bg-opacity-30 transition">
                <Mail className="w-4 h-4 text-glow-sage" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 font-inter text-body bg-transparent outline-none text-glow-slate placeholder-glow-charcoal placeholder-opacity-50"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block font-inter text-sm font-500 text-glow-slate">Password</label>
                <Link to="/forgot-password" className="text-glow-sage text-xs font-500 hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="flex items-center gap-2 border border-glow-sage-light rounded-card px-3 py-2 focus-within:border-glow-sage focus-within:bg-glow-sage-light focus-within:bg-opacity-30 transition">
                <Lock className="w-4 h-4 text-glow-sage" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="flex-1 font-inter text-body bg-transparent outline-none text-glow-slate placeholder-glow-charcoal placeholder-opacity-50"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-glow-sage text-white rounded-card font-inter font-600 hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 mt-6"
            >
              {loading ? 'Logging in...' : 'Login'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>

        {/* Signup Link */}
        <p className="text-center font-inter text-sm text-glow-charcoal">
          Don't have an account?{' '}
          <Link to="/signup" className="text-glow-sage font-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
