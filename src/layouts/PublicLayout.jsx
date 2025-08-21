import React from 'react';
import NavigationBar from '../components/navigation/NavigationBar';

const PublicLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div className="main-content" style={{ flex: 1, padding: '20px' }}>
        {children}
      </div>
    </div>
  );
};

export default PublicLayout;
