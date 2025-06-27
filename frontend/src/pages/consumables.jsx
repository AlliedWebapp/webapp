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
  const [editingId, setEditingId] = useState(null);
  


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

    // Validation: required fields
    if (!formData.date || !formData.item_name) {
      toast.error("All required fields must be filled.");
      return;
    }
    // Validation: cost must be a number if filled
    if (formData.cost && isNaN(Number(formData.cost))) {
      toast.error("Cost must be a number.");
      return;
    }
    try {
      if (editingId) {
        // Update existing consumable
        await axios.patch(`${API_URL}/api/consumables/${editingId}`, formData, config);
        toast.success("Consumable updated!");
      } else {
        // Add new consumable
        await axios.post(`${API_URL}/api/consumables`, formData, config);
        toast.success("Consumable added!");
      }
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
      setEditingId(null);
      setShowForm(false);
      fetchRecords();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save consumable.");
    }
  };

  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this consumable?")) return;
  try {
   await axios.delete(`${API_URL}/api/consumables/${id}`, config);

    // Re-fetch the consumables list
    fetchRecords();
  } catch (err) {
    alert("Delete failed: " + (err.response?.data?.error || err.message));
  }
};

const handleEdit = (rec) => {
    console.log("Edit clicked for record:", rec); // Debug log
    
    // Format the date to YYYY-MM-DD
    const formattedDate = new Date(rec.date).toISOString().split('T')[0];
    
    // Set form data with all fields
    setFormData({
      date: formattedDate,
      item_name: rec.item_name || "",
      specification: rec.specification || "",
      opening_stock: rec.opening_stock || "",
      received_qty: rec.received_qty || "",
      issued_qty: rec.issued_qty || "",
      balance_stock: rec.balance_stock || "",
      issued_to: rec.issued_to || "",
      cost: rec.cost || "",
      vendor: rec.vendor || "",
      remarks: rec.remarks || ""
    });
    
  setEditingId(rec._id);
    setShowForm(true);
    setShowRecords(false); // Hide records when showing form
};

const actionButtonStyle = {
    padding: '10px 20px',
    margin: '4px',
  borderRadius: '4px',
  border: 'none',
  fontSize: '15px',
  cursor: 'pointer',
  fontWeight: 500,
    transition: 'all 0.2s ease',
    display: 'inline-block',
    textAlign: 'center',
    minWidth: '100px'
};

const editButtonStyle = {
  ...actionButtonStyle,
    background: '#4CAF50',
  color: 'white',
    '&:hover': {
      background: '#45a049'
    }
};

