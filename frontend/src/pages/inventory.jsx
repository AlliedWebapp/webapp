import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import BackButton from "../components/BackButton";
import OrientationAlert from "../components/OrientationAlert";

const API_URL = process.env.REACT_APP_API_BASE_URL;

const PROJECTS = {
  Jogini: {
    name: "Jogini",
    headers: [
      "Spare Description", "Vendor", "Opening Stock", "Received during month",
      "Issued during Month", "Issued during year", "Closing Stock", "Specification",
      "Manufacture", "Type", "Place", "Rate", "In stock", "Remarks", "SpareCount",
    ],
    dbFields: [
      "Spare Discription", "Make.Vendor", "OPENING STOCK ( NOS )",
      "RECEIVED QTY ( NOS )", "Monthly Consumption ( NOS )",
      "issued during year", "CLOSING STOCK ( NOS )", "specification",
      "manufacture", "type", "place", "rate", "instock", "remarks", "spareCount",
    ],
  },
  Shong: {
    name: "Shong",
    headers: [
      "Spare Description", "Manufacture", "Vendor", "Opening Balance",
      "Received during month", "Issued during Month", "Issued during Year",
      "Closing Balance", "Specification", "Place", "Rate", "In Stock", "Types",
      "Remarks", "SpareCount",
    ],
    dbFields: [
      "Description of Material", "Make", "Vendor", "Opening Balance",
      "Received during Month", "Issued during Month", "Issued during Year",
      "Closing Balance", "Code.Specification", "Place", "Rate", "In Stock",
      "Remarks", "Types", "spareCount",
    ],
  },
  solding: {
    name: "Solding",
    headers: [
      "Spare Description", "Manufacture", "Vendor", "Opening Balance",
      "Received during month", "Issued during Month", "Issued during Year",
      "Closing Balance", "Specification", "Place", "Rate", "In Stock", "Types",
      "Remarks", "SpareCount",
    ],
    dbFields: [
      "Description of Material", "Make", "Vendor", "Opening Balance",
      "Received during Month", "Issued during Month", "Issued during Year",
      "Closing Balance", "Code.Specification", "Place", "Rate", "In Stock",
      "TYPES", "Remarks", "spareCount",
    ],
  },
  SDLLPsalun: {
    name: "SDLLP Salun",
    headers: [
      "Spare Description", "Opening Balance", "Received during Month",
      "Issue during Month", "Issue during Year", "Closing Balance",
      "Specification", "Manufacture", "Vendor", "Place", "Rate", "In Stock",
      "Types", "Remarks", "SpareCount",
    ],
    dbFields: [
      "NAME OF MATERIALS", "OPENING BALANCE", "RECEIVED DURING THE MONTH",
      "ISSUE DURING THE MONTH", "ISSUE DURING THE YEAR (from 1st Jan 2025)",
      "CLOSING BALANCE", "SPECIFICATION", "MAKE.MANUFACTURE", "vendor",
      "Place", "Rate", "IN STOCK", "Types", "Remarks", "spareCount",
    ],
  },
  Kuwarsi: {
    name: "Kuwarsi",
    headers: [
      "Spare Description", "Opening Balance", "Received during Month",
      "Issue during Month", "Issue during Year", "Closing Balance",
      "Specification", "Manufacture", "Vendor", "Place", "Rate", "In Stock",
      "Types", "Remarks", "SpareCount",
    ],
    dbFields: [
      "NAME OF MATERIALS", "OPENING BALANCE", "RECEIVED DURING THE MONTH",
      "ISSUE DURING THE MONTH", "ISSUE DURING THE YEAR ( from 1 jan 2025)",
      "CLOSING BALANCE", "SPECIFICATION", "MAKE.MANUFACTURE", "vendor",
      "Place", "Rate", "In Stock", "Types", "REMARKS", "spareCount",
    ],
  },
};

