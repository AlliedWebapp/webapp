import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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

const MaintenanceReportDetails = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://backend-services-theta.vercel.app/api/reports/maintenance-report-details/${id}`,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
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
  }, [id]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
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
    <div className="maintenance-details">
      <div className="maintenance-details-container">
        <div className="maintenance-header">
          <h2>Maintenance Report Details</h2>
          <BackButton url="/view-maintenance-reports" />
        </div>

        <table className="maintenance-table">
          <tbody>
            <tr>
              <td className="maintenance-label">Report ID</td>
              <td>{report.mrId}</td>
              <td className="maintenance-label">Unit</td>
              <td>{report.unit}</td>
              <td className="maintenance-label">Outage Date</td>
              <td>{new Date(report.outageDate).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td className="maintenance-label">Outage Time</td>
              <td>{report.outageTime}</td>
              <td className="maintenance-label">Defect Reported</td>
              <td colSpan="3">{report.defectReported}</td>
            </tr>
            <tr>
              <td className="maintenance-label">Investigation Outcome</td>
              <td colSpan="5">{report.investigationOutcome}</td>
            </tr>
            <tr>
              <td className="maintenance-label">Corrective Action</td>
              <td colSpan="5">{report.correctiveAction}</td>
            </tr>
            <tr>
              <td className="maintenance-label">Follow Up</td>
              <td colSpan="5">{report.followUp}</td>
            </tr>
            <tr>
              <td className="maintenance-label">Repair Cost</td>
              <td>{report.repairCost}</td>
              <td className="maintenance-label">Generation Loss</td>
              <td colSpan="3">{report.generationLoss}</td>
            </tr>
            <tr>
              <td className="maintenance-label">Remarks</td>
              <td colSpan="5">{report.remarks}</td>
            </tr>
            <tr>
              <td className="maintenance-label">HOD Signature</td>
              <td colSpan="5">
                {report.hodSignature && (
                  <img
                    src={imageToBase64(report.hodSignature)}
                    alt="HOD Signature"
                    className="signature-image"
                    onClick={() => handleImageClick(report.hodSignature)}
                  />
                )}
              </td>
            </tr>
            <tr>
              <td className="maintenance-label">Plant Incharge Signature</td>
              <td colSpan="5">
                {report.plantInchargeSignature && (
                  <img
                    src={imageToBase64(report.plantInchargeSignature)}
                    alt="Plant Incharge Signature"
                    className="signature-image"
                    onClick={() => handleImageClick(report.plantInchargeSignature)}
                  />
                )}
              </td>
            </tr>
          </tbody>
        </table>

        {selectedImage && (
          <div className="image-modal" onClick={closeImageModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <img
                src={imageToBase64(selectedImage)}
                alt="Preview"
                className="preview-image"
              />
              <button className="close-button" onClick={closeImageModal}>
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenanceReportDetails; 