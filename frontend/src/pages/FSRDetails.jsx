import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import BackButton from '../components/BackButton';

// Helper function to convert buffer data to a base64 string
const imageToBase64 = (buffer) => {
  const binary = String.fromCharCode(...new Uint8Array(buffer));
  return `data:image/jpeg;base64,${btoa(binary)}`;
};

function FSRDetails() {
  const [fsr, setFSR] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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
        console.log("Received FSR data:", data); // Debug log
        
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

        {fsr.customerSignature && (
          <div className="info-group">
            <h3>Customer Signature</h3>
            <img 
              src={`data:image/jpeg;base64,${fsr.customerSignature}`} 
              alt="Customer Signature" 
              style={{ maxWidth: '200px' }}
            />
          </div>
        )}

        {fsr.engineerSignature && (
          <div className="info-group">
            <h3>Engineer Signature</h3>
            <img 
              src={`data:image/jpeg;base64,${fsr.engineerSignature}`} 
              alt="Engineer Signature" 
              style={{ maxWidth: '200px' }}
            />
          </div>
        )}

        {fsr.workPhotos && fsr.workPhotos.length > 0 && (
          <div className="info-group">
            <h3>Work Photos</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {fsr.workPhotos.map((photo, index) => (
                <img 
                  key={index}
                  src={`data:image/jpeg;base64,${photo}`} 
                  alt={`Work Photo ${index + 1}`}
                  style={{ maxWidth: '200px' }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FSRDetails;

