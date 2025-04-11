// src/components/layout/Navbar.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="logo">
            No-Code ML
          </Link>
        </div>

        {/* Mobile menu button */}
        <button className="mobile-menu-button" onClick={toggleMenu}>
          <span className="menu-icon">☰</span>
        </button>

        {/* Navigation links */}
        <nav className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
            </li>
            
            {/* Conditional rendering based on authentication state */}
            {currentUser ? (
              <>
                <li className="nav-item">
                  <Link to="/dashboard" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/predictors" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                    Predictors
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/classifiers" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                    Classifiers
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/clusters" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                    Clusters
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/endpoints" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                    Endpoints
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <button className="user-menu-button">
                    {currentUser.photoURL ? (
                      <img 
                        src={currentUser.photoURL} 
                        alt={currentUser.displayName || 'User'} 
                        className="user-avatar" 
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
                      </div>
                    )}
                  </button>
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <p className="user-name">{currentUser.displayName || 'User'}</p>
                      <p className="user-email">{currentUser.email}</p>
                    </div>
                    <Link to="/profile" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                      My Profile
                    </Link>
                    <Link to="/settings" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                      Settings
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout} className="dropdown-item">
                      Logout
                    </button>
                  </div>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link nav-button" onClick={() => setIsMenuOpen(false)}>
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;