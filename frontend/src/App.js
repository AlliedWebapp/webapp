import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import { PrivateRoute } from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import NewTicket from './pages/NewTicket';
import Register from './pages/Register';
import Tickets from './pages/Tickets';
import Ticket from './pages/Ticket';
import Inventory from './pages/inventory';
import FSR from './pages/FSR'; // Import the FSR component
import FSRDetails from './pages/FSRDetails';
import Monthly from './pages/monthly';
import ImprovementReport from './pages/ImprovementReport';
import ViewImprovementReport from './pages/ViewImprovementReport'; 
import ImprovementReportDetails from './pages/ImprovementReportDetails';   
import MaintenanceReport from './pages/MaintenanceReport';
import GeneratorServiceReport from './pages/GeneratorServiceReport';
import OtherReports from './pages/OtherReports';  

function App() {
  return (
    <>
      <Router>
        <div className="container">
          <Header />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/new-ticket" element={<NewTicket />} />
              <Route path="/tickets" element={<Tickets />} />
              <Route path="/ticket/:ticketId" element={<Ticket />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/FSR" element={<FSR />} />
              <Route path="/fsr/:id" element={<FSRDetails />} />
              <Route path="/monthly" element={<Monthly />} />
              <Route path="/improvement-report" element={<ImprovementReport />} />
              <Route path="/maintenance-report" element={<MaintenanceReport />} />
              <Route path="/service-report/:ticketId" element={<GeneratorServiceReport />} />
              <Route path="/other-reports" element={<OtherReports />} />
              <Route path="/view-improvement-reports" element={<ViewImprovementReport />} />
              <Route path="/improvement-report-details/:id" element={<ImprovementReportDetails />} />
            </Route>
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
