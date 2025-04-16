import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";

// Helper function to convert buffer data to a base64 string
const imageToBase64 = (buffer) => {
  const binary = String.fromCharCode(...new Uint8Array(buffer)); // Convert the buffer to binary string
  return `data:image/jpeg;base64,${btoa(binary)}`; // Return the base64 image string
};

function ViewFSR() {
  const [fsrs, setFsrs] = useState([]); // State for storing list of FSRs
  const [isLoading, setIsLoading] = useState(true); // State for loading status
  const [isError, setIsError] = useState(false); // State for error handling
  const [message, setMessage] = useState(""); // State for storing error messages
  const [selectedFSR, setSelectedFSR] = useState(null); // State for storing selected FSR details

  // Fetch all FSRs when the component mounts
  useEffect(() => {
    const fetchFSRs = async () => {
      try {
        const res = await axios.get("https://backend-services-theta.vercel.app/api/reports/fsrs");
        setFsrs(res.data); // Set the FSRs data
        setIsLoading(false); // Stop loading
      } catch (err) {
        console.error("Failed to fetch FSRs", err);
        setMessage("Error fetching reports");
        setIsError(true); // Set error state
        setIsLoading(false); // Stop loading
      }
    };

    fetchFSRs(); // Call the function to fetch FSRs
  }, []);

  // Function to fetch full FSR details by MongoDB _id
  const handleViewFSR = async (id) => {
    try {
      const res = await axios.get(`https://backend-services-theta.vercel.app/api/reports/fsr/${id}`);
      setSelectedFSR(res.data); // Set the selected FSR details
    } catch (err) {
      console.error("Failed to fetch FSR details", err);
      setMessage("Error fetching report details");
      setIsError(true); // Set error state
    }
  };

  // Loading spinner is shown while data is being fetched
  if (isLoading) return <Spinner />;

  // Show error message if there is an error
  if (isError) {
    return (
      <div>
        <h3 className="text-red-500">Error: {message}</h3>
        <BackButton url="/" /> {/* Button to navigate back */}
      </div>
    );
  }

  return (
    <>
      <BackButton url="/" /> {/* Button to navigate back */}
      <h1>Generator Service Reports</h1>
      <div className="tickets">
        <div className="ticket-headings">
          {/* Table headers */}
          <div>FSR ID</div>
          <div>Date</div>
          <div>Customer</div>
          <div>Site</div>
          <div></div>
        </div>

        {/* Display list of FSRs */}
        {fsrs.length > 0 ? (
          fsrs.map((fsr) => (
            <div className="ticket" key={fsr._id}>
              {/* Display FSR information */}
              <div>{fsr.fsrId}</div>
              <div>{new Date(fsr.createdAt).toLocaleDateString()}</div>
              <div>{fsr.customerName}</div>
              <div>{fsr.installationAddress}</div>
              <div>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => handleViewFSR(fsr._id)} // Fetch and view full details on click
                >
                  View
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No FSRs found.</p> // Message if no FSRs are found
        )}
      </div>

      {/* Show fetched full FSR details */}
      {selectedFSR && (
        <div className="fsr-details">
          <h2>FSR Details</h2>
          {/* Display all fields from the selected FSR model */}
          <p><strong>FSR ID:</strong> {selectedFSR.fsrId}</p>
          <p><strong>Ticket ID:</strong> {selectedFSR.ticketId}</p>
          <p><strong>Serial No.:</strong> {selectedFSR.srNo}</p>
          <p><strong>Customer Name:</strong> {selectedFSR.customerName}</p>
          <p><strong>Installation Address:</strong> {selectedFSR.installationAddress}</p>
          <p><strong>Site ID:</strong> {selectedFSR.siteId}</p>
          <p><strong>Commissioning Date:</strong> {new Date(selectedFSR.commissioningDate).toLocaleDateString()}</p>
          <p><strong>Instance ID:</strong> {selectedFSR.instanceId}</p>
          <p><strong>State:</strong> {selectedFSR.state}</p>
          <p><strong>Rating:</strong> {selectedFSR.rating}</p>
          <p><strong>Engine Model:</strong> {selectedFSR.engineModel}</p>
          <p><strong>Engine Serial No.:</strong> {selectedFSR.engineSerial}</p>
          <p><strong>Genset Serial No.:</strong> {selectedFSR.gensetSerial}</p>
          <p><strong>Running Hours:</strong> {selectedFSR.runningHours}</p>
          <p><strong>Task Start:</strong> {new Date(selectedFSR.taskStart).toLocaleString()}</p>
          <p><strong>Task End:</strong> {new Date(selectedFSR.taskEnd).toLocaleString()}</p>
          <p><strong>Problem Summary:</strong> {selectedFSR.problemSummary}</p>
          <p><strong>Nature of Failure:</strong> {selectedFSR.natureOfFailure}</p>
          <p><strong>Checklist:</strong> {selectedFSR.checklist}</p>
          <p><strong>Engineer Remarks:</strong> {selectedFSR.engineerRemarks}</p>
          <p><strong>Customer Remarks:</strong> {selectedFSR.customerRemarks}</p>
          <p><strong>Engineer Name:</strong> {selectedFSR.engineerName}</p>
          <p><strong>Customer Contact:</strong> {selectedFSR.customerContact}</p>
          <p><strong>Customer Email:</strong> {selectedFSR.customerEmail}</p>

          {/* Display Customer Signature if available */}
          {selectedFSR.customerSignature && (
            <div>
              <h3>Customer Signature:</h3>
              <img
                src={imageToBase64(selectedFSR.customerSignature.data)} // Convert buffer to base64 string
                alt="Customer Signature"
                style={{ maxWidth: "100%", maxHeight: "400px" }} // Styling for image
              />
            </div>
          )}

          {/* Display Engineer Signature if available */}
          {selectedFSR.engineerSignature && (
            <div>
              <h3>Engineer Signature:</h3>
              <img
                src={imageToBase64(selectedFSR.engineerSignature.data)} // Convert buffer to base64 string
                alt="Engineer Signature"
                style={{ maxWidth: "100%", maxHeight: "400px" }} // Styling for image
              />
            </div>
          )}

          {/* Display Work Photos if available */}
          {selectedFSR.workPhotos && selectedFSR.workPhotos.length > 0 && (
            <div>
              <h3>Work Photos:</h3>
              {selectedFSR.workPhotos.map((photo, index) => (
                <img
                  key={index}
                  src={imageToBase64(photo.data)} // Convert buffer to base64 string
                  alt={`Work Photo ${index + 1}`}
                  style={{ maxWidth: "100%", maxHeight: "400px", marginBottom: "10px" }} // Styling for image
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default ViewFSR;
