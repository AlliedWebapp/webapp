import { FaBoxOpen, FaList, FaQuestion, FaCalendarAlt, FaClipboard, FaEdit, FaClipboardCheck, FaClipboardList, FaDownload, FaFileAlt, FaFolderOpen, FaQuestionCircle, FaTicketAlt, FaWarehouse } from "react-icons/fa";
import { Link } from "react-router-dom";
function Home() {
  return (
    <>
      <section className="heading">
        <h1>Service Management System </h1>
        <p>Please choose a service below</p>
      </section>

      <div className="home-grid">
        <Link to="/new-ticket" className="home-btn">
          <FaQuestionCircle /> Create New Ticket
        </Link>

        <Link to="/tickets" className="home-btn">
          <FaTicketAlt /> View My Tickets
        </Link>

        <Link to="/FSR" className="home-btn">
          <FaFileAlt /> View FSR
        </Link>

        <Link to="/inventory" className="home-btn">
          <FaClipboardList /> View Inventory
        </Link>

        <Link to="/inventory-manager" className="home-btn">
          <FaEdit />  Manage Inventory
        </Link>

        <Link to="/consumables" className="home-btn">
          <FaBoxOpen />  Consumable Inventory
        </Link>

        <Link to="/monthly" className="home-btn">
          <FaCalendarAlt /> View Monthly Summary
        </Link>

        <Link to="/other-reports" className="home-btn">
          <FaFolderOpen /> View Other Reports
        </Link>

        <Link to="/Formats" className="home-btn">
          <FaDownload/> Download Maintenance Formats
        </Link>

        <Link to="/qa" className="home-btn">
          <FaQuestion/> Register a problem 
        </Link>

        <Link to="/qa/list" className="home-btn">
          <FaList/> View all problems
        </Link>
      </div>
    </>
  );
}

export default Home;
