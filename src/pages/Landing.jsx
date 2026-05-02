import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Menu, X, Check, ArrowRight, Plus, Minus } from 'lucide-react';

function AnimatedCoachDemo() {
  const conversations = [
    { user: "My energy is low all afternoon.", coach: "Your check-ins show energy crashes on days with under 6 hours of sleep. Let's look at your routine — small shifts make a real difference." },
    { user: "My skin breaks out the week before my period.", coach: "That's a classic luteal-phase pattern — progesterone and androgens shift right before your period. Want a cycle-aware skincare rhythm to get ahead of it?" },
    { user: "I've been shedding more hair than usual.", coach: "Shedding often spikes 2–3 months after stress, illness, or low ferritin. Has anything shifted recently? We can trace it back together." },
    { user: "I keep losing my train of thought in meetings.", coach: "Brain fog rarely shows up randomly — it usually tracks with sleep quality, blood sugar dips, or hormone shifts. Want to walk through this week so we can spot the pattern?" }
  ];

  const [activeIdx, setActiveIdx] = React.useState(0);
  const [userVisible, setUserVisible] = React.useState(false);
  const [typingVisible, setTypingVisible] = React.useState(false);
  const [coachText, setCoachText] = React.useState('');
  const [coachVisible, setCoachVisible] = React.useState(false);
  const [fading, setFading] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    const wait = (ms) => new Promise(r => setTimeout(r, ms));

    async function runConversation(idx) {
      if (cancelled) return;
      const { user, coach } = conversations[idx];
      setFading(false);
      setUserVisible(false);
      setTypingVisible(false);
      setCoachText('');
      setCoachVisible(false);

      await wait(400);
      if (cancelled) return;
      setUserVisible(true);
      await wait(900);

      if (cancelled) return;
      setTypingVisible(true);
      await wait(1400);

      if (cancelled) return;
      setTypingVisible(false);
      await wait(150);
      setCoachVisible(true);

      const words = coach.split(' ');
      for (let i = 0; i < words.length; i++) {
        if (cancelled) return;
        setCoachText(prev => prev + (i === 0 ? '' : ' ') + words[i]);
        const last = words[i].slice(-1);
        const delay = (last === '.' || last === ',' || last === '?' || last === '—') ? 180 : 75;
        await wait(delay);
      }

      await wait(3200);
      if (cancelled) return;
      setFading(true);
      await wait(420);
    }

    async function loop() {
      let i = activeIdx;
      while (!cancelled) {
        await runConversation(i);
        i = (i + 1) % conversations.length;
        if (!cancelled) setActiveIdx(i);
      }
    }

    loop();
    return () => { cancelled = true; };
  }, []);

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
      <style>{`
        @keyframes msgIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes msgOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-6px); } }
        @keyframes typeBounce { 0%, 60%, 100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-4px); opacity: 1; } }
        @keyframes blinkCaret { 50% { opacity: 0; } }
        @keyframes pulseDot { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .msg-in { animation: msgIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .msg-out { animation: msgOut 0.4s ease forwards; }
        .type-dot { width: 5px; height: 5px; border-radius: 50%; background: #A89968; animation: typeBounce 1.2s ease-in-out infinite; }
        .type-dot:nth-child(2) { animation-delay: 0.15s; }
        .type-dot:nth-child(3) { animation-delay: 0.3s; }
        .caret { display: inline-block; width: 2px; height: 1em; background: #FAF8F5; margin-left: 2px; vertical-align: text-bottom; animation: blinkCaret 0.8s step-end infinite; }
      `}</style>

      <div style={{
        background: '#FAF8F5',
        borderRadius: '16px',
        padding: '24px 22px 22px',
        border: '1px solid rgba(168, 153, 104, 0.18)',
        boxShadow: '0 30px 60px -20px rgba(61, 74, 82, 0.15)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingBottom: '18px', borderBottom: '1px solid rgba(168, 153, 104, 0.18)' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #6B9E7F 0%, #A89968 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#FAF8F5', fontFamily: "'Fraunces', serif", fontSize: '22px', fontWeight: 500,
            boxShadow: 'inset 0 -2px 4px rgba(44, 62, 80, 0.08)',
          }}>g</div>
          <div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: '18px', fontWeight: 500, color: '#3D4A52', letterSpacing: '-0.01em' }}>Your wellness coach</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6B9E7F', marginTop: '2px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#6B9E7F', animation: 'pulseDot 2s ease-in-out infinite' }}></span>
              Online
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ padding: '22px 4px 8px', minHeight: '280px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {userVisible && (
            <div className={fading ? 'msg-out' : 'msg-in'} style={{
              alignSelf: 'flex-end',
              maxWidth: '82%',
              background: 'transparent',
              border: '1px solid rgba(168, 153, 104, 0.25)',
              color: '#3D4A52',
              padding: '14px 18px',
              borderRadius: '14px 14px 4px 14px',
              fontSize: '15px',
              lineHeight: 1.5,
            }}>
              {conversations[activeIdx].user}
            </div>
          )}

          {coachVisible && (
            <div className={fading ? 'msg-out' : 'msg-in'} style={{
              alignSelf: 'flex-start',
              maxWidth: '90%',
              background: '#6B9E7F',
              color: '#FAF8F5',
              padding: '14px 18px',
              borderRadius: '14px 14px 14px 4px',
              fontSize: '15px',
              lineHeight: 1.55,
              boxShadow: '0 2px 8px rgba(107, 158, 127, 0.18)',
            }}>
              {coachText}
              {coachText.length < conversations[activeIdx].coach.length && <span className="caret"></span>}
            </div>
          )}
        </div>

        {/* Typing indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 4px 0',
          fontSize: '13px',
          color: '#A89968',
          opacity: typingVisible ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}>
          <div style={{ display: 'flex', gap: '3px' }}>
            <span className="type-dot"></span>
            <span className="type-dot"></span>
            <span className="type-dot"></span>
          </div>
          Coach is typing
        </div>
      </div>

      {/* Progress dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '20px' }}>
        {conversations.map((_, i) => (
          <div key={i} style={{
            width: i === activeIdx ? '18px' : '6px',
            height: '6px',
            borderRadius: i === activeIdx ? '3px' : '50%',
            background: i === activeIdx ? '#6B9E7F' : 'rgba(168, 153, 104, 0.3)',
            transition: 'all 0.3s ease',
          }}></div>
        ))}
      </div>
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    // Inject Google Fonts (Fraunces + Manrope) once on mount
    if (!document.getElementById('glowwise-fonts')) {
      const link = document.createElement('link');
      link.id = 'glowwise-fonts';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Manrope:wght@300;400;500;600;700&display=swap';
      document.head.appendChild(link);
    }

    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const features = [
    { num: '01', title: 'AI Wellness Coach', desc: "Ask anything. Get answers built on your data, not Google's." },
    { num: '02', title: 'Pattern Detection', desc: "The AI spots what's actually affecting you — like sleep and skin, or stress and shedding." },
    { num: '03', title: 'Daily Check-In', desc: "60 seconds a day. Tracks energy, sleep, stress, mood and supplements." },
    { num: '04', title: 'Personalised Insights', desc: "Weekly summaries with clear next steps for your priorities." },
    { num: '05', title: 'Photo Tracking', desc: "Optional, private before/after photos to see real progress." },
    { num: '06', title: 'You Control Your Data', desc: "Delete any message, photo, or your whole account anytime. GDPR compliant. No third-party sharing." },
  ];

  const samples = [
    {
      tag: 'Hair loss',
      user: "I'm losing a lot of hair lately.",
      coach: "Your stress is averaging 7/10 and sleep is around 5 hours — both raise cortisol, which triggers shedding. Let's start with sleep. Here's a 3-step plan..."
    },
    {
      tag: 'Energy crashes',
      user: "I get tired every afternoon.",
      coach: "Your check-ins show energy dips on days with under 6 hours of sleep and high caffeine. Try: protein at lunch, no caffeine after 2pm, and a 10-minute walk after eating."
    },
    {
      tag: 'Brain fog',
      user: "I keep losing focus during work.",
      coach: "Your patterns show brain fog spikes on days with poor sleep and skipped breakfast. Try protein within an hour of waking and consistent sleep timing — even small shifts help."
    }
  ];

  const faqs = [
    { q: 'Is this a medical app?', a: 'No. GlowWise gives wellness guidance, not medical advice. Always see a doctor for medical concerns.' },
    { q: 'How does the AI get so personalised?', a: 'Through your daily check-ins. The more data you log, the sharper the guidance gets.' },
    { q: 'Is my data really private?', a: 'Yes. Encrypted at rest, GDPR compliant, no third-party sharing, and you can delete anything anytime.' },
    { q: 'Can I delete everything?', a: 'Yes — individual messages, photos, conversations or your full account, anytime.' },
    { q: 'Who is GlowWise for?', a: 'Anyone 18+ looking for clarity on their wellness. Whether you\'re tracking hormones, hair loss, energy, sleep, stress, skin or nutrition — GlowWise adapts to you.' },
    { q: 'What does it actually cover?', a: 'Hormones, hair, energy, stress, sleep, skin, nutrition and brain health.' },
    { q: 'Can I cancel anytime?', a: 'Yes. One tap in your account settings. No questions asked, no fees.' },
    { q: 'Will it be available in my language?', a: "English at launch. We're adding more languages based on demand — let us know which one you'd like next via the language menu." },
    { q: 'How quickly will I see results?', a: 'Most users notice patterns within 2 weeks of daily check-ins. Real changes to energy, sleep or skin typically take 4–6 weeks of consistent action on the AI Coach\'s suggestions.' },
    { q: 'How is this different from ChatGPT?', a: 'ChatGPT gives general advice to anyone. GlowWise learns you — your patterns, your priorities, your daily check-ins — and gives guidance built around your body. Plus, you control your data and can delete anything anytime.' },
  ];

  return (
    <div style={{ background: '#F5F3F0', minHeight: '100vh', fontFamily: "'Manrope', system-ui, sans-serif", color: '#3D4A52' }}>
      <style>{`
        .glowwise-landing * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        .display { font-family: 'Fraunces', Georgia, serif; font-weight: 400; letter-spacing: -0.02em; }
        .display-bold { font-family: 'Fraunces', Georgia, serif; font-weight: 500; letter-spacing: -0.02em; }
        .body-text { font-family: 'Manrope', sans-serif; }
        .eyebrow {
          font-family: 'Manrope', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #A89968;
        }

        .btn-primary {
          background: #6B9E7F;
          color: #FAF8F5;
          padding: 14px 28px;
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
          gap: 8px;
        }
        .btn-primary:hover { background: #557E64; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(107, 158, 127, 0.25); }

        .btn-secondary {
          background: transparent;
          color: #3D4A52;
          padding: 14px 24px;
          border: 1px solid #3D4A52;
          border-radius: 100px;
          font-family: 'Manrope', sans-serif;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .btn-secondary:hover { background: #3D4A52; color: #FAF8F5; }

        .nav-link {
          font-family: 'Manrope', sans-serif;
          font-size: 14px;
          color: #3D4A52;
          text-decoration: none;
          font-weight: 500;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px 0;
          transition: color 0.2s;
        }
        .nav-link:hover { color: #6B9E7F; }

        .container { max-width: 1240px; margin: 0 auto; padding: 0 32px; }
        @media (max-width: 768px) { .container { padding: 0 20px; } }

        .grain::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.6'/%3E%3C/svg%3E");
          opacity: 0.04;
          pointer-events: none;
          z-index: 1;
        }

        .fade-up { animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        .chat-bubble-user {
          background: #FAF8F5;
          border: 1px solid #E8E4DD;
          border-radius: 18px 18px 4px 18px;
          padding: 14px 18px;
          font-size: 14px;
          line-height: 1.5;
          color: #3D4A52;
          margin-left: auto;
          max-width: 85%;
        }
        .chat-bubble-coach {
          background: #6B9E7F;
          color: #FAF8F5;
          border-radius: 18px 18px 18px 4px;
          padding: 14px 18px;
          font-size: 14px;
          line-height: 1.55;
          max-width: 90%;
        }

        .feature-card {
          background: #FAF8F5;
          border: 1px solid rgba(168, 153, 104, 0.15);
          border-radius: 4px;
          padding: 36px 28px;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }
        .feature-card:hover { border-color: #6B9E7F; transform: translateY(-2px); }
        .feature-card::after {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 2px;
          background: #6B9E7F;
          transform: scaleY(0);
          transform-origin: bottom;
          transition: transform 0.4s ease;
        }
        .feature-card:hover::after { transform: scaleY(1); transform-origin: top; }

        .step-circle {
          width: 56px; height: 56px;
          border-radius: 50%;
          background: #FAF8F5;
          border: 1.5px solid #6B9E7F;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Fraunces', serif;
          font-size: 20px;
          color: #6B9E7F;
          margin-bottom: 24px;
        }

        .pricing-card {
          background: #FAF8F5;
          border: 1px solid rgba(168, 153, 104, 0.2);
          border-radius: 4px;
          padding: 40px 32px;
          position: relative;
          transition: all 0.3s;
        }
        .pricing-card.featured {
          background: #6B9E7F;
          color: #FAF8F5;
          border-color: #6B9E7F;
        }
        .pricing-card.featured .price-amount { color: #FAF8F5; }

        .faq-item {
          border-bottom: 1px solid rgba(168, 153, 104, 0.2);
          padding: 24px 0;
        }
        .faq-question {
          width: 100%;
          background: none;
          border: none;
          padding: 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          text-align: left;
          font-family: 'Fraunces', serif;
          font-size: 19px;
          font-weight: 400;
          color: #3D4A52;
          letter-spacing: -0.01em;
        }
        .faq-answer {
          margin-top: 16px;
          font-size: 15px;
          line-height: 1.7;
          color: #5A6770;
          max-width: 720px;
        }

        .lang-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: #FAF8F5;
          border: 1px solid rgba(168, 153, 104, 0.25);
          border-radius: 8px;
          min-width: 200px;
          box-shadow: 0 12px 32px rgba(61, 74, 82, 0.08);
          overflow: hidden;
          z-index: 100;
        }
        .lang-item {
          padding: 12px 18px;
          font-size: 14px;
          color: #3D4A52;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(168, 153, 104, 0.1);
        }
        .lang-item:last-child { border-bottom: none; }
        .lang-item.active { color: #6B9E7F; font-weight: 600; }
        .lang-item.disabled { color: #A89968; opacity: 0.6; }
        .lang-item-soon {
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #A89968;
        }

        .floating-mark {
          position: absolute;
          font-family: 'Fraunces', serif;
          color: rgba(107, 158, 127, 0.08);
          font-size: 320px;
          line-height: 0.8;
          font-weight: 300;
          pointer-events: none;
          user-select: none;
        }

        .divider-line {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(168, 153, 104, 0.3), transparent);
        }

        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>

      <div className="grain"></div>

      {/* NAVBAR */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: scrolled ? 'rgba(245, 243, 240, 0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(168, 153, 104, 0.15)' : '1px solid transparent',
        transition: 'all 0.3s ease',
        padding: '18px 0',
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

          {/* Logo */}
          <button onClick={() => scrollTo('top')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px', height: '28px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6B9E7F 0%, #A89968 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#FAF8F5',
              fontFamily: "'Fraunces', serif",
              fontSize: '14px',
              fontWeight: 500,
            }}>g</div>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: '22px', fontWeight: 500, color: '#3D4A52', letterSpacing: '-0.02em' }}>
              GlowWise
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hide-mobile" style={{ display: 'flex', gap: '36px', alignItems: 'center' }}>
            <button onClick={() => scrollTo('how')} className="nav-link">How it works</button>
            <button onClick={() => scrollTo('features')} className="nav-link">Features</button>
            <button onClick={() => scrollTo('pricing')} className="nav-link">Pricing</button>
            <button onClick={() => scrollTo('faq')} className="nav-link">FAQ</button>
          </div>

          {/* Right cluster */}
          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '20px', position: 'relative' }}>

            {/* Language switcher */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: '#3D4A52', padding: '8px' }}
              >
                <Globe size={16} strokeWidth={1.5} />
                <span style={{ fontSize: '13px', fontFamily: "'Manrope', sans-serif" }}>EN</span>
              </button>
              {langOpen && (
                <div className="lang-dropdown">
                  <div className="lang-item active">
                    English
                    <Check size={14} strokeWidth={2} />
                  </div>
                  <div className="lang-item disabled">
                    Français
                    <span className="lang-item-soon">Soon</span>
                  </div>
                  <div className="lang-item disabled">
                    العربية
                    <span className="lang-item-soon">Soon</span>
                  </div>
                  <div className="lang-item disabled">
                    Español
                    <span className="lang-item-soon">Soon</span>
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => navigate('/login')} className="nav-link">Login</button>
            <button onClick={() => navigate('/signup')} className="btn-primary" style={{ padding: '11px 22px', fontSize: '14px' }}>Start free</button>
          </div>

          {/* Mobile burger */}
          <button
            className="show-mobile"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3D4A52' }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="show-mobile" style={{
            background: '#FAF8F5',
            borderTop: '1px solid rgba(168, 153, 104, 0.15)',
            marginTop: '18px',
            padding: '24px 32px',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <button onClick={() => scrollTo('how')} className="nav-link" style={{ textAlign: 'left' }}>How it works</button>
              <button onClick={() => scrollTo('features')} className="nav-link" style={{ textAlign: 'left' }}>Features</button>
              <button onClick={() => scrollTo('pricing')} className="nav-link" style={{ textAlign: 'left' }}>Pricing</button>
              <button onClick={() => scrollTo('faq')} className="nav-link" style={{ textAlign: 'left' }}>FAQ</button>
              <div className="divider-line"></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#A89968', fontSize: '13px' }}>
                <Globe size={14} /> English (more languages coming soon)
              </div>
              <button onClick={() => navigate('/login')} className="nav-link" style={{ textAlign: 'left' }}>Login</button>
              <button onClick={() => navigate('/signup')} className="btn-primary">Start free</button>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="top" style={{ paddingTop: '140px', paddingBottom: '120px', position: 'relative', overflow: 'hidden' }}>
        <div className="floating-mark hide-mobile" style={{ top: '60px', right: '-60px' }}>g</div>

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
         <div style={{ maxWidth: '720px' }}>

            {/* Left: copy */}
            <div className="fade-up">
              <div className="eyebrow" style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ width: '24px', height: '1px', background: '#A89968' }}></span>
                Your personal AI wellness coach
              </div>

              <h1 className="display" style={{ fontSize: 'clamp(40px, 5.5vw, 76px)', lineHeight: 1.05, marginBottom: '32px', color: '#3D4A52' }}>
                Understand <em style={{ fontStyle: 'italic', color: '#6B9E7F' }}>your body.</em><br />
                Act with clarity.
              </h1>

              <p style={{ fontSize: '18px', lineHeight: 1.6, color: '#5A6770', marginBottom: '40px', maxWidth: '560px' }}>
  <span style={{ fontWeight: 600, color: '#3D4A52' }}>Energy crashes. Hormonal breakouts. Hair shedding. Brain fog.</span><br />
  See what's really causing yours, based on your data — not generic advice.
