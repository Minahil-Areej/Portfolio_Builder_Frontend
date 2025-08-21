import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import StudentLayout from './layouts/StudentLayout';
import AssessorLayout from './layouts/AssessorLayout';
import PublicLayout from './layouts/PublicLayout';
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
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
        <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
        <Route path="/forgot-password" element={<PublicLayout><ForgotPassword /></PublicLayout>} />
        <Route path="/reset-password" element={<PublicLayout><ResetPassword /></PublicLayout>} />
        <Route path="/application-form" element={<PublicLayout><ApplicationForm /></PublicLayout>} />
        <Route path="/application-success" element={<PublicLayout><ApplicationSuccess /></PublicLayout>} />

        {/* Student Routes */}
        <Route path="/dashboard" element={<StudentLayout><Dashboard /></StudentLayout>} />
        <Route path="/portfolio" element={<StudentLayout><Portfolio /></StudentLayout>} />
        <Route path="/portfolio/edit/:id" element={<StudentLayout><EditPortfolio /></StudentLayout>} />
        <Route path="/portfolio/view/:id" element={<StudentLayout><ViewPortfolio /></StudentLayout>} />

        {/* Assessor Routes */}
        <Route path="/assessor" element={<AssessorLayout><AssessorDashboard /></AssessorLayout>} />
        <Route path="/assessor/portfolio/:id" element={<AssessorLayout><AssessorPortfolio /></AssessorLayout>} />
        <Route path="/portfolio/assessor/:id" element={<AssessorLayout><AssessorPortfolio /></AssessorLayout>} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/applications" element={<AdminLayout><ViewApplication /></AdminLayout>} />
        <Route path="/admin/application/:id" element={<AdminLayout><ViewApplication /></AdminLayout>} />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
