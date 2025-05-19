import React from "react";
import { useNavigate } from "react-router-dom";

const HeaderHome = () => {
  const navigate = useNavigate();
  return (
    <nav
      className="navbar navbar-expand navbar-light navbar-bg px-3"
      style={{ height: "80px" }}
    >
      {/* Phần bên trái - logo và tiêu đề */}
      <div className="d-flex align-items-center" style={{ gap: "15px" }}>
        {/* Logo */}
        <img
          src="/assets/images/logo/logo.png"
          alt="Logo"
          style={{
            height: "80px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        />

        {/* Tiêu đề */}
        <div>
          <span
            style={{ display: "block", fontSize: "20px" }}
            className="header-title"
          >
            ĐẢNG BỘ TRƯỜNG ĐẠI HỌC KỸ THUẬT - HẬU CẦN CAND
          </span>
          <span
            style={{ display: "block", fontSize: "20px" }}
            className="header-title"
          >
            PHẦN MỀM QUẢN LÝ HỒ SƠ ĐẢNG VIÊN
          </span>
        </div>
      </div>

      {/* Phần bên phải - điều khiển đăng nhập */}
      <div className="ms-auto d-flex align-items-center">
        <button
          className="btn btn-primary"
          onClick={() => navigate("/dang-nhap")}
          style={{
            borderRadius: "4px",
            padding: "8px 16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <i className="fas fa-sign-in-alt"></i>
          <span>Đăng nhập</span>
        </button>
      </div>
    </nav>
  );
};

export default HeaderHome;
