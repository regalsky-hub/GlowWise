import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserDataProvider, useUserData } from './context/UserDataContext';

// Pages
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import DailyCheckin from './pages/DailyCheckin';
import AICoach from './pages/AICoach';
import Insights from './pages/Insights';
import Settings from './pages/Settings';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Cookies from './pages/Cookies';
import Disclaimer from './pages/Disclaimer';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const { profile } = useUserData();

  if (loading) {
    return (
      <div className="min-h-screen bg-glow-cream flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-4xl">✨</div>
          <p className="font-inter text-glow-charcoal">Loading GlowWise...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Redirect to onboarding if not completed
  if (!profile?.onboarding_completed) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}

// Main Router
function AppRoutes() {
  const { user, loading } = useAuth();
  const { profile } = useUserData();

  if (loading) {
    return (
      <div className="min-h-screen bg-glow-cream flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-4xl">✨</div>
          <p className="font-inter text-glow-charcoal">Loading GlowWise...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/contact" element={<Contact />} />
<Route path="/privacy" element={<Privacy />} />
<Route path="/terms" element={<Terms />} />
<Route path="/cookies" element={<Cookies />} />
<Route path="/disclaimer" element={<Disclaimer />} />
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <Signup />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />

      {/* Protected Routes */}
      <Route
        path="/onboarding"
        element={
          user ? (
            profile?.onboarding_completed ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Onboarding />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkin"
        element={
          <ProtectedRoute>
            <DailyCheckin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-coach"
        element={
          <ProtectedRoute>
            <AICoach />
          </ProtectedRoute>
        }
      />
      <Route
        path="/insights"
        element={
          <ProtectedRoute>
            <Insights />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Main App Component
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UserDataProvider>
          <AppRoutes />
        </UserDataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
