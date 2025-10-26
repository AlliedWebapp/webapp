
import {
  FaTicketAlt,
  FaClipboardCheck,
  FaWarehouse,
  FaFileAlt
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "../index.css";

function Main() {
  return (
    <>
      <section className="main-heading">
        <h1>Service Management System</h1>
        <p>Please choose a service below</p>
      </section>

      <div className="main-grid">
        
        <Link to="/home" className="main-btn main-btn-black">
          <FaTicketAlt /> TICKET MANAGEMENT SYSTEM (TMS)
        </Link>
        
        <a
          href="https://attendance-liart-delta.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="main-btn main-btn-green"
        >
          <FaClipboardCheck /> ATTENDANCE
        </a>

   
        <Link to="/inventory-main" className="main-btn main-btn-blue">
          <FaWarehouse /> INVENTORY
        </Link>


        <Link to="/main-page" className="main-btn main-btn-black">
          <FaFileAlt /> REMOTE MONITORING SYSTEM (RMS)
        </Link>
      </div>
    </>
  );
}

export default Main;
