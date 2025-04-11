import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Papa from 'papaparse';

const NewProject = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Project details
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectType, setProjectType] = useState('');
  
  // Dataset details
  const [datasetFile, setDatasetFile] = useState(null);
  const [datasetName, setDatasetName] = useState('');
  const [dataPreview, setDataPreview] = useState(null);
  
  // Model configuration
  const [targetColumn, setTargetColumn] = useState('');
  const [featureColumns, setFeatureColumns] = useState([]);
  const [availableColumns, setAvailableColumns] = useState([]);
  const [modelSettings, setModelSettings] = useState({
    trainingPercentage: 80,
    advancedOptions: false,
    optimizationMetric: 'accuracy',
    taskType: '', // Added task type to model settings
  });
  
  // API response state
  const [modelReady, setModelReady] = useState(false);
  const [trainingId, setTrainingId] = useState(null);
  
  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Only accept CSV, Excel, or JSON files
      const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/json'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload a CSV, Excel, or JSON file');
        return;
      }
      
      setDatasetFile(file);
      setDatasetName(file.name);
      
      // Parse CSV with PapaParse
      if (file.type === 'text/csv') {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: function(results) {
            // Extract column names
            const columns = results.meta.fields;
            setAvailableColumns(columns);
            
            // Create preview data with up to 5 rows
            const previewData = {
              headers: columns,
              rows: results.data.slice(0, 5).map(row => 
                columns.map(col => row[col])
              )
            };
            setDataPreview(previewData);
            setError('');
          },
          error: function(error) {
            console.error('Error parsing CSV:', error);
            setError('Error parsing CSV file. Please check the file format.');
          }
        });
      } else {
        // For other file types, just show a success message
        setError('For best results, please use CSV files. Other file formats have limited preview support.');
        // Create a dummy preview
        setDataPreview({
          headers: ["File loaded successfully"],
          rows: []
        });
        
        // Create some dummy columns for demo/testing purposes
        setAvailableColumns([
          "Column1", "Column2", "Column3", "Column4", "Column5"
        ]);
      }
    }
  };
  
  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      const validFile = files.find(file => {
        const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/json'];
        return validTypes.includes(file.type);
      });
      
      if (validFile) {
        const event = { target: { files: [validFile] } };
        handleFileChange(event);
      } else {
        setError('Please upload a CSV, Excel, or JSON file');
      }
    }
  };
  
  // Handle target column selection
  const handleTargetColumnChange = (e) => {
    const selected = e.target.value;
    setTargetColumn(selected);
    
    // Update feature columns by removing the target column
    setFeatureColumns(availableColumns.filter(col => col !== selected));
  };
  
  // Handle feature column toggle
  const handleFeatureColumnToggle = (column) => {
    if (column === targetColumn) return; // Can't toggle target column
    
    if (featureColumns.includes(column)) {
      setFeatureColumns(featureColumns.filter(col => col !== column));
    } else {
      setFeatureColumns([...featureColumns, column]);
    }
  };
  
  // Handle training percentage change
  const handleTrainingPercentageChange = (e) => {
    const value = parseInt(e.target.value);
    setModelSettings({
      ...modelSettings,
      trainingPercentage: value
    });
  };
  
  // Handle optimization metric change
  const handleOptimizationMetricChange = (e) => {
    setModelSettings({
      ...modelSettings,
      optimizationMetric: e.target.value
    });
  };
  
  // Toggle advanced options
  const toggleAdvancedOptions = () => {
    setModelSettings({
      ...modelSettings,
      advancedOptions: !modelSettings.advancedOptions
    });
  };
  
  // Helper function to get default task type based on project type
  const getDefaultTaskType = (type) => {
    const mapping = {
      'predictor': 'regression',
      'classifier': 'classification',
      'cluster': 'clustering'
    };
    return mapping[type] || '';
  };
  
  // When project type changes, update the default task type
  React.useEffect(() => {
    if (projectType) {
      setModelSettings(prev => ({
        ...prev,
        taskType: getDefaultTaskType(projectType)
      }));
    }
  }, [projectType]);
  
  // Handle model creation and training
  const handleCreateProject = async (e) => {
    e.preventDefault();
    
    if (!projectName || !projectType || !datasetFile || !targetColumn || featureColumns.length === 0 || !modelSettings.taskType) {
      setError('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Create a FormData object for file upload
      const formData = new FormData();
      formData.append("file", datasetFile);
      formData.append("target_column", targetColumn);
      
      // Use the selected task type directly
      formData.append("task_type", modelSettings.taskType);
      
      // Add feature columns
      formData.append("feature_columns", JSON.stringify(featureColumns));
      
      // Add project metadata
      formData.append("project_name", projectName);
      formData.append("project_description", projectDescription);
      
      // Add optimization metric
      formData.append("optimization_metric", modelSettings.optimizationMetric);
      
      // Add advanced settings if needed
      if (modelSettings.advancedOptions) {
        formData.append("training_percentage", modelSettings.trainingPercentage);
        // Add other advanced settings as needed
      }
      
      // Send to backend API
      const response = await fetch("http://127.0.0.1:8000/send_training", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to train model');
      }
      
      const result = await response.json();
      console.log("Training success:", result);
      
      // Store training ID if returned by the API
      if (result.training_id) {
        setTrainingId(result.training_id);
      }
      
      // Set model as ready
      setModelReady(true);
      
      // Navigate to info page instead of prediction page
      navigate('/info', { 
        state: { 
          message: 'Project created successfully! Your model is now training.',
          type: 'success',
          trainingId: result.training_id || null
        }
      });
      
    } catch (error) {
      console.error('Error creating project:', error);
      setError(error.message || 'Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Go to next step
  const goToNextStep = () => {
    // Validate current step
    if (step === 1 && (!projectName || !projectType)) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (step === 2 && !datasetFile) {
      setError('Please upload a dataset');
      return;
    }
    
    setError('');
    setStep(step + 1);
  };
  
  // Go to previous step
  const goToPreviousStep = () => {
    setError('');
    setStep(step - 1);
  };
  
  return (
    <div className="new-project-container">
      <div className="project-header">
        <h1>Create New ML Project</h1>
        <p>Build a machine learning model in just a few steps</p>
      </div>
      
      {/* Progress Steps */}
      <div className="progress-steps">
        <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <span className="step-name">Project Details</span>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <span className="step-name">Upload Dataset</span>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <span className="step-name">Configure Model</span>
        </div>
      </div>
      
      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}
      
      {/* Step 1: Project Details */}
      {step === 1 && (
        <div className="step-container">
          <h2>Project Details</h2>
          
          <div className="form-group">
            <label htmlFor="projectName">Project Name</label>
            <input
              id="projectName"
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter a name for your project"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="projectDescription">Description (Optional)</label>
            <textarea
              id="projectDescription"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Describe what this project is for"
              rows="3"
            ></textarea>
          </div>
          
          <div className="form-group">
            <label>Project Type</label>
            <div className="project-type-grid">
              <div
                className={`project-type-card ${projectType === 'predictor' ? 'selected' : ''}`}
                onClick={() => setProjectType('predictor')}
              >
                <div className="project-type-icon">📈</div>
                <h3 style={{color:"white"}}>Predictor</h3>
                <p>Predict numerical values like sales, prices, or ratings</p>
              </div>
              
              <div
                className={`project-type-card ${projectType === 'classifier' ? 'selected' : ''}`}
                onClick={() => setProjectType('classifier')}
              >
                <div className="project-type-icon">🔍</div>
                <h3 style={{color:"white"}}>Classifier</h3>
                <p>Categorize data into groups like spam detection or sentiment analysis</p>
              </div>
              
              <div
                className={`project-type-card ${projectType === 'cluster' ? 'selected' : ''}`}
                onClick={() => setProjectType('cluster')}
              >
                <div className="project-type-icon">🔄</div>
                <h3 style={{color:"white"}}>Clustering</h3>
                <p>Discover patterns and group similar data points</p>
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn btn-primary" onClick={goToNextStep}>
              Continue
            </button>
          </div>
        </div>
      )}
      
      {/* Step 2: Upload Dataset */}
      {step === 2 && (
        <div className="step-container">
          <h2>Upload Dataset</h2>
          
          <div className="form-group">
            <label>Dataset File</label>
            <div 
              className="file-upload-container"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="datasetFile"
                onChange={handleFileChange}
                accept=".csv,.xls,.xlsx,.json"
                className="file-input"
              />
              <label htmlFor="datasetFile" className="file-upload-label">
                <div className="upload-icon">📁</div>
                <div className="upload-text">
                  {datasetFile ? datasetFile.name : 'Drag & drop your file here or click to browse'}
                </div>
                <div className="upload-info">Supports CSV, Excel, or JSON files</div>
              </label>
            </div>
          </div>
          
          {/* Data Preview */}
          {dataPreview && (
            <div className="data-preview">
              <h3>Data Preview</h3>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      {dataPreview.headers.map((header, index) => (
                        <th key={index}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dataPreview.rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={goToPreviousStep}>
              Back
            </button>
            <button type="button" className="btn btn-primary" onClick={goToNextStep} disabled={!datasetFile}>
              Continue
            </button>
          </div>
        </div>
      )}
      
      {/* Step 3: Configure Model */}
      {step === 3 && (
        <div className="step-container">
          <h2>Configure Model</h2>

          {/* Target Column Selector */}
          <div className="form-group">
            <label htmlFor="targetColumn">What do you want to predict?</label>
            <select
              id="targetColumn"
              value={targetColumn}
              onChange={handleTargetColumnChange}
              required
            >
              <option value="">Select a target column</option>
              {availableColumns.map((column, index) => (
                <option key={index} value={column}>
                  {column}
                </option>
              ))}
            </select>
            <div className="form-hint">This is the value your model will predict</div>
          </div>

          {/* Feature Columns Selector */}
          {targetColumn && (
            <div className="form-group">
              <label>Features to include in training</label>
              <div className="features-grid">
                {availableColumns.map((column, index) => (
                  <div 
                    key={index} 
                    className={`feature-item ${column === targetColumn ? 'disabled' : ''} ${featureColumns.includes(column) ? 'selected' : ''}`}
                    onClick={() => handleFeatureColumnToggle(column)}
                  >
                    <span className="feature-name">{column}</span>
                    {column === targetColumn ? (
                      <span className="feature-badge target">Target</span>
                    ) : featureColumns.includes(column) ? (
                      <span className="feature-badge included">Included</span>
                    ) : (
                      <span className="feature-badge excluded">Excluded</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="form-hint">Click to toggle features. The more relevant features you include, the better your model will perform.</div>
            </div>
          )}

          {/* Task Type Selector */}
          <div className="form-group">
            <label htmlFor="taskType">Task Type</label>
            <select
              id="taskType"
              value={modelSettings.taskType}
              onChange={(e) =>
                setModelSettings({ ...modelSettings, taskType: e.target.value })
              }
              required
            >
              <option value="">Select task type</option>
              <option value="classification">Classification</option>
              <option value="regression">Regression</option>
              <option value="clustering">Clustering</option>
            </select>
            <div className="form-hint">Choose whether you're building a classification, regression, or clustering model</div>
          </div>

          {/* Optimization Metrics */}
          <div className="form-group">
            <label htmlFor="optimizationMetric">Optimization Metric</label>
            <select
              id="optimizationMetric"
              value={modelSettings.optimizationMetric}
              onChange={handleOptimizationMetricChange}
              required
            >
              <option value="accuracy">Accuracy</option>
              <option value="precision">Precision</option>
              <option value="recall">Recall</option>
              <option value="f1">F1 Score</option>
              <option value="rmse">RMSE (for Regression)</option>
              <option value="mae">MAE (for Regression)</option>
            </select>
            <div className="form-hint">Choose how to measure your model's performance</div>
          </div>

          {/* Advanced Options Toggle */}
          <div className="form-group">
            <div className="advanced-options-toggle" onClick={toggleAdvancedOptions}>
              <span>{modelSettings.advancedOptions ? 'Hide' : 'Show'} Advanced Options</span>
              <span className="toggle-icon">{modelSettings.advancedOptions ? '▲' : '▼'}</span>
            </div>
            
            {modelSettings.advancedOptions && (
              <div className="advanced-options">
                {/* Training Percentage Slider */}
                <div className="form-group">
                  <label htmlFor="trainingPercentage">
                    Training/Test Split: {modelSettings.trainingPercentage}% / {100 - modelSettings.trainingPercentage}%
                  </label>
                  <input
                    type="range"
                    id="trainingPercentage"
                    min="50"
                    max="90"
                    value={modelSettings.trainingPercentage}
                    onChange={handleTrainingPercentageChange}
                  />
                  <div className="form-hint">Percentage of data used for training vs. testing</div>
                </div>
              </div>
            )}
          </div>

          {/* Model Ready Message */}
          {modelReady && (
            <div className="success-message">
              <p>Model has been successfully sent for training!</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={goToPreviousStep} disabled={loading}>
              Back
            </button>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={handleCreateProject} 
              disabled={loading || !targetColumn || featureColumns.length === 0 || !modelSettings.taskType}
            >
              {loading ? 'Creating Project...' : 'Train Model'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewProject;