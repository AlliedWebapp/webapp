import { useState, useEffect, useRef} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";
import { useSelector } from "react-redux";
import html2pdf from "html2pdf.js/dist/html2pdf.bundle";
import { FiDownload } from "react-icons/fi";

const API_URL = process.env.REACT_APP_API_BASE_URL;



const MaintenanceReportDetails = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const reportRef = useRef();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        if (!user?.token) {
          setError("Please login to view reports");
          setLoading(false);
          return;
        }

        setLoading(true);
        console.log("Fetching report with ID:", id);
        console.log("Using token:", user.token);

        const response = await fetch(
          `${API_URL}/api/reports/maintenance-report-details/${id}`,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        console.log("Response status:", response.status);
        const result = await response.json();
        console.log("Full response:", result);

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch report");
        }

        if (!result.success || !result.data) {
          console.error("Invalid response format:", result);
          throw new Error("Invalid report data received");
        }

        console.log("Setting report data:", result.data);
        setReport(result.data);
      } catch (err) {
        console.error("Error in fetchReport:", err);
        setError(err.message || "Failed to load report details");
        toast.error(err.message || "Failed to load report details");
      } finally {
        setLoading(false);
      }
    };

    if (id && user?.token) {
      fetchReport();
    }
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
    if (!reportRef.current) return;
    const opt = {
      margin: 0.5,
      filename: `Maintenance-Report-${report?.mrId || "details"}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(reportRef.current).save();
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

  if (loading) {
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

  if (!report) {
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
    <div className="report-details">
      <button
        onClick={handleDownload}
        className="download-btn"
        aria-label="Download PDF"
        title="Download PDF"
      >
        <FiDownload />
        Download PDF
      </button>

      <div className="back-button-container">
        <BackButton url="/view-maintenance-reports" className="back-button" />
      </div>
      <div className="report-details-container">
        <div className="report-header">
          <h2>Maintenance Report Details</h2>
        </div>

        <table className="report-table">
          <tbody>
            <tr>
              <td className="report-label">Report ID</td>
              <td className="report-value">{report.mrId}</td>
              <td className="report-label">Unit</td>
              <td className="report-value">{report.unit}</td>
            </tr>
            <tr>
              <td className="report-label">Outage Date</td>
              <td className="report-value">{new Date(report.outageDate).toLocaleDateString()}</td>
              <td className="report-label">Outage Time</td>
              <td className="report-value">{report.outageTime}</td>
            </tr>
            <tr>
              <td className="report-label">Defect Reported</td>
              <td className="report-value" colSpan="3">{report.defectReported}</td>
            </tr>
            <tr>
              <td className="report-label">Investigation Outcome</td>
              <td className="report-value" colSpan="3">{report.investigationOutcome}</td>
            </tr>
            <tr>
              <td className="report-label">Corrective Action</td>
              <td className="report-value" colSpan="3">{report.correctiveAction}</td>
            </tr>
            <tr>
              <td className="report-label">Follow Up</td>
              <td className="report-value" colSpan="3">{report.followUp}</td>
            </tr>
            <tr>
              <td className="report-label">Repair Cost</td>
              <td className="report-value">{report.repairCost}</td>
              <td className="report-label">Generation Loss</td>
              <td className="report-value">{report.generationLoss}</td>
            </tr>
            <tr>
              <td className="report-label">Remarks</td>
              <td className="report-value" colSpan="3">{report.remarks}</td>
            </tr>
            <tr>
              <td className="report-label">HOD Signature</td>
              <td className="report-value">
                {report.hodSignature && (
                  <img
                    src={bufferToDataUrl(report.hodSignature)}
                    alt="HOD Signature"
                    className="signature-image"
                    onClick={() => handleImageClick(report.hodSignature)}
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
                      console.error("Error loading HOD signature");
                      e.target.style.display = "none";
                    }}
                  />
                )}
              </td>
              <td className="report-label">Plant Head Signature</td>
              <td className="report-value">
                {report.plantInchargeSignature && (
                  <img
                    src={bufferToDataUrl(report.plantInchargeSignature)}
                    alt="Plant Head Signature"
                    className="signature-image"
                    onClick={() => handleImageClick(report.plantInchargeSignature)}
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
                      console.error("Error loading Plant Head signature");
                      e.target.style.display = "none";
                    }}
                  />
                )}
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
};

export default MaintenanceReportDetails; 