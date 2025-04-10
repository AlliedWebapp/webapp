import React from 'react';
import { Link } from 'react-router-dom';

const ImprovementReport = () => {
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
        <h2>CONTINUAL IMPROVEMENT REPORT</h2>
      </header>

      <form id="improvementForm">
        <label>No.:</label>
        <input type="text" name="number" />

        <label>Department:</label>
        <input type="taext" name="department" />

        <label>Equipment/Structure No:</label>
        <input type="text" name="equipment_no" />

        <label>Equipment/Structure/System:</label>
        <input type="text" name="equipment_system" />

        <label>Location:</label>
        <input type="text" name="location" />

        <label>Objectives:</label>
        <textarea name="objectives" rows="3" />

        <label>Concept Date:</label>
        <input type="date" name="concept_date" />

        <label>Implementation Date:</label>
        <input type="date" name="implementation_date" />

        <label>Present Condition:</label>
        <textarea name="present_condition" rows="3" />

        <label>Modification Carried Out:</label>
        <textarea name="modification" rows="3" />

        <label>Manpower / Materials Utilization:</label>
        <textarea name="resources" rows="3" />

        <label>No. of Man Days Involved:</label>
        <input type="text" name="mandays" />

        <label>Cost Involved:</label>
        <input type="text" name="cost" />

        <label>Payback Period:</label>
        <input type="text" name="payback" />

        <label>End Result:</label>
        <textarea name="end_result" rows="3" />

        <label>Additional Information if Any:</label>
        <textarea name="additional_info" rows="3" />

        <div className="signatures">
          <div className="signature-block">
            <label>Sign of HOD:</label>
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

export default ImprovementReport;
