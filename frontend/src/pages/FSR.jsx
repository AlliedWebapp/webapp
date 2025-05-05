//view fsrs list//
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";
import { useSelector } from "react-redux";

const API_URL = process.env.REACT_APP_API_BASE_URL;

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
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchFSRs = async () => {
      try {
        if (!user?.token) {
          console.log("No user token found");
          setMessage("Please login to view reports");
          setIsError(true);
          setIsLoading(false);
          return;
        }

        console.log("User state:", user);
        console.log("Fetching FSRs for user:", user._id);
        
        const res = await axios.get(`${API_URL}/api/reports/fsrs`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          }
        });

        console.log("FSR Response:", res.data);

        // Check if reports exist in the response
        if (res.data && Array.isArray(res.data.reports)) {
          console.log("Found reports:", res.data.reports);
          setFsrs(res.data.reports);
        } else {
          console.warn("No reports found in response:", res.data);
          setFsrs([]);
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch FSRs:", err);
        if (err.response) {
          console.error("Error response:", err.response.data);
          console.error("Error status:", err.response.status);
          setMessage(`Server error: ${err.response.status} - ${err.response.data?.message || 'Unknown error'}`);
        } else if (err.request) {
          console.error("No response received:", err.request);
          setMessage("No response from server. Please check your connection.");
        } else {
          console.error("Error message:", err.message);
          setMessage(`Error: ${err.message}`);
        }
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchFSRs();
  }, [user]);

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
