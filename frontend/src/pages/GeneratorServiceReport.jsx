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
    recommendations: "",
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

    // Disable submit button to prevent double submission
    const submitButton = e.target.querySelector('.submit-btn');
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
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

      // Add ticketId to the form data
      submitData.append("ticketId", ticketId);

      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(`${API_URL}/api/reports/submit-fsr`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${user.token}`
        },
        body: submitData,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Verify we got a valid response with fsrId
      if (!data.fsrId) {
        throw new Error("Invalid response: Missing FSR ID");
      }

      console.log("FSR submitted successfully with ID:", data.fsrId);

      // Send email notification (don't block on this)
      try {
        const emailData = new FormData();
        emailData.append("_subject", `New Service Report Submitted`);
        
        const details = `Service Report Details:
 
        FSR ID: ${data.fsrId}
Project Name: ${formData.customerName}
Instance ID: ${formData.instanceId}
Engineer Name: ${formData.engineerName}
Problem Summary: ${formData.problemSummary}
Task Start: ${formData.taskStart}
Task End: ${formData.taskEnd}
Customer Email: ${formData.customerEmail}
Created By: ${user.email}`;

        emailData.append("Details", details);
        emailData.append("_captcha", "false");

        // Don't await this - let it run in background
        fetch("https://formsubmit.co/alliedvercel@gmail.com", {
          method: "POST",
          body: emailData,
          headers: {
            'Accept': 'application/json'
          }
        }).catch(emailError => {
          console.warn("Email notification failed:", emailError);
          // Don't fail the whole submission for email issues
        });
      } catch (emailError) {
        console.warn("Email notification error:", emailError);
        // Continue with success flow even if email fails
      }

      alert(`Report submitted successfully! FSR ID: ${data.fsrId}`);
      
      // Add a small delay before redirect to ensure user sees the success message
      setTimeout(() => {
        window.location.href = "/fsr";
      }, 1000);

    } catch (error) {
      console.error("Error submitting FSR:", error);
      
      let errorMessage = "Failed to submit report. Please try again.";
      
      if (error.name === 'AbortError') {
        errorMessage = "Request timed out. Please check your connection and try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
      
      // Re-enable submit button on error
      submitButton.disabled = false;
      submitButton.textContent = 'Submit Report';
    }
  };

  return (
    <div className="generator-service-report">
      <BackButton url="/tickets" className="back-button" />
      <header className="header">
        <h2>Plant Fault Report</h2>
        <p><strong>Allied Hydroprojects</strong></p>
        <p><strong> Report for Ticket ID: {ticketId}</strong></p>
      </header>

      <form onSubmit={handleSubmit}>
  <div className="form-row">
    <div className="form-group">
      <label>Report No.</label>
      <input type="text" name="srNo" value={formData.srNo} onChange={handleChange} />
    </div>
    <div className="form-group">
      <label>Project Name</label>
      <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} />
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
      <label>Unit Rating</label>
      <input type="text" name="rating" value={formData.rating} onChange={handleChange} />
    </div>
    <div className="form-group">
      <label> Model No.</label>
      <input type="text" name="engineModel" value={formData.engineModel} onChange={handleChange} />
    </div>
    <div className="form-group">
      <label>Machine Serial Number</label>
      <input type="text" name="engineSerial" value={formData.engineSerial} onChange={handleChange} />
    </div>
    <div className="form-group">
      <label>Serial Number</label>
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
      <label>Fault Summary</label>
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
      <label>Recommendation for future</label>
      <textarea name="recommendations" rows="3" value={formData.recommendations} onChange={handleChange} />
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
