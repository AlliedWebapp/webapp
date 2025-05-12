import { useState, useEffect, useRef} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";
import { useSelector } from "react-redux";
import html2pdf from "html2pdf.js";
import { FiDownload } from "react-icons/fi";

const API_URL = process.env.REACT_APP_API_BASE_URL;

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

        if (!response.ok) {
          throw new Error("Failed to fetch report");
        }

        const data = await response.json();
        console.log("Maintenance Report Data:", data);

        if (!data || !data.success || !data.data) {
          throw new Error("Report not found");
        }

        setReport(data.data);
      } catch (err) {
        console.error("Error fetching report:", err);
        setError(err.message);
        toast.error("Failed to load report details");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id, user]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
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
    <div className="report-details">
    <button
            onClick={handleDownload}
            style={{ position: "absolute", top: 320, left: 350, zIndex: 1000, background: "lightgrey", colour: "white", fontSize: "1rem", padding: "0.2rem", borderRadius: "8px", cursor: "pointer", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)" }}
            aria-label="Download PDF"
            title="Download PDF"
          >
            <FiDownload style={{ fontSize: "1.2rem", marginRight: "0.5rem", verticalAlign: "sub"}} />
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
                    src={`data:${report.hodSignature.contentType};base64,${report.hodSignature.data}`}
                    alt="HOD Signature"
                    className="signature-image"
                  />
                )}
              </td>
              <td className="report-label">Plant Head Signature</td>
              <td className="report-value">
                {report.plantInchargeSignature && (
                  <img
                    src={`data:${report.plantInchargeSignature.contentType};base64,${report.plantInchargeSignature.data}`}
                    alt="Plant Head Signature"
                    className="signature-image"
                  />
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaintenanceReportDetails; 