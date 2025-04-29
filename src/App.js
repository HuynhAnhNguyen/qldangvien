import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NewPage from "./pages/NewPage";
import NewsManagementPage from "./pages/NewsManagementPage";
import MemberManagementPage from "./pages/MemberManagementPage";
import QuanLyChiBo from "./pages/QuanLyChiBo";



const App = () => {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trang-chu" element={<Home />} />
          <Route path="/dang-nhap" element={<Login />} />
          <Route path="/quan-ly-tin-tuc" element={<NewsManagementPage />} />
          {/* <Route path="/quan-ly-dang-vien" element={<MemberManagementPage />} /> */}
          <Route path="/quan-ly-chi-bo" element={<QuanLyChiBo />} />
        </Routes>
    </Router>
  );
};

export default App;
