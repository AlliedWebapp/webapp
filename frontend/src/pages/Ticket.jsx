//for individual ticket when click read button

import { useDispatch, useSelector } from "react-redux";
import BackButton from "../components/BackButton";
import { getTicket, closeTicket } from "../features/tickets/ticketSlice";
import {
  getNotes,
  createNote,
  reset as notesReset,
} from "../features/notes/noteSlice";
import Spinner from "../components/Spinner";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import NoteItem from "../components/NoteItem";
import Modal from "react-modal";
import { FaPlus } from "react-icons/fa";

const customStyles = {
  content: {
    width: "600px",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    position: "relative",
  },
};

Modal.setAppElement("#root");

function Ticket() {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [noteText, setNoteText] = useState("");

  const { ticket, isLoading, isError, message } = useSelector(
    (state) => state.tickets
  );

  const { notes, isLoading: notesIsLoading } = useSelector(
    (state) => state.notes
  );

  const { ticketId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchTicket = async () => {
      try {
        if (isMounted) {
          console.log('Fetching ticket with ID:', ticketId);
          const ticketResult = await dispatch(getTicket(ticketId)).unwrap();
          console.log('Ticket fetched:', ticketResult);
          
          if (isMounted) {
            await dispatch(getNotes(ticketId)).unwrap();
          }
        }
      } catch (error) {
        console.error('Error in useEffect:', error);
        if (isMounted) {
          toast.error(error.message || 'Failed to fetch ticket data');
        }
      }
    };

    fetchTicket();

    return () => {
      isMounted = false;
    };
  }, [ticketId, dispatch]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <Spinner />
        <p>Loading ticket details...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="error-container">
        <h3>Error: {message}</h3>
        <p>Please try again later</p>
        <button onClick={() => navigate('/tickets')} className="btn">
          Back to Tickets
        </button>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="error-container">
        <h3>No ticket found</h3>
        <p>The ticket you're looking for doesn't exist or has been deleted</p>
        <button onClick={() => navigate('/tickets')} className="btn">
          Back to Tickets
        </button>
      </div>
    );
  }

  console.log('Rendering ticket with data:', ticket);

  // Close ticket
  const onTicketClose = () => {
    dispatch(closeTicket(ticketId))
      .unwrap()
      .then(() => {
        toast.success("Ticket Closed");
        navigate("/tickets");
      })
      .catch((error) => {
        toast.error(error.message || "Failed to close ticket");
      });
  };

  // Open/Close Modal
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  // Create Note Submit
  const onNoteSubmit = (e) => {
    e.preventDefault();
    if (!noteText.trim()) {
      toast.error("Please enter a note");
      return;
    }
    dispatch(createNote({ ticketId, noteText }))
      .unwrap()
      .then(() => {
        toast.success("Note added successfully");
        setNoteText("");
        closeModal();
      })
      .catch((error) => {
        toast.error(error.message || "Failed to add note");
      });
  };
//for read ticket headers 
  return (
    <div className="ticket-page">
      <header className="ticket-header">
  {/* Back button to navigate to ticket list */}
  <BackButton url="/tickets" />

  {/* Ticket ID and Status */}
  <h2>
    Ticket ID: {ticket._id}
    <span className={`status status-${ticket.status}`}>{ticket.status}</span>
  </h2>

  {/* Ticket creation date */}
  <h3>
    Date Submitted:{" "}
    {ticket.createdAt
      ? new Date(ticket.createdAt).toLocaleString("en-US", options)
      : "N/A"}
  </h3>

  {/* Project-related information */}
  <h3>Project Name: {ticket.projectname || "N/A"}</h3>
  <h3>Site Location: {ticket.sitelocation || "N/A"}</h3>
  <h3>Project Location: {ticket.projectlocation || "N/A"}</h3>

  {/* Technical issue details */}
  <h3>Fault: {ticket.fault || "N/A"}</h3>
  <h3>Issue: {ticket.issue || "N/A"}</h3>

  {/* Fault report date (separate from createdAt) */}
  <h3>
    Date of Fault:{" "}
    {ticket.date
      ? new Date(ticket.date).toLocaleDateString("en-US", options)
      : "N/A"}
  </h3>

  {/* Spare part and rating info */}
  <h3>Spare Required: {ticket.spare || "N/A"}</h3>
  <h3>Rating: {ticket.rating || "N/A"}</h3>

  {/* Divider */}
  <hr />

  {/* Description section */}
  <div className="ticket-desc">
    <h3>Description of Issue</h3>
    <p>{ticket.description || "No description provided"}</p>
  </div>

  {/* Notes section heading */}
  <h2>Notes</h2>
</header>


      {ticket.status !== "close" && (
        <button onClick={openModal} className="btn">
          <FaPlus /> Add Note
        </button>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Add Note"
      >
        <h2>Add Note</h2>
        <button className="btn-close" onClick={closeModal}>
          X
        </button>
        <form onSubmit={onNoteSubmit}>
          <div className="form-group">
            <textarea
              name="noteText"
              id="noteText"
              className="form-control"
              placeholder="Enter your note here..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              maxLength={500}
            ></textarea>
            <small className="text-muted">
              {noteText.length}/500 characters
            </small>
          </div>
          <div className="form-group">
            <button className="btn" type="submit">
              Submit
            </button>
          </div>
        </form>
      </Modal>

      {notes && notes.length > 0 ? (
        notes.map((note) => <NoteItem key={note._id} note={note} />)
      ) : (
        <p className="no-notes">No notes yet</p>
      )}

      {ticket.status !== "close" && (
        <button onClick={onTicketClose} className="btn btn-block btn-danger">
          Close Ticket
        </button>
      )}
    </div>
  );
}

export default Ticket;
