import React, { useState, useEffect } from "react";
import BackButton from "../components/BackButton";
import { toast } from "react-toastify";
import axios from "axios";
import Spinner from "../components/Spinner";
import { useSelector } from "react-redux";

const adminEmails = ["bhaskarudit02@gmail.com", "ss@gmail.com"];

const API_URL = process.env.REACT_APP_API_BASE_URL;

// Map of your projects, their API‐paths, and which columns they use
const PROJECTS = {
  jogini: {
    label: "Jogini",
    columns: [
      { key: "Spare Discription", label: "Spare Description" },
      { key: "Make.Vendor",       label: "Vendor" },
      { key: "Month",             label: "Month" },
      { key: "OPENING STOCK ( NOS )",      label: "Opening Stock" },
      { key: "RECEIVED QTY ( NOS )",       label: "Received Qty" },
      { key: "Monthly Consumption ( NOS )",label: "Monthly Consumption" },
      { key: "CLOSING STOCK ( NOS )",      label: "Closing Stock" },
    ],
  },
  shong: {
    label: "Shong",
    columns: [
      { key: "Description of Material", label: "Description of material" },
      { key: "Make",       label: "Make" },
      { key: "Vendor",     label: "Vendor" },
      { key: "Code.Specification", label: "Specification" },
      { key: "Place",      label: "Place" },
      { key: "Rate",       label: "Rate" },
      { key: "In Stock",    label: "In Stock" },
      { key: "Remarks",    label: "Remarks" },
      { key: "Types",      label: "Types" },
    ],
  },
  solding: {
    label: "Solding",
    columns: [
      { key: "Description of Material", label: "Description of material" },
      { key: "Make",       label: "Make" },
      { key: "Vendor",     label: "Vendor" },
      { key: "Code.Specification", label: "Specification" },
      { key: "Place",      label: "Place" },
      { key: "Rate",       label: "Rate" },
      { key: "In Stock",    label: "In Stock" },
      { key: "TYPES",      label: "Types" },
    ],
  },
  sdllpsalun: {
    label: "SDLLP Salun",
    columns: [
      { key: "NAME OF MATERIALS",     label: "Name of material" },
      { key: "OPENING BALANCE",      label: "Opening Balance" },
      { key: "RECEIVED DURING THE MONTH", label: "Received during Month" },
      { key: "ISSUE DURING THE MONTH",    label: "Issued during Month" },
      { key: "ISSUE DURING THE YEAR (from 1st Jan 2025)",     label: "Issued during Year" },
      { key: "CLOSING BALANCE",      label: "Closing Bal." },
      { key: "SPECIFICATION",        label: "Specification" },
      { key: "MAKE.MANUFACTURE",    label: "Manufacture" },
      { key: "Types",                label: "Types" },
    ],
  },
  kuwarsi: {
    label: "Kuwarsi",
    columns: [
      { key: "NAME OF MATERIALS",     label: "Name of material" },
      { key: "OPENING BALANCE",      label: "Opening Bal." },
      { key: "RECEIVED DURING THE MONTH", label: "Received during Month" },
      { key: "ISSUE DURING THE MONTH",    label: "Issued during Month" },
      { key: "ISSUE DURING THE YEAR ( from 1 jan 2025)",     label: "Issued during Year" },
      { key: "CLOSING BALANCE",      label: "Closing Bal." },
      { key: "MAKE.MANUFACTURE",    label: "Manufacture" },
      { key: "REMARKS",             label: "Remarks" },
    ],
  },
};

