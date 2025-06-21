// ViewImprovementReport.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";
import { useSelector } from "react-redux";

const API_URL = process.env.REACT_APP_API_BASE_URL;
const REPORTS_PER_PAGE = 8; // Show 8 reports per page

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
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedReports, setDisplayedReports] = useState([]);
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

  // Update displayed reports when reports or current page changes
  useEffect(() => {
    if (!reports) return;

    const start = (currentPage - 1) * REPORTS_PER_PAGE;
    const end = start + REPORTS_PER_PAGE;
    setDisplayedReports(reports.slice(start, end));
  }, [reports, currentPage]);

  const totalPages = Math.ceil((reports?.length || 0) / REPORTS_PER_PAGE);

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
        {displayedReports.length > 0 ? (
          displayedReports.map((report) => (
            <div className="ticket" key={report._id}>
              <div data-label="IR ID">{report.irId}</div>
              <div data-label="Date">{new Date(report.createdAt).toLocaleDateString()}</div>
              <div data-label="Department">{report.department}</div>
              <div data-label="Location">{report.location}</div>
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}

      <style jsx>{`
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          margin-top: 2rem;
        }

        .pagination-btn {
          padding: 0.5rem 1rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: #f8f9fa;
          cursor: pointer;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .page-info {
          font-size: 0.9rem;
          color: #666;
        }
      `}</style>
    </div>
  );
}

export default ViewImprovementReport;
