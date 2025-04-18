// form of BREAK DOWN MAINTENANCE CUM CORRECTIVE ACTION REPORT//
import React from "react";
import { Link } from "react-router-dom";

const MaintenanceReport = () => {
  return (
    <div className="maintenance-report">
      <header className="header">
        <h2>BREAK DOWN MAINTENANCE CUM CORRECTIVE ACTION REPORT</h2>
      </header>

      <form id="breakdownForm">
        <div className="form-group">
          <label>Unit:</label>
          <input type="text" name="unit" />
        </div>

        <div className="form-group">
          <label>Outage Date:</label>
          <input type="date" name="outage_date" />
        </div>

        <div className="form-group">
          <label>Time:</label>
          <input type="time" name="outage_time" />
        </div>

        <div className="form-group">
          <label>Defect/Problem Reported:</label>
          <textarea name="defect_reported" rows="3" />
        </div>

        <div className="form-group">
          <label>Outcome of Investigation:</label>
          <textarea name="investigation_outcome" rows="3" />
        </div>

        <div className="form-group">
          <label>Corrective Action Taken:</label>
          <textarea name="corrective_action" rows="3" />
        </div>

        <div className="form-group">
          <label>Any Follow-up to be Carried Out:</label>
          <textarea name="follow_up" rows="2" />
        </div>

        <div className="form-group">
          <label>Replacement / Repair Cost:</label>
          <input type="text" name="repair_cost" />
        </div>

        <div className="form-group">
          <label>Remarks:</label>
          <textarea name="remarks" rows="2" />
        </div>

        <div className="form-group">
          <label>Loss of Generation:</label>
          <input type="text" name="generation_loss" />
        </div>

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

        <div className="form-group">
          <button type="submit" className="submit-btn">Submit Report</button>
        </div>
      </form>
    </div>
  );
};

export default MaintenanceReport;