</p>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '32px' }}>
                <button onClick={() => navigate('/signup')} className="btn-primary">
                  Start free today <ArrowRight size={16} strokeWidth={2} />
                </button>
                <button className="btn-secondary" onClick={() => scrollTo('how')}>
                  See how it works
                </button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px 28px', fontSize: '12px', color: '#A89968', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#A89968' }}></span>
                  Built for women &amp; men
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#A89968' }}></span>
                  Encrypted &amp; private
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#A89968' }}></span>
                  Wellness, not medical advice
                </span>
              </div>
            </div>
          </div>
        </div>
  </section>

 {/* SAMPLES — See it in action (animated) */}
      <section style={{ background: '#D4E8DD', padding: '120px 0', position: 'relative' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 60px' }}>
            <div className="eyebrow" style={{ marginBottom: '20px' }}>See it in action</div>
<h2 className="display" style={{ fontSize: 'clamp(32px, 4.5vw, 56px)', lineHeight: 1.1, marginBottom: '20px', color: '#3D4A52' }}>
  This is why <em style={{ fontStyle: 'italic', color: '#557E64' }}>generic advice</em> doesn't work.
</h2>
<p style={{ fontSize: '17px', lineHeight: 1.6, color: '#5A6770' }}>
  GlowWise connects your symptoms to patterns, not guesses.
</p>
          </div>

          <AnimatedCoachDemo />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ padding: '120px 0', position: 'relative' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 80px' }}>
            <div className="eyebrow" style={{ marginBottom: '20px' }}>How it works</div>
            <h2 className="display" style={{ fontSize: 'clamp(32px, 4.5vw, 56px)', lineHeight: 1.1, color: '#3D4A52' }}>
              Three steps to <em style={{ fontStyle: 'italic', color: '#6B9E7F' }}>clarity.</em>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '48px', maxWidth: '1080px', margin: '0 auto' }}>
            {[
              { num: '01', title: 'Check in daily', desc: '60 seconds. Energy, sleep, stress, mood. That\'s it.' },
              { num: '02', title: 'Your coach learns you', desc: 'The AI spots patterns you\'d never catch alone — like how your sleep affects your skin.' },
              { num: '03', title: 'Get guidance that fits', desc: 'Personalised next steps based on your data, not someone else\'s body.' },
            ].map((step, i) => (
              <div key={i} style={{ textAlign: 'left' }}>
                <div className="step-circle">{step.num}</div>
                <h3 className="display" style={{ fontSize: '24px', marginBottom: '12px', color: '#3D4A52', fontWeight: 500 }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '15px', lineHeight: 1.65, color: '#5A6770' }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY GLOWWISE — Features */}
      <section id="features" style={{ background: '#FAF8F5', padding: '120px 0', position: 'relative' }}>
        <div className="container">
          <div style={{ maxWidth: '760px', margin: '0 auto 80px', textAlign: 'center' }}>
            <div className="eyebrow" style={{ marginBottom: '20px' }}>Why GlowWise</div>
            <h2 className="display" style={{ fontSize: 'clamp(32px, 4.5vw, 56px)', lineHeight: 1.1, marginBottom: '20px', color: '#3D4A52' }}>
              Most wellness advice isn't wrong.<br />
              <em style={{ fontStyle: 'italic', color: '#6B9E7F' }}>It's just not yours.</em>
            </h2>
            <p style={{ fontSize: '17px', lineHeight: 1.6, color: '#5A6770' }}>
              Generic tips don't work because your body isn't generic. GlowWise is built differently.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <div style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: '13px',
                  color: '#A89968',
                  marginBottom: '20px',
                  letterSpacing: '0.05em',
                }}>{f.num}</div>
                <h3 className="display" style={{ fontSize: '22px', marginBottom: '14px', color: '#3D4A52', fontWeight: 500 }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '15px', lineHeight: 1.65, color: '#5A6770' }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '64px' }}>
            <p className="display" style={{ fontStyle: 'italic', fontSize: '20px', color: '#A89968', lineHeight: 1.5 }}>
              Holistic. Non-diagnostic. Privacy-first. Built for women and men.
            </p>
          </div>
        </div>
      </section>
{/* COMPARISON */}
      <section style={{ padding: '120px 0', background: '#FAF8F5', position: 'relative' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div className="eyebrow" style={{ marginBottom: '20px' }}>The difference</div>
            <h2 className="display" style={{ fontSize: 'clamp(32px, 4.5vw, 56px)', lineHeight: 1.1, color: '#3D4A52' }}>
              GlowWise vs <em style={{ fontStyle: 'italic', color: '#A89968' }}>everything else.</em>
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            background: '#F5F3F0',
            border: '1px solid rgba(168, 153, 104, 0.2)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}>
            {/* Header row */}
            <div style={{ padding: '20px 28px', borderBottom: '1px solid rgba(168, 153, 104, 0.2)', borderRight: '1px solid rgba(168, 153, 104, 0.2)' }}>
              <div className="eyebrow" style={{ color: '#A89968' }}>Others</div>
            </div>
            <div style={{ padding: '20px 28px', borderBottom: '1px solid rgba(168, 153, 104, 0.2)', background: '#EDF4EF' }}>
              <div className="eyebrow" style={{ color: '#557E64' }}>GlowWise</div>
            </div>

            {[
              { left: 'Generic advice', right: 'Learns your patterns' },
              { left: 'One-off answers', right: 'Tracks trends over time' },
              { left: 'No memory', right: 'Builds your health profile' },
              { left: 'Overwhelming info', right: 'Clear next steps' },
              { left: 'Same advice for everyone', right: 'Built around your body' },
            ].map((row, i, arr) => (
              <React.Fragment key={i}>
                <div style={{
                  padding: '22px 28px',
                  borderRight: '1px solid rgba(168, 153, 104, 0.2)',
                  borderBottom: i < arr.length - 1 ? '1px solid rgba(168, 153, 104, 0.15)' : 'none',
                  fontSize: '15px',
                  color: '#A89968',
                  fontFamily: "'Manrope', sans-serif",
                }}>
                  {row.left}
                </div>
                <div style={{
                  padding: '22px 28px',
                  background: '#EDF4EF',
                  borderBottom: i < arr.length - 1 ? '1px solid rgba(168, 153, 104, 0.15)' : 'none',
                  fontSize: '15px',
                  color: '#3D4A52',
                  fontWeight: 500,
                  fontFamily: "'Manrope', sans-serif",
                }}>
                  {row.right}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>
      {/* PRICING */}
      <section id="pricing" style={{ padding: '120px 0', background: '#EDF4EF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 64px' }}>
            <div className="eyebrow" style={{ marginBottom: '20px' }}>Pricing</div>
            <h2 className="display" style={{ fontSize: 'clamp(32px, 4.5vw, 56px)', lineHeight: 1.1, marginBottom: '20px', color: '#3D4A52' }}>
              Simple pricing. <em style={{ fontStyle: 'italic', color: '#6B9E7F' }}>No surprises.</em>
            </h2>
            <p style={{ fontSize: '17px', lineHeight: 1.6, color: '#5A6770' }}>
              Start free. Upgrade only if you want unlimited access.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', maxWidth: '880px', margin: '0 auto' }}>

            {/* Free */}
            <div className="pricing-card">
              <div className="eyebrow" style={{ marginBottom: '20px' }}>Free</div>
              <div style={{ marginBottom: '20px' }}>
  <span className="display price-amount" style={{ fontSize: '52px', fontWeight: 400, color: '#3D4A52' }}>£0</span>
  <span style={{ fontSize: '15px', color: '#A89968', marginLeft: '8px' }}>/ forever</span>
</div>
<div style={{
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  background: '#EDF4EF',
  color: '#557E64',
  padding: '6px 14px',
  borderRadius: '100px',
  fontSize: '12px',
  fontWeight: 600,
  marginBottom: '32px',
  border: '1px solid rgba(107, 158, 127, 0.25)',
}}>
  <Check size={12} strokeWidth={2.5} />
  No credit card needed
</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '36px' }}>
                {[
                  '2 questions per day to your AI Coach',
                  'Daily wellness tracking',
                  'Basic pattern insights',
                  '1 photo upload per month',
                  'Chat history'
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '14px', color: '#3D4A52' }}>
                    <Check size={16} strokeWidth={2} style={{ color: '#6B9E7F', marginTop: '2px', flexShrink: 0 }} />
                    {item}
                  </div>
                ))}
              </div>

              <button onClick={() => navigate('/signup')} className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                Start free
              </button>
            </div>

            {/* Wellness Coach */}
            <div className="pricing-card featured" style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#A89968',
                color: '#FAF8F5',
                padding: '5px 14px',
                borderRadius: '100px',
                fontSize: '10px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}>Most popular</div>

              <div className="eyebrow" style={{ marginBottom: '20px', color: '#D4E8DD' }}>Wellness Coach</div>
              <div style={{ marginBottom: '32px' }}>
                <span className="display price-amount" style={{ fontSize: '52px', fontWeight: 400 }}>£4.99</span>
                <span style={{ fontSize: '15px', color: '#D4E8DD', marginLeft: '8px' }}>/ month</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '36px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#FAF8F5', opacity: 0.85, marginBottom: '4px' }}>Get the full GlowWise experience:</div>
                {[
                  'Unlimited AI Coach access',
                  'Deeper personalisation over time',
                  'Photo progression tracking',
                  'Advanced pattern detection',
                  'Weekly wellness insights',
                  'Cancel anytime'
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '14px', color: '#FAF8F5' }}>
                    <Check size={16} strokeWidth={2} style={{ color: '#D4E8DD', marginTop: '2px', flexShrink: 0 }} />
                    {item}
                  </div>
                ))}
              </div>

              <button onClick={() => navigate('/signup')} style={{
                background: '#FAF8F5',
                color: '#557E64',
                padding: '14px 24px',
                border: 'none',
                borderRadius: '100px',
                fontFamily: "'Manrope', sans-serif",
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                width: '100%',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => { e.target.style.background = '#FFFFFF'; e.target.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.target.style.background = '#FAF8F5'; e.target.style.transform = 'translateY(0)'; }}
              >
                Start Wellness Coach
              </button>
            </div>
          </div>

          <p style={{ textAlign: 'center', marginTop: '28px', fontSize: '13px', color: '#A89968', fontStyle: 'italic' }}>
            Cancel anytime. Fair-use policy applies to unlimited access.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: '120px 0' }}>
        <div className="container" style={{ maxWidth: '880px' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div className="eyebrow" style={{ marginBottom: '20px' }}>FAQ</div>
            <h2 className="display" style={{ fontSize: 'clamp(32px, 4.5vw, 56px)', lineHeight: 1.1, color: '#3D4A52' }}>
              Questions, <em style={{ fontStyle: 'italic', color: '#6B9E7F' }}>answered honestly.</em>
            </h2>
          </div>

          <div>
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item">
                <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {faq.q}
                  {openFaq === i ? <Minus size={18} strokeWidth={1.5} /> : <Plus size={18} strokeWidth={1.5} />}
                </button>
                {openFaq === i && (
                  <div className="faq-answer fade-up">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ background: '#6B9E7F', padding: '120px 0', position: 'relative', overflow: 'hidden' }}>
        <div className="floating-mark" style={{ top: '-40px', left: '-40px', color: 'rgba(250, 248, 245, 0.06)' }}>g</div>

        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '720px' }}>
          <h2 className="display" style={{ fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1.1, marginBottom: '20px', color: '#FAF8F5' }}>
            Ready to understand <em style={{ fontStyle: 'italic', color: '#D4E8DD' }}>your body?</em>
          </h2>
          <p style={{ fontSize: '18px', lineHeight: 1.6, color: '#D4E8DD', marginBottom: '40px' }}>
            Start free. Two questions a day. No credit card.
          </p>

          <button onClick={() => navigate('/signup')} style={{
            background: '#FAF8F5',
            color: '#557E64',
            padding: '16px 32px',
            border: 'none',
            borderRadius: '100px',
            fontFamily: "'Manrope', sans-serif",
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 12px 28px rgba(0,0,0,0.15)'; }}
          onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}
          >
            Start your wellness journey <ArrowRight size={16} strokeWidth={2} />
          </button>

          <p style={{ marginTop: '24px', fontSize: '13px', color: '#D4E8DD', opacity: 0.85 }}>
            Be among the first to try GlowWise.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#3D4A52', color: '#D4E8DD', padding: '80px 0 32px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '48px', marginBottom: '60px' }}>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div style={{
                  width: '28px', height: '28px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6B9E7F 0%, #A89968 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#FAF8F5',
                  fontFamily: "'Fraunces', serif",
                  fontSize: '14px',
                }}>g</div>
                <span style={{ fontFamily: "'Fraunces', serif", fontSize: '22px', fontWeight: 500, color: '#FAF8F5' }}>
                  GlowWise
                </span>
              </div>
              <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#A89968', marginBottom: '16px' }}>
                Your AI wellness coach.
              </p>
              <p style={{ fontSize: '12px', lineHeight: 1.5, color: '#A89968', opacity: 0.8 }}>
                GlowWise provides wellness guidance, not medical advice.
              </p>
            </div>

            <div>
              <div className="eyebrow" style={{ color: '#A89968', marginBottom: '20px' }}>Product</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['How it works', 'Features', 'Pricing', 'FAQ'].map((link, i) => (
                  <span key={i} style={{ fontSize: '14px', color: '#D4E8DD', cursor: 'pointer' }}
                    onMouseEnter={(e) => e.target.style.color = '#FAF8F5'}
                    onMouseLeave={(e) => e.target.style.color = '#D4E8DD'}
                    onClick={() => {
                      const targetMap = { 'How it works': 'how', 'Features': 'features', 'Pricing': 'pricing', 'FAQ': 'faq' };
                      scrollTo(targetMap[link]);
                    }}
                  >{link}</span>
                ))}
              </div>
            </div>

            <div>
                  <div className="eyebrow" style={{ color: '#A89968', marginBottom: '20px' }}>Company &amp; Legal</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { label: 'Contact', path: '/contact' },
                      { label: 'Privacy Policy', path: '/privacy' },
                      { label: 'Terms of Service', path: '/terms' },
                      { label: 'Cookie Policy', path: '/cookies' },
                      { label: 'Medical Disclaimer', path: '/disclaimer' },
                    ].map((link, i) => (
                    <a
                        key={i}
                        href={link.path}
                        style={{ fontSize: '14px', color: '#D4E8DD', cursor: 'pointer', textDecoration: 'none' }}
                        onMouseEnter={(e) => e.target.style.color = '#FAF8F5'}
                        onMouseLeave={(e) => e.target.style.color = '#D4E8DD'}
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>

            <div>
              <div className="eyebrow" style={{ color: '#A89968', marginBottom: '20px' }}>Stay in touch</div>
              <p style={{ fontSize: '13px', color: '#D4E8DD', marginBottom: '16px', lineHeight: 1.5 }}>
                Monthly wellness insights. No spam.
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  style={{
                    flex: 1,
                    background: 'rgba(250, 248, 245, 0.08)',
                    border: '1px solid rgba(168, 153, 104, 0.3)',
                    borderRadius: '100px',
                    padding: '10px 16px',
                    fontSize: '13px',
                    color: '#FAF8F5',
                    fontFamily: "'Manrope', sans-serif",
                    outline: 'none',
                  }}
                />
                <button style={{
                  background: '#6B9E7F',
                  color: '#FAF8F5',
                  border: 'none',
                  borderRadius: '100px',
                  padding: '10px 18px',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: "'Manrope', sans-serif",
                }}>Subscribe</button>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(168, 153, 104, 0.2)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <p style={{ fontSize: '12px', color: '#A89968' }}>© 2026 GlowWise · Made with care in the UK</p>
            <p style={{ fontSize: '12px', color: '#A89968' }}>glowwise.app</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
