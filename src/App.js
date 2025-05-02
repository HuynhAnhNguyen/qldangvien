import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NewPage from "./pages/NewPage";
import QuanLyTinTuc from "./pages/QuanLyTinTuc";
import MemberManagementPage from "./pages/MemberManagementPage";
import QuanLyChiBo from "./pages/QuanLyChiBo";
import QuanLyDangVien from "./pages/QuanLyDangVien";
import QuanLyHoSo from "./pages/QuanLyHoSo";



const App = () => {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trang-chu" element={<Home />} />
          <Route path="/dang-nhap" element={<Login />} />
          <Route path="/quan-ly-tin-tuc" element={<QuanLyTinTuc />} />
          <Route path="/quan-ly-dang-vien" element={<QuanLyDangVien />} />
          <Route path="/quan-ly-chi-bo" element={<QuanLyChiBo />} />
          <Route path="/quan-ly-ho-so" element={<QuanLyHoSo />} />
        </Routes>
    </Router>
  );
};

export default App;
