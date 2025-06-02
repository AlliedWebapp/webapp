import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import BackButton from "../components/BackButton";

const API_URL = process.env.REACT_APP_API_BASE_URL;

const PROJECTS = {
  Jogini: {
    name: "Jogini",
    headers: [
      "Spare Description",
      "Vendor",
      "Month",
      "Opening Stock",
      "Received Qty",
      "Monthly Consumption",
      "Closing Stock",
      "SpareCount",
    ],
    dbFields: [
      "Spare Discription",
      "Make.Vendor",
      "Month",
      "OPENING STOCK ( NOS )",
      "RECEIVED QTY ( NOS )",
      "Monthly Consumption ( NOS )",
      "CLOSING STOCK ( NOS )",
      "spareCount",
    ],
  },
  Shong: {
    name: "Shong",
    headers: [
      "Description of Material",
      "Make",
      "Vendor",
      "Specification",
      "Place",
      "Rate",
      "In Stock",
      "Remarks",
      "Types",
      "SpareCount",
    ],
    dbFields: [
      "Description of Material",
      "Make",
      "Vendor",
      "Code.Specification",
      "Place",
      "Rate",
      "In Stock",
      "Remarks",
      "Types",
      "spareCount",
    ],
  },
  solding: {
    name: "solding",
    headers: [
      "Description of Material",
      "Make",
      "Vendor",
      "Specification",
      "Place",
      "Rate",
      "In Stock",
      "Types",
      "SpareCount",
    ],
    dbFields: [
      "Description of Material",
      "Make",
      "Vendor",
      "Code.Specification",
      "Place",
      "Rate",
      "In Stock",
      "TYPES",
      "spareCount",
    ],
  },
  SDLLPsalun: {
    name: "SDLLP Salun",
    headers: [
      "Name of Materials",
      "Opening Balance",
      "Received during Month",
      "Issue during Month",
      "Issue during Year",
      "Closing Balance",
      "Specification",
      "Manufacture",
      "Vendor",
      "Types",
      "SpareCount",
    ],
    dbFields: [
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
  },
  Kuwarsi: {
    name: "Kuwarsi",
    headers: [
      "Name of Materials",
      "Opening Balance",
      "Received during Month",
      "Issue during Month",
      "Issue during Year",
      "Closing Balance",
      "Specification",
      "Manufacture",
      "Vendor",
      "Remarks",
      "SpareCount",
    ],
    dbFields: [
      "NAME OF MATERIALS",
      "OPENING BALANCE",
      "RECEIVED DURING THE MONTH",
      "ISSUE DURING THE MONTH",
      "ISSUE DURING THE YEAR ( from 1 jan 2025)",
      "CLOSING BALANCE",
      "SPECIFICATION",
      "MAKE.MANUFACTURE",
      "vendor",
      "REMARKS",
      "spareCount",
    ],
  },
};

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

  // Modal state for showing a clicked image
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState("");

  useEffect(() => {
    if (selectedCollection) {
      localStorage.setItem("selectedCollection", selectedCollection);
    }
  }, [selectedCollection]);

  const getCollectionDetails = (collection) => {
    return PROJECTS[collection] || { name: "", headers: [], dbFields: [] };
  };

  // Converts an ArrayBuffer / Uint8Array (bytes) into a Base64 string
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

    return null;
  };

  const fetchInventory = useCallback(async () => {
    if (!selectedCollection) return;

    setLoading(true);
    setError(null);

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.token) {
        console.error("No user token found. Please log in.");
        return;
      }

      const apiUrl = `${API_URL}/api/${selectedCollection.toLowerCase()}`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });

      const items = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];

      setInventory(items);

      const details = getCollectionDetails(selectedCollection);
      setHeaders(details.headers);

      setLowStockItems(items.filter((item) => item.spareCount < 10));
    } catch (err) {
      console.error("Error fetching inventory:", err);
      setInventory([]);

      if (err.response && err.response.status === 403) {
        setError(
          err.response.data?.message ||
            "Access denied: Not authorized for this project."
        );
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || "An error occurred while fetching inventory.");
      }
    } finally {
      setLoading(false);
    }
  }, [selectedCollection]);

  useEffect(() => {
    if (selectedCollection) {
      fetchInventory();
    }
  }, [selectedCollection, fetchInventory]);

  const handleCollectionChange = useCallback((e) => {
    const collection = e.target.value;
    setSelectedCollection(collection);
    localStorage.setItem("selectedCollection", collection);
  }, []);

  const updatespareCount = async (id, increment) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.token) {
        console.error("No user token found. Please log in.");
        return;
      }

      const response = await axios.put(
        `${API_URL}/api/update-spare/`,
        {
          collectionName: selectedCollection,
          id,
          increment,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.data.success) {
        setInventory((prevInventory) =>
          prevInventory.map((item) =>
            item._id === id
              ? { ...item, spareCount: response.data.spareCount }
              : item
          )
        );
        setLowStockItems((prevLowStock) => {
          const updated = inventory.map((item) =>
            item._id === id
              ? { ...item, spareCount: response.data.spareCount }
              : item
          );
          return updated.filter((item) => item.spareCount < 10);
        });
      }
    } catch (error) {
      console.error("Error updating spares count:", error);
      if (error.response?.status === 401) {
        console.error("Please log in again");
      }
    }
  };

  const openImageModal = (item) => {
    if (!item.picture || !item.picture.data) return;
    const b64 = getBase64FromPicture(item.picture);
    if (!b64) return;
    const mime = item.picture.contentType;
    setModalImageSrc(`data:${mime};base64,${b64}`);
    setImageModalOpen(true);
  };

  const closeImageModal = () => {
    setImageModalOpen(false);
    setModalImageSrc("");
  };

  return (
    <div>
      <BackButton url="/" />
      <h2>View Inventory</h2>

      <label>Select Project: </label>
      <select onChange={handleCollectionChange} value={selectedCollection}>
        <option value="">Select a Project</option>
        {Object.keys(PROJECTS).map((key) => (
          <option key={key} value={key}>
            {PROJECTS[key].name}
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

      {/* Low Stock Toggle Button */}
      {selectedCollection && (
        <div style={{ margin: "1rem 0" }}>
          <button
            onClick={() => setShowLowStock(!showLowStock)}
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
        <div>
          {/* Low Stock Items Table */}
          {showLowStock && lowStockItems.length > 0 && (
            <div style={{ marginBottom: "2rem" }}>
              <h3 style={{ color: "#e74c3c" }}>Low Stock Items</h3>
              <table border="1">
                <thead>
                  <tr>
                    {headers.map((header, index) => (
                      <th key={index}>{header}</th>
                    ))}
                    <th>Picture</th>
                    <th>Adjust</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockItems.map((item, index) => (
                    <tr
                      key={index}
                      className={item.spareCount < 10 ? "low-stock" : ""}
                    >
                      {getCollectionDetails(selectedCollection).dbFields.map(
                        (field, idx) => {
                          let value = field.includes(".")
                            ? field
                                .split(".")
                                .reduce((obj, key) => obj?.[key], item)
                            : item?.[field] ?? "N/A";
                          if (Array.isArray(value)) value = value.join(", ");
                          return <td key={idx}>{value ?? "N/A"}</td>;
                        }
                      )}
                      {/* Picture Button Cell */}
                      <td>
                        {item.picture && item.picture.data ? (
                          <button
                            onClick={() => openImageModal(item)}
                            style={{
                              padding: "2px 2px",
                              backgroundColor: "white",
                              border: "black 1px solid",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "12px",
                            }}
                          >
                            View Image
                          </button>
                        ) : (
                          "—"
                        )}
                      </td>

                      <td className="spares-btn-container">
                        <button
                          className="spares-btn"
                          onClick={() => updatespareCount(item._id, 1)}
                        >
                          ➕
                        </button>
                        <button
                          className="spares-btn minus"
                          onClick={() => updatespareCount(item._id, -1)}
                        >
                          ➖
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {lowStockItems.length === 0 && (
                <p>No items under 10 in stock.</p>
              )}
            </div>
          )}

          {/* Main Inventory Table */}
          <h3 style={{ color: "#2c3e50", marginTop: "1.5rem" }}>
            Inventory for {getCollectionDetails(selectedCollection).name}
          </h3>
          <table border="1">
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
                <th>Picture</th>
                <th>Adjust</th>
              </tr>
            </thead>
            <tbody>
              {inventory.length > 0 ? (
                inventory.map((item, index) => (
                  <tr key={index}>
                    {getCollectionDetails(selectedCollection).dbFields.map(
                      (field, idx) => {
                        let value = field.includes(".")
                          ? field
                              .split(".")
                              .reduce((obj, key) => obj?.[key], item)
                          : item?.[field] ?? "N/A";
                        if (Array.isArray(value)) value = value.join(", ");
                        return <td key={idx}>{value ?? "N/A"}</td>;
                      }
                    )}
                    {/* Picture Button Column */}
                    <td>
                      {item.picture && item.picture.data ? (
                        <button
                          onClick={() => openImageModal(item)}
                          style={{
                            padding: "4px 8px",
                            backgroundColor: "black",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "10px",
                          }}
                        >
                          View Image
                        </button>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="spares-btn-container">
                      <button
                        className="spares-btn"
                        onClick={() => updatespareCount(item._id, 1)}
                      >
                        ➕
                      </button>
                      <button
                        className="spares-btn minus"
                        onClick={() => updatespareCount(item._id, -1)}
                      >
                        ➖
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={headers.length + 2}>
                    No inventory data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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

export default Inventory;
