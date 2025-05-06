//fomrat of form of service report form//
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../index.css"; // Global styles
import BackButton from "../components/BackButton";
import axios from "axios";
import { useSelector } from "react-redux";

const API_URL = process.env.REACT_APP_API_BASE_URL;

const GeneratorServiceReport = () => {
  const { ticketId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [previewImage, setPreviewImage] = useState(null);
  const [ticketImages, setTicketImages] = useState([]);

  const [formData, setFormData] = useState({
    srNo: "",
    customerName: "",
    installationAddress: "",  // updated from "address"
    siteId: "",
    commissioningDate: "",    // updated from "dateOfCommissioning"
    instanceId: "",
    state: "",
    rating: "",
    engineModel: "",
    engineSerial: "",
    gensetSerial: "",
    runningHours: "",
    taskStart: "",            // updated from "startTime"
    taskEnd: "",              // updated from "endTime"
    problemSummary: "",
    natureOfFailure: "",      // updated from "failureNature"
    checklist: "",
    engineerRemarks: "",
    customerRemarks: "",
    engineerName: "",
    customerContact: "",
    customerEmail: "",
    customerSignature: null,
    engineerSignature: null,
    workPhotos: []
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "workPhotos") {
      setFormData((prev) => ({ ...prev, [name]: Array.from(files) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.token) {
      alert("Please log in to submit the report.");
      return;
    }

    console.log("Submitting FSR for user:", user);
    console.log("Form data before submission:", formData);

    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "workPhotos") {
        if (value && value.length > 0) {
          value.forEach((file) => {
            console.log("Appending work photo:", file.name);
            submitData.append("workPhotos", file);
          });
        }
      } else if (value != null) {
        console.log(`Appending ${key}:`, value);
        submitData.append(key, value);
      }
    });

    // Add ticketId to the form data
    submitData.append("ticketId", ticketId);
    console.log("Added ticketId:", ticketId);

    try {
      console.log("Submitting FSR with data:", Object.fromEntries(submitData));
      const res = await fetch(`${API_URL}/api/reports/submit-fsr`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${user.token}`
        },
        body: submitData,
      });

      const json = await res.json();
      console.log("FSR submission response:", json);

      if (res.ok) {
        alert("Report submitted successfully!");
        window.location.href = "/fsr";
      } else {
        console.error("FSR submission failed:", json);
        throw new Error(json.message || json.error || "Submit failed");
      }
    } catch (error) {
      console.error("Error submitting FSR:", error);
      alert(error.message);
    }
  };

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

  return (
    <div className="generator-service-report">
      <BackButton url="/tickets" className="back-button" />
      <header className="header">
        <h2>Service Report</h2>
        <p><strong>Allied Hydroprojects</strong></p>
        <p><strong>Service Report for Ticket ID: {ticketId}</strong></p>
      </header>

      {/* Ticket Images Section */}
      {ticketImages.length > 0 && (
        <div className="ticket-images">
          <h3>Ticket Images</h3>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "20px" }}>
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

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>SR No</label>
            <input type="text" name="srNo" value={formData.srNo} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Customer Name</label>
            <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Installation Site Address</label>
            <textarea name="installationAddress" rows="2" value={formData.installationAddress} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Customer Site ID</label>
            <input type="text" name="siteId" value={formData.siteId} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Date of Commissioning</label>
            <input type="date" name="commissioningDate" value={formData.commissioningDate} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Instance ID</label>
            <input type="text" name="instanceId" value={formData.instanceId} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>State</label>
            <input type="text" name="state" value={formData.state} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Rating (KVA/HP)</label>
            <input type="text" name="rating" value={formData.rating} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Engine Model</label>
            <input type="text" name="engineModel" value={formData.engineModel} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Engine Serial Number</label>
            <input type="text" name="engineSerial" value={formData.engineSerial} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Genset Serial Number</label>
            <input type="text" name="gensetSerial" value={formData.gensetSerial} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Total Running Hours</label>
            <input type="text" name="runningHours" value={formData.runningHours} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Task Start Date/Time</label>
            <input type="datetime-local" name="taskStart" value={formData.taskStart} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Task End Date/Time</label>
            <input type="datetime-local" name="taskEnd" value={formData.taskEnd} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Problem Summary</label>
            <textarea name="problemSummary" rows="2" value={formData.problemSummary} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Nature of Failure</label>
            <input type="text" name="natureOfFailure" value={formData.natureOfFailure} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Checklist/Action Taken</label>
            <textarea name="checklist" rows="4" value={formData.checklist} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Engineer Remarks</label>
            <textarea name="engineerRemarks" rows="3" value={formData.engineerRemarks} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Customer Remarks</label>
            <textarea name="customerRemarks" rows="3" value={formData.customerRemarks} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Engineer Name</label>
            <input type="text" name="engineerName" value={formData.engineerName} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Customer Contact Number</label>
            <input type="text" name="customerContact" value={formData.customerContact} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Customer Email</label>
            <input type="email" name="customerEmail" value={formData.customerEmail} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Upload Customer Signature</label>
            <input type="file" name="customerSignature" accept="image/*" onChange={handleFileChange} />
          </div>
          <div className="form-group">
            <label>Upload Engineer Signature</label>
            <input type="file" name="engineerSignature" accept="image/*" onChange={handleFileChange} />
          </div>
          <div className="form-group">
            <label>Upload Work Completion Photos</label>
            <input type="file" name="workPhotos" accept="image/*" multiple onChange={handleFileChange} />
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

export default GeneratorServiceReport;
