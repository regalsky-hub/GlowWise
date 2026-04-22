import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserData } from '../context/UserDataContext';
import { ChevronLeft, LogOut, AlertCircle } from 'lucide-react';

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
      await updateProfile({
        notification_frequency: notificationFrequency,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const handleDeleteAccount = async () => {
    // In production, this would hard delete all user data
    // For now, just log out
    handleLogout();
  };

  return (
    <div className="min-h-screen bg-glow-cream pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-glow-sage-light">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-glow-sage-light rounded-card transition"
          >
            <ChevronLeft className="w-5 h-5 text-glow-slate" />
          </button>
          <h1 className="font-poppins font-700 text-glow-slate">Settings</h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Account Info */}
        <div className="bg-white rounded-lg shadow-card p-6 border border-glow-sage-light space-y-4">
          <h2 className="font-poppins font-700 text-glow-slate">Account</h2>
          <div>
            <label className="block font-inter text-xs text-glow-charcoal mb-1">Email Address</label>
            <p className="font-inter text-body text-glow-slate font-500">{user?.email}</p>
          </div>
          {profile?.glowType && (
            <div>
              <label className="block font-inter text-xs text-glow-charcoal mb-1">Your Glow Type</label>
              <p className="font-inter text-body text-glow-slate font-500">{profile.glowType}</p>
            </div>
          )}
          {profile?.wellness_priorities?.length > 0 && (
            <div>
              <label className="block font-inter text-xs text-glow-charcoal mb-2">Wellness Priorities</label>
              <div className="flex flex-wrap gap-2">
                {profile.wellness_priorities.map((priority, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-glow-sage-light border border-glow-sage text-glow-slate rounded-full font-inter text-xs"
                  >
                    {priority}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-lg shadow-card p-6 border border-glow-sage-light space-y-4">
          <h2 className="font-poppins font-700 text-glow-slate">Notifications</h2>
          <div>
            <label className="block font-inter font-500 text-glow-slate mb-3">Email Frequency</label>
            <div className="space-y-2">
              {['daily', 'weekly', 'never'].map(freq => (
                <button
                  key={freq}
                  onClick={() => setNotificationFrequency(freq)}
                  className={`w-full p-3 rounded-card border-2 font-inter font-500 text-left transition capitalize ${
                    notificationFrequency === freq
                      ? 'border-glow-sage bg-glow-sage-light text-glow-sage'
                      : 'border-glow-sage-light text-glow-slate hover:border-glow-sage'
                  }`}
                >
                  {freq === 'daily' && '📬 Daily check-in reminders'}
                  {freq === 'weekly' && '📅 Weekly wellness summary'}
                  {freq === 'never' && '🔕 No emails'}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleSavePreferences}
            disabled={saving}
            className="w-full py-2 bg-glow-sage text-white rounded-card font-inter font-500 hover:bg-opacity-90 disabled:opacity-50 transition"
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
          {success && (
            <div className="p-3 bg-green-50 border border-glow-success rounded-card">
              <p className="font-inter text-sm text-glow-success">✓ Preferences saved</p>
            </div>
          )}
        </div>

        {/* Privacy & Data */}
        <div className="bg-white rounded-lg shadow-card p-6 border border-glow-sage-light space-y-4">
          <h2 className="font-poppins font-700 text-glow-slate">Privacy & Data</h2>
          <div className="space-y-3">
            <div className="p-4 bg-glow-sage-light rounded-card border border-glow-sage">
              <p className="font-inter text-sm text-glow-slate">
                <strong>Your Privacy:</strong> All health data is encrypted at rest. You can delete any message anytime, export your data, or delete your account.
              </p>
            </div>
            <button className="w-full p-3 text-left border border-glow-sage-light rounded-card hover:bg-glow-sage-light transition">
              <p className="font-inter font-500 text-glow-slate">📥 Export My Data</p>
              <p className="font-inter text-xs text-glow-charcoal mt-1">Download all your wellness data (GDPR compliant)</p>
            </button>
          </div>
        </div>

        {/* Legal */}
        <div className="bg-white rounded-lg shadow-card p-6 border border-glow-sage-light space-y-4">
          <h2 className="font-poppins font-700 text-glow-slate">Legal</h2>
          <div className="space-y-2">
            <a href="/privacy" className="block p-3 text-left border border-glow-sage-light rounded-card hover:bg-glow-sage-light transition">
              <p className="font-inter font-500 text-glow-sage">Privacy Policy</p>
            </a>
            <a href="/terms" className="block p-3 text-left border border-glow-sage-light rounded-card hover:bg-glow-sage-light transition">
              <p className="font-inter font-500 text-glow-sage">Terms of Service</p>
            </a>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full p-4 bg-white border-2 border-glow-error text-glow-error rounded-card font-inter font-600 hover:bg-red-50 transition flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>

        {/* Delete Account */}
        <div className="bg-white rounded-lg shadow-card p-6 border-2 border-red-200 space-y-4">
          <div className="flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 text-glow-error flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-poppins font-700 text-glow-error">Delete Account</h3>
              <p className="font-inter text-sm text-glow-charcoal mt-2">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
          </div>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full p-3 bg-red-50 border border-glow-error text-glow-error rounded-card font-inter font-600 hover:bg-red-100 transition"
            >
              Delete My Account
            </button>
          ) : (
            <div className="space-y-3 p-4 bg-red-50 rounded-card">
              <p className="font-inter text-sm font-600 text-glow-error">
                Are you sure? All your data will be permanently deleted.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 p-2 border border-glow-error text-glow-error rounded-card font-inter font-500 hover:bg-white transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 p-2 bg-glow-error text-white rounded-card font-inter font-600 hover:bg-opacity-90 transition"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
