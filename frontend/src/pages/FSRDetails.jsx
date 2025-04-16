import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import BackButton from '../components/BackButton';

// Helper function to convert buffer data to a base64 string
const imageToBase64 = (buffer) => {
  try {
    if (!buffer) return '';
    
    // If the buffer is already a base64 string, return it
    if (typeof buffer === 'string' && buffer.startsWith('data:image')) {
      return buffer;
    }
    
    // If it's a Buffer object
    if (buffer.type === 'Buffer' && Array.isArray(buffer.data)) {
      const binary = String.fromCharCode(...new Uint8Array(buffer.data));
      return `data:image/jpeg;base64,${btoa(binary)}`;
    }
    
    // If it's a direct buffer
    if (buffer instanceof ArrayBuffer || ArrayBuffer.isView(buffer)) {
      const binary = String.fromCharCode(...new Uint8Array(buffer));
      return `data:image/jpeg;base64,${btoa(binary)}`;
    }
    
    return '';
  } catch (error) {
    console.error("Error converting buffer to base64:", error);
    return '';
  }
};

function FSRDetails() {
  const [fsr, setFSR] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFSR = async () => {
      try {
        const response = await fetch(`/api/fsr/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch FSR details');
        }

        setFSR(data);
      } catch (error) {
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
          <p><strong>FSR ID:</strong> {fsr.fsr_id}</p>
          <p><strong>Date:</strong> {new Date(fsr.date).toLocaleDateString()}</p>
          <p><strong>Status:</strong> {fsr.status}</p>
        </div>

        <div className="info-group">
          <h3>Service Details</h3>
          <p><strong>Service Type:</strong> {fsr.service_type}</p>
          <p><strong>Description:</strong> {fsr.description}</p>
          <p><strong>Technician:</strong> {fsr.technician}</p>
        </div>

        <div className="info-group">
          <h3>Customer Information</h3>
          <p><strong>Customer Name:</strong> {fsr.customer_name}</p>
          <p><strong>Contact:</strong> {fsr.customer_contact}</p>
          <p><strong>Address:</strong> {fsr.customer_address}</p>
        </div>

        <div className="info-group">
          <h3>Equipment Details</h3>
          <p><strong>Equipment Type:</strong> {fsr.equipment_type}</p>
          <p><strong>Model:</strong> {fsr.equipment_model}</p>
          <p><strong>Serial Number:</strong> {fsr.equipment_serial}</p>
        </div>

        <div className="info-group">
          <h3>Service Report</h3>
          <p><strong>Work Performed:</strong> {fsr.work_performed}</p>
          <p><strong>Parts Used:</strong> {fsr.parts_used}</p>
          <p><strong>Recommendations:</strong> {fsr.recommendations}</p>
        </div>
      </div>
    </div>
  );
}

export default FSRDetails; 