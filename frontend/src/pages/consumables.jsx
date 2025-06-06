import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import BackButton from "../components/BackButton";
import "../index.css";

const API_URL = process.env.REACT_APP_API_BASE_URL;

const Consumables = () => {
  const [formData, setFormData] = useState({
    date: "",
    item_name: "",
    specification: "",
    opening_stock: "",
    received_qty: "",
    issued_qty: "",
    balance_stock: "",
    issued_to: "",
    cost: "",
    vendor: "",
    remarks: ""
  });

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showRecords, setShowRecords] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/consumables`, config);
      setRecords(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch consumable records"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/consumables`, formData, config);
      toast.success("Consumable added!");
      setFormData({
        date: "",
        item_name: "",
        specification: "",
        opening_stock: "",
        received_qty: "",
        issued_qty: "",
        balance_stock: "",
        issued_to: "",
        cost: "",
        vendor: "",
        remarks: ""
      });
      setShowForm(false);
      fetchRecords();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add consumable.");
    }
  };

  return (
    <div style={{ maxWidth: 1500, margin: "40px auto", padding: 24 }}>
      <BackButton url="/" />
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: '50px',
        marginBottom: '30px'
      }}>
        <h2 style={{ margin: 10, textAlign: 'center' }}>Consumable Inventory</h2>
        <div style={{ 
          display: 'flex', 
          gap: '10px',
          justifyContent: 'center'
        }}>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setShowRecords(false);
            }}
            style={{
              padding: '10px 20px',
              background: '#4CAF50',
              color: 'white',
              border: 'black solid 1px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              minWidth: '200px',
              justifyContent: 'center'
            }}
          >
            <span style={{ fontSize: '20px' }}>+</span> Add New Consumable
          </button>
          <button
            onClick={() => {
              setShowRecords(!showRecords);
              setShowForm(false);
            }}
            style={{
              padding: '10px 20px',
              background: '#2196F3',
              color: 'white',
              border: 'black solid 1px',
              borderRadius: '8px',
              cursor: 'pointer',
              minWidth: '200px',
              justifyContent: 'center'
            }}
          >
            View Consumables
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ 
          background: '#f8f9fa', 
          padding: '30px', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>Add New Consumable</h3>
          <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
            {Object.entries(formData).map(([key, value]) => (
              <div key={key} style={{ marginBottom: '15px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '5px',
                  fontWeight: 'normal',
                  color: '#333',
                  fontSize: '20px'
                 
                
                }}>
                  {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </label>
                <input
                  type={key === "date" ? "date" : "text"}
                  name={key}
                  value={value}
                  onChange={handleChange}
                  required={["date", "item_name"].includes(key)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    fontSize: '14px'
                  }}
                />
              </div>
            ))}
            <div style={{ textAlign: 'center' }}>
              <button
                type="submit"
                style={{
                  padding: '12px 24px',
                  background: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  marginTop: '20px',
                  minWidth: '200px'
                }}
              >
                Save Consumable
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Records Table */}
{showRecords && (
  <div style={{
    background: '#f8f9fa',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }}>
    <h3 style={{ marginBottom: '20px' }}>Consumable Records</h3>
    {loading ? (
      <p>Loading...</p>
    ) : error ? (
      <p style={{ color: 'red' }}>{error}</p>
    ) : (
      <>
        {/* Table for desktop/laptop */}
        <div style={{ overflowX: 'auto' }}>
          <table className="records-table">
            <thead>
              <tr>
<th style={{ width: '60px', maxWidth: '60px', textAlign: 'center' }}>Sr No</th>

              <th style={{ whiteSpace: 'nowrap' }}>Date</th>
                <th>Item Name</th>
                <th>Specification</th>
                <th>Opening Stock</th>
                <th>Received Qty</th>
                <th>Issued Qty</th>
                <th>Balance Stock</th>
                <th>Issued To</th>
                <th>Vendor</th>
                <th>Cost</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec, idx) => (
                <tr key={rec._id}>
                  <td style={{ width: '60px', maxWidth: '60px', textAlign: 'center' }}>
  {rec.sr_no || idx + 1}
</td>

                  <td style={{ whiteSpace: 'nowrap' }}>
  {new Date(rec.date).toLocaleDateString()}
</td>

                  <td>{rec.item_name}</td>
                  <td>{rec.specification}</td>
                  <td>{rec.opening_stock}</td>
                  <td>{rec.received_qty}</td>
                  <td>{rec.issued_qty}</td>
                  <td>{rec.balance_stock}</td>
                  <td>{rec.issued_to}</td>
                  <td>{rec.vendor}</td>
                  <td>{rec.cost}</td>
                  <td>{rec.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Card/List view for mobile */}
        <div className="mobile-records-list">
          {records.map((rec, idx) => (
            <div className="mobile-record-card" key={rec._id}>
              <div className="field-row"><span className="field-label">Sr No:</span> {rec.sr_no || idx + 1}</div>
              <div className="field-row"><span className="field-label">Date:</span> {new Date(rec.date).toLocaleDateString()}</div>
              <div className="field-row"><span className="field-label">Item Name:</span> {rec.item_name}</div>
              <div className="field-row"><span className="field-label">Specification:</span> {rec.specification}</div>
              <div className="field-row"><span className="field-label">Opening Stock:</span> {rec.opening_stock}</div>
              <div className="field-row"><span className="field-label">Received Qty:</span> {rec.received_qty}</div>
              <div className="field-row"><span className="field-label">Issued Qty:</span> {rec.issued_qty}</div>
              <div className="field-row"><span className="field-label">Balance Stock:</span> {rec.balance_stock}</div>
              <div className="field-row"><span className="field-label">Issued To:</span> {rec.issued_to}</div>
              <div className="field-row"><span className="field-label">Vendor:</span> {rec.vendor}</div>
              <div className="field-row"><span className="field-label">Cost:</span> {rec.cost}</div>
              <div className="field-row"><span className="field-label">Remarks:</span> {rec.remarks}</div>
            </div>
          ))}
        </div>
      </>
    )}
  </div>
)}

    </div>
  );
};

export default Consumables;
