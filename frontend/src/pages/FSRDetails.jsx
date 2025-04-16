import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/Spinner';
import BackButton from '../components/BackButton';
import { toast } from 'react-toastify';

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
  const [fsr, setFsr] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFSR = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get(`http://localhost:5000/api/reports/fsr/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data) {
          setFsr(res.data);
        } else {
          setMessage("Invalid response format");
          setIsError(true);
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching FSR:", err);
        if (err.response) {
          setMessage(err.response.data.message || "Error fetching FSR");
        } else if (err.request) {
          setMessage("No response from server");
        } else {
          setMessage("Error setting up request");
        }
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchFSR();
  }, [id, navigate]);

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return (
      <div className="error-container">
        <h3>{message}</h3>
        <button onClick={() => navigate("/fsr")}>Back to FSRs</button>
      </div>
    );
  }

  if (!fsr) {
    return (
      <div className="error-container">
        <h3>FSR not found</h3>
        <button onClick={() => navigate("/fsr")}>Back to FSRs</button>
      </div>
    );
  }

  return (
    <div className="fsr-details">
      <BackButton />
      <div className="fsr-header">
        <h2>FSR #{fsr.fsrId}</h2>
      </div>

      <div className="fsr-info">
        <div className="info-group">
          <h3>Basic Information</h3>
          <p><strong>Customer Name:</strong> {fsr.customerName}</p>
          <p><strong>Installation Address:</strong> {fsr.installationAddress}</p>
          <p><strong>Site ID:</strong> {fsr.siteId}</p>
          <p><strong>Commissioning Date:</strong> {new Date(fsr.commissioningDate).toLocaleDateString()}</p>
        </div>

        <div className="info-group">
          <h3>Service Details</h3>
          <p><strong>Task Start:</strong> {new Date(fsr.taskStart).toLocaleString()}</p>
          <p><strong>Task End:</strong> {new Date(fsr.taskEnd).toLocaleString()}</p>
          <p><strong>Problem Summary:</strong> {fsr.problemSummary}</p>
          <p><strong>Nature of Failure:</strong> {fsr.natureOfFailure}</p>
        </div>

        <div className="info-group">
          <h3>Customer Information</h3>
          <p><strong>Contact:</strong> {fsr.customerContact}</p>
          <p><strong>Email:</strong> {fsr.customerEmail}</p>
          <p><strong>Remarks:</strong> {fsr.customerRemarks}</p>
        </div>

        <div className="info-group">
          <h3>Equipment Details</h3>
          <p><strong>Engine Model:</strong> {fsr.engineModel}</p>
          <p><strong>Engine Serial:</strong> {fsr.engineSerial}</p>
          <p><strong>Genset Serial:</strong> {fsr.gensetSerial}</p>
          <p><strong>Running Hours:</strong> {fsr.runningHours}</p>
        </div>

        <div className="info-group">
          <h3>Service Report</h3>
          <p><strong>Engineer Name:</strong> {fsr.engineerName}</p>
          <p><strong>Engineer Remarks:</strong> {fsr.engineerRemarks}</p>
          <p><strong>Checklist:</strong> {fsr.checklist}</p>
        </div>
      </div>
    </div>
  );
}

export default FSRDetails; 