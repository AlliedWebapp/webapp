import { useState, useEffect, useRef } from "react";
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

  // PDF download handler
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

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="error">
        <p>Report not found</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="report-details" style={{ position: "relative" }}>
      {/* Download icon button at top left */}
      <button
        onClick={handleDownload}
        style={{ position: "absolute", top: 120, left: 50, zIndex: 1000, background: "lightgrey", colour: "white", fontSize: "1rem", padding: "0.2rem", borderRadius: "8px", cursor: "pointer", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)" }}
        aria-label="Download PDF"
        title="Download PDF"
      >
        <FiDownload style={{ fontSize: "1.2rem", marginRight: "0.5rem", verticalAlign: "sub"}} />
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
              <td className="report-label">Department</td>
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
              <td className="report-label">HOD Signature</td>
              <td className="report-value">
                {report.hod_sign && (
                  <img
                    src={report.hod_sign}
                    alt="HOD Signature"
                    className="signature-image"
                    style={{ cursor: "pointer", maxWidth: "120px", maxHeight: "80px" }}
                    onClick={() => setSelectedImage(report.hod_sign)}
                  />
                )}
              </td>
              <td className="report-label">Plant Head Signature</td>
              <td className="report-value">
                {report.plant_incharge_sign && (
                  <img
                    src={report.plant_incharge_sign}
                    alt="Plant Head Signature"
                    className="signature-image"
                    style={{ cursor: "pointer", maxWidth: "120px", maxHeight: "80px" }}
                    onClick={() => setSelectedImage(report.plant_incharge_sign)}
                  />
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* //Modal preview */}
      {selectedImage && (
  <div
    className="image-modal"
    onClick={() => setSelectedImage(null)}
    style={{
      position: "fixed",
      top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(0,0,0,0.6)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 2000
    }}
  >
    <img
      src={selectedImage}
      alt="Signature Preview"
       style={{
        maxWidth: "90vw",
        maxHeight: "90vh",
        background: "#fff",
        borderRadius: "8px",
        padding: "1rem"
      }}
      onClick={e => e.stopPropagation()} // Prevent modal close on image click
    />
     <button
      onClick={() => setSelectedImage(null)}
      style={{
        position: "absolute",
        top: 30, right: 40,
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
