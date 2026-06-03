import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  useEffect(() => {
    if (!document.getElementById('glowwise-fonts')) {
      const link = document.createElement('link');
      link.id = 'glowwise-fonts';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Manrope:wght@300;400;500;600;700&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    try {
      setLoading(true);
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      const msg = (err.message || '').toLowerCase();
      if (msg.includes('user-not-found') || msg.includes('no user')) {
        setError('No account found with that email address.');
      } else if (msg.includes('invalid-email')) {
        setError('Please enter a valid email address.');
      } else {
        setError('Could not send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F5F3F0',
      fontFamily: "'Manrope', system-ui, sans-serif",
      color: '#3D4A52',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      position: 'relative',
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .display { font-family: 'Fraunces', Georgia, serif; font-weight: 400; letter-spacing: -0.02em; }
        .eyebrow { font-family: 'Manrope', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: #A89968; }
        .grain::before { content: ''; position: fixed; inset: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.6'/%3E%3C/svg%3E"); opacity: 0.04; pointer-events: none; z-index: 1; }
        .fade-up { animation: fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .input-wrapper { display: flex; align-items: center; gap: 12px; background: #FAF8F5; border: 1px solid rgba(168, 153, 104, 0.25); border-radius: 8px; padding: 14px 16px; transition: all 0.2s; }
        .input-wrapper:focus-within { border-color: #6B9E7F; box-shadow: 0 0 0 3px rgba(107, 158, 127, 0.1); }
        .input-wrapper input { flex: 1; background: transparent; border: none; outline: none; font-family: 'Manrope', sans-serif; font-size: 15px; color: #3D4A52; }
        .input-wrapper input::placeholder { color: #A89968; opacity: 0.7; }
        .input-icon { color: #A89968; flex-shrink: 0; }
        .input-wrapper:focus-within .input-icon { color: #6B9E7F; }
        .btn-primary { width: 100%; background: #6B9E7F; color: #FAF8F5; padding: 16px 24px; border: none; border-radius: 100px; font-family: 'Manrope', sans-serif; font-size: 15px; font-weight: 500; cursor: pointer; transition: all 0.3s ease; display: inline-flex; align-items: center; justify-content: center; gap: 8px; }
        .btn-primary:hover:not(:disabled) { background: #557E64; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(107, 158, 127, 0.25); }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .error-box { background: rgba(204, 68, 68, 0.08); border-left: 3px solid #CC4444; border-radius: 4px; padding: 12px 14px; font-size: 13px; color: #CC4444; display: flex; align-items: flex-start; gap: 10px; }
        .success-box { background: rgba(107, 158, 127, 0.10); border-left: 3px solid #6B9E7F; border-radius: 4px; padding: 14px 16px; font-size: 13px; color: #557E64; display: flex; align-items: flex-start; gap: 10px; line-height: 1.6; }
      `}</style>

      <div className="grain" />
      <Helmet>
        <title>Reset Password | GlowWise</title>
        <meta name="description" content="Reset your GlowWise password. Enter your email and we'll send you a reset link." />
      </Helmet>

      <div className="fade-up" style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 2 }}>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '24px' }}>
            <svg width="32" height="32" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="46" r="28" stroke="#557E64" strokeWidth="6" fill="none" />
              <path d="M 78 46 Q 78 78 50 80 Q 32 81 30 72" stroke="#6B9E7F" strokeWidth="6" strokeLinecap="round" fill="none" />
              <circle cx="78" cy="46" r="6" fill="#C97B5C" />
            </svg>
            <span className="display" style={{ fontSize: '26px', fontWeight: 500, color: '#3D4A52' }}>GlowWise</span>
          </Link>
          <div className="eyebrow" style={{ marginBottom: '16px' }}>Password reset</div>
          <h1 className="display" style={{ fontSize: 'clamp(28px, 5vw, 40px)', lineHeight: 1.1, color: '#3D4A52', marginBottom: '14px' }}>
            Reset your <em style={{ fontStyle: 'italic', color: '#6B9E7F' }}>password.</em>
          </h1>
          <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#5A6770' }}>
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        {success ? (
          <div>
            <div className="success-box" style={{ marginBottom: '28px' }}>
              <CheckCircle size={16} strokeWidth={2} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontWeight: 600 }}>Check your inbox.</strong> We've sent a password reset link to <strong>{email}</strong>. It may take a minute to arrive.
              </div>
            </div>
            <Link to="/login" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              color: '#557E64', fontFamily: "'Manrope', sans-serif",
              fontSize: '14px', fontWeight: 500, textDecoration: 'none',
            }}>
              <ArrowLeft size={14} strokeWidth={2} /> Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {error && (
              <div className="error-box">
                <AlertCircle size={16} strokeWidth={2} style={{ flexShrink: 0, marginTop: '1px' }} />
                <span>{error}</span>
              </div>
            )}
            <div>
              <label className="eyebrow" style={{ display: 'block', marginBottom: '10px' }}>Email</label>
              <div className="input-wrapper">
                <Mail size={16} strokeWidth={1.8} className="input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '4px' }}>
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
            <Link to="/login" style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              color: '#A89968', fontFamily: "'Manrope', sans-serif",
              fontSize: '13px', fontWeight: 500, textDecoration: 'none', marginTop: '4px',
            }}>
              <ArrowLeft size={13} strokeWidth={2} /> Back to login
            </Link>
          </form>
        )}

        <div style={{
          textAlign: 'center', marginTop: '32px', paddingTop: '28px',
          borderTop: '1px solid rgba(168, 153, 104, 0.2)',
        }}>
          <p className="display" style={{ fontSize: '17px', color: '#5A6770', fontWeight: 400 }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{
              color: '#6B9E7F', textDecoration: 'none', fontWeight: 500,
              fontStyle: 'italic', borderBottom: '1px solid rgba(107, 158, 127, 0.3)', paddingBottom: '2px',
            }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
