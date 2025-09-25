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
import UsersPage from './pages/admin/UsersPage';
import PortfoliosPage from './pages/admin/PortfoliosPage'; // Import the new PortfoliosPage
import StudentPortfoliosPage from './pages/assessor/StudentPortfoliosPage';
import ReviewsPage from './pages/assessor/ReviewsPage';
import MyPortfoliosPage from './pages/student/MyPortfoliosPage';
import LogbookView from './pages/assessor/LogbookView';
import StudentLogbook from "./pages/student/StudentLogbook";


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
        <Route path="/admin/users" element={<UsersPage />} /> {/* Admin Users Management */}
        <Route path="/admin/portfolios" element={<PortfoliosPage />} /> {/* Admin Portfolios Management */}
        <Route path="/portfolio/assessor" element={<StudentPortfoliosPage />} />
        <Route path="/assessor/reviews" element={<ReviewsPage />} />
        <Route path="/my-portfolios" element={<MyPortfoliosPage />} />
        <Route path="/assessor/logbook" element={<LogbookView />} />
        <Route path="/student/logbook" element={<StudentLogbook />} />

        {/* Add a fallback for undefined routes */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
