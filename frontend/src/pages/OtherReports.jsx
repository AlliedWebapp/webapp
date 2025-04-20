//view other report list//
import React from "react";
import { Link } from "react-router-dom";
import "../index.css"; // Reusing global styles

const OtherReports = () => {
    return (
      <div className="report-container">
        <div className="other-reports-header">
          <h2 className="other-reports-heading">Other Reports</h2>
          <p className="other-reports-subheading">
            Select the report you want to submit
          </p>
        </div>
  
        <div className="button-wrapper">
          <Link to="/improvement-report" className="report-button">
            CONTINUAL IMPROVEMENT REPORT
          </Link>
          <Link to="/maintenance-report" className="report-button">
            BREAK DOWN MAINTENANCE CUM CORRECTIVE ACTION REPORT
          </Link>
        </div>
     {/* New Section for Viewing Reports */}
  <div className="view-reports-header">
    <p className="view-reports-subheading">
      Select the report you want to view
    </p>
  </div>
  <div className="button-wrapper">
    <Link to="/view-improvement-reports" className="report-button">
      VIEW CONTINUAL IMPROVEMENT REPORT
    </Link>
    <Link to="/view-maintenance-reports" className="report-button">
      VIEW BREAK DOWN MAINTENANCE CUM CORRECTIVE ACTION REPORT
    </Link>
  </div>
</div>
    );
  };
  export default OtherReports;
  