//individual fsr form from view button//
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";

// Helper function to convert buffer data to a base64 string
const imageToBase64 = (buffer) => {
  if (!buffer) return null;
  const binary = String.fromCharCode(...new Uint8Array(buffer));
  return `data:image/jpeg;base64,${btoa(binary)}`;
};

function FSRDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fsr, setFsr] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFSR = async () => {
      try {
        const res = await axios.get(`https://backend-services-theta.vercel.app/api/reports/fsr/${id}`);
        if (res.data && res.data.report) {
          setFsr(res.data.report);
        } else {
          setError("FSR not found");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch FSR details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFSR();
  }, [id]);

  if (isLoading) return <Spinner />;
  if (error) return <div className="error">{error}</div>;
  if (!fsr) return <div>FSR not found</div>;

  return (
    <div className="fsr-details">
      <BackButton url="/fsr" />
      <h1>Generator Service Report Details</h1>
      
      <div className="fsr-details-container">
        <div className="fsr-section">
          <h2>Basic Information</h2>
          <div className="fsr-grid">
            <div className="fsr-field">
              <label>FSR ID:</label>
              <span>{fsr.fsrId}</span>
            </div>
            <div className="fsr-field">
              <label>Ticket ID:</label>
              <span>{fsr.ticketId}</span>
            </div>
            <div className="fsr-field">
              <label>SR No:</label>
              <span>{fsr.srNo || "N/A"}</span>
            </div>
          </div>
        </div>

        <div className="fsr-section">
          <h2>Customer Information</h2>
          <div className="fsr-grid">
            <div className="fsr-field">
              <label>Customer Name:</label>
              <span>{fsr.customerName}</span>
            </div>
            <div className="fsr-field">
              <label>Installation Address:</label>
              <span>{fsr.installationAddress}</span>
            </div>
            <div className="fsr-field">
              <label>Site ID:</label>
              <span>{fsr.siteId}</span>
            </div>
            <div className="fsr-field">
              <label>Customer Contact:</label>
              <span>{fsr.customerContact}</span>
            </div>
            <div className="fsr-field">
              <label>Customer Email:</label>
              <span>{fsr.customerEmail}</span>
            </div>
          </div>
        </div>

        <div className="fsr-section">
          <h2>Equipment Details</h2>
          <div className="fsr-grid">
            <div className="fsr-field">
              <label>Commissioning Date:</label>
              <span>{new Date(fsr.commissioningDate).toLocaleDateString()}</span>
            </div>
            <div className="fsr-field">
              <label>Instance ID:</label>
              <span>{fsr.instanceId}</span>
            </div>
            <div className="fsr-field">
              <label>State:</label>
              <span>{fsr.state}</span>
            </div>
            <div className="fsr-field">
              <label>Rating:</label>
              <span>{fsr.rating}</span>
            </div>
            <div className="fsr-field">
              <label>Engine Model:</label>
              <span>{fsr.engineModel}</span>
            </div>
            <div className="fsr-field">
              <label>Engine Serial:</label>
              <span>{fsr.engineSerial}</span>
            </div>
            <div className="fsr-field">
              <label>Genset Serial:</label>
              <span>{fsr.gensetSerial}</span>
            </div>
            <div className="fsr-field">
              <label>Running Hours:</label>
              <span>{fsr.runningHours}</span>
            </div>
          </div>
        </div>

        <div className="fsr-section">
          <h2>Service Details</h2>
          <div className="fsr-grid">
            <div className="fsr-field">
              <label>Task Start:</label>
              <span>{new Date(fsr.taskStart).toLocaleString()}</span>
            </div>
            <div className="fsr-field">
              <label>Task End:</label>
              <span>{new Date(fsr.taskEnd).toLocaleString()}</span>
            </div>
            <div className="fsr-field">
              <label>Problem Summary:</label>
              <span>{fsr.problemSummary}</span>
            </div>
            <div className="fsr-field">
              <label>Nature of Failure:</label>
              <span>{fsr.natureOfFailure}</span>
            </div>
            <div className="fsr-field">
              <label>Checklist:</label>
              <span>{fsr.checklist}</span>
            </div>
          </div>
        </div>

        <div className="fsr-section">
          <h2>Remarks</h2>
          <div className="fsr-grid">
            <div className="fsr-field">
              <label>Engineer Remarks:</label>
              <span>{fsr.engineerRemarks}</span>
            </div>
            <div className="fsr-field">
              <label>Customer Remarks:</label>
              <span>{fsr.customerRemarks}</span>
            </div>
            <div className="fsr-field">
              <label>Engineer Name:</label>
              <span>{fsr.engineerName}</span>
            </div>
          </div>
        </div>

        <div className="fsr-section">
          <h2>Signatures and Photos</h2>
          <div className="fsr-grid">
            <div className="fsr-field">
              <label>Customer Signature:</label>
              {fsr.customerSignature && (
                <img 
                  src={imageToBase64(fsr.customerSignature.data)} 
                  alt="Customer Signature" 
                  className="signature-image"
                />
              )}
            </div>
            <div className="fsr-field">
              <label>Engineer Signature:</label>
              {fsr.engineerSignature && (
                <img 
                  src={imageToBase64(fsr.engineerSignature.data)} 
                  alt="Engineer Signature" 
                  className="signature-image"
                />
              )}
            </div>
            <div className="fsr-field">
              <label>Work Photos:</label>
              <div className="work-photos">
                {fsr.workPhotos && fsr.workPhotos.map((photo, index) => (
                  <img 
                    key={index}
                    src={imageToBase64(photo.data)} 
                    alt={`Work Photo ${index + 1}`}
                    className="work-photo"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FSRDetails;
