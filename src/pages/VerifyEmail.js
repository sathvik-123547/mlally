// src/pages/VerifyEmail.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { sendEmailVerification } from 'firebase/auth';

const VerifyEmail = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleResendVerification = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    
    try {
      await sendEmailVerification(currentUser);
      setMessage({ 
        text: 'Verification email sent! Check your inbox.', 
        type: 'success' 
      });
    } catch (error) {
      console.error('Error sending verification email:', error);
      setMessage({ 
        text: error.message || 'Failed to send verification email. Try again later.', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-email-container">
      <div className="auth-card">
        <h2>Verify Your Email</h2>
        
        {message.text && (
          <div className={`message ${message.type}-message`}>
            {message.text}
          </div>
        )}
        
        <div className="verification-info">
          <div className="verification-icon">✉️</div>
          
          <p className="verification-text">
            We've sent a verification email to:
            <strong> {currentUser?.email || 'your email address'}</strong>
          </p>
          
          <p className="verification-instructions">
            Please check your inbox and click the verification link to activate your account.
            If you don't see the email, check your spam folder.
          </p>
        </div>
        
        <div className="verification-actions">
          <button 
            onClick={handleResendVerification} 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Resend Verification Email'}
          </button>
          
          <Link to="/dashboard" className="btn btn-secondary">
            Back to Dashboard
          </Link>
        </div>
        
        <div className="verification-help">
          <p>
            Already verified your email? 
            <button 
              className="btn-link"
              onClick={() => window.location.reload()}
            >
              Refresh the page
            </button>
            to update your verification status.
          </p>
          
          <p>
            Need help? <Link to="/contact" className="link-primary">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;