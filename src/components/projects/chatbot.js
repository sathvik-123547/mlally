import React, { useState } from 'react';

const Chatbot = () => {
  const [file, setFile] = useState(null);
  const [instruction, setInstruction] = useState('');
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [status, setStatus] = useState('');
  const [uploaded, setUploaded] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file || !instruction) {
      setStatus('Please select a PDF file and enter instruction.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('instruction', instruction);

    try {
      const res = await fetch('http://127.0.0.1:8100/upload_pdf', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus(`Error: ${data.error}`);
        setUploaded(false);
      } else {
        setStatus('PDF uploaded successfully.');
        setUploaded(true);
      }
    } catch (error) {
      setStatus(`Upload failed: ${error.message}`);
    }
  };

  const handleQuery = async () => {
    if (!query) return;

    try {
      const res = await fetch('http://127.0.0.1:8100/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      if (!res.ok) {
        setResponse(`Error: ${data.error}`);
      } else {
        setResponse(`Response: ${data}`);
      }
    } catch (err) {
      setResponse(`Request failed: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📄 Upload PDF and Chat</h2>

      <form onSubmit={handleUpload} style={{ marginBottom: '1rem' }}>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <br />
        <input
          type="text"
          placeholder="Enter instruction"
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          style={{ marginTop: '0.5rem' }}
        />
        <br />
        <button type="submit" style={{ marginTop: '0.5rem' }}>
          Upload PDF
        </button>
      </form>

      <p>{status}</p>

      {uploaded && (
        <div>
          <input
            type="text"
            placeholder="Ask a question about the PDF"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={handleQuery} style={{ marginLeft: '0.5rem' }}>
            Ask
          </button>
        </div>
      )}

      {response && (
        <pre
          style={{
            background: '#f5f5f5',
            padding: '1rem',
            marginTop: '1rem',
            whiteSpace: 'pre-wrap',
          }}
        >
          {response}
        </pre>
      )}
    </div>
  );
};

export default Chatbot;
