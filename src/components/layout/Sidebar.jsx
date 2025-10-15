import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaUsers, 
  FaFolderOpen, 
  FaClipboardList, 
  FaUserGraduate,
  FaEdit 
} from 'react-icons/fa';

const menuConfig = {
  admin: [
    { path: '/admin-dashboard', icon: <FaHome />, label: 'Dashboard' },
    { path: '/admin/users', icon: <FaUsers />, label: 'Users' },
    { path: '/admin/portfolios', icon: <FaFolderOpen />, label: 'Portfolios' },
    // { path: '/admin/applications', icon: <FaClipboardList />, label: 'Applications' }
  ],
  assessor: [
    { path: '/assessor', icon: <FaHome />, label: 'Dashboard' },
    { path: '/portfolio/assessor', icon: <FaUserGraduate />, label: 'Student Portfolios' },
    { path: '/assessor/reviews', icon: <FaEdit />, label: 'Reviews' },
    { path: '/assessor/logbook', icon: <FaClipboardList />, label: 'Logbook' } // NEW
  ],
  student: [
    { path: '/dashboard', icon: <FaHome />, label: 'Dashboard' },
    { path: '/my-portfolios', icon: <FaFolderOpen />, label: 'My Portfolios' },
    { path: '/application-form', icon: <FaClipboardList />, label: 'Application' },
    { path: '/student/logbook', icon: <FaClipboardList />, label: 'Logbook' }, // NEW
  ]
};

const Sidebar = ({ isOpen, userRole }) => {
  const location = useLocation();
  const menuItems = menuConfig[userRole] || [];

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <Nav className="flex-column py-3">
        {menuItems.map((item) => (
          <Nav.Item key={item.path}>
            <Nav.Link
              as={Link}
              to={item.path}
              className={`sidebar-link ${
                location.pathname === item.path ? 'active' : ''
              }`}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </div>
  );
};

export default Sidebar;