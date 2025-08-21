import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import NavigationBar from './components/navigation/NavigationBar';
import Sidebar from './components/navigation/Sidebar';
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
  // Add this helper function inside App
  const shouldShowNavigation = (pathname) => {
    const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password', '/application-form', '/application-success'];
    return !publicPaths.includes(pathname);
  };

  return (
    <Router>
      {/* Wrap everything in a main container */}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Use Routes to conditionally render navigation */}
        <Routes>
          <Route
            path="*"
            element={
              <>
                {shouldShowNavigation(window.location.pathname) && <NavigationBar />}
                <div style={{ display: 'flex', flex: 1 }}>
                  {shouldShowNavigation(window.location.pathname) && <Sidebar />}
                  <div className="main-content">
                    <Routes>
                      <Route path="/" element={<Navigate to="/login" />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/portfolio" element={<Portfolio />} />
                      <Route path="/portfolio/edit/:id" element={<EditPortfolio />} />
                      <Route path="/portfolio/view/:id" element={<ViewPortfolio />} />
                      <Route path="/assessor" element={<AssessorDashboard />} />
                      <Route path="/portfolio/assessor/:id" element={<AssessorPortfolio />} />
                      <Route path="/admin-dashboard" element={<AdminDashboard />} />
                      <Route path="/application-form" element={<ApplicationForm />} />
                      <Route path="/application-success" element={<ApplicationSuccess />} />
                      <Route path="/admin/application/:id" element={<ViewApplication />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/reset-password" element={<ResetPassword />} />
                      <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
                  </div>
                </div>
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
