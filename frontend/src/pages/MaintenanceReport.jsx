import React from "react";
import { Link } from "react-router-dom";
import "../index.css"; // Assuming you're already using index.css

const MaintenanceReport = () => {
  return (
    <div className="report-container">
      <header className="header">
        <div className="logo">
          <Link to="/">
            <img
              src="https://github.com/ShaivyaaSharma/GITHUB/blob/main/logo.png?raw=true"
              alt="Logo"
              className="logo-image"
            />
          </Link>
        </div>
        <h2>BREAK DOWN MAINTENANCE CUM CORRECTIVE ACTION REPORT</h2>
      </header>

      <form id="breakdownForm">
        <label>Unit:</label>
        <input type="text" name="unit" />

        <label>Outage Date:</label>
        <input type="date" name="outage_date" />

        <label>Time:</label>
        <input type="time" name="outage_time" />

        <label>Defect/Problem Reported:</label>
        <textarea name="defect_reported" rows="3" />

        <label>Outcome of Investigation:</label>
        <textarea name="investigation_outcome" rows="3" />

        <label>Corrective Action Taken:</label>
        <textarea name="corrective_action" rows="3" />

        <label>Any Follow-up to be Carried Out:</label>
        <textarea name="follow_up" rows="2" />

        <label>Replacement / Repair Cost:</label>
        <input type="text" name="repair_cost" />

        <label>Remarks:</label>
        <textarea name="remarks" rows="2" />

        <label>Loss of Generation:</label>
        <input type="text" name="generation_loss" />

        <div className="signatures">
          <div className="signature-block">
            <label>Sign. of HOD:</label>
            <input type="text" name="hod_sign" />
          </div>
          <div className="signature-block">
            <label>Plant Incharge:</label>
            <input type="text" name="plant_incharge_sign" />
          </div>
        </div>

        <div className="signatures">
          <div className="signature-block">
            <label>Prepared by:</label>
            <input type="text" value="ASHISH S. TOMAR" readOnly />
          </div>
          <div className="signature-block">
            <label>Checked by:</label>
            <input type="text" value="NEERAJ KAMBOJ" readOnly />
          </div>
          <div className="signature-block">
            <label>Approved by:</label>
            <input type="text" value="JASWINDER S CHAUHAN" readOnly />
          </div>
        </div>

        <button type="submit">Submit Report</button>
      </form>
    </div>
  );
};

export default MaintenanceReport;
