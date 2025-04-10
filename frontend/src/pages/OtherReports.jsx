// src/pages/OtherReports.jsx

import React from "react";
import { Link } from "react-router-dom";
import "../index.css";

const OtherReports = () => {
  return (
    <div className="report-container">
      <h2 className="section-title">View Other Reports</h2>
      <div className="button-container">
        <Link to="/maintenance-report" className="report-button">
          Break Down Maintenance Cum Corrective Action Report
        </Link>
        <Link to="/improvement-report" className="report-button">
          Continual Improvement Report
        </Link>
      </div>
    </div>
  );
};

export default OtherReports;
