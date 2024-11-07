import React from 'react';
import Navbar from '@/components/navbar/Navbar';

// main layout
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
};

export default MainLayout;
