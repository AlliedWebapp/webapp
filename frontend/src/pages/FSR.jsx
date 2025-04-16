import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";

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

function ViewFSR() {
  const [fsrs, setFsrs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Fetch all FSRs when the component mounts
  useEffect(() => {
    const fetchFSRs = async () => {
      try {
        const res = await axios.get("https://backend-services-theta.vercel.app/api/reports/fsrs");
        setFsrs(res.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch FSRs", err);
        setMessage("Error fetching reports");
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchFSRs();
  }, []);

  // Loading spinner is shown while data is being fetched
  if (isLoading) return <Spinner />;

  // Show error message if there is an error
  if (isError) {
    return (
      <div>
        <h3 className="text-red-500">Error: {message}</h3>
        <BackButton url="/" />
      </div>
    );
  }

  return (
    <>
      <BackButton url="/" />
      <h1>Generator Service Reports</h1>
      <div className="tickets">
        <div className="ticket-headings">
          <div>FSR ID</div>
          <div>Date</div>
          <div>Customer</div>
          <div>Site</div>
          <div></div>
        </div>

        {fsrs.length > 0 ? (
          fsrs.map((fsr) => (
            <div className="ticket" key={fsr._id}>
              <div>{fsr.fsrId}</div>
              <div>{new Date(fsr.createdAt).toLocaleDateString()}</div>
              <div>{fsr.customerName}</div>
              <div>{fsr.installationAddress}</div>
              <div>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => navigate(`/fsr/${fsr._id}`)}
                >
                  View
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No FSRs found.</p>
        )}
      </div>
    </>
  );
}

export default ViewFSR;
