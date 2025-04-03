import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header.tsx';

const MainLayout: React.FC = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default MainLayout;