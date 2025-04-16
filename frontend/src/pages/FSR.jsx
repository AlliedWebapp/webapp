import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";

// Helper function to convert buffer data to a base64 string
const imageToBase64 = (buffer) => {
  if (!buffer || !buffer.data) return '';
  const binary = String.fromCharCode(...new Uint8Array(buffer.data));
  return `data:image/jpeg;base64,${btoa(binary)}`;
};

function ViewFSR() {
  const [fsrs, setFsrs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedFSR, setSelectedFSR] = useState(null);

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

  // Function to fetch full FSR details by MongoDB _id
  const handleViewFSR = async (id) => {
    try {
      setIsLoading(true);
      const res = await axios.get(`https://backend-services-theta.vercel.app/api/reports/fsr/${id}`);
      console.log("FSR Details:", res.data); // Debug log
      setSelectedFSR(res.data);
      setIsLoading(false);
    } catch (err) {
      console.error("Failed to fetch FSR details", err);
      setMessage("Error fetching report details");
      setIsError(true);
      setIsLoading(false);
    }
  };

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
                  onClick={() => handleViewFSR(fsr._id)}
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

      {/* Show fetched full FSR details */}
      {selectedFSR && (
        <div className="fsr-details" style={{ 
          marginTop: '20px', 
          padding: '20px', 
          background: '#fff', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          maxWidth: '800px',
          margin: '20px auto'
        }}>
          <h2>FSR Details</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <p><strong>FSR ID:</strong> {selectedFSR.fsrId}</p>
              <p><strong>Ticket ID:</strong> {selectedFSR.ticketId}</p>
              <p><strong>Customer Name:</strong> {selectedFSR.customerName}</p>
              <p><strong>Installation Address:</strong> {selectedFSR.installationAddress}</p>
              <p><strong>Site ID:</strong> {selectedFSR.siteId}</p>
              <p><strong>Commissioning Date:</strong> {new Date(selectedFSR.commissioningDate).toLocaleDateString()}</p>
              <p><strong>Instance ID:</strong> {selectedFSR.instanceId}</p>
              <p><strong>State:</strong> {selectedFSR.state}</p>
              <p><strong>Rating:</strong> {selectedFSR.rating}</p>
            </div>
            <div>
              <p><strong>Engine Model:</strong> {selectedFSR.engineModel}</p>
              <p><strong>Engine Serial No.:</strong> {selectedFSR.engineSerial}</p>
              <p><strong>Genset Serial No.:</strong> {selectedFSR.gensetSerial}</p>
              <p><strong>Running Hours:</strong> {selectedFSR.runningHours}</p>
              <p><strong>Task Start:</strong> {new Date(selectedFSR.taskStart).toLocaleString()}</p>
              <p><strong>Task End:</strong> {new Date(selectedFSR.taskEnd).toLocaleString()}</p>
              <p><strong>Problem Summary:</strong> {selectedFSR.problemSummary}</p>
              <p><strong>Nature of Failure:</strong> {selectedFSR.natureOfFailure}</p>
              <p><strong>Checklist:</strong> {selectedFSR.checklist}</p>
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <p><strong>Engineer Remarks:</strong> {selectedFSR.engineerRemarks}</p>
            <p><strong>Customer Remarks:</strong> {selectedFSR.customerRemarks}</p>
            <p><strong>Engineer Name:</strong> {selectedFSR.engineerName}</p>
            <p><strong>Customer Contact:</strong> {selectedFSR.customerContact}</p>
            <p><strong>Customer Email:</strong> {selectedFSR.customerEmail}</p>
          </div>

          {/* Display Customer Signature if available */}
          {selectedFSR.customerSignature && (
            <div style={{ marginTop: '20px' }}>
              <h3>Customer Signature:</h3>
              <img
                src={imageToBase64(selectedFSR.customerSignature)}
                alt="Customer Signature"
                style={{ maxWidth: "300px", maxHeight: "200px", border: '1px solid #ddd' }}
              />
            </div>
          )}

          {/* Display Engineer Signature if available */}
          {selectedFSR.engineerSignature && (
            <div style={{ marginTop: '20px' }}>
              <h3>Engineer Signature:</h3>
              <img
                src={imageToBase64(selectedFSR.engineerSignature)}
                alt="Engineer Signature"
                style={{ maxWidth: "300px", maxHeight: "200px", border: '1px solid #ddd' }}
              />
            </div>
          )}

          {/* Display Work Photos if available */}
          {selectedFSR.workPhotos && selectedFSR.workPhotos.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h3>Work Photos:</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {selectedFSR.workPhotos.map((photo, index) => (
                  <img
                    key={index}
                    src={imageToBase64(photo)}
                    alt={`Work Photo ${index + 1}`}
                    style={{ maxWidth: "300px", maxHeight: "200px", border: '1px solid #ddd' }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default ViewFSR;
