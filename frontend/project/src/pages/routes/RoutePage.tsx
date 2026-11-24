import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from "../RegisterPage";
import LoginPage from "../loginPage";
import HomePage from "../Home/HomePage";
import NavBar from "../Navigation/NavBar";

export default function RoutePage() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}
