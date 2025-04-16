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
          <p><strong>Date:</strong> {new Date(fsr.createdAt).toLocaleDateString()}</p>
          <p><strong>Status:</strong> {fsr.status}</p>
        </div>

        <div className="info-group">
          <h3>Service Details</h3>
          <p><strong>Service Type:</strong> {fsr.serviceType}</p>
          <p><strong>Description:</strong> {fsr.description}</p>
          <p><strong>Technician:</strong> {fsr.engineerName}</p>
        </div>

        <div className="info-group">
          <h3>Customer Information</h3>
          <p><strong>Customer Name:</strong> {fsr.customerName}</p>
          <p><strong>Contact:</strong> {fsr.customerContact}</p>
          <p><strong>Address:</strong> {fsr.installationAddress}</p>
        </div>

        <div className="info-group">
          <h3>Equipment Details</h3>
          <p><strong>Equipment Type:</strong> {fsr.engineModel}</p>
          <p><strong>Model:</strong> {fsr.engineSerial}</p>
          <p><strong>Serial Number:</strong> {fsr.gensetSerial}</p>
        </div>

        <div className="info-group">
          <h3>Service Report</h3>
          <p><strong>Work Performed:</strong> {fsr.problemSummary}</p>
          <p><strong>Parts Used:</strong> {fsr.natureOfFailure}</p>
          <p><strong>Recommendations:</strong> {fsr.engineerRemarks}</p>
        </div>
      </div>
    </div>
  );
}

export default FSRDetails; 