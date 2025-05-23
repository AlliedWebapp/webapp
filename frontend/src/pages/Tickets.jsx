import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";
import { getTickets, reset } from "../features/tickets/ticketSlice";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_BASE_URL;

function Tickets() {
  const dispatch = useDispatch();
  const { tickets, isLoading, isError, message } = useSelector(
    (state) => state.tickets
  );
  const [hasFetched, setHasFetched] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const checkFSR = async (ticketId) => {
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
  };

  const handleServiceReport = async (ticketId) => {
    const fsrExists = await checkFSR(ticketId);
    if (!fsrExists) {
      window.location.href = `/service-report/${ticketId}`;
    }
  };

  useEffect(() => {
    dispatch(getTickets()).then(() => setHasFetched(true));

    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  if (isLoading || !hasFetched) return <Spinner />;

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
      <div className="tickets">
        <div className="ticket-headings">
          <div>Ticket ID</div>
          <div>Date</div>
          <div>Project</div>
          <div>Status</div>
          <div></div>
        </div>
        {tickets && tickets.length > 0 ? (
          tickets.map((ticket) => (
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

      <style jsx>{`
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
