import { Route, Routes } from "react-router-dom";
import RequireAuth from "./RequireAuth";
import { HomePage } from "./pages/homePage";
import { Layout } from "./pages/layout";
import { LoginPage } from "./pages/loginPage";
import { RegisterPage } from "./pages/registerPage";
import { ServiceProviderPage } from "./pages/serviceProviderPage";
import { UserPage } from "./pages/userPage";
import { ServiceProviderBookingPage } from "./pages/serviceProviderBookingPage";
import { AdminDashboard } from "./pages/adminDashboardPage";
import { ApprovalPendingPage } from "./pages/approvalPendingPage";
import { UserRole } from "./types/user";
import { PostDetailPage } from "./pages/postDetailPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="auth" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route
          path="home"
          element={
            <RequireAuth>
              <HomePage />
            </RequireAuth>
          }
        />
        <Route
          path="serviceproviders"
          element={
            <RequireAuth>
              <ServiceProviderPage />
            </RequireAuth>
          }
        />
        <Route 
          path="serviceproviders/services/:id/booking" 
          element={
              <RequireAuth>
                <ServiceProviderBookingPage />
              </RequireAuth>
          } 
        />

        <Route
          path="user"
          element={
            <RequireAuth>
              <UserPage />
            </RequireAuth>
          }
        />
        <Route
          path="admin"
          element={
            <RequireAuth requiredRoles={[UserRole.Admin]}>
              <AdminDashboard />
            </RequireAuth>
          }
        />
        <Route path="approval-pending" element={<ApprovalPendingPage />} />

        <Route path="post/:post_id" element={
          <RequireAuth>
            <PostDetailPage />
          </RequireAuth>
        } />

        <Route path="*" element={<h1>Not Found</h1>} />
      </Route>
    </Routes>
  );
}

export default App;
