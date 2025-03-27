import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const Inventory = () => {
  const [selectedCollection, setSelectedCollection] = useState("");
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [headers, setHeaders] = useState([]);
  const [error, setError] = useState(null);

  // Function to get collection details using switch case
  const getCollectionDetails = (collection) => {
    switch (collection) {
      case "Jogini":
        return {
          name: "Jogini",
          headers: [
            "Spare Description",
            "Vendor",
            "Month",
            "Opening Stock",
            "Monthly Consumption",
            "Closing Stock",
            "SpareCount",
          ],
          dbFields: [
            "Spare Discription",
            "Make.Vendor",
            "Month",
            "OPENING STOCK ( NOS )",
            "Monthly Consumption ( NOS )",
            "CLOSING STOCK ( NOS )",
            "spareCount"
          ],
        };
        case "Shong":
          return {
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
              "spareCount"
            ],
          };
        
         case "solding":
            return {
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
            "spareCount"
          ],
        };
      case "SDLLPsalun":
        return {
          name: "SDLLP Salun",
          headers: [
            "Name of Materials",
            "Opening Balance",
            "Received during the month",
            "Total",
            "Issue during the month",
            "Issue during the year ",
            "Closing Balance",
            "Specification",
            "Manufacture",
            "Types",
            "SpareCount",
          ],
          dbFields: [
            "NAME OF MATERIALS",
            "OPENING BALANCE",
            "RECEIVED DURING THE MONTH",
            "TOTAL",
            "ISSUE DURING THE MONTH",
            "ISSUE DURING THE YEAR (from 1st Jan 2025)",
            "CLOSING BALANCE",
            "SPECIFICATION",
            "MAKE.MANUFACTURE",
            "Types",
            "spareCount"
          ],
        };
      case "Kuwarsi":
        return {
          name: "Kuwarsi",
          headers: [
            "Name of Materials",
            "Opening balance",
            "Received during the month",
            "Total",
            "Issue during the month",
            "Issue during the year",
            "Closing balance",
            "Specification",
            "Manufacture",
            "Remarks",
            "SpareCount",
          ],
          dbFields: [
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
          ],
        };
      default:
        return { name: "", headers: [], dbFields: [] };
    }
  };

  // Fetch Inventory Data using axios
  const fetchInventory = useCallback(async () => {
    if (!selectedCollection) return;

    setLoading(true);
    setError(null);

    try {
      const apiUrl = `http://localhost:5000/api/${selectedCollection}`;
      console.log(`Fetching inventory from: ${apiUrl}`);

      // Use axios to fetch data
      const response = await axios.get(apiUrl);
      console.log("Fetched Inventory Data:", response.data);

      const collectionDetails = getCollectionDetails(selectedCollection);
      setInventory(response.data.data || []);
      setHeaders(collectionDetails.headers || []);
    } catch (err) {
      console.error("Error fetching inventory:", err);
      setInventory([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedCollection]);

  useEffect(() => {
    if (selectedCollection) {
      fetchInventory();
    }
  }, [selectedCollection, fetchInventory]);

   // Function to update spares count
   const updatesparesCount = async (id, increment) => {
    try {
      setInventory((prevInventory) =>
        prevInventory.map((item) => {
          if (item._id === id) {
            const newCount = item.spareCount + increment;
            if (newCount < 0) return item; // Prevent count from going below 0
          }
          return item;
        })
      );

      const response = await axios.put("http://localhost:5000/api/spares/update-spares", {
        collectionName: selectedCollection,
        id,
        increment,
      });

      if (response.data.success) {
        setInventory((prevInventory) =>
          prevInventory.map((item) =>
            item._id === id ? { ...item, spareCount: Math.max(0, item.spareCount + increment) } : item
          )
        );
      }
    } catch (error) {
      console.error("Error updating spares count:", error);
    }
  };


  return (
    <div>
      <h2>View Inventory</h2>
      <label>Select Project: </label>
      <select onChange={(e) => setSelectedCollection(e.target.value)} value={selectedCollection}>
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
                         <button className="spares-btn" onClick={() => updatesparesCount(item._id, 1)}>➕</button>
                        <button className="spares-btn minus" onClick={() => updatesparesCount(item._id, -1)}>➖</button>
                  </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={headers.length}>No inventory data available</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Inventory;
