import React from 'react';
import NavigationBar from '../components/navigation/NavigationBar';
import Sidebar from '../components/navigation/Sidebar';

const AdminLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavigationBar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <div className="main-content" style={{ flex: 1, padding: '20px' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
