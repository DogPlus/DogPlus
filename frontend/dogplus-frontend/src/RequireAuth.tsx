import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface RequireAuthProps {
  children: ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const auth = localStorage.getItem("token");

  return auth ? <>{children}</> : <Navigate to="/auth" replace />;
};

export default RequireAuth;
