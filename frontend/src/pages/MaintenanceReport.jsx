// form of BREAK DOWN MAINTENANCE CUM CORRECTIVE ACTION REPORT//
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "../index.css";

const MaintenanceReport = () => {
  const { ticketId } = useParams();

  const [formData, setFormData] = useState({
    unit: "",
    outage_date: "",
    outage_time: "",
    defect_reported: "",
    investigation_outcome: "",
    corrective_action: "",
    follow_up: "",
    repair_cost: "",
    remarks: "",
    generation_loss: "",
    hod_sign: "",
    plant_incharge_sign: "",
    hod_sign_photo: null,  // For HOD Signature Photo
    plant_incharge_sign_photo: null,  // For Plant Incharge Signature Photo
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: Array.from(files) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("ticketId", ticketId);

    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((file) => data.append(key, file));
      } else {
        data.append(key, value);
      }
    });

    try {
      const response = await fetch("https://backend-services-theta.vercel.app/api/reports/submit-maintenance-report", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        alert("Maintenance Report submitted successfully!");
      } else {
        const errorData = await response.json();
        console.error("Submission failed:", errorData);
        alert("Failed to submit. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="maintenance-report">
      <header className="header">
        <h2>BREAK DOWN MAINTENANCE CUM CORRECTIVE ACTION REPORT</h2>
        <p><strong>Service Report for Ticket ID: {ticketId}</strong></p>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Unit:</label>
            <input type="text" name="unit" value={formData.unit} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Outage Date:</label>
            <input type="date" name="outage_date" value={formData.outage_date} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Time:</label>
            <input type="time" name="outage_time" value={formData.outage_time} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Defect/Problem Reported:</label>
            <textarea name="defect_reported" rows="3" value={formData.defect_reported} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Outcome of Investigation:</label>
            <textarea name="investigation_outcome" rows="3" value={formData.investigation_outcome} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Corrective Action Taken:</label>
            <textarea name="corrective_action" rows="3" value={formData.corrective_action} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Any Follow-up to be Carried Out:</label>
            <textarea name="follow_up" rows="2" value={formData.follow_up} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Replacement / Repair Cost:</label>
            <input type="text" name="repair_cost" value={formData.repair_cost} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Remarks:</label>
            <textarea name="remarks" rows="2" value={formData.remarks} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Loss of Generation:</label>
            <input type="text" name="generation_loss" value={formData.generation_loss} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Upload HOD Signature Photo:</label>
            <input type="file" name="hod_sign_photo" accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="form-group">
            <label>Upload Plant Incharge Signature Photo:</label>
            <input type="file" name="plant_incharge_sign_photo" accept="image/*" onChange={handleFileChange} />
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
    </div>
  );
};

export default MaintenanceReport;
