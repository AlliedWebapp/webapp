//individual fsr form from view button//
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";
import { useSelector } from "react-redux";
import html2pdf from "html2pdf.js/dist/html2pdf.bundle";
import { FiDownload } from "react-icons/fi";

const API_URL = process.env.REACT_APP_API_BASE_URL;

// Helper function to convert buffer data to a base64 string
const bufferToDataUrl = (imgObj) => {
  if (!imgObj || !imgObj.data) return null;
  // Convert buffer data to Uint8Array and then to base64
  const base64String = btoa(String.fromCharCode(...new Uint8Array(imgObj.data)));
  return `data:${imgObj.contentType || 'image/jpeg'};base64,${base64String}`;
};

function FSRDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fsr, setFsr] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const fsrRef = useRef();

  useEffect(() => {
    const fetchFSR = async () => {
      try {
        if (!user?.token) {
          setError("Please login to view reports");
          setIsLoading(false);
          return;
        }

        console.log("Fetching FSR with ID:", id);
        const res = await axios.get(`${API_URL}/api/reports/fsr/${id}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          }
        });
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
  }, [id, user]);

  const handleImageClick = (image) => {
    if (!image || !image.data) return;
    try {
      const dataUrl = `data:${image.contentType};base64,${image.data}`;
      setSelectedImage(dataUrl);
    } catch (err) {
      console.error("Error handling image click:", err);
    }
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  // Download as PDF handler
  const handleDownload = () => {
    if (!fsrRef.current) return;
    const opt = {
      margin:       0.5,
      filename:     `FSR-${fsr?.fsrId || "report"}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(fsrRef.current).save();
  };

  // Helper function to convert base64 data to a data URL
  const bufferToDataUrl = (imgObj) => {
    if (!imgObj || !imgObj.data) return null;
    try {
      return `data:${imgObj.contentType || 'image/jpeg'};base64,${imgObj.data}`;
    } catch (err) {
      console.error("Error converting image:", err);
      return null;
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <Spinner />
        <p>Loading report details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error: {error}</h3>
        <button onClick={() => navigate(-1)} className="btn">
          Go Back
        </button>
      </div>
    );
  }

  if (!fsr) {
    return (
      <div className="error-container">
        <h3>No report data found</h3>
        <button onClick={() => navigate(-1)} className="btn">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="fsr-details">
      <BackButton url="/fsr" />
      <h1>Service Report Details</h1>

          {/* Download icon button at top left */}
      <button
        onClick={handleDownload}
        style={{ position: "absolute", top: 380, left: 350, zIndex: 1000, background: "lightgrey", colour: "white", fontSize: "1rem", padding: "0.2rem", borderRadius: "8px", cursor: "pointer", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)" }}
        aria-label="Download PDF"
        title="Download PDF"
      >
        <FiDownload style={{ fontSize: "1.2rem", marginRight: "0.5rem", verticalAlign: "sub"}} />
          Download PDF
      </button>

      
      <div className="fsr-details-container" ref={fsrRef}>
        <table className="fsr-table">
          <tbody>
            {/* Basic Information */}
            <tr>
              <td className="fsr-label">FSR ID</td>
              <td>{fsr.fsrId}</td>
              <td className="fsr-label">Report No</td>
              <td>{fsr.srNo || "N/A"}</td>
            </tr>

            {/* Customer Information */}
            <tr>
              <td className="fsr-label">Project Name</td>
              <td>{fsr.customerName}</td>
              <td className="fsr-label">Customer Contact</td>
              <td>{fsr.customerContact}</td>
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
              <td className="fsr-label"> Unit Rating</td>
              <td>{fsr.rating}</td>
              <td className="fsr-label">Model No.</td>
              <td>{fsr.engineModel}</td>
              <td className="fsr-label"> Machine Serial No.</td>
              <td>{fsr.engineSerial}</td>
            </tr>
            <tr>
              <td className="fsr-label"> Serial No.</td>
              <td>{fsr.gensetSerial}</td>
              <td className="fsr-label"> Total Running Hours</td>
              <td colSpan="3">{fsr.runningHours}</td>
            </tr>

            {/* Service Details */}
            <tr>
              <td className="fsr-label">Task Start Date/Time</td>
              <td>{new Date(fsr.taskStart).toLocaleString()}</td>
              <td className="fsr-label">Task End Date/Time</td>
              <td colSpan="3">{new Date(fsr.taskEnd).toLocaleString()}</td>
            </tr>
            <tr>
              <td className="fsr-label">Fault Summary</td>
              <td colSpan="5">{fsr.problemSummary}</td>
            </tr>
            <tr>
              <td className="fsr-label">Nature of Failure</td>
              <td colSpan="5">{fsr.natureOfFailure}</td>
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
              <td className="fsr-label">Recommendations for future</td>
              <td colSpan="5">{fsr.recommendations}</td>
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
                    src={bufferToDataUrl(fsr.customerSignature)}
                    alt="Customer Signature" 
                    className="signature-image"
                    onClick={() => handleImageClick(fsr.customerSignature)}
                    style={{ 
                      cursor: "pointer", 
                      maxWidth: "120px", 
                      maxHeight: "80px",
                      borderRadius: "10px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                      transition: "transform 0.2s ease-in-out"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                    onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                    onError={(e) => {
                      console.error("Error loading customer signature");
                      e.target.style.display = "none";
                    }}
                  />
                )}
              </td>
            </tr>
            <tr>
              <td className="fsr-label">Engineer Signature</td>
              <td colSpan="5">
                {fsr.engineerSignature && (
                  <img 
                    src={bufferToDataUrl(fsr.engineerSignature)}
                    alt="Engineer Signature" 
                    className="signature-image"
                    onClick={() => handleImageClick(fsr.engineerSignature)}
                    style={{ 
                      cursor: "pointer", 
                      maxWidth: "120px", 
                      maxHeight: "80px",
                      borderRadius: "10px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                      transition: "transform 0.2s ease-in-out"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                    onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                    onError={(e) => {
                      console.error("Error loading engineer signature");
                      e.target.style.display = "none";
                    }}
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
                      src={bufferToDataUrl(photo)}
                      alt={`Work Photo ${index + 1}`}
                      className="work-photo"
                      onClick={() => handleImageClick(photo)}
                      style={{ 
                        width: "80px", 
                        height: "80px", 
                        objectFit: "cover",
                        borderRadius: "10px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                        cursor: "pointer",
                        margin: "5px",
                        transition: "transform 0.2s ease-in-out"
                      }}
                      onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                      onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                      onError={(e) => {
                        console.error(`Error loading work photo ${index + 1}`);
                        e.target.style.display = "none";
                      }}
                    />
                  ))}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="image-modal" 
          onClick={closeImageModal}
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
            zIndex: 2000
          }}
        >
          <img
            src={selectedImage}
            alt="Preview"
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              background: "#fff",
              borderRadius: "8px",
              padding: "1rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)"
            }}
            onClick={e => e.stopPropagation()}
          />
          <button
            onClick={closeImageModal}
            style={{
              position: "absolute",
              top: 30,
              right: 40,
              fontSize: 32,
              color: "#fff",
              background: "transparent",
              border: "none",
              cursor: "pointer"
            }}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
}

export default FSRDetails;
