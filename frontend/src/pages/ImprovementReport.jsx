//form of continual improvemment report//
import React, { useState } from "react";
import "../index.css";
import BackButton from "../components/BackButton";
import { useSelector } from "react-redux";

const API_URL = process.env.REACT_APP_API_BASE_URL;

const ImprovementReport = () => {
  const { user } = useSelector((state) => state.auth);
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
    </div>
  );
};

export default ImprovementReport;
