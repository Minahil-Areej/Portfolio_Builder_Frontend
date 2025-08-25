import React, { useState } from 'react';
import NavigationBar from './Navbar';
import Sidebar from './Sidebar';
import './Sidebar.css';

const Layout = ({ user, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="layout">
      <NavigationBar user={user} toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} userRole={user?.role} />
      <div className={`main-content ${!sidebarOpen ? 'expanded' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default Layout;