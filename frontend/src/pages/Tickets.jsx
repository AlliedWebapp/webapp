import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";
import { getTickets, reset } from "../features/tickets/ticketSlice";
import { toast } from "react-toastify";
import { Link, useLocation } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_BASE_URL;
const TICKETS_PER_PAGE = 5; // Reduced page size for faster loading

function Tickets() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { tickets, isLoading, isError, message } = useSelector(
    (state) => state.tickets
  );
  const { user } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("createdAt");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Memoized checkFSR function
  const authToken = user?.token;

  const checkFSR = useCallback(async (ticketId) => {
    if (!authToken) return false;
    try {
      const response = await fetch(`${API_URL}/api/reports/fsr-by-ticket/${ticketId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        toast.error(`A Service Report (ID: ${data.fsrId}) already exists for this ticket.`);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error checking FSR:", error);
      return false;
    }
  }, [authToken]);

  // Memoized handleServiceReport function
  const handleServiceReport = useCallback(async (ticketId) => {
    const fsrExists = await checkFSR(ticketId);
    if (!fsrExists) {
      window.location.href = `/service-report/${ticketId}`;
    }
  }, [checkFSR]);

  // Load initial tickets
  useEffect(() => {
    const loadInitialTickets = async () => {
      try {
        setIsInitialLoad(true);
        await dispatch(getTickets()).unwrap();
      } catch (error) {
        console.error("Error loading tickets:", error);
      } finally {
        setIsInitialLoad(false);
      }
    };
    loadInitialTickets();
    return () => {
      dispatch(reset());
    };
  }, [dispatch, location.key]); // Add location.key to dependencies

  const sortedTickets = useMemo(() => {
    if (!tickets) return [];
    return [...tickets].sort((a, b) => {
      const aValue = a?.[sortField];
      const bValue = b?.[sortField];
      if (aValue === bValue) return 0;
      return aValue > bValue ? -1 : 1;
    });
  }, [tickets, sortField]);

  const totalPages = useMemo(() => {
    if (!sortedTickets.length) return 1;
    return Math.ceil(sortedTickets.length / TICKETS_PER_PAGE);
  }, [sortedTickets.length]);

  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * TICKETS_PER_PAGE;
    return sortedTickets.slice(start, start + TICKETS_PER_PAGE);
  }, [sortedTickets, currentPage]);

  const goToPage = useCallback((updater) => {
    setCurrentPage((prev) => {
      const nextValue = typeof updater === "function" ? updater(prev) : updater;
      return Math.min(Math.max(nextValue, 1), totalPages);
    });
  }, [totalPages]);

  if (isLoading || isInitialLoad) {
    return (
      <div className="loading-container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <h3 className="text-red-500">{message}</h3>
        <BackButton url="/home" />
      </div>
    );
  }

  return (
    <>
      <BackButton url="/home" />
      <h1>Tickets</h1>

      {/* Sort Controls */}
      <div className="ticket-controls">
        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
          className="sort-select"
        >
          <option value="createdAt">Date</option>
          <option value="projectname">Project</option>
          <option value="status">Status</option>
        </select>
      </div>

      <div className="tickets">
        <div className="ticket-headings">
          <div>Ticket ID</div>
          <div>Date</div>
          <div>Project</div>
          <div>Status</div>
          <div></div>
        </div>
        {paginatedTickets.length > 0 ? (
          paginatedTickets.map((ticket) => (
            <div key={ticket._id} className="ticket">
              <div data-label="Ticket ID">{ticket.ticket_id}</div>
              <div data-label="Date">{new Date(ticket.createdAt).toLocaleDateString()}</div>
              <div data-label="Project">{ticket.projectname}</div>
              <div data-label="Status" className={`status status-${ticket.status}`}>{ticket.status}</div>
              <div className="ticket-buttons">
                <Link to={`/ticket/${ticket._id}`} className="btn btn-reverse btn-sm">
                  Read
                </Link>
                <button 
                  onClick={() => handleServiceReport(ticket._id)}
                  className="btn btn-reverse btn-sm service-report-btn"
                >
                  Service Report Form
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No tickets found.</p>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => goToPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => goToPage((prev) => prev + 1)}
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

        .ticket-buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .btn-sm {
          min-width: 100px;
          text-align: center;
          font-weight: bold;
        }

        .service-report-btn {
          white-space: nowrap;
        }
      `}</style>
    </>
  );
}

export default Tickets;
