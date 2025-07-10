//view fsrs list//
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";
import { useSelector } from "react-redux";

const API_URL = process.env.REACT_APP_API_BASE_URL;
const FSR_PER_PAGE = 8; // Show 8 FSRs per page

// Helper function to convert buffer data to a base64 string
const imageToBase64 = (buffer) => {
  const binary = String.fromCharCode(...new Uint8Array(buffer));
  return `data:image/jpeg;base64,${btoa(binary)}`;
};

function ViewFSR() {
  const [fsrs, setFsrs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedFSRs, setDisplayedFSRs] = useState([]);
  const [sortField, setSortField] = useState("createdAt");
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    let isMounted = true;

    const fetchFSRs = async () => {
      try {
        if (!user?.token) {
          console.log("No user token found");
          if (isMounted) {
            setMessage("Please login to view reports");
            setIsError(true);
            setIsLoading(false);
          }
          return;
        }

        console.log("User state:", user);
        console.log("Fetching FSRs for user:", user._id);
        
        const res = await axios.get(`${API_URL}/api/reports/fsrs`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          }
        });

        console.log("FSR Response:", res.data);

        // Only update state if component is still mounted
        if (isMounted) {
          // Check if reports exist in the response
          if (res.data && Array.isArray(res.data.reports)) {
            console.log("Found reports:", res.data.reports);
            setFsrs(res.data.reports);
          } else {
            console.warn("No reports found in response:", res.data);
            setFsrs([]);
          }
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch FSRs:", err);
        if (isMounted) {
          if (err.response) {
            console.error("Error response:", err.response.data);
            console.error("Error status:", err.response.status);
            setMessage(`${err.response.data?.message || 'Unknown error'}`);
          } else if (err.request) {
            console.error("No response received:", err.request);
            setMessage("No response from server. Please check your connection.");
          } else {
            console.error("Error message:", err.message);
            setMessage(`Error: ${err.message}`);
          }
          setIsError(true);
          setIsLoading(false);
        }
      }
    };

    fetchFSRs();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Update displayed FSRs when fsrs, sort field, or current page changes
  useEffect(() => {
    if (!fsrs) return;

    // Sort the FSRs based on the selected field
    const sorted = [...fsrs].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      // Handle date sorting
      if (sortField === "createdAt") {
        return new Date(bValue) - new Date(aValue); // Newest first
      }
      
      // Handle string sorting (case-insensitive)
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.toLowerCase().localeCompare(bValue.toLowerCase());
      }
      
      // Default comparison
      return aValue > bValue ? -1 : 1;
    });

    const start = (currentPage - 1) * FSR_PER_PAGE;
    const end = start + FSR_PER_PAGE;
    setDisplayedFSRs(sorted.slice(start, end));
  }, [fsrs, sortField, currentPage]);

  const totalPages = Math.ceil((fsrs?.length || 0) / FSR_PER_PAGE);

  // Loading spinner is shown while data is being fetched
  if (isLoading) return <Spinner />;

  // Show error message if there is an error
  if (isError) {
    return (
      <div className="error-container">
        <h3 className="text-red-500"> {message}</h3>
        <BackButton url="/home" />
      </div>
    );
  }

  return (
    <div className="fsr-container">
      <BackButton url="/home" />
      <h1>Service Reports</h1>

      {/* Sort Controls */}
      <div className="ticket-controls">
        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
          className="sort-select"
        >
          <option value="createdAt">Date</option>
          <option value="customerName">Project</option>
          <option value="engineerName">Engineer</option>
        </select>
      </div>

      <div className="tickets">
        <div className="ticket-headings">
          <div>FSR ID</div>
          <div>Date</div>
          <div>Project Name</div>
          <div>Engineer Name</div>
          <div></div>
        </div>

        {displayedFSRs.length > 0 ? (
          displayedFSRs.map((fsr) => (
            <div className="ticket" key={fsr._id}>
              <div data-label="FSR ID">{fsr.fsrId}</div>
              <div data-label="Date">{new Date(fsr.createdAt).toLocaleDateString()}</div>
              <div data-label="Project Name">{fsr.customerName}</div>
              <div data-label="Engineer Name">{fsr.engineerName}</div>
              <div>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => navigate(`/fsr/${fsr._id}`)}
                >
                  View
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-fsrs">
            <p>No FSRs found. Please create a new FSR.</p>
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
        .ticket-controls {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          align-items: center;
          justify-content: flex-end;
        }

        .sort-select {
          padding: 0.25rem;
          border: 1px solid #ddd;
          border-radius: 8px;
        }

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

export default ViewFSR;
