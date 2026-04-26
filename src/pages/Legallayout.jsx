import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function LegalLayout({ eyebrow, title, lastUpdated, children }) {
  useEffect(() => {
    if (!document.getElementById('glowwise-fonts')) {
      const link = document.createElement('link');
      link.id = 'glowwise-fonts';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Manrope:wght@300;400;500;600;700&display=swap';
      document.head.appendChild(link);
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#F5F3F0', fontFamily: "'Manrope', system-ui, sans-serif", color: '#3D4A52', position: 'relative' }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .display { font-family: 'Fraunces', Georgia, serif; font-weight: 400; letter-spacing: -0.02em; }
        .eyebrow { font-family: 'Manrope', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: #A89968; }
        .grain::before { content: ''; position: fixed; inset: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E"); opacity: 0.04; pointer-events: none; z-index: 1; }
        .legal-content h2 { font-family: 'Fraunces', Georgia, serif; font-size: 22px; font-weight: 500; color: #3D4A52; margin-top: 36px; margin-bottom: 14px; letter-spacing: -0.01em; }
        .legal-content h3 { font-family: 'Manrope', sans-serif; font-size: 15px; font-weight: 600; color: #3D4A52; margin-top: 22px; margin-bottom: 10px; }
        .legal-content p { font-size: 15px; line-height: 1.7; color: #5A6770; margin-bottom: 14px; }
        .legal-content ul { margin: 10px 0 18px 22px; }
        .legal-content li { font-size: 15px; line-height: 1.7; color: #5A6770; margin-bottom: 6px; }
        .legal-content a { color: #6B9E7F; text-decoration: none; border-bottom: 1px solid rgba(107, 158, 127, 0.3); }
        .legal-content a:hover { border-bottom-color: #6B9E7F; }
        .legal-content strong { color: #3D4A52; font-weight: 600; }
        .info-box { background: rgba(212, 232, 221, 0.5); border-left: 3px solid #6B9E7F; border-radius: 4px; padding: 18px 22px; margin: 24px 0; font-size: 14px; color: #557E64; line-height: 1.6; }
        .warning-box { background: #F5DDD0; border-left: 3px solid #C97B5C; border-radius: 4px; padding: 18px 22px; margin: 24px 0; font-size: 14px; color: #8B4A30; line-height: 1.6; }
        .back-link { display: inline-flex; align-items: center; gap: 6px; color: #5A6770; font-size: 13px; font-weight: 500; text-decoration: none; padding: 8px 14px; border-radius: 100px; transition: all 0.2s; }
        .back-link:hover { background: rgba(168, 153, 104, 0.12); color: #3D4A52; }
      `}</style>

      <div className="grain"></div>

      {/* Top bar */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(245, 243, 240, 0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(168, 153, 104, 0.15)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #6B9E7F 0%, #A89968 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FAF8F5', fontFamily: "'Fraunces', serif", fontSize: '15px', fontWeight: 500 }}>g</div>
            <span className="display" style={{ fontSize: '22px', fontWeight: 500, color: '#3D4A52' }}>GlowWise</span>
          </Link>
          <Link to="/" className="back-link">
            <ArrowLeft size={14} strokeWidth={2} /> Home
          </Link>
        </div>
      </header>

      <main style={{ position: 'relative', zIndex: 2, maxWidth: '760px', margin: '0 auto', padding: '60px 32px 80px' }}>
        <div style={{ marginBottom: '40px' }}>
          <div className="eyebrow" style={{ marginBottom: '14px' }}>{eyebrow}</div>
          <h1 className="display" style={{ fontSize: 'clamp(36px, 5vw, 52px)', lineHeight: 1.1, color: '#3D4A52', marginBottom: '14px' }}>
            {title}
          </h1>
          {lastUpdated && (
            <p style={{ fontSize: '13px', color: '#A89968', letterSpacing: '0.02em' }}>Last updated: {lastUpdated}</p>
          )}
        </div>

        <div className="legal-content">
          {children}
        </div>

        {/* Footer nav between legal pages */}
        <div style={{ marginTop: '60px', paddingTop: '32px', borderTop: '1px solid rgba(168, 153, 104, 0.2)', display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
          <Link to="/contact" style={{ color: '#5A6770', fontSize: '13px', textDecoration: 'none', fontWeight: 500 }}>Contact</Link>
          <Link to="/privacy" style={{ color: '#5A6770', fontSize: '13px', textDecoration: 'none', fontWeight: 500 }}>Privacy Policy</Link>
          <Link to="/terms" style={{ color: '#5A6770', fontSize: '13px', textDecoration: 'none', fontWeight: 500 }}>Terms of Service</Link>
          <Link to="/cookies" style={{ color: '#5A6770', fontSize: '13px', textDecoration: 'none', fontWeight: 500 }}>Cookie Policy</Link>
          <Link to="/disclaimer" style={{ color: '#5A6770', fontSize: '13px', textDecoration: 'none', fontWeight: 500 }}>Medical Disclaimer</Link>
        </div>
      </main>
    </div>
  );
}
