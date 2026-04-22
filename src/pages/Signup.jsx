import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const checkPasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;
    setPasswordStrength(strength);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email) {
      setError('Email is required');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (passwordStrength < 2) {
      setError('Password must contain letters, numbers, and symbols');
      return;
    }

    try {
      setLoading(true);
      await signup(email, password);
      // Show verification message then redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to create account');
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
          <p className="font-inter text-glow-charcoal text-sm mt-2">Begin your wellness journey</p>
        </div>

        {/* Disclaimer */}
        <div className="bg-glow-sage-light border border-glow-sage border-opacity-30 rounded-card p-4 mb-6">
          <p className="font-inter text-xs text-glow-slate leading-relaxed">
            <strong>Important:</strong> GlowWise provides wellness guidance, not medical advice. 
            Always consult a healthcare provider for medical concerns.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-card p-6 mb-4">
          <form onSubmit={handleSignup} className="space-y-4">
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
              <label className="block font-inter text-sm font-500 text-glow-slate mb-2">Password</label>
              <div className="flex items-center gap-2 border border-glow-sage-light rounded-card px-3 py-2 focus-within:border-glow-sage focus-within:bg-glow-sage-light focus-within:bg-opacity-30 transition">
                <Lock className="w-4 h-4 text-glow-sage" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    checkPasswordStrength(e.target.value);
                  }}
                  placeholder="Create a strong password"
                  className="flex-1 font-inter text-body bg-transparent outline-none text-glow-slate placeholder-glow-charcoal placeholder-opacity-50"
                />
              </div>
              {password && (
                <div className="mt-2 flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition ${
                        i < passwordStrength ? 'bg-glow-sage' : 'bg-glow-sage-light'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block font-inter text-sm font-500 text-glow-slate mb-2">Confirm Password</label>
              <div className="flex items-center gap-2 border border-glow-sage-light rounded-card px-3 py-2 focus-within:border-glow-sage focus-within:bg-glow-sage-light focus-within:bg-opacity-30 transition">
                <Lock className="w-4 h-4 text-glow-sage" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
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
              {loading ? 'Creating Account...' : 'Create Account'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>

        {/* Login Link */}
        <p className="text-center font-inter text-sm text-glow-charcoal">
          Already have an account?{' '}
          <Link to="/login" className="text-glow-sage font-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
