import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";
import { useSelector } from "react-redux";
import html2pdf from "html2pdf.js/dist/html2pdf.bundle";
import { FiDownload } from "react-icons/fi";

const API_URL = process.env.REACT_APP_API_BASE_URL;

const ImprovementReportDetails = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Ref for PDF export
  const reportRef = useRef();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_URL}/api/reports/improvement-report-details/${id}`,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch report");
        }

        const data = await response.json();
        if (!data) {
          throw new Error("Report not found");
        }

        setReport(data);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load report details");
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchReport();
    } else {
      setError("Please login to view reports");
      setLoading(false);
    }
  }, [id, user]);

  const handleDownload = () => {
    if (!reportRef.current) return;
    const opt = {
      margin: 0.5,
      filename: `Improvement-Report-${report?.irId || "details"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
    };
    html2pdf().set(opt).from(reportRef.current).save();
  };

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
    <div className="report-details" style={{ position: "relative" }}>
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
        <BackButton url="/view-improvement-reports" className="back-button" />
      </div>
      {/* Attach ref here for PDF export */}
      <div className="report-details-container" ref={reportRef}>
        <div className="report-header">
          <h2>Improvement Report Details</h2>
        </div>

        <table className="report-table">
          <tbody>
            <tr>
              <td className="report-label">Report ID</td>
              <td className="report-value">{report.irId}</td>
              <td className="report-label">Project</td>
              <td className="report-value">{report.department}</td>
            </tr>
            <tr>
              <td className="report-label">Equipment Number</td>
              <td className="report-value">{report.equipment_no}</td>
              <td className="report-label">Equipment System</td>
              <td className="report-value">{report.equipment_system}</td>
            </tr>
            <tr>
              <td className="report-label">Location</td>
              <td className="report-value" colSpan="3">{report.location}</td>
            </tr>
            <tr>
              <td className="report-label">Objectives</td>
              <td className="report-value" colSpan="3">{report.objectives}</td>
            </tr>
            <tr>
              <td className="report-label">Concept Date</td>
              <td className="report-value">{new Date(report.concept_date).toLocaleDateString()}</td>
              <td className="report-label">Implementation Date</td>
              <td className="report-value">{new Date(report.implementation_date).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td className="report-label">Present Condition</td>
              <td className="report-value" colSpan="3">{report.present_condition}</td>
            </tr>
            <tr>
              <td className="report-label">Modification</td>
              <td className="report-value" colSpan="3">{report.modification}</td>
            </tr>
            <tr>
              <td className="report-label">Resources</td>
              <td className="report-value" colSpan="3">{report.resources}</td>
            </tr>
            <tr>
              <td className="report-label">Mandays</td>
              <td className="report-value">{report.mandays}</td>
              <td className="report-label">Cost</td>
              <td className="report-value">{report.cost}</td>
            </tr>
            <tr>
              <td className="report-label">Payback Period</td>
              <td className="report-value">{report.payback}</td>
              <td className="report-label">End Result</td>
              <td className="report-value">{report.end_result}</td>
            </tr>
            <tr>
              <td className="report-label">Additional Information</td>
              <td className="report-value" colSpan="3">{report.additional_info}</td>
            </tr>
            <tr>
              <td className="report-label">Head of Project Signature</td>
              <td className="report-value">
                {report.hod_sign && (
                  <img
                    src={bufferToDataUrl(report.hod_sign)}
                    alt="HOD Signature"
                    className="signature-image"
                    onClick={() => handleImageClick(report.hod_sign)}
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
                {report.plant_incharge_sign && (
                  <img
                    src={bufferToDataUrl(report.plant_incharge_sign)}
                    alt="Plant Head Signature"
                    className="signature-image"
                    onClick={() => handleImageClick(report.plant_incharge_sign)}
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

export default ImprovementReportDetails;
