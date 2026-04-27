import { Navigate, Route, Routes } from "react-router-dom";
import RegisterPage from "../pages/registerPage";
import LoginPage from "../pages/loginPage";
import HomePage from "../pages/homePage";
import SauceDetail from "../pages/sauceDetailPage";
import ProtectedAdminRoute from "./guards/protectedAdminRoute";
import CreateSaucePage from "../pages/dashboard/sauce/createSaucePage";
import EditSaucePage from "../pages/dashboard/sauce/editSaucePage";
import MentionsLegalesPage from "../pages/mentionsLegalesPage";
import TermsOfSalePage from "../pages/termsOfSalePage";
import PrivacyPolicyPage from "../pages/privacyPolicyPage";
import CookiesPolicyPage from "../pages/cookiesPolicyPage";
import AdminPlaceholderPage from "../pages/dashboard/adminPlaceholderPage";
import DashboardSaucesPage from "../pages/dashboard/sauce/dashboardSaucesPage";
import DashboardPage from "../pages/dashboard/dashboardPage";

function RouterComponent () {
  return (
    <Routes>
      <Route path="/register" element={<RegisterPage/>} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/" element={<HomePage/>} />
      <Route path="/sauce/:id" element={<SauceDetail/>} />
      <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
      <Route path="/cgv" element={<TermsOfSalePage />} />
      <Route path="/confidentialite" element={<PrivacyPolicyPage />} />
      <Route path="/cookies" element={<CookiesPolicyPage />} />
      <Route element={<ProtectedAdminRoute />}>
        <Route path="/dashboard" element={<DashboardPage />}>
          <Route index element={<Navigate to="sauces" replace />} />
          <Route path="sauces" element={<DashboardSaucesPage />} />
          <Route path="sauces/create" element={<CreateSaucePage />} />
          <Route path="sauces/:id/edit" element={<EditSaucePage />} />
          <Route path="categories" element={<AdminPlaceholderPage sectionName="Catégories" />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default RouterComponent;
