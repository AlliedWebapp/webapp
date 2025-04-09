import React from "react";
import { Link } from "react-router-dom";
import "../index.css"; // Reuse global styles

const GeneratorServiceReport = () => {
  return (
    <div className="report-container">
      {/* Header with logo and title */}
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
      </header>

      <form>
        {/* ========== Basic Information Section ========== */}
        <div className="section-title">Basic Information</div>
        <label>SR No</label>
        <input type="text" />

        <label>Customer Name</label>
        <input type="text" />

        <label>Installation Site Address</label>
        <textarea rows="2" />

        <label>Customer Site ID</label>
        <input type="text" />

        <label>Date of Commissioning</label>
        <input type="date" />

        <label>Instance ID</label>
        <input type="text" />

        <label>State</label>
        <input type="text" />

        <label>Rating (KVA/HP)</label>
        <input type="text" />

        {/* ========== Technical Details Section ========== */}
        <div className="section-title">Technical Details</div>
        <label>Engine Model</label>
        <input type="text" />

        <label>Engine Serial Number</label>
        <input type="text" />

        <label>Genset Serial Number</label>
        <input type="text" />

        <label>Total Running Hours</label>
        <input type="text" />

        <label>Task Start Date/Time</label>
        <input type="datetime-local" />

        <label>Task End Date/Time</label>
        <input type="datetime-local" />

        <label>Problem Summary</label>
        <textarea rows="2" />

        <label>Nature of Failure</label>
        <input type="text" />

        <label>Checklist/Action Taken</label>
        <textarea
          rows="4"
          placeholder="E.g., Oil changed, air filter cleaned, diagnostics checked..."
        />

        <label>Engineer Remarks</label>
        <textarea rows="3" />

        <label>Customer Remarks</label>
        <textarea rows="3" />

        {/* ========== Contact Section ========== */}
        <div className="section-title">Contact</div>
        <label>Engineer Name</label>
        <input type="text" />

        <label>Customer Contact Number</label>
        <input type="text" />

        <label>Customer Email</label>
        <input type="email" />

        {/* ========== Uploads Section ========== */}
        <div className="section-title">Photos & Signatures (Optional)</div>
        <label>Upload Customer Signature</label>
        <input type="file" accept="image/*" />

        <label>Upload Engineer Signature</label>
        <input type="file" accept="image/*" />

        <label>Upload Work Completion Photos</label>
        <input type="file" accept="image/*" multiple />

        <button type="submit">Submit Report</button>
      </form>
    </div>
  );
};

export default GeneratorServiceReport;
