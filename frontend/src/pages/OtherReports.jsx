import React from "react";
import { Link } from "react-router-dom";
import "../index.css"; // Reusing global styles

const OtherReports = () => {
  return (
    <div className="report-container">
      <header className="header">
        <h2>Other Reports</h2>
        <p>Select the report you want to view or fill</p>
      </header>

      <div className="button-wrapper">
        <Link to="/improvement-report" className="report-button">
          Continual Improvement Report
        </Link>
        <Link to="/maintenance-report" className="report-button">
          Breakdown Maintenance Cum Corrective Action Report
        </Link>
      </div>
    </div>
  );
};

export default OtherReports;
