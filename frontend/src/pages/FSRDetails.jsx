import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../index.css';

const FSRDetails = () => {
  const { id } = useParams();
  const [fsr, setFsr] = useState(null);

  useEffect(() => {
    const fetchFsr = async () => {
      try {
        const res = await axios.get(`https://backend-services-theta.vercel.app/api/fsr/${id}`);
        setFsr(res.data);
      } catch (err) {
        console.error('Error fetching FSR:', err);
      }
    };
    fetchFsr();
  }, [id]);

  const imageToBase64 = (buffer) => {
    if (!buffer) return '';
    const binary = String.fromCharCode(...new Uint8Array(buffer));
    return `data:image/jpeg;base64,${btoa(binary)}`;
  };

  if (!fsr) return <div>Loading...</div>;

  return (
    <div className="report-container">
      <h1 className="report-title">Generator Service Report</h1>
      <div className="report-section">
        <h2>Customer Details</h2>
        <p><strong>Name:</strong> {fsr.customerName}</p>
        <p><strong>Location:</strong> {fsr.customerLocation}</p>
        <p><strong>Phone:</strong> {fsr.customerPhone}</p>
        <p><strong>Email:</strong> {fsr.customerEmail}</p>
      </div>

      <div className="report-section">
        <h2>Generator Details</h2>
        <p><strong>Type:</strong> {fsr.generatorType}</p>
        <p><strong>Capacity:</strong> {fsr.generatorCapacity}</p>
        <p><strong>Model:</strong> {fsr.generatorModel}</p>
        <p><strong>Serial Number:</strong> {fsr.generatorSerialNumber}</p>
      </div>

      <div className="report-section">
        <h2>Service Details</h2>
        <p><strong>Date:</strong> {fsr.serviceDate}</p>
        <p><strong>Description:</strong> {fsr.serviceDescription}</p>
      </div>

      <div className="report-section">
        <h2>Photos of Work</h2>
        <div className="report-images">
          {fsr.workPhotos && fsr.workPhotos.map((photo, idx) => (
            <img 
              key={idx} 
              src={imageToBase64(photo?.data)} 
              alt={`Work Photo ${idx + 1}`} 
              className="report-image"
            />
          ))}
        </div>
      </div>

      <div className="report-section">
        <h2>Signatures</h2>
        <div className="report-signatures">
          <div>
            <p><strong>Customer Signature:</strong></p>
            <img 
              src={imageToBase64(fsr.customerSignature?.data)} 
              alt="Customer Signature" 
              className="signature-img" 
            />
          </div>
          <div>
            <p><strong>Engineer Signature:</strong></p>
            <img 
              src={imageToBase64(fsr.engineerSignature?.data)} 
              alt="Engineer Signature" 
              className="signature-img" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FSRDetails;
