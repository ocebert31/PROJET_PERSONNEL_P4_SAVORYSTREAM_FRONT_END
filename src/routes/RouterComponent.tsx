import { Route, Routes } from "react-router-dom";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import SauceDetail from "../pages/SauceDetailPage";
import ProtectedAdminRoute from "./Guards/ProtectedAdminRoute";
import CreateSaucePage from "../pages/CreateSaucePage";

function RouterComponent () {
  return (
    <Routes>
      <Route path="/register" element={<RegisterPage/>} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/" element={<HomePage/>} />
      <Route path="/sauce/:id" element={<SauceDetail/>} />
      <Route element={<ProtectedAdminRoute />}>
        <Route path="/dashboard/sauces/create" element={<CreateSaucePage />} />
      </Route>
    </Routes>
  );
};

export default RouterComponent;
