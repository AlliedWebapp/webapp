import React from 'react';
import { Link } from 'react-router-dom';

const ImprovementReport = () => {
  return (
    <div className="improvement-report">
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
        <div className="form-group">
          <label>No.:</label>
          <input type="text" name="number" />
        </div>

        <div className="form-group">
          <label>Department:</label>
          <input type="text" name="department" />
        </div>

        <div className="form-group">
          <label>Equipment/Structure No:</label>
          <input type="text" name="equipment_no" />
        </div>

        <div className="form-group">
          <label>Equipment/Structure/System:</label>
          <input type="text" name="equipment_system" />
        </div>

        <div className="form-group">
          <label>Location:</label>
          <input type="text" name="location" />
        </div>

        <div className="form-group">
          <label>Objectives:</label>
          <textarea name="objectives" rows="3" />
        </div>

        <div className="form-group">
          <label>Concept Date:</label>
          <input type="date" name="concept_date" />
        </div>

        <div className="form-group">
          <label>Implementation Date:</label>
          <input type="date" name="implementation_date" />
        </div>

        <div className="form-group">
          <label>Present Condition:</label>
          <textarea name="present_condition" rows="3" />
        </div>

        <div className="form-group">
          <label>Modification Carried Out:</label>
          <textarea name="modification" rows="3" />
        </div>

        <div className="form-group">
          <label>Manpower / Materials Utilization:</label>
          <textarea name="resources" rows="3" />
        </div>

        <div className="form-group">
          <label>No. of Man Days Involved:</label>
          <input type="text" name="mandays" />
        </div>

        <div className="form-group">
          <label>Cost Involved:</label>
          <input type="text" name="cost" />
        </div>

        <div className="form-group">
          <label>Payback Period:</label>
          <input type="text" name="payback" />
        </div>

        <div className="form-group">
          <label>End Result:</label>
          <textarea name="end_result" rows="3" />
        </div>

        <div className="form-group">
          <label>Additional Information if Any:</label>
          <textarea name="additional_info" rows="3" />
        </div>

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

        <div className="form-group">
          <button type="submit" className="submit-btn">Submit Report</button>
        </div>
      </form>
    </div>
  );
};

export default ImprovementReport;
