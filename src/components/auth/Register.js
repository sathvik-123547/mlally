// src/components/auth/Register.js

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Register = () => {
  // State for form fields
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // Get functions from auth context
  const { registerWithEmailAndPassword, signInWithGoogle, error, setError } = useAuth();
  const navigate = useNavigate();

  // Handle email/password registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setFormError("");

    // Password validation
    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setFormError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await registerWithEmailAndPassword(email, password, displayName);
      // Display success message and redirect to login or dashboard
      navigate("/dashboard", { 
        state: { 
          message: "Account created successfully! Please check your email for verification.",
          type: "success" 
        } 
      });
    } catch (error) {
      console.error("Registration error:", error);
      // Format error message to be user-friendly
      if (error.code === "auth/email-already-in-use") {
        setFormError("Email is already in use");
      } else if (error.code === "auth/invalid-email") {
        setFormError("Invalid email address");
      } else if (error.code === "auth/weak-password") {
        setFormError("Password is too weak");
      } else {
        setFormError(error.message || "Failed to create account");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Google registration
  const handleGoogleRegister = async () => {
    setFormError("");
    setLoading(true);

    try {
      await signInWithGoogle();
      navigate("/dashboard");
    } catch (error) {
      console.error("Google registration error:", error);
      setFormError(error.message || "Failed to sign up with Google");
    } finally {
      setLoading(false);
    }
  };

  // Clear errors on unmount
  useEffect(() => {
    return () => {
      if (setError) setError(null);
    };
  }, [setError]);

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Join NoCodeML Platform</h2>

        {/* Display error messages */}
        {(formError || error) && (
          <div className="error-message">
            {formError || error}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="displayName">Name</label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your name"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create ML Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="divider">
          <span>OR</span>
        </div>

        {/* Google Registration Button */}
        <button
          onClick={handleGoogleRegister}
          className="btn btn-google"
          disabled={loading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
          </svg>
          Continue with Google
        </button>

        {/* Login Link */}
        <div className="auth-toggle">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="link-primary">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;