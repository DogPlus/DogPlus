import React from "react";
import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/homePage";
import { Layout } from "./pages/layout";
import { LoginPage } from "./pages/loginPage";
import { ServiceProviderPage } from "./pages/serviceProviderPage";
import { UserPage } from "./pages/userPage";
import { RegisterPage } from "./pages/registerPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="auth" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="home" element={<HomePage />} />
        <Route path="serviceproviders" element={<ServiceProviderPage />} />
        <Route path="user" element={<UserPage />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Route>
    </Routes>
  );
}

export default App;
