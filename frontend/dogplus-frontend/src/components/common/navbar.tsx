import React from 'react';
import { NavLink } from 'react-router-dom';

export const Navbar = () => {
  return (
    <nav className="bg-gray-800 fixed bottom-0 left-0 right-0 flex justify-around p-4">
      <NavLink
        to="/home"
        className="text-gray-300 hover:text-white"
      >
        Home
      </NavLink>
      <NavLink
        to="/serviceproviders"
        className="text-gray-300 hover:text-white"
      >
        Service Providers
      </NavLink>
      <NavLink
        to="/user"
        className="text-gray-300 hover:text-white"
      >
        User
      </NavLink>
    </nav>
  );
};
