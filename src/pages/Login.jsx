import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Inject Google Fonts (Fraunces + Manrope) once on mount
    if (!document.getElementById('glowwise-fonts')) {
      const link = document.createElement('link');
      link.id = 'glowwise-fonts';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Manrope:wght@300;400;500;600;700&display=swap';
      document.head.appendChild(link);
    }
  }, []);

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
      // Friendlier error messages
      let friendlyError = 'Could not log in. Please check your details.';
      const msg = (err.message || '').toLowerCase();
      if (msg.includes('user-not-found') || msg.includes('no user')) {
        friendlyError = 'No account found with that email. Want to sign up instead?';
      } else if (msg.includes('wrong-password') || msg.includes('invalid-credential')) {
        friendlyError = 'That password doesn\'t look right. Try again or reset it.';
      } else if (msg.includes('too-many-requests')) {
        friendlyError = 'Too many attempts. Please wait a moment before trying again.';
      } else if (msg.includes('network')) {
        friendlyError = 'Connection issue. Please check your internet and try again.';
      }
      setError(friendlyError);
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

        .fade-up { animation: fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

        .input-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #FAF8F5;
          border: 1px solid rgba(168, 153, 104, 0.25);
          border-radius: 8px;
          padding: 14px 16px;
          transition: all 0.2s;
        }
        .input-wrapper:focus-within {
          border-color: #6B9E7F;
          box-shadow: 0 0 0 3px rgba(107, 158, 127, 0.1);
        }
        .input-wrapper input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-family: 'Manrope', sans-serif;
          font-size: 15px;
          color: #3D4A52;
        }
        .input-wrapper input::placeholder { color: #A89968; opacity: 0.7; }
        .input-icon { color: #A89968; flex-shrink: 0; }
        .input-wrapper:focus-within .input-icon { color: #6B9E7F; }

        .password-toggle {
          background: none;
          border: none;
          cursor: pointer;
          color: #A89968;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
          flex-shrink: 0;
        }
        .password-toggle:hover { color: #6B9E7F; }

        .btn-primary {
          width: 100%;
          background: #6B9E7F;
          color: #FAF8F5;
          padding: 16px 24px;
          border: none;
          border-radius: 100px;
          font-family: 'Manrope', sans-serif;
          font-size: 15px;
          font-weight: 500;
          letter-spacing: 0.01em;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .btn-primary:hover:not(:disabled) {
          background: #557E64;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(107, 158, 127, 0.25);
        }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

        .error-box {
          background: rgba(204, 68, 68, 0.08);
          border-left: 3px solid #CC4444;
          border-radius: 4px;
          padding: 12px 14px;
          font-size: 13px;
          color: #CC4444;
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }
      `}</style>

      <div className="grain"></div>

      <div className="fade-up" style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 2 }}>

        {/* Logo + brand */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '24px' }}>
            <div style={{
              width: '36px', height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6B9E7F 0%, #A89968 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#FAF8F5',
              fontFamily: "'Fraunces', serif",
              fontSize: '18px',
              fontWeight: 500,
            }}>g</div>
            <span className="display" style={{ fontSize: '26px', fontWeight: 500, color: '#3D4A52' }}>
              GlowWise
            </span>
          </Link>

          <div className="eyebrow" style={{ marginBottom: '16px' }}>Login</div>
          <h1 className="display" style={{ fontSize: 'clamp(32px, 5vw, 44px)', lineHeight: 1.1, color: '#3D4A52', marginBottom: '14px' }}>
            Welcome <em style={{ fontStyle: 'italic', color: '#6B9E7F' }}>back.</em>
          </h1>
          <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#5A6770' }}>
            Pick up where you left off with your AI Coach.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {error && (
            <div className="error-box">
              <AlertCircle size={16} strokeWidth={2} style={{ flexShrink: 0, marginTop: '1px' }} />
              <span>{error}</span>
            </div>
          )}

          {/* Email */}
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
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <label className="eyebrow">Password</label>
              <Link
                to="/forgot-password"
                style={{
                  fontSize: '12px',
                  color: '#A89968',
                  textDecoration: 'none',
                  fontWeight: 500,
                  letterSpacing: '0.02em',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => e.target.style.color = '#6B9E7F'}
                onMouseLeave={(e) => e.target.style.color = '#A89968'}
              >
                Forgot password?
              </Link>
            </div>
            <div className="input-wrapper">
              <Lock size={16} strokeWidth={1.8} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} strokeWidth={1.8} /> : <Eye size={16} strokeWidth={1.8} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ marginTop: '12px' }}
          >
            {loading ? (
              'Logging in...'
            ) : (
              <>Login <ArrowRight size={16} strokeWidth={2} /></>
            )}
          </button>
        </form>

        {/* Signup link */}
        <div style={{
          textAlign: 'center',
          marginTop: '32px',
          paddingTop: '28px',
          borderTop: '1px solid rgba(168, 153, 104, 0.2)',
        }}>
          <p className="display" style={{ fontSize: '17px', color: '#5A6770', fontWeight: 400 }}>
            Don't have an account?{' '}
            <Link
              to="/signup"
              style={{
                color: '#6B9E7F',
                textDecoration: 'none',
                fontWeight: 500,
                fontStyle: 'italic',
                borderBottom: '1px solid rgba(107, 158, 127, 0.3)',
                paddingBottom: '2px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#557E64';
                e.target.style.borderBottomColor = '#557E64';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#6B9E7F';
                e.target.style.borderBottomColor = 'rgba(107, 158, 127, 0.3)';
              }}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
