import React from "react";
import { NavLink } from "react-router-dom";
import useUser from "../../hooks/useUser"; // Adjust the import path as per your project structure

import { ReactComponent as HomeIcon } from "../../assets/icons/home.svg";
import { ReactComponent as ServiceProviderIcon } from "../../assets/icons/serviceprovider.svg";
import { ReactComponent as UserIcon } from "../../assets/icons/user.svg";
import { UserRole } from "../../types/user";

const navlink_default =
  "inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group-hover:text-blue-600 text-gray-500 group text-m";
const navlink_active =
  "inline-flex flex-col items-center justify-center px-5 bg-blue-50 text-blue-500 stroke-blue-500 group text-m font-bold stroke-1 rounded-lg";

export const Navbar = () => {
  const { user } = useUser();
  console.log(user);
  return (
    <div className="fixed bottom-0 left-0 py-1 px-1 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
      <nav className="grid h-full max-w-lg grid-cols-3 mx-auto font-medium gap-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? navlink_active : navlink_default
          }
        >
          <HomeIcon className="w-5 h-5" />
          <span className="text-inherit">Home</span>
        </NavLink>
        {user && user.role === UserRole.ServiceProvider && (
          <NavLink
            to="/serviceprovider/dashboard"
            className={({ isActive }) =>
              isActive ? navlink_active : navlink_default
            }
          >
            <ServiceProviderIcon className="w-5 h-5" />
            <span className="text-sm">Dashboard</span>
          </NavLink>
        )}
        {user && user.role === UserRole.Admin && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              isActive ? navlink_active : navlink_default
            }
          >
            <ServiceProviderIcon className="w-5 h-5" />
            <span className="text-sm">Admin</span>
          </NavLink>
        )}
        {user && user.role === UserRole.User && (
          <NavLink
            to="/services"
            className={({ isActive }) =>
              isActive ? navlink_active : navlink_default
            }
          >
            <UserIcon className="w-5 h-5" />
            <span className="text-sm">User</span>
          </NavLink>
        )}
        <NavLink
          to="/user"
          className={({ isActive }) =>
            isActive ? navlink_active : navlink_default
          }
        >
          <UserIcon className="w-5 h-5" />
          <span className="text-sm">User</span>
        </NavLink>
      </nav>
    </div>
  );
};
