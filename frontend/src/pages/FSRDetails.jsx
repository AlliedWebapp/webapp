//individual fsr form from view button//
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";

// Helper function to convert buffer data to a base64 string
const imageToBase64 = (buffer) => {
  try {
    if (!buffer || !buffer.data) return null;
    const binary = String.fromCharCode(...new Uint8Array(buffer.data));
    return `data:image/jpeg;base64,${btoa(binary)}`;
  } catch (error) {
    console.error("Error converting image to base64:", error);
    return null;
  }
};

function FSRDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fsr, setFsr] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchFSR = async () => {
      try {
        console.log("Fetching FSR with ID:", id);
        const res = await axios.get(`https://backend-services-theta.vercel.app/api/reports/fsr/${id}`);
        console.log("FSR Details Response:", res.data);
        
        if (res.data) {
          setFsr(res.data);
        } else {
          setError("FSR not found");
        }
      } catch (err) {
        console.error("Error fetching FSR:", err);
        setError(err.response?.data?.message || "Failed to fetch FSR details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFSR();
  }, [id]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  if (isLoading) return <Spinner />;
  if (error) return <div className="error">{error}</div>;
  if (!fsr) return <div className="error">FSR not found</div>;

  return (
    <div className="fsr-details">
      <BackButton url="/fsr" />
      <h1>Generator Service Report Details</h1>
      
      <div className="fsr-details-container">
        <table className="fsr-table">
          <tbody>
            {/* Basic Information */}
            <tr>
              <td className="fsr-label">FSR ID</td>
              <td>{fsr.fsrId}</td>
              <td className="fsr-label">Ticket ID</td>
              <td>{fsr.ticketId}</td>
              <td className="fsr-label">SR No</td>
              <td>{fsr.srNo || "N/A"}</td>
            </tr>

            {/* Customer Information */}
            <tr>
              <td className="fsr-label">Customer Name</td>
              <td>{fsr.customerName}</td>
              <td className="fsr-label">Site ID</td>
              <td>{fsr.siteId}</td>
              <td className="fsr-label">Customer Contact</td>
              <td>{fsr.customerContact}</td>
            </tr>
            <tr>
              <td className="fsr-label">Installation Address</td>
              <td colSpan="5">{fsr.installationAddress}</td>
            </tr>
            <tr>
              <td className="fsr-label">Customer Email</td>
              <td colSpan="5">{fsr.customerEmail}</td>
            </tr>

            {/* Equipment Details */}
            <tr>
              <td className="fsr-label">Commissioning Date</td>
              <td>{new Date(fsr.commissioningDate).toLocaleDateString()}</td>
              <td className="fsr-label">Instance ID</td>
              <td>{fsr.instanceId}</td>
              <td className="fsr-label">State</td>
              <td>{fsr.state}</td>
            </tr>
            <tr>
              <td className="fsr-label">Rating</td>
              <td>{fsr.rating}</td>
              <td className="fsr-label">Engine Model</td>
              <td>{fsr.engineModel}</td>
              <td className="fsr-label">Engine Serial</td>
              <td>{fsr.engineSerial}</td>
            </tr>
            <tr>
              <td className="fsr-label">Genset Serial</td>
              <td>{fsr.gensetSerial}</td>
              <td className="fsr-label">Running Hours</td>
              <td colSpan="3">{fsr.runningHours}</td>
            </tr>

            {/* Service Details */}
            <tr>
              <td className="fsr-label">Task Start</td>
              <td>{new Date(fsr.taskStart).toLocaleString()}</td>
              <td className="fsr-label">Task End</td>
              <td colSpan="3">{new Date(fsr.taskEnd).toLocaleString()}</td>
            </tr>
            <tr>
              <td className="fsr-label">Problem Summary</td>
              <td colSpan="5">{fsr.problemSummary}</td>
            </tr>
            <tr>
              <td className="fsr-label">Nature of Failure</td>
              <td colSpan="5">{fsr.natureOfFailure}</td>
            </tr>
            <tr>
              <td className="fsr-label">Spare Used</td>
              <td colSpan="5">{fsr.spareused || "N/A"}</td>
            </tr>
            <tr>
              <td className="fsr-label">Checklist</td>
              <td colSpan="5">{fsr.checklist}</td>
            </tr>

            {/* Remarks */}
            <tr>
              <td className="fsr-label">Engineer Remarks</td>
              <td colSpan="5">{fsr.engineerRemarks}</td>
            </tr>
            <tr>
              <td className="fsr-label">Customer Remarks</td>
              <td colSpan="5">{fsr.customerRemarks}</td>
            </tr>
            <tr>
              <td className="fsr-label">Engineer Name</td>
              <td colSpan="5">{fsr.engineerName}</td>
            </tr>

            {/* Signatures and Photos */}
            <tr>
              <td className="fsr-label">Customer Signature</td>
              <td colSpan="5">
                {fsr.customerSignature && (
                  <img 
                    src={imageToBase64(fsr.customerSignature)} 
                    alt="Customer Signature" 
                    className="signature-image"
                    onClick={() => handleImageClick(fsr.customerSignature)}
                  />
                )}
              </td>
            </tr>
            <tr>
              <td className="fsr-label">Engineer Signature</td>
              <td colSpan="5">
                {fsr.engineerSignature && (
                  <img 
                    src={imageToBase64(fsr.engineerSignature)} 
                    alt="Engineer Signature" 
                    className="signature-image"
                    onClick={() => handleImageClick(fsr.engineerSignature)}
                  />
                )}
              </td>
            </tr>
            <tr>
              <td className="fsr-label">Work Photos</td>
              <td colSpan="5">
                <div className="work-photos">
                  {fsr.workPhotos && fsr.workPhotos.map((photo, index) => (
                    <img 
                      key={index}
                      src={imageToBase64(photo)} 
                      alt={`Work Photo ${index + 1}`}
                      className="work-photo"
                      onClick={() => handleImageClick(photo)}
                    />
                  ))}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {selectedImage && (
        <div className="image-modal" onClick={closeImageModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <span className="close-button" onClick={closeImageModal}>&times;</span>
            <img 
              src={imageToBase64(selectedImage)} 
              alt="Preview" 
              className="preview-image"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default FSRDetails;
 