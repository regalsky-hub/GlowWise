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
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/checkin', icon: Calendar, label: 'Check-in' },
    { path: '/ai-coach', icon: MessageCircle, label: 'Wellness Coach' },
    { path: '/insights', icon: BarChart3, label: 'Insights' },
    { path: '/settings', icon: Settings, label: 'Profile' },
  ];

  const C = {
    paper: '#FAF8F5',
    ink: '#3D4A52',
    body: '#5A6770',
    mute: '#A89968',
    sage: '#6B9E7F',
    sageDark: '#557E64',
    sageMint: '#EDF4EF',
    line: 'rgba(168, 153, 104, 0.16)',
    lineSoft: 'rgba(168, 153, 104, 0.10)',
  };

  return (
    <div style={{ background: C.paper, minHeight: '100vh', fontFamily: "'Manrope', system-ui, sans-serif", color: C.ink, display: 'flex' }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        /* Desktop Sidebar */
        .sidebar {
          width: 240px;
          padding: 32px 18px;
          border-right: 1px solid ${C.lineSoft};
          background: ${C.paper};
          display: flex;
          flex-direction: column;
          gap: 4px;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
          z-index: 40;
        }
        
        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 8px 28px 8px;
          margin-bottom: 12px;
          cursor: pointer;
        }
        
        .sidebar-logo-mark {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6B9E7F 0%, #A89968 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FAF8F5;
          font-family: 'Fraunces', serif;
          font-size: 15px;
          font-weight: 500;
        }
        
        .sidebar-logo-text {
          font-family: 'Fraunces', serif;
          font-size: 22px;
          font-weight: 500;
          color: ${C.sageDark};
          letter-spacing: '-0.02em';
          white-space: nowrap;
        }
        
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 12px;
          background: transparent;
          border: none;
          color: ${C.body};
          font-family: 'Manrope', sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
          text-align: left;
          width: 100%;
        }
        
        .nav-item:hover {
          background: ${C.sageMint};
          color: ${C.sageDark};
        }
        
        .nav-item.active {
          background: ${C.sageMint};
          color: ${C.sageDark};
          font-weight: 600;
        }
        
        /* Header */
        .header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(245, 243, 240, 0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid ${C.lineSoft};
        }
        
        .header-content {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 32px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .header-logo-btn {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .nav-icon-btn {
          background: transparent;
          border: none;
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          color: #5A6770;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        
        .nav-icon-btn:hover {
          background: rgba(168, 153, 104, 0.12);
          color: ${C.ink};
        }
        
        /* Main Content */
        .main-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        
        .main-content {
          flex: 1;
          padding: 44px 48px 80px;
          max-width: 1280px;
          width: 100%;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }
        
        /* Mobile Bottom Nav */
        .mobile-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(245, 243, 240, 0.96);
          backdrop-filter: blur(12px);
          border-top: 1px solid ${C.lineSoft};
          padding: 8px 12px calc(8px + env(safe-area-inset-bottom, 8px));
          display: flex;
          justify-content: space-around;
          align-items: center;
          z-index: 50;
        }
        
        .mobile-nav-item {
          background: none;
          border: none;
          cursor: pointer;
          padding: 10px 6px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          color: ${C.mute};
          transition: color 0.2s;
          flex: 1;
          font-family: 'Manrope', sans-serif;
          font-size: 10px;
          font-weight: 500;
        }
        
        .mobile-nav-item.active {
          color: ${C.sageDark};
        }
        
        /* Grain texture */
        .grain::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E");
          opacity: 0.04;
          pointer-events: none;
          z-index: 1;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .sidebar {
            display: none !important;
          }
          
          .main-content {
            padding: 24px 18px 100px;
          }
          
          .header-content {
            padding: 0 18px;
          }
        }
        
        @media (min-width: 769px) {
          .mobile-nav {
            display: none !important;
          }
        }
      `}</style>

      <div className="grain"></div>

      {/* Desktop Sidebar - only shows on desktop */}
      <aside className="sidebar">
        <div className="sidebar-logo" onClick={() => navigate('/dashboard')}>
          <div className="sidebar-logo-mark">g</div>
          <div className="sidebar-logo-text">GlowWise</div>
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <Icon size={18} strokeWidth={1.6} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </aside>

      {/* Main Content Wrapper */}
      <div className="main-wrapper">
        {/* Header */}
        <header className="header">
          <div className="header-content">
            <button onClick={() => navigate('/dashboard')} className="header-logo-btn">
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #6B9E7F 0%, #A89968 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FAF8F5', fontFamily: "'Fraunces', serif", fontSize: '15px', fontWeight: 500 }}>g</div>
              <span style={{ fontFamily: "'Fraunces', serif", fontSize: '22px', fontWeight: 500, color: C.ink, letterSpacing: '-0.02em' }}>GlowWise</span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button className="nav-icon-btn" aria-label="Notifications"><Bell size={18} strokeWidth={1.6} /></button>
              <button className="nav-icon-btn" onClick={() => navigate('/settings')} aria-label="Settings"><Settings size={18} strokeWidth={1.6} /></button>
              <button className="nav-icon-btn" onClick={handleLogout} aria-label="Logout" style={{ color: C.mute }}><LogOut size={18} strokeWidth={1.6} /></button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="main-content">{children}</main>
      </div>

      {/* Mobile Bottom Nav - only shows on mobile */}
      <nav className="mobile-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`mobile-nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <Icon size={20} strokeWidth={1.8} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
