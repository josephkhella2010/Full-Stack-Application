import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from "../RegisterPage";
import LoginPage from "../loginPage";
import HomePage from "../Home/HomePage";
import NavBar from "../Navigation/NavBar";
import UserInfoPage from "../UserInfoPage";
import UpdateUserPage from "../UpdateUserPage";

export default function RoutePage() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/userinfo/:id" element={<UserInfoPage />} />
        <Route path="/update-user/:id" element={<UpdateUserPage />} />
      </Routes>
    </Router>
  );
}
