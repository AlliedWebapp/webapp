// ViewImprovementReport.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";
import { useSelector } from "react-redux";

const API_URL = process.env.REACT_APP_API_BASE_URL;

// // Helper function to convert buffer data to a base64 string
// const imageToBase64 = (buffer) => {
//   const binary = String.fromCharCode(...new Uint8Array(buffer));
//   return `data:image/jpeg;base64,${btoa(binary)}`;
// };

function ViewImprovementReport() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        if (!user?.token) {
          setMessage("Please login to view reports");
          setIsError(true);
          setIsLoading(false);
          return;
        }

        console.log("Fetching Improvement Reports...");
        const res = await axios.get(`${API_URL}/api/reports/view-improvement-reports`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          }
        });

        console.log("Improvement Reports Response:", res.data);

        // Check if reports exist in the response
        if (res.data && Array.isArray(res.data.reports)) {
          console.log("Found reports:", res.data.reports);
          setReports(res.data.reports);
        } else {
          console.warn("No reports found in response:", res.data);
          setReports([]);
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch Improvement Reports:", err);
        if (err.response) {
          setMessage(`${err.response.data?.message || 'Unknown error'}`);
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
  }, [user]);

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
    <div className="improvement-reports">
      <BackButton url="/other-reports" className="back-button" />
      <h1>Improvement Reports</h1>
      <div className="tickets">
        <div className="ticket-headings">
          <div>IR ID</div>
          <div>Date</div>
          <div>Department</div>
          <div>Location</div>
          <div></div>
        </div>

        {reports.length > 0 ? (
          reports.map((report) => (
            <div className="ticket" key={report._id}>
              <div>{report.irId}</div>
              <div>{new Date(report.createdAt).toLocaleDateString()}</div>
              <div>{report.department}</div>
              <div>{report.location}</div>
              <div>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => navigate(`/improvement-report-details/${report._id}`)}
                >
                  View
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-fsrs">
            <p>No improvement reports found. Please create a new one.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewImprovementReport;
