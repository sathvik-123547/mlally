// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layout components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';
import PlacementForm from './components/projects/info';

// Auth components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';

// Dashboard components
import Dashboard from './components/dashboard/Dashboard';
import Profile from './components/dashboard/Profile';
import Settings from './components/dashboard/Settings';
import AvatarUploader from './components/projects/pikle';
import Chatbot from './components/projects/chatbot';

// Pages
import Home from './pages/Home';
import VerifyEmail from './pages/VerifyEmail';
import NotFound from './pages/NotFound';

// Styles
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/chat" element={<Chatbot />} />


              {/* Protected routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute requireVerification={true}>
                    <Settings />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/how-it-works" 
                element={
                  <ProtectedRoute>
                    <AvatarUploader />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/info" 
                element={
                  <ProtectedRoute>
                    <PlacementForm />
                  </ProtectedRoute>
                } 
              />

              {/* Fallback routes */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
