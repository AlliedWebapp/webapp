//individual fsr form from view button//
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import BackButton from '../components/BackButton';

// Helper function to convert buffer data to a base64 string
const imageToBase64 = (buffer) => {
  if (!buffer) return '';

  try {
    const bytes = new Uint8Array(buffer.data || buffer); // handles either `.data` or raw buffer
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return `data:image/jpeg;base64,${btoa(binary)}`;
  } catch (error) {
    console.error("Base64 conversion error:", error);
    return '';
  }
};


function FSRDetails() {
  const [fsr, setFSR] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFSR = async () => {
      try {
        const response = await fetch(`https://backend-services-theta.vercel.app/api/reports/fsr/${id}`);
        
        if (!response.ok) throw new Error('Failed to fetch FSR details');

        const data = await response.json();
        if (!data) throw new Error('No FSR data received');

        setFSR(data);
      } catch (error) {
        console.error("Error fetching FSR:", error);
        toast.error(error.message || 'Failed to fetch FSR details');
        navigate('/FSR');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFSR();
  }, [id, navigate]);

  if (isLoading) return <Spinner />;

  if (!fsr) {
    return (
      <div className="error-container">
        <h3>No FSR found</h3>
        <button onClick={() => navigate('/FSR')}>Back to FSR List</button>
      </div>
    );
  }

  return (
    <div className="fsr-details">
      <div className="fsr-header">
        <BackButton url="/FSR" />
        <h2>FSR Details</h2>
      </div>

      <div className="fsr-info">
        {/* Basic Information */}
        <div className="info-group">
          <h3>Basic Information</h3>
          <p><strong>FSR ID:</strong> {fsr.fsrId}</p>
          <p><strong>Ticket ID:</strong> {fsr.ticketId}</p>
          <p><strong>Created Date:</strong> {new Date(fsr.createdAt).toLocaleString()}</p>
        </div>

        {/* Customer Information */}
        <div className="info-group">
          <h3>Customer Information</h3>
          <p><strong>Customer Name:</strong> {fsr.customerName}</p>
          <p><strong>Contact:</strong> {fsr.customerContact}</p>
          <p><strong>Email:</strong> {fsr.customerEmail}</p>
          <p><strong>Installation Address:</strong> {fsr.installationAddress}</p>
          <p><strong>Site ID:</strong> {fsr.siteId}</p>
          <p><strong>State:</strong> {fsr.state}</p>
        </div>

        {/* Uploaded Signatures */}
        <div className="info-group">
          <h3>Uploaded Signatures</h3>
          <div>
            <strong>Customer Signature:</strong><br />
            {fsr.customerSignature && (
              <img 
                src={imageToBase64(fsr.customerSignature?.data || fsr.customerSignature)} 
                alt="Customer Signature" 
                className="thumbnail-image"
                onClick={() => setPreviewImage(imageToBase64(fsr.customerSignature?.data || fsr.customerSignature))}
              />
            )}
          </div>
          <div>
            <strong>Engineer Signature:</strong><br />
            {fsr.engineerSignature && (
              <img 
                src={imageToBase64(fsr.engineerSignature?.data || fsr.engineerSignature)} 
                alt="Engineer Signature" 
                className="thumbnail-image"
                onClick={() => setPreviewImage(imageToBase64(fsr.engineerSignature?.data || fsr.engineerSignature))}
              />
            )}
          </div>
        </div>

        {/* Work Completion Photos */}
        <div className="info-group">
          <h3>Work Completion Photos</h3>
          <div className="photo-gallery">
            {fsr.workPhotos && fsr.workPhotos.map((photo, idx) => (
              <img 
                key={idx} 
                src={imageToBase64(photo?.data || photo)} 
                alt={`Work Photo ${idx + 1}`} 
                className="thumbnail-image"
                onClick={() => setPreviewImage(imageToBase64(photo?.data || photo))}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Image preview overlay */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <img
            src={previewImage}
            alt="Preview"
            style={{
              maxWidth: "90%",
              maxHeight: "80%",
              borderRadius: "12px",
              background: "#fff",
              padding: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            }}
          />
        </div>
      )}
    </div>
  );
}

export default FSRDetails;
