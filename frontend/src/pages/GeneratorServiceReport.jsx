import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import "../index.css";

const GeneratorServiceReport = () => {
  const { ticketId } = useParams();

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

    const data = new FormData();
    data.append("ticketId", ticketId);

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

  useEffect(() => {
    const fetchSpareOptions = async () => {
      try {
        const res = await fetch(`https://backend-services-theta.vercel.app/api/tickets/getProjectByTicketId/${ticketId}`);
        const { project } = await res.json();

        const collection = project?.toLowerCase();
        const field = collectionToFieldMapping[collection];
        setSpareField(field);

        if (!field) {
          console.warn("No mapping for project:", project);
          return;
        }

        const spareRes = await fetch(`https://backend-services-theta.vercel.app/api/inventory/${project}`);
        const spares = await spareRes.json();
        setSpareOptions(spares);
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
          {/* Other form fields... */}

          <div className="form-group">
            <label>Spare Used</label>
            <select name="spareused" value={formData.spareused} onChange={handleChange}>
              <option value="">Select Spare</option>
              {spareOptions.map((item, index) => (
                <option key={index} value={item[spareField]}>
                  {item[spareField]} — {item.SparesCount} pcs
                </option>
              ))}
            </select>
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
