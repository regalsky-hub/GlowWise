import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff, Shield, Check } from 'lucide-react';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToDisclaimer, setAgreedToDisclaimer] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { signup } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!document.getElementById('glowwise-fonts')) {
      const link = document.createElement('link');
      link.id = 'glowwise-fonts';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Manrope:wght@300;400;500;600;700&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  const checkPasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;
    setPasswordStrength(strength);
  };

  const getStrengthLabel = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength === 1) return 'Weak';
    if (passwordStrength === 2) return 'Fair';
    if (passwordStrength === 3) return 'Good';
    return 'Strong';
  };

  const canSubmit = agreedToTerms && agreedToDisclaimer && !loading;

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) { setError('Please enter your email'); return; }
    if (!password) { setError('Please create a password'); return; }
    if (password !== confirmPassword) { setError('Passwords don\'t match'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (passwordStrength < 2) { setError('Password needs letters, numbers, and ideally a symbol'); return; }
    if (!agreedToTerms) { setError('Please agree to the Terms, Privacy Policy, and Medical Disclaimer'); return; }
    if (!agreedToDisclaimer) { setError('Please confirm you understand GlowWise provides wellness guidance, not medical advice'); return; }

    try {
      setLoading(true);
      await signup(email, password);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.message || 'Could not create account. Please try again.');
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
        .password-toggle { background: none; border: none; cursor: pointer; color: #A89968; padding: 4px; display: flex; align-items: center; justify-content: center; transition: color 0.2s; flex-shrink: 0; }
        .password-toggle:hover { color: #6B9E7F; }
        .btn-primary { width: 100%; background: #6B9E7F; color: #FAF8F5; padding: 16px 24px; border: none; border-radius: 100px; font-family: 'Manrope', sans-serif; font-size: 15px; font-weight: 500; letter-spacing: 0.01em; cursor: pointer; transition: all 0.3s ease; display: inline-flex; align-items: center; justify-content: center; gap: 8px; }
        .btn-primary:hover:not(:disabled) { background: #557E64; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(107, 158, 127, 0.25); }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .info-box { background: rgba(212, 232, 221, 0.5); border-left: 3px solid #6B9E7F; border-radius: 4px; padding: 14px 16px; font-size: 13px; line-height: 1.55; color: #557E64; display: flex; gap: 10px; align-items: flex-start; }
        .error-box { background: rgba(204, 68, 68, 0.08); border-left: 3px solid #CC4444; border-radius: 4px; padding: 12px 14px; font-size: 13px; color: #CC4444; display: flex; align-items: flex-start; gap: 10px; }
        .strength-bar { height: 3px; flex: 1; background: rgba(168, 153, 104, 0.18); border-radius: 100px; transition: background 0.3s; }
        .strength-bar.active-1 { background: #CC4444; }
        .strength-bar.active-2 { background: #D4A55C; }
        .strength-bar.active-3 { background: #6B9E7F; }
        .strength-bar.active-4 { background: #6B9E7F; }
        .consent-row { display: flex; gap: 12px; align-items: flex-start; padding: 14px 16px; background: #FAF8F5; border: 1px solid rgba(168, 153, 104, 0.2); border-radius: 8px; cursor: pointer; transition: all 0.2s; }
        .consent-row:hover { border-color: rgba(107, 158, 127, 0.4); }
        .consent-row.checked { background: rgba(212, 232, 221, 0.4); border-color: #6B9E7F; }
        .consent-checkbox { width: 20px; height: 20px; border-radius: 4px; border: 2px solid rgba(168, 153, 104, 0.5); background: #FAF8F5; cursor: pointer; flex-shrink: 0; margin-top: 1px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .consent-checkbox.checked { background: #6B9E7F; border-color: #6B9E7F; }
        .consent-text { font-size: 13px; line-height: 1.5; color: #5A6770; flex: 1; }
        .consent-text a { color: #557E64; font-weight: 600; text-decoration: none; border-bottom: 1px solid rgba(107, 158, 127, 0.3); }
        .consent-text a:hover { border-bottom-color: #557E64; }
      `}</style>

      <div className="grain"></div>

      <div className="fade-up" style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 2 }}>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '24px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #6B9E7F 0%, #A89968 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FAF8F5', fontFamily: "'Fraunces', serif", fontSize: '18px', fontWeight: 500 }}>g</div>
            <span className="display" style={{ fontSize: '26px', fontWeight: 500, color: '#3D4A52' }}>GlowWise</span>
          </Link>

          <div className="eyebrow" style={{ marginBottom: '16px' }}>Create your account</div>
          <h1 className="display" style={{ fontSize: 'clamp(32px, 5vw, 44px)', lineHeight: 1.1, color: '#3D4A52', marginBottom: '14px' }}>
            Begin your <em style={{ fontStyle: 'italic', color: '#6B9E7F' }}>wellness journey.</em>
          </h1>
          <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#5A6770' }}>
            Free to start. Two questions a day. No credit card required.
          </p>
        </div>

        <div className="info-box" style={{ marginBottom: '28px' }}>
          <Shield size={16} strokeWidth={1.8} style={{ color: '#6B9E7F', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ fontWeight: 600 }}>Wellness, not medical advice.</strong> Always consult a qualified healthcare provider for medical concerns.
          </div>
        </div>

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

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
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
            </div>
          </div>

          <div>
            <label className="eyebrow" style={{ display: 'block', marginBottom: '10px' }}>Password</label>
            <div className="input-wrapper">
              <Lock size={16} strokeWidth={1.8} className="input-icon" />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => { setPassword(e.target.value); checkPasswordStrength(e.target.value); }} placeholder="Create a strong password" autoComplete="new-password" />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff size={16} strokeWidth={1.8} /> : <Eye size={16} strokeWidth={1.8} />}
              </button>
            </div>
            {password && (
              <div style={{ marginTop: '10px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`strength-bar ${i <= passwordStrength ? `active-${passwordStrength}` : ''}`} />
                  ))}
                </div>
                <p style={{ fontSize: '11px', color: passwordStrength >= 3 ? '#6B9E7F' : '#A89968', letterSpacing: '0.05em' }}>
                  {getStrengthLabel()} — at least 8 characters with letters and numbers
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="eyebrow" style={{ display: 'block', marginBottom: '10px' }}>Confirm password</label>
            <div className="input-wrapper">
              <Lock size={16} strokeWidth={1.8} className="input-icon" />
              <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter password" autoComplete="new-password" />
              <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)} aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}>
                {showConfirmPassword ? <EyeOff size={16} strokeWidth={1.8} /> : <Eye size={16} strokeWidth={1.8} />}
              </button>
            </div>
            {confirmPassword && password === confirmPassword && (
              <p style={{ fontSize: '12px', color: '#6B9E7F', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Check size={12} strokeWidth={2.5} /> Passwords match
              </p>
            )}
          </div>

          {/* Legal Consent Checkboxes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
            <label className={`consent-row ${agreedToTerms ? 'checked' : ''}`}>
              <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} style={{ display: 'none' }} />
              <div className={`consent-checkbox ${agreedToTerms ? 'checked' : ''}`}>
                {agreedToTerms && <Check size={14} strokeWidth={3} style={{ color: '#FAF8F5' }} />}
              </div>
              <span className="consent-text">
                I have read and agree to the <Link to="/terms" target="_blank">Terms of Service</Link>, <Link to="/privacy" target="_blank">Privacy Policy</Link>, and <Link to="/disclaimer" target="_blank">Medical Disclaimer</Link>.
              </span>
            </label>

            <label className={`consent-row ${agreedToDisclaimer ? 'checked' : ''}`}>
              <input type="checkbox" checked={agreedToDisclaimer} onChange={(e) => setAgreedToDisclaimer(e.target.checked)} style={{ display: 'none' }} />
              <div className={`consent-checkbox ${agreedToDisclaimer ? 'checked' : ''}`}>
                {agreedToDisclaimer && <Check size={14} strokeWidth={3} style={{ color: '#FAF8F5' }} />}
              </div>
              <span className="consent-text">
                I understand GlowWise provides wellness guidance, not medical advice, and is not a substitute for a qualified healthcare professional.
              </span>
            </label>
          </div>

          <button type="submit" disabled={!canSubmit} className="btn-primary" style={{ marginTop: '12px' }}>
            {loading ? 'Creating your account...' : (<>Create account <ArrowRight size={16} strokeWidth={2} /></>)}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '32px', paddingTop: '28px', borderTop: '1px solid rgba(168, 153, 104, 0.2)' }}>
          <p className="display" style={{ fontSize: '17px', color: '#5A6770', fontWeight: 400 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#6B9E7F', textDecoration: 'none', fontWeight: 500, fontStyle: 'italic', borderBottom: '1px solid rgba(107, 158, 127, 0.3)', paddingBottom: '2px', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.target.style.color = '#557E64'; e.target.style.borderBottomColor = '#557E64'; }}
              onMouseLeave={(e) => { e.target.style.color = '#6B9E7F'; e.target.style.borderBottomColor = 'rgba(107, 158, 127, 0.3)'; }}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
