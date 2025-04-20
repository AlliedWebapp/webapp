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
          `https://backend-services-theta.vercel.app/api/reports//improvement-report-details/${id}`,
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
          <BackButton />
        </div>

        <div className="improvement-section">
          <h3>Basic Information</h3>
          <div className="improvement-grid">
            <div className="improvement-field">
              <label>Report ID</label>
              <p>{report.irId}</p>
            </div>
            <div className="improvement-field">
              <label>Department</label>
              <p>{report.department}</p>
            </div>
            <div className="improvement-field">
              <label>Equipment Number</label>
              <p>{report.equipment_no}</p>
            </div>
            <div className="improvement-field">
              <label>Equipment System</label>
              <p>{report.equipment_system}</p>
            </div>
          </div>
        </div>

        <div className="improvement-section">
          <h3>Location Details</h3>
          <div className="improvement-grid">
            <div className="improvement-field">
              <label>Location</label>
              <p>{report.location}</p>
            </div>
            <div className="improvement-field">
              <label>Area</label>
              <p>{report.area}</p>
            </div>
          </div>
        </div>

        <div className="improvement-section">
          <h3>Improvement Details</h3>
          <div className="improvement-grid">
            <div className="improvement-field">
              <label>Objectives</label>
              <p>{report.objectives}</p>
            </div>
            <div className="improvement-field">
              <label>Present Condition</label>
              <p>{report.present_condition}</p>
            </div>
            <div className="improvement-field">
              <label>Proposed Modification</label>
              <p>{report.modification}</p>
            </div>
            <div className="improvement-field">
  <label>Concept Date</label>
  <p>{new Date(report.concept_date).toLocaleDateString()}</p>
</div>
<div className="improvement-field">
  <label>Implementation Date</label>
  <p>{new Date(report.implementation_date).toLocaleDateString()}</p>
</div>
            <div className="improvement-field">
              <label>Resources Required</label>
              <p>{report.resources}</p>
            </div>
            <div className="improvement-field">
              <label>Mandays</label>
              <p>{report.mandays}</p>
            </div>
            <div className="improvement-field">
              <label>Cost</label>
              <p>{report.cost}</p>
            </div>
            <div className="improvement-field">
              <label>Payback Period</label>
              <p>{report.payback}</p>
            </div>
            <div className="improvement-field">
              <label>Expected End Result</label>
              <p>{report.end_result}</p>
            </div>
            <div className="improvement-field">
              <label>Additional Information</label>
              <p>{report.additional_info}</p>
            </div>
          </div>
        </div>

        <div className="improvement-section">
          <h3>Signatures</h3>
          <div className="improvement-grid">
            <div className="improvement-field">
              <label>HOD Signature</label>
              {report.hodSignature && (
                <img
                  src={`data:${report.hodSignature.contentType};base64,${report.hodSignature.data}`}
                  alt="HOD Signature"
                  className="signature-image"
                />
              )}
            </div>
            <div className="improvement-field">
              <label>Plant Head Signature</label>
              {report.plantInchargeSignature && (
                <img
                  src={`data:${report.plantInchargeSignature.contentType};base64,${report.plantInchargeSignature.data}`}
                  alt="Plant Head Signature"
                  className="signature-image"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImprovementReportDetails; 