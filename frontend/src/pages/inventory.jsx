import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import BackButton from "../components/BackButton";

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
  // Sync state with localStorage on selection change
  useEffect(() => {
    if (selectedCollection) {
      localStorage.setItem("selectedCollection", selectedCollection);
    }
  }, [selectedCollection]);

  // Function to get collection details
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


  // Fetch Inventory Data
  const fetchInventory = useCallback(async () => {
    if (!selectedCollection) return;

    setLoading(true);
    setError(null);

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.token) {
        console.error("No user token found. Please log in.");
        return;
      }

      // Use the environment variable for production URL
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/api/${selectedCollection}`;
      console.log(`Fetching inventory from: ${apiUrl}`);

      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log("Fetched Inventory Data:", response.data);

      const collectionDetails = getCollectionDetails(selectedCollection);
      const items = response.data.data || [];
      setInventory(items);
      setHeaders(collectionDetails.headers || []);
      setLowStockItems(items.filter(item => item.spareCount < 10)); // ✅ Set low stock items
    } catch (err) {
      console.error("Error fetching inventory:", err);
      setInventory([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedCollection]);

  // Fetch inventory when collection changes
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
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.token) {
        console.error("No user token found. Please log in.");
        return;
      }

      const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/update-spare/`, {
        collectionName: selectedCollection,
        id,
        increment,
      }, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (response.data.success) {
        // ✅ Instead of fetching the whole inventory, update only the affected item
        setInventory((prevInventory) =>
          prevInventory.map((item) =>
            item._id === id ? { ...item, spareCount: response.data.spareCount } : item
          )
        );
      
        // Update the low stock items state based on the updated inventory
        setLowStockItems((prevLowStock) => {
          // Create an updated inventory array with the changed spare count
          const updated = inventory.map((item) =>
            item._id === id ? { ...item, spareCount: response.data.spareCount } : item
          );
      
          // Filter items with spareCount less than 10 (low stock items)
          return updated.filter(item => item.spareCount < 10);
        });
      }
      } catch (error) {
        console.error("Error updating spares count:", error);
        if (error.response?.status === 401) {
          // Handle unauthorized error (token expired or invalid)
          console.error("Please log in again");
        }
      }
    };
      


  return (
    <div>
      <BackButton url="/" />
      <h2>View Inventory</h2>
      <label>Select Project: </label>
      <select onChange={handleCollectionChange} value={selectedCollection}>
        <option value="">Select a Project</option>
        {["Jogini", "Shong", "solding", "SDLLPsalun", "Kuwarsi"].map((key) => (
          <option key={key} value={key}>{getCollectionDetails(key).name}</option>
        ))}
      </select>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {selectedCollection && !loading && !error && (
        <div>
          <h3>Inventory for {getCollectionDetails(selectedCollection)?.name}</h3>
          <table border="1">
            <thead>
              <tr>{headers.map((header, index) => (<th key={index}>{header}</th>))}</tr>
            </thead>
            <tbody>
              {inventory.length > 0 ? (
                inventory.map((item, index) => (
                  <tr key={index}>
                    {getCollectionDetails(selectedCollection).dbFields.map((field, idx) => {
                      let value = field.includes(".")
                        ? field.split(".").reduce((obj, key) => obj?.[key], item)
                        : item?.[field] ?? "N/A";
                      if (Array.isArray(value)) value = value.join(", ");
                      return <td key={idx}>{value ?? "N/A"}</td>;
                    })}
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
                <tr><td colSpan={headers.length}>No inventory data available</td></tr>
              )}
            </tbody>
          </table>
          {lowStockItems.length > 0 && (
  <div style={{ margin: "1rem 0" }}>
    <button 
      onClick={() => setShowLowStock(!showLowStock)} 
      style={{ padding: "8px 12px", backgroundColor: "#f39c12", color: "#fff", border: "none", cursor: "pointer", borderRadius: "5px" }}
    >
      {showLowStock ? "Hide" : "Show"} Low Stock Items (Less than 10)
    </button>

    {showLowStock && (
      <div style={{ marginTop: "1rem" }}>
        <h3>Low Stock Items</h3>
        <table border="1">
          <thead>
            <tr>{headers.map((header, index) => (<th key={index}>{header}</th>))}</tr>
          </thead>
          <tbody>
            {lowStockItems.map((item, index) => (
              <tr key={index}>
                {getCollectionDetails(selectedCollection).dbFields.map((field, idx) => {
                  let value = field.includes(".")
                    ? field.split(".").reduce((obj, key) => obj?.[key], item)
                    : item?.[field] ?? "N/A";
                  if (Array.isArray(value)) value = value.join(", ");
                  return <td key={idx}>{value ?? "N/A"}</td>;
                })}
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
      </div>
    )}
  </div>
)}
        </div>
      )}
    </div>
  );
};

export default Inventory;
