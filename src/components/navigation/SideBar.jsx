import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const userRole = localStorage.getItem('role');

  const sidebarStyle = {
    minWidth: '200px',
    backgroundColor: '#f8f9fa',
    borderRight: '1px solid #dee2e6',
    height: '100%',
    padding: '1rem'
  };

  const menuItems = {
    admin: [
      { path: '/admin/dashboard', label: 'Dashboard' },
      { path: '/register', label: 'User Management' },
      { path: '/admin/applications', label: 'Applications' }
    ],
    student: [
      { path: '/portfolios', label: 'My Portfolios' },
      { path: '/portfolio/create', label: 'Create Portfolio' }
    ],
    assessor: [
      { path: '/assessor/dashboard', label: 'Dashboard' },
      { path: '/assessor/reviews', label: 'Review Portfolios' }
    ]
  };

  const currentItems = menuItems[userRole] || [];

  return (
    <Nav className="flex-column" style={sidebarStyle}>
      {currentItems.map(item => (
        <Nav.Link
          key={item.path}
          as={Link}
          to={item.path}
          active={location.pathname === item.path}
        >
          {item.label}
        </Nav.Link>
      ))}
    </Nav>
  );
};

export default Sidebar;