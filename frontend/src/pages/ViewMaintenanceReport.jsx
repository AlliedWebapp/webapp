import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";

function ViewMaintenanceReport() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        console.log("Fetching Maintenance Reports...");
        const res = await axios.get("https://backend-services-theta.vercel.app/api/reports/view-maintenance-reports", {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        console.log("Maintenance Reports Response:", res.data);

        if (res.data && res.data.success && Array.isArray(res.data.data.reports)) {
          setReports(res.data.data.reports);
        } else {
          console.warn("Unexpected response format:", res.data);
          setReports([]);
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch Maintenance Reports:", err);
        if (err.response) {
          setMessage(`Server error: ${err.response.status} - ${err.response.data?.message || 'Unknown error'}`);
        } else if (err.request) {
          setMessage("No response from server. Please check your connection.");
        } else {
          setMessage(`Error: ${err.message}`);
        }
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (isLoading) return <Spinner />;

  if (isError) {
    return (
      <div className="error-container">
        <h3 className="text-red-500">Error: {message}</h3>
        <BackButton url="/" />
      </div>
    );
  }

  return (
    <div className="maintenance-reports">
      <BackButton url="/other-reports" />
      <h1>Maintenance Reports</h1>
      <div className="tickets">
        <div className="ticket-headings">
          <div>MR ID</div>
          <div>Date</div>
          <div>Unit</div>
          <div>Outage Date</div>
          <div></div>
        </div>

        {reports.length > 0 ? (
          reports.map((report) => (
            <div className="ticket" key={report._id}>
              <div>{report.mrId}</div>
              <div>{new Date(report.createdAt).toLocaleDateString()}</div>
              <div>{report.unit}</div>
              <div>{new Date(report.outageDate).toLocaleDateString()}</div>
              <div>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => navigate(`/maintenance-report-details/${report._id}`)}
                >
                  View
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-fsrs">
            <p>No maintenance reports found. Please create a new one.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewMaintenanceReport; 