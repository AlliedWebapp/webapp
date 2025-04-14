import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";

// Helper to convert buffer to base64 string
const imageToBase64 = (buffer) => {
  return `data:image/jpeg;base64,${Buffer.from(buffer).toString("base64")}`;
};

function ViewFSR() {
  const [fsrs, setFsrs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedFSR, setSelectedFSR] = useState(null); // State to hold the selected FSR report

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

  const viewReport = async (fsrId) => {
    try {
      const res = await axios.get(`https://backend-services-theta.vercel.app/api/reports/fsr/${fsrId}`);
      setSelectedFSR(res.data); // Set the selected report to display it
    } catch (err) {
      console.error("Failed to fetch FSR details", err);
      setMessage("Error fetching report details");
      setIsError(true);
    }
  };

  if (isLoading) return <Spinner />;

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
          <div>SR No</div>
          <div>Date</div>
          <div>Customer</div>
          <div>Site</div>
          <div></div>
        </div>

        {fsrs.length > 0 ? (
          fsrs.map((fsr) => (
            <div className="ticket" key={fsr._id}>
              <div>{fsr.fsrId}</div> {/* Display fsrId instead of srNo */}
              <div>{new Date(fsr.createdAt).toLocaleDateString()}</div>
              <div>{fsr.customerName}</div>
              <div>{fsr.installationAddress}</div>
              <div>
                <button className="btn btn-sm btn-outline" onClick={() => viewReport(fsr.fsrId)}>
                  View
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No FSRs found.</p>
        )}
      </div>

      {selectedFSR && (
        <div className="fsr-details">
          <h2>FSR Details</h2>
          <p><strong>Customer Name:</strong> {selectedFSR.customerName}</p>
          <p><strong>Installation Address:</strong> {selectedFSR.installationAddress}</p>
          <p><strong>Engine Model:</strong> {selectedFSR.engineModel}</p>
          <p><strong>Problem Summary:</strong> {selectedFSR.problemSummary}</p>
          {/* Render images */}
          <h3>Customer Signature:</h3>
          {selectedFSR.customerSignature && (
            <img
              src={imageToBase64(selectedFSR.customerSignature.data)} // Adjust this based on how the data is stored
              alt="Customer Signature"
              style={{ maxWidth: "100%", maxHeight: "400px" }}
            />
          )}
          <h3>Engineer Signature:</h3>
          {selectedFSR.engineerSignature && (
            <img
              src={imageToBase64(selectedFSR.engineerSignature.data)}
              alt="Engineer Signature"
              style={{ maxWidth: "100%", maxHeight: "400px" }}
            />
          )}
          <h3>Work Photos:</h3>
          {selectedFSR.workPhotos && selectedFSR.workPhotos.map((photo, index) => (
            <img
              key={index}
              src={imageToBase64(photo.data)} // Adjust this based on how work photos are returned
              alt={`Work Photo ${index + 1}`}
              style={{ maxWidth: "100%", maxHeight: "400px" }}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default ViewFSR;
