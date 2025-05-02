import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [fullname, setFullname] = useState("");
  const [role, setRole] = useState("");
  const [activePath, setActivePath] = useState("");

  useEffect(() => {
    // Cập nhật active path khi location thay đổi
    setActivePath(location.pathname);

    // Kiểm tra token, nếu không có thì chuyển hướng về trang login
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/dang-nhap");
    } else {
      // Lấy fullname và role từ localStorage
      setFullname(localStorage.getItem("fullname") || "Người dùng");
      setRole(localStorage.getItem("role") || "Chưa xác định");
    }
  }, [navigate, location]);

  const handleLogout = () => {
    // Xóa tất cả dữ liệu trong localStorage
    localStorage.clear();
    // Chuyển hướng về trang đăng nhập
    navigate("/dang-nhap");
  };

  // Hàm kiểm tra active menu
  const isActive = (path) => {
    return activePath === path ? "active" : "";
  };

  return (
    <nav id="sidebar" className="sidebar js-sidebar">
      <div className="sidebar-content js-simplebar p-2">
        <a className="sidebar-brand d-block text-center" onClick={() => navigate("/")}>
          <img className="logo-sidebar"
            src="/assets/images/logo/logo.png"
            alt="Logo"
          />
        </a>

        <ul className="sidebar-nav">
          <li className="sidebar-item">
            <a className="sidebar-link sidebar-link-static">
              <i className="fa-regular fa-user"></i>
              <span className="align-middle read-only-text">{fullname}</span>
            </a>
          </li>

          <li className="sidebar-item">
            <a className="sidebar-link sidebar-link-static">
              <i className="fa-solid fa-user-gear"></i>
              <span className="align-middle read-only-text">{role}</span>
            </a>
          </li>

          <hr />
          <li className={`sidebar-item ${isActive("/")}`}>
            <a className="sidebar-link" onClick={() => navigate("/")}>
            <i className="fa-solid fa-home"></i>
              <span className="align-middle">Trang chủ</span>
            </a>
          </li>

          <li className={`sidebar-item ${isActive("/quan-ly-dang-vien")}`}>
            <a className="sidebar-link" onClick={() => navigate("/quan-ly-dang-vien")}>
            <i className="fa-solid fa-user-tie"></i>
              <span className="align-middle">Quản lý Đảng viên</span>
            </a>
          </li>

          <li className={`sidebar-item ${isActive("/quan-ly-ho-so")}`}>
            <a className="sidebar-link" onClick={() => navigate("/quan-ly-ho-so")}>
            <i className="fa-solid fa-folder-open"></i>
              <span className="align-middle">Quản lý hồ sơ Đảng</span>
            </a>
          </li>

          <li className={`sidebar-item ${isActive("/quan-ly-sinh-hoat")}`}>
            <a className="sidebar-link" onClick={() => navigate("/quan-ly-sinh-hoat")}>
           <i className="fa-solid fa-calendar-check"></i>
              <span className="align-middle">Quản lý sinh hoạt Đảng</span>
            </a>
          </li>

          {/* <li className={`sidebar-item ${isActive("/quan-ly-ky-dang-phi")}`}>
            <a className="sidebar-link" onClick={() => navigate("/quan-ly-ky-dang-phi")}>
            <i className="fa-regular fa-credit-card"></i>
              <span className="align-middle">Quản lý Đảng phí</span>
            </a>
          </li> */}

          <li className={`sidebar-item ${isActive("/quan-ly-dang-phi")}`}>
    <a className="sidebar-link" onClick={() => navigate("/quan-ly-dang-phi")}>
      <i className="fa-solid fa-money-bill"></i>
      <span className="align-middle">Quản lý Đảng phí</span>
    </a>
  </li>

  <li className={`sidebar-item ${isActive("/quan-ly-ky-dang-phi")}`}>
    <a className="sidebar-link" onClick={() => navigate("/quan-ly-ky-dang-phi")}>
      <i className="fa-solid fa-calendar-alt"></i>
      <span className="align-middle">Quản lý kỳ Đảng phí</span>
    </a>
  </li>

          <li className={`sidebar-item ${isActive("/quan-ly-chi-bo")}`}>
            <a className="sidebar-link" onClick={() => navigate("/quan-ly-chi-bo")}>
            <i className="fa-solid fa-users"></i>
              <span className="align-middle">Quản lý chi bộ</span>
            </a>
          </li>

          <li className={`sidebar-item ${isActive("/quan-ly-tin-tuc")}`}>
            <a className="sidebar-link" onClick={() => navigate("/quan-ly-tin-tuc")}>
            <i className="fa-regular fa-newspaper"></i>
              <span className="align-middle">Quản lý tin tức</span>
            </a>
          </li>

          <li className={`sidebar-item ${isActive("/bao-cao-thong-ke")}`}>
            <a className="sidebar-link" onClick={() => navigate("/bao-cao-thong-ke")}>
            <i className="fa-solid fa-chart-bar"></i>
              <span className="align-middle">Báo cáo, thống kê</span>
            </a>
          </li>

          <li className={`sidebar-item ${isActive("/sao-luu-khoi-phuc")}`}>
            <a className="sidebar-link" onClick={() => navigate("/sao-luu-khoi-phuc")}>
            <i className="fa-solid fa-database"></i>
              <span className="align-middle">Sao lưu, khôi phục</span>
            </a>
          </li>

          <li className="sidebar-item">
            <a className="sidebar-link" onClick={handleLogout}>
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
              <span className="align-middle">Đăng xuất</span>
            </a>
          </li>
        </ul>
        
      </div>
    </nav>
  );
};

export default Sidebar;
