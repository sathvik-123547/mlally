// src/components/auth/AuthDetails.js

import React from "react";

const AuthDetails = ({ user }) => {
  if (!user) return null;

  // Get the authentication provider (Google, Email/Password, etc.)
  const getAuthProvider = () => {
    if (user.providerData && user.providerData.length > 0) {
      const providerId = user.providerData[0].providerId;
      if (providerId === "google.com") return "Google";
      if (providerId === "password") return "Email/Password";
      return providerId;
    }
    return "Unknown";
  };

  // Format creation time
  const formatCreationTime = () => {
    if (user.metadata && user.metadata.creationTime) {
      return new Date(user.metadata.creationTime).toLocaleString();
    }
    return "Not available";
  };

  // Format last sign in time
  const formatLastSignInTime = () => {
    if (user.metadata && user.metadata.lastSignInTime) {
      return new Date(user.metadata.lastSignInTime).toLocaleString();
    }
    return "Not available";
  };

  return (
    <div className="auth-details">
      <div className="user-info">
        <div className="user-avatar">
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.displayName || "User"} 
              className="avatar-image" 
            />
          ) : (
            <div className="avatar-placeholder">
              {user.displayName ? user.displayName[0].toUpperCase() : "U"}
            </div>
          )}
        </div>
        
        <div className="user-data">
          {user.displayName && (
            <div className="info-item">
              <span className="info-label">Name:</span>
              <span className="info-value">{user.displayName}</span>
            </div>
          )}
          
          <div className="info-item">
            <span className="info-label">Email:</span>
            <span className="info-value">
              {user.email || "Not available"}
              {user.emailVerified && (
                <span className="verified-badge" title="Email verified">✓</span>
              )}
            </span>
          </div>
          
          <div className="info-item">
            <span className="info-label">Provider:</span>
            <span className="info-value">{getAuthProvider()}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">Account Created:</span>
            <span className="info-value">{formatCreationTime()}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">Last Sign In:</span>
            <span className="info-value">{formatLastSignInTime()}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">UID:</span>
            <span className="info-value user-id">{user.uid}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthDetails;