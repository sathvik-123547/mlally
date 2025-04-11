// src/components/layout/ProtectedRoute.js

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * A wrapper component for routes that require authentication
 * If user is not authenticated, redirects to login page
 */
const ProtectedRoute = ({ children, requireVerification = false }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // Show loading state while authentication status is being determined
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!currentUser) {
    // Save the current location to redirect back after login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If email verification is required but user is not verified
  if (requireVerification && !currentUser.emailVerified) {
    return <Navigate to="/verify-email" state={{ from: location.pathname }} replace />;
  }

  // If authenticated (and verified if required), render the protected component
  return children;
};

export default ProtectedRoute;