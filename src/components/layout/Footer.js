// src/components/layout/Footer.js

import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-row">
          <div className="footer-column">
            <h3 className="footer-logo">NoCodeML</h3>
            <p className="footer-description">
              Build, deploy, and manage machine learning models without writing a single line of code.
            </p>
          </div>
          
          <div className="footer-column">
            <h4 className="footer-title">Platform</h4>
            <ul className="footer-links">
              <li>
                <Link to="/dashboard" className="footer-link">Dashboard</Link>
              </li>
              <li>
                <Link to="/projects" className="footer-link">My Projects</Link>
              </li>
              <li>
                <Link to="/datasets" className="footer-link">Datasets</Link>
              </li>
              <li>
                <Link to="/models" className="footer-link">Models</Link>
              </li>
              <li>
                <Link to="/endpoints" className="footer-link">API Endpoints</Link>
              </li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4 className="footer-title">Resources</h4>
            <ul className="footer-links">
              <li>
                <Link to="/docs" className="footer-link">Documentation</Link>
              </li>
              <li>
                <Link to="/tutorials" className="footer-link">Tutorials</Link>
              </li>
              <li>
                <Link to="/examples" className="footer-link">Example Projects</Link>
              </li>
              <li>
                <Link to="/blog" className="footer-link">Blog</Link>
              </li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4 className="footer-title">Company</h4>
            <ul className="footer-links">
              <li>
                <Link to="/about" className="footer-link">About Us</Link>
              </li>
              <li>
                <Link to="/pricing" className="footer-link">Pricing</Link>
              </li>
              <li>
                <Link to="/contact" className="footer-link">Contact</Link>
              </li>
              <li>
                <Link to="/privacy" className="footer-link">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="footer-link">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="copyright">
            &copy; {currentYear} NoCodeML Platform. All rights reserved.
          </p>
          <div className="social-links">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link">
              GitHub
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
              Twitter
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;