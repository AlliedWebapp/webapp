import React from "react";
import { Link, useParams } from "react-router-dom";
import "../index.css"; // Global styles

const GeneratorServiceReport = () => {
  const { ticketId } = useParams();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted for ticket ID:", ticketId);
  };

  return (
    <div className="generator-service-report">
      <header className="header">
        <div className="logo">
          <Link to="/">
            <img
              src="https://github.com/ShaivyaaSharma/GITHUB/blob/main/logo.png?raw=true"
              alt="Allied Hydroprojects Logo"
              className="logo-image"
            />
          </Link>
        </div>
        <h2>Generator Service Report</h2>
        <p><strong>Allied Hydroprojects</strong></p>
        <p><strong>Service Report for Ticket ID: {ticketId}</strong></p>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>SR No</label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>Customer Name</label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>Installation Site Address</label>
            <textarea rows="2" />
          </div>
          <div className="form-group">
            <label>Customer Site ID</label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>Date of Commissioning</label>
            <input type="date" />
          </div>
          <div className="form-group">
            <label>Instance ID</label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>State</label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>Rating (KVA/HP)</label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>Engine Model</label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>Engine Serial Number</label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>Genset Serial Number</label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>Total Running Hours</label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>Task Start Date/Time</label>
            <input type="datetime-local" />
          </div>
          <div className="form-group">
            <label>Task End Date/Time</label>
            <input type="datetime-local" />
          </div>
          <div className="form-group">
            <label>Problem Summary</label>
            <textarea rows="2" placeholder="E.g., Oil changed, filter cleaned, diagnostics checked..." />
          </div>
          <div className="form-group">
            <label>Nature of Failure</label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>Checklist/Action Taken</label>
            <textarea rows="4" />
          </div>
          <div className="form-group">
            <label>Engineer Remarks</label>
            <textarea rows="3" />
          </div>
          <div className="form-group">
            <label>Customer Remarks</label>
            <textarea rows="3" />
          </div>
          <div className="form-group">
            <label>Engineer Name</label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>Customer Contact Number</label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>Customer Email</label>
            <input type="email" />
          </div>
          <div className="form-group">
            <label>Upload Customer Signature</label>
            <input type="file" accept="image/*" />
          </div>
          <div className="form-group">
            <label>Upload Engineer Signature</label>
            <input type="file" accept="image/*" />
          </div>
          <div className="form-group">
            <label>Upload Work Completion Photos</label>
            <input type="file" accept="image/*" multiple />
          </div>
        </div>

        <button type="submit" className="submit-btn">Submit Report</button>
      </form>
    </div>
  );
};

export default GeneratorServiceReport;
