import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import BackButton from "../components/BackButton";
import OrientationAlert from "../components/OrientationAlert";

const API_URL = process.env.REACT_APP_API_BASE_URL;

const PROJECTS = {
  Jogini: {
    name: "Jogini",
    headers: [
      "Spare Description",
      "Vendor",
      "Opening Stock",
      "Received during month",
      "Issued during Month",
      "Issued during year",
      "Closing Stock",
      "Specification",
      "Manufacture",
      "Type",
      "Place",
      "Rate",
      "In stock",
      "Remarks",
      "SpareCount",
    ],
    dbFields: [
      "Spare Discription",
      "Make.Vendor",
      "OPENING STOCK ( NOS )",
      "RECEIVED QTY ( NOS )",
      "Monthly Consumption ( NOS )",
      "issued during year",
      "CLOSING STOCK ( NOS )",
      "specification",
      "manufacture",
      "type",
      "place",
      "rate",
      "instock",
      "remarks",
      "spareCount",
    ],
  },
  Shong: {
    name: "Shong",
    headers: [
      "Spare Description",
      "Manufacture",
      "Vendor",
      "Opening Balance",
      "Received during month",
      "Issued during Month",
      "Issued during Year",
      "Closing Balance",
      "Specification",
      "Place",
      "Rate",
      "In Stock",
      "Types",
      "Remarks",
      "SpareCount",
    ],
    dbFields: [
      "Description of Material",
      "Make",
      "Vendor",
      "Opening Balance",
      "Received during Month",
      "Issued during Month",
      "Issued during Year",
      "Closing Balance",
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
      "Spare Description",
      "Manufacture",
      "Vendor",
      "Opening Balance",
      "Received during month",
      "Issued during Month",
      "Issued during Year",
      "Closing Balance",
      "Specification",
      "Place",
      "Rate",
      "In Stock",
      "Types",
      "Remarks",
      "SpareCount",
    ],
    dbFields: [
      "Description of Material",
      "Make",
      "Vendor",
      "Opening Balance",
      "Received during Month",
      "Issued during Month",
      "Issued during Year",
      "Closing Balance",
      "Code.Specification",
      "Place",
      "Rate",
      "In Stock",
      "TYPES",
      "Remarks",
      "spareCount",
    ],
  },
  SDLLPsalun: {
    name: "SDLLP Salun",
    headers: [
      "Spare Description",
      "Opening Balance",
      "Received during Month",
      "Issue during Month",
      "Issue during Year",
      "Closing Balance",
      "Specification",
      "Manufacture",
      "Vendor",
      "Place",
      "Rate",
      "In Stock",
      "Types",
      "Remarks",
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
      "Place",
      "Rate",
      "IN STOCK",
      "Types",
      "Remarks",
      "spareCount",
    ],
  },
  Kuwarsi: {
    name: "Kuwarsi",
    headers: [
      "Spare Description",
      "Opening Balance",
      "Received during Month",
      "Issue during Month",
      "Issue during Year",
      "Closing Balance",
      "Specification",
      "Manufacture",
      "Vendor",
      "Place",
      "Rate",
      "In Stock",
      "Types",
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
      "Place",
      "Rate",
      "In Stock",
      "Types",
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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

 
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState("");

  const [editedCounts, setEditedCounts] = useState({}); // { [id]: value }
  const [savingId, setSavingId] = useState(null);

  // Get user role and allowed project from localStorage
  const getUserRole = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return {
        role: user?.role || 'user',
        allowedProject: user?.allowedProject || ''
      };
    } catch (error) {
      console.error("Error parsing user data:", error);
      return { role: 'user', allowedProject: '' };
    }
  };

  const { role, allowedProject } = getUserRole();

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

  // Add this function at the top level of the component
  const findItemNameField = (item, collection) => {
    // Debug log the raw item
    console.log("Finding name field for item:", {
      id: item._id,
      collection,
      allFields: Object.keys(item)
    });

    const fieldMappings = {
      jogini: [
        "Spare Discription",
        "Spare Description",
        "spare discription",
        "spare description",
        "SPARE DISCRIPTION",
        "SPARE DESCRIPTION"
      ],
      shong: [
        "Description of Material",
        "description of material",
        "DESCRIPTION OF MATERIAL",
        "Description",
        "description"
      ],
      solding: [
        "Description of Material",
        "description of material",
        "DESCRIPTION OF MATERIAL",
        "Description",
        "description"
      ],
      sdllpsalun: [
        "NAME OF MATERIALS",
        "name of materials",
        "Name of Materials",
        "Name",
        "name"
      ],
      kuwarsi: [
        "NAME OF MATERIALS",
        "name of materials",
        "Name of Materials",
        "Name",
        "name"
      ]
    };

    // Get the fields to check for this collection
    const fieldsToCheck = fieldMappings[collection.toLowerCase()] || ["item_name", "name", "Name"];

    // First check if any of the expected fields exist
    const existingField = fieldsToCheck.find(field => item[field] !== undefined);

    if (!existingField) {
      // No name field exists at all
      return null;
    }

    // Now check if the existing field has a non-empty value
    const value = item[existingField];
    if (value === null || value === undefined || value === "") {
      // Field exists but is empty
      return "Unnamed";
    }

    // Field exists and has a value
    return value;
  };

  // Enhanced low stock notification function with automatic notifications and 10-day reminders
  const checkLowStockAndNotify = async (items) => {
    const lowStockThreshold = 10;
    
    console.log("Starting stock check for:", selectedCollection);
    console.log("Total items to check:", items.length);
    
    // Get previous state from localStorage
    const previousState = JSON.parse(localStorage.getItem('inventoryState') || '{}');
    const currentState = {};
    const lowStockItems = [];

    // Process current items
    items.forEach((item, index) => {
      const itemId = item._id;
      let currentStock;
      
      // Handle different types of spareCount values
      if (typeof item.spareCount === 'number') {
        currentStock = item.spareCount;
      } else if (typeof item.spareCount === 'string') {
        currentStock = parseInt(item.spareCount);
      } else {
        currentStock = 0;
      }

      // Find the item name using our helper function
      const itemName = findItemNameField(item, selectedCollection);
      
      // Debug logging for SDLLP and Kuwarsi
      if (selectedCollection.toLowerCase() === 'sdllpsalun' || selectedCollection.toLowerCase() === 'kuwarsi') {
        console.log(`Processing item in ${selectedCollection}:`, {
          id: itemId,
          stock: currentStock,
          itemName: itemName,
          hasValidStock: !isNaN(currentStock),
          isLowStock: currentStock < lowStockThreshold,
          hasValidName: !!itemName
        });
      }
      
      // Only add to currentState if we have a valid number
      if (!isNaN(currentStock)) {
        currentState[itemId] = currentStock;
        
        // Include items with stock below threshold (including 0) for notifications
        if (currentStock < lowStockThreshold && itemName) {
          console.log(`Low stock item found in ${selectedCollection}:`, {
            id: itemId,
            name: itemName,
            stock: currentStock,
            threshold: lowStockThreshold
          });
          
          lowStockItems.push({
            name: itemName,
            stock: currentStock
          });
        } else if (currentStock < lowStockThreshold && !itemName) {
          console.log(`Low stock item found but no name in ${selectedCollection}:`, {
            id: itemId,
            stock: currentStock,
            itemName: itemName
          });
        }
      }
    });

    // Update low stock items list for UI display
    const filteredItems = items.filter(item => {
      let stock;
      
      if (typeof item.spareCount === 'number') {
        stock = item.spareCount;
      } else if (typeof item.spareCount === 'string') {
        stock = parseInt(item.spareCount);
      } else {
        stock = 0;
      }

      const itemName = findItemNameField(item, selectedCollection);
      
      // Show in table if stock is below threshold (including 0) and name exists
      return !isNaN(stock) && stock < lowStockThreshold && itemName;
    });

    console.log("Final filtered items:", {
      totalItems: items.length,
      filteredCount: filteredItems.length,
      lowStockItems: filteredItems.map(item => ({
        id: item._id,
        name: findItemNameField(item, selectedCollection),
        stock: item.spareCount,
        rawItem: item
      }))
    });
    setLowStockItems(filteredItems);

    // Check for automatic notifications and reminders
    await checkAndSendNotifications(currentState, lowStockItems, previousState);
  };

  // Function to handle automatic notifications only (no reminders)
  const checkAndSendNotifications = async (currentState, lowStockItems, previousState) => {
    const lowStockThreshold = 10;
    
    let shouldSendNotification = false;
    
    // Check if this is first load
    if (Object.keys(previousState).length === 0) {
      shouldSendNotification = lowStockItems.length > 0;
      console.log("First load, notification needed:", shouldSendNotification);
    } else {
      // Check if any stock levels have changed OR if there are new low stock items
      const changedItems = Object.keys(currentState).filter(itemId => 
        currentState[itemId] !== previousState[itemId]
      );
      
      // Send notification if stock changed OR if there are low stock items that weren't there before
      const previousLowStockIds = Object.keys(previousState).filter(id => 
        previousState[id] < lowStockThreshold
      );
      const currentLowStockIds = Object.keys(currentState).filter(id => 
        currentState[id] < lowStockThreshold
      );
      
      const newLowStockItems = currentLowStockIds.filter(id => 
        !previousLowStockIds.includes(id)
      );
      
      shouldSendNotification = (changedItems.length > 0 || newLowStockItems.length > 0) && lowStockItems.length > 0;
      
      console.log("Notification analysis:", {
        changedItems,
        newLowStockItems,
        shouldSendNotification,
        lowStockItemsCount: lowStockItems.length
      });
    }
    
    // Save current state
    localStorage.setItem('inventoryState', JSON.stringify(currentState));
    
    // Send notification if needed
    if (shouldSendNotification && lowStockItems.length > 0) {
      console.log("=== NOTIFICATION TRIGGERED ===");
      console.log("Should send notification:", shouldSendNotification);
      console.log("Low stock items count:", lowStockItems.length);
      console.log("Selected collection:", selectedCollection);
      await sendLowStockNotification(selectedCollection, lowStockItems);
    } else {
      console.log("=== NOTIFICATION NOT TRIGGERED ===");
      console.log("Should send notification:", shouldSendNotification);
      console.log("Low stock items count:", lowStockItems.length);
      console.log("Selected collection:", selectedCollection);
    }
  };

  // Separate function to send low stock notifications with multiple fallback options
  const sendLowStockNotification = async (collection, lowStockItems) => {
    console.log("=== SENDING LOW STOCK NOTIFICATION ===");
    console.log("Collection:", collection);
    console.log("Low stock items:", lowStockItems);
    console.log("Items count:", lowStockItems.length);
    
    const subject = `Low Stock Alert - ${collection}`;
    const details = `Low Stock Items in ${collection}:\n\n` +
      lowStockItems.map(item => 
        `Item: ${item.name}\nCurrent Stock: ${item.stock}\n`
      ).join("\n");
    
    console.log("Email subject:", subject);
    console.log("Email details:", details);

    // Primary email service (FormSubmit)
    try {
      const emailData = new FormData();
      emailData.append("_subject", subject);
      emailData.append("Details", details);
      emailData.append("_captcha", "false");
      emailData.append("_template", "table");
      emailData.append("_autoresponse", "false");

      const response = await fetch("https://formsubmit.co/alliedvercel@gmail.com", {
        method: "POST",
        body: emailData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        console.log("Low stock notification sent successfully via FormSubmit");
        return;
      } else {
        console.warn("FormSubmit failed, trying alternative method");
      }
    } catch (error) {
      console.error("Error sending via FormSubmit:", error);
    }

    // Fallback: Try using your existing email notification system
    try {
      const emailData = new FormData();
      emailData.append("_subject", subject);
      emailData.append("Ticket Details", details);
      emailData.append("_captcha", "false");

      const response = await fetch("https://formsubmit.co/alliedvercel@gmail.com", {
        method: "POST",
        body: emailData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        console.log("Low stock notification sent successfully via fallback method");
      } else {
        console.error("All email methods failed");
      }
    } catch (error) {
      console.error("Error sending via fallback method:", error);
    }
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

      // Add pagination params
      const apiUrl = `${API_URL}/api/${selectedCollection.toLowerCase()}?page=${page}&limit=100`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });

      // Support both old and new backend responses
      const items = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];
      setInventory(items);
      setTotalPages(response.data.totalPages || 1);

      // Check for low stock items after fetching
      await checkLowStockAndNotify(items);

      const details = getCollectionDetails(selectedCollection);
      setHeaders(details.headers);
    } catch (err) {
      console.error("Error fetching inventory:", err);
      setInventory([]);

      if (err.response && err.response.status === 403) {
        // Check if it's because no project is selected
        if (!selectedCollection) {
          setError("Please select a project to view inventory.");
        } else {
          setError(
            err.response.data?.message ||
            "Access denied: Not authorized for this project."
          );
        }
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message && !err.message.includes("Network Error")) {
        setError(err.message || "An error occurred while fetching inventory.");
      }
      
      // Clear inventory if access is denied
      if (err.response && err.response.status === 403) {
        setInventory([]);
        if (!selectedCollection) {
          // Don't clear selectedCollection if it's already empty
        } else {
          setSelectedCollection("");
        }
      }
    } finally {
      setLoading(false);
    }
  }, [selectedCollection, page]);

  useEffect(() => {
    if (selectedCollection) {
      fetchInventory();
    }
  }, [selectedCollection, fetchInventory]);

  const handleCollectionChange = useCallback((e) => {
    const collection = e.target.value;
    setSelectedCollection(collection);
    localStorage.setItem("selectedCollection", collection);
    
    // Clear any existing errors when a project is selected
    if (collection) {
      setError(null);
    }
  }, []);

    // New function to update spare count to a specific value
  const updateSpareCountTo = async (id, newCount) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.token) {
        console.error("No user token found. Please log in.");
        return;
      }
      
      // Debug logging
      console.log("Update request details:", {
        userRole: role,
        userAllowedProject: allowedProject,
        selectedCollection: selectedCollection,
        isAuthorized: role === 'admin' || (role === 'inventoryOnly' && selectedCollection.toLowerCase() === allowedProject.toLowerCase())
      });
      
      // Check authorization before making the request
      if (!(role === 'admin' || (role === 'inventoryOnly' && selectedCollection.toLowerCase() === allowedProject.toLowerCase()))) {
        alert("Access denied: You are not authorized to update spare counts for this project");
        return;
      }
      
      setSavingId(id);
      const response = await axios.put(
        `${API_URL}/api/update-spare`,
        {
          collectionName: selectedCollection,
          id,
          increment: Number(newCount) - Number(inventory.find((item) => item._id === id)?.spareCount || 0),
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
        setEditedCounts((prev) => ({ ...prev, [id]: undefined }));
      }
    } catch (error) {
      console.error("Error updating spares count:", error);
      if (error.response?.status === 401) {
        console.error("Please log in again");
      } else if (error.response?.status === 403) {
        alert("Access denied: " + (error.response?.data?.message || "You are not authorized to update spare counts for this project"));
      } else {
        alert(error.response?.data?.message || error.message || "Failed to update count");
      }
    } finally {
      setSavingId(null);
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
      <OrientationAlert />
      <BackButton url="/home" />
      <h2>View Inventory</h2>
      


      <label>Select Project: </label>
      <select onChange={handleCollectionChange} value={selectedCollection}>
        <option value="">Select a Project</option>
        {Object.keys(PROJECTS)
          .filter(key => {
            // Normal users and admins can see all projects
            if (role === 'user' || role === 'admin') return true;
            // Inventory-only users can only see their assigned project
            if (role === 'inventoryOnly') return key.toLowerCase() === allowedProject.toLowerCase();
            return false;
          })
          .map((key) => (
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
      {error && (
        <p style={{ 
          color: error.includes("Please select a project") ? "#666" : "red",
          fontStyle: error.includes("Please select a project") ? "italic" : "normal"
        }}>
          {error.includes("Please select a project") ? error : `Error: ${error}`}
        </p>
      )}

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
                    <th>{role === 'user' ? 'Spare Count' : 'Adjust Count'}</th>
                    <th>Picture</th>
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
                          
                          // Handle different types of values
                          if (value === null || value === undefined) {
                            value = "N/A";
                          } else if (typeof value === 'object') {
                            // If it's an object, try to stringify it
                            try {
                              value = JSON.stringify(value);
                            } catch (e) {
                              value = "N/A";
                            }
                          } else {
                            // Convert any other type to string
                            value = String(value);
                          }
                          
                          return <td key={idx}>{value}</td>;
                        }
                      )}
                      <td className="spares-btn-container">
                        {/* Show editable input for admin and inventory-only users (for their allowed project) */}
                        {(role === 'admin' || (role === 'inventoryOnly' && selectedCollection.toLowerCase() === allowedProject.toLowerCase())) ? (
                          <>
                            <input
                              type="number"
                              min={0}
                              style={{ width: 70, padding: "4px 6px", fontSize: 14, borderRadius: 4, border: "1px solid #ccc", marginRight: 8 }}
                              value={
                                editedCounts[item._id] !== undefined
                                  ? editedCounts[item._id]
                                  : item.spareCount
                              }
                              disabled={savingId === item._id}
                              onChange={e => {
                                const val = e.target.value;
                                if (/^\d*$/.test(val)) {
                                  setEditedCounts(prev => ({ ...prev, [item._id]: val }));
                                }
                              }}
                              onBlur={e => {
                                if (e.target.value === "") {
                                  setEditedCounts(prev => ({ ...prev, [item._id]: item.spareCount }));
                                }
                              }}
                            />
                            {(editedCounts[item._id] !== undefined && String(editedCounts[item._id]) !== String(item.spareCount)) && (
                              <button
                                onClick={() => updateSpareCountTo(item._id, editedCounts[item._id])}
                                disabled={savingId === item._id || editedCounts[item._id] === ""}
                                style={{
                                  padding: "4px 10px",
                                  background: "#4CAF50",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "4px",
                                  fontSize: 14,
                                  cursor: savingId === item._id ? "not-allowed" : "pointer",
                                  marginLeft: 2,
                                }}
                              >
                                {savingId === item._id ? "Saving..." : "Save"}
                              </button>
                            )}
                          </>
                        ) : (
                          /* Show read-only spareCount for normal users */
                          <span style={{ padding: "4px 6px", fontSize: 14 }}>
                            {item.spareCount || 0}
                          </span>
                        )}
                      </td>
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
                <th>{role === 'user' ? 'Spare Count' : 'Adjust Count'}</th>
                <th>Picture</th>
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
                        
                        // Handle different types of values
                        if (value === null || value === undefined) {
                          value = "N/A";
                        } else if (typeof value === 'object') {
                          // If it's an object, try to stringify it
                          try {
                            value = JSON.stringify(value);
                          } catch (e) {
                            value = "N/A";
                          }
                        } else {
                          // Convert any other type to string
                          value = String(value);
                        }
                        
                        return <td key={idx}>{value}</td>;
                      }
                    )}
                    <td className="spares-btn-container">
                      {/* Show editable input for admin and inventory-only users (for their allowed project) */}
                      {(role === 'admin' || (role === 'inventoryOnly' && selectedCollection.toLowerCase() === allowedProject.toLowerCase())) ? (
                        <>
                          <input
                            type="number"
                            min={0}
                            style={{ width: 70, padding: "4px 6px", fontSize: 14, borderRadius: 4, border: "1px solid #ccc", marginRight: 8 }}
                            value={
                              editedCounts[item._id] !== undefined
                                ? editedCounts[item._id]
                                : item.spareCount
                            }
                            disabled={savingId === item._id}
                            onChange={e => {
                              const val = e.target.value;
                              if (/^\d*$/.test(val)) {
                                setEditedCounts(prev => ({ ...prev, [item._id]: val }));
                              }
                            }}
                            onBlur={e => {
                              if (e.target.value === "") {
                                setEditedCounts(prev => ({ ...prev, [item._id]: item.spareCount }));
                              }
                            }}
                          />
                          {(editedCounts[item._id] !== undefined && String(editedCounts[item._id]) !== String(item.spareCount)) && (
                            <button
                              onClick={() => updateSpareCountTo(item._id, editedCounts[item._id])}
                              disabled={savingId === item._id || editedCounts[item._id] === ""}
                              style={{
                                padding: "4px 10px",
                                background: "#4CAF50",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                fontSize: 14,
                                cursor: savingId === item._id ? "not-allowed" : "pointer",
                                marginLeft: 2,
                              }}
                            >
                              {savingId === item._id ? "Saving..." : "Save"}
                            </button>
                          )}
                        </>
                      ) : (
                        /* Show read-only spareCount for normal users */
                        <span style={{ padding: "4px 6px", fontSize: 14 }}>
                          {item.spareCount || 0}
                        </span>
                      )}
                    </td>
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
          {/* Pagination Controls */}
          <div style={{ margin: '1rem 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ marginRight: 8 }}>
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ marginLeft: 8 }}>
              Next
            </button>
          </div>
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
