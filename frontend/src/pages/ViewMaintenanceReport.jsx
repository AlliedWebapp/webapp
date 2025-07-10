import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";
import { useSelector } from "react-redux";

function ViewMaintenanceReport() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedReports, setDisplayedReports] = useState([]);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const API_URL = process.env.REACT_APP_API_BASE_URL;
  const REPORTS_PER_PAGE = 8; // Show 8 reports per page

  useEffect(() => {
    const fetchReports = async () => {
      try {
        if (!user?.token) {
          setMessage("Please login to view reports");
          setIsError(true);
          setIsLoading(false);
          return;
        }

        console.log("Fetching Maintenance Reports...");
        const res = await axios.get(`${API_URL}/api/reports/view-maintenance-reports`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          }
        });

        console.log("Maintenance Reports Response:", res.data);

        if (res.data && res.data.success && Array.isArray(res.data.data.reports)) {
          console.log("Found reports:", res.data.data.reports);
          setReports(res.data.data.reports);
        } else {
          console.warn("No reports found in response:", res.data);
          setReports([]);
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch Maintenance Reports:", err);
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
        <BackButton url="/home" />
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
          <div>Created Date</div>
          <div>Unit</div>
          <div>Outage Date</div>
          <div></div>
        </div>
        {displayedReports.length > 0 ? (
          displayedReports.map((report) => (
            <div className="ticket" key={report._id}>
              <div data-label="MR ID">{report.mrId}</div>
              <div data-label="Date">{new Date(report.createdAt).toLocaleDateString()}</div>
              <div data-label="Unit">{report.unit}</div>
              <div data-label="Outage Date">{new Date(report.outageDate).toLocaleDateString()}</div>
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

export default ViewMaintenanceReport;