import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";

function ViewImprovementReport() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        console.log("Fetching improvement reports...");
        const res = await axios.get("https://backend-services-theta.vercel.app/api/reports/improvement-reports", {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        console.log("Improvement Reports Response:", res.data);

        if (res.data && Array.isArray(res.data.reports)) {
          setReports(res.data.reports);
        } else {
          console.warn("Unexpected response format:", res.data);
          setReports([]);
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch improvement reports:", err);
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
            <div key={report._id} className="ticket">
              <div>{report.irId}</div>
              <div>{new Date(report.createdAt).toLocaleDateString()}</div>
              <div>{report.department}</div>
              <div>{report.location}</div>
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