import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";
import axios from "axios"; // ✅ axios import

// Helper function to convert buffer data to a base64 string
const imageToBase64 = (buffer) => {
  const binary = String.fromCharCode(...new Uint8Array(buffer));
  return `data:image/jpeg;base64,${btoa(binary)}`;
};

const ViewImprovementReport = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          "https://backend-services-theta.vercel.app/api/reports/improvement-reports",
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Improvement Reports Data:", data);

        if (data.reports && Array.isArray(data.reports)) {
          setReports(data.reports);
        } else {
          setReports([]);
        }
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError(err.message);
        toast.error("Failed to load improvement reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

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

  return (
    <div className="improvement-reports">
      <div className="improvement-reports-container">
        <div className="improvement-reports-header">
          <h2>Improvement Reports</h2>
          <BackButton />
        </div>

        {reports.length === 0 ? (
          <p>No improvement reports found</p>
        ) : (
          <div className="improvement-reports-grid">
            {reports.map((report) => (
              <div key={report._id} className="improvement-report-card">
                <div className="improvement-report-info">
                  <h3>Report ID: {report.irId}</h3>
                  <p><strong>Department:</strong> {report.department}</p>
                  <p><strong>Equipment Number:</strong> {report.equipment_no}</p>
                  <p><strong>Location:</strong> {report.location}</p>
                  <p><strong>Objectives:</strong> {report.objectives}</p>
                </div>
                <button
                  className="view-btn"
                  onClick={() => navigate(`/improvement-reports/${report._id}`)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewImprovementReport;
