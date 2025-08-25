import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaBars } from 'react-icons/fa';

const NavigationBar = ({ user, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
      <Container fluid>
        <Button 
          variant="outline-light" 
          className="d-lg-none me-2"
          onClick={toggleSidebar}
        >
          <FaBars />
        </Button>
        <Navbar.Brand>Portfolio Builder</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            <div className="d-flex align-items-center text-light">
              <FaUser className="me-2" />
              <span className="me-3">{user?.name} ({user?.role})</span>
              <Button variant="outline-light" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;