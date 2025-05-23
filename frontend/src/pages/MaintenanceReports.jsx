import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MaintenanceReports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // Fetch reports from the backend
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/maintenance-reports');
      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  return (
    <div className="maintenance-reports">
      {reports.length > 0 ? (
        reports.map((report) => (
          <div className="ticket" key={report._id}>
            <div data-label="Report ID">{report.reportId}</div>
            <div data-label="Date">{new Date(report.createdAt).toLocaleDateString()}</div>
            <div data-label="Equipment">{report.equipmentName}</div>
            <div data-label="Status">{report.status}</div>
            <div>
              <button
                className="btn btn-sm btn-outline"
                onClick={() => navigate(`/maintenance-reports/${report._id}`)}
              >
                View
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="no-reports">
          <p>No maintenance reports found. Please create a new report.</p>
        </div>
      )}
    </div>
  );
};

export default MaintenanceReports; 