import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import BackButton from '../components/BackButton';

// Helper function to convert buffer data to a base64 string
const imageToBase64 = (buffer) => {
  if (!buffer) return '';
  
  // If buffer is already a base64 string, just return it
  if (typeof buffer === 'string') return buffer;

  try {
    const binary = String.fromCharCode(...new Uint8Array(buffer));
    return `data:image/jpeg;base64,${btoa(binary)}`;
  } catch (error) {
    console.error("Base64 conversion error:", error);
    return '';
  }
};

function FSRDetails() {
  const [fsr, setFSR] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFSR = async () => {
      try {
        const response = await fetch(`https://backend-services-theta.vercel.app/api/reports/fsr/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch FSR details');
        }

        const data = await response.json();
        console.log("Received FSR data:", data);
        
        if (!data) {
          throw new Error('No FSR data received');
        }

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

  if (isLoading) {
    return <Spinner />;
  }

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
                className="uploaded-image"
                onClick={() => setSelectedImage(imageToBase64(fsr.customerSignature?.data || fsr.customerSignature))}
                style={{ cursor: 'pointer', maxWidth: '300px' }}
              />
            )}
          </div>
          <div>
            <strong>Engineer Signature:</strong><br />
            {fsr.engineerSignature && (
              <img 
                src={imageToBase64(fsr.engineerSignature?.data || fsr.engineerSignature)} 
                alt="Engineer Signature" 
                className="uploaded-image"
                onClick={() => setSelectedImage(imageToBase64(fsr.engineerSignature?.data || fsr.engineerSignature))}
                style={{ cursor: 'pointer', maxWidth: '300px' }}
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
                className="uploaded-image"
                onClick={() => setSelectedImage(imageToBase64(photo?.data || photo))}
                style={{ cursor: 'pointer', maxWidth: '300px' }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <span className="close-button" onClick={() => setSelectedImage(null)}>&times;</span>
            <img src={selectedImage} alt="Preview" className="preview-image" />
          </div>
        </div>
      )}
    </div>
  );
}

export default FSRDetails;
