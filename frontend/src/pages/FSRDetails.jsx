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
        const response = await fetch(`https://backend-services-theta.vercel.app/api/reports/fsr/${id}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        // Check if the response is OK
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Try to parse the response as JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Response is not JSON");
        }

        const data = await response.json();
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
          <p><strong>SR No:</strong> {fsr.srNo}</p>
          <p><strong>Ticket ID:</strong> {fsr.ticketId}</p>
          <p><strong>Created Date:</strong> {new Date(fsr.createdAt).toLocaleString()}</p>
        </div>

        <div className="info-group">
        <h3>Customer Details</h3>
          <p><strong>Customer Name:</strong> {fsr.customerName}</p>
          <p><strong>Customer Contact:</strong> {fsr.customerContact}</p>
          <p><strong>Customer Email:</strong> {fsr.customerEmail}</p>
          <p><strong>Site ID:</strong> {fsr.siteId}</p>
          <p><strong>Installation Address:</strong> {fsr.installationAddress}</p>
          <p><strong>State:</strong> {fsr.state}</p>
        </div>

        <div className="info-group">
        <h3>Equipment Details</h3>
          <p><strong>Instance ID:</strong> {fsr.instanceId}</p>
          <p><strong>Rating (KVA/HP):</strong> {fsr.rating}</p>
          <p><strong>Engine Model:</strong> {fsr.engineModel}</p>
          <p><strong>Engine Serial No:</strong> {fsr.engineSerial}</p>
          <p><strong>Genset Serial No:</strong> {fsr.gensetSerial}</p>
          <p><strong>Total Running Hours:</strong> {fsr.runningHours}</p>
        </div>

        <div className="info-group">
          <h3>Task Details</h3>
          <p><strong>Date of Commissioning:</strong> {fsr.commissioningDate}</p>
          <p><strong>Task Start:</strong> {fsr.taskStart}</p>
          <p><strong>Task End:</strong> {fsr.taskEnd}</p>
        </div>

        <div className="info-group">
        <h3>Service Report</h3>
          <p><strong>Problem Summary:</strong> {fsr.problemSummary}</p>
          <p><strong>Nature of Failure:</strong> {fsr.natureOfFailure}</p>
          <p><strong>Checklist/Action Taken:</strong> {fsr.checklist}</p>
          <p><strong>Engineer Remarks:</strong> {fsr.engineerRemarks}</p>
          <p><strong>Customer Remarks:</strong> {fsr.customerRemarks}</p>
        </div>
        <div className="info-group">
          <h3>Personnel</h3>
          <p><strong>Engineer Name:</strong> {fsr.engineerName}</p>
        </div>

        <div className="info-group">
          <h3>Uploaded Signatures</h3>
          <div>
            <strong>Customer Signature:</strong><br />
            {fsr.customerSignature && <img src={imageToBase64(fsr.customerSignature.data)} alt="Customer Signature" className="uploaded-image" />}
          </div>
          <div>
            <strong>Engineer Signature:</strong><br />
            {fsr.engineerSignature && <img src={imageToBase64(fsr.engineerSignature.data)} alt="Engineer Signature" className="uploaded-image" />}
          </div>
        </div>

        <div className="info-group">
          <h3>Work Completion Photos</h3>
          <div className="photo-gallery">
            {fsr.workPhotos && fsr.workPhotos.map((photo, idx) => (
              <img key={idx} src={imageToBase64(photo.data)} alt={`Work Photo ${idx + 1}`} className="uploaded-image" />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default FSRDetails;

