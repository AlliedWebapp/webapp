import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import "../index.css"; // Global styles
import axios from "axios";
import { useSelector } from "react-redux";


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Map your project keys (lowercased) → the field name that holds the description
const projectFieldMapping = {
  jogini:        { description: "Spare Discription" },
  solding:       { description: "Description of Material" },
  sdllpsalun:    { description: "NAME OF MATERIALS" },
  "sdllp salun": { description: "NAME OF MATERIALS" },
  kuwarsi:       { description: "NAME OF MATERIALS" },
  "kuwarsi-ii":  { description: "NAME OF MATERIALS" },
  "jhp kuwarsi-ii": { description: "NAME OF MATERIALS" },
  shong:         { description: "Description of Material" },
};

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
  const [isLoading, setIsLoading] = useState(true);
  const [previousSpare, setPreviousSpare] = useState(null);

   // Which inventory collection are we talking to?
   const collectionName = localStorage.getItem("selectedCollection") || "";
   const projectKey = collectionName.toLowerCase();

 // decrement or increment by calling your shared endpoint
 const updateSpareCount = async (id, delta) => {
  try {
    const token = user?.token || JSON.parse(localStorage.getItem("user"))?.token;
    if (!token) throw new Error("No auth token");

    const res = await axios.put(
      `${API_BASE_URL}/api/update-spare-count`,
      { collectionName, id, increment: delta },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.data.success) {
      throw new Error(res.data.message || "Unknown error");
    }
    console.log("Updated spareCount:", res.data.spareCount);
  } catch (err) {
    console.error("Error updating spare count:", err);
    alert("Could not update spare count. Please try again.");
  }
};


  // Handle change in form fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "spareused") {
      // give back the old one
      if (previousSpare) updateSpareCount(previousSpare, +1);
      // take one of the new one
      if (value)         updateSpareCount(value, -1);
      setPreviousSpare(value);
    }

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
    if (!user?.token) {
      alert("Please log in to submit the report.");
      return;
    }

    const data = new FormData();
    data.append("ticketId", ticketId);
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "workPhotos") {
        value.forEach((file) => data.append("workPhotos", file));
      } else if (value != null) {
        data.append(key, value);
      }
    });

    try {
      const res = await fetch(`${API_BASE_URL}/api/reports/submit-fsr`, {
        method: "POST",
        headers: { Authorization: `Bearer ${user.token}` },
        body: data,
      });
      const json = await res.json();
      if (res.ok) {
        alert("Report submitted successfully!");
        window.location.href = "/tickets";
      } else {
        throw new Error(json.message || json.error || "Submit failed");
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  useEffect(() => {
    const load = async () => {
      if (!user?.token || !ticketId) return;
      try {
        // 1) prevent double-submits
        let r = await fetch(
          `${API_BASE_URL}/api/reports/fsr/check/${ticketId}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        let jr = await r.json();
        if (jr.exists) {
          alert("A report has already been submitted for this ticket.");
          return void (window.location.href = "/tickets");
        }

        // 2) fetch the spare descriptions
        let s = await fetch(
          `${API_BASE_URL}/api/tickets/${ticketId}/spare-description`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        let js = await s.json();
        if (js.success && Array.isArray(js.data)) {
          setSpareOptions(js.data);
        } else {
          throw new Error(js.message || "Invalid spare data");
        }
      } catch (err) {
        console.error(err);
        alert("Error loading form data.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
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
         const descField = projectFieldMapping[projectKey]?.description
         || "Spare Discription";
const description = spare[descField] || spare["NAME OF MATERIALS"] || "Unknown";
const spareCount  = spare.spareCount || 0;
return (
<option key={spare._id} value={spare._id}>
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
