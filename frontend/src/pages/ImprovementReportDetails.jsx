import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";

const ImprovementReportDetails = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
            </tr>
            <tr>
              <td className="improvement-label">Department</td>
              <td>{report.department}</td>
            </tr>
            <tr>
              <td className="improvement-label">Equipment Number</td>
              <td>{report.equipment_no}</td>
            </tr>
            <tr>
              <td className="improvement-label">Equipment System</td>
              <td>{report.equipment_system}</td>
            </tr>
            <tr>
              <td className="improvement-label">Location</td>
              <td>{report.location}</td>
            </tr>
            <tr>
              <td className="improvement-label">Area</td>
              <td>{report.area}</td>
            </tr>
            <tr>
              <td className="improvement-label">Objectives</td>
              <td>{report.objectives}</td>
            </tr>
            <tr>
              <td className="improvement-label">Present Condition</td>
              <td>{report.present_condition}</td>
            </tr>
            <tr>
              <td className="improvement-label">Proposed Modification</td>
              <td>{report.modification}</td>
            </tr>
            <tr>
              <td className="improvement-label">Concept Date</td>
              <td>{new Date(report.concept_date).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td className="improvement-label">Implementation Date</td>
              <td>{new Date(report.implementation_date).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td className="improvement-label">Resources Required</td>
              <td>{report.resources}</td>
            </tr>
            <tr>
              <td className="improvement-label">Mandays</td>
              <td>{report.mandays}</td>
            </tr>
            <tr>
              <td className="improvement-label">Cost</td>
              <td>{report.cost}</td>
            </tr>
            <tr>
              <td className="improvement-label">Payback Period</td>
              <td>{report.payback}</td>
            </tr>
            <tr>
              <td className="improvement-label">Expected End Result</td>
              <td>{report.end_result}</td>
            </tr>
            <tr>
              <td className="improvement-label">Additional Information</td>
              <td>{report.additional_info}</td>
            </tr>
          </tbody>
        </table>

        <div className="improvement-section">
          <h3>Signatures</h3>
          <div className="improvement-grid">
            <div className="improvement-field">
              <label>HOD Signature</label>
              {report.hodSignature ? (
                <img
                  src={`data:${report.hodSignature.contentType};base64,${report.hodSignature.data}`}
                  alt="HOD Signature"
                  className="signature-image"
                />
              ) : (
                <p>No HOD Signature</p>
              )}
            </div>
            <div className="improvement-field">
              <label>Plant Head Signature</label>
              {report.plantInchargeSignature ? (
                <img
                  src={`data:${report.plantInchargeSignature.contentType};base64,${report.plantInchargeSignature.data}`}
                  alt="Plant Head Signature"
                  className="signature-image"
                />
              ) : (
                <p>No Plant Head Signature</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImprovementReportDetails; 