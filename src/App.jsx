import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio'; // Import the Portfolio creation page
import EditPortfolio from './pages/EditPortfolio'; // Import the edit page
import ViewPortfolio from './pages/ViewPortfolio'; // Import the new ViewPortfolio component
import AssessorDashboard from './pages/AssessorDashboard';
import AssessorPortfolio from './pages/AssessorPortfolio';
import AdminDashboard from './pages/AdminDashboard';
import ApplicationForm from './pages/ApplicationForm';
import ApplicationSuccess from './pages/ApplicationSuccess';
import ViewApplication from './pages/ViewApplication';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/portfolio" element={<Portfolio />} /> {/* Portfolio Creation route */}
        <Route path="/portfolio/edit/:id" element={<EditPortfolio />} /> {/* Add edit route */}
        <Route path="/portfolio/view/:id" element={<ViewPortfolio />} /> {/* Add ViewPortfolio route */}
        <Route path="/assessor" element={<AssessorDashboard />} />  {/* Assessor Dashboard */}
        <Route path="/portfolio/assessor/:id" element={<AssessorPortfolio />} />  {/* Assessor Portfolio Review */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} /> {/* No user role check here */}
        <Route path="/application-form" element={<ApplicationForm />} />
        <Route path="/application-success" element={<ApplicationSuccess />} />
        <Route path="/admin/application/:id" element={<ViewApplication />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Add a fallback for undefined routes */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
