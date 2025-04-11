// src/components/auth/ForgotPassword.js

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const { resetPassword, error, setError } = useAuth();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await resetPassword(email);
      setIsSuccess(true);
      setMessage("Password reset email sent! Check your inbox for instructions.");
    } catch (error) {
      setIsSuccess(false);
      if (error.code === "auth/user-not-found") {
        setMessage("No account found with this email address");
      } else if (error.code === "auth/invalid-email") {
        setMessage("Invalid email address");
      } else {
        setMessage(error.message || "Failed to send reset email");
      }
    } finally {
      setLoading(false);
    }
  };

  // Clear errors on unmount
  React.useEffect(() => {
    return () => {
      if (setError) setError(null);
    };
  }, [setError]);

  return (
    <div className="forgot-password-container">
      <div className="auth-card">
        <h2>Reset Your Password</h2>

        {message && (
          <div className={`message ${isSuccess ? "success-message" : "error-message"}`}>
            {message}
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <p className="reset-description">
          Enter the email address associated with your NoCodeML account, and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleResetPassword}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login" className="link-back">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;