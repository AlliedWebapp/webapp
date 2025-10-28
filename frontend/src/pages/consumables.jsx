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
    remarks: "",
    fuel_consumed: "",
    total_km_driven: "",
    fuel_storage: ""
  });

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showRecords, setShowRecords] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState("");
  


  const { user } = useSelector((state) => state.auth);

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  // Image utility functions
  const arrayBufferToBase64 = (bufferArray) => {
    let binary = "";
    const bytes = new Uint8Array(bufferArray);
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return window.btoa(binary);
  };

  // Given item.picture, return a base64‐only string (no data: prefix)
  const getBase64FromPicture = (picture) => {
    if (!picture || !picture.data) return null;

    // Case A: picture.data is already a Base64 string
    if (typeof picture.data === "string") {
      return picture.data;
    }

    // Case B: picture.data is an object like { type: "Buffer", data: [ … ] }
    if (
      typeof picture.data === "object" &&
      Array.isArray(picture.data.data)
    ) {
      return arrayBufferToBase64(picture.data.data);
    }

    // Case C: picture.data is a Buffer array
    if (Array.isArray(picture.data)) {
      return arrayBufferToBase64(picture.data);
    }

    return null;
  };

  const openImageModal = (rec) => {
    if (!rec.picture || !rec.picture.data) return;
    const b64 = getBase64FromPicture(rec.picture);
    if (!b64) return;
    const mime = rec.picture.contentType;
    setModalImageSrc(`data:${mime};base64,${b64}`);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setModalImageSrc("");
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
    // Validation: fuel_consumed must be a number if filled
    if (formData.fuel_consumed && isNaN(Number(formData.fuel_consumed))) {
      toast.error("Fuel consumed must be a number.");
      return;
    }
    // Validation: total_km_driven must be a number if filled
    if (formData.total_km_driven && isNaN(Number(formData.total_km_driven))) {
      toast.error("Total km driven must be a number.");
      return;
    }
    try {
      const formDataToSend = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== "") {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Add image if selected
      if (selectedImage) {
        formDataToSend.append('picture', selectedImage);
      }
      
      if (editingId) {
        // Update existing consumable
        await axios.patch(`${API_URL}/api/consumables/${editingId}`, formDataToSend, {
          ...config,
          headers: {
            ...config.headers,
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success("Consumable updated!");
      } else {
        // Add new consumable
        await axios.post(`${API_URL}/api/consumables`, formDataToSend, {
          ...config,
          headers: {
            ...config.headers,
            'Content-Type': 'multipart/form-data',
          },
        });
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
        remarks: "",
        fuel_consumed: "",
        total_km_driven: "",
        fuel_storage: ""
      });
      setSelectedImage(null);
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
      remarks: rec.remarks || "",
      fuel_consumed: rec.fuel_consumed || "",
      total_km_driven: rec.total_km_driven || "",
      fuel_storage: rec.fuel_storage || ""
    });
    
    // Clear selected image when editing (user can select new image if needed)
    setSelectedImage(null);
    
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
      <BackButton url="/inventory-main" />
      
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
            placeholder={
              key === "cost" ? "Only number allowed e.g. 1000" :
              key === "fuel_consumed" ? "Only number allowed e.g. 50" :
              key === "total_km_driven" ? "Only number allowed e.g. 500" :
              undefined
            }
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '14px',
              color: (key === "cost" || key === "fuel_consumed" || key === "total_km_driven") && !value ? '#888' : undefined
            }}
          />
        </div>
      ))}
      
      {/* Image Upload Field */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '5px',
          fontWeight: 'normal',
          color: '#333',
          fontSize: '20px'
        }}>
          Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedImage(e.target.files[0] || null)}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '14px'
          }}
        />
        {selectedImage && (
          <div style={{ marginTop: '10px' }}>
            <p style={{ fontSize: '14px', color: '#666' }}>
              Selected: {selectedImage.name}
            </p>
          </div>
        )}
      </div>
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
                    remarks: "",
                    fuel_consumed: "",
                    total_km_driven: "",
                    fuel_storage: ""
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
    padding: '20px',
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
                  fontSize: '13px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
            <thead>
              <tr>
                      <th style={{ padding: '10px', textAlign: 'center', backgroundColor: '#f5f5f5', color: '#333', fontSize: '12px', fontWeight: 'bold' }}>Sr No</th>
                      <th style={{ padding: '10px', textAlign: 'left', backgroundColor: '#f5f5f5', color: '#333', fontSize: '12px', fontWeight: 'bold' }}>Date</th>
                      <th style={{ padding: '10px', textAlign: 'left', backgroundColor: '#f5f5f5', color: '#333', fontSize: '12px', fontWeight: 'bold' }}>Item Name</th>
                      <th style={{ padding: '10px', textAlign: 'left', backgroundColor: '#f5f5f5', color: '#333', fontSize: '12px', fontWeight: 'bold' }}>Specification</th>
                      <th style={{ padding: '10px', textAlign: 'left', backgroundColor: '#f5f5f5', color: '#333', fontSize: '12px', fontWeight: 'bold' }}>Opening Stock</th>
                      <th style={{ padding: '10px', textAlign: 'left', backgroundColor: '#f5f5f5', color: '#333', fontSize: '12px', fontWeight: 'bold' }}>Received Qty</th>
                      <th style={{ padding: '10px', textAlign: 'left', backgroundColor: '#f5f5f5', color: '#333', fontSize: '12px', fontWeight: 'bold' }}>Issued Qty</th>
                      <th style={{ padding: '10px', textAlign: 'left', backgroundColor: '#f5f5f5', color: '#333', fontSize: '12px', fontWeight: 'bold' }}>Balance Stock</th>
                      <th style={{ padding: '10px', textAlign: 'left', backgroundColor: '#f5f5f5', color: '#333', fontSize: '12px', fontWeight: 'bold' }}>Issued To</th>
                      <th style={{ padding: '10px', textAlign: 'left', backgroundColor: '#f5f5f5', color: '#333', fontSize: '12px', fontWeight: 'bold' }}>Vendor</th>
                      <th style={{ padding: '10px', textAlign: 'left', backgroundColor: '#f5f5f5', color: '#333', fontSize: '12px', fontWeight: 'bold' }}>Cost</th>
                      <th style={{ padding: '10px', textAlign: 'left', backgroundColor: '#f5f5f5', color: '#333', fontSize: '12px', fontWeight: 'bold' }}>Fuel Consumed</th>
                      <th style={{ padding: '10px', textAlign: 'left', backgroundColor: '#f5f5f5', color: '#333', fontSize: '12px', fontWeight: 'bold' }}>Total KM Driven</th>
                      <th style={{ padding: '10px', textAlign: 'left', backgroundColor: '#f5f5f5', color: '#333', fontSize: '12px', fontWeight: 'bold' }}>Average</th>
                      <th style={{ padding: '10px', textAlign: 'left', backgroundColor: '#f5f5f5', color: '#333', fontSize: '12px', fontWeight: 'bold' }}>Fuel Storage</th>
                      <th style={{ padding: '10px', textAlign: 'left', backgroundColor: '#f5f5f5', color: '#333', fontSize: '12px', fontWeight: 'bold' }}>Remarks</th>
                      <th style={{ padding: '10px', textAlign: 'center', backgroundColor: '#f5f5f5', color: '#333', fontSize: '12px', fontWeight: 'bold' }}>Image</th>
                      <th style={{ padding: '10px', textAlign: 'center', backgroundColor: '#f5f5f5', color: '#333', fontSize: '12px', fontWeight: 'bold' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec, idx) => (
                      <tr key={rec._id} style={{ borderBottom: '1px solid #ddd' }}>
                        <td style={{ padding: '10px', textAlign: 'center', fontSize: '12px', wordWrap: 'break-word', backgroundColor: idx % 2 === 0 ? '#f9f9f9' : 'white' }}>{rec.sr_no || idx + 1}</td>
                        <td style={{ padding: '10px', whiteSpace: 'nowrap', fontSize: '12px', backgroundColor: idx % 2 === 0 ? '#f9f9f9' : 'white' }}>{new Date(rec.date).toLocaleDateString()}</td>
                        <td style={{ padding: '10px', fontSize: '12px', wordWrap: 'break-word', maxWidth: '120px', backgroundColor: idx % 2 === 0 ? '#f9f9f9' : 'white' }}>{rec.item_name}</td>
                        <td style={{ padding: '10px', fontSize: '12px', wordWrap: 'break-word', maxWidth: '120px', backgroundColor: idx % 2 === 0 ? '#f9f9f9' : 'white' }}>{rec.specification}</td>
                        <td style={{ padding: '10px', fontSize: '12px', wordWrap: 'break-word', backgroundColor: idx % 2 === 0 ? '#f9f9f9' : 'white' }}>{rec.opening_stock}</td>
                        <td style={{ padding: '10px', fontSize: '12px', wordWrap: 'break-word', backgroundColor: idx % 2 === 0 ? '#f9f9f9' : 'white' }}>{rec.received_qty}</td>
                        <td style={{ padding: '10px', fontSize: '12px', wordWrap: 'break-word', backgroundColor: idx % 2 === 0 ? '#f9f9f9' : 'white' }}>{rec.issued_qty}</td>
                        <td style={{ padding: '10px', fontSize: '12px', wordWrap: 'break-word', backgroundColor: idx % 2 === 0 ? '#f9f9f9' : 'white' }}>{rec.balance_stock}</td>
                        <td style={{ padding: '10px', fontSize: '12px', wordWrap: 'break-word', maxWidth: '100px', backgroundColor: idx % 2 === 0 ? '#f9f9f9' : 'white' }}>{rec.issued_to}</td>
                        <td style={{ padding: '10px', fontSize: '12px', wordWrap: 'break-word', maxWidth: '100px', backgroundColor: idx % 2 === 0 ? '#f9f9f9' : 'white' }}>{rec.vendor ? String(rec.vendor) : ''}</td>
                        <td style={{ padding: '10px', whiteSpace: 'nowrap', fontSize: '12px', backgroundColor: idx % 2 === 0 ? '#f9f9f9' : 'white' }}>{rec.cost ? String(rec.cost) : ''}</td>
                        <td style={{ padding: '10px', fontSize: '12px', wordWrap: 'break-word', backgroundColor: idx % 2 === 0 ? '#f9f9f9' : 'white' }}>{rec.fuel_consumed ? String(rec.fuel_consumed) : ''}</td>
                        <td style={{ padding: '10px', fontSize: '12px', wordWrap: 'break-word', backgroundColor: idx % 2 === 0 ? '#f9f9f9' : 'white' }}>{rec.total_km_driven ? String(rec.total_km_driven) : ''}</td>
                        <td style={{ padding: '10px', fontSize: '12px', wordWrap: 'break-word', backgroundColor: idx % 2 === 0 ? '#f9f9f9' : 'white' }}>
                          {rec.fuel_consumed && rec.total_km_driven && rec.fuel_consumed > 0 
                            ? (rec.total_km_driven / rec.fuel_consumed).toFixed(2) 
                            : ''}
                        </td>
                        <td style={{ padding: '10px', fontSize: '12px', wordWrap: 'break-word', maxWidth: '100px', backgroundColor: idx % 2 === 0 ? '#f9f9f9' : 'white' }}>{rec.fuel_storage ? String(rec.fuel_storage) : ''}</td>
                        <td style={{ padding: '10px', fontSize: '12px', wordWrap: 'break-word', maxWidth: '120px', backgroundColor: idx % 2 === 0 ? '#f9f9f9' : 'white' }}>{rec.remarks ? String(rec.remarks) : ''}</td>
                        <td style={{ padding: '10px', textAlign: 'center', fontSize: '12px', backgroundColor: idx % 2 === 0 ? '#f9f9f9' : 'white' }}>
                          {rec.picture && rec.picture.data ? (
                            <button
                              onClick={() => openImageModal(rec)}
                              style={{
                                padding: '4px 8px',
                                backgroundColor: 'black',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '10px',
                              }}
                            >
                              View Image
                            </button>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td style={{ padding: '10px', textAlign: 'center', fontSize: '12px', backgroundColor: idx % 2 === 0 ? '#f9f9f9' : 'white' }}>
  <button
                            style={{
                              ...editButtonStyle,
                              padding: '8px 16px',
                              margin: '3px',
                              fontSize: '11px',
                              minWidth: '70px'
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
                              padding: '8px 16px',
                              margin: '3px',
                              fontSize: '11px',
                              minWidth: '70px'
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
                    border: '1px solid #ddd'
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
                    <div style={{ marginBottom: '10px' }}><strong>Fuel Consumed:</strong> {rec.fuel_consumed ? String(rec.fuel_consumed) : ''}</div>
                    <div style={{ marginBottom: '10px' }}><strong>Total KM Driven:</strong> {rec.total_km_driven ? String(rec.total_km_driven) : ''}</div>
                    <div style={{ marginBottom: '10px' }}><strong>Average:</strong> {rec.fuel_consumed && rec.total_km_driven && rec.fuel_consumed > 0 ? (rec.total_km_driven / rec.fuel_consumed).toFixed(2) : ''}</div>
                    <div style={{ marginBottom: '10px' }}><strong>Fuel Storage:</strong> {rec.fuel_storage ? String(rec.fuel_storage) : ''}</div>
                    <div style={{ marginBottom: '10px' }}><strong>Remarks:</strong> {rec.remarks ? String(rec.remarks) : ''}</div>
                    <div style={{ marginBottom: '10px' }}>
                      <strong>Image:</strong> 
                      {rec.picture && rec.picture.data ? (
                        <button
                          onClick={() => openImageModal(rec)}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: 'black',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '10px',
                            marginLeft: '10px'
                          }}
                        >
                          View Image
                        </button>
                      ) : (
                        " No image"
                      )}
                    </div>
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

      {/* Image Modal Overlay */}
      {isImageModalOpen && (
        <div
          onClick={closeImageModal}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#fff",
              padding: "1rem",
              borderRadius: "8px",
              maxWidth: "90vw",
              maxHeight: "90vh",
              overflow: "auto",
              position: "relative",
            }}
          >
            <button
              onClick={closeImageModal}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "transparent",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
              }}
            >
              ✖
            </button>
            <img
              src={modalImageSrc}
              alt="Full view"
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                display: "block",
                margin: "0 auto",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Consumables;
