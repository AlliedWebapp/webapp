import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ImprovementReports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('/api/improvement-reports');
        setReports(response.data);
      } catch (error) {
        console.error('Error fetching improvement reports:', error);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="improvement-reports">
      {reports.length > 0 ? (
        reports.map((report) => (
          <div className="ticket" key={report._id}>
            <div data-label="Report ID">{report.reportId}</div>
            <div data-label="Date">{new Date(report.createdAt).toLocaleDateString()}</div>
            <div data-label="Project">{report.projectName}</div>
            <div data-label="Status">{report.status}</div>
            <div>
              <button
                className="btn btn-sm btn-outline"
                onClick={() => navigate(`/improvement-reports/${report._id}`)}
              >
                View
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="no-reports">
          <p>No improvement reports found. Please create a new report.</p>
        </div>
      )}
    </div>
  );
};

export default ImprovementReports; 