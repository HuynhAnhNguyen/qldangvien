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
import QuanLyKyDangPhi from "./pages/QuanLyKyDangPhi";
import QuanLyDangPhi from "./pages/QuanLyDangPhi";
import SaoLuuKhoiPhuc from "./pages/SaoLuuKhoiPhuc";
import QuanLyPheDuyet from "./pages/QuanLyPheDuyet";
import QuanLySinhHoatDang from "./pages/QuanLySinhHoatDang";



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
          <Route path="/quan-ly-ky-dang-phi" element={<QuanLyKyDangPhi />} />
          <Route path="/quan-ly-dang-phi" element={<QuanLyDangPhi />} />
          <Route path="/sao-luu-khoi-phuc" element={<SaoLuuKhoiPhuc />} />
          <Route path="/quan-ly-phe-duyet" element={<QuanLyPheDuyet />} />
          <Route path="/quan-ly-sinh-hoat" element={<QuanLySinhHoatDang />} />
        </Routes>
    </Router>
  );
};

export default App;
