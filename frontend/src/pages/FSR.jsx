import { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Helper function to convert buffer data to a base64 string
const imageToBase64 = (buffer) => {
  try {
    if (!buffer) return '';
    
    // If the buffer is already a base64 string, return it
    if (typeof buffer === 'string' && buffer.startsWith('data:image')) {
      return buffer;
    }
    
    // If it's a Buffer object
    if (buffer.type === 'Buffer' && Array.isArray(buffer.data)) {
      const binary = String.fromCharCode(...new Uint8Array(buffer.data));
      return `data:image/jpeg;base64,${btoa(binary)}`;
    }
    
    // If it's a direct buffer
    if (buffer instanceof ArrayBuffer || ArrayBuffer.isView(buffer)) {
      const binary = String.fromCharCode(...new Uint8Array(buffer));
      return `data:image/jpeg;base64,${btoa(binary)}`;
    }
    
    return '';
  } catch (error) {
    console.error("Error converting buffer to base64:", error);
    return '';
  }
};

function FSR() {
  const [fsrs, setFsrs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFSRs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get("http://localhost:5000/api/reports/fsrs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data && Array.isArray(res.data.reports)) {
          setFsrs(res.data.reports);
        } else {
          setMessage("Invalid response format");
          setIsError(true);
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching FSRs:", err);
        if (err.response) {
          setMessage(err.response.data.message || "Error fetching reports");
        } else if (err.request) {
          setMessage("No response from server");
        } else {
          setMessage("Error setting up request");
        }
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchFSRs();
  }, [navigate]);

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return (
      <div className="error-container">
        <h3>{message}</h3>
        <button onClick={() => navigate("/")}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className="fsr-container">
      <BackButton />
      <h1>Field Service Reports</h1>
      <div className="fsr-list">
        {fsrs.map((fsr) => (
          <div key={fsr._id} className="fsr-card">
            <h3>FSR #{fsr.fsrId}</h3>
            <p><strong>Customer:</strong> {fsr.customerName}</p>
            <p><strong>Site ID:</strong> {fsr.siteId}</p>
            <p><strong>Engineer:</strong> {fsr.engineerName}</p>
            <p><strong>Date:</strong> {new Date(fsr.createdAt).toLocaleDateString()}</p>
            <button onClick={() => navigate(`/fsr/${fsr._id}`)}>View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FSR;
