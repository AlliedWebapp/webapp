import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BackButton from '../components/BackButton';
import { useSelector } from 'react-redux';

const API_URL = process.env.REACT_APP_API_BASE_URL;

// Component to display and download PDFs from the backend
const Formats = () => {
  const [pdfs, setPdfs] = useState([]);         // List of PDFs
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null);     // Error state
  const { user } = useSelector((state) => state.auth);

  // Fetch the list of PDFs from the backend on component mount
  useEffect(() => {
    const fetchPDFs = async () => {
      try {
        setError(null);
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/formats`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
        setPdfs(res.data);
      } catch (err) {
        // Check for 403 Forbidden from backend
      if (err.response && err.response.status === 403) {
        setError('Access denied: This user has inventory access only.');
      } else {
        setError(
          err.response?.data?.message ||
          'Failed to load PDF list'
        );
      }
    } finally {
      setLoading(false);
      }
    };
    fetchPDFs();
  }, []);

  // Download a PDF by its id
  const downloadPDF = async (id, title) => {
    try {
      const res = await axios.get(`${API_URL}/api/formats/${id}`, {
  responseType: 'blob',
  headers: {
    'Accept': 'application/pdf',
   Authorization: `Bearer ${user.token}`}
});
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Download failed');
    }
  };

   // View a PDF in a new tab by its id
  const viewPDF = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/api/formats/${id}`, {
        responseType: 'blob',
        headers: { 'Accept': 'application/pdf', 
          Authorization: `Bearer ${user.token}`
        }
      });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      window.open(url, '_blank', 'noopener,noreferrer');
      // Optionally, you can revoke the object URL after a delay to ensure the tab loads
      setTimeout(() => window.URL.revokeObjectURL(url), 1000 * 60);
    } catch (err) {
      setError('Failed to open PDF');
    }
  };


  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 24, background: '#fafafa', borderRadius: 8 }}>
      <BackButton url="/home" />
      <h2 style={{ textAlign: 'center' }}>Maintenance Formats</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : pdfs.length === 0 ? (
        <p>No Formats available.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
        {pdfs.map((pdf, index) => (
            <li
              key={pdf._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: 16,
                borderBottom: '1px solid #eee',
                paddingBottom: 8
              }}
            >
                  {/* Sr No. */}
              <span style={{ width: 30, fontWeight: 'bold' }}>{index + 1}.</span>
              {/* PDF Title */}
              <span style={{ flex: 2 }}>{pdf.title}</span>
              {/* View Button */}
              <button
                onClick={() => viewPDF(pdf._id)}
                style={{
                  background: '#43a047',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: 4,
                  cursor: 'pointer',
                  marginLeft: 10
                }}
              >
                View
              </button>
              {/* Download Button */}
              <button
                onClick={() => downloadPDF(pdf._id, pdf.title)}
                style={{
                  background: '#1976d2',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: 4,
                  cursor: 'pointer',
                  marginLeft: 10
                }}
              >
                Download
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Formats;