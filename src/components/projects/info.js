import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PlacementForm = () => {
  const [formSchema, setFormSchema] = useState({});
  const [formData, setFormData] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch the schema from the backend
    axios.get('http://localhost:8006/placement_schema')
      .then(res => {
        const schema = res.data;
        console.log('Form Schema:', schema); // Log the schema to console
        setFormSchema(schema);
        
        // Initialize form data with empty values
        const initialData = {};
        Object.keys(schema).forEach(key => {
          initialData[key] = schema[key].type === 'number' ? 0 : '';
        });
        setFormData(initialData);
      })
      .catch(err => {
        console.error('Error fetching schema:', err);
        setError('Failed to load form schema');
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const formattedValue = type === 'number' ? parseFloat(value) : value;
    setFormData({ ...formData, [name]: formattedValue });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);
    
    axios.post('http://localhost:8006/predict_placement', formData)
      .then(res => {
        console.log('Prediction result:', res.data);
        setPrediction(res.data.prediction);
        setError('');
      })
      .catch(err => {
        console.error('Prediction error:', err);
        setError('Prediction failed');
      });
  };

  return (
    <div style={{ maxWidth: '500px', margin: 'auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', color: '#2c3e50' }}>Placement Predictor</h2>
      
      {error && <p style={{ color: 'red', textAlign: 'center', padding: '10px', backgroundColor: '#ffeeee', borderRadius: '5px' }}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        {Object.entries(formSchema).map(([field, schema]) => (
          <div key={field} style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{field}:</label>
            <input
              type={schema.type === 'number' ? 'number' : 'text'}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
              style={{ 
                width: '100%', 
                padding: '8px', 
                borderRadius: '4px', 
                border: '1px solid #ddd' 
              }}
              step={schema.type === 'number' ? 'any' : undefined}
            />
          </div>
        ))}
        
        <button 
          type="submit" 
          style={{
            backgroundColor: '#3498db',
            color: 'white',
            padding: '10px 15px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            marginTop: '10px'
          }}
        >
          Predict
        </button>
      </form>
      
      {prediction !== null && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '5px',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ marginTop: '0', color: '#2c3e50' }}>Prediction Result:</h3>
          <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{prediction}</p>
        </div>
      )}
    </div>
  );
};

export default PlacementForm;