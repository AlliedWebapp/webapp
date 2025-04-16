import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import BackButton from '../components/BackButton';

// Helper function to convert buffer data to a base64 string
const imageToBase64 = (buffer, mimeType = 'image/jpeg') => {
  if (!buffer) return '';
  const binary = String.fromCharCode(...new Uint8Array(buffer));
  return `data:${mimeType};base64,${btoa(binary)}`;
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
        <button onClick={() => navigate('/FSR')}>
          Back to FSR List
        </button>
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
        <div className="info-group">
          <h3>Basic Information</h3>
          <p><strong>FSR ID:</strong> {fsr.fsrId}</p>
          <p><strong>Ticket ID:</strong> {fsr.ticketId}</p>
          <p><strong>Created Date:</strong> {new Date(fsr.createdAt).toLocaleString()}</p>
        </div>

        <div className="info-group">
          <h3>Customer Information</h3>
          <p><strong>Customer Name:</strong> {fsr.customerName}</p>
          <p><strong>Contact:</strong> {fsr.customerContact}</p>
          <p><strong>Email:</strong> {fsr.customerEmail}</p>
          <p><strong>Installation Address:</strong> {fsr.installationAddress}</p>
          <p><strong>Site ID:</strong> {fsr.siteId}</p>
          <p><strong>State:</strong> {fsr.state}</p>
        </div>

        <div className="info-group">
          <h3>Equipment Details</h3>
          <p><strong>Instance ID:</strong> {fsr.instanceId}</p>
          <p><strong>Rating:</strong> {fsr.rating}</p>
          <p><strong>Engine Model:</strong> {fsr.engineModel}</p>
          <p><strong>Engine Serial:</strong> {fsr.engineSerial}</p>
          <p><strong>Genset Serial:</strong> {fsr.gensetSerial}</p>
          <p><strong>Running Hours:</strong> {fsr.runningHours}</p>
        </div>

        <div className="info-group">
          <h3>Service Details</h3>
          <p><strong>Commissioning Date:</strong> {new Date(fsr.commissioningDate).toLocaleDateString()}</p>
          <p><strong>Task Start:</strong> {new Date(fsr.taskStart).toLocaleString()}</p>
          <p><strong>Task End:</strong> {new Date(fsr.taskEnd).toLocaleString()}</p>
          <p><strong>Problem Summary:</strong> {fsr.problemSummary}</p>
          <p><strong>Nature of Failure:</strong> {fsr.natureOfFailure}</p>
        </div>

        <div className="info-group">
          <h3>Service Report</h3>
          <p><strong>Checklist:</strong> {fsr.checklist}</p>
          <p><strong>Engineer Remarks:</strong> {fsr.engineerRemarks}</p>
          <p><strong>Customer Remarks:</strong> {fsr.customerRemarks}</p>
          <p><strong>Engineer Name:</strong> {fsr.engineerName}</p>
        </div>

        <div className="info-group">
          <h3>Uploaded Signatures</h3>
          <div>
            <strong>Customer Signature:</strong><br />
            {fsr.customerSignature && fsr.customerSignature.data && (
        <img 
          src={imageToBase64(fsr.customerSignature.data)} 
          alt="Customer Signature" 
          className="uploaded-image"
          onClick={() => setSelectedImage(imageToBase64(fsr.customerSignature.data))}
          style={{ cursor: 'pointer', maxWidth: '300px' }}
      />
    )}
          </div>
          <div>
            <strong>Engineer Signature:</strong><br />
            {fsr.engineerSignature && fsr.engineerSignature.data && (
             <img 
             src={imageToBase64(fsr.engineerSignature.data)} 
             alt="Engineer Signature" 
             className="uploaded-image"
             onClick={() => setSelectedImage(imageToBase64(fsr.engineerSignature.data))}
            style={{ cursor: 'pointer', maxWidth: '300px' }}
          />
         )}
          </div>
        </div>

        <div className="info-group">
          <h3>Work Completion Photos</h3>
          <div className="photo-gallery">
          {fsr.workPhotos && fsr.workPhotos.map((photo, idx) => (
           photo.data && (
           <img 
            key={idx} 
            src={imageToBase64(photo.data)} 
            alt={`Work Photo ${idx + 1}`} 
            className="uploaded-image"
           onClick={() => setSelectedImage(imageToBase64(photo.data))}
         style={{ cursor: 'pointer', maxWidth: '300px' }}
       />
      )
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

