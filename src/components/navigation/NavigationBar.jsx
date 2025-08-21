import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const NavigationBar = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-3">
      <Container>
        <Navbar.Brand as={Link} to="/">Portfolio Builder</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto">
            {userRole === 'admin' && (
              <Nav.Link as={Link} to="/admin/dashboard">Dashboard</Nav.Link>
            )}
            {userRole === 'student' && (
              <Nav.Link as={Link} to="/portfolios">My Portfolios</Nav.Link>
            )}
            {userRole === 'assessor' && (
              <Nav.Link as={Link} to="/assessor/dashboard">Review Portfolios</Nav.Link>
            )}
          </Nav>
          <Nav>
            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;