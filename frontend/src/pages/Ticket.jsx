// Ticket.jsx — For viewing individual ticket

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

const API_URL = process.env.REACT_APP_API_BASE_URL;

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
  const [previewImage, setPreviewImage] = useState(null);
  const [hasFSR, setHasFSR] = useState(false);
  const [isCheckingFSR, setIsCheckingFSR] = useState(true);

  const { ticket, isLoading, isError, message } = useSelector(
    (state) => state.tickets
  );

  const { notes, isLoading: notesIsLoading, isError: notesIsError, message: notesMessage } = useSelector(
    (state) => state.notes
  );

  const { ticketId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const checkFSR = async () => {
    try {
      const response = await fetch(`${API_URL}/api/reports/fsr-by-ticket/${ticketId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : ''}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setHasFSR(true);
        toast.warning(`A Service Report (ID: ${data.fsrId}) already exists for this ticket.`);
        return true;
      } else if (response.status === 404) {
        setHasFSR(false);
        return false;
      }
    } catch (error) {
      console.error("Error checking FSR:", error);
      return false;
    }
  };

  const handleCreateFSR = async () => {
    const fsrExists = await checkFSR();
    if (!fsrExists) {
      navigate(`/generator-service-report/${ticketId}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getTicket(ticketId));
        await dispatch(getNotes(ticketId));
        await checkFSR();
      } catch (error) {
      } finally {
        setIsCheckingFSR(false);
      }
    };

    fetchData();
    return () => {
      dispatch(notesReset());
    };
  }, [ticketId, dispatch]);

 // Show spinner while loading ticket, notes, or FSR check
 if (isLoading || notesIsLoading || isCheckingFSR) return <Spinner />;

  if (isError)
    return (
      <div className="error-container">
        <h3>Error: {message}</h3>
        <button onClick={() => navigate("/tickets")} className="btn">
          Back to Tickets
        </button>
      </div>
    );

  if (!ticket)
    return (
      <div className="error-container">
        <h3>No ticket found</h3>
        <button onClick={() => navigate("/tickets")} className="btn">
          Back to Tickets
        </button>
      </div>
    );

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

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

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
            <p>
              <strong>ID:</strong> {ticket._id}
            </p>
            <p>
              <strong>Status:</strong>{" "}
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
            <p>
              <strong>Project:</strong> {ticket.projectname}
            </p>
          </div>
        </div>

        <div className="ticket-details">
          <h3>Issue Details</h3>
          <p>
            <strong>Fault Type:</strong> {ticket.fault}
          </p>
          <p>
            <strong>Issue Description:</strong> {ticket.issue}
          </p>
          <p>
            <strong>Site Location:</strong> {ticket.sitelocation}
          </p>
          <p>
            <strong>Project Location:</strong> {ticket.projectlocation}
          </p>
          <p>
            <strong>Date of Fault:</strong>{" "}
            {ticket.date && new Date(ticket.date).toLocaleDateString()}
          </p>
          <p>
            <strong>Spare Required:</strong> {ticket.spare}
          </p>
          <p>
            <strong>Rating:</strong> {ticket.rating}
          </p>
        </div>

        <div className="ticket-description">
          <h3>Full Description</h3>
          <p>{ticket.description}</p>
        </div>

        {/* Image thumbnails */}
        {ticket.images && ticket.images.length > 0 && (
          <div className="ticket-images">
            <h3>Uploaded Images</h3>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {ticket.images.map((_, index) => {
                const imageUrl = `${API_URL}/api/tickets/${ticket._id}/images/${index}`;
                return (
                  <img
                    key={index}
                    src={imageUrl}
                    alt={`Ticket Image ${index + 1}`}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "10px",
                      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
                      cursor: "pointer",
                      transition: "transform 0.2s ease-in-out",
                    }}
                    onClick={() => setPreviewImage(imageUrl)}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.transform = "scale(1.05)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  />
                );
              })}
            </div>
          </div>
        )}

        <div className="ticket-notes">
          <h3>Notes</h3>
          {ticket.status !== "close" && (
            <button onClick={openModal} className="btn">
              <FaPlus /> Add Note
            </button>
          )}

          {Array.isArray(notes) && notes.length > 0 ? (
            <div className="notes-list">
              {notes.map((note) => (
                <NoteItem key={note._id} note={note} />
              ))}
            </div>
          ) : (
            <p className="no-notes">No notes yet</p>
          )}
        </div>

        <div className="ticket-actions">
          {!isCheckingFSR && (
            <button
              className="btn btn-outline"
              onClick={handleCreateFSR}
            >
              Create Service Report
            </button>
          )}
        </div>

        {ticket.status !== "close" && (
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
        <button className="btn-close" onClick={closeModal}>
          X
        </button>
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
            <button type="submit" className="btn">
              Submit
            </button>
          </div>
        </form>
      </Modal>

      {/* Image preview overlay */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <img
            src={previewImage}
            alt="Preview"
            style={{
              maxWidth: "90%",
              maxHeight: "80%",
              borderRadius: "12px",
              background: "#fff",
              padding: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            }}
          />
        </div>
      )}
    </div>
  );
}

export default Ticket;
