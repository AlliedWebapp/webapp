import React, { useEffect, useState } from "react";
import axios from "axios";

const SpareParts = () => {
  const [spares, setSpares] = useState([]);

  useEffect(() => {
    axios.get("https://backend-services-theta.vercel.app/api/spares") // Replace with actual backend URL
      .then(response => setSpares(response.data))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  return (
    <div>
      <h2>Spare Parts List</h2>
      <ul>
        {spares.map((item, index) => (
          <li key={index}>
            <strong>{item["NAME OF MATERIALS"]}</strong> - {item["CLOSING BALANCE"]}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SpareParts;
