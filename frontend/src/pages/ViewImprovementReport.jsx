import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";

// Helper function to convert buffer data to a base64 string
const imageToBase64 = (buffer) => {
  const binary = String.fromCharCode(...new Uint8Array(buffer));
  return `data:image/jpeg;base64,${btoa(binary)}`;      
};

function ViewImprovementReport() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        console.log("Starting to fetch improvement reports...");
        const res = await axios.get("https://backend-services-theta.vercel.app/api/reports/improvement-reports", {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        console.log("Raw API Response:", res);
        console.log("Response Data:", res.data);

        if (res.data) {
          if (Array.isArray(res.data.reports)) {
            console.log("Reports found:", res.data.reports);
            setReports(res.data.reports);
          } else if (Array.isArray(res.data)) {
            console.log("Reports array found directly:", res.data);
            setReports(res.data);
          } else {
            console.warn("Unexpected response format:", res.data);
            setReports([]);
          }
        } else {
          console.warn("No data in response");
          setReports([]);
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching improvement reports:", err);
        console.error("Error details:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        setError(err.response?.data?.message || "Failed to fetch reports");
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (isLoading) return <Spinner />;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="ticket-page">
      <BackButton url="/other-reports" />
      <h2 className="ticket-heading">Improvement Reports</h2>

      {reports.length === 0 ? (
        <p>No improvement reports found</p>
      ) : (
        <div className="ticket">
          <div className="ticket-headings">
            <div>IR ID</div>
            <div>Date</div>
            <div>Department</div>
            <div>Location</div>
            <div>Actions</div>
          </div>
          {reports.map((report) => (
  <div key={report._id} className="ticket-row">
    <div>{report.irId || 'N/A'}</div>
    <div>{report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'N/A'}</div>
    <div>{report.department || 'N/A'}</div>
    <div>{report.location || 'N/A'}</div>
    <div>
      <button
        onClick={() => navigate(`/improvement-report/${report._id}`)}
        className="btn btn-sm"
      >
        View Details
      </button>
    </div>
  </div>
))}
        </div>      
      )}
    </div>
  );

}

export default ViewImprovementReport; 