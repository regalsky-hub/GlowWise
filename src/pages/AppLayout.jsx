import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Settings, LogOut, Bell, Home, Calendar, MessageCircle, BarChart3 } from 'lucide-react';

export default function AppLayout({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!document.getElementById('glowwise-fonts')) {
      const link = document.createElement('link');
      link.id = 'glowwise-fonts';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Manrope:wght@300;400;500;600;700&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  const handleLogout = async () => {
    try { await logout(); navigate('/'); } catch (e) { console.error(e); }
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/checkin', icon: Calendar, label: 'Check-in' },
    { path: '/ai-coach', icon: MessageCircle, label: 'Coach' },
    { path: '/insights', icon: BarChart3, label: 'Insights' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div style={{ background: '#F5F3F0', minHeight: '100vh', fontFamily: "'Manrope', system-ui, sans-serif", color: '#3D4A52', paddingBottom: '80px' }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .nav-icon-btn { background: transparent; border: none; padding: 8px; border-radius: 8px; cursor: pointer; color: #5A6770; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .nav-icon-btn:hover { background: rgba(168, 153, 104, 0.12); color: #3D4A52; }
        .mobile-nav-item { background: none; border: none; cursor: pointer; padding: 10px 6px; display: flex; flex-direction: column; align-items: center; gap: 4px; color: #A89968; transition: color 0.2s; flex: 1; }
        .mobile-nav-item.active { color: #6B9E7F; }
        .grain::before { content: ''; position: fixed; inset: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E"); opacity: 0.04; pointer-events: none; z-index: 1; }
        @media (max-width: 768px) { .desktop-only { display: none !important; } }
        @media (min-width: 769px) { .mobile-only { display: none !important; } }
      `}</style>

      <div className="grain"></div>

      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(245, 243, 240, 0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(168, 153, 104, 0.15)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #6B9E7F 0%, #A89968 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FAF8F5', fontFamily: "'Fraunces', serif", fontSize: '15px', fontWeight: 500 }}>g</div>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: '22px', fontWeight: 500, color: '#3D4A52', letterSpacing: '-0.02em' }}>GlowWise</span>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button className="nav-icon-btn" aria-label="Notifications"><Bell size={18} strokeWidth={1.6} /></button>
            <button className="nav-icon-btn" onClick={() => navigate('/settings')} aria-label="Settings"><Settings size={18} strokeWidth={1.6} /></button>
            <button className="nav-icon-btn" onClick={handleLogout} aria-label="Logout" style={{ color: '#A89968' }}><LogOut size={18} strokeWidth={1.6} /></button>
          </div>
        </div>
      </header>

      <main style={{ position: 'relative', zIndex: 2 }}>{children}</main>

      <nav className="mobile-only" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(245, 243, 240, 0.96)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(168, 153, 104, 0.2)', padding: '8px 12px env(safe-area-inset-bottom, 8px)', display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 50 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.path} onClick={() => navigate(item.path)} className={`mobile-nav-item ${isActive(item.path) ? 'active' : ''}`}>
              <Icon size={20} strokeWidth={1.8} />
              <span style={{ fontSize: '10px', fontWeight: 500 }}>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
