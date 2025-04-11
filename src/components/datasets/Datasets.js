// src/components/datasets/Datasets.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Datasets = () => {
  const { currentUser } = useAuth();
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('dateCreated');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedDatasets, setSelectedDatasets] = useState([]);
  
  // Mock data for datasets
  const mockDatasets = [
    {
      id: 'ds1',
      name: 'Customer Churn Data',
      description: 'Historical customer data with churn indicators',
      dateCreated: new Date('2023-10-15'),
      lastModified: new Date('2023-11-02'),
      size: '2.4 MB',
      rows: 4500,
      columns: 14,
      fileType: 'csv',
      tags: ['customers', 'churn']
    },
    {
      id: 'ds2',
      name: 'Sales Transactions 2023',
      description: 'Monthly sales data by product and region',
      dateCreated: new Date('2023-11-10'),
      lastModified: new Date('2023-11-10'),
      size: '4.1 MB',
      rows: 8200,
      columns: 10,
      fileType: 'csv',
      tags: ['sales', 'products']
    },
    {
      id: 'ds3',
      name: 'Website Traffic Analysis',
      description: 'User session data from Google Analytics',
      dateCreated: new Date('2023-08-22'),
      lastModified: new Date('2023-09-14'),
      size: '5.6 MB',
      rows: 12000,
      columns: 16,
      fileType: 'json',
      tags: ['website', 'traffic', 'analytics']
    },
    {
      id: 'ds4',
      name: 'Employee Performance Metrics',
      description: 'Annual employee review data',
      dateCreated: new Date('2023-06-30'),
      lastModified: new Date('2023-07-15'),
      size: '1.2 MB',
      rows: 780,
      columns: 22,
      fileType: 'xlsx',
      tags: ['employees', 'performance']
    },
    {
      id: 'ds5',
      name: 'Product Inventory Status',
      description: 'Current inventory levels across all locations',
      dateCreated: new Date('2023-11-05'),
      lastModified: new Date('2023-11-06'),
      size: '3.7 MB',
      rows: 5600,
      columns: 9,
      fileType: 'csv',
      tags: ['inventory', 'products']
    }
  ];
  
  // Load datasets
  useEffect(() => {
    // In a real app, you would fetch datasets from your backend here
    const fetchDatasets = async () => {
      try {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
          setDatasets(mockDatasets);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching datasets:', error);
        setError('Failed to load datasets. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchDatasets();
  }, []);
  
  // Filter datasets based on search term
  const filteredDatasets = datasets.filter(dataset => 
    dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dataset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dataset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Sort datasets
  const sortedDatasets = [...filteredDatasets].sort((a, b) => {
    if (sortBy === 'name') {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortBy === 'dateCreated') {
      return sortDirection === 'asc'
        ? a.dateCreated - b.dateCreated
        : b.dateCreated - a.dateCreated;
    } else if (sortBy === 'size') {
      const aSize = parseFloat(a.size);
      const bSize = parseFloat(b.size);
      return sortDirection === 'asc' ? aSize - bSize : bSize - aSize;
    } else if (sortBy === 'rows') {
      return sortDirection === 'asc' ? a.rows - b.rows : b.rows - a.rows;
    }
    return 0;
  });
  
  // Format date
  const formatDate = (date) => {
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
  
  // Toggle dataset selection
  const toggleDatasetSelection = (datasetId) => {
    if (selectedDatasets.includes(datasetId)) {
      setSelectedDatasets(selectedDatasets.filter(id => id !== datasetId));
    } else {
      setSelectedDatasets([...selectedDatasets, datasetId]);
    }
  };
  
  // Select all datasets
  const selectAllDatasets = () => {
    if (selectedDatasets.length === filteredDatasets.length) {
      setSelectedDatasets([]);
    } else {
      setSelectedDatasets(filteredDatasets.map(dataset => dataset.id));
    }
  };
  
  // Delete selected datasets
  const deleteSelectedDatasets = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedDatasets.length} dataset(s)?`)) {
      // In a real app, you would call your API here
      setDatasets(datasets.filter(dataset => !selectedDatasets.includes(dataset.id)));
      setSelectedDatasets([]);
    }
  };
  
  // Get file type icon
  const getFileTypeIcon = (fileType) => {
    switch (fileType) {
      case 'csv':
        return '📊';
      case 'xlsx':
        return '📈';
      case 'json':
        return '📋';
      default:
        return '📄';
    }
  };
  
  return (
    <div className="datasets-container">
      <div className="page-header">
        <h1>My Datasets</h1>
        <Link to="/datasets/upload" className="btn btn-primary">
          Upload New Dataset
        </Link>
      </div>
      
      {/* Search and Filter */}
      <div className="datasets-toolbar">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search datasets by name, description or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
        
        {selectedDatasets.length > 0 && (
          <button 
            className="btn btn-danger" 
            onClick={deleteSelectedDatasets}
          >
            Delete Selected ({selectedDatasets.length})
          </button>
        )}
      </div>
      
      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}
      
      {/* Loading State */}
      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading datasets...</p>
        </div>
      ) : (
        <>
          {/* Datasets Table */}
          {filteredDatasets.length > 0 ? (
            <div className="datasets-table-container">
              <table className="datasets-table">
                <thead>
                  <tr>
                    <th className="checkbox-cell">
                      <input
                        type="checkbox"
                        checked={selectedDatasets.length === filteredDatasets.length && filteredDatasets.length > 0}
                        onChange={selectAllDatasets}
                      />
                    </th>
                    <th 
                      className={`sortable ${sortBy === 'name' ? 'active' : ''}`}
                      onClick={() => handleSortChange('name')}
                    >
                      Name
                      {sortBy === 'name' && (
                        <span className="sort-indicator">
                          {sortDirection === 'asc' ? ' ↑' : ' ↓'}
                        </span>
                      )}
                    </th>
                    <th>Description</th>
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
                    <th 
                      className={`sortable ${sortBy === 'rows' ? 'active' : ''}`}
                      onClick={() => handleSortChange('rows')}
                    >
                      Rows
                      {sortBy === 'rows' && (
                        <span className="sort-indicator">
                          {sortDirection === 'asc' ? ' ↑' : ' ↓'}
                        </span>
                      )}
                    </th>
                    <th>Columns</th>
                    <th 
                      className={`sortable ${sortBy === 'size' ? 'active' : ''}`}
                      onClick={() => handleSortChange('size')}
                    >
                      Size
                      {sortBy === 'size' && (
                        <span className="sort-indicator">
                          {sortDirection === 'asc' ? ' ↑' : ' ↓'}
                        </span>
                      )}
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedDatasets.map(dataset => (
                    <tr key={dataset.id}>
                      <td className="checkbox-cell">
                        <input
                          type="checkbox"
                          checked={selectedDatasets.includes(dataset.id)}
                          onChange={() => toggleDatasetSelection(dataset.id)}
                        />
                      </td>
                      <td className="dataset-name-cell">
                        <div className="file-type-icon">
                          {getFileTypeIcon(dataset.fileType)}
                        </div>
                        <div>
                          <Link to={`/datasets/${dataset.id}`} className="dataset-name">
                            {dataset.name}
                          </Link>
                          <div className="dataset-tags">
                            {dataset.tags.map((tag, index) => (
                              <span key={index} className="tag">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td>{dataset.description}</td>
                      <td>{formatDate(dataset.dateCreated)}</td>
                      <td>{dataset.rows.toLocaleString()}</td>
                      <td>{dataset.columns}</td>
                      <td>{dataset.size}</td>
                      <td className="actions-cell">
                        <div className="action-buttons">
                          <Link 
                            to={`/datasets/${dataset.id}`} 
                            className="action-button view-button" 
                            title="View Dataset"
                          >
                            👁️
                          </Link>
                          <Link 
                            to={`/projects/new?dataset=${dataset.id}`} 
                            className="action-button create-model-button" 
                            title="Create Model"
                          >
                            🤖
                          </Link>
                          <button 
                            className="action-button delete-button" 
                            title="Delete Dataset"
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete ${dataset.name}?`)) {
                                setDatasets(datasets.filter(d => d.id !== dataset.id));
                              }
                            }}
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
            // Empty state when no datasets match the search
            <div className="empty-state">
              <div className="empty-icon">📈</div>
              <h2>No datasets found</h2>
              <p>
                {searchTerm 
                  ? `No datasets match your search "${searchTerm}"`
                  : "You haven't uploaded any datasets yet"}
              </p>
              <Link to="/datasets/upload" className="btn btn-primary">
                Upload Your First Dataset
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Datasets;