const Inventory = () => {
  const [selectedCollection, setSelectedCollection] = useState(localStorage.getItem("selectedCollection") || "");
  const [inventory, setInventory] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lowStockItems, setLowStockItems] = useState([]);
  const [showLowStock, setShowLowStock] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [lowPage, setLowPage] = useState(1);

  // Image modal + inline count editing
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState("");
  const [editedCounts, setEditedCounts] = useState({});
  const [savingId, setSavingId] = useState(null);

  const user = useMemo(() => JSON.parse(localStorage.getItem("user") || "{}"), []);
  const { role = "user", allowedProject = "" } = user;

  const checkLowStock = useCallback((data) => {
    const lowStock = data.filter(
      (item) => Number(item.spareCount) < 10 && !isNaN(item.spareCount)
    );
    setLowStockItems(lowStock);
  }, []);

  const fetchInventory = useCallback(async () => {
    if (!selectedCollection) return;
    const controller = new AbortController();
    setLoading(true);
    setError("");

    try {
      const res = await axios.get(
        `${API_URL}/api/${selectedCollection.toLowerCase()}?page=${page}&limit=30`,
        {
          headers: { Authorization: `Bearer ${user?.token}` },
          signal: controller.signal,
        }
      );
      const items = Array.isArray(res.data) ? res.data : res.data.data || [];
      const totalPages = res.data?.totalPages || res.data?.pages || 1;
      const totalCount = res.data?.total || items.length;
      setInventory(items);
      setPages(totalPages);
      setTotal(totalCount);
      setHeaders(PROJECTS[selectedCollection]?.headers || []);
      checkLowStock(items);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      if (err.name !== "CanceledError") {
        console.error("Error fetching inventory:", err);
        setError("Failed to load inventory data. Please refresh.");
      }
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  }, [selectedCollection, page, user?.token, checkLowStock]);

  // Load ALL low stock items across all pages when toggled on
  useEffect(() => {
    const loadAllLowStock = async () => {
      if (!showLowStock || !selectedCollection) return;
      setLoading(true);
      setError("");

      try {
        const firstRes = await axios.get(
          `${API_URL}/api/${selectedCollection.toLowerCase()}?page=1`,
          { headers: { Authorization: `Bearer ${user?.token}` } }
        );

        const { results: firstResults = [], pages: totalPages = 1 } = firstRes.data || {};

        let allResults = [...firstResults];

        if (totalPages > 1) {
          const pageNumbers = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
          const requests = pageNumbers.map((p) =>
            axios.get(
              `${API_URL}/api/${selectedCollection.toLowerCase()}?page=${p}`,
              { headers: { Authorization: `Bearer ${user?.token}` } }
            )
          );

          const responses = await Promise.all(requests);
          for (const r of responses) {
            const { results = [] } = r.data || {};
            allResults = allResults.concat(results);
          }
        }

        const low = allResults.filter(
          (item) => Number(item.spareCount) < 10 && !isNaN(item.spareCount)
        );
        setLowStockItems(low);
      } catch (err) {
        console.error("Error loading all low stock:", err);
        setError("Failed to load low stock items.");
      } finally {
        setLoading(false);
      }
    };

    loadAllLowStock();
  }, [showLowStock, selectedCollection, user?.token]);

  useEffect(() => {
    if (selectedCollection) {
      localStorage.setItem("selectedCollection", selectedCollection);
      fetchInventory();
    }
  }, [selectedCollection, fetchInventory]);

  const handleCollectionChange = (e) => {
    const collection = e.target.value;
    setSelectedCollection(collection);
    setInventory([]);
    setPage(1);
    setError("");
  };

  const LOW_PAGE_SIZE = 30;
  const lowPages = Math.max(1, Math.ceil(lowStockItems.length / LOW_PAGE_SIZE));
  const visibleLowStock = lowStockItems.slice(
    (lowPage - 1) * LOW_PAGE_SIZE,
    lowPage * LOW_PAGE_SIZE
  );
  const visibleItems = showLowStock ? visibleLowStock : inventory;

  // Low-stock view should show ALL low-stock items across all pages
  useEffect(() => {
    const loadAllLowStock = async () => {
      if (!showLowStock || !selectedCollection) return;
      setLoading(true);
      setError("");
      try {
        const first = await axios.get(
          `${API_URL}/api/${selectedCollection.toLowerCase()}?page=1&limit=30`,
          { headers: { Authorization: `Bearer ${user?.token}` } }
        );
        const firstItems = Array.isArray(first.data) ? first.data : first.data.data || [];
        const totalPages = first.data?.totalPages || 1;
        let all = [...firstItems];
        if (totalPages > 1) {
          const nums = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
          const reqs = nums.map((p) =>
            axios.get(
              `${API_URL}/api/${selectedCollection.toLowerCase()}?page=${p}&limit=30`,
              { headers: { Authorization: `Bearer ${user?.token}` } }
            )
          );
          const resps = await Promise.all(reqs);
          for (const r of resps) {
            const part = Array.isArray(r.data) ? r.data : r.data.data || [];
            all = all.concat(part);
          }
        }
        const low = all.filter((it) => Number(it.spareCount) < 10 && !isNaN(it.spareCount));
        setLowStockItems(low);
        setLowPage(1);
      } catch (e) {
        console.error("Error loading all low stock:", e);
        setError("Failed to load low stock items.");
      } finally {
        setLoading(false);
      }
    };
    loadAllLowStock();
  }, [showLowStock, selectedCollection, user?.token]);

  const arrayBufferToBase64 = (bufferArray) => {
    let binary = "";
    const bytes = new Uint8Array(bufferArray);
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return window.btoa(binary);
  };

  const getBase64FromPicture = (picture) => {
    if (!picture || !picture.data) return null;
    if (typeof picture.data === "string") return picture.data;
    if (typeof picture.data === "object" && Array.isArray(picture.data.data)) {
      return arrayBufferToBase64(picture.data.data);
    }
    return null;
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

  const updateSpareCountTo = async (id, newCount) => {
    try {
      if (!(role === 'admin' || (role === 'inventoryOnly' && selectedCollection && selectedCollection.toLowerCase() === allowedProject.toLowerCase()))) {
        alert("Access denied: You are not authorized to update spare counts for this project");
        return;
      }

      setSavingId(id);
      const current = inventory.find((it) => it._id === id)?.spareCount || 0;
      const increment = Number(newCount) - Number(current);
      const resp = await axios.put(
        `${API_URL}/api/update-spare`,
        { collectionName: selectedCollection, id, increment },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      if (resp.data?.success) {
        const updatedCount = resp.data.spareCount;
        setInventory((prev) => prev.map((it) => (it._id === id ? { ...it, spareCount: updatedCount } : it)));
        setLowStockItems((prev) => prev.map((it) => (it._id === id ? { ...it, spareCount: updatedCount } : it)).filter((it) => Number(it.spareCount) < 10));
        setEditedCounts((prev) => ({ ...prev, [id]: undefined }));
      }
    } catch (error) {
      console.error("Error updating spares count:", error);
      if (error.response?.status === 403) {
        alert("Access denied: " + (error.response?.data?.message || "Not authorized"));
      } else {
        alert(error.response?.data?.message || error.message || "Failed to update count");
      }
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      <OrientationAlert />
      <BackButton url="/inventory-main" />
      <h2>Inventory Management</h2>

      {/* Project Selector */}
      <div style={{ margin: "1rem 0" }}>
        <label style={{ marginRight: "10px" }}>Select Project:</label>
        <select
          onChange={handleCollectionChange}
          value={selectedCollection}
          style={{ padding: "6px 10px", borderRadius: "5px" }}
        >
          <option value="">Select</option>
          {Object.keys(PROJECTS)
            .filter((key) =>
              role === "inventoryOnly"
                ? key.toLowerCase() === allowedProject.toLowerCase()
                : true
            )
            .map((key) => (
              <option key={key} value={key}>
                {PROJECTS[key].name}
              </option>
            ))}
        </select>
      </div>

      {selectedCollection && (
        <div style={{ marginBottom: "1rem" }}>
          <button
            onClick={() => setShowLowStock((prev) => !prev)}
            style={{
              background: showLowStock ? "#2ecc71" : "#e74c3c",
              color: "#fff",
              padding: "8px 12px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {showLowStock ? "Show All Items" : "Show Low Stock"}
          </button>
        </div>
      )}

      {loading ? (
        <p>Loading inventory...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        selectedCollection && (
          <>
            {showLowStock && (
              <div style={{ marginBottom: "1rem" }}>
                <h3 style={{ color: "#e74c3c" }}>Low Stock Items ({lowStockItems.length})</h3>
                <table border="1" style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                  <thead style={{ background: "#f4f4f4" }}>
                    <tr>
                      {headers.map((h, i) => (
                        <th key={i} style={{ padding: "8px" }}>{h}</th>
                      ))}
                      <th>{role === 'user' ? 'Spare Count' : 'Adjust Count'}</th>
                      <th>Picture</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleLowStock.map((item) => (
                      <tr key={item._id} className={Number(item.spareCount) < 10 ? "low-stock" : ""}>
                        {PROJECTS[selectedCollection].dbFields.map((field, i) => {
                          const value = field.split(".").reduce((acc, key) => acc?.[key], item);
                          return (
                            <td key={i} style={{ padding: "6px" }}>{value ?? "N/A"}</td>
                          );
                        })}
                        <td>
                          {(role === 'admin' || (role === 'inventoryOnly' && selectedCollection.toLowerCase() === allowedProject.toLowerCase())) ? (
                            <>
                              <input
                                type="number"
                                min={0}
                                style={{ width: 70, padding: "4px 6px", fontSize: 14, borderRadius: 4, border: "1px solid #ccc", marginRight: 8 }}
                                value={editedCounts[item._id] !== undefined ? editedCounts[item._id] : item.spareCount}
                                disabled={savingId === item._id}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (/^\d*$/.test(val)) setEditedCounts((prev) => ({ ...prev, [item._id]: val }));
                                }}
                                onBlur={(e) => {
                                  if (e.target.value === "") setEditedCounts((prev) => ({ ...prev, [item._id]: item.spareCount }));
                                }}
                              />
                              {(editedCounts[item._id] !== undefined && String(editedCounts[item._id]) !== String(item.spareCount)) && (
                                <button
                                  onClick={() => updateSpareCountTo(item._id, editedCounts[item._id])}
                                  disabled={savingId === item._id || editedCounts[item._id] === ""}
                                  style={{ padding: "4px 10px", background: "#4CAF50", color: "white", border: "none", borderRadius: "4px", fontSize: 14, cursor: savingId === item._id ? "not-allowed" : "pointer" }}
                                >
                                  {savingId === item._id ? "Saving..." : "Save"}
                                </button>
                              )}
                            </>
                          ) : (
                            <span style={{ padding: "4px 6px", fontSize: 14 }}>{item.spareCount || 0}</span>
                          )}
                        </td>
                        <td>
                          {item.picture && item.picture.data ? (
                            <button onClick={() => openImageModal(item)} style={{ padding: "2px 6px", backgroundColor: "white", border: "1px solid black", borderRadius: 4, fontSize: 12 }}>View Image</button>
                          ) : (
                            "—"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Low stock pagination controls */}
                <div style={{ marginTop: "1rem", textAlign: "center" }}>
                  <button
                    disabled={lowPage <= 1}
                    onClick={() => setLowPage((p) => Math.max(1, p - 1))}
                    style={{
                      marginRight: "10px",
                      padding: "8px 12px",
                      background: "#3498db",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: lowPage <= 1 ? "not-allowed" : "pointer",
                    }}
                  >
                    ⬅ Prev
                  </button>
                  <span style={{ margin: "0 8px" }}>Page {lowPage} / {lowPages}</span>
                  <button
                    disabled={lowPage >= lowPages}
                    onClick={() => setLowPage((p) => Math.min(lowPages, p + 1))}
                    style={{
                      padding: "8px 12px",
                      background: "#3498db",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: lowPage >= lowPages ? "not-allowed" : "pointer",
                    }}
                  >
                    Next ➡
                  </button>
                </div>
                {lowStockItems.length === 0 && <p>No items under 10 in stock.</p>}
              </div>
            )}
            {!showLowStock && (
              <>
                {/* Main Inventory Table */}
                <h3 style={{ color: "#2c3e50", marginTop: 0 }}>
                  {`Page ${page} / ${pages} (${total} items)`}
                </h3>
                <table border="1" style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                  <thead style={{ background: "#f4f4f4" }}>
                    <tr>
                      {headers.map((h, i) => (
                        <th key={i} style={{ padding: "8px" }}>{h}</th>
                      ))}
                      <th>{role === 'user' ? 'Spare Count' : 'Adjust Count'}</th>
                      <th>Picture</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((item) => (
                      <tr key={item._id}>
                        {PROJECTS[selectedCollection].dbFields.map((field, i) => {
                          const value = field.split(".").reduce((acc, key) => acc?.[key], item);
                          return (
                            <td key={i} style={{ padding: "6px" }}>{value ?? "N/A"}</td>
                          );
                        })}
                        <td>
                          {(role === 'admin' || (role === 'inventoryOnly' && selectedCollection.toLowerCase() === allowedProject.toLowerCase())) ? (
                            <>
                              <input
                                type="number"
                                min={0}
                                style={{ width: 70, padding: "4px 6px", fontSize: 14, borderRadius: 4, border: "1px solid #ccc", marginRight: 8 }}
                                value={editedCounts[item._id] !== undefined ? editedCounts[item._id] : item.spareCount}
                                disabled={savingId === item._id}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (/^\d*$/.test(val)) setEditedCounts((prev) => ({ ...prev, [item._id]: val }));
                                }}
                                onBlur={(e) => {
                                  if (e.target.value === "") setEditedCounts((prev) => ({ ...prev, [item._id]: item.spareCount }));
                                }}
                              />
                              {(editedCounts[item._id] !== undefined && String(editedCounts[item._id]) !== String(item.spareCount)) && (
                                <button
                                  onClick={() => updateSpareCountTo(item._id, editedCounts[item._id])}
                                  disabled={savingId === item._id || editedCounts[item._id] === ""}
                                  style={{ padding: "4px 10px", background: "#4CAF50", color: "white", border: "none", borderRadius: "4px", fontSize: 14, cursor: savingId === item._id ? "not-allowed" : "pointer" }}
                                >
                                  {savingId === item._id ? "Saving..." : "Save"}
                                </button>
                              )}
                            </>
                          ) : (
                            <span style={{ padding: "4px 6px", fontSize: 14 }}>{item.spareCount || 0}</span>
                          )}
                        </td>
                        <td>
                          {item.picture && item.picture.data ? (
                            <button onClick={() => openImageModal(item)} style={{ padding: "4px 8px", backgroundColor: "black", color: "#fff", border: "none", borderRadius: 4, fontSize: 10 }}>View Image</button>
                          ) : (
                            "—"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination Controls */}
                <div style={{ marginTop: "1rem", textAlign: "center" }}>
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    style={{
                      marginRight: "10px",
                      padding: "8px 12px",
                      background: "#3498db",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: page <= 1 ? "not-allowed" : "pointer",
                    }}
                  >
                    ⬅ Prev
                  </button>
                  <button
                    disabled={page >= pages}
                    onClick={() => setPage((p) => p + 1)}
                    style={{
                      padding: "8px 12px",
                      background: "#3498db",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: page >= pages ? "not-allowed" : "pointer",
                    }}
                  >
                    Next ➡
                  </button>
                </div>
              </>
            )}
          </>
        )
      )}
      {isImageModalOpen && (
        <div
          onClick={closeImageModal}
          style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: "#fff", padding: "1rem", borderRadius: 8, maxWidth: "90vw", maxHeight: "90vh", overflow: "auto", position: "relative" }}
          >
            <button
              onClick={closeImageModal}
              style={{ position: "absolute", top: "1rem", right: "1rem", background: "transparent", border: "none", fontSize: "1.5rem", cursor: "pointer" }}
            >
              ✖
            </button>
            <img src={modalImageSrc} alt="Full view" style={{ maxWidth: "100%", maxHeight: "80vh", display: "block", margin: "0 auto" }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
