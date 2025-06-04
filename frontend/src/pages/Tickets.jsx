import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";
import { getTickets, reset } from "../features/tickets/ticketSlice";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_BASE_URL;
const TICKETS_PER_PAGE = 5; // Reduced page size for faster loading

function Tickets() {
  const dispatch = useDispatch();
  const { tickets, isLoading, isError, message } = useSelector(
    (state) => state.tickets
  );
  const [hasFetched, setHasFetched] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("createdAt");
  const [displayedTickets, setDisplayedTickets] = useState([]);

  // Memoized checkFSR function
  const checkFSR = useCallback(async (ticketId) => {
    try {
      const response = await fetch(`${API_URL}/api/reports/fsr-by-ticket/${ticketId}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
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
  }, [user.token]);

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
        await dispatch(getTickets()).unwrap();
        setHasFetched(true);
      } catch (error) {
        console.error("Error loading tickets:", error);
      }
    };
    loadInitialTickets();
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  // Update displayed tickets when tickets or sort field changes
  useEffect(() => {
    if (!tickets) return;

    const sorted = [...tickets].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      return aValue > bValue ? -1 : 1;
    });

    const start = (currentPage - 1) * TICKETS_PER_PAGE;
    const end = start + TICKETS_PER_PAGE;
    setDisplayedTickets(sorted.slice(start, end));
  }, [tickets, sortField, currentPage]);

  const totalPages = Math.ceil((tickets?.length || 0) / TICKETS_PER_PAGE);

  if (isLoading && !hasFetched) return <Spinner />;

  if (isError) {
    return (
      <div>
        <h3 className="text-red-500">{message}</h3>
        <BackButton url="/" />
      </div>
    );
  }

  return (
    <>
      <BackButton url="/" />
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
        {displayedTickets.length > 0 ? (
          displayedTickets.map((ticket) => (
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
