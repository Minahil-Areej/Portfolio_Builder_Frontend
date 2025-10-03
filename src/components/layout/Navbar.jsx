// import React from 'react';
// import { Navbar, Container, Nav, Button } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// import { FaUser, FaBars } from 'react-icons/fa';

// const NavigationBar = ({ user, toggleSidebar }) => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     navigate('/login');
//   };

//   return (
//     <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
//       <Container fluid>
//         <Button 
//           variant="outline-light" 
//           className="d-lg-none me-2"
//           onClick={toggleSidebar}
//         >
//           <FaBars />
//         </Button>
//         <Navbar.Brand>Portfolio Builder</Navbar.Brand>
//         <Navbar.Toggle aria-controls="navbar-nav" />
//         <Navbar.Collapse id="navbar-nav">
//           <Nav className="ms-auto">
//             <div className="d-flex align-items-center text-light">
//               <FaUser className="me-2" />
//               <span className="me-3">{user?.name} ({user?.role})</span>
//               <Button variant="outline-light" size="sm" onClick={handleLogout}>
//                 Logout
//               </Button>
//             </div>
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// };

// export default NavigationBar;



import React from 'react';
import { Navbar, Container, Nav, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaBars, FaSignOutAlt } from 'react-icons/fa';
import './Navbar.css';

const NavigationBar = ({ user, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Get role badge color
  const getRoleBadgeVariant = (role) => {
    switch(role) {
      case 'admin': return 'danger';
      case 'assessor': return 'warning';
      case 'student': return 'info';
      default: return 'secondary';
    }
  };

  return (
    <Navbar className="custom-navbar" expand="lg" fixed="top">
      <Container fluid>
        {/* Sidebar Toggle Button */}
        <Button 
          variant="outline-light" 
          className="sidebar-toggle d-lg-none me-2"
          onClick={toggleSidebar}
        >
          <FaBars />
        </Button>

        {/* Brand Logo */}
        <Navbar.Brand className="navbar-brand-custom">
          <span className="brand-icon">📚</span>
          <span className="brand-text">Portfolio Builder</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />
        
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            <div className="user-info-container">
              {/* User Avatar */}
              <div className="user-avatar">
                <FaUser />
              </div>
              
              {/* User Details */}
              <div className="user-details">
                <span className="user-name">{user?.name}</span>
                <Badge 
                  bg={getRoleBadgeVariant(user?.role)} 
                  className="role-badge"
                >
                  {user?.role}
                </Badge>
              </div>

              {/* Logout Button */}
              <Button 
                variant="outline-light" 
                size="sm" 
                className="logout-btn"
                onClick={handleLogout}
              >
                <FaSignOutAlt className="me-1" />
                <span className="d-none d-md-inline">Logout</span>
              </Button>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;