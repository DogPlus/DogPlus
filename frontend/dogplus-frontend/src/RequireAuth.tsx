import React, { useEffect, useTransition } from "react";
import { useNavigate } from "react-router-dom";
import useUser from "./hooks/useUser";
import { UserRole } from "./types/user";
import { Loading } from "./components/common/loading";

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
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      if (!auth) {
        navigate("/auth", { replace: true });
      } else if (
        user &&
        requireServiceProviderApproval &&
        user.role === UserRole.ServiceProvider &&
        !user.isApproved
      ) {
        navigate("/approval-pending", { replace: true });
      } else if (requiredRoles && user && !requiredRoles.includes(user.role)) {
        navigate("/", { replace: true });
      }
    });
  }, [auth, user, requireServiceProviderApproval, requiredRoles, navigate]);

  if (!user || isPending) {
    return <Loading />;
  }

  return <>{children}</>;
};

export default RequireAuth;
