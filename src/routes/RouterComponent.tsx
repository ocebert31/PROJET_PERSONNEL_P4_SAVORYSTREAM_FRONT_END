import { Route, Routes } from "react-router-dom";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import SauceDetail from "../pages/SauceDetailPage";
import ProtectedAdminRoute from "./Guards/ProtectedAdminRoute";
import CreateSaucePage from "../pages/CreateSaucePage";
import MentionsLegalesPage from "../pages/MentionsLegalesPage";
import TermsOfSalePage from "../pages/TermsOfSalePage";
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage";
import CookiesPolicyPage from "../pages/CookiesPolicyPage";

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
        <Route path="/dashboard/sauces/create" element={<CreateSaucePage />} />
      </Route>
    </Routes>
  );
};

export default RouterComponent;
