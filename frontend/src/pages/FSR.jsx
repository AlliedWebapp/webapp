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
        // First check if the API is accessible
        const res = await axios.get("https://backend-services-theta.vercel.app/api/reports/fsrs", {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        // Check if the response is valid JSON
        if (typeof res.data === 'object' && res.data !== null) {
          setFsrs(res.data);
        } else {
          throw new Error('Invalid response format');
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch FSRs:", err);
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          setMessage(`Server error: ${err.response.status}`);
        } else if (err.request) {
          // The request was made but no response was received
          setMessage("No response from server");
        } else {
          // Something happened in setting up the request that triggered an Error
          setMessage("Error setting up request");
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
