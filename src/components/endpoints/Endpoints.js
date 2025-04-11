// src/components/endpoints/Endpoints.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Endpoints = () => {
  const { currentUser } = useAuth();
  const [endpoints, setEndpoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('dateCreated');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  
  // Mock data for endpoints
  const mockEndpoints = [
    {
      id: 'ep1',
      name: 'Customer Churn Predictor API',
      description: 'Predicts the likelihood of customer churn',
      model: {
        id: 'model1',
        name: 'Customer Churn Model',
        type: 'classifier',
        accuracy: 0.87
      },
      status: 'active',
      url: 'https://api.nocodeml.com/predict/ep1',
      dateCreated: new Date('2023-11-05'),
      lastUsed: new Date('2023-11-10'),
      requestsToday: 127,
      requestsTotal: 1543
    },
    {
      id: 'ep2',
      name: 'Sales Forecasting API',
      description: 'Predicts future sales based on historical data',
      model: {
        id: 'model2',
        name: 'Sales Prediction Model',
        type: 'predictor',
        accuracy: 0.91
      },
      status: 'active',
      url: 'https://api.nocodeml.com/predict/ep2',
      dateCreated: new Date('2023-10-12'),
      lastUsed: new Date('2023-11-10'),
      requestsToday: 89,
      requestsTotal: 2104
    },
    {
      id: 'ep3',
      name: 'Customer Segmentation API',
      description: 'Identifies customer segments based on behavior',
      model: {
        id: 'model3',
        name: 'Customer Clustering Model',
        type: 'cluster',
        accuracy: 0.82
      },
      status: 'inactive',
      url: 'https://api.nocodeml.com/predict/ep3',
      dateCreated: new Date('2023-09-28'),
      lastUsed: new Date('2023-10-15'),
      requestsToday: 0,
      requestsTotal: 845
    },
    {
      id: 'ep4',
      name: 'Product Recommendation API',
      description: 'Recommends products based on user behavior',
      model: {
        id: 'model4',
        name: 'Product Recommendation Model',
        type: 'classifier',
        accuracy: 0.79
      },
      status: 'deploying',
      url: 'https://api.nocodeml.com/predict/ep4',
      dateCreated: new Date('2023-11-09'),
      lastUsed: null,
      requestsToday: 0,
      requestsTotal: 0
    }
  ];
  
  // Load endpoints
  useEffect(() => {
    // In a real app, you would fetch endpoints from your backend here
    const fetchEndpoints = async () => {
      try {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
          setEndpoints(mockEndpoints);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching endpoints:', error);
        setError('Failed to load endpoints. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchEndpoints();
  }, []);
  
  // Filter endpoints based on search term
  const filteredEndpoints = endpoints.filter(endpoint => 
    endpoint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    endpoint.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort endpoints
  const sortedEndpoints = [...filteredEndpoints].sort((a, b) => {
    if (sortBy === 'name') {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortBy === 'dateCreated') {
      return sortDirection === 'asc'
        ? a.dateCreated - b.dateCreated
        : b.dateCreated - a.dateCreated;
    } else if (sortBy === 'requestsTotal') {
      return sortDirection === 'asc'
        ? a.requestsTotal - b.requestsTotal
        : b.requestsTotal - a.requestsTotal;
    } else if (sortBy === 'status') {
      return sortDirection === 'asc'
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    }
    return 0;
  });
  
  // Format date
  const formatDate = (date) => {
    if (!date) return 'Never';
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  // Handle sort change
  const handleSortChange = (column) => {
    if (sortBy === column) {
      // Toggle direction if clicking the same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort column and default to ascending
      setSortBy(column);
      setSortDirection('asc');
    }
  };
  
  // Toggle endpoint status
  const toggleEndpointStatus = (endpointId) => {
    setEndpoints(endpoints.map(endpoint => {
      if (endpoint.id === endpointId) {
        const newStatus = endpoint.status === 'active' ? 'inactive' : 'active';
        return { ...endpoint, status: newStatus };
      }
      return endpoint;
    }));
  };
  
  // Delete endpoint
  const deleteEndpoint = (endpointId) => {
    if (window.confirm('Are you sure you want to delete this endpoint? This cannot be undone.')) {
      setEndpoints(endpoints.filter(endpoint => endpoint.id !== endpointId));
    }
  };
  
  // View endpoint details
  const viewEndpointDetails = (endpoint) => {
    setSelectedEndpoint(endpoint);
  };
  
  // Close endpoint details modal
  const closeEndpointDetails = () => {
    setSelectedEndpoint(null);
  };
  
  // Generate curl command for endpoint
  const generateCurlCommand = (endpoint) => {
    return `curl -X POST ${endpoint.url} \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "features": {
      "feature1": "value1",
      "feature2": "value2",
      // Add more features as needed
    }
  }'`;
  };
  
  // Generate Python code example for endpoint
  const generatePythonExample = (endpoint) => {
    return `import requests
import json

url = "${endpoint.url}"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_KEY"
}
data = {
    "features": {
        "feature1": "value1",
        "feature2": "value2",
        # Add more features as needed
    }
}

response = requests.post(url, headers=headers, json=data)
prediction = response.json()

print(prediction)`;
  };
  
  // Generate JavaScript code example for endpoint
  const generateJavaScriptExample = (endpoint) => {
    return `fetch('${endpoint.url}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    features: {
      feature1: 'value1',
      feature2: 'value2',
      // Add more features as needed
    }
  })
})
.then(response => response.json())
.then(prediction => {
  console.log(prediction);
})
.catch(error => {
  console.error('Error:', error);
});`;
  };
  
  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'status-badge-active';
      case 'inactive':
        return 'status-badge-inactive';
      case 'deploying':
        return 'status-badge-deploying';
      default:
        return 'status-badge-inactive';
    }
  };
  
  // Get model type icon
  const getModelTypeIcon = (type) => {
    switch (type) {
      case 'classifier':
        return '🔍';
      case 'predictor':
        return '📈';
      case 'cluster':
        return '🔄';
      default:
        return '🤖';
    }
  };
  
  return (
    <div className="endpoints-container">
      <div className="page-header">
        <h1>API Endpoints</h1>
        <Link to="/endpoints/new" className="btn btn-primary">
          Deploy New Model
        </Link>
      </div>
      
      {/* Search and Filter */}
      <div className="endpoints-toolbar">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search endpoints by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>
      
      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}
      
      {/* Loading State */}
      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading endpoints...</p>
        </div>
      ) : (
        <>
          {/* Endpoints Table */}
          {filteredEndpoints.length > 0 ? (
            <div className="endpoints-table-container">
              <table className="endpoints-table">
                <thead>
                  <tr>
                    <th 
                      className={`sortable ${sortBy === 'name' ? 'active' : ''}`}
                      onClick={() => handleSortChange('name')}
                    >
                      Endpoint Name
                      {sortBy === 'name' && (
                        <span className="sort-indicator">
                          {sortDirection === 'asc' ? ' ↑' : ' ↓'}
                        </span>
                      )}
                    </th>
                    <th>Model</th>
                    <th 
                      className={`sortable ${sortBy === 'status' ? 'active' : ''}`}
                      onClick={() => handleSortChange('status')}
                    >
                      Status
                      {sortBy === 'status' && (
                        <span className="sort-indicator">
                          {sortDirection === 'asc' ? ' ↑' : ' ↓'}
                        </span>
                      )}
                    </th>
                    <th 
                      className={`sortable ${sortBy === 'dateCreated' ? 'active' : ''}`}
                      onClick={() => handleSortChange('dateCreated')}
                    >
                      Created
                      {sortBy === 'dateCreated' && (
                        <span className="sort-indicator">
                          {sortDirection === 'asc' ? ' ↑' : ' ↓'}
                        </span>
                      )}
                    </th>
                    <th>Last Used</th>
                    <th 
                      className={`sortable ${sortBy === 'requestsTotal' ? 'active' : ''}`}
                      onClick={() => handleSortChange('requestsTotal')}
                    >
                      Total Requests
                      {sortBy === 'requestsTotal' && (
                        <span className="sort-indicator">
                          {sortDirection === 'asc' ? ' ↑' : ' ↓'}
                        </span>
                      )}
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedEndpoints.map(endpoint => (
                    <tr key={endpoint.id}>
                      <td>
                        <div className="endpoint-name" onClick={() => viewEndpointDetails(endpoint)}>
                          {endpoint.name}
                          <div className="endpoint-description">{endpoint.description}</div>
                        </div>
                      </td>
                      <td>
                        <div className="model-info">
                          <div className="model-type-icon">
                            {getModelTypeIcon(endpoint.model.type)}
                          </div>
                          <div>
                            <div className="model-name">{endpoint.model.name}</div>
                            <div className="model-accuracy">
                              Accuracy: {(endpoint.model.accuracy * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className={`status-badge ${getStatusBadgeClass(endpoint.status)}`}>
                          {endpoint.status === 'active' ? 'Active' : 
                           endpoint.status === 'inactive' ? 'Inactive' : 
                           endpoint.status === 'deploying' ? 'Deploying' : endpoint.status}
                        </div>
                      </td>
                      <td>{formatDate(endpoint.dateCreated)}</td>
                      <td>{formatDate(endpoint.lastUsed)}</td>
                      <td>{endpoint.requestsTotal.toLocaleString()}</td>
                      <td className="actions-cell">
                        <div className="action-buttons">
                          <button 
                            className="action-button view-button" 
                            title="View Details"
                            onClick={() => viewEndpointDetails(endpoint)}
                          >
                            👁️
                          </button>
                          {endpoint.status !== 'deploying' && (
                            <button 
                              className="action-button toggle-button" 
                              title={endpoint.status === 'active' ? 'Deactivate' : 'Activate'}
                              onClick={() => toggleEndpointStatus(endpoint.id)}
                            >
                              {endpoint.status === 'active' ? '⏸️' : '▶️'}
                            </button>
                          )}
                          <button 
                            className="action-button delete-button" 
                            title="Delete Endpoint"
                            onClick={() => deleteEndpoint(endpoint.id)}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            // Empty state when no endpoints match the search
            <div className="empty-state">
              <div className="empty-icon">🔌</div>
              <h2>No endpoints found</h2>
              <p>
                {searchTerm 
                  ? `No endpoints match your search "${searchTerm}"`
                  : "You haven't deployed any models yet"}
              </p>
              <Link to="/endpoints/new" className="btn btn-primary">
                Deploy Your First Model
              </Link>
            </div>
          )}
        </>
      )}
      
      {/* Endpoint Details Modal */}
      {selectedEndpoint && (
        <div className="modal-backdrop" onClick={closeEndpointDetails}>
          <div className="endpoint-details-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedEndpoint.name}</h2>
              <button className="modal-close" onClick={closeEndpointDetails}>×</button>
            </div>
            
            <div className="modal-content">
              <div className="endpoint-details">
                <div className="detail-section">
                  <h3>Endpoint Information</h3>
                  <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    <span className={`status-badge ${getStatusBadgeClass(selectedEndpoint.status)}`}>
                      {selectedEndpoint.status === 'active' ? 'Active' : 
                       selectedEndpoint.status === 'inactive' ? 'Inactive' : 
                       selectedEndpoint.status === 'deploying' ? 'Deploying' : selectedEndpoint.status}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Description:</span>
                    <span className="detail-value">{selectedEndpoint.description}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Endpoint URL:</span>
                    <div className="url-container">
                      <code className="endpoint-url">{selectedEndpoint.url}</code>
                      <button 
                        className="copy-button" 
                        onClick={() => navigator.clipboard.writeText(selectedEndpoint.url)}
                        title="Copy URL"
                      >
                        📋
                      </button>
                    </div>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Created:</span>
                    <span className="detail-value">{formatDate(selectedEndpoint.dateCreated)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Last Used:</span>
                    <span className="detail-value">{formatDate(selectedEndpoint.lastUsed)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Requests Today:</span>
                    <span className="detail-value">{selectedEndpoint.requestsToday.toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Total Requests:</span>
                    <span className="detail-value">{selectedEndpoint.requestsTotal.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h3>Model Information</h3>
                  <div className="detail-item">
                    <span className="detail-label">Model:</span>
                    <span className="detail-value">{selectedEndpoint.model.name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Type:</span>
                    <span className="detail-value">
                      {getModelTypeIcon(selectedEndpoint.model.type)}{' '}
                      {selectedEndpoint.model.type === 'classifier' ? 'Classification' : 
                       selectedEndpoint.model.type === 'predictor' ? 'Regression' : 
                       selectedEndpoint.model.type === 'cluster' ? 'Clustering' : 'Unknown'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Accuracy:</span>
                    <span className="detail-value">{(selectedEndpoint.model.accuracy * 100).toFixed(1)}%</span>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h3>How to Use This Endpoint</h3>
                  
                  <div className="code-examples">
                    <div className="code-example">
                      <div className="code-header">
                        <h4>cURL</h4>
                        <button 
                          className="copy-button" 
                          onClick={() => navigator.clipboard.writeText(generateCurlCommand(selectedEndpoint))}
                          title="Copy code"
                        >
                          📋
                        </button>
                      </div>
                      <pre className="code-block">{generateCurlCommand(selectedEndpoint)}</pre>
                    </div>
                    
                    <div className="code-example">
                      <div className="code-header">
                        <h4>Python</h4>
                        <button 
                          className="copy-button" 
                          onClick={() => navigator.clipboard.writeText(generatePythonExample(selectedEndpoint))}
                          title="Copy code"
                        >
                          📋
                        </button>
                      </div>
                      <pre className="code-block">{generatePythonExample(selectedEndpoint)}</pre>
                    </div>
                    
                    <div className="code-example">
                      <div className="code-header">
                        <h4>JavaScript</h4>
                        <button 
                          className="copy-button" 
                          onClick={() => navigator.clipboard.writeText(generateJavaScriptExample(selectedEndpoint))}
                          title="Copy code"
                        >
                          📋
                        </button>
                      </div>
                      <pre className="code-block">{generateJavaScriptExample(selectedEndpoint)}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={closeEndpointDetails}>Close</button>
              {selectedEndpoint.status !== 'deploying' && (
                <button 
                  className={`btn ${selectedEndpoint.status === 'active' ? 'btn-danger' : 'btn-success'}`}
                  onClick={() => {
                    toggleEndpointStatus(selectedEndpoint.id);
                    closeEndpointDetails();
                  }}
                >
                  {selectedEndpoint.status === 'active' ? 'Deactivate Endpoint' : 'Activate Endpoint'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Endpoints;