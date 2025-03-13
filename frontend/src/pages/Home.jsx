import { FaBoxOpen, FaClipboard, FaClipboardCheck, FaClipboardList, FaQuestionCircle, FaTicketAlt, FaWarehouse } from "react-icons/fa";
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <section className="heading">
        <h1>Ticket Management System Admin</h1>
        <p>Please choose from an option below</p>
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
    </>
  );
}

export default Home;
