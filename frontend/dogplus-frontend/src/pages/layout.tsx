import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../components/common/navbar";

export const Layout = () => {
  const location = useLocation();

  return (
    <div>
      <Outlet />
      {location.pathname !== "/auth" && location.pathname !== "/register" && (
        <Navbar />
      )}
    </div>
  );
};
