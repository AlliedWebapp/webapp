import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import "../index.css"; // Global styles
import axios from "axios";

const GeneratorServiceReport = () => {
  const { ticketId } = useParams();
  console.log("Ticket ID:", ticketId);

  const [formData, setFormData] = useState({
    srNo: "",
    customerName: "",
    installationAddress: "",
    siteId: "",
    commissioningDate: "",
    instanceId: "",
    state: "",
    rating: "",
    engineModel: "",
    engineSerial: "",
    gensetSerial: "",
    runningHours: "",
    taskStart: "",
    taskEnd: "",
    problemSummary: "",
    natureOfFailure: "",
    checklist: "",
    engineerRemarks: "",
    customerRemarks: "",
    engineerName: "",
    customerContact: "",
    customerEmail: "",
    spareused: "",
    customerSignature: null,
    engineerSignature: null,
    workPhotos: [],
  });

  const [spareOptions, setSpareOptions] = useState([]);
  const [spareField, setSpareField] = useState("");

  const collectionToFieldMapping = {
    jogini: "spareDescription",
    solding: "descriptionOfMaterial",
    shong: "descriptionOfMaterial",
    sdllpsalun: "nameOfMaterials",
    kuwarsi: "nameOfMaterials",
  };

  // Handle change in form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file uploads
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "workPhotos") {
      setFormData((prev) => ({ ...prev, [name]: Array.from(files) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("ticketId", ticketId);

    // Append form data
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "workPhotos") {
        value.forEach((file) => data.append("workPhotos", file));
      } else {
        data.append(key, value);
      }
    });

    try {
      const response = await fetch("https://backend-services-theta.vercel.app/api/reports/submit-fsr", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        alert("Report submitted successfully!");
      } else {
        const errorData = await response.json();
        console.error("Submit failed:", errorData);
        alert("Failed to submit. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Something went wrong.");
    }
  };

  // Fetch spare options based on ticketId
  
  // Fetch spare options based on ticketId
  useEffect(() => {
    const fetchSpareOptions = async () => {
      try {
        const res = await fetch(`https://backend-services-theta.vercel.app/api/tickets/${ticketId}/spare-description`);
        if (!res.ok) {
          console.error("Failed to fetch spare options, status:", res.status);
          return;
        }

        const spareDescriptions = await res.json();
        setSpareOptions(spareDescriptions);
      } catch (err) {
        console.error("Error fetching spare options:", err);
      }
    };

    fetchSpareOptions();
  }, [ticketId]);

  return (
    <div className="generator-service-report">
      <BackButton url="/tickets" />
      <header className="header">
        <h2>Generator Service Report</h2>
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
      <label>Spare Used</label>
      <select name="spareused" value={formData.spareused} onChange={handleChange}>
        <option value="">Select a spare part</option>
        {spareOptions.map((spare, index) => (
          <option key={index} value={spare.spareDescription || spare.descriptionOfMaterial || spare.nameOfMaterials}>
            {spare.spareDescription || spare.descriptionOfMaterial || spare.nameOfMaterials}
          </option>
        ))}
      </select>
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
