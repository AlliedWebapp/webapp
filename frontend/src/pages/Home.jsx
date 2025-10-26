import {  FaList, FaQuestion, FaCalendarAlt, FaClipboard, FaDownload, FaFileAlt, FaFolderOpen, FaQuestionCircle, FaTicketAlt} from "react-icons/fa";
import { Link } from "react-router-dom";
import BackButton from "../components/BackButton";
function Home() {
  return (
    <>
      <section className="heading">
                <BackButton url="/main-page" className="back-button" />    
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

        <Link to="/drafts" className="home-btn">
          <FaClipboard /> Saved as drafts
        </Link>
      </div>
    </>
  );
}

export default Home;
