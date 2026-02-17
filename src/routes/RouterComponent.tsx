import { Route, Routes } from "react-router-dom";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import SauceDetail from "../pages/SauceDetailPage";

function RouterComponent () {
  return (
    <Routes>
      <Route path="/register" element={<RegisterPage/>} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/" element={<HomePage/>} />
      <Route path="/sauce/:id" element={<SauceDetail/>} />
    </Routes>
  );
};

export default RouterComponent;
