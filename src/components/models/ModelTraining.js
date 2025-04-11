// src/components/models/ModelTraining.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const ModelTraining = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [trainingStatus, setTrainingStatus] = useState('not_started'); // not_started, in_progress, completed, failed
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [modelMetrics, setModelMetrics] = useState(null);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [visualizationOptions, setVisualizationOptions] = useState({
    showConfusionMatrix: true,
    showFeatureImportance: true
  });
  
  // Mock project data
  const mockProject = {
    id: projectId,
    name: 'Customer Churn Predictor',
    description: 'Predict which customers are likely to cancel their subscription',
    type: 'classifier',
    createdAt: new Date('2023-11-01'),
    dataset: {
      id: 'ds1',
      name: 'Customer Dataset Q3 2023',
      rows: 4500,
      columns: 14
    },
    targetColumn: 'churn',
    featureColumns: [
      'tenure_months',
      'contract_type',
      'monthly_charges',
      'total_charges',
      'payment_method',
      'customer_service_calls',
      'age',
      'gender',
      'partner',
      'dependents',
      'internet_service',
      'online_security',
      'tech_support'
    ],
    modelSettings: {
      algorithm: 'RandomForest',
      trainingPercentage: 80,
      hyperparameterTuning: true
    }
  };
  
  // Mock model metrics for a classifier
  const mockClassifierMetrics = {
    accuracy: 0.87,
    precision: 0.83,
    recall: 0.79,
    f1Score: 0.81,
    auc: 0.92,
    confusionMatrix: [
      [1800, 200],
      [300, 700]
    ],
    featureImportance: [
      { feature: 'tenure_months', importance: 0.25 },
      { feature: 'monthly_charges', importance: 0.18 },
      { feature: 'total_charges', importance: 0.15 },
      { feature: 'customer_service_calls', importance: 0.12 },
      { feature: 'contract_type', importance: 0.10 },
      { feature: 'payment_method', importance: 0.08 },
      { feature: 'tech_support', importance: 0.05 },
      { feature: 'online_security', importance: 0.04 },
      { feature: 'internet_service', importance: 0.03 }
    ]
  };
  
  // Load project data and start training simulation
  useEffect(() => {
    // In a real app, you would fetch the project data from your backend
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
          setProject(mockProject);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching project:', error);
        setError('Failed to load project data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchProjectData();
  }, [projectId]);
  
  // Simulate model training process
  useEffect(() => {
    if (project && trainingStatus === 'not_started') {
      // Start training
      setTrainingStatus('in_progress');
      
      // Simulate progress updates
      const interval = setInterval(() => {
        setTrainingProgress(prevProgress => {
          const newProgress = prevProgress + Math.random() * 10;
          
          if (newProgress >= 100) {
            clearInterval(interval);
            setTrainingProgress(100);
            setTrainingStatus('completed');
            setModelMetrics(mockClassifierMetrics);
            return 100;
          }
          
          return newProgress;
        });
      }, 1000);
      
      // Cleanup interval on component unmount
      return () => clearInterval(interval);
    }
  }, [project, trainingStatus]);
  
  // Format number as percentage
  const formatPercent = (value) => {
    return `${(value * 100).toFixed(1)}%`;
  };
  
  // Format date
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  // Toggle visualization option
  const toggleVisualizationOption = (option) => {
    setVisualizationOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };
  
  // Deploy model
  const handleDeployModel = () => {
    // In a real app, you would call your API to deploy the model
    navigate(`/endpoints/new?model=${projectId}`, {
      state: {
        message: 'Model is being prepared for deployment',
        type: 'success'
      }
    });
  };
  
  // Render confusion matrix visualization (simplified)
  const renderConfusionMatrix = () => {
    if (!modelMetrics || !modelMetrics.confusionMatrix) return null;
    
    const matrix = modelMetrics.confusionMatrix;
    const total = matrix[0][0] + matrix[0][1] + matrix[1][0] + matrix[1][1];
    
    return (
      <div className="confusion-matrix">
        <h4>Confusion Matrix</h4>
        <div className="matrix-container">
          <div className="matrix-labels">
            <div className="matrix-axis-label">Actual</div>
            <div className="matrix-axis-label predicted">Predicted</div>
          </div>
          <div className="matrix-grid">
            <div className="matrix-cell header"></div>
            <div className="matrix-cell header">Negative</div>
            <div className="matrix-cell header">Positive</div>
            
            <div className="matrix-cell header">Negative</div>
            <div className="matrix-cell true-negative">
              <div className="cell-value">{matrix[0][0]}</div>
              <div className="cell-percent">{((matrix[0][0] / total) * 100).toFixed(1)}%</div>
            </div>
            <div className="matrix-cell false-positive">
              <div className="cell-value">{matrix[0][1]}</div>
              <div className="cell-percent">{((matrix[0][1] / total) * 100).toFixed(1)}%</div>
            </div>
            
            <div className="matrix-cell header">Positive</div>
            <div className="matrix-cell false-negative">
              <div className="cell-value">{matrix[1][0]}</div>
              <div className="cell-percent">{((matrix[1][0] / total) * 100).toFixed(1)}%</div>
            </div>
            <div className="matrix-cell true-positive">
              <div className="cell-value">{matrix[1][1]}</div>
              <div className="cell-percent">{((matrix[1][1] / total) * 100).toFixed(1)}%</div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render feature importance visualization
  const renderFeatureImportance = () => {
    if (!modelMetrics || !modelMetrics.featureImportance) return null;
    
    const features = [...modelMetrics.featureImportance]
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 10);
    
    return (
      <div className="feature-importance">
        <h4>Feature Importance</h4>
        <div className="feature-chart">
          {features.map((feature, index) => (
            <div className="feature-bar-container" key={index}>
              <div className="feature-name">{feature.feature}</div>
              <div className="feature-bar-wrapper">
                <div 
                  className="feature-bar" 
                  style={{ width: `${feature.importance * 100}%` }}
                >
                  <span className="feature-value">{formatPercent(feature.importance)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="model-training-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading project data...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="model-training-container">
        <div className="error-message">{error}</div>
        <Link to="/projects" className="btn btn-outline">Back to Projects</Link>
      </div>
    );
  }
  
  if (!project) {
    return (
      <div className="model-training-container">
        <div className="error-message">Project not found</div>
        <Link to="/projects" className="btn btn-outline">Back to Projects</Link>
      </div>
    );
  }
  
  return (
    <div className="model-training-container">
      {/* Project Header */}
      <div className="project-header">
        <div className="project-title">
          <h1>{project.name}</h1>
          <div className="project-type-badge">
            {project.type === 'classifier' ? '🔍 Classification' : 
             project.type === 'predictor' ? '📈 Regression' : 
             project.type === 'cluster' ? '🔄 Clustering' : 'ML Project'}
          </div>
        </div>
        <div className="project-actions">
          {trainingStatus === 'completed' && (
            <button 
              className="btn btn-success" 
              onClick={handleDeployModel}
            >
              Deploy Model
            </button>
          )}
          <Link to={`/projects/${projectId}/edit`} className="btn btn-outline">
            Edit Project
          </Link>
        </div>
      </div>
      
      {/* Training Progress */}
      {trainingStatus === 'in_progress' && (
        <div className="training-progress-container">
          <h2>Training in Progress</h2>
          <div className="progress-bar">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${trainingProgress}%` }}
            ></div>
          </div>
          <div className="progress-text">{Math.round(trainingProgress)}% Complete</div>
          <div className="training-steps">
            <div className={`training-step ${trainingProgress >= 10 ? 'completed' : 'active'}`}>
              Data Preprocessing
            </div>
            <div className={`training-step ${trainingProgress >= 30 ? 'completed' : trainingProgress >= 10 ? 'active' : ''}`}>
              Feature Engineering
            </div>
            <div className={`training-step ${trainingProgress >= 60 ? 'completed' : trainingProgress >= 30 ? 'active' : ''}`}>
              Model Training
            </div>
            <div className={`training-step ${trainingProgress >= 90 ? 'completed' : trainingProgress >= 60 ? 'active' : ''}`}>
              Evaluation
            </div>
            <div className={`training-step ${trainingProgress >= 100 ? 'completed' : trainingProgress >= 90 ? 'active' : ''}`}>
              Finalization
            </div>
          </div>
        </div>
      )}
      
      {/* Model Results */}
      {trainingStatus === 'completed' && (
        <div className="model-results">
          {/* Tabs */}
          <div className="model-tabs">
            <button 
              className={`tab-button ${selectedTab === 'overview' ? 'active' : ''}`}
              onClick={() => setSelectedTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`tab-button ${selectedTab === 'performance' ? 'active' : ''}`}
              onClick={() => setSelectedTab('performance')}
            >
              Performance
            </button>
            <button 
              className={`tab-button ${selectedTab === 'visualizations' ? 'active' : ''}`}
              onClick={() => setSelectedTab('visualizations')}
            >
              Visualizations
            </button>
            <button 
              className={`tab-button ${selectedTab === 'predictions' ? 'active' : ''}`}
              onClick={() => setSelectedTab('predictions')}
            >
              Make Predictions
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="tab-content">
            {/* Overview Tab */}
            {selectedTab === 'overview' && (
              <div className="overview-tab">
                <div className="info-cards">
                  <div className="info-card">
                    <h3>Project Details</h3>
                    <div className="info-item">
                      <span className="info-label">Project Type:</span>
                      <span className="info-value">
                        {project.type === 'classifier' ? 'Classification' : 
                         project.type === 'predictor' ? 'Regression' : 
                         project.type === 'cluster' ? 'Clustering' : 'Unknown'}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Created:</span>
                      <span className="info-value">{formatDate(project.createdAt)}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Description:</span>
                      <span className="info-value">{project.description}</span>
                    </div>
                  </div>
                  
                  <div className="info-card">
                    <h3>Dataset</h3>
                    <div className="info-item">
                      <span className="info-label">Name:</span>
                      <span className="info-value">{project.dataset.name}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Rows:</span>
                      <span className="info-value">{project.dataset.rows.toLocaleString()}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Columns:</span>
                      <span className="info-value">{project.dataset.columns}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Target Column:</span>
                      <span className="info-value target-column">{project.targetColumn}</span>
                    </div>
                  </div>
                  
                  <div className="info-card">
                    <h3>Model Configuration</h3>
                    <div className="info-item">
                      <span className="info-label">Algorithm:</span>
                      <span className="info-value">{project.modelSettings.algorithm}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Training Split:</span>
                      <span className="info-value">{project.modelSettings.trainingPercentage}%</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Hyperparameter Tuning:</span>
                      <span className="info-value">
                        {project.modelSettings.hyperparameterTuning ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="info-card">
                    <h3>Performance Summary</h3>
                    {project.type === 'classifier' && (
                      <>
                        <div className="info-item">
                          <span className="info-label">Accuracy:</span>
                          <span className="info-value">{formatPercent(modelMetrics.accuracy)}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Precision:</span>
                          <span className="info-value">{formatPercent(modelMetrics.precision)}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Recall:</span>
                          <span className="info-value">{formatPercent(modelMetrics.recall)}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">F1 Score:</span>
                          <span className="info-value">{formatPercent(modelMetrics.f1Score)}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="features-section">
                  <h3>Features ({project.featureColumns.length})</h3>
                  <div className="features-list">
                    {project.featureColumns.map((feature, index) => (
                      <div className="feature-tag" key={index}>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Performance Tab */}
            {selectedTab === 'performance' && (
              <div className="performance-tab">
                <div className="metrics-cards">
                  {project.type === 'classifier' && (
                    <>
                      <div className="metric-card">
                        <div className="metric-value">{formatPercent(modelMetrics.accuracy)}</div>
                        <div className="metric-label">Accuracy</div>
                        <div className="metric-description">
                          Percentage of predictions that were correct
                        </div>
                      </div>
                      
                      <div className="metric-card">
                        <div className="metric-value">{formatPercent(modelMetrics.precision)}</div>
                        <div className="metric-label">Precision</div>
                        <div className="metric-description">
                          When model predicts positive, how often it is correct
                        </div>
                      </div>
                      
                      <div className="metric-card">
                        <div className="metric-value">{formatPercent(modelMetrics.recall)}</div>
                        <div className="metric-label">Recall</div>
                        <div className="metric-description">
                          How many actual positives were correctly identified
                        </div>
                      </div>
                      
                      <div className="metric-card">
                        <div className="metric-value">{formatPercent(modelMetrics.f1Score)}</div>
                        <div className="metric-label">F1 Score</div>
                        <div className="metric-description">
                          Harmonic mean of precision and recall
                        </div>
                      </div>
                      
                      <div className="metric-card">
                        <div className="metric-value">{formatPercent(modelMetrics.auc)}</div>
                        <div className="metric-label">AUC</div>
                        <div className="metric-description">
                          Area under the ROC curve, measures discrimination
                        </div>
                      </div>
                    </>
                  )}
                </div>
                
                {/* More detailed metrics would go here */}
              </div>
            )}
            
            {/* Visualizations Tab */}
            {selectedTab === 'visualizations' && (
              <div className="visualizations-tab">
                <div className="visualization-options">
                  <label className="visualization-toggle">
                    <input
                      type="checkbox"
                      checked={visualizationOptions.showConfusionMatrix}
                      onChange={() => toggleVisualizationOption('showConfusionMatrix')}
                    />
                    <span>Confusion Matrix</span>
                  </label>
                  
                  <label className="visualization-toggle">
                    <input
                      type="checkbox"
                      checked={visualizationOptions.showFeatureImportance}
                      onChange={() => toggleVisualizationOption('showFeatureImportance')}
                    />
                    <span>Feature Importance</span>
                  </label>
                </div>
                
                <div className="visualizations-container">
                  {visualizationOptions.showConfusionMatrix && renderConfusionMatrix()}
                  {visualizationOptions.showFeatureImportance && renderFeatureImportance()}
                </div>
              </div>
            )}
            
            {/* Predictions Tab */}
            {selectedTab === 'predictions' && (
              <div className="predictions-tab">
                <h3>Make Predictions</h3>
                <p>Enter values for each feature to get a prediction from the model.</p>
                
                <div className="prediction-form">
                  {project.featureColumns.map((feature, index) => (
                    <div className="form-group" key={index}>
                      <label htmlFor={`feature-${index}`}>{feature}</label>
                      <input
                        id={`feature-${index}`}
                        type="text"
                        placeholder={`Enter value for ${feature}`}
                      />
                    </div>
                  ))}
                  
                  <button className="btn btn-primary">Make Prediction</button>
                </div>
                
                {/* Prediction Results would appear here */}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelTraining;