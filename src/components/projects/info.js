import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PlacementForm = () => {
  const [formSchema, setFormSchema] = useState({});
  const [formData, setFormData] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8006/placement_schema')
      .then(res => {
        const schema = res.data;
        setFormSchema(schema);
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
    axios.post('http://localhost:8006/predict_placement', formData)
      .then(res => {
        setPrediction(res.data.prediction);
        setError('');
      })
      .catch(err => {
        console.error('Prediction error:', err);
        setError('Prediction failed');
      });
  };

  return (
    <div style={{
      maxWidth: '550px',
      margin: '30px auto',
      padding: '25px',
      backgroundColor: '#ffffff',
      borderRadius: '10px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Segoe UI, sans-serif',
      color: '#2c3e50'
    }}>
      <h2 style={{
        textAlign: 'center',
        marginBottom: '20px',
        color: '#2980b9'
      }}>Placement Predictor</h2>

      {error && (
        <p style={{
          color: '#c0392b',
          textAlign: 'center',
          padding: '10px',
          backgroundColor: '#f9d6d5',
          borderRadius: '6px',
          fontWeight: 'bold'
        }}>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        {Object.entries(formSchema).map(([field, schema]) => (
          <div key={field} style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontWeight: 600,
              color: '#34495e'
            }}>{field}:</label>
            <input
              type={schema.type === 'number' ? 'number' : 'text'}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                outline: 'none',
                fontSize: '14px',
                backgroundColor: '#fdfdfd',
                color: '#2c3e50'
              }}
              step={schema.type === 'number' ? 'any' : undefined}
            />
          </div>
        ))}

        <button
          type="submit"
          style={{
            backgroundColor: '#27ae60',
            color: '#fff',
            padding: '12px 18px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#1e8449'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#27ae60'}
        >
          Predict
        </button>
      </form>

      {prediction !== null && (
        <div style={{
          marginTop: '25px',
          padding: '15px',
          backgroundColor: '#ecf0f1',
          borderRadius: '8px',
          border: '1px solid #bdc3c7',
          textAlign: 'center'
        }}>
          <h3 style={{
            margin: 0,
            marginBottom: '10px',
            color: '#2c3e50'
          }}>Prediction Result:</h3>
          <p style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#27ae60',
            margin: 0
          }}>{prediction}</p>
        </div>
      )}
    </div>
  );
};

export default PlacementForm;
