//view fsrs list//
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";

// Helper function to convert buffer data to a base64 string
const imageToBase64 = (buffer) => {
  const binary = String.fromCharCode(...new Uint8Array(buffer));
  return `data:image/jpeg;base64,${btoa(binary)}`;
};

function ViewFSR() {
  const [fsrs, setFsrs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFSRs = async () => {
      try {
        console.log("Fetching FSRs...");
        const res = await axios.get("https://backend-services-theta.vercel.app/api/reports/fsrs", {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        console.log("FSR Response:", res.data);

        // The backend returns the reports directly in the response
        if (res.data && Array.isArray(res.data.reports)) {
          setFsrs(res.data.reports);
        } else {
          console.warn("Unexpected response format:", res.data);
          setFsrs([]);
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch FSRs:", err);
        if (err.response) {
          setMessage(`Server error: ${err.response.status} - ${err.response.data?.message || 'Unknown error'}`);
        } else if (err.request) {
          setMessage("No response from server. Please check your connection.");
        } else {
          setMessage(`Error: ${err.message}`);
        }
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
      <div className="error-container">
        <h3 className="text-red-500">Error: {message}</h3>
        <BackButton url="/" />
      </div>
    );
  }

  return (
    <div className="fsr-container">
      <BackButton url="/" />
      <h1>Service Reports</h1>
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
          <div className="no-fsrs">
            <p>No FSRs found. Please create a new FSR.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewFSR;
