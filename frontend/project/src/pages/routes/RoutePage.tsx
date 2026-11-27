import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from "../User/RegisterPage";
import LoginPage from "../User/loginPage";
import HomePage from "../Home/HomePage";
import NavBar from "../Navigation/NavBar";
import UserInfoPage from "../User/UserInfoPage";
import UpdateUserPage from "../User/UpdateUserPage";
import BooksPage from "../Book/BooksPage";
import BookInfoPage from "../Book/BookInfoPage";
import BooksUser from "../Book/BooksUser";

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
        <Route path="/books" element={<BooksPage />} />
        <Route path="/book/:id" element={<BookInfoPage />} />
        <Route path="/books/user" element={<BooksUser />} />
      </Routes>
    </Router>
  );
}
