import { useState, useEffect } from "react";
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

function MaintenanceReportDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        console.log("Fetching Maintenance Report with ID:", id);
        const res = await axios.get(`https://backend-services-theta.vercel.app/api/reports/maintenance-report-details/${id}`);
        console.log("Maintenance Report Details Response:", res.data);
        
        if (res.data) {
          setReport(res.data);
        } else {
          setError("Maintenance Report not found");
        }
      } catch (err) {
        console.error("Error fetching Maintenance Report:", err);
        setError(err.response?.data?.message || "Failed to fetch Maintenance Report details");
      } finally {
        setIsLoading(false);
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

  if (isLoading) return <Spinner />;
  if (error) return <div className="error">{error}</div>;
  if (!report) return <div className="error">Maintenance Report not found</div>;

  return (
    <div className="maintenance-details">
      <BackButton url="/view-maintenance-reports" />
      <h1>Maintenance Report Details</h1>
      
      <div className="maintenance-details-container">
        <table className="maintenance-table">
          <tbody>
            {/* Basic Information */}
            <tr>
              <td className="maintenance-label">Report ID</td>
              <td>{report.mrId}</td>
              <td className="maintenance-label">Unit</td>
              <td>{report.unit}</td>
              <td className="maintenance-label">Outage Date</td>
              <td>{new Date(report.outageDate).toLocaleDateString()}</td>
            </tr>

            {/* Outage Details */}
            <tr>
              <td className="maintenance-label">Outage Time</td>
              <td>{report.outageTime}</td>
              <td className="maintenance-label">Defect Reported</td>
              <td colSpan="3">{report.defectReported}</td>
            </tr>

            {/* Investigation Details */}
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

            {/* Cost and Impact */}
            <tr>
              <td className="maintenance-label">Repair Cost</td>
              <td>{report.repairCost}</td>
              <td className="maintenance-label">Generation Loss</td>
              <td colSpan="3">{report.generationLoss}</td>
            </tr>

            {/* Additional Information */}
            <tr>
              <td className="maintenance-label">Remarks</td>
              <td colSpan="5">{report.remarks}</td>
            </tr>

            {/* Signatures */}
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
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="image-modal" onClick={closeImageModal}>
          <img 
            src={imageToBase64(selectedImage)} 
            alt="Selected Signature" 
            className="modal-image"
          />
        </div>
      )}
    </div>
  );
}

export default MaintenanceReportDetails; 