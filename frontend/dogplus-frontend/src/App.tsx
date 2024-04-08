import { Route, Routes } from "react-router-dom";
import RequireAuth from "./RequireAuth";
import { HomePage } from "./pages/homePage";
import { Layout } from "./pages/layout";
import { LoginPage } from "./pages/loginPage";
import { RegisterPage } from "./pages/registerPage";
import { ServiceProviderPage } from "./pages/serviceProviderPage";
import { UserPage } from "./pages/userPage";
import { AdminDashboard } from "./pages/adminDashboardPage";

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
          path="user"
          element={
            <RequireAuth>
              <UserPage />
            </RequireAuth>
          }
        />
        <Route path="admin" element={<AdminDashboard />} />

        <Route path="*" element={<h1>Not Found</h1>} />
      </Route>
    </Routes>
  );
}

export default App;
