import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";
import { useSelector } from "react-redux";

const API_URL = process.env.REACT_APP_API_BASE_URL;

const ImprovementReportDetails = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

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

    if (user?.token) {
      fetchReport();
    } else {
      setError("Please login to view reports");
      setLoading(false);
    }
  }, [id, user]);

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
      <div className="back-button-container">
        <BackButton url="/view-improvement-reports" className="back-button" />
      </div>
      <div className="report-details-container">
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
                    src={`data:${report.hod_sign.contentType};base64,${report.hod_sign.data}`}
                    alt="HOD Signature"
                    className="signature-image"
                  />
                )}
              </td>
              <td className="report-label">Plant Head Signature</td>
              <td className="report-value">
                {report.plant_incharge_sign && (
                  <img
                    src={`data:${report.plant_incharge_sign.contentType};base64,${report.plant_incharge_sign.data}`}
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

export default ImprovementReportDetails; 