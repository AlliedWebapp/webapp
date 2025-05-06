//form of continual improvemment report//
import React, { useState, useEffect } from "react";
import "../index.css";
import BackButton from "../components/BackButton";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_BASE_URL;

const ImprovementReport = () => {
  const { ticketId } = useParams();
  const { user } = useSelector((state) => state.auth);

  const [previewImage, setPreviewImage] = useState(null);
  const [ticketImages, setTicketImages] = useState([]);

  const [formData, setFormData] = useState({
    number: "",
    department: "",
    equipment_no: "",
    equipment_system: "",
    location: "",
    objectives: "",
    concept_date: "",
    implementation_date: "",
    present_condition: "",
    modification: "",
    resources: "",
    mandays: "",
    cost: "",
    payback: "",
    end_result: "",
    additional_info: "",
  });

  const [hodSign, setHodSign] = useState(null);
  const [plantSign, setPlantSign] = useState(null);

useEffect(() => {
  async function fetchTicketImages() {
    try {
      const res = await fetch(
        `${API_URL}/api/tickets/${ticketId}/images`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      if (!res.ok) {
        setTicketImages([]);
        return;
      }
      const data = await res.json(); // { images: [ { contentType, data:{type:'Buffer',data:[…]} }, … ] }

      // Convert each image‐object into a data‐URI string:
      const urls = (data.images || []).map(imgObj => {
        const byteArray = imgObj.data.data;         // Array of bytes
        let binary = "";                           
        byteArray.forEach(b => binary += String.fromCharCode(b));
        const b64 = window.btoa(binary);          // base64‐encode
        return `data:${imgObj.contentType};base64,${b64}`;
      });

      setTicketImages(urls);
    } catch (err) {
      console.error("Error fetching ticket images:", err);
      setTicketImages([]);
    }
  }

  fetchTicketImages();
}, [ticketId, user.token]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "hodSign") setHodSign(files[0]);
    if (name === "plantSign") setPlantSign(files[0]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        data.append(key, value);
      }
    });

    if (hodSign) data.append("hodSign", hodSign);
    if (plantSign) data.append("plantSign", plantSign);
  
    // Debug logging
    console.log("Form Data:", Object.fromEntries(data));
  
    try {
      const response = await fetch(`${API_URL}/api/reports/submit-improvement-report`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${user.token}`
        },
        body: data,
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log("Success Response:", result);
        alert("Improvement Report submitted successfully!");
        window.location.href = "/view-improvement-reports"; // Redirect to view page
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
        <h2>Continual Improvement Report</h2>
        <p><strong>Allied Hydroprojects</strong></p>
      </header>




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
            <label>No.</label>
            <input type="text" name="number" value={formData.number} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Department</label>
            <input type="text" name="department" value={formData.department} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Equipment/Structure No</label>
            <input type="text" name="equipment_no" value={formData.equipment_no} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Equipment/System</label>
            <input type="text" name="equipment_system" value={formData.equipment_system} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Objectives</label>
            <textarea name="objectives" rows="3" value={formData.objectives} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Concept Date</label>
            <input type="date" name="concept_date" value={formData.concept_date} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Implementation Date</label>
            <input type="date" name="implementation_date" value={formData.implementation_date} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Present Condition</label>
            <textarea name="present_condition" rows="3" value={formData.present_condition} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Modification Carried Out</label>
            <textarea name="modification" rows="3" value={formData.modification} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Resources Used</label>
            <input type="text" name="resources" value={formData.resources} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Man-Days Required</label>
            <input type="text" name="mandays" value={formData.mandays} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Cost</label>
            <input type="text" name="cost" value={formData.cost} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Payback Period</label>
            <input type="text" name="payback" value={formData.payback} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>End Result</label>
            <textarea name="end_result" rows="3" value={formData.end_result} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Additional Information</label>
            <textarea name="additional_info" rows="2" value={formData.additional_info} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Upload HOD Signature</label>
            <input type="file" name="hodSign" accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="form-group">
            <label>Upload Plant Incharge Signature</label>
            <input type="file" name="plantSign" accept="image/*" onChange={handleFileChange} />
          </div>
        </div>

        <button type="submit" className="submit-btn">Submit Report</button>
      </form>

    


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

export default ImprovementReport;
