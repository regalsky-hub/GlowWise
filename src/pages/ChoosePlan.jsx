import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';

export default function ChoosePlan() {
  const navigate = useNavigate();

  const handlePaidPlan = async () => {
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error('Checkout error:', err);
    }
  };

  return (
    <div style={{
      background: '#F5F3F0',
      minHeight: '100vh',
      fontFamily: "'Manrope', system-ui, sans-serif",
      color: '#3D4A52',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
    }}>

      {/* Logo */}
      <button onClick={() => navigate('/')} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px'
      }}>
        <svg width="32" height="32" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="46" r="28" stroke="#557E64" strokeWidth="6" fill="none" />
          <path d="M 78 46 Q 78 78 50 80 Q 32 81 30 72" stroke="#6B9E7F" strokeWidth="6" strokeLinecap="round" fill="none" />
          <circle cx="78" cy="46" r="6" fill="#C97B5C" />
        </svg>
        <span style={{ fontFamily: "'Fraunces', serif", fontSize: '24px', fontWeight: 500, color: '#3D4A52' }}>
          GlowWise
        </span>
      </button>

      {/* Heading */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{
          fontSize: '11px', fontWeight: 600, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: '#A89968', marginBottom: '16px'
        }}>Get started</div>
        <h1 style={{
          fontFamily: "'Fraunces', serif", fontSize: 'clamp(32px, 5vw, 52px)',
          fontWeight: 400, lineHeight: 1.1, color: '#3D4A52', marginBottom: '16px'
        }}>
          Choose your plan
        </h1>
        <p style={{ fontSize: '17px', color: '#5A6770', lineHeight: 1.6 }}>
          Start free anytime. Upgrade when you're ready.
        </p>
      </div>

      {/* Plan cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        width: '100%',
        maxWidth: '720px',
      }}>

        {/* Free Plan */}
        <div style={{
          background: '#FAF8F5',
          border: '1px solid rgba(168, 153, 104, 0.2)',
          borderRadius: '4px',
          padding: '40px 32px',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{
            fontSize: '11px', fontWeight: 600, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: '#A89968', marginBottom: '20px'
          }}>Free</div>

          <div style={{ marginBottom: '8px' }}>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: '52px', fontWeight: 400, color: '#3D4A52' }}>£0</span>
            <span style={{ fontSize: '15px', color: '#A89968', marginLeft: '8px' }}>/ forever</span>
          </div>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: '#EDF4EF', color: '#557E64', padding: '6px 14px',
            borderRadius: '100px', fontSize: '12px', fontWeight: 600,
            marginBottom: '32px', border: '1px solid rgba(107, 158, 127, 0.25)',
            width: 'fit-content'
          }}>
            <Check size={12} strokeWidth={2.5} /> No credit card needed
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '36px', flex: 1 }}>
            {[
              '2 questions per day to your AI Coach',
              'Daily wellness tracking',
              'Basic pattern insights',
              '1 photo upload per month',
              'Chat history',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '14px', color: '#3D4A52' }}>
                <Check size={16} strokeWidth={2} style={{ color: '#6B9E7F', marginTop: '2px', flexShrink: 0 }} />
                {item}
              </div>
            ))}
          </div>

          <button onClick={() => navigate('/signup')} style={{
            background: 'transparent', color: '#3D4A52',
            padding: '14px 24px', border: '1px solid #3D4A52',
            borderRadius: '100px', fontFamily: "'Manrope', sans-serif",
            fontSize: '15px', fontWeight: 500, cursor: 'pointer',
            width: '100%', transition: 'all 0.3s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#3D4A52'; e.currentTarget.style.color = '#FAF8F5'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#3D4A52'; }}
          >
            Start free <ArrowRight size={16} />
          </button>
        </div>

        {/* Paid Plan */}
        <div style={{
          background: '#6B9E7F',
          border: '1px solid #6B9E7F',
          borderRadius: '4px',
          padding: '40px 32px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: '-12px', left: '50%',
            transform: 'translateX(-50%)',
            background: '#A89968', color: '#FAF8F5',
            padding: '5px 14px', borderRadius: '100px',
            fontSize: '10px', letterSpacing: '0.15em',
            textTransform: 'uppercase', fontWeight: 600,
          }}>Most popular</div>

          <div style={{
            fontSize: '11px', fontWeight: 600, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: '#D4E8DD', marginBottom: '20px'
          }}>Wellness Coach</div>

          <div style={{ marginBottom: '32px' }}>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: '52px', fontWeight: 400, color: '#FAF8F5' }}>£4.99</span>
            <span style={{ fontSize: '15px', color: '#D4E8DD', marginLeft: '8px' }}>/ month</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '36px', flex: 1 }}>
            {[
              'Unlimited AI Coach access',
              'Deeper personalisation over time',
              'Photo progression tracking',
              'Advanced pattern detection',
              'Weekly wellness insights',
              'Cancel anytime',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '14px', color: '#FAF8F5' }}>
                <Check size={16} strokeWidth={2} style={{ color: '#D4E8DD', marginTop: '2px', flexShrink: 0 }} />
                {item}
              </div>
            ))}
          </div>

          <button onClick={handlePaidPlan} style={{
            background: '#FAF8F5', color: '#557E64',
            padding: '14px 24px', border: 'none',
            borderRadius: '100px', fontFamily: "'Manrope', sans-serif",
            fontSize: '15px', fontWeight: 600, cursor: 'pointer',
            width: '100%', transition: 'all 0.3s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#FAF8F5'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Start Wellness Coach <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <p style={{ marginTop: '24px', fontSize: '13px', color: '#A89968', fontStyle: 'italic' }}>
        Cancel anytime. No hidden fees.
      </p>
    </div>
  );
}
