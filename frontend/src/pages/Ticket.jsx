//for individual ticket when click read button

import { useDispatch, useSelector } from "react-redux";
import BackButton from "../components/BackButton";
import { getTicket, closeTicket, getTickets } from "../features/tickets/ticketSlice";
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
import { store } from '../app/store';


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
    const fetchData = async () => {
      try {
        await dispatch(getTicket(ticketId));
        await dispatch(getNotes(ticketId));
      } catch (error) {
        toast.error('Could not fetch ticket details');
      }
    };

    fetchData();

    // Only reset notes when unmounting
    return () => {
      dispatch(notesReset());
    };
  }, [ticketId, dispatch]);

  // Close ticket
  const onTicketClose = async () => {
    try {
      await dispatch(closeTicket(ticketId)).unwrap();
      toast.success("Ticket Closed");
      // Fetch updated tickets list before navigating
      await dispatch(getTickets());
      navigate("/tickets");
    } catch (error) {
      toast.error("Failed to close ticket");
    }
  };

  // Open/Close Modal
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  // Create Note Submit
  const onNoteSubmit = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) {
      toast.error("Please enter a note");
      return;
    }
    try {
      await dispatch(createNote({ noteText, ticketId })).unwrap();
      setNoteText("");
      closeModal();
      toast.success("Note added successfully");
      // Refresh notes after adding
      dispatch(getNotes(ticketId));
    } catch (error) {
      toast.error(error || "Failed to add note");
    }
  };

  if (isLoading || notesIsLoading) {
    return <Spinner />;
  }

  if (isError) {
    return (
      <div className="error-container">
        <h3>Something went wrong</h3>
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
        <button onClick={() => navigate('/tickets')} className="btn">
          Back to Tickets
        </button>
      </div>
    );
  }

  return (
    <div className="ticket-page">
      <header className="ticket-header">
        <BackButton url="/tickets" />
        <h2>Ticket Details</h2>
        
        <div className="ticket-info">
          <div className="info-row">
            <p><strong>ID:</strong> {ticket._id}</p>
            <p>
              <strong>Status:</strong>
              <span className={`status status-${ticket.status}`}>
                {ticket.status}
              </span>
            </p>
          </div>
          
          <div className="info-row">
            <p>
              <strong>Created:</strong>{" "}
              {new Date(ticket.createdAt).toLocaleString()}
            </p>
            <p><strong>Project:</strong> {ticket.projectname}</p>
          </div>
        </div>

        <div className="ticket-details">
          <h3>Issue Details</h3>
          <p><strong>Fault Type:</strong> {ticket.fault}</p>
          <p><strong>Issue Description:</strong> {ticket.issue}</p>
          <p><strong>Site Location:</strong> {ticket.sitelocation}</p>
          <p><strong>Project Location:</strong> {ticket.projectlocation}</p>
          <p>
            <strong>Date of Fault:</strong>{" "}
            {ticket.date && new Date(ticket.date).toLocaleDateString()}
          </p>
          <p><strong>Spare Required:</strong> {ticket.spare}</p>
          <p><strong>Rating:</strong> {ticket.rating}</p>
        </div>

        <div className="ticket-description">
          <h3>Full Description</h3>
          <p>{ticket.description}</p>
        </div>

        <div className="ticket-notes">
          <h3>Notes</h3>
          {ticket.status !== "closed" && (
            <button onClick={openModal} className="btn">
              <FaPlus /> Add Note
            </button>
          )}

          {notes && notes.length > 0 ? (
            <div className="notes-list">
              {notes.map((note) => (
                <NoteItem key={note._id} note={note} />
              ))}
            </div>
          ) : (
            <p className="no-notes">No notes yet</p>
          )}
        </div>

        {ticket.status !== "closed" && (
          <button onClick={onTicketClose} className="btn btn-block btn-danger">
            Close Ticket
          </button>
        )}
      </header>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Add Note"
      >
        <h2>Add Note</h2>
        <button className="btn-close" onClick={closeModal}>X</button>
        <form onSubmit={onNoteSubmit}>
          <div className="form-group">
            <textarea
              name="noteText"
              id="noteText"
              className="form-control"
              placeholder="Add your note here..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            ></textarea>
          </div>
          <div className="form-group">
            <button type="submit" className="btn">Submit</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Ticket;
