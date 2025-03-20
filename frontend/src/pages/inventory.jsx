import { useEffect, useState } from "react";

const ViewInventory = () => {
    const [inventory, setInventory] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const response = await fetch("https://backend-services-theta.vercel.app/api/inventory");

                if (!response.ok) throw new Error("Failed to fetch inventory data");

                const data = await response.json();
                console.log("Received Data:", data); // Debugging log
                
                setInventory(data);
            } catch (error) {
                console.error("Error fetching inventory:", error);
                setError("Failed to fetch inventory data.");
            } finally {
                setLoading(false);
            }
        };

        fetchInventory();
    }, []);

    if (loading) return <p>Loading inventory data...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <h2>Inventory</h2>
            {Object.keys(inventory).length > 0 ? (
                Object.entries(inventory).map(([collection, items]) => (
                    <div key={collection} style={{ marginBottom: "20px" }}>
                        <h3>{collection.charAt(0).toUpperCase() + collection.slice(1)} Collection</h3>
                        {items.length > 0 ? (
                            <table border="1" cellPadding="5">
                                <thead>
                                    <tr>
                                        {Object.keys(items[0]).map((key) => (
                                            <th key={key}>{key.replace(/_/g, " ")}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, index) => (
                                        <tr key={index}>
                                            {Object.values(item).map((value, idx) => (
                                                <td key={idx}>{typeof value === "object" ? JSON.stringify(value) : value}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No data available in {collection}.</p>
                        )}
                    </div>
                ))
            ) : (
                <p>No inventory data available.</p>
            )}
        </div>
    );
};

export default ViewInventory;
