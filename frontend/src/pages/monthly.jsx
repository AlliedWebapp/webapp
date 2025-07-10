import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BackButton from '../components/BackButton';
import { useSelector } from 'react-redux';
import "../index.css";

const API_URL = process.env.REACT_APP_API_BASE_URL;

const adminEmails = ["bhaskarudit02@gmail.com", "ss@gmail.com"];

const projectList = [
  { name: 'All Projects', value: '' },
  { name: 'Jogini', value: 'Jogini' },
  { name: 'Shong', value: 'Shong' },
  { name: 'Solding', value: 'Solding' },
  { name: 'SDLLPsalun', value: 'SDLLPsalun' },
  { name: 'Kuwarsi', value: 'Kuwarsi' },
];

const monthsList = [
  { name: 'January', value: 1 },
  { name: 'February', value: 2 },
  { name: 'March', value: 3 },
  { name: 'April', value: 4 },
  { name: 'May', value: 5 },
  { name: 'June', value: 6 },
  { name: 'July', value: 7 },
  { name: 'August', value: 8 },
  { name: 'September', value: 9 },
  { name: 'October', value: 10 },
  { name: 'November', value: 11 },
  { name: 'December', value: 12 }
];

// Generate years from 2024 to current year
const yearsList = [];
const currentYear = new Date().getFullYear();
for (let y = 2025; y <= currentYear; y++) {
  yearsList.push(y);
}

const MonthlySummary = () => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [summary, setSummary] = useState(null);
  const [displayList, setDisplayList] = useState('tickets');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { user } = useSelector((state) => state.auth);
  const isAdmin = adminEmails.includes(user?.email);

  useEffect(() => {
    if (!isAdmin) setSelectedProject('');
  }, [isAdmin]);

  useEffect(() => {
    const fetchSummary = async () => {
      if (selectedMonth && selectedYear) {
        setLoading(true);
        setError('');
        let url = `${API_URL}/api/monthly-summary?year=${selectedYear}&month=${selectedMonth}`;
        if (isAdmin && selectedProject) {
          url += `&project=${encodeURIComponent(selectedProject)}`;
        }
        try {
          const res = await axios.get(url, {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          setSummary(res.data);
        } catch (err) {
          if (err.response && err.response.status === 403) {
            setError('Access denied: This user has inventory access only.');
          } else if (err.response && err.response.status === 401) {
            setError('Unauthorized: Please log in again.');
          } else {
            setError(
              err.response?.data?.message ||
              err.response?.data?.error ||
              'Failed to load summary'
            );
          }
          setSummary(null);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchSummary();
  }, [selectedMonth, selectedYear, selectedProject, isAdmin, user.token]);

  return (
    <div className="monthly-summary">
      <BackButton url="/home" />
      <h1 className="monthly-summary__title">Monthly Summary</h1>
      <p className="monthly-summary__subtitle">Choose the year, month{isAdmin ? ', and project' : ''}</p>
      <div className="dropdown-row">
        {isAdmin && (
          <select
            className="dropdown"
            value={selectedProject}
            onChange={e => setSelectedProject(e.target.value)}
          >
            {projectList.map(project => (
              <option key={project.value} value={project.value}>{project.name}</option>
            ))}
          </select>
        )}
        <select
          className="dropdown"
          value={selectedYear}
          onChange={e => setSelectedYear(e.target.value)}
        >
          <option value="">-- Year --</option>
          {yearsList.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <select
          className="dropdown"
          value={selectedMonth}
          onChange={e => setSelectedMonth(e.target.value)}
        >
          <option value="">-- Month --</option>
          {monthsList.map(m => (
            <option key={m.value} value={m.value}>{m.name}</option>
          ))}
        </select>
      </div>

      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error" style={{ color: 'red' }}>{error}</div>}

      {/* Summary Boxes */}
      {summary && !loading && !error && (
        <div className="summary-boxes">
          <div className="summary-box">
            <div className="summary-box-label">Open Tickets</div>
            <div className="summary-box-value">{summary.openTicketsCount ?? 0}</div>
          </div>
          <div className="summary-box">
            <div className="summary-box-label">Closed Tickets</div>
            <div className="summary-box-value">{summary.closedTicketsCount ?? 0}</div>
          </div>
          <div className="summary-box">
            <div className="summary-box-label">FSR Created</div>
            <div className="summary-box-value">{summary.fsrCreatedCount ?? 0}</div>
          </div>
          <div className="summary-box">
          <div className="summary-box-label">Consumables Added</div>
         <div className="summary-box-value">{summary.consumablesCount ?? 0}</div>
       </div>

        </div>
      )}

      {/* No data message */}
      {summary && !loading && !error && summary.openTicketsCount === 0 && summary.closedTicketsCount === 0 && summary.fsrCreatedCount === 0 && (
        <div className="no-data">No data found for this month.</div>
      )}

      {/* Dropdown for List Selection */}
      {summary && !loading && !error && (
        <div className="monthly-summary__select-container" style={{ marginTop: 24 }}>
          <select
            className="dropdown"
            value={displayList}
            onChange={e => setDisplayList(e.target.value)}
          >
            <option value="tickets">Tickets List</option>
            <option value="fsrs">FSR List</option>
            <option value="consumables">Consumables List</option>
          </select>
        </div>
      )}

      {/* Tickets Table */}
      {displayList === "tickets" && summary?.tickets && summary.tickets.length > 0 && (
        <table className="summary-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Project</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {summary.tickets.map(ticket => (
              <tr key={ticket._id}>
                <td>{ticket.ticket_id}</td>
                <td>{ticket.projectname}</td>
                <td>{ticket.status}</td>
                <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* FSR Table */}
      {displayList === "fsrs" && summary?.fsrs && summary.fsrs.length > 0 && (
        <table className="summary-table">
          <thead>
            <tr>
              <th>FSR ID</th>
              <th>Project Name</th>
              <th>Engineer</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {summary.fsrs.map(fsr => (
              <tr key={fsr._id}>
                <td>{fsr.fsrId}</td>
                <td>{fsr.customerName}</td>
                <td>{fsr.engineerName}</td>
                <td>{new Date(fsr.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {displayList === "consumables" && summary?.consumables && summary.consumables.length > 0 && (
  <table className="summary-table">
    <thead>
      <tr>
        <th>Item Name</th>
        <th>Date</th>
        <th>Issued Qty</th>
        <th>Vendor</th>
        <th>Cost</th>
      </tr>
    </thead>
    <tbody>
      {summary.consumables.map(cons => (
        <tr key={cons._id}>
          <td>{cons.item_name}</td>
          <td>{new Date(cons.date).toLocaleDateString()}</td>
          <td>{cons.issued_qty}</td>
          <td>{cons.vendor}</td>
          <td>{cons.cost}</td>
        </tr>
      ))}
    </tbody>
  </table>
)}

    </div>
    
  );
};

export default MonthlySummary;
