import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import "../index.css"; // Global styles
import axios from "axios";
import { useSelector } from "react-redux";

const GeneratorServiceReport = () => {
  const { ticketId } = useParams();
  const { user } = useSelector((state) => state.auth);
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
  const [projectName, setProjectName] = useState("");
  // Mapping of project names to their field names
  const projectFieldMapping = {
    'jogini': {
      description: 'Spare Discription'
    },
    'solding': {
      description: 'Description of Material'
    },
    'sdllpsalun': {
      description: 'NAME OF MATERIALS'
    },
    'sdllp salun': {
      description: 'NAME OF MATERIALS'
    },
    'kuwarsi': {
      description: 'NAME OF MATERIALS'
    },
    'kuwarsi-ii': {
      description: 'NAME OF MATERIALS'
    },
    'jhp kuwarsi-ii': {
      description: 'NAME OF MATERIALS'
    },
    'shong': {
      description: 'Description of Material'
    }
  };

  const [isLoading, setIsLoading] = useState(true);
  const [reportExists, setReportExists] = useState(false);

  // Handle change in form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  
    if (name === "spareused" && value) {
      const decrementSpareCount = async () => {
        try {
          if (!user || !user.token) {
            console.error('No authentication token found. Please log in.');
            return;
          }
  
          const projectMapping = projectFieldMapping[projectName];
          if (!projectMapping) {
            console.error('Project mapping not found for:', projectName);
            return;
          }
  
          const descriptionField = projectMapping.description;
  
          const response = await axios.patch(
            `https://backend-services-theta.vercel.app/api/inventory/update-spare-count`,
            {
              projectName: projectName,
              descriptionField: descriptionField,
              spareName: value,
              action: "decrement",
            },
            {
              headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json',
              }
            }
          );
  
          if (response.data.success) {
            console.log('Spare count decremented successfully.');
          } else {
            console.error('Failed to decrement spare count:', response.data.message);
            alert('Failed to update spare count. Please try again.');
          }
        } catch (err) {
          console.error('Error decrementing spare count:', err);
          alert('Error updating spare count. Please try again.');
        }
      };
  
      decrementSpareCount(); // <-- call the helper function
    }
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

    if (!user || !user.token) {
      alert("Please log in to submit the report.");
      return;
    }

    const data = new FormData();
    data.append("ticketId", ticketId);

    // Append form data
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "workPhotos") {
        value.forEach((file) => data.append("workPhotos", file));
      } else if (value !== null && value !== undefined) {
        data.append(key, value);
      }
    });

    try {
      const response = await fetch("https://backend-services-theta.vercel.app/api/reports/submit-fsr", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${user.token}`
        },
        body: data,
      });

      const responseData = await response.json();

      if (response.ok) {
        alert("Report submitted successfully!");
        window.location.href = "/tickets";
      } else {
        if (responseData.error && responseData.error.includes("already been submitted")) {
          alert("A service report has already been submitted for this ticket. Only one service report is allowed per ticket.");
          window.location.href = "/tickets";
        } else {
          console.error("Submit failed:", responseData);
          alert(responseData.message || "Failed to submit. Please try again.");
        }
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert(err.message || "Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    const checkIfReportExistsAndFetchSpareOptions = async () => {
      try {
        // Ensure user and token are available
        if (!user || !user.token) {
          console.error('No authentication token found. Please log in.');
          return;
        }

        if (!ticketId) {
          console.error('No ticket ID provided');
          alert('No ticket ID provided. Please try again.');
          window.location.href = '/tickets';
          return;
        }

        // Check if the report already exists
        const reportRes = await fetch(`https://backend-services-theta.vercel.app/api/reports/fsr/check/${ticketId}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!reportRes.ok) {
          const errorData = await reportRes.json();
          throw new Error(errorData.message || 'Failed to check existing service report');
        }

        const reportData = await reportRes.json();

        if (reportData.exists) {
          alert('A Generator Service Report has already been submitted for this ticket.');
          window.location.href = '/tickets';
          return;
        }

        // If no report exists, proceed to fetch the spare options
        const spareRes = await fetch(`https://backend-services-theta.vercel.app/api/tickets/${ticketId}/spare-description`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!spareRes.ok) {
          let errorData;
          try {
            errorData = await spareRes.json();
          } catch (e) {
            errorData = { msg: 'Unknown error occurred', error: await spareRes.text() };
          }
          
          console.error('Failed to fetch spare options:', {
            status: spareRes.status,
            statusText: spareRes.statusText,
            ...errorData,
          });
          
          alert(`Error loading spare options: ${errorData.msg}\n${errorData.error || ''}`);
          return;
        }

        const spareDescriptions = await spareRes.json();
        if (spareDescriptions.success && Array.isArray(spareDescriptions.data)) {
          setSpareOptions(spareDescriptions.data);
        } else {
          console.error('Invalid response format:', spareDescriptions);
          alert('Invalid response format from server');
        }
      } catch (err) {
        console.error('Error:', err.message || err);
        alert('Something went wrong. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (ticketId && user) {
      setIsLoading(true);
      checkIfReportExistsAndFetchSpareOptions();
    }
  }, [ticketId, user]);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

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
        {spareOptions.map((spare) => {
          const fields = projectFieldMapping[projectName] || projectFieldMapping['jogini'];
          const description = spare[fields.description] || spare['NAME OF MATERIALS'] || 'Unknown';
          const spareCount = spare.SparesCount || 0;
          console.log('Spare item:', spare); // Debug log
          console.log('Description field:', fields.description); // Debug log
          console.log('Description value:', description); // Debug log
          
          return (
            <option key={spare._id} value={description}>
              {description} (Available: {spareCount})
            </option>
          );
        })}
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
