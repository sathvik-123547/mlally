// src/components/AvatarUploader.js
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase'; // Use initialized Firestore
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AvatarUploader = () => {
  const [preview, setPreview] = useState(null);
  const [base64String, setBase64String] = useState('');
  const [fetchedImage, setFetchedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const base64 = await convertToBase64(file);
      setBase64String(base64);
      setPreview(base64);
    } catch (error) {
      console.error('Error converting to base64:', error);
    }
  };

  const handleUpload = async () => {
    const userId = 'demo-user'; // Replace with dynamic user ID if needed
    if (!base64String) return alert('No image selected');

    try {
      await setDoc(doc(db, 'avatars', userId), {
        avatar: base64String,
      });
      alert('✅ Image uploaded to Firestore!');
      fetchAvatar(); // Refresh the fetched image
    } catch (error) {
      console.error('Upload failed:', error);
      alert('❌ Failed to upload. Please try again.');
    }
  };

  const fetchAvatar = async () => {
    setLoading(true);
    const userId = 'demo-user';
    try {
      const docRef = doc(db, 'avatars', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFetchedImage(docSnap.data().avatar);
      } else {
        setFetchedImage(null);
        console.log('No avatar found.');
      }
    } catch (error) {
      console.error('Error fetching avatar:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvatar();
  }, []);

  return (
    <div style={{ background: '#111', color: '#fff', padding: '2rem', textAlign: 'center' }}>
      <h2>Upload Avatar to Firestore</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <br /><br />

      {preview && (
        <div>
          <h4>Preview:</h4>
          <img src={preview} alt="Preview" style={{ width: '150px', borderRadius: '10px' }} />
        </div>
      )}

      <br />
      <button onClick={handleUpload} style={{ padding: '10px 20px', cursor: 'pointer' }}>
        Upload to Firestore
      </button>

      <hr style={{ margin: '2rem 0' }} />

      <h3>Fetched from Firestore:</h3>
      {loading ? (
        <p>Loading image...</p>
      ) : fetchedImage ? (
        <img src={fetchedImage} alt="Fetched" style={{ width: '150px', borderRadius: '10px' }} />
      ) : (
        <p>No image found.</p>
      )}
    </div>
  );
};

export default AvatarUploader;
