import React, { useState, useEffect } from "react";
import BackButton from "../components/BackButton";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { useSelector } from "react-redux";

const API_URL = process.env.REACT_APP_API_BASE_URL;


const PROJECTS = {
  jogini: {
    label: "Jogini",
    columns: [
      { key: "Spare Discription", label: "Spare Description" },
      { key: "Make.Vendor", label: "Vendor" },
      { key: "Month", label: "Month" },
      { key: "OPENING STOCK ( NOS )", label: "Opening Stock" },
      { key: "RECEIVED QTY ( NOS )", label: "Received Qty" },
      { key: "Monthly Consumption ( NOS )", label: "Monthly Consumption" },
      { key: "CLOSING STOCK ( NOS )", label: "Closing Stock" },
    ],
  },
  shong: {
    label: "Shong",
    columns: [
      { key: "Description of Material", label: "Description of material" },
      { key: "Make", label: "Make" },
      { key: "Vendor", label: "Vendor" },
      { key: "Code.Specification", label: "Specification" },
      { key: "Place", label: "Place" },
      { key: "Rate", label: "Rate" },
      { key: "In Stock", label: "In Stock" },
      { key: "Remarks", label: "Remarks" },
      { key: "Types", label: "Types" },
    ],
  },
  solding: {
    label: "Solding",
    columns: [
      { key: "Description of Material", label: "Description of material" },
      { key: "Make", label: "Make" },
      { key: "Vendor", label: "Vendor" },
      { key: "Code.Specification", label: "Specification" },
      { key: "Place", label: "Place" },
      { key: "Rate", label: "Rate" },
      { key: "In Stock", label: "In Stock" },
      { key: "TYPES", label: "Types" },
    ],
  },
  sdllpsalun: {
    label: "SDLLP Salun",
    columns: [
      { key: "NAME OF MATERIALS", label: "Name of material" },
      { key: "OPENING BALANCE", label: "Opening Balance" },
      { key: "RECEIVED DURING THE MONTH", label: "Received during Month" },
      { key: "ISSUE DURING THE MONTH", label: "Issued during Month" },
      { key: "ISSUE DURING THE YEAR (from 1st Jan 2025)", label: "Issued during Year" },
      { key: "CLOSING BALANCE", label: "Closing Bal." },
      { key: "SPECIFICATION", label: "Specification" },
      { key: "MAKE.MANUFACTURE", label: "Manufacture" },
      { key: "vendor", label: "Vendor" },
      { key: "Types", label: "Types" },
    ],
  },
  kuwarsi: {
    label: "Kuwarsi",
    columns: [
      { key: "NAME OF MATERIALS", label: "Name of material" },
      { key: "OPENING BALANCE", label: "Opening Bal." },
      { key: "RECEIVED DURING THE MONTH", label: "Received during Month" },
      { key: "ISSUE DURING THE MONTH", label: "Issued during Month" },
      { key: "ISSUE DURING THE YEAR ( from 1 jan 2025)", label: "Issued during Year" },
      { key: "CLOSING BALANCE", label: "Closing Bal." },
      { key: "MAKE.MANUFACTURE", label: "Manufacture" },
      { key: "vendor", label: "Vendor" },
      { key: "REMARKS", label: "Remarks" },
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
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  

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
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 403) {
            const errRes = await res.json();
            throw new Error(errRes.message || "Access denied: You cannot access this project");
          }
          throw new Error("Failed to fetch items");
        }
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
  const openEdit = (item) => setModal({ mode: "edit", data: { ...item }, id: item._id });
  const closeModal = () => setModal({ mode: null, data: {}, id: null });


  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(/\.|\[|\]/).filter(Boolean);

    setModal((m) => {
      const copy = { ...m.data };
      let cur = copy;
      keys.slice(0, -1).forEach((k) => {
        cur[k] = cur[k] || {};
        cur = cur[k];
      });
      cur[keys[keys.length - 1]] = value;
      return { ...m, data: copy };
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setModal((m) => ({
      ...m,
      data: { ...m.data, pictureFile: file },
    }));
  };

  
  const formatNestedFields = (data, projectKey) => {
    const formatted = { ...data };
    delete formatted._id;
    delete formatted.createdAt;
    delete formatted.updatedAt;
    delete formatted.__v;

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
        "spareCount",
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
        "spareCount",
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
        "spareCount",
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
        "vendor",
        "Types",
        "spareCount",
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
        "vendor",
        "REMARKS",
        "spareCount",
      ],
    }[projectKey] || [];

    
    switch (projectKey) {
      case "jogini":
        if (formatted.Make?.Vendor) {
          formatted["Make.Vendor"] = formatted.Make.Vendor;
          delete formatted.Make;
        }
        break;
      case "shong":
      case "solding":
        if (formatted.Code?.Specification) {
          formatted["Code.Specification"] = formatted.Code.Specification;
          delete formatted.Code;
        }
        break;
      case "sdllpsalun":
      case "kuwarsi":
        if (formatted.MAKE?.MANUFACTURE) {
          formatted["MAKE.MANUFACTURE"] = formatted.MAKE.MANUFACTURE;
          delete formatted.MAKE;
        }
        break;
    }

    
    const out = {};
    allowedFields.forEach((field) => {
      if (formatted[field] !== undefined) {
        out[field] = formatted[field];
      }
    });
    return out;
  };


  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!user?.token) {
    return toast.error("Not authorized");
  }

  setLoading(true);


  const formData = new FormData();
  let url = "";
  let method = "";

  if (modal.mode === "add") {
    
    url = `${API_URL}/api/${projectKey}`;
    method = "POST";


    const filtered = formatNestedFields(modal.data, projectKey);
    Object.entries(filtered).forEach(([key, val]) => {
      formData.append(key, val);
    });
  } else {
    url = `${API_URL}/api/${projectKey}/${modal.id}`;
    method = "PATCH"; 
    const filtered = formatNestedFields(modal.data, projectKey);
    Object.entries(filtered).forEach(([key, val]) => {
      formData.append(key, val);
    });
    
  }

  if (modal.data.pictureFile instanceof File) {
    formData.append("picture", modal.data.pictureFile);
  }

  try {
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Save failed");
    }

    toast.success(modal.mode === "add" ? "Item created!" : "Item updated!");
    closeModal();

    
    const refreshed = await (
      await fetch(`${API_URL}/api/${projectKey}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
    ).json();
    setItems(Array.isArray(refreshed) ? refreshed : refreshed.data || []);
  } catch (err) {
    toast.error(err.message);
  } finally {
    setLoading(false);
  }
};

  if (loading) return <Spinner />;

  if (error) {
    return (
      <div
        style={{
          color: "red",
          fontSize: "1rem",
          fontWeight: "bold",
          padding: 16,
          margin: 20,
        }}
      >
        <p>{error}</p>
        <div style={{ marginTop: 12 }}>
          <BackButton url="/" />
        </div>
      </div>
    );
  }

  const cfg = PROJECTS[projectKey] || null;
  const descKey = cfg?.columns?.[0]?.key ?? "";

  const filteredItems = items.filter(item => {
    let label = item;
    descKey
      .split(/[\.\[\]]/)
      .filter(Boolean)
      .forEach(k => (label = label ? label[k] : ""));
    return String(label).toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <div style={{ padding: 20 }}>
        <BackButton url="/" />
        <h1 style={{ marginBottom: 50 }}>Manage Inventory</h1>

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
              color: "black",
              marginBottom: 52,
            }}
          >
            <option value="" disabled>
              Select a project
            </option>
            {Object.entries(PROJECTS).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Instructional text */}
        <div
          style={{
            marginBottom: 20,
            fontSize: "1rem",
            fontWeight: "bold",
            fontStyle: "italic",
          }}
        >
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
            <div
              style={{
                marginRight: 8,
                marginBottom: 25,
                fontWeight: "bold",
                fontSize: "1rem",
                fontStyle: "italic",
              }}
            >
              To update an item, click the dropdown below:
            </div>
            <div style={{ position: 'relative', marginBottom: "250px" }}>
              <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                  display: "inline-block",
                  padding: "6px 12px",
                  borderRadius: 8,
                  border: "black 1px solid",
                  width: 300,
                  fontSize: "1rem",
                  cursor: "pointer",
                  backgroundColor: "lightgrey",
                  position: "relative",
                  backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23000000%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px top 50%",
                  backgroundSize: "12px auto",
                  paddingRight: "30px"
                }}
              >
                <input
                  type="text"
                  placeholder={`-- select ${cfg.columns[0].label} --`}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsOpen(true);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    width: "100%",
                    border: "none",
                    background: "transparent",
                    outline: "none",
                    cursor: "pointer",
                  }}
                />
                {isOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      backgroundColor: "lightgrey",
                      border: "black 1px solid",
                      borderRadius: "0 0 8px 8px",
                      maxHeight: "200px",
                      overflowY: "auto",
                      overflowX: "hidden",
                      zIndex: 1000,
                      marginTop: "2px",
                      width: "400px"
                    }}
                  >
                    {filteredItems.map((it) => {
                      let label = it;
                      descKey
                        .split(/[\.\[\]]/)
                        .filter(Boolean)
                        .forEach((k) => (label = label ? label[k] : ""));
                      return (
                        <div
                          key={it._id}
                          onClick={() => {
                            openEdit(it);
                            setSearchTerm("");
                            setIsOpen(false);
                          }}
                          style={{
                            padding: "6px 12px",
                            cursor: "pointer",
                            wordBreak: "break-word",
                            ":hover": {
                              backgroundColor: "#e0e0e0"
                            }
                          }}
                        >
                          {label}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal for Add/Edit */}
        {modal.mode && cfg && (
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
            <div style={{ position: "relative" }}>
              <button
                onClick={closeModal}
                style={{
                  position: "absolute",
                  right: -10,
                  top: -10,
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  border: "1px solid #ccc",
                  background: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  padding: 0,
                }}
              >
                ×
              </button>
              <h3 style={{ marginTop: 0 }}>
                {modal.mode === "add" ? "Add New" : "Edit"} {cfg.label}
              </h3>
            </div>

          
            <div
              style={{
                maxHeight: "60vh",
                overflowY: "auto",
                overflowX: "hidden",
                paddingRight: 8,
              }}
            >
              <form onSubmit={handleSubmit}>
           
                {cfg.columns.map((c) => {
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

              
                <div
  style={{
    marginBottom: 15,
    fontSize: "1rem",
    display: "flex",
    alignItems: "center",
  }}
>
  <label
    htmlFor="picture"
    style={{
      width: 100,      
      marginRight: 50, 
      whiteSpace: "nowrap",  
      lineHeight: "32px",
    }}
  >
    Upload Picture:
  </label>
                  <input
                    type="file"
                    name="picture"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ flex: 1 }}
                  />
                </div>

                
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
                      cursor: "pointer",
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
                      cursor: "pointer",
                    }}
                  >
                    {modal.mode === "add" ? "Create" : "Update"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
