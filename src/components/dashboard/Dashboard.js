// src/components/dashboard/Dashboard.js

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import AuthDetails from "../auth/AuthDetails";
import { collection, query, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { sendEmailVerification } from "firebase/auth";

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mlStats, setMlStats] = useState({
    modelsCreated: 0,
    datasetsUploaded: 0,
    apiEndpoints: 0
  });
  const [activities, setActivities] = useState([]);

  // Check for notifications passed from other components
  useEffect(() => {
    if (location.state?.message) {
      setNotification({
        message: location.state.message,
        type: location.state.type || "info"
      });
      
      // Clear location state to prevent showing the message again on refresh
      window.history.replaceState({}, document.title);
      
      // Auto-dismiss notification after 5 seconds
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // Fetch user data when component mounts
  useEffect(() => {
    if (currentUser) {
      fetchUserData(currentUser.uid);
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const fetchUserData = async (userId) => {
    try {
      setLoading(true);
      
      // Attempt to fetch ML stats from Firestore
      try {
        const statsRef = collection(db, 'users', userId, 'mlStats');
        const statsSnapshot = await getDocs(statsRef);
        
        if (!statsSnapshot.empty) {
          const statsData = statsSnapshot.docs[0].data();
          setMlStats({
            modelsCreated: statsData.modelsCreated || 0,
            datasetsUploaded: statsData.datasetsUploaded || 0,
            apiEndpoints: statsData.apiEndpoints || 0
          });
        }
      } catch (statsError) {
        console.error('Error fetching stats:', statsError);
        // Continue with default stats values
      }
      
      // Attempt to fetch recent activities from Firestore
      try {
        const activitiesRef = collection(db, 'users', userId, 'activities');
        const activitiesQuery = query(
          activitiesRef, 
          orderBy('timestamp', 'desc'), 
          limit(5)
        );
        
        const activitiesSnapshot = await getDocs(activitiesQuery);
        const activitiesList = activitiesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setActivities(activitiesList);
      } catch (activitiesError) {
        console.error('Error fetching activities:', activitiesError);
        // Continue with empty activities array
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setNotification({
        message: "Failed to fetch dashboard data",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      setNotification({
        message: "Logout failed. Please try again.",
        type: "error"
      });
    }
  };

  const handleResendVerification = async () => {
    if (currentUser) {
      try {
        await sendEmailVerification(currentUser);
        setNotification({
          message: "Verification email sent successfully!",
          type: "success"
        });
      } catch (error) {
        console.error('Email verification error:', error);
        setNotification({
          message: "Failed to send verification email. Try again later.",
          type: "error"
        });
      }
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'model':
        return '📊';
      case 'dataset':
        return '📁';
      case 'endpoint':
        return '🔗';
      case 'prediction':
        return '🔮';
      default:
        return '📌';
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} minutes ago`;
      
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours} hours ago`;
      
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      
      return date.toLocaleDateString();
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return 'Unknown';
    }
  };

  // Fallback to default UI if Firestore is not set up yet
  const renderActivities = () => {
    if (activities.length > 0) {
      return (
        <div className="noc-activity-list">
          {activities.map(activity => (
            <div className="noc-activity-item" key={activity.id}>
              <span className="noc-activity-icon">
                {getActivityIcon(activity.type)}
              </span>
              <div className="noc-activity-details">
                <p className="noc-activity-title">{activity.description}</p>
                <p className="noc-activity-time">{formatTimestamp(activity.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      );
    } else {
      // Fallback UI with hardcoded activities if no Firestore data
      return (
        <div className="noc-activity-list">
          <div className="noc-activity-item">
            <span className="noc-activity-icon">📊</span>
            <div className="noc-activity-details">
              <p className="noc-activity-title">Classification Model Trained</p>
              <p className="noc-activity-time">2 hours ago</p>
            </div>
          </div>
          <div className="noc-activity-item">
            <span className="noc-activity-icon">📁</span>
            <div className="noc-activity-details">
              <p className="noc-activity-title">Customer Data Uploaded</p>
              <p className="noc-activity-time">Yesterday</p>
            </div>
          </div>
          <div className="noc-activity-item">
            <span className="noc-activity-icon">🔗</span>
            <div className="noc-activity-details">
              <p className="noc-activity-title">Prediction API Endpoint Created</p>
              <p className="noc-activity-time">3 days ago</p>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="noc-dashboard-wrapper">
      {/* Alert banner */}
      {notification && (
        <div className={`noc-alert-banner noc-alert-${notification.type}`}>
          {notification.message}
          <button 
            className="noc-alert-dismiss" 
            onClick={() => setNotification(null)}
          >
            &times;
          </button>
        </div>
      )}
  
      <div className="noc-dashboard-topbar">
        <h1>NoCodeML Dashboard</h1>
        <button className="noc-btn noc-btn-exit" onClick={handleLogout}>
          Sign Out
        </button>
      </div>
  
      {loading ? (
        <div className="noc-loading">
          <div className="noc-loading-spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      ) : (
        <div className="noc-dashboard-layout">
          <div className="noc-profile-panel">
            <h2>Hello, {currentUser?.displayName || 'Data Scientist'}</h2>
            
            {/* Verification status */}
            {currentUser && !currentUser.emailVerified && (
              <div className="noc-verify-alert">
                <p>Email verification required to access all NoCodeML features.</p>
                <button 
                  className="noc-btn noc-btn-accent"
                  onClick={handleResendVerification}
                >
                  Send verification link
                </button>
              </div>
            )}
            
            {/* User profile section */}
            <div className="noc-user-profile">
              <AuthDetails user={currentUser} />
            </div>
            
            <div className="noc-action-controls">
              <button 
                className="noc-btn noc-btn-primary" 
                onClick={() => navigate("/profile")}
              >
                Manage Profile
              </button>
              <button 
                className="noc-btn noc-btn-accent" 
                onClick={() => navigate("/settings")}
              >
                Preferences
              </button>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="noc-main-content">
            <div className="noc-ml-panel">
              <h3>ML Project Overview</h3>
              <p>Welcome to your No-Code ML platform. Upload datasets and create machine learning models without writing code.</p>
              
              {/* ML project statistics */}
              <div className="noc-stats-container">
                <div className="noc-stat-item">
                  <span className="noc-stat-label">Models Created</span>
                  <span className="noc-stat-value">{mlStats.modelsCreated}</span>
                </div>
                <div className="noc-stat-item">
                  <span className="noc-stat-label">Datasets Uploaded</span>
                  <span className="noc-stat-value">{mlStats.datasetsUploaded}</span>
                </div>
                <div className="noc-stat-item">
                  <span className="noc-stat-label">API Endpoints</span>
                  <span className="noc-stat-value">{mlStats.apiEndpoints}</span>
                </div>
              </div>
              
              {/* Quick actions */}
              <div className="noc-quick-actions">
                <button 
                  className="noc-btn noc-btn-primary"
                  onClick={() => navigate('/projects/new')}
                >
                  New ML Project
                </button>
                <button 
                  className="noc-btn noc-btn-accent"
                  onClick={() => navigate('/datasets/upload')}
                >
                  Upload Dataset
                </button>
              </div>
            </div>
            
            <div className="noc-ml-panel">
              <h3>Recent Activity</h3>
              {renderActivities()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;