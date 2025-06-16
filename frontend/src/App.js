import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import Header from './components/Header';
import { PrivateRoute } from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import NewTicket from './pages/NewTicket';
import Register from './pages/Register';
import Tickets from './pages/Tickets';
import Ticket from './pages/Ticket';
import Inventory from './pages/inventory';
import FSR from './pages/FSR';
import FSRDetails from './pages/FSRDetails';
import Monthly from './pages/monthly';
import ImprovementReport from './pages/ImprovementReport';
import ViewImprovementReport from './pages/ViewImprovementReport'; 
import ImprovementReportDetails from './pages/ImprovementReportDetails';   
import MaintenanceReport from './pages/MaintenanceReport';
import ViewMaintenanceReport from './pages/ViewMaintenanceReport';
import MaintenanceReportDetails from './pages/MaintenanceReportDetails';
import GeneratorServiceReport from './pages/GeneratorServiceReport';
import OtherReports from './pages/OtherReports'; 
import Formats from './pages/Formats';
import QASubmit from './pages/QASubmit';
import QAList from './pages/QAList';
import InventoryManager from './pages/InventoryManager';
import Consumables from './pages/consumables';

import SlowNetworkAlert from './components/SlowNetworkAlert';
import { checkNetworkSpeed } from './utils/networkCheck';

function App() {
  const [isSlowNetwork, setIsSlowNetwork] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    const cleanup = checkNetworkSpeed((isSlow) => {
      setIsSlowNetwork(isSlow);
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <>
      <Router>
        <div className="container">
          {isSlowNetwork && showBanner && (
            <SlowNetworkAlert onClose={() => setShowBanner(false)} />
          )}
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
              <Route path="/view-maintenance-reports" element={<ViewMaintenanceReport />} />
              <Route path="/maintenance-report-details/:id" element={<MaintenanceReportDetails />} />
              <Route path="/service-report/:ticketId" element={<GeneratorServiceReport />} />
              <Route path="/other-reports" element={<OtherReports />} />
              <Route path="/view-improvement-reports" element={<ViewImprovementReport />} />
              <Route path="/improvement-report-details/:id" element={<ImprovementReportDetails />} />
              <Route path="/formats" element={<Formats />} />
              <Route path="/qa" element={<QASubmit />} />
              <Route path="/qa/list" element={<QAList />} />
              <Route path="/inventory-manager" element={<InventoryManager />} />
              <Route path="/consumables" element={<Consumables />} />
            </Route>
          </Routes>
        </div>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
