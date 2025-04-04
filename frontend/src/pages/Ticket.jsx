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

  if (isLoading || !ticket || Object.keys(ticket).length === 0) {
    return (
      <div className="loading-container">
        <Spinner />
        <p>Loading ticket details...</p>
      </div>
    );
  }
  

  if (!ticket || !ticket._id) {
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
  <BackButton url="/tickets" />

  <h2>Ticket Overview</h2>
  <p><strong>Ticket ID:</strong> {ticket._id}</p>
  <p>
    <strong>Status:</strong>{" "}
    <span className={`status status-${ticket.status}`}>{ticket.status}</span>
  </p>
  <p>
    <strong>Date Submitted:</strong>{" "}
    {ticket.createdAt
      ? new Date(ticket.createdAt).toLocaleString("en-US", options)
      : "N/A"}
  </p>

  <h2>Project Details</h2>
  <p><strong>Project Name:</strong> {ticket.projectname || "N/A"}</p>
  <p><strong>Site Location:</strong> {ticket.sitelocation || "N/A"}</p>
  <p><strong>Project Location:</strong> {ticket.projectlocation || "N/A"}</p>

  <h2>Technical Information</h2>
  <p><strong>Fault:</strong> {ticket.fault || "N/A"}</p>
  <p><strong>Issue:</strong> {ticket.issue || "N/A"}</p>
  <p><strong>Date of Fault:</strong> 
    {ticket.date
      ? new Date(ticket.date).toLocaleDateString("en-US", options)
      : "N/A"}
  </p>
  <p><strong>Spare Required:</strong> {ticket.spare || "N/A"}</p>
  <p><strong>Rating:</strong> {ticket.rating || "N/A"}</p>
  <hr />
  <h2>Description of Issue</h2>
  <p>{ticket.description || "No description provided"}</p>
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