const deleteButtonStyle = {
  ...actionButtonStyle,
    background: '#f44336',
    color: 'white',
    '&:hover': {
      background: '#da190b'
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
          margin: '0 auto',
          position: 'relative',
          zIndex: 1000
  }}>
    <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>
      {editingId ? "Edit Consumable" : "Add New Consumable"}
    </h3>
    {!editingId && (
      <div style={{ textAlign: 'left', marginBottom: '10px' }}>
        <span style={{ color: '#888', fontSize: '0.95rem' }}>All fields are mandatory.</span>
      </div>
    )}
    <form 
      onSubmit={handleSubmit} 
      style={{ maxWidth: '600px', margin: '0 auto' }}
    >
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
            value={value || ""}
            onChange={handleChange}
            required={["date", "item_name"].includes(key)}
            placeholder={key === "cost" ? "Only number allowed e.g. 1000" : undefined}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '14px',
              color: key === "cost" && !value ? '#888' : undefined
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
          {editingId ? "Update" : "Save Consumable"}
        </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
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
                }}
                style={{
                  padding: '12px 24px',
                  background: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  marginTop: '20px',
                  marginLeft: '10px',
                  minWidth: '200px'
                }}
              >
                Cancel
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
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          width: '100%'
  }}>
    <h3 style={{ marginBottom: '20px' }}>Consumable Records</h3>
    {loading ? (
      <p>Loading...</p>
    ) : error ? (
      <p style={{ color: 'red' }}>{error}</p>
    ) : (
      <>
              {/* Desktop Table View */}
              <div className="desktop-view">
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  tableLayout: 'fixed',
                  fontSize: '14px',
                  minWidth: '1200px'
                }}>
            <thead>
              <tr>
                      <th style={{ width: '4%', padding: '12px', textAlign: 'center', backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>Sr No</th>
                      <th style={{ width: '8%', padding: '12px', textAlign: 'left', backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>Date</th>
                      <th style={{ width: '12%', padding: '12px', textAlign: 'left', backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>Item Name</th>
                      <th style={{ width: '12%', padding: '12px', textAlign: 'left', backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>Specification</th>
                      <th style={{ width: '8%', padding: '12px', textAlign: 'left', backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>Opening Stock</th>
                      <th style={{ width: '8%', padding: '12px', textAlign: 'left', backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>Received Qty</th>
                      <th style={{ width: '8%', padding: '12px', textAlign: 'left', backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>Issued Qty</th>
                      <th style={{ width: '8%', padding: '12px', textAlign: 'left', backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>Balance Stock</th>
                      <th style={{ width: '10%', padding: '12px', textAlign: 'left', backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>Issued To</th>
                      <th style={{ width: '10%', padding: '12px', textAlign: 'left', backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>Vendor</th>
                      <th style={{ width: '5%', padding: '12px', textAlign: 'left', backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>Cost</th>
                      <th style={{ width: '5%', padding: '12px', textAlign: 'left', backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>Remarks</th>
                      <th style={{ width: '12%', padding: '12px', textAlign: 'center', backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec, idx) => (
                      <tr key={rec._id} style={{ borderBottom: '1px solid #ddd' }}>
                        <td style={{ padding: '12px', textAlign: 'center' }}>{rec.sr_no || idx + 1}</td>
                        <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>{new Date(rec.date).toLocaleDateString()}</td>
                        <td style={{ padding: '12px' }}>{rec.item_name}</td>
                        <td style={{ padding: '12px' }}>{rec.specification}</td>
                        <td style={{ padding: '12px' }}>{rec.opening_stock}</td>
                        <td style={{ padding: '12px' }}>{rec.received_qty}</td>
                        <td style={{ padding: '12px' }}>{rec.issued_qty}</td>
                        <td style={{ padding: '12px' }}>{rec.balance_stock}</td>
                        <td style={{ padding: '12px' }}>{rec.issued_to}</td>
                        <td style={{ padding: '12px' }}>{rec.vendor ? String(rec.vendor) : ''}</td>
                        <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>{rec.cost ? String(rec.cost) : ''}</td>
                        <td style={{ padding: '12px' }}>{rec.remarks ? String(rec.remarks) : ''}</td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
  <button
                            style={{
                              ...editButtonStyle,
                              padding: '10px 20px',
                              margin: '4px',
                              fontSize: '15px',
                              minWidth: '100px'
                            }}
    onClick={() => handleEdit(rec)}
                            onMouseOver={e => e.target.style.background = '#45a049'}
                            onMouseOut={e => e.target.style.background = '#4CAF50'}
  >
                            Edit
  </button>
  <button
                            style={{
                              ...deleteButtonStyle,
                              padding: '10px 20px',
                              margin: '4px',
                              fontSize: '15px',
                              minWidth: '100px'
                            }}
    onClick={() => handleDelete(rec._id)}
                            onMouseOver={e => e.target.style.background = '#da190b'}
                            onMouseOut={e => e.target.style.background = '#f44336'}
  >
                            Delete
  </button>
</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

              {/* Mobile Card View */}
              <div className="mobile-view">
          {records.map((rec, idx) => (
                  <div key={rec._id} style={{
                    background: 'white',
                    padding: '15px',
                    marginBottom: '15px',
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ marginBottom: '10px' }}><strong>Sr No:</strong> {rec.sr_no || idx + 1}</div>
                    <div style={{ marginBottom: '10px' }}><strong>Date:</strong> {new Date(rec.date).toLocaleDateString()}</div>
                    <div style={{ marginBottom: '10px' }}><strong>Item Name:</strong> {rec.item_name}</div>
                    <div style={{ marginBottom: '10px' }}><strong>Specification:</strong> {rec.specification}</div>
                    <div style={{ marginBottom: '10px' }}><strong>Opening Stock:</strong> {rec.opening_stock}</div>
                    <div style={{ marginBottom: '10px' }}><strong>Received Qty:</strong> {rec.received_qty}</div>
                    <div style={{ marginBottom: '10px' }}><strong>Issued Qty:</strong> {rec.issued_qty}</div>
                    <div style={{ marginBottom: '10px' }}><strong>Balance Stock:</strong> {rec.balance_stock}</div>
                    <div style={{ marginBottom: '10px' }}><strong>Issued To:</strong> {rec.issued_to}</div>
                    <div style={{ marginBottom: '10px' }}><strong>Vendor:</strong> {rec.vendor ? String(rec.vendor) : ''}</div>
                    <div style={{ marginBottom: '10px' }}><strong>Cost:</strong> {rec.cost ? String(rec.cost) : ''}</div>
                    <div style={{ marginBottom: '10px' }}><strong>Remarks:</strong> {rec.remarks ? String(rec.remarks) : ''}</div>
                    <div style={{ 
                      display: 'flex', 
                      gap: '10px',
                      marginTop: '15px'
                    }}>
                      <button
                        style={{
                          ...editButtonStyle,
                          padding: '10px 20px',
                          margin: '0',
                          fontSize: '15px',
                          minWidth: '100px',
                          flex: 1
                        }}
                        onClick={() => handleEdit(rec)}
                        onMouseOver={e => e.target.style.background = '#45a049'}
                        onMouseOut={e => e.target.style.background = '#4CAF50'}
                      >
                        Edit
                      </button>
                      <button
                        style={{
                          ...deleteButtonStyle,
                          padding: '10px 20px',
                          margin: '0',
                          fontSize: '15px',
                          minWidth: '100px',
                          flex: 1
                        }}
                        onClick={() => handleDelete(rec._id)}
                        onMouseOver={e => e.target.style.background = '#da190b'}
                        onMouseOut={e => e.target.style.background = '#f44336'}
                      >
                        Delete
                      </button>
                    </div>
            </div>
          ))}
        </div>

              <style>
                {`
                  .desktop-view {
                    display: block;
                  }
                  .mobile-view {
                    display: none;
                  }
                  @media (max-width: 768px) {
                    .desktop-view {
                      display: none;
                    }
                    .mobile-view {
                      display: block;
                      padding: 10px;
                    }
                  }
                `}
              </style>
      </>
    )}
  </div>
)}

    </div>
  );
};

export default Consumables;
