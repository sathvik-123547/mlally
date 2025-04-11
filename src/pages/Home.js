  // src/components/pages/Home.js

  import React, { useState } from 'react';
  import { Link } from 'react-router-dom';
  import NewProject from '../components/projects/NewProject'; // Import your ML project creation component

  const Home = () => {
    const [showNewProject, setShowNewProject] = useState(false);

    const toggleNewProject = () => {
      setShowNewProject(!showNewProject);
    };

    return (
      <div className="home-container">
        {showNewProject ? (
          // Show the NewProjectWizard component when the user clicks "Create New Project"
          <NewProject onCancel={() => setShowNewProject(false)} />
        ) : (
          // Show the regular home page content
          <>
            {/* Hero Section */}
            <section className="hero-section">
              <div className="hero-content">
                <h1 className="hero-title">
                  Build <span>ML Models</span> Without Writing Code
                </h1>
                <p className="hero-subtitle">
                  Upload your data, select a model type, and deploy instantly. Our platform handles the complexity so you can focus on solving business problems.
                </p>
                <div className="hero-cta">
                  <button onClick={toggleNewProject} className="btn btn-primary">Create New Project</button>
                  <Link to="/how-it-works" className="btn btn-outline">See How It Works</Link>
                </div>
              </div>
              <div className="hero-image">
                <div className="hero-image-placeholder"></div>
              </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
              <div className="section-header">
                <h2>ML Capabilities For Everyone</h2>
                <p>Powerful machine learning tools that don't require a data science degree</p>
              </div>
              
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon predictor-icon"></div>
                  <h3>Predictors</h3>
                  <p>Build regression models to forecast numerical values like sales, prices, or inventory levels with just a few clicks.</p>
                </div>
                
                <div className="feature-card">
                  <div className="feature-icon classifier-icon"></div>
                  <h3>Classifiers</h3>
                  <p>Categorize data into groups with classification models for sentiment analysis, spam detection, and customer segmentation.</p>
                </div>
                
                <div className="feature-card">
                  <div className="feature-icon cluster-icon"></div>
                  <h3>Clusters</h3>
                  <p>Discover hidden patterns in your data with clustering algorithms that automatically group similar items together.</p>
                </div>
                
                

// Inside your component render method or return
<Link to="/chat" style={{ textDecoration: 'none', color: 'inherit' }}>
  <div className="feature-card" style={{ cursor: 'pointer' }}>
    <div className="feature-icon endpoint-icon"></div>
    <h3>API Endpoints</h3>
    <p>
      Deploy your models with one click and integrate predictions into any
      application with our secure, scalable REST APIs.
    </p>
  </div>
</Link>

<Link to="/chat" style={{ textDecoration: 'none', color: 'inherit' }}>
  <div className="feature-card" style={{ cursor: 'pointer' }}>
    <div className="feature-icon endpoint-icon"></div>
    <h3>API Endpoints</h3>
    <p>
      Deploy your models with one click and integrate predictions into any
      application with our secure, scalable REST APIs.
    </p>
  </div>
</Link>

              </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works-section">
              <div className="section-header">
                <h2>Simple Three-Step Process</h2>
                <p>From data to predictions in minutes, not months</p>
              </div>
              
              <div className="steps-container">
                <div className="step-card">
                  <div className="step-number">1</div>
                  <h3>Upload Your Data</h3>
                  <p>Upload CSV, Excel, or JSON files. Our platform automatically analyzes your data and detects column types.</p>
                </div>
                
                <div className="step-card">
                  <div className="step-number">2</div>
                  <h3>Choose Model Type</h3>
                  <p>Select a predictor, classifier, or clustering model. Our algorithm finder selects the best model for your data.</p>
                </div>
                
                <div className="step-card">
                  <div className="step-number">3</div>
                  <h3>Deploy & Use</h3>
                  <p>Get an instant API endpoint to make predictions. Use it in your applications, websites, or workflow tools.</p>
                </div>
              </div>
            </section>

            {/* Use Cases Section */}
            <section className="use-cases-section">
              <div className="section-header">
                <h2>Used By Teams In Every Industry</h2>
                <p>See how organizations are leveraging No-Code ML</p>
              </div>
              
              <div className="use-cases-grid">
                <div className="use-case-card">
                  <h3>Retail & E-commerce</h3>
                  <p>Predict inventory needs, optimize pricing, forecast customer lifetime value, and create personalized product recommendations.</p>
                </div>
                
                <div className="use-case-card">
                  <h3>Financial Services</h3>
                  <p>Detect fraudulent transactions, assess credit risk, predict customer churn, and forecast market trends without complex models.</p>
                </div>
                
                <div className="use-case-card">
                  <h3>Healthcare</h3>
                  <p>Predict patient readmissions, optimize staffing levels, analyze treatment outcomes, and identify high-risk patients.</p>
                </div>
                
                <div className="use-case-card">
                  <h3>Marketing</h3>
                  <p>Segment customers, predict campaign performance, optimize advertising spend, and personalize messaging at scale.</p>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
              <div className="cta-content">
                <h2>Ready to Transform Your Data?</h2>
                <p>Join thousands of companies using No-Code ML to make better decisions with their data — no coding or data science expertise required.</p>
                <button onClick={toggleNewProject} className="btn btn-primary btn-large" style={{color:"white"}}>Start Building For Free</button>
              </div>
            </section>
          </>
        )}
      </div>
    );
  };

  export default Home;