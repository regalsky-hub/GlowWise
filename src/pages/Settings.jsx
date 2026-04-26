import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserData } from '../context/UserDataContext';
import AppLayout from './AppLayout';
import { LogOut, AlertCircle, Download, Shield, Mail, Calendar, BellOff, Check } from 'lucide-react';

export default function Settings() {
  const { user, logout } = useAuth();
  const { profile, updateProfile } = useUserData();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [notificationFrequency, setNotificationFrequency] = useState(profile?.notification_frequency || 'daily');

  const handleSavePreferences = async () => {
    setSaving(true);
    try {
      await updateProfile({ notification_frequency: notificationFrequency });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) { console.error(e); } finally { setSaving(false); }
  };

  const handleLogout = async () => {
    try { await logout(); navigate('/'); } catch (e) { console.error(e); }
  };

  const notifOptions = [
    { id: 'daily', icon: Mail, label: 'Daily check-in reminders', desc: 'A gentle nudge each morning' },
    { id: 'weekly', icon: Calendar, label: 'Weekly wellness summary', desc: 'A digest every Sunday' },
    { id: 'never', icon: BellOff, label: 'No emails', desc: 'Quiet mode' },
  ];

  return (
    <AppLayout>
      <style>{`
        .display { font-family: 'Fraunces', Georgia, serif; font-weight: 400; letter-spacing: -0.02em; }
        .eyebrow { font-family: 'Manrope', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: #A89968; }
        .fade-up { animation: fu 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
        @keyframes fu { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .card { background: #FAF8F5; border: 1px solid rgba(168, 153, 104, 0.15); border-radius: 12px; padding: 28px; }
        .choice-card { width: 100%; background: #FAF8F5; border: 1px solid rgba(168, 153, 104, 0.25); border-radius: 8px; padding: 14px 16px; font-family: 'Manrope', sans-serif; font-size: 15px; color: #3D4A52; cursor: pointer; transition: all 0.2s; text-align: left; display: flex; align-items: center; gap: 12px; }
        .choice-card:hover { border-color: #6B9E7F; }
        .choice-card.selected { background: #EDF4EF; border-color: #6B9E7F; color: #557E64; }
        .btn-primary { background: #6B9E7F; color: #FAF8F5; padding: 12px 24px; border: none; border-radius: 100px; font-family: 'Manrope', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.3s; }
        .btn-primary:hover:not(:disabled) { background: #557E64; }
        .btn-danger { background: transparent; color: #CC4444; padding: 14px 24px; border: 1px solid rgba(204, 68, 68, 0.4); border-radius: 100px; font-family: 'Manrope', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 8px; }
        .btn-danger:hover { background: rgba(204, 68, 68, 0.08); border-color: #CC4444; }
        .priority-pill { display: inline-flex; align-items: center; padding: 8px 14px; background: #EDF4EF; border: 1px solid rgba(107, 158, 127, 0.25); border-radius: 100px; font-size: 12px; font-weight: 500; color: #557E64; }
      `}</style>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 24px' }}>
        <div className="fade-up" style={{ marginBottom: '40px' }}>
          <div className="eyebrow" style={{ marginBottom: '12px' }}>Settings</div>
          <h1 className="display" style={{ fontSize: 'clamp(32px, 5vw, 44px)', lineHeight: 1.1, color: '#3D4A52' }}>
            Your <em style={{ fontStyle: 'italic', color: '#6B9E7F' }}>account.</em>
          </h1>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Account */}
          <div className="card fade-up">
            <h2 className="display" style={{ fontSize: '22px', color: '#3D4A52', marginBottom: '20px', fontWeight: 500 }}>Account</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div className="eyebrow" style={{ marginBottom: '6px' }}>Email</div>
                <p style={{ fontSize: '15px', color: '#3D4A52', fontWeight: 500 }}>{user?.email}</p>
              </div>
              {profile?.name && (
                <div>
                  <div className="eyebrow" style={{ marginBottom: '6px' }}>Name</div>
                  <p style={{ fontSize: '15px', color: '#3D4A52', fontWeight: 500 }}>{profile.name}</p>
                </div>
              )}
              {profile?.glowType && (
                <div>
                  <div className="eyebrow" style={{ marginBottom: '6px' }}>Your Glow Type</div>
                  <p className="display" style={{ fontSize: '17px', color: '#7A5C77', fontStyle: 'italic', fontWeight: 500 }}>{profile.glowType}</p>
                </div>
              )}
              {profile?.focusAreas?.length > 0 && (
                <div>
                  <div className="eyebrow" style={{ marginBottom: '10px' }}>Focus areas</div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {profile.focusAreas.map((p, i) => <span key={i} className="priority-pill">{p}</span>)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="card fade-up">
            <h2 className="display" style={{ fontSize: '22px', color: '#3D4A52', marginBottom: '20px', fontWeight: 500 }}>Notifications</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {notifOptions.map(opt => {
                const Icon = opt.icon;
                const selected = notificationFrequency === opt.id;
                return (
                  <button key={opt.id} onClick={() => setNotificationFrequency(opt.id)} className={`choice-card ${selected ? 'selected' : ''}`}>
                    <Icon size={18} strokeWidth={1.6} style={{ color: selected ? '#6B9E7F' : '#A89968' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{opt.label}</div>
                      <div style={{ fontSize: '12px', color: '#A89968', marginTop: '2px', fontWeight: 400 }}>{opt.desc}</div>
                    </div>
                    {selected && <Check size={18} strokeWidth={2} style={{ color: '#6B9E7F' }} />}
                  </button>
                );
              })}
            </div>
            <button onClick={handleSavePreferences} disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : 'Save preferences'}
            </button>
            {success && (
              <p style={{ fontSize: '13px', color: '#6B9E7F', marginTop: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Check size={14} strokeWidth={2.5} /> Saved
              </p>
            )}
          </div>

          {/* Privacy */}
          <div className="card fade-up">
            <h2 className="display" style={{ fontSize: '22px', color: '#3D4A52', marginBottom: '20px', fontWeight: 500 }}>Privacy &amp; data</h2>
            <div style={{ background: 'rgba(212, 232, 221, 0.5)', borderLeft: '3px solid #6B9E7F', borderRadius: '4px', padding: '14px 16px', fontSize: '13px', color: '#557E64', marginBottom: '16px', display: 'flex', gap: '10px' }}>
              <Shield size={16} strokeWidth={1.8} style={{ color: '#6B9E7F', flexShrink: 0, marginTop: '2px' }} />
              <div>All your data is encrypted. You can delete any message, export everything, or close your account anytime.</div>
            </div>
            <button className="choice-card">
              <Download size={18} strokeWidth={1.6} style={{ color: '#A89968' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>Export my data</div>
                <div style={{ fontSize: '12px', color: '#A89968', marginTop: '2px', fontWeight: 400 }}>Download all your wellness data (GDPR)</div>
              </div>
            </button>
          </div>

          {/* Legal */}
          <div className="card fade-up">
            <h2 className="display" style={{ fontSize: '22px', color: '#3D4A52', marginBottom: '20px', fontWeight: 500 }}>Legal</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a href="/privacy" className="choice-card" style={{ textDecoration: 'none' }}>
                <div style={{ flex: 1, fontWeight: 600, color: '#557E64' }}>Privacy Policy</div>
              </a>
              <a href="/terms" className="choice-card" style={{ textDecoration: 'none' }}>
                <div style={{ flex: 1, fontWeight: 600, color: '#557E64' }}>Terms of Service</div>
              </a>
            </div>
          </div>

          {/* Logout */}
          <button onClick={handleLogout} className="btn-danger" style={{ width: '100%', justifyContent: 'center' }}>
            <LogOut size={16} strokeWidth={2} /> Log out
          </button>

          {/* Delete Account */}
          <div className="card fade-up" style={{ borderColor: 'rgba(204, 68, 68, 0.3)' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '16px' }}>
              <AlertCircle size={20} strokeWidth={1.8} style={{ color: '#CC4444', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h3 className="display" style={{ fontSize: '18px', color: '#CC4444', fontWeight: 500, marginBottom: '6px' }}>Delete account</h3>
                <p style={{ fontSize: '13px', color: '#5A6770', lineHeight: 1.5 }}>Permanently delete your account and all data. This cannot be undone.</p>
              </div>
            </div>
            {!showDeleteConfirm ? (
              <button onClick={() => setShowDeleteConfirm(true)} className="btn-danger" style={{ width: '100%', justifyContent: 'center' }}>Delete my account</button>
            ) : (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setShowDeleteConfirm(false)} style={{ flex: 1, background: 'transparent', color: '#5A6770', padding: '12px', border: '1px solid rgba(168, 153, 104, 0.4)', borderRadius: '100px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
                <button onClick={handleLogout} style={{ flex: 1, background: '#CC4444', color: '#FAF8F5', padding: '12px', border: 'none', borderRadius: '100px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Yes, delete</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
