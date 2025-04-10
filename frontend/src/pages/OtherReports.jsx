import React from "react";
import { Link } from "react-router-dom";
import "../index.css"; // Reusing global styles

const OtherReports = () => {
  return (
    <div className="report-container">
      <header className="header center-header">
        <h2 className="other-reports-heading">Other Reports</h2>
        <p className="other-reports-subheading">
          Select the report
        </p>
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
