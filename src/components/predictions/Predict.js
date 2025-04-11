// src/components/predictions/Prediction.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Prediction = () => {
  const { trainingId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modelInfo, setModelInfo] = useState(null);
  const [inputValues, setInputValues] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [makingPrediction, setMakingPrediction] = useState(false);
  const [trainingStatus, setTrainingStatus] = useState('loading'); // loading, training, ready, failed
  
  // Fetch model information
  useEffect(() => {
    const fetchModelInfo = async () => {
      try {
        setLoading(true);
        
        // In a real app, fetch the model info from the backend
        const response = await fetch(`http://127.0.0.1:8000/model/${trainingId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Model not found');
          } else {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to fetch model information');
          }
        }
        
        const data = await response.json();
        
        // Store model information
        setModelInfo(data);
        
        // Initialize input values with empty strings
        const initialInputs = {};
        if (data.features) {
          data.features.forEach(feature => {
            initialInputs[feature] = '';
          });
        }
        setInputValues(initialInputs);
        
        // Set training status
        setTrainingStatus(data.status || 'ready');
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching model info:', error);
        setError(error.message || 'Failed to fetch model information');
        setLoading(false);
        setTrainingStatus('failed');
      }
    };
    
    // Set up polling to check training status
    const checkTrainingStatus = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/training_status/${trainingId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error checking training status:', errorData);
          return;
        }
        
        const data = await response.json();
        setTrainingStatus(data.status);
        
        // If training is complete, fetch the model info
        if (data.status === 'ready') {
          fetchModelInfo();
        } else if (data.status === 'failed') {
          setError('Model training failed. Please try again with a different dataset or configuration.');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking training status:', error);
      }
    };
    
    // Initial fetch
    fetchModelInfo();
    
    // Set up polling if the model is still training
    let interval;
    if (trainingStatus === 'training') {
      interval = setInterval(checkTrainingStatus, 5000); // Check every 5 seconds
    }
    
    // Cleanup
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [trainingId, trainingStatus]);
  
  // Mock model information (for development)
  const mockModelInfo = {
    id: trainingId || 'model1',
    name: 'Customer Churn Predictor',
    type: 'classification',
    status: 'ready',
    target: 'will_churn',
    features: [
      'tenure_months',
      'monthly_charges',
      'total_charges',
      'contract_type',
      'payment_method',
      'online_security',
      'tech_support',
      'internet_service'
    ],
    accuracy: 0.87,
    categorical_features: ['contract_type', 'payment_method', 'online_security', 'tech_support', 'internet_service'],
    numerical_features: ['tenure_months', 'monthly_charges', 'total_charges'],
    categorical_options: {
      'contract_type': ['Month-to-month', 'One year', 'Two year'],
      'payment_method': ['Electronic check', 'Mailed check', 'Bank transfer', 'Credit card'],
      'online_security': ['Yes', 'No', 'No internet service'],
      'tech_support': ['Yes', 'No', 'No internet service'],
      'internet_service': ['DSL', 'Fiber optic', 'No']
    }
  };
  
  // Use mock data when in development or if loading fails
  useEffect(() => {
    if ((!modelInfo && !loading && trainingStatus !== 'training') || error) {
      console.log('Using mock model data for development');
      setModelInfo(mockModelInfo);
      setTrainingStatus('ready');
      
      // Initialize input values with empty strings
      const initialInputs = {};
      mockModelInfo.features.forEach(feature => {
        initialInputs[feature] = '';
      });
      setInputValues(initialInputs);
      
      setLoading(false);
      setError(''); // Clear any errors
    }
  }, [loading, error, modelInfo, trainingStatus]);
  
  // Handle input change
  const handleInputChange = (feature, value) => {
    setInputValues({
      ...inputValues,
      [feature]: value
    });
  };
  
  // Make a prediction
  const handleMakePrediction = async () => {
    try {
      setMakingPrediction(true);
      setPrediction(null);
      
      // Check if all required inputs are filled
      const missingInputs = Object.entries(inputValues).filter(([key, value]) => value === '');
      if (missingInputs.length > 0) {
        setError(`Please fill in all required inputs: ${missingInputs.map(([key]) => key).join(', ')}`);
        setMakingPrediction(false);
        return;
      }
      
      // Format the input data
      const predictionData = {
        model_id: modelInfo.id,
        features: inputValues
      };
      
      // Send the prediction request
      const response = await fetch('http://127.0.0.1:8000/send_training', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(predictionData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to make prediction');
      }
      
      const result = await response.json();
      console.log('Prediction result:', result);
      
      // Format and store prediction
      setPrediction(result);
      setError('');
      
    } catch (error) {
      console.error('Error making prediction:', error);
      setError(error.message || 'Failed to make prediction');
      
      // For development, generate a mock prediction
      if (process.env.NODE_ENV === 'development') {
        generateMockPrediction();
      }
      
    } finally {
      setMakingPrediction(false);
    }
  };
  
  // Generate a mock prediction for development
  const generateMockPrediction = () => {
    const mockResult = {
      prediction: modelInfo.type === 'classification' ? Math.random() > 0.5 : (Math.random() * 100).toFixed(2),
      confidence: Math.random().toFixed(4),
      prediction_time: new Date().toISOString()
    };
    
    if (modelInfo.type === 'classification') {
      mockResult.class_probabilities = {
        '0': (1 - mockResult.confidence).toFixed(4),
        '1': mockResult.confidence
      };
    }
    
    setPrediction(mockResult);
    setError(''); // Clear any errors
  };
  
  // Format prediction result
  const formatPredictionResult = () => {
    if (!prediction) return null;
    
    if (modelInfo.type === 'classification') {
      // For classification, show the predicted class and probabilities
      const predictedClass = prediction.prediction;
      const confidence = parseFloat(prediction.confidence) * 100;
      
      return (
        <div className="prediction-result classification">
          <h3>Prediction Result</h3>
          <div className="result-main">
            <div className="result-value">
              {predictedClass === 1 ? 'Positive' : 'Negative'}
            </div>
            <div className="result-confidence">
              Confidence: {confidence.toFixed(2)}%
            </div>
          </div>
          
          {prediction.class_probabilities && (
            <div className="probabilities">
              <h4>Class Probabilities</h4>
              <div className="probability-bars">
                <div className="probability-item">
                  <div className="probability-label">Negative (0)</div>
                  <div className="probability-bar-container">
                    <div 
                      className="probability-bar negative"
                      style={{ width: `${parseFloat(prediction.class_probabilities["0"]) * 100}%` }}
                    >
                      {(parseFloat(prediction.class_probabilities["0"]) * 100).toFixed(2)}%
                    </div>
                  </div>
                </div>
                <div className="probability-item">
                  <div className="probability-label">Positive (1)</div>
                  <div className="probability-bar-container">
                    <div 
                      className="probability-bar positive"
                      style={{ width: `${parseFloat(prediction.class_probabilities["1"]) * 100}%` }}
                    >
                      {(parseFloat(prediction.class_probabilities["1"]) * 100).toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="prediction-timestamp">
            <span>Prediction made at: {new Date(prediction.prediction_time).toLocaleString()}</span>
          </div>
        </div>
      );
    } else {
      // For regression, show the predicted value
      const predictedValue = parseFloat(prediction.prediction);
      
      return (
        <div className="prediction-result regression">
          <h3>Prediction Result</h3>
          <div className="result-main">
            <div className="result-value">
              {predictedValue.toFixed(2)}
            </div>
          </div>
          
          <div className="prediction-timestamp">
            <span>Prediction made at: {new Date(prediction.prediction_time).toLocaleString()}</span>
          </div>
        </div>
      );
    }
  };
  
  // Render input fields based on feature type
  const renderInputField = (feature) => {
    const isNumerical = modelInfo.numerical_features && modelInfo.numerical_features.includes(feature);
    const isCategorical = modelInfo.categorical_features && modelInfo.categorical_features.includes(feature);
    
    if (isCategorical && modelInfo.categorical_options && modelInfo.categorical_options[feature]) {
      // Render dropdown for categorical features
      return (
        <div className="input-field" key={feature}>
          <label htmlFor={feature}>{feature.replace(/_/g, ' ')}</label>
          <select
            id={feature}
            value={inputValues[feature]}
            onChange={(e) => handleInputChange(feature, e.target.value)}
            required
          >
            <option value="">Select {feature.replace(/_/g, ' ')}</option>
            {modelInfo.categorical_options[feature].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );
    } else if (isNumerical) {
      // Render number input for numerical features
      return (
        <div className="input-field" key={feature}>
          <label htmlFor={feature}>{feature.replace(/_/g, ' ')}</label>
          <input
            id={feature}
            type="number"
            step="0.01"
            value={inputValues[feature]}
            onChange={(e) => handleInputChange(feature, e.target.value)}
            placeholder={`Enter ${feature.replace(/_/g, ' ')}`}
            required
          />
        </div>
      );
    } else {
      // Render text input for other features
      return (
        <div className="input-field" key={feature}>
          <label htmlFor={feature}>{feature.replace(/_/g, ' ')}</label>
          <input
            id={feature}
            type="text"
            value={inputValues[feature]}
            onChange={(e) => handleInputChange(feature, e.target.value)}
            placeholder={`Enter ${feature.replace(/_/g, ' ')}`}
            required
          />
        </div>
      );
    }
  };
  
  // Show loading state
  if (loading || trainingStatus === 'training') {
    return (
      <div className="model-prediction loading">
        <h2>Loading Model</h2>
        <div className="status-message">
          {trainingStatus === 'training' ? (
            <>
              <div className="spinner"></div>
              <p>Your model is still training. This could take a few minutes...</p>
            </>
          ) : (
            <>
              <div className="spinner"></div>
              <p>Loading model information...</p>
            </>
          )}
        </div>
        <div className="back-link">
          <Link to="/models">← Back to Models</Link>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (error && !modelInfo) {
    return (
      <div className="model-prediction error">
        <h2>Error</h2>
        <div className="error-message">
          <p>{error}</p>
        </div>
        <div className="actions">
          <button 
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
          <Link to="/models" className="back-button">
            Back to Models
          </Link>
        </div>
      </div>
    );
  }
  
  // Main render
  return (
    <div className="model-prediction">
      <div className="model-header">
        <h2>{modelInfo.name}</h2>
        <div className="model-meta">
          <span className="model-type">{modelInfo.type === 'classification' ? 'Classification' : 'Regression'}</span>
          <span className="model-accuracy">Accuracy: {(modelInfo.accuracy * 100).toFixed(2)}%</span>
          <span className="model-target">Target: {modelInfo.target}</span>
        </div>
      </div>
      
      <div className="prediction-container">
        <div className="input-form">
          <h3>Enter Feature Values</h3>
          
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={(e) => {
            e.preventDefault();
            handleMakePrediction();
          }}>
            {modelInfo.features && modelInfo.features.map(feature => renderInputField(feature))}
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="predict-button"
                disabled={makingPrediction}
              >
                {makingPrediction ? 'Making Prediction...' : 'Make Prediction'}
              </button>
              <button 
                type="button" 
                className="clear-button"
                onClick={() => {
                  // Reset all inputs to empty
                  const emptyInputs = {};
                  modelInfo.features.forEach(feature => {
                    emptyInputs[feature] = '';
                  });
                  setInputValues(emptyInputs);
                  setPrediction(null);
                }}
                disabled={makingPrediction}
              >
                Clear Form
              </button>
            </div>
          </form>
        </div>
        
        <div className="prediction-output">
          {prediction ? formatPredictionResult() : (
            <div className="no-prediction">
              <p>Enter feature values and click "Make Prediction" to see results.</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="model-actions">
        <Link to="/models" className="back-button">
          ← Back to Models
        </Link>
        <button
          className="export-button"
          onClick={() => {
            // In a real app, this would download the model or prediction results
            alert('In a real app, this would export the model or prediction results.');
          }}
        >
          Export Model
        </button>
      </div>
    </div>
  );
};

export default Prediction;