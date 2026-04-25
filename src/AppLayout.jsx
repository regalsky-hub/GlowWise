import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Settings, LogOut, Bell, Home, Calendar, MessageCircle, BarChart3 } from 'lucide-reac
export default function AppLayout({ children }) {
const { logout } = useAuth();
const navigate = useNavigate();
const location = useLocation();
useEffect(() => {
if (!document.getElementById('glowwise-fonts')) {
const link = document.createElement('link');
link.id = 'glowwise-fonts';
link.rel = 'stylesheet';
link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..
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
<div style={{ background: '#F5F3F0', minHeight: '100vh', fontFamily: "'Manrope', system-u
<style>{`
* { box-sizing: border-box; margin: 0; padding: 0; }
.nav-icon-btn { background: transparent; border: none; padding: 8px; border-radius: 8
.nav-icon-btn:hover { background: rgba(168, 153, 104, 0.12); color: #3D4A52; }
.mobile-nav-item { background: none; border: none; cursor: pointer; padding: 10px 6px
.mobile-nav-item.active { color: #6B9E7F; }
.grain::before { content: ''; position: fixed; inset: 0; background-image: url("data:
@media (max-width: 768px) { .desktop-only { display: none !important; } }
@media (min-width: 769px) { .mobile-only { display: none !important; } }
`}</style>
<div className="grain"></div>
<header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(245, 243, 24
<div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 32px', height: '64px'
<button onClick={() => navigate('/dashboard')} style={{ background: 'none', border:
<div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'li
<span style={{ fontFamily: "'Fraunces', serif", fontSize: '22px', fontWeight: 500
</button>
<div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
<button className="nav-icon-btn" aria-label="Notifications"><Bell size={18} strok
<button className="nav-icon-btn" onClick={() => navigate('/settings')} aria-label
<button className="nav-icon-btn" onClick={handleLogout} aria-label="Logout" style
</div>
</div>
</header>
<main style={{ position: 'relative', zIndex: 2 }}>{children}</main>
<nav className="mobile-only" style={{ position: 'fixed', bottom: 0, left: 0, right: 0,
{navItems.map((item) => {
const Icon = item.icon;
return (
<button key={item.path} onClick={() => navigate(item.path)} className={`mobile-na
<Icon size={20} strokeWidth={1.8} />
<span style={{ fontSize: '10px', fontWeight: 500 }}>{item.label}</span>
</button>
);
})}
</nav>
</div>
);
}
