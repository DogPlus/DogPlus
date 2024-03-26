// Create an react Component

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/navbar';

export const Layout = () => {
  return (
    <div>
      <Outlet />
      <Navbar />
    </div>
  );
};
