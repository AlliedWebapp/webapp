import { FaBoxOpen, FaEdit, FaClipboardList } from "react-icons/fa";
import { Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import "../index.css";

function InventoryMain() {
  return (
    <>
      <section className="inventory-heading">
        <BackButton url="/main-page" className="back-button" />
        <h1>Service Management System</h1>
        <p>Please choose a service below</p>
      </section>

      <div className="inventory-container">
        <Link to="/inventory" className="inventory-btn">
          <FaClipboardList /> View Inventory
        </Link>

        <Link to="/inventory-manager" className="inventory-btn">
          <FaEdit /> Manage Inventory
        </Link>

        <Link to="/consumables" className="inventory-btn">
          <FaBoxOpen /> Consumable Inventory
        </Link>
      </div>
    </>
  );
}

export default InventoryMain;
