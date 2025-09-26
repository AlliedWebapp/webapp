
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { deleteTicketDraft, deleteFsrDraft } from '../features/drafts/draftsSlice';
import { createTicket } from '../features/tickets/ticketSlice';
import { toast } from 'react-toastify';
import BackButton from '../components/BackButton';

const API_URL = process.env.REACT_APP_API_BASE_URL;

function Drafts() {
  const [activeTab, setActiveTab] = useState('tickets');
  const { tickets, fsrs } = useSelector((state) => state.drafts);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDeleteTicket = (id) => {
    dispatch(deleteTicketDraft({ id }));
    toast.success('Ticket draft deleted');
  };

  const handleDeleteFsr = (id) => {
    dispatch(deleteFsrDraft({ id }));
    toast.success('FSR draft deleted');
  };

  const handleEditTicket = (id) => {
    navigate(`/new-ticket?draftId=${id}`);
  };

  const handleEditFsr = (id) => {
    const draft = fsrs.find(d => d.id === id);
    if (draft && draft.ticketId) {
        navigate(`/service-report/${draft.ticketId}?draftId=${id}`);
    } else {
        toast.error('Cannot edit FSR draft without a ticketId.');
    }
  };

  const handleSubmitTicket = (draft) => {
    const formData = new FormData();
    Object.entries(draft).forEach(([key, value]) => {
      if (key === 'images') {
        value.forEach(image => formData.append('images', image));
      } else {
        formData.append(key, value);
      }
    });
    dispatch(createTicket(formData));
    dispatch(deleteTicketDraft({ id: draft.id }));
    toast.success('Ticket submitted successfully');
    navigate('/tickets');
  };

  const handleSubmitFsr = async (draft) => {
    if (!user?.token) {
      toast.error("Please log in to submit the report.");
      return;
    }

    const submitData = new FormData();
    Object.entries(draft).forEach(([key, value]) => {
      if (key === "workPhotos") {
        if (value && value.length > 0) {
          value.forEach((file) => {
            submitData.append("workPhotos", file);
          });
        }
      } else if (value != null) {
        submitData.append(key, value);
      }
    });

    try {
      const response = await fetch(`${API_URL}/api/reports/submit-fsr`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${user.token}`
        },
        body: submitData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      toast.success(`Report submitted successfully! FSR ID: ${data.fsrId}`);
      dispatch(deleteFsrDraft({ id: draft.id }));
      navigate("/fsr");

    } catch (error) {
      toast.error(error.message || "Failed to submit FSR draft.");
    }
  };

  return (
    <>
    <BackButton url="/home" />
      <style>{`
        .container {
          max-width: 900px;
          margin: 20px auto;
          padding: 0 15px;
          font-family: Arial, sans-serif;
        }

        .heading {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 20px;
          text-align: center;
        }

        .tabs {
          display: flex;
          justify-content: center;
          margin-bottom: 25px;
          gap: 15px;
        }

        .tab-btn {
          padding: 8px 24px;
          background-color: #f0f0f0;
          border: none;
          border-radius: 5px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.25s ease;
        }

        .tab-btn:hover {
          background-color: #ddd;
        }

        .tab-btn.active {
          background-color: #007bff;
          color: white;
          font-weight: 600;
          box-shadow: 0 2px 6px rgba(0,123,255,0.5);
        }

        .sub-heading {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 15px;
          border-bottom: 2px solid #007bff;
          padding-bottom: 5px;
        }

        .drafts-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .draft-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #fafafa;
          border: 1px solid #ddd;
          padding: 12px 20px;
          border-radius: 6px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .draft-item div p {
          margin: 3px 0;
          font-size: 1rem;
          color: #333;
        }

        .draft-actions {
          display: flex;
          gap: 10px;
        }

        @media (max-width: 600px) {
          .draft-item {
            flex-direction: column;
            align-items: flex-start;
          }

          .draft-actions {
            margin-top: 10px;
            width: 100%;
            justify-content: flex-start;
          }

          .btn {
            flex: 1;
            margin-right: 10px;
          }
        }
      `}</style>

      <div className="container">
        <h1 className="heading">Drafts</h1>

        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'tickets' ? 'active' : ''}`}
            onClick={() => setActiveTab('tickets')}
          >
            Ticket Drafts
          </button>
          <button
            className={`tab-btn ${activeTab === 'fsrs' ? 'active' : ''}`}
            onClick={() => setActiveTab('fsrs')}
          >
            FSR Drafts
          </button>
        </div>

        {activeTab === 'tickets' && (
          <div>
            <h2 className='sub-heading'>Ticket Drafts</h2>
            {tickets.length > 0 ? (
              <div className="drafts-list">
                {tickets.map((draft) => (
                  <div key={draft.id} className="draft-item">
                    <div>
                      <p><strong>Project:</strong> {draft.projectname}</p>
                      <p><strong>Site Location:</strong> {draft.sitelocation}</p>
                      <p><strong>Project Location:</strong> {draft.projectlocation}</p>
                      <p><strong>Issue:</strong> {draft.issue}</p>
                      <p><strong>Description:</strong> {draft.description}</p>
                    </div>
                    <div className="draft-actions">
                      <button className="btn btn-sm" onClick={() => handleEditTicket(draft.id)}>Edit</button>
                      <button className="btn btn-sm btn-primary" onClick={() => handleSubmitTicket(draft)}>Submit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDeleteTicket(draft.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No ticket drafts found.</p>
            )}
          </div>
        )}

        {activeTab === 'fsrs' && (
          <div>
            <h2 className='sub-heading'>FSR Drafts</h2>
            {fsrs.length > 0 ? (
              <div className="drafts-list">
                {fsrs.map((draft) => (
                  <div key={draft.id} className="draft-item">
                    <div>
                      <p><strong>Project Name:</strong> {draft.customerName}</p>
                      <p><strong>Commisioning Date:</strong> {draft.commissioningDate}</p>
                      <p><strong>Fault Summary:</strong> {draft.problemSummary}</p>
                      <p><strong>Engineer Name:</strong> {draft.engineerName}</p>
                    </div>
                    <div className="draft-actions">
                      <button className="btn btn-sm" onClick={() => handleEditFsr(draft.id)}>Edit</button>
                      <button className="btn btn-sm btn-primary" onClick={() => handleSubmitFsr(draft)}>Submit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDeleteFsr(draft.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No FSR drafts found.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Drafts;
