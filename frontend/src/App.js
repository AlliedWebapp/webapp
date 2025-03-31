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
import Inventory from './pages/inventory'; // Updated import name to match component

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
            </Route>
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
