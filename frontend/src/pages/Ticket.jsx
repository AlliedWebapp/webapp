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
  const [ticketData, setTicketData] = useState(null);

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
        console.log('Starting to fetch ticket:', ticketId);
        const actionResult = await dispatch(getTicket(ticketId)).unwrap();
        console.log('Fetch result:', actionResult);
        
        if (actionResult) {
          setTicketData(actionResult);
          await dispatch(getNotes(ticketId));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Could not fetch ticket details');
      }
    };

    fetchData();
    return () => {
      dispatch(notesReset());
    };
  }, [ticketId, dispatch]);

  // Debug logs
  console.log('Component render state:', {
    ticketData,
    reduxTicket: ticket,
    isLoading,
    isError
  });

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return (
      <div className="error-container">
        <h3>Error: {message}</h3>
        <button onClick={() => navigate('/tickets')} className="btn">
          Back to Tickets
        </button>
      </div>
    );
  }

  // Use local state for rendering if available, otherwise fall back to Redux state
  const displayTicket = ticketData || ticket;

  if (!displayTicket) {
    return (
      <div className="error-container">
        <h3>No ticket found</h3>
        <button onClick={() => navigate('/tickets')} className="btn">
          Back to Tickets
        </button>
      </div>
    );
  }

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

  return (
    <div className="ticket-page">
      <header className="ticket-header">
        <BackButton url="/tickets" />
        <h2>Ticket Details</h2>
        
        <div className="ticket-info">
          <div className="info-row">
            <p><strong>ID:</strong> {displayTicket._id}</p>
            <p>
              <strong>Status:</strong>
              <span className={`status status-${displayTicket.status}`}>
                {displayTicket.status}
              </span>
            </p>
          </div>
          
          <div className="info-row">
            <p>
              <strong>Created:</strong>{" "}
              {displayTicket.createdAt && new Date(displayTicket.createdAt).toLocaleString()}
            </p>
            <p><strong>Project:</strong> {displayTicket.projectname}</p>
          </div>
        </div>

        <div className="ticket-details">
          <h3>Issue Details</h3>
          <p><strong>Fault Type:</strong> {displayTicket.fault}</p>
          <p><strong>Issue Description:</strong> {displayTicket.issue}</p>
          <p><strong>Site Location:</strong> {displayTicket.sitelocation}</p>
          <p><strong>Project Location:</strong> {displayTicket.projectlocation}</p>
          <p>
            <strong>Date of Fault:</strong>{" "}
            {displayTicket.date && new Date(displayTicket.date).toLocaleDateString()}
          </p>
          <p><strong>Spare Required:</strong> {displayTicket.spare}</p>
          <p><strong>Rating:</strong> {displayTicket.rating}</p>
        </div>

        <div className="ticket-description">
          <h3>Full Description</h3>
          <p>{displayTicket.description}</p>
        </div>

        <div className="ticket-notes">
          <h3>Notes</h3>
          {displayTicket.status !== "close" && (
            <button onClick={openModal} className="btn">
              <FaPlus /> Add Note
            </button>
          )}

          {notes && notes.length > 0 ? (
            notes.map((note) => <NoteItem key={note._id} note={note} />)
          ) : (
            <p>No notes yet</p>
          )}
        </div>

        {displayTicket.status !== "close" && (
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
