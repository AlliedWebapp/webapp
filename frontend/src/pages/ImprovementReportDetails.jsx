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

const ImprovementReportDetails = () => {
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
          `https://backend-services-theta.vercel.app/api/reports/improvement-report-details/${id}`,
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
        console.log("Improvement Report Data:", data);

        if (!data) {
          throw new Error("Report not found");
        }

        setReport(data);
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
    <div className="improvement-details">
      <div className="improvement-details-container">
        <div className="improvement-header">
          <h2>Improvement Report Details</h2>
          <BackButton url="/view-improvement-reports" />
        </div>

        <table className="improvement-table">
          <tbody>
            <tr>
              <td className="improvement-label">Report ID</td>
              <td>{report.irId}</td>
              <td className="improvement-label">Department</td>
              <td>{report.department}</td>
              <td className="improvement-label">Equipment Number</td>
              <td>{report.equipment_no}</td>
            </tr>
            <tr>
              <td className="improvement-label">Equipment System</td>
              <td>{report.equipment_system}</td>
              <td className="improvement-label">Location</td>
              <td>{report.location}</td>
              <td className="improvement-label">Area</td>
              <td>{report.area}</td>
            </tr>
            <tr>
              <td className="improvement-label">Objectives</td>
              <td colSpan="5">{report.objectives}</td>
            </tr>
            <tr>
              <td className="improvement-label">Present Condition</td>
              <td colSpan="5">{report.present_condition}</td>
            </tr>
            <tr>
              <td className="improvement-label">Proposed Modification</td>
              <td colSpan="5">{report.modification}</td>
            </tr>
            <tr>
              <td className="improvement-label">Concept Date</td>
              <td>{new Date(report.concept_date).toLocaleDateString()}</td>
              <td className="improvement-label">Implementation Date</td>
              <td colSpan="3">{new Date(report.implementation_date).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td className="improvement-label">Resources Required</td>
              <td>{report.resources}</td>
              <td className="improvement-label">Mandays</td>
              <td>{report.mandays}</td>
              <td className="improvement-label">Cost</td>
              <td>{report.cost}</td>
            </tr>
            <tr>
              <td className="improvement-label">Payback Period</td>
              <td colSpan="5">{report.payback}</td>
            </tr>
            <tr>
              <td className="improvement-label">Expected End Result</td>
              <td colSpan="5">{report.end_result}</td>
            </tr>
            <tr>
              <td className="improvement-label">Additional Information</td>
              <td colSpan="5">{report.additional_info}</td>
            </tr>
            <tr>
              <td className="improvement-label">HOD Signature</td>
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
              <td className="improvement-label">Plant Head Signature</td>
              <td colSpan="5">
                {report.plantInchargeSignature && (
                  <img
                    src={imageToBase64(report.plantInchargeSignature)}
                    alt="Plant Head Signature"
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

export default ImprovementReportDetails; 