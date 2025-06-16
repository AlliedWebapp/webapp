
import React from 'react';
import "../index.css";

const SlowNetworkAlert = ({ onClose }) => (
  <div 
    role="alert"
    aria-live="polite"
    className="slow-network-alert"
  >
    <div className="alert-content">
      <span className="alert-icon" aria-hidden="true">⚠️</span>
      <div className="alert-message">
        <strong>Slow Internet Connection Detected</strong>
      </div>
    </div>
    <button
      onClick={onClose}
      className="alert-close-button"
      aria-label="Close alert"
    >
      ×
    </button>
  </div>
);

export default SlowNetworkAlert;
