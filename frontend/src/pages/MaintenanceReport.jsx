// form of BREAK DOWN MAINTENANCE CUM CORRECTIVE ACTION REPORT//
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../index.css";
import BackButton from "../components/BackButton";
import { useSelector } from "react-redux";

const API_URL = process.env.REACT_APP_API_BASE_URL;

const MaintenanceReport = () => {
  const { ticketId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [previewImage, setPreviewImage] = useState(null);
  const [ticketImages, setTicketImages] = useState([]);

  const [formData, setFormData] = useState({
    unit: "",
    outageDate: "",
    outageTime: "",
    defectReported: "",
    investigationOutcome: "",
    correctiveAction: "",
    followUp: "",
    repairCost: "",
    remarks: "",
    generationLoss: "",
    hodSignature: null, // 👈 file
    plantInchargeSignature: null, // 👈 file
  });
  
  useEffect(() => {
    const fetchTicketImages = async () => {
      try {
        const response = await fetch(`${API_URL}/api/tickets/${ticketId}/images`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setTicketImages(data.images || []);
        }
      } catch (error) {
        console.error("Error fetching ticket images:", error);
      }
    };

    fetchTicketImages();
  }, [ticketId, user.token]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const data = new FormData();
    data.append("ticketId", ticketId);
  
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        data.append(key, value);
      }
    });

    // Debug logging
    console.log("Form Data:", Object.fromEntries(data));
  
    try {
      const response = await fetch(`${API_URL}/api/reports/submit-maintenance-report`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${user.token}`
        },
        body: data,
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log("Success Response:", result);
        alert("Maintenance Report submitted successfully!");
        window.location.href = "/view-maintenance-reports"; // Redirect to view page
      } else {
        const errorData = await response.json();
        console.error("Error Response:", errorData);
        alert("Failed to submit. Please try again.");
      }
    } catch (err) {
      console.error("Network Error:", err);
      alert("Something went wrong.");
    }
  };
  
  return (
    <div className="report-container">
      <BackButton url="/other-reports" className="back-button" />
      <header className="report-header">
        <h2>BREAK DOWN MAINTENANCE CUM CORRECTIVE ACTION REPORT</h2>
        <p><strong>Service Report for Ticket ID: {ticketId}</strong></p>
      </header>

      {/* Ticket Images Section */}
     {ticketImages.length > 0 && (
  <div className="ticket-images">
    <h3>Ticket Images</h3>
    <div
      style={{
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
        marginBottom: "20px",
      }}
    >
      {ticketImages.map((_, index) => {
        const imageUrl = `${API_URL}/api/tickets/${ticketId}/images/${index}`;
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
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              cursor: "pointer",
              transition: "transform 0.2s ease-in-out",
            }}
            onClick={() => {
              console.log("previewImage set to:", imageUrl);
              setPreviewImage(imageUrl);
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        );
      })}
    </div>
  </div>
)}

      <form onSubmit={handleSubmit} className="report-form">
        <div className="form-row">
          <div className="form-group">
            <label>Unit:</label>
            <input type="text" name="unit" value={formData.unit} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Outage Date:</label>
            <input type="date" name="outageDate" value={formData.outageDate} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Time:</label>
            <input type="time" name="outageTime" value={formData.outageTime} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Defect/Problem Reported:</label>
            <textarea name="defectReported" rows="3" value={formData.defectReported} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Outcome of Investigation:</label>
            <textarea name="investigationOutcome" rows="3" value={formData.investigationOutcome} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Corrective Action Taken:</label>
            <textarea name="correctiveAction" rows="3" value={formData.correctiveAction} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Any Follow-up to be Carried Out:</label>
            <textarea name="followUp" rows="2" value={formData.followUp} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Replacement / Repair Cost:</label>
            <input type="text" name="repairCost" value={formData.repairCost} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Remarks:</label>
            <textarea name="remarks" rows="2" value={formData.remarks} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Loss of Generation:</label>
            <input type="text" name="generationLoss" value={formData.generationLoss} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Upload HOD Signature Photo:</label>
            <input type="file" name="hodSignature" accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="form-group">
            <label>Upload Plant Incharge Signature Photo:</label>
            <input type="file" name="plantInchargeSignature" accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="signatures">
            <div className="signature-block">
              <label>Prepared by:</label>
              <input type="text" value="ASHISH S. TOMAR" readOnly />
            </div>
            <div className="signature-block">
              <label>Checked by:</label>
              <input type="text" value="NEERAJ KAMBOJ" readOnly />
            </div>
            <div className="signature-block">
              <label>Approved by:</label>
              <input type="text" value="JASWINDER S CHAUHAN" readOnly />
            </div>
          </div>
        </div>

        <button type="submit" className="submit-btn">Submit Report</button>
      </form>

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
};

export default MaintenanceReport;
