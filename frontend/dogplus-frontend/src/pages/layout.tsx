import { Toaster } from "react-hot-toast";
import {
  Location,
  Outlet,
  useLocation,
  useNavigate,
  NavigateFunction,
} from "react-router-dom";
import { Navbar } from "../components/common/navbar";
import { Header } from "../components/header";
import InstallPWA from "../InstallPwa";

// I am aware this is not the best way to do this, but it is the simplest way to do it
const headerRender = (location: Location, navigate: NavigateFunction) => {
  if (location.pathname.includes("/post")) {
    return <Header title="Post" back={true} />;
  } else if (location.pathname.includes("/serviceprovider/dashboard/service")) {
    return <Header title="Service" back={true} />;
  } else if (location.pathname.includes("/user/edit/")) {
    return <Header title="Edit Profile" back={true} />;
  } else if (location.pathname.includes("/booking")) {
    return <Header title="Service Booking" back={true} />;
  } else if (location.pathname.includes("/serviceproviders/")) {
    return <Header title="Service Provider" back={true} />;
  }
};

export const Layout = () => {
  const location = useLocation();
  const naivgate = useNavigate();

  return (
    <div className="flex flex-col h-screen bg-background">
      <Toaster />
      {headerRender(location, naivgate)}
      <div className="flex-grow overflow-y-auto p-2 pt-0">
        <Outlet />
      </div>
      {location.pathname !== "/" &&
        location.pathname !== "/auth" &&
        location.pathname !== "/register" && <Navbar />}
      <InstallPWA />
    </div>
  );
};
