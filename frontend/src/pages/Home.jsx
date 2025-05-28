import { FaBoxOpen, FaList, FaQuestion, FaCalendarAlt, FaClipboard, FaEdit, FaClipboardCheck, FaClipboardList, FaDownload, FaFileAlt, FaFolderOpen, FaQuestionCircle, FaTicketAlt, FaWarehouse } from "react-icons/fa";
import { Link } from "react-router-dom";
function Home() {
  return (
    <>
      <section className="heading">
        <h1>Service Management System </h1>
        <p>Please choose a service below</p>
      </section>

      <Link to="/new-ticket" className="btn btn-block">
        <FaQuestionCircle /> Create New Ticket
      </Link>

      <Link to="/tickets" className="btn btn-block">
        <FaTicketAlt /> View My Tickets
      </Link>

      <Link to="/inventory" className="btn btn-block">
        <FaClipboardList /> View Inventory
      </Link>

      <Link to="/inventory-manager" className="btn btn-block">
        <FaEdit />  Manage Inventory
      </Link>

      <Link to="/FSR" className="btn btn-block">
        <FaFileAlt /> View FSR
      </Link>

      <Link to="/monthly" className="btn btn-block">
        <FaCalendarAlt /> View Monthly Summary
      </Link>

      <Link to="/other-reports" className="btn btn-block">
        <FaFolderOpen /> View Other Reports
      </Link>

      <Link to="/Formats" className="btn btn-block">
        <FaDownload/> Download Maintenance Formats
      </Link>

      <Link to="/qa" className="btn btn-block">
        <FaQuestion/> Register a problem 
      </Link>

      <Link to="/qa/list" className="btn btn-block">
        <FaList/> View all problems
      </Link>
    </>
  );
}

export default Home;
