// src/components/dashboard/Profile.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { updateProfile, updateEmail, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    
    if (!displayName.trim()) {
      setMessage({ text: 'Name cannot be empty', type: 'error' });
      return;
    }
    
    setLoading(true);
    
    try {
      await updateProfile(currentUser, {
        displayName: displayName,
      });
      
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage({ text: error.message || 'Failed to update profile', type: 'error' });
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    
    if (!email.trim()) {
      setMessage({ text: 'Email cannot be empty', type: 'error' });
      return;
    }
    
    if (!currentPassword) {
      setMessage({ text: 'Current password is required to update email', type: 'error' });
      return;
    }
    
    setLoading(true);
    
    try {
      // Re-authenticate user before updating email
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);
      
      // Update email
      await updateEmail(currentUser, email);
      
      setMessage({ text: 'Email updated successfully!', type: 'success' });
      setIsEditingEmail(false);
      setCurrentPassword('');
    } catch (error) {
      console.error('Email update error:', error);
      if (error.code === 'auth/wrong-password') {
        setMessage({ text: 'Incorrect password', type: 'error' });
      } else if (error.code === 'auth/email-already-in-use') {
        setMessage({ text: 'Email is already in use', type: 'error' });
      } else {
        setMessage({ text: error.message || 'Failed to update email', type: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    
    // Password validation
    if (password !== confirmPassword) {
      setMessage({ text: 'Passwords do not match', type: 'error' });
      return;
    }
    
    if (password.length < 6) {
      setMessage({ text: 'Password must be at least 6 characters', type: 'error' });
      return;
    }
    
    if (!currentPassword) {
      setMessage({ text: 'Current password is required', type: 'error' });
      return;
    }
    
    setLoading(true);
    
    try {
      // Re-authenticate user before updating password
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);
      
      // Update password
      await updatePassword(currentUser, password);
      
      setMessage({ text: 'Password updated successfully!', type: 'success' });
      setIsEditingPassword(false);
      setPassword('');
      setConfirmPassword('');
      setCurrentPassword('');
    } catch (error) {
      console.error('Password update error:', error);
      if (error.code === 'auth/wrong-password') {
        setMessage({ text: 'Incorrect current password', type: 'error' });
      } else {
        setMessage({ text: error.message || 'Failed to update password', type: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        // Logic for deleting account would go here
        // Would require re-authentication first
        
        // For now, just log out the user
        await logout();
        navigate('/login');
      } catch (error) {
        console.error('Delete account error:', error);
        setMessage({ text: error.message || 'Failed to delete account', type: 'error' });
      }
    }
  };

  return (
    <div className="profile-container">
      <h2>Edit Profile</h2>
      
      {message.text && (
        <div className={`message ${message.type}-message`}>
          {message.text}
        </div>
      )}
      
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {currentUser?.photoURL ? (
              <img 
                src={currentUser.photoURL} 
                alt={currentUser.displayName || 'User'} 
                className="avatar-image" 
              />
            ) : (
              <div className="avatar-placeholder">
                {displayName ? displayName[0].toUpperCase() : 'U'}
              </div>
            )}
          </div>
          
          <div className="profile-info">
            <h3>{displayName || 'User'}</h3>
            <p>{currentUser?.email}</p>
          </div>
        </div>
        
        {/* Update Display Name */}
        <form onSubmit={handleUpdateProfile} className="profile-form">
          <h4>Basic Information</h4>
          
          <div className="form-group">
            <label htmlFor="displayName">Name</label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
        
        {/* Update Email */}
        <div className="profile-section">
          <div className="section-header">
            <h4>Email Address</h4>
            {!isEditingEmail && (
              <button 
                className="btn btn-text" 
                onClick={() => setIsEditingEmail(true)}
                disabled={loading}
              >
                Edit
              </button>
            )}
          </div>
          
          {isEditingEmail ? (
            <form onSubmit={handleUpdateEmail} className="profile-form">
              <div className="form-group">
                <label htmlFor="email">New Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={loading}
                  placeholder="Enter your current password"
                />
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsEditingEmail(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Email'}
                </button>
              </div>
            </form>
          ) : (
            <p className="current-value">{currentUser?.email}</p>
          )}
        </div>
        
        {/* Update Password */}
        <div className="profile-section">
          <div className="section-header">
            <h4>Password</h4>
            {!isEditingPassword && (
              <button 
                className="btn btn-text" 
                onClick={() => setIsEditingPassword(true)}
                disabled={loading}
              >
                Change
              </button>
            )}
          </div>
          
          {isEditingPassword ? (
            <form onSubmit={handleUpdatePassword} className="profile-form">
              <div className="form-group">
                <label htmlFor="currentPasswordForPw">Current Password</label>
                <input
                  id="currentPasswordForPw"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={loading}
                  placeholder="Enter your current password"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  id="newPassword"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  placeholder="Enter new password"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  placeholder="Confirm new password"
                />
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsEditingPassword(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          ) : (
            <p className="current-value">••••••••</p>
          )}
        </div>
        
        {/* Danger Zone */}
        <div className="profile-section danger-zone">
          <h4>Danger Zone</h4>
          <p>Once you delete your account, there is no going back. Please be certain.</p>
          <button onClick={handleDeleteAccount} className="btn btn-danger">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;