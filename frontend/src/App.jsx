import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Toast from './components/Toast';

// Pages import
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DonorDashboard from './pages/DonorDashboard';
import NGODashboard from './pages/NGODashboard';
import VolunteerDashboard from './pages/VolunteerDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Protected Route node wrapper to validate JWT authentication & access roles
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token, loading } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If not authorized for this specific dashboard, redirect to home
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppContent() {
  return (
    <Router>
      <div className="relative min-h-screen bg-[#0B0F19]">
        <Navbar />
        
        {/* Main Routes Matrix */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          
          <Route 
            path="/donor-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['donor', 'admin']}>
                <DonorDashboard />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/ngo-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['ngo', 'admin']}>
                <NGODashboard />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/volunteer-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['volunteer', 'admin']}>
                <VolunteerDashboard />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global Toast notifications layer */}
        <Toast />
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
