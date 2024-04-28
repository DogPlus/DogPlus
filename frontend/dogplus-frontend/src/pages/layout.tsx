import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../components/common/navbar";
import InstallPWA from "../InstallPwa";

export const Layout = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-y-auto">
        <Outlet />
      </div>
      {location.pathname !== "/auth" && location.pathname !== "/register" && (
        <Navbar />
      )}
      <InstallPWA />
    </div>
  );
};
