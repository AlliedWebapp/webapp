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
  console.log("User state:", user);

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

  return (
    <div className="generator-service-report">
      <BackButton url="/tickets" className="back-button" />
      <header className="header">
        <h2>Service Report</h2>
        <p><strong>Allied Hydroprojects</strong></p>
        <p><strong>Service Report for Ticket ID: {ticketId}</strong></p>
      </header>

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

    </div>
  );
};

export default GeneratorServiceReport;