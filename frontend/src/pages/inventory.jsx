import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import BackButton from "../components/BackButton";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Inventory = () => {
  const [selectedCollection, setSelectedCollection] = useState(() => {
    return localStorage.getItem("selectedCollection") || "";
  });
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [headers, setHeaders] = useState([]);
  const [error, setError] = useState(null);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [showLowStock, setShowLowStock] = useState(false);

  useEffect(() => {
    if (selectedCollection) {
      localStorage.setItem("selectedCollection", selectedCollection);
    }
  }, [selectedCollection]);

  //data for each collection with fields
  const getCollectionDetails = (collection) => {
    const collections = {
      Jogini: {
        name: "Jogini",
        headers: ["Spare Description", "Vendor", "Month", "Opening Stock", "Monthly Consumption", "Closing Stock", "SpareCount"],
        dbFields: ["Spare Discription", "Make.Vendor", "Month", "OPENING STOCK ( NOS )", "Monthly Consumption ( NOS )", "CLOSING STOCK ( NOS )", "spareCount"],
      },
      Shong: {
        name: "Shong",
        headers: ["Description of Material", "Make", "Vendor", "Specification", "Place", "Rate", "In Stock", "Remarks", "Types", "SpareCount"],
        dbFields: ["Description of Material", "Make", "Vendor", "Code.Specification", "Place", "Rate", "In Stock", "Remarks", "Types", "spareCount"],
      },
      solding: {
        name: "solding",
        headers: ["Description of Material", "Make", "Vendor", "Specification", "Place", "Rate", "In Stock", "Types", "SpareCount"],
        dbFields: ["Description of Material", "Make", "Vendor", "Code.Specification", "Place", "Rate", "In Stock", "TYPES", "spareCount"],
      },
      SDLLPsalun: {
        name: "SDLLP Salun",
        headers: ["Name of Materials", "Opening Balance", "Received during the month", "Total", "Issue during the month", "Issue during the year ", "Closing Balance", "Specification", "Manufacture", "Types", "SpareCount"],
        dbFields: ["NAME OF MATERIALS", "OPENING BALANCE", "RECEIVED DURING THE MONTH", "TOTAL", "ISSUE DURING THE MONTH", "ISSUE DURING THE YEAR (from 1st Jan 2025)", "CLOSING BALANCE", "SPECIFICATION", "MAKE.MANUFACTURE", "Types", "spareCount"],
      },
      Kuwarsi: {
        name: "Kuwarsi",
        headers: ["Name of Materials", "Opening balance", "Received during the month", "Total", "Issue during the month", "Issue during the year", "Closing balance", "Specification", "Manufacture", "Remarks", "SpareCount"],
        dbFields: ["NAME OF MATERIALS", "OPENING BALANCE", "RECEIVED DURING THE MONTH", "TOTAL", "ISSUE DURING THE MONTH", "ISSUE DURING THE YEAR ( from 1 jan 2025)", "CLOSING BALANCE", "SPECIFICATION", "MAKE.MANUFACTURE", "REMARKS", "spareCount"],
      },
    };
    return collections[collection] || { name: "", headers: [], dbFields: [] };
  };

  const fetchInventory = useCallback(async () => {
    if (!selectedCollection) return;

    setLoading(true);
    setError(null);

    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData?.token) throw new Error("No user token found");

      const res = await axios.get(
        `${API_BASE_URL}/api/${selectedCollection}`,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const items = res.data.data || [];
      const details = getCollectionDetails(selectedCollection);
      setInventory(items);
      setHeaders(details.headers);
      setLowStockItems(items.filter((it) => it.spareCount < 10));
    } catch (err) {
      console.error(err);
      setError(err.message);
      setInventory([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCollection]);

  useEffect(() => {
    fetchInventory();
  }, [selectedCollection, fetchInventory]);

  const handleCollectionChange = (e) => {
    const col = e.target.value;
    setSelectedCollection(col);
    localStorage.setItem("selectedCollection", col);
  };

  // unified update endpoint
  const updateSpareCount = async (id, delta) => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData?.token) throw new Error("No auth token");

      const res = await axios.put(
        `${API_BASE_URL}/api/update-spare-count`,
        { collectionName: selectedCollection, id, increment: delta },
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        setInventory((prev) => {
          const updated = prev.map((it) =>
            it._id === id ? { ...it, spareCount: res.data.spareCount } : it
          );
          setLowStockItems(updated.filter((it) => it.spareCount < 10));
          return updated;
        });
      } else {
        console.error("Update failed:", res.data.message);
      }
    } catch (err) {
      console.error("Error updating spare count:", err);
    }
  };

  return (
    <div>
      <BackButton url="/" />
      <h2>View Inventory</h2>

      <label htmlFor="project-select">Select Project: </label>
      <select
        id="project-select"
        onChange={handleCollectionChange}
        value={selectedCollection}
      >
        <option value="">Select a Project</option>
        {["Jogini", "Shong", "solding", "SDLLPsalun", "Kuwarsi"].map((key) => (
          <option key={key} value={key}>
            {getCollectionDetails(key).name}
          </option>
        ))}
      </select>

      {selectedCollection && (
        <p
          style={{
            marginTop: "0.5rem",
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}
        >
          {getCollectionDetails(selectedCollection).name} Project
        </p>
      )}

      {selectedCollection && (
        <div style={{ margin: "1rem 0" }}>
          <button
            onClick={() => setShowLowStock((s) => !s)}
            style={{
              padding: "8px 12px",
              backgroundColor: "#e74c3c",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              borderRadius: "5px",
            }}
          >
            {showLowStock ? "Hide" : "Show"} Low Stock Items
          </button>
        </div>
      )}

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {selectedCollection && !loading && !error && (
        <>
          {showLowStock && lowStockItems.length > 0 && (
            <div style={{ marginBottom: "2rem" }}>
              <h3 style={{ color: "#e74c3c" }}>Low Stock Items</h3>
              <table border="1">
                <thead>
                  <tr>
                    {headers.map((header, i) => (
                      <th key={i}>{header}</th>
                    ))}
                    <th>Adjust</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockItems.map((item) => (
                    <tr
                      key={item._id}
                      className={item.spareCount < 10 ? "low-stock" : ""}
                    >
                      {getCollectionDetails(selectedCollection).dbFields.map(
                        (field, idx) => {
                          let value = field.includes(".")
                            ? field.split(".").reduce((o, k) => o?.[k], item)
                            : item?.[field];
                          if (Array.isArray(value)) value = value.join(", ");
                          return <td key={idx}>{value ?? "N/A"}</td>;
                        }
                      )}
                      <td>
                        <button onClick={() => updateSpareCount(item._id, 1)}>
                          ➕
                        </button>
                        <button onClick={() => updateSpareCount(item._id, -1)}>
                          ➖
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <h3 style={{ color: "#2c3e50", marginTop: "1.5rem" }}>
            Inventory for {getCollectionDetails(selectedCollection).name}
          </h3>
          <table border="1">
            <thead>
              <tr>
                {headers.map((header, i) => (
                  <th key={i}>{header}</th>
                ))}
                <th>Adjust</th>
              </tr>
            </thead>
            <tbody>
              {inventory.length > 0 ? (
                inventory.map((item) => (
                  <tr key={item._id}>
                    {getCollectionDetails(selectedCollection).dbFields.map(
                      (field, idx) => {
                        let value = field.includes(".")
                          ? field.split(".").reduce((o, k) => o?.[k], item)
                          : item?.[field];
                        if (Array.isArray(value)) value = value.join(", ");
                        return <td key={idx}>{value ?? "N/A"}</td>;
                      }
                    )}
                    <td>
                      <button onClick={() => updateSpareCount(item._id, 1)}>
                        ➕
                      </button>
                      <button onClick={() => updateSpareCount(item._id, -1)}>
                        ➖
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={headers.length + 1}>
                    No inventory data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