export default function InventoryManager() {
  const [projectKey, setProjectKey] = useState("");
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState({ mode: null, data: {}, id: null });
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  
   // Fetch list when project or user changes
  useEffect(() => {
    if (!user?.token) {
      setError("Please login to view inventory");
      return;
    }
    if (!projectKey) { 
      setItems([]);
      setError("");
      return;
    }
    

    setLoading(true);
    fetch(`${API_URL}/api/${projectKey}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch items");
        return res.json();
      })
      .then((json) => {
        const data = Array.isArray(json)
          ? json
          : json.success && Array.isArray(json.data)
          ? json.data
          : [];
        setItems(data);
        setError("");
      })
      .catch((e) => {
        setError(e.message);
        toast.error(e.message);
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, [projectKey, user]);

  const openAdd = () => setModal({ mode: "add", data: {}, id: null });
  const openEdit = (item) => setModal({ mode: "edit", data: item, id: item._id });
  const closeModal = () => setModal({ mode: null, data: {}, id: null });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(/\.|\[|\]/).filter(Boolean);
    setModal((m) => {
      const d = { ...m.data };
      let cur = d;
      keys.slice(0, -1).forEach((k) => {
        cur[k] = cur[k] || {};
        cur = cur[k];
      });
      cur[keys[keys.length - 1]] = value;
      return { ...m, data: d };
    });
  };

  // Function to handle nested fields for all projects
  const formatNestedFields = (data, projectKey) => {
    const formattedData = { ...data };
    
    // Remove _id and other non-allowed fields
    delete formattedData._id;
    delete formattedData.createdAt;
    delete formattedData.updatedAt;
    delete formattedData.__v;
  

    
    // Define allowed fields for each project - exactly matching backend routes
    const allowedFields = {
      jogini: [
        "S.No",
        "Spare Discription",
        "Make.Vendor",
        "Month",
        "OPENING STOCK ( NOS )",
        "RECEIVED QTY ( NOS )",
        "Monthly Consumption ( NOS )",
        "CLOSING STOCK ( NOS )",
        "MSL (Maximum Stock Level - To be required always at site as per urgency) ( QTY )",
        "SIGN",
        "FIELD11",
        "spareCount"
      ],
      shong: [
        "Description of Material",
        "Make",
        "Vendor",
        "Code.Specification",
        "Place",
        "Rate",
        "Qty",
        "In Stock",
        "Remarks",
        "Types",
        "spareCount"
      ],
      solding: [
        "Description of Material",
        "Make",
        "Vendor",
        "Code.Specification",
        "Place",
        "Rate",
        "Qty",
        "In Stock",
        "TYPES",
        "spareCount"
      ],
      sdllpsalun: [
        "NAME OF MATERIALS",
        "OPENING BALANCE",
        "RECEIVED DURING THE MONTH",
        "ISSUE DURING THE MONTH",
        "ISSUE DURING THE YEAR (from 1st Jan 2025)",
        "CLOSING BALANCE",
        "SPECIFICATION",
        "MAKE.MANUFACTURE",
        "Types",
        "spareCount"
      ],
      kuwarsi: [
        "SR. NO.",
        "NAME OF MATERIALS",
        "OPENING BALANCE",
        "RECEIVED DURING THE MONTH",
        "TOTAL",
        "ISSUE DURING THE MONTH",
        "ISSUE DURING THE YEAR ( from 1 jan 2025)",
        "CLOSING BALANCE",
        "SPECIFICATION",
        "MAKE.MANUFACTURE",
        "REMARKS",
        "spareCount"
      ]
    };
    
    // Handle nested fields based on project
    switch (projectKey) {
      case 'jogini':
        if (formattedData.Make?.Vendor) {
          formattedData['Make.Vendor'] = formattedData.Make.Vendor;
          delete formattedData.Make;
        }
        break;
        
      case 'shong':
      case 'solding':
        // Keep Make and Vendor as separate fields
        if (formattedData.Code?.Specification) {
          formattedData['Code.Specification'] = formattedData.Code.Specification;
          delete formattedData.Code;
        }
        break;
        
      case 'sdllpsalun':
      case 'kuwarsi':
        if (formattedData.MAKE?.MANUFACTURE) {
          formattedData['MAKE.MANUFACTURE'] = formattedData.MAKE.MANUFACTURE;
          delete formattedData.MAKE;
        }
        break;
    }
    
    // Filter out any fields that aren't in the allowed list
    const allowed = allowedFields[projectKey] || [];
    const filteredData = {};
    
    // Only include fields that are in the allowed list
    allowed.forEach(field => {
      if (formattedData[field] !== undefined) {
        filteredData[field] = formattedData[field];
      }
    });
    
    console.log('Filtered data for', projectKey, ':', filteredData); // Debug log
    return filteredData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.token) return toast.error("Not authorized");

    setLoading(true);
    const url = modal.mode === "add"
      ? `${API_URL}/api/${projectKey}`
      : `${API_URL}/api/${projectKey}/${modal.id}`;
    
    // Format the data to handle nested fields
    const formattedData = formatNestedFields(modal.data, projectKey);
    
    // Debug logs to see what data is being sent
    console.log('Project:', projectKey);
    console.log('Update data:', formattedData);
    console.log('Update fields:', Object.keys(formattedData));
    
    const opts = {
      method: modal.mode === "add" ? "POST" : "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(formattedData),
    };

    try {
      const res = await fetch(url, opts);
      if (!res.ok) {
        const err = await res.json();
        console.error('Server error response:', err);
        throw new Error(err.message || "Save failed");
      }
      toast.success(`Item ${modal.mode === "add" ? "created" : "updated"}!`);
      closeModal();
      // refresh
      const refreshed = await (await fetch(
        `${API_URL}/api/${projectKey}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      )).json();
      setItems(Array.isArray(refreshed) ? refreshed : refreshed.data || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;
  if (error)
    return (
      <div className="error-container">
        <h3>Error: {error}</h3>
        <button onClick={closeModal} className="btn">
          Dismiss
        </button>
      </div>
    );

  const cfg = PROJECTS[projectKey] || null; 
  const descKey = cfg?.columns?.[0]?.key ?? ""; // first column

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <BackButton url="/" />
      <h1 style={{ marginBottom: 50}}>Manage Inventory</h1>

      {/* Project selector */}
<div style={{ fontSize: "1.3rem", fontWeight: "bold", marginBottom: 12 }}>
  Select Project:&nbsp;
  <select
    value={projectKey}
    onChange={(e) => setProjectKey(e.target.value)}
    style={{
      fontSize: "1rem",
      padding: "0.5rem 1rem",
      borderStyle: "solid",
      borderWidth: "2px",
      borderColor: "grey",
      borderRadius: "8px",
      cursor: "pointer",
      marginBottom: 52,
    }}
  >
    <option value="" disabled>Select a project</option>
    {Object.entries(PROJECTS).map(([key, { label }]) => (
      <option key={key} value={key}>
        {label}
      </option>
    ))}
  </select>
</div>


{/* Instructional text */}
<div style={{ marginBottom: 20, fontSize: "1rem", fontWeight: "bold", fontStyle: "italic" }}>
  To add a new item, click the button below:
</div>

{/* Add‐new button */}
<div style={{ marginBottom: 50 }}>
  <button
    onClick={openAdd}
    style={{
      fontSize: "1rem",
      padding: "0.5rem 1rem",
      fontWeight: "bold",
      borderRadius: "8px",
      cursor: "pointer",
      backgroundColor: "#4CAF50",
      color: "white",
      border: "black 1px solid",
    }}
  >
    Add New Item
  </button>
</div>

      {/* Load existing dropdown */}
        {cfg && (
          <div style={{ marginBottom: 32 }}>
         <div style={{ marginRight: 8, marginBottom: 25, fontWeight: "bold", fontSize: "1rem", fontStyle: "italic" }}>
          To update an item, click the dropdown below:
        </div>
        <select
          onChange={(e) => {
            const id = e.target.value;
            if (id) {
              const item = items.find((it) => it._id === id);
              openEdit(item);
            }
          }}
          defaultValue=""
          style={{
            display: " inline-block",
            padding: "6px 12px",
            borderRadius: 8,
            border: " black 1px solid",
            width: 300,
            fontSize: "1rem",
            cursor: "pointer",
            backgroundColor: "lightgrey",
          }}
        >
          <option value="" disabled>
            -- select {cfg.columns[0].label} --
          </option>
          {items.map((it) => {
            // grab nested value if needed
            const label = descKey
              .split(/[\.\[\]]/)
              .filter(Boolean)
              .reduce((o, k) => (o ? o[k] : ""), it);
            return (
              <option key={it._id} value={it._id}>
                {label}
              </option>
            );
          })}
        </select>
      </div>
        )}


      {modal.mode && (
        <div
          style={{
            position: "fixed",
            top: 40,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#fff",
            padding: 24,
            width: 400,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 1000,
            borderRadius: 6,
          }}
        >
          <h3 style={{ marginTop: 0 }}>
            {modal.mode === "add" ? "Add New" : "Edit"} {cfg.label}
          </h3>
          <form onSubmit={handleSubmit}>
            {cfg.columns.map((c) => {

              // get current value
              let value = modal.data;
              c.key
                .split(/[\.\[\]]/)
                .filter(Boolean)
                .forEach((k) => (value = value ? value[k] : ""));

              return (
                <div
                  key={c.key}
                  style={{ marginBottom: 12, display: "flex" }}
                >
                  <label
                    style={{
                      width: 140,
                      lineHeight: "32px",
                    }}
                  >
                    {c.label}:
                  </label>
                  <input
                    name={c.key}
                    value={value ?? ""}
                    onChange={handleChange}
                    style={{
                      flex: 1,
                      padding: "6px 8px",
                      borderRadius: 4,
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
              );
            })}

            <div style={{ textAlign: "right", marginTop: 16 }}>
              <button
                type="button"
                onClick={closeModal}
                style={{
                  padding: "6px 12px",
                  marginRight: 8,
                  background: "#6c757d",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: "6px 12px",
                  background: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                }}
              >
                {modal.mode === "add" ? "Create" : "Update"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}