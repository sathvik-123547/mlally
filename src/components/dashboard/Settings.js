// src/components/dashboard/Settings.js

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const Settings = () => {
  const { currentUser } = useAuth();
  
  // App settings
  const [darkMode, setDarkMode] = useState(true); // Set to true since we're using dark mode
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [modelAlerts, setModelAlerts] = useState(true);
  const [autoSaveModels, setAutoSaveModels] = useState(true);
  const [showExperimentalFeatures, setShowExperimentalFeatures] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  // Handle toggle changes
  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real app, you would save this preference to user settings in Firestore
    setMessage({ 
      text: `Dark mode ${!darkMode ? 'enabled' : 'disabled'}`, 
      type: 'success' 
    });
    
    // Auto-dismiss message after 3 seconds
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 3000);
  };
  
  const handleToggleEmailNotifications = () => {
    setEmailNotifications(!emailNotifications);
    setMessage({ 
      text: `Email notifications ${!emailNotifications ? 'enabled' : 'disabled'}`, 
      type: 'success' 
    });
    
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 3000);
  };
  
  const handleToggleModelAlerts = () => {
    setModelAlerts(!modelAlerts);
    setMessage({ 
      text: `Model training alerts ${!modelAlerts ? 'enabled' : 'disabled'}`, 
      type: 'success' 
    });
    
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 3000);
  };
  
  const handleToggleAutoSaveModels = () => {
    setAutoSaveModels(!autoSaveModels);
    setMessage({ 
      text: `Auto-save models ${!autoSaveModels ? 'enabled' : 'disabled'}`, 
      type: 'success' 
    });
    
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 3000);
  };
  
  const handleToggleExperimentalFeatures = () => {
    setShowExperimentalFeatures(!showExperimentalFeatures);
    setMessage({ 
      text: `Experimental ML features ${!showExperimentalFeatures ? 'enabled' : 'disabled'}`, 
      type: 'success' 
    });
    
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 3000);
  };
  
  // Handle save settings
  const handleSaveSettings = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate saving to database
    setTimeout(() => {
      setLoading(false);
      setMessage({ text: 'Platform settings saved successfully!', type: 'success' });
      
      // Auto-dismiss message after 3 seconds
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
    }, 1000);
  };
  
  return (
    <div className="settings-container">
      <h2>Platform Settings</h2>
      
      {message.text && (
        <div className={`message ${message.type}-message`}>
          {message.text}
        </div>
      )}
      
      <div className="settings-card">
        <form onSubmit={handleSaveSettings}>
          {/* Appearance Section */}
          <div className="settings-section">
            <h3>Appearance</h3>
            
            <div className="settings-option">
              <div className="option-info">
                <h4>Dark Mode</h4>
                <p>Toggle between light and dark theme for NoCodeML platform</p>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={darkMode} 
                  onChange={handleToggleDarkMode}
                  disabled={loading}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
          
          {/* Notifications Section */}
          <div className="settings-section">
            <h3>Notifications</h3>
            
            <div className="settings-option">
              <div className="option-info">
                <h4>Email Notifications</h4>
                <p>Receive email updates about your ML projects and account</p>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={emailNotifications} 
                  onChange={handleToggleEmailNotifications}
                  disabled={loading}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            
            <div className="settings-option">
              <div className="option-info">
                <h4>Model Training Alerts</h4>
                <p>Get notified when your ML models complete training</p>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={modelAlerts} 
                  onChange={handleToggleModelAlerts}
                  disabled={loading}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
          
          {/* ML Settings Section */}
          <div className="settings-section">
            <h3>ML Platform Settings</h3>
            
            <div className="settings-option">
              <div className="option-info">
                <h4>Auto-Save Models</h4>
                <p>Automatically save models during training process</p>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={autoSaveModels} 
                  onChange={handleToggleAutoSaveModels}
                  disabled={loading}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            
            <div className="settings-option">
              <div className="option-info">
                <h4>Experimental Features</h4>
                <p>Enable early access to experimental ML capabilities</p>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={showExperimentalFeatures} 
                  onChange={handleToggleExperimentalFeatures}
                  disabled={loading}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
          
          {/* Session Information */}
          <div className="settings-section">
            <h3>Account Information</h3>
            
            <div className="session-info">
              <p><strong>Last Login:</strong> {currentUser?.metadata?.lastSignInTime 
                ? new Date(currentUser.metadata.lastSignInTime).toLocaleString() 
                : 'Not available'}</p>
              <p><strong>Account Created:</strong> {currentUser?.metadata?.creationTime 
                ? new Date(currentUser.metadata.creationTime).toLocaleString() 
                : 'Not available'}</p>
              <p><strong>User ID:</strong> <span className="user-id">{currentUser?.uid || 'Not available'}</span></p>
              <p><strong>Provider:</strong> {currentUser?.providerData && currentUser.providerData.length > 0 
                ? currentUser.providerData[0].providerId === 'google.com' 
                  ? 'Google' 
                  : currentUser.providerData[0].providerId === 'password' 
                    ? 'Email/Password' 
                    : currentUser.providerData[0].providerId
                : 'Not available'}</p>
            </div>
          </div>
          
          <div className="settings-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;