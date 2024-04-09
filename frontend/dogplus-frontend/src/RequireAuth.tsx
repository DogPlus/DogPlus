import React from "react";
import { Navigate } from "react-router-dom";
import useUser from "./hooks/useUser";
import { UserRole } from "./types/user";

interface RequireAuthProps {
  children: React.ReactNode;
  requireServiceProviderApproval?: boolean;
  requiredRoles?: UserRole[];
}

const RequireAuth: React.FC<RequireAuthProps> = ({
  children,
  requireServiceProviderApproval = false,
  requiredRoles,
}) => {
  const { user } = useUser();
  const auth = localStorage.getItem("token");

  // Redirect if not authenticated
  if (!auth) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect if service provider approval is required but the user is not approved yet
  if (
    user &&
    requireServiceProviderApproval &&
    user.role === UserRole.ServiceProvider &&
    !user.isApproved
  ) {
    return <Navigate to="/approval-pending" replace />;
  }

  // Check for required roles if specified
  if (requiredRoles && user && !requiredRoles.includes(user.role)) {
    return <Navigate to="/not-authorized" replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
