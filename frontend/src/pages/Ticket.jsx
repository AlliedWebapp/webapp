

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
import { useEffect, useState, useMemo, useCallback } from "react";
import { toast } from "react-toastify";
import NoteItem from "../components/NoteItem";
import Modal from "react-modal";
import { 
  FaPlus, 
  FaTicketAlt, 
  FaImages,
  FaComments,
  FaClipboardList,
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle
} from "react-icons/fa";
import "../index.css";
const API_URL = process.env.REACT_APP_API_BASE_URL;

const customStyles = {
  content: {
    width: "90%",
    maxWidth: "600px",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    position: "relative",
    border: "none",
    borderRadius: "16px",
    padding: "0",
    background: "transparent",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    backdropFilter: "blur(4px)",
  },
};

Modal.setAppElement("#root");

const PROJECTS = {
  Shong: "shong",
  Solding: "solding",
  "SDLLP Salun": "sdllpsalun",
  "JHP Kuwarsi-II": "kuwarsi",
  "Jogini-II": "jogini"
};

function Ticket() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [hasFSR, setHasFSR] = useState(false);
  const [isCheckingFSR, setIsCheckingFSR] = useState(true);
  const [spareName, setSpareName] = useState("");
  const [consumableName, setConsumableName] = useState("");

  const { ticket, isLoading, isError, message } = useSelector(
    (state) => state.tickets
  );

  const { notes, isLoading: notesIsLoading, isError: notesIsError, message: notesMessage } = useSelector(
    (state) => state.notes
  );
  const { user } = useSelector((state) => state.auth);

  const { ticketId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const authToken = useMemo(() => {
    if (user?.token) return user.token;
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return null;
      const parsed = JSON.parse(storedUser);
      return parsed?.token || null;
    } catch (error) {
      console.error("Unable to parse stored user", error);
      return null;
    }
  }, [user]);

  const authorizedFetch = useCallback(
    (url, options = {}) => {
      const headers = {
        ...(options.headers || {}),
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      };
      return fetch(url, { ...options, headers });
    },
    [authToken]
  );

  const checkFSR = useCallback(async () => {
    if (!authToken) {
      setHasFSR(false);
      return false;
    }
    try {
      const response = await authorizedFetch(`${API_URL}/api/reports/fsr-by-ticket/${ticketId}`);

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
  }, [authorizedFetch, ticketId, authToken]);

  const handleCreateFSR = useCallback(async () => {
    const fsrExists = await checkFSR();
    if (!fsrExists) {
      navigate(`/generator-service-report/${ticketId}`);
    }
  }, [checkFSR, navigate, ticketId]);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(getTicket(ticketId)).unwrap(),
          dispatch(getNotes(ticketId)).unwrap(),
        ]);
        await checkFSR();
      } catch (error) {
        console.error("Error loading ticket data:", error);
      } finally {
        if (isMounted) {
          setIsCheckingFSR(false);
        }
      }
    };

    fetchData();
    return () => {
      isMounted = false;
      dispatch(notesReset());
    };
  }, [ticketId, dispatch, checkFSR]);

  useEffect(() => {
    const fetchSpareName = async () => {
      if (!ticket || !ticket.spare || !ticket.projectname) return;
      const projectKey = PROJECTS[ticket.projectname];
      if (!projectKey) return;
      try {
        const apiUrl = `${API_URL}/api/${projectKey}`;
        const response = await authorizedFetch(apiUrl, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        const items = Array.isArray(data) ? data : data.data || [];
        const spareObj = items.find(item => item._id === ticket.spare);
        const findItemNameField = (item, collection) => {
          const fieldMappings = {
            jogini: ["Spare Discription"],
            shong: ["Description of Material"],
            solding: ["Description of Material"],
            sdllpsalun: ["NAME OF MATERIALS"],
            kuwarsi: ["NAME OF MATERIALS"]
          };
          const fieldsToCheck = fieldMappings[collection?.toLowerCase?.()] || ["item_name", "name", "Name"];
          const existingField = fieldsToCheck.find(field => item[field] !== undefined);
          if (!existingField) return null;
          const value = item[existingField];
          if (value === null || value === undefined || value === "") return "Unnamed";
          return value;
        };
        setSpareName(spareObj ? findItemNameField(spareObj, projectKey) : "Unknown Spare");
      } catch (err) {
        setSpareName("");
      }
    };
    fetchSpareName();
  }, [ticket, authorizedFetch]);

  useEffect(() => {
    const fetchConsumableName = async () => {
      if (!ticket || !ticket.consumable) return;
      try {
        const apiUrl = `${API_URL}/api/consumables`;
        const response = await authorizedFetch(apiUrl, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        const items = Array.isArray(data) ? data : data.data || [];
        const consumableObj = items.find(item => item._id === ticket.consumable);
        setConsumableName(consumableObj ? consumableObj.item_name : "Unknown Consumable");
      } catch (err) {
        setConsumableName("");
      }
    };
    fetchConsumableName();
  }, [ticket, authorizedFetch]);

  if (isLoading || notesIsLoading || isCheckingFSR) return <Spinner />;

  if (isError)
    return (
      <div className="error-container">
        <div className="error-card">
          <FaExclamationTriangle className="error-icon" />
          <h3>Error: {message}</h3>
          <button onClick={() => navigate("/tickets")} className="btn btn-primary">
            Back to Tickets
          </button>
        </div>
      </div>
    );

  if (!ticket)
    return (
      <div className="error-container">
        <div className="error-card">
          <FaExclamationTriangle className="error-icon" />
          <h3>No ticket found</h3>
          <button onClick={() => navigate("/tickets")} className="btn btn-primary">
            Back to Tickets
          </button>
        </div>
      </div>
    );

  const onTicketClose = async () => {
    try {
      await dispatch(closeTicket(ticketId)).unwrap();
      toast.success("Ticket Closed Successfully");
      navigate("/tickets");
    } catch (error) {
      toast.error(error.message || "Failed to close ticket");
    }
  };

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const onNoteSubmit = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) {
      toast.error("Please enter a note");
      return;
    }
    try {
      await dispatch(createNote({ ticketId, noteText })).unwrap();
      toast.success("Note added successfully");
      setNoteText("");
      closeModal();
    } catch (error) {
      toast.error(error.message || "Failed to add note");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <FaExclamationTriangle className="status-icon open" />;
      case 'close':
        return <FaCheckCircle className="status-icon closed" />;
      default:
        return <FaTicketAlt className="status-icon" />;
    }
  };

  return (
    <div className="ticket-page">
  
      <div className="ticket-header">
        <div className="header-content">
          <BackButton url="/tickets" />
          <div className="header-main">
            <div className="header-title">
              <FaTicketAlt className="header-icon" />
              <h1>Ticket Details</h1>
            </div>
            <div className="header-status">
              {getStatusIcon(ticket.status)}
              <span className={`status-badge status-${ticket.status}`}>
                {ticket.status === 'new' ? 'OPEN' : ticket.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>


      <div className="ticket-content">
        
        <div className="ticket-overview-card">
          <div className="card-header">
            <h2><FaClipboardList /> Ticket Overview</h2>
          </div>
          <div className="overview-grid">
            <div className="overview-item">
              <div className="overview-label">
                <span>Ticket ID</span>
              </div>
              <div className="overview-value">{ticket._id}</div>
            </div>
            <div className="overview-item">
              <div className="overview-label">
                <span>Created at</span>
              </div>
              <div className="overview-value">
                {new Date(ticket.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
            <div className="overview-item">
              <div className="overview-label">
                <span>Project</span>
              </div>
              <div className="overview-value">{ticket.projectname}</div>
            </div>
            <div className="overview-item">
              <div className="overview-label">
                <span>Rating</span>
              </div>
              <div className="overview-value">{ticket.rating}</div>
            </div>
          </div>
        </div>

        <div className="ticket-details-card">
          <div className="card-header">
            <h2><FaExclamationTriangle /> Issue Details</h2>
          </div>
          <div className="details-grid">
            <div className="detail-item">
              <div className="detail-label">
                <span>Fault Type</span>
              </div>
              <div className="detail-value">{ticket.fault}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">
                <span>Site Location</span>
              </div>
              <div className="detail-value">{ticket.sitelocation}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">
                <span>Project Location</span>
              </div>
              <div className="detail-value">{ticket.projectlocation}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">
                <span>Date of Fault</span>
              </div>
              <div className="detail-value">
                {ticket.date ? new Date(ticket.date).toLocaleDateString() : 'Not specified'}
              </div>
            </div>
            <div className="detail-item full-width">
              <div className="detail-label">
                <span>Issue Description</span>
              </div>
              <div className="detail-value">{ticket.issue}</div>
            </div>
            <div className="detail-item full-width">
              <div className="detail-label">
                <span>Full Description</span>
              </div>
              <div className="detail-value description-text">{ticket.description}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">
                <span>Spare Required</span>
              </div>
              <div className="detail-value">
                {spareName ? `${spareName} (Qty: ${ticket.spareQuantity || 1})` : ticket.spare || 'None'}
              </div>
            </div>
        
            <div className="detail-item">
              <div className="detail-label">
                <span>Consumable Required</span>
              </div>
              <div className="detail-value">
                {ticket.consumable ? `${consumableName}` : 'None'}
              </div>
            </div>
   
            <div className="detail-item">
              <div className="detail-label">
                <span>Fuel Consumed</span>
              </div>
              <div className="detail-value">
                {ticket.fuel_consumed !== undefined && ticket.fuel_consumed !== null && ticket.fuel_consumed !== "" ? ticket.fuel_consumed : 'None'}
              </div>
            </div>
   
            <div className="detail-item">
              <div className="detail-label">
                <span>Total KM Driven</span>
              </div>
              <div className="detail-value">
                {ticket.total_km !== undefined && ticket.total_km !== null && ticket.total_km !== "" ? ticket.total_km : 'None'}
              </div>
            </div>
          </div>
        </div>

        {ticket.images && ticket.images.length > 0 && (
          <div className="ticket-images-card">
            <div className="card-header">
              <h2><FaImages /> Uploaded Images</h2>
              <span className="image-count">{ticket.images.length} image{ticket.images.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="images-grid">
              {ticket.images.map((_, index) => {
                const imageUrl = `${API_URL}/api/tickets/${ticket._id}/images/${index}`;
                return (
                  <div key={index} className="image-thumbnail" onClick={() => setPreviewImage(imageUrl)}>
                    <img
                      src={imageUrl}
                      alt={`Ticket Image ${index + 1}`}
                      onError={async (e) => {
                        e.target.onerror = null;
                        try {
                          const response = await authorizedFetch(imageUrl);
                          const blob = await response.blob();
                          e.target.src = URL.createObjectURL(blob);
                        } catch (err) {
                          console.error('Error loading image:', err);
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyMEg2MFY2MEgyMFYyMFoiIGZpbGw9IiNFNUU3RUIiLz4KPHBhdGggZD0iTTI1IDI1SDM1VjM1SDI1VjI1WiIgZmlsbD0iI0M3Q0E5QyIvPgo8cGF0aCBkPSJNMjAgNDVMMzAgMzVINDBMNTAgNDVINjBWMjBIMjBWNDVaIiBmaWxsPSIjQzdDQTlDIi8+Cjwvc3ZnPgo=';
                        }
                      }}
                    />
                    <div className="image-overlay">
                      <span>View</span>
                    </div>
                    
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {ticket.attachments && ticket.attachments.length > 0 && (
          <div className="ticket-attachments-card">
            <div className="card-header">
              <h2><FaClipboardList /> Attachments</h2>
              <span className="attachment-count">
                {ticket.attachments.length} attachment{ticket.attachments.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="attachments-grid">
              {ticket.attachments.map((attachment, index) => {
                const displayName = attachment.originalName || `attachment-${index+1}`;
                const shortName = displayName.length > 24 ? `${displayName.slice(0, 21)}...` : displayName;

                const downloadAttachment = async () => {
                  try {
                    if (!authToken) { 
                      toast.error("Authentication required to download attachments");
                      return; 
                    }
                    const response = await authorizedFetch(
                      `${API_URL}/api/tickets/${ticket._id}/attachments/${index}`
                    );
                    if (!response.ok) throw new Error("Failed to download attachment");
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = displayName;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);
                  } catch (error) {
                    console.error(error);
                  }
                };

                const previewAttachment = async () => {
                  try {
                    if (!authToken) {
                      toast.error("Authentication required to preview attachments");
                      return;
                    }
                    const previewWindow = window.open('', '_blank');
                    if (!previewWindow) {
                      await downloadAttachment();
                      return;
                    }
                    const response = await authorizedFetch(
                      `${API_URL}/api/tickets/${ticket._id}/attachments/${index}`
                    );
                    if (!response.ok) throw new Error('Failed to preview attachment');

                    const contentType = response.headers.get('Content-Type') || (attachment.contentType || 'application/octet-stream');
                    const blob = await response.blob();
                    const objectUrl = window.URL.createObjectURL(blob);

                    const openViewer = (html) => {
                      const blobHtml = new Blob([html], { type: 'text/html' });
                      const htmlUrl = URL.createObjectURL(blobHtml);
                      previewWindow.location.href = htmlUrl;
                      setTimeout(() => {
                        URL.revokeObjectURL(htmlUrl);
                        URL.revokeObjectURL(objectUrl);
                      }, 60 * 1000);
                    };

                    if (contentType.startsWith('image/')) {
                      // Image preview
                      openViewer(`<!doctype html><html><head><meta charset="utf-8"><title>${displayName}</title><style>body{margin:0;background:#111;display:flex;align-items:center;justify-content:center;height:100vh}</style></head><body><img src="${objectUrl}" style="max-width:100%;max-height:100%" /></body></html>`);
                      return;
                    }
                    if (contentType === 'application/pdf') {
                      // PDF preview via iframe
                      openViewer(`<!doctype html><html><head><meta charset="utf-8"><title>${displayName}</title><style>html,body{height:100%;margin:0}</style></head><body><iframe src="${objectUrl}" style="border:0;width:100%;height:100%"></iframe></body></html>`);
                      return;
                    }
                    if (contentType.startsWith('text/')) {
                      // Text preview
                      const text = await blob.text();
                      openViewer(`<!doctype html><html><head><meta charset="utf-8"><title>${displayName}</title><style>pre{white-space:pre-wrap;word-wrap:break-word;font-family:system-ui, -apple-system, Segoe UI, Roboto, sans-serif;padding:16px}</style></head><body><pre>${text.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}</pre></body></html>`);
                      return;
                    }

                    // Fallback: show interstitial with a link (prevents auto-download behavior)
                    openViewer(`<!doctype html><html><head><meta charset="utf-8"><title>${displayName}</title><style>body{font-family:system-ui, -apple-system, Segoe UI, Roboto, sans-serif;padding:24px}</style></head><body><h3>Preview not available for this file type.</h3><p>Click the link below to view or download:</p><p><a href="${objectUrl}" target="_blank" rel="noopener">Open file</a></p></body></html>`);
                  } catch (err) {
                    console.error(err);
                  }
                };

                return (
                  <div key={index} className="attachment-box">
                    <span className="attachment-name" title={displayName}>
                      {shortName}
                    </span>
                    <div className="attachment-actions">
                      <button onClick={previewAttachment} className="preview-btn">Preview</button>
                      <button onClick={downloadAttachment} className="download-btn">Download</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

       
        <div className="ticket-notes-card">
          <div className="card-header">
            <h2><FaComments /> Notes</h2>
            {ticket.status !== "close" && (
              <button onClick={openModal} className="btn btn-primary btn-sm">
                <FaPlus /> Add Note
              </button>
            )}
          </div>
          
          {Array.isArray(notes) && notes.length > 0 ? (
            <div className="notes-list">
              {notes.map((note) => (
                <NoteItem key={note._id} note={note} />
              ))}
            </div>
          ) : (
            <div className="no-notes">
              <FaComments className="no-notes-icon" />
              <p>No notes yet</p>
            </div>
          )}
        </div>

        <div className="ticket-actions-card">
          <div className="actions-grid">
            {ticket.status !== "close" && (
              <button onClick={onTicketClose} className="btn btn-danger btn-large">
                <FaCheckCircle /> Close Ticket
              </button>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Add Note"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h2><FaComments /> Add Note</h2>
            <button className="modal-close" onClick={closeModal}>
              <FaTimes />
            </button>
          </div>
          <form onSubmit={onNoteSubmit} className="modal-form">
            <div className="form-group">
              <label htmlFor="noteText">Note Content</label>
              <textarea
                name="noteText"
                id="noteText"
                className="form-control"
                placeholder="Enter your note here..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows="6"
              ></textarea>
            </div>
            <div className="modal-actions">
              <button type="button" onClick={closeModal} className="btn btn-outline">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <FaPlus /> Add Note
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {previewImage && (
        <div className="image-preview-overlay" onClick={() => setPreviewImage(null)}>
          <div className="image-preview-content" onClick={(e) => e.stopPropagation()}>
            <button className="preview-close" onClick={() => setPreviewImage(null)}>
              <FaTimes />
            </button>
            <img
              src={previewImage}
              alt="Preview"
              onError={async (e) => {
                e.target.onerror = null;
                try {
                  const response = await authorizedFetch(previewImage);
                  const blob = await response.blob();
                  e.target.src = URL.createObjectURL(blob);
                } catch (err) {
                  console.error('Error loading preview image:', err);
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTAwSDMwMFYyMDBIMTAwVjEwMFoiIGZpbGw9IiNFNUU3RUIiLz4KPHBhdGggZD0iTTEyNSAxMjVIMTc1VjE3NUgxMjVWMTI1WiIgZmlsbD0iI0M3Q0E5QyIvPgo8cGF0aCBkPSJNMTAwIDIyNUwxNTAgMTc1SDI1MEwyMDAgMjI1SDMwMFYxMDBIMTAwVjIyNVoiIGZpbGw9IiNDN0NBOUMiLz4KPC9zdmc+Cg==';
                }
              }}

              
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Ticket;

